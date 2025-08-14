#!/usr/bin/env node

/**
 * Example: Basic Angular Upgrade
 * 
 * This example demonstrates a basic upgrade from Angular 14 to Angular 17
 * using the ng-upgrade orchestrator programmatically.
 */

const { UpgradeOrchestrator } = require('../dist/index.js');
const path = require('path');

async function basicUpgradeExample() {
  console.log('🚀 Basic Angular Upgrade Example\n');

  const projectPath = process.argv[2] || process.cwd();
  const orchestrator = new UpgradeOrchestrator(projectPath);

  // Set up progress monitoring
  orchestrator.on('progress', (report) => {
    console.log(`📋 ${report.message}`);
  });

  orchestrator.on('step-start', (step) => {
    console.log(`🔄 Starting: Angular ${step.fromVersion} → ${step.toVersion}`);
  });

  orchestrator.on('step-complete', (step) => {
    console.log(`✅ Completed: Angular ${step.fromVersion} → ${step.toVersion}`);
  });

  orchestrator.on('step-failed', ({ step, error }) => {
    console.log(`❌ Failed: Angular ${step.fromVersion} → ${step.toVersion}`);
    console.log(`   Error: ${error.message}`);
  });

  // Configure upgrade options
  const upgradeOptions = {
    targetVersion: '17',
    strategy: 'balanced',
    checkpointFrequency: 'major-versions',
    validationLevel: 'basic',
    thirdPartyHandling: 'automatic',
    rollbackPolicy: 'auto-on-failure',
    parallelProcessing: false
  };

  try {
    console.log(`Target Version: Angular ${upgradeOptions.targetVersion}`);
    console.log(`Strategy: ${upgradeOptions.strategy}`);
    console.log(`Project Path: ${projectPath}\n`);

    // Execute the upgrade
    const result = await orchestrator.orchestrateUpgrade(upgradeOptions);

    if (result.success) {
      console.log('\n🎉 Upgrade completed successfully!');
      console.log(`✅ Upgraded from ${result.fromVersion} to ${result.toVersion}`);
      console.log(`⏱️  Duration: ${Math.round(result.duration / 1000)} seconds`);
      console.log(`📋 Completed steps: ${result.completedSteps.length}`);
      console.log(`🔄 Checkpoints created: ${result.checkpoints.length}`);

      if (result.warnings && result.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        result.warnings.forEach(warning => {
          console.log(`   • ${warning}`);
        });
      }

      console.log('\n🚀 Next steps:');
      console.log('   • Run your test suite to verify everything works');
      console.log('   • Check for any console warnings in development');
      console.log('   • Review the upgrade report for detailed changes');
      console.log('   • Consider adopting new Angular features gradually');

    } else {
      console.log('\n❌ Upgrade failed');
      console.log(`Error: ${result.error?.message || 'Unknown error'}`);

      if (result.rollbackAvailable) {
        console.log('\n🔄 Rollback is available');
        console.log('Run the following to rollback:');
        console.log(`   ng-upgrade checkpoints --rollback ${result.checkpoints[result.checkpoints.length - 1]?.id}`);
      }
    }

  } catch (error) {
    console.error('\n💥 Unexpected error during upgrade:', error.message);
    console.log('\n🆘 Troubleshooting tips:');
    console.log('   • Ensure you have a clean git working directory');
    console.log('   • Check that Node.js version meets requirements');
    console.log('   • Verify the project is a valid Angular application');
    console.log('   • Try running with --dry-run first to see the upgrade plan');
  }
}

// Run the example
if (require.main === module) {
  basicUpgradeExample().catch(console.error);
}

module.exports = { basicUpgradeExample };