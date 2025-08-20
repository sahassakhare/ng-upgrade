#!/usr/bin/env node

const { NgCompatibilityUpdater } = require('../dist/utils/NgCompatibilityUpdater');
const chalk = require('chalk');
const path = require('path');

async function demoNgCheckUpdates() {
  console.log(chalk.cyan('\n🔍 Demo: Angular Compatibility Updater (ng-check-updates)'));
  console.log(chalk.gray('========================================================\n'));

  // Simulate a project with some dependencies
  const demoProject = {
    name: 'demo-angular-app',
    version: '1.0.0',
    dependencies: {
      '@angular/core': '^15.0.0',
      '@angular/common': '^15.0.0',
      '@angular/material': '^15.0.0',
      '@angular/cdk': '^15.0.0',
      '@ngrx/store': '^15.0.0',
      'primeng': '^15.0.0',
      '@angular/flex-layout': '^14.0.0', // Deprecated
      'rxjs': '~7.5.0'
    },
    devDependencies: {
      '@angular/cli': '^15.0.0',
      '@angular/compiler-cli': '^15.0.0',
      'typescript': '~4.8.0'
    }
  };

  console.log(chalk.yellow('📦 Current package.json:'));
  console.log(JSON.stringify(demoProject, null, 2));
  console.log('');

  try {
    // Demo for Angular 18 upgrade
    console.log(chalk.cyan('🎯 Checking compatibility for Angular 18...\n'));
    
    const updater = new NgCompatibilityUpdater('18');
    
    // Simulate the update check (we'll create a temp package.json)
    const fs = require('fs-extra');
    const os = require('os');
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ng-upgrade-demo-'));
    const tempPackageJson = path.join(tempDir, 'package.json');
    
    await fs.writeJson(tempPackageJson, demoProject, { spaces: 2 });
    
    const result = await updater.checkAndUpdate(tempDir, {
      dryRun: true, // Don't actually modify files in demo
      includeDevDependencies: true,
      onlyAngularEcosystem: false,
      updateStrategy: 'conservative'
    });

    // Display results
    console.log(chalk.green(`✅ Found ${result.totalUpdates} available updates`));
    console.log(chalk.red(`🚨 ${result.criticalUpdates} critical updates`));
    console.log(chalk.gray(`⚠️ ${result.deprecated.length} deprecated packages\n`));

    if (result.updates.length > 0) {
      console.log(chalk.bold('📋 AVAILABLE UPDATES:\n'));
      
      const maxNameLength = Math.max(...result.updates.map(u => u.name.length), 20);
      
      // Header
      console.log(chalk.gray(
        'Package'.padEnd(maxNameLength) + 
        'Current'.padEnd(12) + 
        'Compatible'.padEnd(15) + 
        'Type'.padEnd(8) + 
        'Notes'
      ));
      console.log(chalk.gray('─'.repeat(60)));

      // Updates
      result.updates.forEach(update => {
        const typeColor = getTypeColor(update.updateType);
        const requiredIcon = update.required ? ' 🔴' : '';
        
        console.log(
          chalk.white(update.name.padEnd(maxNameLength)) +
          chalk.gray(update.currentVersion.padEnd(12)) +
          chalk.green(update.compatibleVersion.padEnd(15)) +
          typeColor(update.updateType.padEnd(8)) +
          chalk.gray(update.notes || '') +
          requiredIcon
        );
      });
    }

    if (result.deprecated.length > 0) {
      console.log(chalk.red('\n🗑️  DEPRECATED PACKAGES:'));
      result.deprecated.forEach(pkg => {
        console.log(chalk.red(`  ❌ ${pkg}`));
      });
    }

    if (result.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  WARNINGS:'));
      result.warnings.forEach(warning => {
        console.log(chalk.yellow(`  ${warning}`));
      });
    }

    console.log(chalk.cyan('\n💡 This is what would happen with: ng-check-updates 18 -u'));
    console.log(chalk.gray('   (Use the real command in your Angular project)'));

    // Cleanup
    await fs.remove(tempDir);

  } catch (error) {
    console.error(chalk.red(`❌ Demo failed: ${error.message}`));
  }
}

function getTypeColor(type) {
  const colors = {
    major: chalk.red,
    minor: chalk.yellow,
    patch: chalk.green,
    compatible: chalk.blue,
    deprecated: chalk.gray
  };
  return colors[type] || chalk.white;
}

// Run demo if called directly
if (require.main === module) {
  demoNgCheckUpdates().catch(console.error);
}

module.exports = { demoNgCheckUpdates };