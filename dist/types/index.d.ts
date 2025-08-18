/**
 * Represents a parsed Angular version with semantic version components.
 *
 * @interface AngularVersion
 * @example
 * ```typescript
 * const version: AngularVersion = {
 *   major: 17,
 *   minor: 1,
 *   patch: 3,
 *   full: "17.1.3"
 * };
 * ```
 */
export interface AngularVersion {
    /** Major version number (e.g., 17) */
    major: number;
    /** Minor version number (e.g., 1) */
    minor: number;
    /** Patch version number (e.g., 3) */
    patch: number;
    /** Full version string representation (e.g., "17.1.3") */
    full: string;
}
/**
 * Represents the calculated upgrade path from current to target Angular version.
 *
 * Contains the complete sequence of upgrade steps that need to be executed
 * to safely migrate from the current version to the target version.
 *
 * @interface UpgradePath
 * @example
 * ```typescript
 * const path: UpgradePath = {
 *   from: { major: 14, minor: 0, patch: 0, full: "14.0.0" },
 *   to: { major: 17, minor: 0, patch: 0, full: "17.0.0" },
 *   steps: [
 *     { fromVersion: '14', toVersion: '15', ... },
 *     { fromVersion: '15', toVersion: '16', ... },
 *     { fromVersion: '16', toVersion: '17', ... }
 *   ]
 * };
 * ```
 */
export interface UpgradePath {
    /** Starting Angular version for the upgrade journey */
    from: AngularVersion;
    /** Target Angular version for the upgrade journey */
    to: AngularVersion;
    /** Ordered sequence of upgrade steps to execute */
    steps: UpgradeStep[];
}
export interface UpgradeStep {
    fromVersion: string;
    toVersion: string;
    required: boolean;
    handler: string;
    prerequisites: Prerequisite[];
    breakingChanges: BreakingChange[];
    validations: ValidationStep[];
}
export interface Prerequisite {
    type: 'node' | 'typescript' | 'dependency' | 'environment';
    name: string;
    requiredVersion?: string;
    compatibleVersions: string[];
    critical: boolean;
}
export interface BreakingChange {
    id: string;
    version: string;
    type: 'api' | 'config' | 'template' | 'style' | 'build' | 'dependency';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    impact: string;
    migration: MigrationAction;
    affectedFiles?: string[];
}
export interface MigrationAction {
    type: 'automatic' | 'manual' | 'bridge';
    transform?: CodeTransformation;
    instructions?: string;
    rollback?: CodeTransformation;
}
export interface CodeTransformation {
    type: 'ast' | 'regex' | 'file' | 'template';
    pattern?: string | RegExp;
    replacement?: string;
    filePaths?: string[];
    astTransform?: string;
}
export interface ValidationStep {
    type: 'build' | 'test' | 'lint' | 'runtime' | 'compatibility';
    command?: string;
    timeout?: number;
    required: boolean;
    description: string;
}
export interface Checkpoint {
    id: string;
    version: string;
    timestamp: Date;
    description: string;
    path: string;
    metadata: CheckpointMetadata;
}
export interface CheckpointMetadata {
    projectSize: number;
    dependencies: Record<string, string>;
    configuration: any;
    buildStatus: 'success' | 'failed' | 'unknown';
    testStatus: 'success' | 'failed' | 'unknown';
}
/**
 * Configuration options for Angular upgrade operations.
 *
 * This interface defines all the configurable aspects of the upgrade process,
 * allowing users to customize the upgrade behavior according to their needs
 * and risk tolerance.
 *
 * @interface UpgradeOptions
 * @example
 * ```typescript
 * // Conservative upgrade configuration
 * const conservativeOptions: UpgradeOptions = {
 *   targetVersion: '17',
 *   strategy: 'conservative',
 *   checkpointFrequency: 'every-step',
 *   validationLevel: 'comprehensive',
 *   thirdPartyHandling: 'manual',
 *   rollbackPolicy: 'auto-on-failure',
 *   parallelProcessing: false
 * };
 *
 * // Progressive upgrade configuration
 * const progressiveOptions: UpgradeOptions = {
 *   targetVersion: '20',
 *   strategy: 'progressive',
 *   checkpointFrequency: 'major-versions',
 *   validationLevel: 'basic',
 *   thirdPartyHandling: 'automatic',
 *   rollbackPolicy: 'manual',
 *   parallelProcessing: true
 * };
 * ```
 */
export interface UpgradeOptions {
    /**
     * Target Angular version to upgrade to (e.g., '17', '18', '19', '20')
     * @example '17'
     */
    targetVersion: string;
    /**
     * Upgrade strategy determining the balance between safety and feature adoption:
     * - `conservative`: Maximum safety, minimal changes, extensive validation
     * - `balanced`: Moderate risk, reasonable feature adoption, standard validation
     * - `progressive`: Latest features, higher risk, faster upgrade process
     */
    strategy: 'conservative' | 'balanced' | 'progressive';
    /**
     * Frequency of checkpoint creation for rollback purposes:
     * - `every-step`: Create checkpoint after each individual operation (safest)
     * - `major-versions`: Create checkpoint after each Angular version upgrade (balanced)
     * - `custom`: Create checkpoints based on custom logic (advanced)
     */
    checkpointFrequency: 'every-step' | 'major-versions' | 'custom';
    /**
     * Depth and thoroughness of validation testing:
     * - `basic`: Build verification only (fastest)
     * - `comprehensive`: Build + tests + linting + compatibility checks (thorough)
     */
    validationLevel: 'basic' | 'comprehensive';
    /**
     * How to handle third-party dependency updates:
     * - `automatic`: Update dependencies automatically without user intervention
     * - `manual`: Require manual approval for each dependency update
     * - `prompt`: Interactive prompts for each dependency decision
     */
    thirdPartyHandling: 'automatic' | 'manual' | 'prompt';
    /**
     * Behavior when upgrade steps fail:
     * - `auto-on-failure`: Automatically rollback to last checkpoint on any failure (safest)
     * - `manual`: Wait for user decision before rolling back (gives user control)
     * - `never`: Never automatically rollback, leave project in current state
     */
    rollbackPolicy: 'auto-on-failure' | 'manual' | 'never';
    /**
     * Enable parallel processing where safe to improve performance.
     * Note: Some operations must run sequentially for safety.
     */
    parallelProcessing: boolean;
    /**
     * Custom backup location for project snapshots.
     * If not provided, uses default `.ng-upgrade/backup` directory.
     * @example '/Users/dev/project-backups/my-app'
     */
    backupPath?: string;
    /**
     * Optional progress reporter instance for tracking upgrade progress.
     * If not provided, a default progress reporter will be created.
     */
    progressReporter?: any;
}
export interface UpgradeResult {
    success: boolean;
    fromVersion: string;
    toVersion: string;
    completedSteps: UpgradeStep[];
    failedStep?: UpgradeStep;
    error?: Error;
    warnings: string[];
    checkpoints: Checkpoint[];
    duration: number;
    rollbackAvailable: boolean;
}
export interface ThirdPartyLibrary {
    name: string;
    currentVersion: string;
    compatibilityMatrix: Record<string, string[]>;
    migrationRequired: boolean;
    alternativeLibraries?: string[];
    deprecationStatus?: 'stable' | 'deprecated' | 'discontinued';
}
export interface DependencyAnalysis {
    compatible: ThirdPartyLibrary[];
    incompatible: ThirdPartyLibrary[];
    requiresUpdate: ThirdPartyLibrary[];
    conflicts: DependencyConflict[];
}
export interface DependencyConflict {
    library1: string;
    library2: string;
    conflictType: 'version' | 'peer' | 'api';
    severity: 'warning' | 'error';
    resolution?: string;
}
export interface ProjectAnalysis {
    currentVersion: AngularVersion;
    projectType: 'application' | 'library' | 'workspace';
    buildSystem: 'angular-cli' | 'webpack' | 'nx' | 'other';
    dependencies: DependencyAnalysis;
    codeMetrics: CodeMetrics;
    riskAssessment: RiskAssessment;
}
export interface CodeMetrics {
    totalFiles: number;
    componentCount: number;
    serviceCount: number;
    moduleCount: number;
    linesOfCode: number;
    testCoverage?: number;
    technicalDebt?: number;
}
export interface RiskAssessment {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: RiskFactor[];
    mitigationStrategies: string[];
}
export interface RiskFactor {
    type: 'dependency' | 'code' | 'configuration' | 'custom';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    impact: string;
    likelihood: number;
}
export interface ProgressReport {
    currentStep: UpgradeStep;
    completedSteps: number;
    totalSteps: number;
    currentVersion: string;
    targetVersion: string;
    estimatedTimeRemaining?: number;
    lastCheckpoint?: Checkpoint;
    issues: ProgressIssue[];
}
export interface ProgressIssue {
    type: 'warning' | 'error' | 'info';
    message: string;
    step?: string;
    resolvable: boolean;
    resolution?: string;
}
//# sourceMappingURL=index.d.ts.map