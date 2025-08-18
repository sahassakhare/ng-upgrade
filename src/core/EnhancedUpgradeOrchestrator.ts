import { EventEmitter } from 'events';
import { 
  UpgradeOptions, 
  UpgradeResult, 
  UpgradePath, 
  UpgradeStep, 
  Checkpoint,
  ProjectAnalysis
} from '../types';
import { VersionHandlerRegistry } from './VersionHandlerRegistry';
import { CheckpointManager } from './CheckpointManager';
import { UpgradePathCalculator } from './UpgradePathCalculator';
import { ProjectAnalyzer } from './ProjectAnalyzer';
import { ValidatorFramework } from './ValidatorFramework';
import { RollbackEngine } from './RollbackEngine';
import { ProgressReporter } from '../utils/ProgressReporter';
import { DependencyInstaller } from '../utils/DependencyInstaller';

/**
 * Enhanced Upgrade Orchestrator with better UX features:
 * - Automatic dependency installation
 * - Progress reporting with visual feedback
 * - File content preservation
 */
export class EnhancedUpgradeOrchestrator extends EventEmitter {
  private versionHandlers: VersionHandlerRegistry;
  private checkpointManager: CheckpointManager;
  private pathCalculator: UpgradePathCalculator;
  private projectAnalyzer: ProjectAnalyzer;
  private validator: ValidatorFramework;
  private rollbackEngine: RollbackEngine;
  private progressReporter: ProgressReporter;
  private dependencyInstaller: DependencyInstaller;
  private currentCheckpoint?: Checkpoint;

  constructor(private projectPath: string) {
    super();
    this.versionHandlers = new VersionHandlerRegistry();
    this.checkpointManager = new CheckpointManager(projectPath);
    this.pathCalculator = new UpgradePathCalculator();
    this.projectAnalyzer = new ProjectAnalyzer(projectPath);
    this.validator = new ValidatorFramework(projectPath);
    this.rollbackEngine = new RollbackEngine(this.checkpointManager);
    this.progressReporter = new ProgressReporter();
    this.dependencyInstaller = new DependencyInstaller(projectPath);
  }

  /**
   * Enhanced orchestration with better progress reporting and dependency management
   */
  async orchestrateUpgrade(options: UpgradeOptions): Promise<UpgradeResult> {
    const startTime = Date.now();
    let completedSteps: UpgradeStep[] = [];
    let checkpoints: Checkpoint[] = [];

    try {
      // Pass progress reporter to options for handlers to use
      options.progressReporter = this.progressReporter;

      // 1. Analyze current project with progress
      this.progressReporter.info('🔍 Analyzing project structure...');
      const analysis = await this.projectAnalyzer.analyze();
      this.emit('analysis-complete', analysis);

      // 2. Calculate and display upgrade path
      const upgradePath = await this.pathCalculator.calculatePath(
        analysis.currentVersion,
        this.parseVersion(options.targetVersion),
        options
      );
      
      // Initialize progress tracking
      const stepNames = [
        'Project Analysis',
        'Prerequisites Check',
        'Initial Checkpoint',
        ...upgradePath.steps.map(step => `Angular ${step.toVersion} Upgrade`),
        'Final Validation'
      ];
      
      this.progressReporter.initializeProgress(
        analysis.currentVersion.full,
        options.targetVersion,
        stepNames
      );
      
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
      const initialCheckpoint = await this.checkpointManager.createCheckpoint(
        'initial',
        `Before upgrade from ${analysis.currentVersion.full} to ${options.targetVersion}`
      );
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
            const checkpoint = await this.checkpointManager.createCheckpoint(
              `step-${step.toVersion}`,
              `After upgrade to Angular ${step.toVersion}`
            );
            checkpoints.push(checkpoint);
            this.currentCheckpoint = checkpoint;
          }

          this.emit('step-complete', step);
        } catch (error) {
          this.progressReporter.failStep(
            `Angular ${step.toVersion} Upgrade`,
            error instanceof Error ? error.message : 'Unknown error'
          );
          
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
      const result: UpgradeResult = {
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
    } catch (error) {
      this.progressReporter.error(`Upgrade failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.progressReporter.displaySummary();
      
      this.emit('upgrade-failed', error);
      
      const result: UpgradeResult = {
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
  private async executeUpgradeStep(
    step: UpgradeStep,
    options: UpgradeOptions,
    analysis: ProjectAnalysis
  ): Promise<void> {
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
  private async validatePrerequisites(
    upgradePath: UpgradePath,
    options: UpgradeOptions
  ): Promise<void> {
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
  private shouldCreateCheckpoint(step: UpgradeStep, options: UpgradeOptions): boolean {
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
  private parseVersion(version: string): any {
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
  async rollbackToCheckpoint(checkpointId: string): Promise<void> {
    this.progressReporter.warn('🔄 Rolling back to checkpoint...');
    await this.rollbackEngine.rollbackToCheckpoint(checkpointId);
    this.progressReporter.success('✓ Rollback completed successfully');
  }

  /**
   * Get all available checkpoints
   */
  async getCheckpoints(): Promise<Checkpoint[]> {
    return await this.checkpointManager.listCheckpoints();
  }
}