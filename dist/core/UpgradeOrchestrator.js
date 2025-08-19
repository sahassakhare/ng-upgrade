"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeOrchestrator = void 0;
const events_1 = require("events");
const VersionHandlerRegistry_1 = require("./VersionHandlerRegistry");
const CheckpointManager_1 = require("./CheckpointManager");
const UpgradePathCalculator_1 = require("./UpgradePathCalculator");
const ProjectAnalyzer_1 = require("./ProjectAnalyzer");
const ValidatorFramework_1 = require("./ValidatorFramework");
const RollbackEngine_1 = require("./RollbackEngine");
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
class UpgradeOrchestrator extends events_1.EventEmitter {
    projectPath;
    versionHandlers;
    checkpointManager;
    pathCalculator;
    projectAnalyzer;
    validator;
    rollbackEngine;
    currentCheckpoint;
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
    constructor(projectPath) {
        super();
        this.projectPath = projectPath;
        this.versionHandlers = new VersionHandlerRegistry_1.VersionHandlerRegistry();
        this.checkpointManager = new CheckpointManager_1.CheckpointManager(projectPath);
        this.pathCalculator = new UpgradePathCalculator_1.UpgradePathCalculator();
        this.projectAnalyzer = new ProjectAnalyzer_1.ProjectAnalyzer(projectPath);
        this.validator = new ValidatorFramework_1.ValidatorFramework(projectPath);
        this.rollbackEngine = new RollbackEngine_1.RollbackEngine(this.checkpointManager);
    }
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
    async orchestrateUpgrade(options) {
        const startTime = Date.now();
        const completedSteps = [];
        const checkpoints = [];
        try {
            this.emit('progress', { message: 'Starting upgrade orchestration', phase: 'initialization' });
            // 1. Analyze current project
            const analysis = await this.projectAnalyzer.analyze();
            this.emit('analysis-complete', analysis);
            // 2. Calculate upgrade path
            const upgradePath = await this.pathCalculator.calculatePath(analysis.currentVersion, this.parseVersion(options.targetVersion), options);
            this.emit('path-calculated', upgradePath);
            // 3. Validate prerequisites for entire path
            await this.validatePrerequisites(upgradePath, options);
            // 4. Create initial checkpoint
            const initialCheckpoint = await this.checkpointManager.createCheckpoint('initial', `Before upgrade from ${analysis.currentVersion.full} to ${options.targetVersion}`);
            checkpoints.push(initialCheckpoint);
            this.currentCheckpoint = initialCheckpoint;
            // 5. Execute upgrade steps
            for (const step of upgradePath.steps) {
                this.emit('step-start', step);
                try {
                    await this.executeUpgradeStep(step, options, analysis);
                    completedSteps.push(step);
                    // Create checkpoint after each step if configured
                    if (this.shouldCreateCheckpoint(step, options)) {
                        const checkpoint = await this.checkpointManager.createCheckpoint(`step-${step.toVersion}`, `After upgrade to Angular ${step.toVersion}`);
                        checkpoints.push(checkpoint);
                        this.currentCheckpoint = checkpoint;
                    }
                    this.emit('step-complete', step);
                }
                catch (error) {
                    this.emit('step-failed', { step, error });
                    if (options.rollbackPolicy === 'auto-on-failure') {
                        await this.handleFailureRollback(error, options);
                    }
                    throw new Error(`Upgrade step failed: ${step.fromVersion} -> ${step.toVersion}: ${error}`);
                }
            }
            // 6. Final validation
            await this.performFinalValidation(options);
            const duration = Date.now() - startTime;
            const result = {
                success: true,
                fromVersion: analysis.currentVersion.full,
                toVersion: options.targetVersion,
                completedSteps,
                warnings: [],
                checkpoints,
                duration,
                rollbackAvailable: checkpoints.length > 0
            };
            this.emit('upgrade-complete', result);
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const result = {
                success: false,
                fromVersion: '',
                toVersion: options.targetVersion,
                completedSteps,
                error: error,
                warnings: [],
                checkpoints,
                duration,
                rollbackAvailable: checkpoints.length > 0
            };
            this.emit('upgrade-failed', result);
            return result;
        }
    }
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
    async executeUpgradeStep(step, options, analysis) {
        // Get version-specific handler
        const handler = this.versionHandlers.getHandler(step.toVersion);
        if (!handler) {
            throw new Error(`No handler found for Angular version ${step.toVersion}`);
        }
        // Update progress
        this.emit('progress', {
            message: `Executing upgrade: ${step.fromVersion} -> ${step.toVersion}`,
            phase: 'execution',
            step
        });
        // Execute prerequisites
        await this.executePrerequisites(step, options);
        // Apply breaking changes
        await this.applyBreakingChanges(step, options);
        // Run version-specific handler
        await handler.execute(this.projectPath, step, options);
        // Run validations
        await this.runStepValidations(step, options);
    }
    /**
     * Validate prerequisites for entire upgrade path
     */
    async validatePrerequisites(path, options) {
        this.emit('progress', { message: 'Validating prerequisites', phase: 'validation' });
        for (const step of path.steps) {
            for (const prereq of step.prerequisites) {
                if (prereq.critical) {
                    const isValid = await this.validator.validatePrerequisite(prereq);
                    if (!isValid) {
                        throw new Error(`Critical prerequisite not met: ${prereq.name} ${prereq.requiredVersion}`);
                    }
                }
            }
        }
    }
    /**
     * Execute prerequisites for a single step
     */
    async executePrerequisites(step, options) {
        for (const prereq of step.prerequisites) {
            const isValid = await this.validator.validatePrerequisite(prereq);
            if (!isValid && prereq.critical) {
                throw new Error(`Prerequisite validation failed: ${prereq.name}`);
            }
        }
    }
    /**
     * Apply breaking changes for a step
     */
    async applyBreakingChanges(step, options) {
        for (const change of step.breakingChanges) {
            if (change.migration.type === 'automatic') {
                // Apply automatic transformation
                const transformer = this.versionHandlers.getTransformer(change.type);
                await transformer?.apply(this.projectPath, change);
            }
            else if (change.migration.type === 'manual') {
                // Emit manual intervention required
                this.emit('manual-intervention', {
                    change,
                    instructions: change.migration.instructions
                });
            }
        }
    }
    /**
     * Run validations for a single step
     */
    async runStepValidations(step, options) {
        for (const validation of step.validations) {
            if (validation.required || options.validationLevel === 'comprehensive') {
                const result = await this.validator.runValidation(validation);
                if (!result.success && validation.required) {
                    throw new Error(`Validation failed: ${validation.description} - ${result.error}`);
                }
            }
        }
    }
    /**
     * Perform final validation after all steps
     */
    async performFinalValidation(options) {
        this.emit('progress', { message: 'Performing final validation', phase: 'final-validation' });
        const validations = [
            { type: 'build', description: 'Final build validation', required: true },
            { type: 'test', description: 'Final test validation', required: options.validationLevel === 'comprehensive' }
        ];
        for (const validation of validations) {
            if (validation.required) {
                const result = await this.validator.runValidation(validation);
                if (!result.success) {
                    throw new Error(`Final validation failed: ${validation.description}`);
                }
            }
        }
    }
    /**
     * Handle failure rollback
     */
    async handleFailureRollback(error, options) {
        if (this.currentCheckpoint) {
            this.emit('rollback-start', { checkpoint: this.currentCheckpoint, reason: error.message });
            await this.rollbackEngine.rollbackToCheckpoint(this.currentCheckpoint.id);
            this.emit('rollback-complete', { checkpoint: this.currentCheckpoint });
        }
    }
    /**
     * Determine if checkpoint should be created after step
     */
    shouldCreateCheckpoint(step, options) {
        switch (options.checkpointFrequency) {
            case 'every-step':
                return true;
            case 'major-versions':
                return step.required;
            case 'custom':
                return step.required; // Could be customized further
            default:
                return false;
        }
    }
    /**
     * Parse version string to AngularVersion object
     */
    parseVersion(versionString) {
        const [major, minor = 0, patch = 0] = versionString.split('.').map(Number);
        return {
            major,
            minor,
            patch,
            full: `${major}.${minor}.${patch}`
        };
    }
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
    async getCheckpoints() {
        return this.checkpointManager.listCheckpoints();
    }
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
    async rollbackToCheckpoint(checkpointId) {
        this.emit('rollback-start', { checkpointId });
        await this.rollbackEngine.rollbackToCheckpoint(checkpointId);
        this.emit('rollback-complete', { checkpointId });
    }
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
    getProgress() {
        // Implementation would track current progress
        return null;
    }
}
exports.UpgradeOrchestrator = UpgradeOrchestrator;
//# sourceMappingURL=UpgradeOrchestrator.js.map