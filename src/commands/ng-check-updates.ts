#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { NgCompatibilityUpdater, UpdateResult } from '../utils/NgCompatibilityUpdater';
import * as fs from 'fs-extra';
import * as path from 'path';

const program = new Command();

program
  .name('ng-check-updates')
  .description('Check and update dependencies for Angular compatibility (similar to npm-check-updates)')
  .version('1.0.0')
  .argument('[angular-version]', 'Target Angular version (e.g., 18, 19, 20)', '18')
  .option('-u, --upgrade', 'Apply updates to package.json (like ncu -u)')
  .option('-d, --dev', 'Include devDependencies')
  .option('-a, --angular-only', 'Only check Angular ecosystem packages')
  .option('-s, --strategy <type>', 'Update strategy: conservative|aggressive', 'conservative')
  .option('-t, --target <version>', 'Specific Angular version to target')
  .option('--dry-run', 'Show what would be updated without making changes')
  .option('--format <type>', 'Output format: table|json|summary', 'table')
  .option('-f, --filter <pattern>', 'Filter packages by pattern (regex)')
  .option('--exclude <pattern>', 'Exclude packages by pattern (regex)')
  .action(async (angularVersion: string, options) => {
    try {
      const targetVersion = options.target || angularVersion;
      const projectPath = process.cwd();
      
      console.log(chalk.cyan(`\n🔍 Checking Angular ${targetVersion} compatibility...\n`));

      // Validate Angular version
      if (!isValidAngularVersion(targetVersion)) {
        console.error(chalk.red(`❌ Invalid Angular version: ${targetVersion}`));
        console.error(chalk.gray('Supported versions: 12, 13, 14, 15, 16, 17, 18, 19, 20'));
        process.exit(1);
      }

      // Check if package.json exists
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (!await fs.pathExists(packageJsonPath)) {
        console.error(chalk.red('❌ No package.json found in current directory'));
        process.exit(1);
      }

      // Create updater instance
      const updater = new NgCompatibilityUpdater(targetVersion);
      
      // Configure update options
      const updateOptions = {
        dryRun: options.dryRun || !options.upgrade,
        includeDevDependencies: options.dev,
        onlyAngularEcosystem: options.angularOnly,
        updateStrategy: options.strategy,
        filter: options.filter ? new RegExp(options.filter) : undefined,
        exclude: options.exclude ? new RegExp(options.exclude) : undefined
      };

      console.log(chalk.gray('Options:'));
      console.log(chalk.gray(`  Angular version: ${targetVersion}`));
      console.log(chalk.gray(`  Strategy: ${options.strategy}`));
      console.log(chalk.gray(`  Include dev deps: ${options.dev ? 'yes' : 'no'}`));
      console.log(chalk.gray(`  Angular only: ${options.angularOnly ? 'yes' : 'no'}`));
      console.log(chalk.gray(`  Apply updates: ${options.upgrade ? 'yes' : 'no'}`));
      console.log('');

      // Run compatibility check
      const result = await updater.checkAndUpdate(projectPath, updateOptions);

      // Display results
      displayResults(result, targetVersion, options);

      if (result.updates.length > 0 && !options.upgrade && !options.dryRun) {
        console.log(chalk.cyan('\n💡 Run with -u to apply updates to package.json'));
        console.log(chalk.gray('   Example: ng-check-updates 18 -u'));
      }

      if (options.upgrade && result.updates.length > 0) {
        console.log(chalk.green('\n✅ Dependencies updated! Run npm install to install new versions.'));
      }

    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

// Add interactive mode
program
  .command('interactive')
  .alias('i')
  .description('Interactive mode to select which updates to apply')
  .argument('[angular-version]', 'Target Angular version', '18')
  .option('-d, --dev', 'Include devDependencies')
  .option('-a, --angular-only', 'Only check Angular ecosystem packages')
  .action(async (angularVersion: string, options) => {
    try {
      const projectPath = process.cwd();
      console.log(chalk.cyan(`\n🔍 Interactive Angular ${angularVersion} compatibility check...\n`));

      const updater = new NgCompatibilityUpdater(angularVersion);
      const result = await updater.checkAndUpdate(projectPath, {
        dryRun: true,
        includeDevDependencies: options.dev,
        onlyAngularEcosystem: options.angularOnly,
        updateStrategy: 'conservative'
      });

      if (result.updates.length === 0) {
        console.log(chalk.green('✅ All dependencies are already compatible!'));
        return;
      }

      console.log(chalk.yellow('📦 Found updates:'));
      
      // Group and display updates
      const { createPromptModule } = await import('inquirer');
      const prompt = createPromptModule();

      const choices = result.updates.map(update => ({
        name: `${update.name}: ${update.currentVersion} → ${update.compatibleVersion} ${update.notes ? `(${update.notes})` : ''}`,
        value: update.name,
        checked: update.required
      }));

      const { selectedUpdates } = await prompt({
        type: 'checkbox',
        name: 'selectedUpdates',
        message: 'Select packages to update:',
        choices,
        pageSize: 15
      });

      if (selectedUpdates.length === 0) {
        console.log(chalk.gray('No updates selected.'));
        return;
      }

      // Apply selected updates
      const filteredResult = {
        ...result,
        updates: result.updates.filter(u => selectedUpdates.includes(u.name))
      };

      await applySelectedUpdates(projectPath, filteredResult);
      console.log(chalk.green(`\n✅ Updated ${selectedUpdates.length} packages!`));

    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

// Add doctor command for health check
program
  .command('doctor')
  .description('Comprehensive Angular dependency health check')
  .argument('[angular-version]', 'Target Angular version', '18')
  .action(async (angularVersion: string) => {
    try {
      const projectPath = process.cwd();
      console.log(chalk.cyan(`\n🏥 Angular ${angularVersion} Dependency Health Check\n`));

      const updater = new NgCompatibilityUpdater(angularVersion);
      const result = await updater.checkAndUpdate(projectPath, {
        dryRun: true,
        includeDevDependencies: true,
        onlyAngularEcosystem: false,
        updateStrategy: 'aggressive'
      });

      // Health score calculation
      const totalDeps = await getTotalDependencyCount(projectPath);
      const healthScore = calculateHealthScore(result, totalDeps);

      console.log(chalk.bold('🎯 HEALTH SCORE: ') + getHealthScoreDisplay(healthScore));
      console.log('');

      // Detailed breakdown
      displayHealthBreakdown(result, totalDeps);

      if (result.deprecated.length > 0) {
        console.log(chalk.red('\n🗑️  DEPRECATED PACKAGES:'));
        result.deprecated.forEach(pkg => {
          console.log(chalk.red(`  ❌ ${pkg}`));
        });
      }

      // Recommendations
      console.log(chalk.cyan('\n💡 RECOMMENDATIONS:'));
      if (result.criticalUpdates > 0) {
        console.log(chalk.red(`  🚨 ${result.criticalUpdates} critical updates need immediate attention`));
      }
      if (result.deprecated.length > 0) {
        console.log(chalk.yellow(`  📦 ${result.deprecated.length} deprecated packages should be replaced`));
      }
      if (healthScore >= 80) {
        console.log(chalk.green('  ✅ Dependencies are in good shape!'));
      } else if (healthScore >= 60) {
        console.log(chalk.yellow('  ⚠️  Some maintenance required'));
      } else {
        console.log(chalk.red('  🔧 Significant updates needed'));
      }

    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

function displayResults(result: UpdateResult, targetVersion: string, options: any) {
  if (options.format === 'json') {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (result.updates.length === 0) {
    console.log(chalk.green(`✅ All dependencies are compatible with Angular ${targetVersion}`));
    return;
  }

  if (options.format === 'summary') {
    console.log(chalk.yellow(`📊 ${result.totalUpdates} updates available (${result.criticalUpdates} critical)`));
    return;
  }

  // Table format (default)
  console.log(chalk.bold('📦 DEPENDENCY UPDATES:'));
  console.log('');

  const maxNameLength = Math.max(...result.updates.map(u => u.name.length), 20);
  const maxCurrentLength = Math.max(...result.updates.map(u => u.currentVersion.length), 10);
  
  // Header
  console.log(chalk.gray(
    'Package'.padEnd(maxNameLength) + 
    'Current'.padEnd(maxCurrentLength + 3) + 
    'Compatible'.padEnd(15) + 
    'Type'.padEnd(8) + 
    'Notes'
  ));
  console.log(chalk.gray('─'.repeat(maxNameLength + maxCurrentLength + 40)));

  // Updates
  result.updates.forEach(update => {
    const typeColor = getUpdateTypeColor(update.updateType);
    const requiredIcon = update.required ? '🔴' : '';
    
    console.log(
      chalk.white(update.name.padEnd(maxNameLength)) +
      chalk.gray(update.currentVersion.padEnd(maxCurrentLength + 3)) +
      chalk.green(update.compatibleVersion.padEnd(15)) +
      typeColor(update.updateType.padEnd(8)) +
      chalk.gray(update.notes || '') +
      requiredIcon
    );
  });

  if (result.warnings.length > 0) {
    console.log(chalk.yellow('\n⚠️  WARNINGS:'));
    result.warnings.forEach(warning => {
      console.log(chalk.yellow(`  ${warning}`));
    });
  }
}

function getUpdateTypeColor(type: string): (text: string) => string {
  const colors = {
    major: chalk.red,
    minor: chalk.yellow,
    patch: chalk.green,
    compatible: chalk.blue,
    deprecated: chalk.gray
  };
  return colors[type as keyof typeof colors] || chalk.white;
}

function isValidAngularVersion(version: string): boolean {
  const validVersions = ['12', '13', '14', '15', '16', '17', '18', '19', '20'];
  return validVersions.includes(version);
}

async function applySelectedUpdates(projectPath: string, result: UpdateResult): Promise<void> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);

  for (const update of result.updates) {
    if (update.updateType === 'deprecated') {
      // Remove deprecated packages
      if (packageJson.dependencies?.[update.name]) {
        delete packageJson.dependencies[update.name];
      }
      if (packageJson.devDependencies?.[update.name]) {
        delete packageJson.devDependencies[update.name];
      }
    } else {
      // Update to compatible version
      if (packageJson.dependencies?.[update.name]) {
        packageJson.dependencies[update.name] = update.compatibleVersion;
      }
      if (packageJson.devDependencies?.[update.name]) {
        packageJson.devDependencies[update.name] = update.compatibleVersion;
      }
    }
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function getTotalDependencyCount(projectPath: string): Promise<number> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  
  const depCount = Object.keys(packageJson.dependencies || {}).length;
  const devDepCount = Object.keys(packageJson.devDependencies || {}).length;
  
  return depCount + devDepCount;
}

function calculateHealthScore(result: UpdateResult, totalDeps: number): number {
  if (totalDeps === 0) return 100;
  
  const upToDateDeps = totalDeps - result.totalUpdates;
  const deprecatedPenalty = result.deprecated.length * 15;
  const criticalPenalty = result.criticalUpdates * 10;
  const minorPenalty = (result.totalUpdates - result.criticalUpdates) * 2;
  
  const baseScore = (upToDateDeps / totalDeps) * 100;
  const finalScore = Math.max(0, baseScore - deprecatedPenalty - criticalPenalty - minorPenalty);
  
  return Math.round(finalScore);
}

function getHealthScoreDisplay(score: number): string {
  if (score >= 90) return chalk.green(`${score}/100 🟢 EXCELLENT`);
  if (score >= 80) return chalk.green(`${score}/100 🟢 GOOD`);
  if (score >= 70) return chalk.yellow(`${score}/100 🟡 FAIR`);
  if (score >= 60) return chalk.yellow(`${score}/100 🟡 NEEDS ATTENTION`);
  return chalk.red(`${score}/100 🔴 POOR`);
}

function displayHealthBreakdown(result: UpdateResult, totalDeps: number): void {
  console.log(chalk.bold('📋 BREAKDOWN:'));
  console.log(`  Total dependencies: ${totalDeps}`);
  console.log(`  Up to date: ${chalk.green(totalDeps - result.totalUpdates)}`);
  console.log(`  Need updates: ${chalk.yellow(result.totalUpdates)}`);
  console.log(`  Critical updates: ${chalk.red(result.criticalUpdates)}`);
  console.log(`  Deprecated: ${chalk.gray(result.deprecated.length)}`);
}

if (require.main === module) {
  program.parse();
}

export { program };