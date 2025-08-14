# Angular Multi-Version Upgrade Orchestrator - API Reference

## Table of Contents
- [Core Interfaces](#core-interfaces)
- [Configuration Types](#configuration-types)
- [Result Types](#result-types)
- [Analysis Types](#analysis-types)
- [Handler Interfaces](#handler-interfaces)
- [Event Types](#event-types)
- [Utility Types](#utility-types)

## Core Interfaces

### UpgradeOrchestrator

The main orchestrator class that coordinates the entire upgrade process.

```typescript
class UpgradeOrchestrator extends EventEmitter {
  constructor(projectPath: string)
  
  // Main Methods
  orchestrateUpgrade(options: UpgradeOptions): Promise<UpgradeResult>
  getCheckpoints(): Promise<Checkpoint[]>
  rollbackToCheckpoint(checkpointId: string): Promise<void>
  getProgress(): ProgressReport | null
}
```

#### Events Emitted

| Event | Payload | Description |
|-------|---------|-------------|
| `progress` | `ProgressReport` | General progress updates |
| `analysis-complete` | `ProjectAnalysis` | Project analysis finished |
| `path-calculated` | `UpgradePath` | Upgrade path determined |
| `step-start` | `UpgradeStep` | Individual step starting |
| `step-complete` | `UpgradeStep` | Individual step completed |
| `step-failed` | `{step: UpgradeStep, error: Error}` | Step failed |
| `manual-intervention` | `{change: BreakingChange, instructions: string}` | Manual action needed |
| `upgrade-complete` | `UpgradeResult` | Entire upgrade succeeded |
| `upgrade-failed` | `UpgradeResult` | Entire upgrade failed |
| `rollback-start` | `{checkpointId: string}` | Rollback process starting |
| `rollback-complete` | `{checkpointId: string}` | Rollback process completed |

## Configuration Types

### UpgradeOptions

Primary configuration interface for upgrade operations.

```typescript
interface UpgradeOptions {
  /** Target Angular version (e.g., '17', '18', '19') */
  targetVersion: string;
  
  /** 
   * Upgrade strategy determining risk/speed balance
   * - conservative: Maximum safety, minimal changes
   * - balanced: Moderate risk, good feature adoption  
   * - progressive: Latest features, higher risk
   */
  strategy: 'conservative' | 'balanced' | 'progressive';
  
  /** 
   * When to create restore checkpoints
   * - every-step: After each individual operation
   * - major-versions: After each Angular version upgrade
   * - custom: User-defined intervals
   */
  checkpointFrequency: 'every-step' | 'major-versions' | 'custom';
  
  /**
   * Depth of validation testing
   * - basic: Build verification only
   * - comprehensive: Build + tests + linting + compatibility
   */
  validationLevel: 'basic' | 'comprehensive';
  
  /**
   * How to handle third-party dependency updates
   * - automatic: Update dependencies automatically
   * - manual: Require manual approval for each update
   * - prompt: Interactive prompts for decision making
   */
  thirdPartyHandling: 'automatic' | 'manual' | 'prompt';
  
  /**
   * Behavior when upgrade steps fail
   * - auto-on-failure: Automatically rollback on any failure
   * - manual: Wait for user decision on rollback
   * - never: Never automatically rollback
   */
  rollbackPolicy: 'auto-on-failure' | 'manual' | 'never';
  
  /** Enable parallel processing where safe */
  parallelProcessing: boolean;
  
  /** Custom backup location (optional) */
  backupPath?: string;
}
```

### AngularVersion

Represents a parsed Angular version with semantic version components.

```typescript
interface AngularVersion {
  /** Major version number (e.g., 17) */
  major: number;
  
  /** Minor version number (e.g., 1) */
  minor: number;
  
  /** Patch version number (e.g., 3) */
  patch: number;
  
  /** Full version string (e.g., "17.1.3") */
  full: string;
}
```

## Result Types

### UpgradeResult

Comprehensive result object returned after upgrade completion.

```typescript
interface UpgradeResult {
  /** Whether the upgrade completed successfully */
  success: boolean;
  
  /** Starting Angular version */
  fromVersion: string;
  
  /** Target Angular version */
  toVersion: string;
  
  /** Array of successfully completed upgrade steps */
  completedSteps: UpgradeStep[];
  
  /** Step that failed (if success = false) */
  failedStep?: UpgradeStep;
  
  /** Error that caused failure (if success = false) */
  error?: Error;
  
  /** Non-critical warnings encountered */
  warnings: string[];
  
  /** List of checkpoints created during upgrade */
  checkpoints: Checkpoint[];
  
  /** Total upgrade duration in milliseconds */
  duration: number;
  
  /** Whether rollback is possible */
  rollbackAvailable: boolean;
}
```

### Checkpoint

Represents a project backup point for rollback purposes.

```typescript
interface Checkpoint {
  /** Unique checkpoint identifier */
  id: string;
  
  /** Angular version at checkpoint creation */
  version: string;
  
  /** When checkpoint was created */
  timestamp: Date;
  
  /** User-friendly checkpoint description */
  description: string;
  
  /** File system path to checkpoint data */
  path: string;
  
  /** Additional checkpoint metadata */
  metadata: CheckpointMetadata;
}
```

### CheckpointMetadata

Extended metadata about a checkpoint's state.

```typescript
interface CheckpointMetadata {
  /** Total project size in bytes */
  projectSize: number;
  
  /** Snapshot of all dependencies at checkpoint time */
  dependencies: Record<string, string>;
  
  /** Angular and build configuration */
  configuration: any;
  
  /** Build status when checkpoint was created */
  buildStatus: 'success' | 'failed' | 'unknown';
  
  /** Test status when checkpoint was created */
  testStatus: 'success' | 'failed' | 'unknown';
}
```

## Analysis Types

### ProjectAnalysis

Comprehensive analysis of the Angular project before upgrade.

```typescript
interface ProjectAnalysis {
  /** Current Angular version detected */
  currentVersion: AngularVersion;
  
  /** Type of Angular project */
  projectType: 'application' | 'library' | 'workspace';
  
  /** Build system being used */
  buildSystem: 'angular-cli' | 'webpack' | 'nx' | 'other';
  
  /** Analysis of all project dependencies */
  dependencies: DependencyAnalysis;
  
  /** Code quality and complexity metrics */
  codeMetrics: CodeMetrics;
  
  /** Assessment of upgrade risks */
  riskAssessment: RiskAssessment;
}
```

### DependencyAnalysis

Analysis of project dependencies and their upgrade compatibility.

```typescript
interface DependencyAnalysis {
  /** Dependencies compatible with target version */
  compatible: ThirdPartyLibrary[];
  
  /** Dependencies incompatible with target version */
  incompatible: ThirdPartyLibrary[];
  
  /** Dependencies that need updates */
  requiresUpdate: ThirdPartyLibrary[];
  
  /** Detected dependency conflicts */
  conflicts: DependencyConflict[];
}
```

### ThirdPartyLibrary

Information about a third-party library's upgrade compatibility.

```typescript
interface ThirdPartyLibrary {
  /** Library name (e.g., '@angular/material') */
  name: string;
  
  /** Currently installed version */
  currentVersion: string;
  
  /** Version compatibility matrix by Angular version */
  compatibilityMatrix: Record<string, string[]>;
  
  /** Whether migration steps are required */
  migrationRequired: boolean;
  
  /** Alternative libraries if this one is discontinued */
  alternativeLibraries?: string[];
  
  /** Library maintenance status */
  deprecationStatus?: 'stable' | 'deprecated' | 'discontinued';
}
```

### CodeMetrics

Quantitative analysis of the project codebase.

```typescript
interface CodeMetrics {
  /** Total number of source files */
  totalFiles: number;
  
  /** Number of Angular components */
  componentCount: number;
  
  /** Number of Angular services */
  serviceCount: number;
  
  /** Number of Angular modules */
  moduleCount: number;
  
  /** Total lines of code */
  linesOfCode: number;
  
  /** Test coverage percentage (if available) */
  testCoverage?: number;
  
  /** Technical debt score (if available) */
  technicalDebt?: number;
}
```

### RiskAssessment

Assessment of potential risks in the upgrade process.

```typescript
interface RiskAssessment {
  /** Overall risk level for the upgrade */
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  
  /** Individual risk factors identified */
  riskFactors: RiskFactor[];
  
  /** Recommended mitigation strategies */
  mitigationStrategies: string[];
}
```

### RiskFactor

Individual risk factor in the upgrade process.

```typescript
interface RiskFactor {
  /** Type of risk */
  type: 'dependency' | 'code' | 'configuration' | 'custom';
  
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Human-readable description */
  description: string;
  
  /** Impact if risk materializes */
  impact: string;
  
  /** Probability of occurrence (0-1) */
  likelihood: number;
}
```

## Handler Interfaces

### VersionHandler

Interface that version-specific handlers must implement.

```typescript
interface VersionHandler {
  /** Angular version this handler manages */
  version: string;
  
  /**
   * Execute version-specific upgrade logic
   * @param projectPath Path to Angular project
   * @param step Upgrade step configuration  
   * @param options Overall upgrade options
   */
  execute(projectPath: string, step: UpgradeStep, options: UpgradeOptions): Promise<void>;
  
  /**
   * Validate prerequisites for this version
   * @param projectPath Path to Angular project
   * @returns Whether prerequisites are met
   */
  validatePrerequisites(projectPath: string): Promise<boolean>;
  
  /**
   * Get breaking changes for this version
   * @returns Array of breaking changes
   */
  getBreakingChanges(): BreakingChange[];
}
```

### TransformationHandler

Interface for code transformation handlers.

```typescript
interface TransformationHandler {
  /** Type of transformation */
  type: string;
  
  /**
   * Apply transformation for a breaking change
   * @param projectPath Path to Angular project
   * @param change Breaking change to handle
   */
  apply(projectPath: string, change: BreakingChange): Promise<void>;
}
```

## Upgrade Process Types

### UpgradePath

Represents the calculated path from current to target version.

```typescript
interface UpgradePath {
  /** Starting Angular version */
  from: AngularVersion;
  
  /** Target Angular version */
  to: AngularVersion;
  
  /** Ordered list of upgrade steps to execute */
  steps: UpgradeStep[];
}
```

### UpgradeStep

Configuration for a single upgrade step (e.g., Angular 16 → 17).

```typescript
interface UpgradeStep {
  /** Starting version for this step */
  fromVersion: string;
  
  /** Target version for this step */
  toVersion: string;
  
  /** Whether this step is required (vs optional) */
  required: boolean;
  
  /** Name of handler class for this step */
  handler: string;
  
  /** Prerequisites that must be met */
  prerequisites: Prerequisite[];
  
  /** Breaking changes to apply */
  breakingChanges: BreakingChange[];
  
  /** Validations to run after step */
  validations: ValidationStep[];
}
```

### Prerequisite

A prerequisite that must be satisfied before an upgrade step.

```typescript
interface Prerequisite {
  /** Type of prerequisite */
  type: 'node' | 'typescript' | 'dependency' | 'environment';
  
  /** Name of the prerequisite */
  name: string;
  
  /** Required version (if applicable) */
  requiredVersion?: string;
  
  /** List of compatible versions */
  compatibleVersions: string[];
  
  /** Whether this prerequisite is critical */
  critical: boolean;
}
```

### BreakingChange

Represents a breaking change that needs to be handled.

```typescript
interface BreakingChange {
  /** Unique identifier for this breaking change */
  id: string;
  
  /** Angular version that introduced this change */
  version: string;
  
  /** Type of breaking change */
  type: 'api' | 'config' | 'template' | 'style' | 'build' | 'dependency';
  
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Human-readable description */
  description: string;
  
  /** Impact on the application */
  impact: string;
  
  /** Migration instructions/actions */
  migration: MigrationAction;
  
  /** Files affected by this change (optional) */
  affectedFiles?: string[];
}
```

### MigrationAction

Actions to take for handling a breaking change.

```typescript
interface MigrationAction {
  /** Type of migration */
  type: 'automatic' | 'manual' | 'bridge';
  
  /** Code transformation to apply (if automatic) */
  transform?: CodeTransformation;
  
  /** Manual instructions (if manual) */
  instructions?: string;
  
  /** Rollback transformation (if needed) */
  rollback?: CodeTransformation;
}
```

### CodeTransformation

Configuration for automated code transformations.

```typescript
interface CodeTransformation {
  /** Type of transformation */
  type: 'ast' | 'regex' | 'file' | 'template';
  
  /** Pattern to match (for regex/string transforms) */
  pattern?: string | RegExp;
  
  /** Replacement text/pattern */
  replacement?: string;
  
  /** Specific files to transform */
  filePaths?: string[];
  
  /** AST transformation logic (for AST transforms) */
  astTransform?: string;
}
```

### ValidationStep

A validation step to run during upgrade.

```typescript
interface ValidationStep {
  /** Type of validation */
  type: 'build' | 'test' | 'lint' | 'runtime' | 'compatibility';
  
  /** Command to execute (if applicable) */
  command?: string;
  
  /** Timeout in milliseconds */
  timeout?: number;
  
  /** Whether this validation is required */
  required: boolean;
  
  /** Description of what is being validated */
  description: string;
}
```

## Progress and Reporting Types

### ProgressReport

Real-time progress information during upgrade.

```typescript
interface ProgressReport {
  /** Currently executing step */
  currentStep: UpgradeStep;
  
  /** Number of completed steps */
  completedSteps: number;
  
  /** Total number of steps */
  totalSteps: number;
  
  /** Current Angular version */
  currentVersion: string;
  
  /** Target Angular version */
  targetVersion: string;
  
  /** Estimated time remaining in milliseconds */
  estimatedTimeRemaining?: number;
  
  /** Most recent checkpoint */
  lastCheckpoint?: Checkpoint;
  
  /** Current issues or warnings */
  issues: ProgressIssue[];
}
```

### ProgressIssue

An issue or warning encountered during upgrade.

```typescript
interface ProgressIssue {
  /** Issue severity */
  type: 'warning' | 'error' | 'info';
  
  /** Issue description */
  message: string;
  
  /** Step where issue occurred */
  step?: string;
  
  /** Whether issue can be automatically resolved */
  resolvable: boolean;
  
  /** Resolution instructions (if available) */
  resolution?: string;
}
```

### DependencyConflict

Represents a conflict between dependencies.

```typescript
interface DependencyConflict {
  /** First conflicting library */
  library1: string;
  
  /** Second conflicting library */
  library2: string;
  
  /** Type of conflict */
  conflictType: 'version' | 'peer' | 'api';
  
  /** Conflict severity */
  severity: 'warning' | 'error';
  
  /** Suggested resolution (if available) */
  resolution?: string;
}
```

## Utility Types

### ValidationResult

Result of running a validation step.

```typescript
interface ValidationResult {
  /** Whether validation passed */
  success: boolean;
  
  /** Validation result message */
  message: string;
  
  /** Error details (if failed) */
  error?: string;
  
  /** Non-critical warnings */
  warnings?: string[];
}
```

### RollbackOptions

Options for rollback operations.

```typescript
interface RollbackOptions {
  /** Files to preserve during rollback */
  preserveChanges?: string[];
  
  /** Whether to backup before rollback */
  backupBeforeRollback?: boolean;
  
  /** Whether to validate after rollback */
  validateAfterRollback?: boolean;
}
```

### RollbackResult

Result of a rollback operation.

```typescript
interface RollbackResult {
  /** Whether rollback succeeded */
  success: boolean;
  
  /** Checkpoint that was restored */
  checkpoint: Checkpoint;
  
  /** Files that were preserved */
  preservedFiles?: string[];
  
  /** Warnings during rollback */
  warnings?: string[];
  
  /** Error message (if failed) */
  error?: string;
}
```

## Usage Examples

### Basic Usage

```typescript
import { UpgradeOrchestrator } from 'ng-upgrade-orchestrator';

const orchestrator = new UpgradeOrchestrator('/path/to/angular/project');

// Basic upgrade
const result = await orchestrator.orchestrateUpgrade({
  targetVersion: '17',
  strategy: 'balanced',
  checkpointFrequency: 'major-versions',
  validationLevel: 'basic',
  thirdPartyHandling: 'automatic',
  rollbackPolicy: 'auto-on-failure',
  parallelProcessing: false
});

if (result.success) {
  console.log(`Upgraded from ${result.fromVersion} to ${result.toVersion}`);
} else {
  console.error(`Upgrade failed: ${result.error?.message}`);
}
```

### Advanced Usage with Event Handling

```typescript
const orchestrator = new UpgradeOrchestrator('/path/to/project');

// Set up event listeners
orchestrator.on('progress', (report: ProgressReport) => {
  console.log(`Progress: ${report.completedSteps}/${report.totalSteps}`);
});

orchestrator.on('step-complete', (step: UpgradeStep) => {
  console.log(`Completed: ${step.fromVersion} → ${step.toVersion}`);
});

orchestrator.on('manual-intervention', (data) => {
  console.log(`Manual action needed: ${data.change.description}`);
  console.log(`Instructions: ${data.instructions}`);
});

// Conservative upgrade with comprehensive validation
const result = await orchestrator.orchestrateUpgrade({
  targetVersion: '18',
  strategy: 'conservative',
  checkpointFrequency: 'every-step',
  validationLevel: 'comprehensive',
  thirdPartyHandling: 'prompt',
  rollbackPolicy: 'manual',
  parallelProcessing: false
});
```

### Rollback Usage

```typescript
// List available checkpoints
const checkpoints = await orchestrator.getCheckpoints();
console.log('Available checkpoints:');
checkpoints.forEach(cp => {
  console.log(`- ${cp.id}: ${cp.description} (${cp.version})`);
});

// Rollback to specific checkpoint
await orchestrator.rollbackToCheckpoint('pre-angular-17');
```

This API reference provides comprehensive documentation for all interfaces, types, and their usage patterns in the Angular Multi-Version Upgrade Orchestrator.