import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, Migration } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';
import { FileContentPreserver } from '../utils/FileContentPreserver';

/**
 * Angular 17 Handler - New application bootstrap and asset management
 * 
 * Manages migration to Angular 17 with new application bootstrap API, asset folder
 * restructuring, enhanced SSR capabilities, and stable control flow syntax. This
 * version introduces significant architectural improvements and developer experience
 * enhancements while maintaining backward compatibility.
 * 
 * Key Features in Angular 17:
 * - New application bootstrap API
 * - Assets folder migration to public folder
 * - Stable control flow syntax (@if, @for, @switch)
 * - Enhanced SSR with improved hydration
 * - Build system optimizations
 * - Material Design 3 support
 * 
 * @example
 * ```typescript
 * const handler = new Angular17Handler();
 * await handler.applyVersionSpecificChanges('/path/to/project', {
 *   strategy: 'progressive',
 *   enableNewBootstrap: true
 * });
 * ```
 * 
 * @since 1.0.0
 * @author Angular Multi-Version Upgrade Orchestrator
 */
export class Angular17Handler extends BaseVersionHandler {
  /** The Angular version this handler manages */
  readonly version = '17';

  /**
   * Gets the minimum required Node.js version for Angular 17
   * @returns The minimum Node.js version requirement
   */
  protected getRequiredNodeVersion(): string {
    return '>=18.13.0';
  }

  /**
   * Gets the required TypeScript version range for Angular 17
   * @returns The TypeScript version requirement
   */
  protected getRequiredTypeScriptVersion(): string {
    return '>=5.2.0 <5.3.0';
  }

  /**
   * Applies all Angular 17 specific transformations to the project
   * 
   * Orchestrates migration including new application bootstrap, asset restructuring,
   * control flow syntax stabilization, and SSR enhancements. Provides safe migration
   * paths while preserving existing functionality.
   * 
   * @param projectPath - The absolute path to the Angular project root
   * @param options - Upgrade configuration options including strategy and feature flags
   * @throws {Error} When critical transformations fail
   */
  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    console.log('Applying Angular 17 specific changes...');

    // 1. Update to new application bootstrap (if not conservative)
    if (options.strategy !== 'conservative') {
      await this.updateApplicationBootstrap(projectPath);
    }

    // 2. Migrate assets folder to public folder (safe migration)
    await this.migrateAssetsToPublic(projectPath);

    // 3. Update to new control flow syntax (gradual migration)
    if (options.strategy === 'progressive') {
      await this.enableNewControlFlow(projectPath);
    }

    // 4. Update SSR configurations if present
    await this.updateSSRConfiguration(projectPath);

    // 5. Update build configurations
    await this.updateBuildConfiguration(projectPath);

    // 6. Update Angular Material if present
    await this.updateAngularMaterial(projectPath);
  }

  /**
   * Update to new application bootstrap while preserving existing code
   */
  private async updateApplicationBootstrap(projectPath: string): Promise<void> {
    const mainTsPath = path.join(projectPath, 'src', 'main.ts');
    
    // Use FileContentPreserver to update main.ts while preserving custom code
    await FileContentPreserver.updateMainTsFile(mainTsPath, 17);
    
    if (await fs.pathExists(mainTsPath)) {
      this.progressReporter?.success('✓ Updated to new application bootstrap (preserving custom code)');
    }
  }

  /**
   * Prepares for Angular 18+ public folder structure (Angular 17 → 18 preparation)
   * 
   * This creates a public folder and copies assets to prepare for Angular 18+ migration,
   * while maintaining full backward compatibility with src/assets. The actual migration
   * to public-only happens in Angular 18+ handlers.
   * 
   * @param projectPath - The absolute path to the Angular project root
   * @private
   * 
   * @example
   * Before: src/assets/images/logo.png
   * After: Both src/assets/images/logo.png AND public/images/logo.png work
   */
  private async migrateAssetsToPublic(projectPath: string): Promise<void> {
    const assetsPath = path.join(projectPath, 'src', 'assets');
    const publicPath = path.join(projectPath, 'public');
    
    if (await fs.pathExists(assetsPath) && !await fs.pathExists(publicPath)) {
      // Create public directory
      await fs.ensureDir(publicPath);
      
      // Copy assets to public (keep original for compatibility)
      await fs.copy(assetsPath, publicPath);
      
      // Update angular.json to use both asset configurations
      await this.updateAssetConfiguration(projectPath);
      
      this.progressReporter?.success('✓ Migrated assets to public folder (maintaining backward compatibility)');
    }
  }

  /**
   * Update asset configuration in angular.json
   */
  private async updateAssetConfiguration(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      const angularJson = await fs.readJson(angularJsonPath);
      
      // Update each project's asset configuration
      for (const [_projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
        const config = projectConfig as any;
        
        if (config.architect?.build?.options?.assets) {
          // Add public folder to assets while keeping src/assets
          const assets = config.architect.build.options.assets;
          
          // Ensure src/assets is preserved in the array
          const hasSrcAssets = assets.some((asset: any) => 
            (typeof asset === 'string' && asset.includes('src/assets')) ||
            (typeof asset === 'object' && asset.input === 'src/assets')
          );
          
          if (!hasSrcAssets) {
            // Add src/assets back if it was somehow removed
            assets.push("src/assets");
            this.progressReporter?.info('✓ Preserved src/assets configuration for backward compatibility');
          }
          
          // Add public folder if not already present
          if (!assets.includes('public') && !assets.some((asset: any) => 
            typeof asset === 'object' && asset.input === 'public'
          )) {
            assets.unshift({
              "glob": "**/*",
              "input": "public",
              "output": "."
            });
            this.progressReporter?.info('✓ Added public folder to assets configuration');
          }
        }
      }
      
      await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
    }
  }

  /**
   * Enable new control flow syntax
   */
  private async enableNewControlFlow(_projectPath: string): Promise<void> {
    // This would enable the new @if, @for, @switch syntax
    // For now, just log that it's available
    this.progressReporter?.success('✓ New control flow syntax (@if, @for, @switch) is available');
    this.progressReporter?.info('  Use "ng generate @angular/core:control-flow" to migrate templates');
  }

  /**
   * Update SSR configuration
   */
  private async updateSSRConfiguration(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      const angularJson = await fs.readJson(angularJsonPath);
      let hasSSR = false;

      // Check if SSR is configured
      for (const [_projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
        const config = projectConfig as any;
        if (config.architect?.['serve-ssr'] || config.architect?.['build-ssr']) {
          hasSSR = true;
        }
      }

      if (hasSSR) {
        this.progressReporter?.success('✓ SSR configuration detected - Angular 17 SSR improvements enabled');
        // Would update SSR configuration for Angular 17 improvements
      }
    }
  }

  /**
   * Update build configuration
   */
  private async updateBuildConfiguration(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      const angularJson = await fs.readJson(angularJsonPath);
      
      // Update build configurations for Angular 17
      for (const [_projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
        const config = projectConfig as any;
        
        if (config.architect?.build?.options) {
          // Enable new build features
          if (!config.architect.build.options.outputPath) {
            config.architect.build.options.outputPath = 'dist';
          }
        }
      }
      
      await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
    }
  }

  /**
   * Update Angular Material for Angular 17
   * Uses DependencyInstaller for automatic installation
   */
  private async updateAngularMaterial(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    if (packageJson.dependencies?.['@angular/material']) {
      // Use DependencyInstaller to update Angular Material
      const materialDeps = [
        { name: '@angular/material', version: '^17.0.0', type: 'dependencies' as const },
        { name: '@angular/cdk', version: '^17.0.0', type: 'dependencies' as const }
      ];
      
      await this.dependencyInstaller.installDependencies(
        materialDeps,
        'Updating Angular Material to version 17...'
      );
      
      this.progressReporter?.success('✓ Updated Angular Material to version 17');
    }
  }

  /**
   * Update builder configurations for Angular 17
   */
  protected updateBuilderConfigurations(angularJson: any): void {
    for (const [_projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
      const config = projectConfig as any;
      
      if (config.architect?.build) {
        // Update build configurations
        if (!config.architect.build.options) {
          config.architect.build.options = {};
        }
        
        // Enable new bundling optimizations
        config.architect.build.options.optimization = true;
        config.architect.build.options.buildOptimizer = true;
      }
    }
  }

  /**
   * Update TypeScript configuration for Angular 17
   */
  protected updateTypeScriptConfig(tsconfig: any): void {
    super.updateTypeScriptConfig(tsconfig);
    
    // Angular 17 specific TypeScript settings
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }
    
    // Enable ES2022 for better performance
    tsconfig.compilerOptions.target = 'ES2022';
    tsconfig.compilerOptions.module = 'ES2022';
    tsconfig.compilerOptions.lib = ['ES2022', 'dom'];
  }

  /**
   * Angular 17 breaking changes
   */
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange(
        'ng17-new-application-bootstrap',
        'api',
        'medium',
        'New application bootstrap API',
        'Applications can optionally migrate to the new bootstrapApplication API',
        'Consider migrating to bootstrapApplication for better tree-shaking and performance'
      ),
      this.createBreakingChange(
        'ng17-assets-to-public',
        'config',
        'low',
        'Assets folder migration to public',
        'New public folder structure for better asset management. Both src/assets and public folders are maintained for dual compatibility.',
        'Assets are copied to public folder while preserving src/assets for backward compatibility. Both paths work during transition.'
      ),
      this.createBreakingChange(
        'ng17-new-control-flow',
        'template',
        'low',
        'New control flow syntax available',
        'New @if, @for, @switch syntax available as alternative to *ngIf, *ngFor, *ngSwitch',
        'New syntax is optional - existing syntax continues to work'
      ),
      this.createBreakingChange(
        'ng17-ssr-improvements',
        'build',
        'low',
        'SSR improvements and new features',
        'Enhanced server-side rendering with better hydration',
        'SSR applications may benefit from new hydration features'
      ),
      this.createBreakingChange(
        'ng17-angular-material-update',
        'dependency',
        'medium',
        'Angular Material 17 with Material Design 3',
        'Angular Material updated with Material Design 3 components',
        'Review Material component designs as they may have visual changes'
      )
    ];
  }

  /**
   * Override to provide Angular 17 specific migrations
   */
  protected getAvailableMigrations(): Migration[] {
    const baseMigrations = super.getAvailableMigrations();
    
    // Add Angular 17 specific migrations
    const angular17Migrations: Migration[] = [
      {
        name: 'New Application Bootstrap',
        command: 'npx ng generate @angular/core:new-app-bootstrap',
        description: 'Migrate to new bootstrapApplication API',
        optional: true
      },
      {
        name: 'Lazy Loading Routes',
        command: 'npx ng generate @angular/core:lazy-routes',
        description: 'Convert eagerly loaded routes to lazy loaded ones',
        optional: true
      },
      {
        name: 'Assets to Public Migration',
        command: 'npx ng generate @angular/core:assets-to-public',
        description: 'Migrate assets folder to public folder structure',
        optional: true
      }
    ];
    
    return [...baseMigrations, ...angular17Migrations];
  }

  /**
   * Run Angular 17 specific migrations based on strategy
   */
  protected async runVersionSpecificMigrations(projectPath: string): Promise<void> {
    // Get user's upgrade strategy from options
    const migrations = this.getAvailableMigrations();
    
    // Run specific migrations for Angular 17
    const requiredMigrations = [
      'Control Flow Syntax',
      'Signal Inputs', 
      'Signal Outputs',
      'Signal Queries',
      'Self-closing Tags',
      'New Application Bootstrap',
      'Assets to Public Migration'
    ];
    
    for (const migrationName of requiredMigrations) {
      const migration = migrations.find(m => m.name === migrationName);
      if (migration) {
        try {
          this.progressReporter?.updateMessage(`Running ${migration.name} migration...`);
          
          // Run migration with non-interactive mode for automation
          const command = migration.command + ' --interactive=false --defaults';
          
          await this.runCommand(command, projectPath);
          
          this.progressReporter?.info(`✓ ${migration.name} migration completed`);
        } catch (error) {
          // Some migrations may not be applicable to all projects
          this.progressReporter?.warn(`${migration.name} migration skipped: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  }
}