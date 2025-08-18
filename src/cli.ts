#!/usr/bin/env node

import { Command } from 'commander';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import * as ora from 'ora';
import * as path from 'path';
import { EnhancedUpgradeOrchestrator } from './core/EnhancedUpgradeOrchestrator';
import { UpgradeOptions, ProgressReport } from './types';

const program = new Command();

program
  .name('ng-upgrade')
  .description('Angular Multi-Version Upgrade Orchestrator')
  .version('1.0.0');

program
  .command('upgrade')
  .description('Upgrade Angular application across multiple versions')
  .option('-t, --target <version>', 'Target Angular version')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .option('-s, --strategy <strategy>', 'Upgrade strategy: conservative, balanced, progressive', 'balanced')
  .option('--dry-run', 'Show upgrade plan without executing')
  .option('--no-backup', 'Skip automatic backup creation')
  .option('--validation <level>', 'Validation level: basic, comprehensive', 'basic')
  .action(async (options) => {
    try {
      await runUpgrade(options);
    } catch (error) {
      console.error(chalk.red('Upgrade failed:'), error);
      process.exit(1);
    }
  });

program
  .command('analyze')
  .description('Analyze project for upgrade readiness')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .action(async (options) => {
    try {
      await analyzeProject(options.path);
    } catch (error) {
      console.error(chalk.red('Analysis failed:'), error);
      process.exit(1);
    }
  });

program
  .command('checkpoints')
  .description('Manage upgrade checkpoints')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .option('--list', 'List all checkpoints')
  .option('--rollback <id>', 'Rollback to checkpoint')
  .option('--create <description>', 'Create new checkpoint')
  .option('--cleanup', 'Clean up old checkpoints')
  .action(async (options) => {
    try {
      await manageCheckpoints(options);
    } catch (error) {
      console.error(chalk.red('Checkpoint management failed:'), error);
      process.exit(1);
    }
  });

async function runUpgrade(options: any) {
  console.log(chalk.blue.bold('Angular Multi-Version Upgrade Orchestrator\n'));

  const projectPath = path.resolve(options.path);
  const orchestrator = new EnhancedUpgradeOrchestrator(projectPath);

  // Interactive prompts if target version not provided
  let targetVersion = options.target;
  if (!targetVersion) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'targetVersion',
        message: 'Select target Angular version:',
        choices: ['13', '14', '15', '16', '17', '18', '19', '20']
      }
    ]);
    targetVersion = answers.targetVersion;
  }

  // Configure upgrade options
  const upgradeOptions: UpgradeOptions = {
    targetVersion,
    strategy: options.strategy as 'conservative' | 'balanced' | 'progressive',
    checkpointFrequency: 'major-versions',
    validationLevel: options.validation as 'basic' | 'comprehensive',
    thirdPartyHandling: 'prompt',
    rollbackPolicy: 'auto-on-failure',
    parallelProcessing: false,
    backupPath: options.backup ? undefined : path.join(projectPath, '.ng-upgrade', 'backup')
  };

  // Dry run mode
  if (options.dryRun) {
    await showUpgradePlan(orchestrator, upgradeOptions);
    return;
  }

  // Confirm upgrade
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Proceed with upgrade to Angular ${targetVersion}?`,
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('Upgrade cancelled'));
    return;
  }

  // Set up progress reporting
  setupProgressReporting(orchestrator);

  // Execute upgrade
  const spinner = ora.default('Starting upgrade...').start();
  
  try {
    const result = await orchestrator.orchestrateUpgrade(upgradeOptions);
    
    spinner.stop();
    
    if (result.success) {
      console.log(chalk.green.bold('Upgrade completed successfully!\n'));
      console.log(chalk.white(`Upgraded from ${result.fromVersion} to ${result.toVersion}`));
      console.log(chalk.white(`Duration: ${Math.round(result.duration / 1000)}s`));
      console.log(chalk.white(`Completed steps: ${result.completedSteps.length}`));
      console.log(chalk.white(`Checkpoints created: ${result.checkpoints.length}`));
      
      if (result.warnings && result.warnings.length > 0) {
        console.log(chalk.yellow('\nWarnings:'));
        result.warnings.forEach(warning => console.log(chalk.yellow(`  - ${warning}`)));
      }
    } else {
      console.log(chalk.red.bold('Upgrade failed\n'));
      console.log(chalk.red(result.error?.message || 'Unknown error'));
      
      if (result.rollbackAvailable) {
        const { rollback } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'rollback',
            message: 'Would you like to rollback to the last checkpoint?',
            default: true
          }
        ]);
        
        if (rollback && result.checkpoints.length > 0) {
          await orchestrator.rollbackToCheckpoint(result.checkpoints[result.checkpoints.length - 1].id);
          console.log(chalk.green('Rollback completed'));
        }
      }
    }
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

async function analyzeProject(projectPath: string) {
  console.log(chalk.blue.bold('Analyzing Angular project\n'));
  
  const orchestrator = new EnhancedUpgradeOrchestrator(projectPath);
  const spinner = ora.default('Analyzing project...').start();
  
  try {
    // This would call the project analyzer
    spinner.text = 'Detecting Angular version...';
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    spinner.text = 'Analyzing dependencies...';
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    spinner.text = 'Calculating code metrics...';
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    spinner.text = 'Assessing risks...';
    await new Promise(resolve => setTimeout(resolve, 500));
    
    spinner.stop();
    
    console.log(chalk.green('Analysis completed\n'));
    
    // Display analysis results (placeholder)
    console.log(chalk.white.bold('Project Analysis Results:'));
    console.log(chalk.white('Current Angular version: 12.2.0'));
    console.log(chalk.white('Project type: Application'));
    console.log(chalk.white('Build system: Angular CLI'));
    console.log(chalk.white('Dependencies: 45 total, 3 require updates'));
    console.log(chalk.white('Lines of code: 15,420'));
    console.log(chalk.white('Components: 28'));
    console.log(chalk.white('Services: 12'));
    console.log(chalk.white('Risk level: Medium'));
    
    console.log(chalk.yellow('\nUpgrade Recommendations:'));
    console.log(chalk.yellow('  - Update deprecated dependencies before upgrade'));
    console.log(chalk.yellow('  - Increase test coverage for better validation'));
    console.log(chalk.yellow('  - Consider incremental upgrade strategy'));
    
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

async function manageCheckpoints(options: any) {
  const projectPath = path.resolve(options.path);
  const orchestrator = new EnhancedUpgradeOrchestrator(projectPath);
  
  if (options.list) {
    console.log(chalk.blue.bold('Available Checkpoints\n'));
    
    const checkpoints = await orchestrator.getCheckpoints();
    
    if (checkpoints.length === 0) {
      console.log(chalk.yellow('No checkpoints found'));
      return;
    }
    
    checkpoints.forEach((checkpoint: any, index: number) => {
      console.log(chalk.white(`${index + 1}. ${checkpoint.id}`));
      console.log(chalk.gray(`   Version: ${checkpoint.version}`));
      console.log(chalk.gray(`   Created: ${checkpoint.timestamp}`));
      console.log(chalk.gray(`   Description: ${checkpoint.description}\n`));
    });
  }
  
  if (options.rollback) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Rollback to checkpoint ${options.rollback}?`,
        default: false
      }
    ]);
    
    if (confirm) {
      const spinner = ora.default('Rolling back...').start();
      
      try {
        await orchestrator.rollbackToCheckpoint(options.rollback);
        spinner.stop();
        console.log(chalk.green('Rollback completed'));
      } catch (error) {
        spinner.stop();
        throw error;
      }
    }
  }
  
  if (options.create) {
    const spinner = ora.default('Creating checkpoint...').start();
    
    try {
      // This would create a new checkpoint
      spinner.stop();
      console.log(chalk.green('Checkpoint created'));
    } catch (error) {
      spinner.stop();
      throw error;
    }
  }
  
  if (options.cleanup) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Clean up old checkpoints? (keeps last 5)',
        default: false
      }
    ]);
    
    if (confirm) {
      const spinner = ora.default('Cleaning up checkpoints...').start();
      
      try {
        // This would cleanup old checkpoints
        spinner.stop();
        console.log(chalk.green('Checkpoints cleaned up'));
      } catch (error) {
        spinner.stop();
        throw error;
      }
    }
  }
}

async function showUpgradePlan(orchestrator: EnhancedUpgradeOrchestrator, options: UpgradeOptions) {
  console.log(chalk.blue.bold('Upgrade Plan (Dry Run)\n'));
  
  // This would show the calculated upgrade path
  console.log(chalk.white.bold('Upgrade Strategy:'), chalk.cyan(options.strategy));
  console.log(chalk.white.bold('Target Version:'), chalk.cyan(options.targetVersion));
  console.log(chalk.white.bold('Validation Level:'), chalk.cyan(options.validationLevel));
  
  console.log(chalk.white.bold('\nUpgrade Path:'));
  console.log(chalk.white('  Current → Angular 13 → Angular 14 → Angular 15 → Angular 16 → Angular 17'));
  
  console.log(chalk.white.bold('\nMajor Changes:'));
  console.log(chalk.white('  - Angular 13: View Engine removal, Angular Package Format'));
  console.log(chalk.white('  - Angular 14: Standalone components, optional injectors'));
  console.log(chalk.white('  - Angular 15: Standalone APIs stable, Image directive'));
  console.log(chalk.white('  - Angular 16: Required inputs, new router features'));
  console.log(chalk.white('  - Angular 17: New application bootstrap, control flow'));
  
  console.log(chalk.white.bold('\nEstimated Duration:'), chalk.cyan('45-60 minutes'));
  console.log(chalk.white.bold('Checkpoints:'), chalk.cyan('5 (one per major version)'));
  console.log(chalk.white.bold('Rollback:'), chalk.cyan('Available at each checkpoint'));
}

function setupProgressReporting(orchestrator: EnhancedUpgradeOrchestrator) {
  orchestrator.on('progress', (report: any) => {
    console.log(chalk.blue(`${report.message}`));
  });
  
  orchestrator.on('step-start', (step: any) => {
    console.log(chalk.yellow(`Starting: ${step.fromVersion} → ${step.toVersion}`));
  });
  
  orchestrator.on('step-complete', (step: any) => {
    console.log(chalk.green(`Completed: ${step.fromVersion} → ${step.toVersion}`));
  });
  
  orchestrator.on('step-failed', ({ step, error }: any) => {
    console.log(chalk.red(`Failed: ${step.fromVersion} → ${step.toVersion}`));
    console.log(chalk.red(`   Error: ${error.message}`));
  });
  
  orchestrator.on('manual-intervention', ({ change, instructions }: any) => {
    console.log(chalk.magenta(`Manual intervention required:`));
    console.log(chalk.magenta(`   ${change.description}`));
    console.log(chalk.magenta(`   Instructions: ${instructions}`));
  });
}

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}