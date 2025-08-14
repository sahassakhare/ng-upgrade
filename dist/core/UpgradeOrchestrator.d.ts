import { EventEmitter } from 'events';
import { UpgradeOptions, UpgradeResult, Checkpoint, ProgressReport } from '../types';
/**
 * Main orchestrator class for Angular multi-version upgrades.
 *
 * The UpgradeOrchestrator is the central coordination engine that manages the entire
 * upgrade process from planning to execution to validation. It orchestrates multiple
 * subsystems to provide a safe, reliable, and comprehensive upgrade experience.
 *
 * @class UpgradeOrchestrator
 * @extends EventEmitter
 *
 * @example
 * ```typescript
 * const orchestrator = new UpgradeOrchestrator('/path/to/angular/project');
 *
 * // Set up event listeners
 * orchestrator.on('progress', (report) => console.log(report.message));
 * orchestrator.on('step-complete', (step) => console.log(`✅ ${step.toVersion}`));
 *
 * // Execute upgrade
 * const result = await orchestrator.orchestrateUpgrade({
 *   targetVersion: '17',
 *   strategy: 'balanced',
 *   checkpointFrequency: 'major-versions',
 *   validationLevel: 'comprehensive'
 * });
 * ```
 *
 * @emits progress - Emitted during upgrade progress with status updates
 * @emits analysis-complete - Emitted when project analysis is finished
 * @emits path-calculated - Emitted when upgrade path has been calculated
 * @emits step-start - Emitted when starting an individual upgrade step
 * @emits step-complete - Emitted when completing an individual upgrade step
 * @emits step-failed - Emitted when an upgrade step fails
 * @emits manual-intervention - Emitted when manual user intervention is required
 * @emits upgrade-complete - Emitted when entire upgrade process succeeds
 * @emits upgrade-failed - Emitted when upgrade process fails
 * @emits rollback-start - Emitted when rollback process begins
 * @emits rollback-complete - Emitted when rollback process completes
 */
export declare class UpgradeOrchestrator extends EventEmitter {
    private projectPath;
    private versionHandlers;
    private checkpointManager;
    private pathCalculator;
    private projectAnalyzer;
    private validator;
    private rollbackEngine;
    private currentCheckpoint?;
    /**
     * Creates a new UpgradeOrchestrator instance.
     *
     * @param {string} projectPath - Absolute path to the Angular project root directory
     *
     * @throws {Error} If projectPath is not a valid directory
     *
     * @example
     * ```typescript
     * const orchestrator = new UpgradeOrchestrator('/Users/dev/my-angular-app');
     * ```
     */
    constructor(projectPath: string);
    /**
     * Main orchestration method for multi-version Angular upgrades.
     *
     * This is the primary entry point for executing an Angular upgrade. It coordinates
     * all aspects of the upgrade process including analysis, path calculation, checkpoint
     * creation, step-by-step execution, validation, and rollback on failure.
     *
     * The method follows this high-level flow:
     * 1. Analyze the current project state and dependencies
     * 2. Calculate the optimal upgrade path from current to target version
     * 3. Validate prerequisites for the entire upgrade journey
     * 4. Create initial checkpoint for rollback safety
     * 5. Execute each upgrade step sequentially with validation
     * 6. Create checkpoints at configurable intervals
     * 7. Perform final validation of the upgraded application
     * 8. Handle failures with automatic rollback if configured
     *
     * @param {UpgradeOptions} options - Configuration options for the upgrade process
     * @param {string} options.targetVersion - Target Angular version (e.g., '17', '18')
     * @param {'conservative'|'balanced'|'progressive'} options.strategy - Upgrade strategy
     * @param {'every-step'|'major-versions'|'custom'} options.checkpointFrequency - When to create checkpoints
     * @param {'basic'|'comprehensive'} options.validationLevel - Depth of validation testing
     * @param {'automatic'|'manual'|'prompt'} options.thirdPartyHandling - How to handle third-party deps
     * @param {'auto-on-failure'|'manual'|'never'} options.rollbackPolicy - Rollback behavior
     * @param {boolean} options.parallelProcessing - Enable parallel processing where safe
     * @param {string} [options.backupPath] - Custom backup location
     *
     * @returns {Promise<UpgradeResult>} Result object containing success status, timing, and details
     *
     * @throws {Error} If project analysis fails or invalid configuration provided
     *
     * @example
     * ```typescript
     * // Basic upgrade to Angular 17
     * const result = await orchestrator.orchestrateUpgrade({
     *   targetVersion: '17',
     *   strategy: 'balanced'
     * });
     *
     * // Conservative upgrade with comprehensive validation
     * const result = await orchestrator.orchestrateUpgrade({
     *   targetVersion: '16',
     *   strategy: 'conservative',
     *   checkpointFrequency: 'every-step',
     *   validationLevel: 'comprehensive',
     *   rollbackPolicy: 'auto-on-failure'
     * });
     * ```
     */
    orchestrateUpgrade(options: UpgradeOptions): Promise<UpgradeResult>;
    /**
     * Execute a single upgrade step within the upgrade journey.
     *
     * This method handles the execution of one version-to-version upgrade step,
     * including prerequisite validation, breaking change application, version-specific
     * transformations, and step validation.
     *
     * @private
     * @param {UpgradeStep} step - The upgrade step configuration to execute
     * @param {UpgradeOptions} options - Overall upgrade options
     * @param {ProjectAnalysis} analysis - Current project analysis results
     *
     * @throws {Error} If any part of the step execution fails
     *
     * @example
     * ```typescript
     * // Internal usage - executes Angular 16 -> 17 upgrade
     * await this.executeUpgradeStep(
     *   { fromVersion: '16', toVersion: '17', ... },
     *   options,
     *   analysis
     * );
     * ```
     */
    private executeUpgradeStep;
    /**
     * Validate prerequisites for entire upgrade path
     */
    private validatePrerequisites;
    /**
     * Execute prerequisites for a single step
     */
    private executePrerequisites;
    /**
     * Apply breaking changes for a step
     */
    private applyBreakingChanges;
    /**
     * Run validations for a single step
     */
    private runStepValidations;
    /**
     * Perform final validation after all steps
     */
    private performFinalValidation;
    /**
     * Handle failure rollback
     */
    private handleFailureRollback;
    /**
     * Determine if checkpoint should be created after step
     */
    private shouldCreateCheckpoint;
    /**
     * Parse version string to AngularVersion object
     */
    private parseVersion;
    /**
     * Get list of available checkpoints for this project.
     *
     * Returns all checkpoints that have been created during upgrade processes,
     * sorted by creation time. Each checkpoint represents a complete snapshot
     * of the project at a specific point in the upgrade journey.
     *
     * @returns {Promise<Checkpoint[]>} Array of available checkpoints
     *
     * @example
     * ```typescript
     * const checkpoints = await orchestrator.getCheckpoints();
     * checkpoints.forEach(cp => {
     *   console.log(`${cp.id}: ${cp.description} (${cp.version})`);
     * });
     * ```
     */
    getCheckpoints(): Promise<Checkpoint[]>;
    /**
     * Rollback project to a specific checkpoint.
     *
     * This method safely restores the project to a previous state by rolling back
     * all changes made since the specified checkpoint was created. This includes
     * code changes, configuration updates, and dependency modifications.
     *
     * @param {string} checkpointId - Unique identifier of the checkpoint to restore
     *
     * @throws {Error} If checkpoint doesn't exist or rollback fails
     *
     * @emits rollback-start - When rollback process begins
     * @emits rollback-complete - When rollback process completes successfully
     *
     * @example
     * ```typescript
     * // Rollback to checkpoint created before Angular 17 upgrade
     * await orchestrator.rollbackToCheckpoint('pre-angular-17');
     * ```
     */
    rollbackToCheckpoint(checkpointId: string): Promise<void>;
    /**
     * Get current upgrade progress information.
     *
     * Returns real-time progress information about an ongoing upgrade process,
     * including current step, completion percentage, and estimated time remaining.
     * Returns null if no upgrade is currently in progress.
     *
     * @returns {ProgressReport | null} Current progress information or null
     *
     * @example
     * ```typescript
     * const progress = orchestrator.getProgress();
     * if (progress) {
     *   console.log(`Progress: ${progress.completedSteps}/${progress.totalSteps}`);
     *   console.log(`Current: ${progress.currentStep.description}`);
     * }
     * ```
     */
    getProgress(): ProgressReport | null;
}
//# sourceMappingURL=UpgradeOrchestrator.d.ts.map