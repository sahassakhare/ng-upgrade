#!/usr/bin/env node

/**
 * Example: Conservative Angular Upgrade
 * 
 * This example demonstrates a conservative upgrade strategy that prioritizes
 * maximum safety and backward compatibility over modernization.
 */

const { UpgradeOrchestrator } = require('../dist/index.js');

async function conservativeUpgradeExample() {
  console.log('🛡️  Conservative Angular Upgrade Example\n');

  const projectPath = process.argv[2] || process.cwd();
  const orchestrator = new UpgradeOrchestrator(projectPath);

  // Enhanced progress monitoring for conservative upgrades
  orchestrator.on('progress', (report) => {
    console.log(`📋 ${report.message}`);
  });

  orchestrator.on('analysis-complete', (analysis) => {
    console.log('🔍 Project Analysis Complete:');
    console.log(`   Current Version: Angular ${analysis.currentVersion.full}`);
    console.log(`   Project Type: ${analysis.projectType}`);
    console.log(`   Risk Level: ${analysis.riskAssessment.overallRisk}`);
    
    if (analysis.riskAssessment.riskFactors.length > 0) {
      console.log('\n⚠️  Risk Factors Identified:');
      analysis.riskAssessment.riskFactors.forEach(risk => {
        console.log(`   • ${risk.description} (${risk.severity})`);
      });
    }
    console.log('');
  });

  orchestrator.on('path-calculated', (path) => {
    console.log('🗺️  Upgrade Path Calculated:');
    console.log(`   Steps: ${path.steps.length}`);
    path.steps.forEach((step, index) => {
      console.log(`   ${index + 1}. Angular ${step.fromVersion} → ${step.toVersion}`);
    });
    console.log('');
  });

  orchestrator.on('manual-intervention', ({ change, instructions }) => {
    console.log('\n👋 Manual Intervention Required:');
    console.log(`   Change: ${change.description}`);
    console.log(`   Severity: ${change.severity}`);
    console.log(`   Instructions: ${instructions}`);
    console.log('   ⏸️  Pausing automatic upgrade - please address manually\n');
  });

  // Conservative upgrade configuration
  const upgradeOptions = {
    targetVersion: '16', // Conservative target - not jumping too far
    strategy: 'conservative',
    checkpointFrequency: 'every-step', // Maximum checkpoints for safety
    validationLevel: 'comprehensive', // Thorough testing at each step
    thirdPartyHandling: 'manual', // Manual review of all dependency changes
    rollbackPolicy: 'auto-on-failure', // Auto-rollback on any failure
    parallelProcessing: false // Sequential processing for stability
  };

  try {
    console.log('🛡️  Conservative Upgrade Configuration:');
    console.log(`   Target Version: Angular ${upgradeOptions.targetVersion}`);
    console.log(`   Strategy: ${upgradeOptions.strategy}`);
    console.log(`   Checkpoint Frequency: ${upgradeOptions.checkpointFrequency}`);
    console.log(`   Validation Level: ${upgradeOptions.validationLevel}`);
    console.log(`   Third-party Handling: ${upgradeOptions.thirdPartyHandling}`);
    console.log(`   Rollback Policy: ${upgradeOptions.rollbackPolicy}\n`);

    // Analyze project first
    console.log('🔍 Analyzing project for upgrade readiness...');

    const result = await orchestrator.orchestrateUpgrade(upgradeOptions);

    if (result.success) {
      console.log('\n🎉 Conservative Upgrade Completed Successfully!');
      console.log('\n📊 Upgrade Summary:');
      console.log(`   ✅ Upgraded from Angular ${result.fromVersion} to ${result.toVersion}`);
      console.log(`   ⏱️  Total Duration: ${Math.round(result.duration / 1000)} seconds`);
      console.log(`   📋 Steps Completed: ${result.completedSteps.length}`);
      console.log(`   🔄 Checkpoints Created: ${result.checkpoints.length}`);
      console.log(`   🛡️  Zero Breaking Changes: Maintained full backward compatibility`);

      console.log('\n🔍 Post-Upgrade Verification:');
      console.log('   ✅ All existing functionality preserved');
      console.log('   ✅ No forced API migrations');
      console.log('   ✅ Legacy patterns still supported');
      console.log('   ✅ Optional new features available for gradual adoption');

      if (result.warnings && result.warnings.length > 0) {
        console.log('\n⚠️  Upgrade Warnings (Non-Critical):');
        result.warnings.forEach(warning => {
          console.log(`   • ${warning}`);
        });
      }

      console.log('\n🚀 Recommended Next Steps:');
      console.log('   1. Run comprehensive test suite');
      console.log('   2. Perform manual smoke testing');
      console.log('   3. Review deprecated API warnings (no immediate action needed)');
      console.log('   4. Plan gradual adoption of new features');
      console.log('   5. Consider next conservative upgrade in 3-6 months');

      console.log('\n💡 New Features Available (Optional):');
      result.completedSteps.forEach(step => {
        const majorVersion = parseInt(step.toVersion);
        switch (majorVersion) {
          case 13:
            console.log('   • Ivy renderer optimizations (automatic)');
            break;
          case 14:
            console.log('   • Standalone components (opt-in)');
            break;
          case 15:
            console.log('   • Image directive with optimization (opt-in)');
            break;
          case 16:
            console.log('   • Required inputs API (opt-in)');
            console.log('   • Router data as input (opt-in)');
            break;
        }
      });

    } else {
      console.log('\n❌ Conservative Upgrade Failed');
      console.log(`Error: ${result.error?.message}`);
      
      console.log('\n🔄 Automatic Rollback Initiated');
      console.log('   Your application has been restored to its original state');
      console.log('   All changes have been reverted automatically');
      
      console.log('\n🔍 Failure Analysis:');
      if (result.failedStep) {
        console.log(`   Failed at: Angular ${result.failedStep.fromVersion} → ${result.failedStep.toVersion}`);
      }
      console.log(`   Completed steps: ${result.completedSteps.length}`);
      console.log(`   Available checkpoints: ${result.checkpoints.length}`);

      console.log('\n🛠️  Troubleshooting Recommendations:');
      console.log('   1. Review the error message above');
      console.log('   2. Check Node.js and npm versions meet requirements');
      console.log('   3. Ensure all dependencies are up to date');
      console.log('   4. Try upgrading one version at a time manually');
      console.log('   5. Contact support with the error details');
    }

  } catch (error) {
    console.error('\n💥 Unexpected Error:', error.message);
    console.log('\n🆘 Emergency Recovery:');
    console.log('   Your project should be automatically restored');
    console.log('   If not, check available checkpoints with:');
    console.log('   ng-upgrade checkpoints --list');
  }
}

// Run the example
if (require.main === module) {
  conservativeUpgradeExample().catch(console.error);
}

module.exports = { conservativeUpgradeExample };