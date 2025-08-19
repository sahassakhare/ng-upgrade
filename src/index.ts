// Main entry point for the Angular Multi-Version Upgrade Orchestrator

// Core orchestration components
export { UpgradeOrchestrator } from './core/UpgradeOrchestrator';
export { EnhancedUpgradeOrchestrator } from './core/EnhancedUpgradeOrchestrator';
export { VersionHandlerRegistry } from './core/VersionHandlerRegistry';
export { CheckpointManager } from './core/CheckpointManager';
export { UpgradePathCalculator } from './core/UpgradePathCalculator';
export { ProjectAnalyzer } from './core/ProjectAnalyzer';
export { ValidatorFramework } from './core/ValidatorFramework';
export { RollbackEngine } from './core/RollbackEngine';

// Enterprise components - temporarily commented out for build fix
// export { EnterpriseUpgradeOrchestrator } from './enterprise/EnterpriseUpgradeOrchestrator';
// export { EnterpriseValidationFramework } from './enterprise/EnterpriseValidationFramework';
// export { EnterpriseMonitoringSystem } from './enterprise/EnterpriseMonitoringSystem';

// Utility components
export { DependencyInstaller } from './utils/DependencyInstaller';
export { FileContentPreserver } from './utils/FileContentPreserver';
export { ProgressReporter } from './utils/ProgressReporter';
export { AngularSchematicsRunner } from './utils/AngularSchematicsRunner';

// Version handlers (including Angular 20)
export * from './handlers';
export * from './transformers/CodeTransformer';
export * from './types';

// Default export for main orchestrator
export { UpgradeOrchestrator as default } from './core/UpgradeOrchestrator';