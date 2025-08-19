import { BaseVersionHandler } from './BaseVersionHandler';
import { UpgradeStep, UpgradeOptions, BreakingChange } from '../types';
import { AngularSchematicsRunner } from '../utils/AngularSchematicsRunner';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Enhanced version handler that combines Angular's official schematics
 * with custom intelligence for complex code scenarios
 */
export abstract class HybridVersionHandler extends BaseVersionHandler {
  protected schematicsRunner!: AngularSchematicsRunner;

  constructor() {
    super();
  }

  /**
   * Enhanced execute method using hybrid approach
   */
  async execute(projectPath: string, step: UpgradeStep, options: UpgradeOptions): Promise<void> {
    // Initialize schematics runner
    this.schematicsRunner = new AngularSchematicsRunner(projectPath, this.progressReporter);
    this.dependencyInstaller = new (await import('../utils/DependencyInstaller')).DependencyInstaller(projectPath);
    this.progressReporter = options.progressReporter || new (await import('../utils/ProgressReporter')).ProgressReporter();

    this.progressReporter.startStep(`Angular ${this.version} Hybrid Upgrade`, `Starting Angular ${this.version} hybrid upgrade...`);

    try {
      // Phase 1: Analyze project complexity
      const migrationPlan = await this.analyzeProjectComplexity(projectPath);
      this.progressReporter.info(`Migration complexity: ${migrationPlan.complexity}/5`);

      // Phase 2: Try Angular's official migrations first
      await this.runOfficialAngularMigrations(projectPath, step, options, migrationPlan);

      // Phase 3: Apply custom logic for complex scenarios
      await this.applyCustomMigrations(projectPath, step, options, migrationPlan);

      // Phase 4: Enhance with best practices
      await this.enhanceWithBestPractices(projectPath, options);

      // Phase 5: Final validation and optimization
      await this.validateAndOptimize(projectPath, options);

      this.progressReporter.completeStep(`Angular ${this.version} Hybrid Upgrade`, `Angular ${this.version} hybrid upgrade completed successfully`);
    } catch (error) {
      this.progressReporter.failStep(`Angular ${this.version} Hybrid Upgrade`, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Analyze project complexity to determine migration strategy
   */
  private async analyzeProjectComplexity(projectPath: string): Promise<MigrationPlan> {
    this.progressReporter.updateMessage('Analyzing project complexity...');

    const analysis = {
      hasCustomDecorators: await this.hasCustomDecorators(projectPath),
      hasComplexServices: await this.hasComplexServices(projectPath),
      hasCustomArchitecture: await this.hasCustomArchitecture(projectPath),
      hasThirdPartyIntegrations: await this.hasThirdPartyIntegrations(projectPath),
      hasCustomStateManagement: await this.hasCustomStateManagement(projectPath)
    };

    // Calculate complexity score (0-5)
    const complexity = Object.values(analysis).filter(Boolean).length;

    return {
      complexity,
      canUseOfficialSchematics: complexity <= 2,
      customMigrationsNeeded: Object.entries(analysis)
        .filter(([_, value]) => value)
        .map(([key, _]) => key),
      riskLevel: complexity <= 1 ? 'low' : complexity <= 3 ? 'medium' : 'high',
      recommendedApproach: complexity <= 2 ? 'schematics-first' : 'custom-first'
    };
  }

  /**
   * Run Angular's official migrations
   */
  private async runOfficialAngularMigrations(
    projectPath: string,
    step: UpgradeStep,
    options: UpgradeOptions,
    plan: MigrationPlan
  ): Promise<void> {
    if (plan.recommendedApproach === 'custom-first') {
      this.progressReporter.info('Skipping official schematics due to high complexity');
      return;
    }

    this.progressReporter.updateMessage('Running Angular official migrations...');

    try {
      // 1. Run ng update
      const updateResult = await this.schematicsRunner.runNgUpdate(step.toVersion, {
        force: options.strategy === 'progressive',
        createCommits: false // We handle commits ourselves
      });

      if (updateResult.success) {
        this.progressReporter.success('✓ Angular official migrations completed');
        
        // 2. Run version-specific schematics
        await this.schematicsRunner.runModernizationSchematics(parseInt(step.toVersion));
      } else {
        this.progressReporter.warn('Official migrations had issues, proceeding with custom approach');
      }
    } catch (error) {
      this.progressReporter.warn('Official schematics failed, using custom fallback');
      // Continue with custom migrations
    }
  }

  /**
   * Apply custom migrations for complex scenarios
   */
  private async applyCustomMigrations(
    projectPath: string,
    step: UpgradeStep,
    options: UpgradeOptions,
    plan: MigrationPlan
  ): Promise<void> {
    this.progressReporter.updateMessage('Applying custom migrations for complex code...');

    // Apply version-specific custom changes
    await this.applyVersionSpecificChanges(projectPath, options);

    // Handle complex patterns that schematics can't handle
    for (const pattern of plan.customMigrationsNeeded) {
      await this.handleCustomPattern(projectPath, pattern, options);
    }

    // Preserve and enhance custom code
    await this.preserveAndEnhanceCustomCode(projectPath, options);
  }

  /**
   * Enhance code with best practices
   */
  private async enhanceWithBestPractices(projectPath: string, options: UpgradeOptions): Promise<void> {
    if (options.strategy === 'conservative') {
      return; // Skip enhancements for conservative strategy
    }

    this.progressReporter.updateMessage('Applying best practices enhancements...');

    // Update dependencies to use latest features
    await this.dependencyInstaller.updateAngularPackages(this.version);

    // Apply architectural improvements
    await this.applyArchitecturalImprovements(projectPath);

    // Optimize performance
    await this.optimizePerformance(projectPath);

    // Update configuration files with best practices
    await this.updateConfigurationFiles(projectPath, options);
  }

  /**
   * Validate and optimize the migration results
   */
  private async validateAndOptimize(projectPath: string, options: UpgradeOptions): Promise<void> {
    this.progressReporter.updateMessage('Validating migration results...');

    // Run build to ensure everything compiles
    try {
      await this.runCommand('npm run build', projectPath);
      this.progressReporter.success('✓ Build validation passed');
    } catch (error) {
      this.progressReporter.warn('Build validation failed, applying fixes...');
      await this.applyBuildFixes(projectPath);
    }

    // Run tests if available
    if (options.validationLevel === 'comprehensive') {
      try {
        await this.runCommand('npm test -- --watch=false', projectPath);
        this.progressReporter.success('✓ Test validation passed');
      } catch (error) {
        this.progressReporter.warn('Some tests failed after migration');
      }
    }
  }

  /**
   * Handle specific custom patterns
   */
  private async handleCustomPattern(projectPath: string, pattern: string, options: UpgradeOptions): Promise<void> {
    switch (pattern) {
      case 'hasCustomDecorators':
        await this.migrateCustomDecorators(projectPath);
        break;
      case 'hasComplexServices':
        await this.migrateComplexServices(projectPath);
        break;
      case 'hasCustomArchitecture':
        await this.migrateCustomArchitecture(projectPath);
        break;
      case 'hasThirdPartyIntegrations':
        await this.migrateThirdPartyIntegrations(projectPath);
        break;
      case 'hasCustomStateManagement':
        await this.migrateCustomStateManagement(projectPath);
        break;
    }
  }

  // Abstract methods for complexity analysis
  protected abstract hasCustomDecorators(projectPath: string): Promise<boolean>;
  protected abstract hasComplexServices(projectPath: string): Promise<boolean>;
  protected abstract hasCustomArchitecture(projectPath: string): Promise<boolean>;
  protected abstract hasThirdPartyIntegrations(projectPath: string): Promise<boolean>;
  protected abstract hasCustomStateManagement(projectPath: string): Promise<boolean>;

  // Abstract methods for custom migrations
  protected abstract migrateCustomDecorators(projectPath: string): Promise<void>;
  protected abstract migrateComplexServices(projectPath: string): Promise<void>;
  protected abstract migrateCustomArchitecture(projectPath: string): Promise<void>;
  protected abstract migrateThirdPartyIntegrations(projectPath: string): Promise<void>;
  protected abstract migrateCustomStateManagement(projectPath: string): Promise<void>;

  // Abstract methods for enhancements
  protected abstract applyArchitecturalImprovements(projectPath: string): Promise<void>;
  protected abstract optimizePerformance(projectPath: string): Promise<void>;
  protected abstract applyBuildFixes(projectPath: string): Promise<void>;

  /**
   * Preserve and enhance custom code patterns
   */
  protected async preserveAndEnhanceCustomCode(projectPath: string, options: UpgradeOptions): Promise<void> {
    // Use FileContentPreserver to maintain custom code
    const mainTsPath = path.join(projectPath, 'src', 'main.ts');
    if (await fs.pathExists(mainTsPath)) {
      const FileContentPreserver = (await import('../utils/FileContentPreserver')).FileContentPreserver;
      await FileContentPreserver.updateMainTsFile(mainTsPath, parseInt(this.version));
    }

    // Update component files while preserving custom logic
    await this.updateComponentFiles(projectPath, []);

    // Update template files with optional new syntax
    if (options.strategy !== 'conservative') {
      await this.updateTemplateFiles(projectPath);
    }
  }
}

/**
 * Migration plan interface
 */
interface MigrationPlan {
  complexity: number;
  canUseOfficialSchematics: boolean;
  customMigrationsNeeded: string[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendedApproach: 'schematics-first' | 'custom-first';
}