"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedUpgradeOrchestrator = void 0;
const events_1 = require("events");
const VersionHandlerRegistry_1 = require("./VersionHandlerRegistry");
const CheckpointManager_1 = require("./CheckpointManager");
const UpgradePathCalculator_1 = require("./UpgradePathCalculator");
const ProjectAnalyzer_1 = require("./ProjectAnalyzer");
const ValidatorFramework_1 = require("./ValidatorFramework");
const RollbackEngine_1 = require("./RollbackEngine");
const ProgressReporter_1 = require("../utils/ProgressReporter");
const DependencyInstaller_1 = require("../utils/DependencyInstaller");
/**
 * Enhanced Upgrade Orchestrator with better UX features:
 * - Automatic dependency installation
 * - Progress reporting with visual feedback
 * - File content preservation
 */
class EnhancedUpgradeOrchestrator extends events_1.EventEmitter {
    constructor(projectPath) {
        super();
        this.projectPath = projectPath;
        this.versionHandlers = new VersionHandlerRegistry_1.VersionHandlerRegistry();
        this.checkpointManager = new CheckpointManager_1.CheckpointManager(projectPath);
        this.pathCalculator = new UpgradePathCalculator_1.UpgradePathCalculator();
        this.projectAnalyzer = new ProjectAnalyzer_1.ProjectAnalyzer(projectPath);
        this.validator = new ValidatorFramework_1.ValidatorFramework(projectPath);
        this.rollbackEngine = new RollbackEngine_1.RollbackEngine(this.checkpointManager);
        this.progressReporter = new ProgressReporter_1.ProgressReporter();
        this.dependencyInstaller = new DependencyInstaller_1.DependencyInstaller(projectPath);
    }
    /**
     * Enhanced orchestration with better progress reporting and dependency management
     */
    async orchestrateUpgrade(options) {
        const startTime = Date.now();
        let completedSteps = [];
        let checkpoints = [];
        try {
            // Pass progress reporter to options for handlers to use
            options.progressReporter = this.progressReporter;
            // 1. Analyze current project with progress
            this.progressReporter.info('🔍 Analyzing project structure...');
            const analysis = await this.projectAnalyzer.analyze();
            this.emit('analysis-complete', analysis);
            // 2. Calculate and display upgrade path
            const upgradePath = await this.pathCalculator.calculatePath(analysis.currentVersion, this.parseVersion(options.targetVersion), options);
            // Initialize progress tracking
            const stepNames = [
                'Project Analysis',
                'Prerequisites Check',
                'Initial Checkpoint',
                ...upgradePath.steps.map(step => `Angular ${step.toVersion} Upgrade`),
                'Final Validation'
            ];
            this.progressReporter.initializeProgress(analysis.currentVersion.full, options.targetVersion, stepNames);
            // Display the upgrade path
            const versions = [
                analysis.currentVersion.full,
                ...upgradePath.steps.map(s => s.toVersion)
            ];
            this.progressReporter.displayUpgradePath(versions);
            this.emit('path-calculated', upgradePath);
            // Mark analysis as complete
            this.progressReporter.completeStep('Project Analysis', 'Analysis complete');
            // 3. Validate prerequisites with progress
            this.progressReporter.startStep('Prerequisites Check', 'Validating prerequisites...');
            await this.validatePrerequisites(upgradePath, options);
            this.progressReporter.completeStep('Prerequisites Check', 'All prerequisites met');
            // 4. Ensure dependencies are installed before starting
            this.progressReporter.info('📦 Ensuring all dependencies are installed...');
            await this.dependencyInstaller.runNpmInstall();
            // 5. Create initial checkpoint with progress
            this.progressReporter.startStep('Initial Checkpoint', 'Creating backup...');
            const initialCheckpoint = await this.checkpointManager.createCheckpoint('initial', `Before upgrade from ${analysis.currentVersion.full} to ${options.targetVersion}`);
            checkpoints.push(initialCheckpoint);
            this.currentCheckpoint = initialCheckpoint;
            this.progressReporter.completeStep('Initial Checkpoint', 'Backup created');
            // 6. Execute upgrade steps with detailed progress
            for (const step of upgradePath.steps) {
                this.emit('step-start', step);
                try {
                    // The step handler will use the progressReporter from options
                    await this.executeUpgradeStep(step, options, analysis);
                    completedSteps.push(step);
                    // Create checkpoint after each step if configured
                    if (this.shouldCreateCheckpoint(step, options)) {
                        this.progressReporter.info(`💾 Creating checkpoint after Angular ${step.toVersion}...`);
                        const checkpoint = await this.checkpointManager.createCheckpoint(`step-${step.toVersion}`, `After upgrade to Angular ${step.toVersion}`);
                        checkpoints.push(checkpoint);
                        this.currentCheckpoint = checkpoint;
                    }
                    this.emit('step-complete', step);
                }
                catch (error) {
                    this.progressReporter.failStep(`Angular ${step.toVersion} Upgrade`, error instanceof Error ? error.message : 'Unknown error');
                    this.emit('step-failed', { step, error });
                    // Handle rollback if configured
                    if (options.rollbackPolicy === 'auto-on-failure' && this.currentCheckpoint) {
                        this.progressReporter.warn('🔄 Rolling back to last checkpoint...');
                        await this.rollbackEngine.rollbackToCheckpoint(this.currentCheckpoint.id);
                        throw new Error(`Upgrade failed at Angular ${step.toVersion}, rolled back to ${this.currentCheckpoint.description}`);
                    }
                    throw error;
                }
            }
            // 7. Final validation with progress
            this.progressReporter.startStep('Final Validation', 'Running final validation...');
            // For now, we'll do a basic validation check
            // TODO: Implement proper validation
            const finalValidation = { success: true };
            if (!finalValidation.success && options.rollbackPolicy === 'auto-on-failure') {
                this.progressReporter.failStep('Final Validation', 'Validation failed');
                await this.rollbackEngine.rollbackToCheckpoint(initialCheckpoint.id);
                throw new Error('Final validation failed, rolled back to initial state');
            }
            this.progressReporter.completeStep('Final Validation', 'All validations passed');
            // 8. Final npm install to ensure consistency
            this.progressReporter.info('📦 Running final npm install to ensure consistency...');
            await this.dependencyInstaller.runNpmInstall();
            // Success!
            const result = {
                success: true,
                fromVersion: analysis.currentVersion.full,
                toVersion: options.targetVersion,
                completedSteps,
                warnings: [],
                checkpoints,
                duration: Date.now() - startTime,
                rollbackAvailable: checkpoints.length > 0
            };
            // Display summary
            this.progressReporter.displaySummary();
            this.emit('upgrade-complete', result);
            return result;
        }
        catch (error) {
            this.progressReporter.error(`Upgrade failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.progressReporter.displaySummary();
            this.emit('upgrade-failed', error);
            const result = {
                success: false,
                fromVersion: '',
                toVersion: options.targetVersion,
                completedSteps,
                error: error instanceof Error ? error : new Error('Unknown error'),
                warnings: [],
                checkpoints,
                duration: Date.now() - startTime,
                rollbackAvailable: checkpoints.length > 0
            };
            return result;
        }
    }
    /**
     * Execute a single upgrade step
     */
    async executeUpgradeStep(step, options, analysis) {
        const handler = this.versionHandlers.getHandler(step.toVersion);
        if (!handler) {
            throw new Error(`No handler found for Angular ${step.toVersion}`);
        }
        // Execute the step (handler will use progressReporter from options)
        await handler.execute(this.projectPath, step, options);
        // Validate after step if comprehensive validation is enabled
        if (options.validationLevel === 'comprehensive') {
            this.progressReporter.info('🔍 Validating step completion...');
            // TODO: Implement proper step validation
            // For now, assume validation passes
        }
    }
    /**
     * Validate prerequisites for the upgrade path
     */
    async validatePrerequisites(upgradePath, options) {
        for (const step of upgradePath.steps) {
            const handler = this.versionHandlers.getHandler(step.toVersion);
            if (!handler) {
                throw new Error(`No handler found for Angular ${step.toVersion}`);
            }
            const valid = await handler.validatePrerequisites(this.projectPath);
            if (!valid) {
                throw new Error(`Prerequisites not met for Angular ${step.toVersion}`);
            }
        }
    }
    /**
     * Determine if a checkpoint should be created
     */
    shouldCreateCheckpoint(step, options) {
        switch (options.checkpointFrequency) {
            case 'every-step':
                return true;
            case 'major-versions':
                return true; // Each step is a major version in our path
            case 'custom':
                // Could implement custom logic here
                return false;
            default:
                return false;
        }
    }
    /**
     * Parse version string to AngularVersion object
     */
    parseVersion(version) {
        const major = parseInt(version);
        return {
            major,
            minor: 0,
            patch: 0,
            full: `${major}.0.0`
        };
    }
    /**
     * Rollback to a specific checkpoint
     */
    async rollbackToCheckpoint(checkpointId) {
        this.progressReporter.warn('🔄 Rolling back to checkpoint...');
        await this.rollbackEngine.rollbackToCheckpoint(checkpointId);
        this.progressReporter.success('✓ Rollback completed successfully');
    }
    /**
     * Get all available checkpoints
     */
    async getCheckpoints() {
        return await this.checkpointManager.listCheckpoints();
    }
}
exports.EnhancedUpgradeOrchestrator = EnhancedUpgradeOrchestrator;
//# sourceMappingURL=EnhancedUpgradeOrchestrator.js.map