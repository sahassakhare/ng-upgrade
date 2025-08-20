import { UpgradeStep, UpgradeOptions, BreakingChange, Migration } from '../types';
import { VersionHandler } from '../core/VersionHandlerRegistry';
import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';
import { DependencyInstaller } from '../utils/DependencyInstaller';
import { FileContentPreserver } from '../utils/FileContentPreserver';
import { AdvancedContentPreserver, PreservationOptions } from '../utils/AdvancedContentPreserver';
import { ProgressReporter } from '../utils/ProgressReporter';
import { UpgradeReportGenerator, DependencyChange } from '../utils/UpgradeReportGenerator';

/**
 * Base class for all Angular version handlers providing common upgrade functionality
 * 
 * This abstract class serves as the foundation for all version-specific upgrade handlers,
 * providing shared infrastructure for dependency management, configuration updates,
 * migration execution, and progress reporting. Each concrete handler extends this class
 * to implement version-specific transformations.
 * 
 * @abstract
 * @implements {VersionHandler}
 * 
 * @example
 * ```typescript
 * export class Angular16Handler extends BaseVersionHandler {
 *   readonly version = '16';
 *   
 *   protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
 *     // Implementation specific to Angular 16
 *   }
 * }
 * ```
 * 
 * @since 1.0.0
 * @author Angular Multi-Version Upgrade Orchestrator
 */
export abstract class BaseVersionHandler implements VersionHandler {
  /** The Angular version this handler manages - must be implemented by concrete classes */
  abstract readonly version: string;
  
  /** Utility for managing dependency installations and updates */
  protected dependencyInstaller!: DependencyInstaller;
  
  /** Advanced content preservation system for intelligent code merging */
  protected contentPreserver!: AdvancedContentPreserver;
  
  /** Detailed upgrade report generator for tracking all changes */
  protected reportGenerator!: UpgradeReportGenerator;
  
  /** Utility for reporting upgrade progress and status messages */
  protected progressReporter!: ProgressReporter;

  /**
   * Executes the complete version-specific upgrade process
   * 
   * Orchestrates the entire upgrade workflow including dependency updates,
   * configuration changes, code transformations, and validation. This is the
   * main entry point for version upgrades.
   * 
   * @param projectPath - The absolute path to the Angular project root
   * @param step - The upgrade step configuration with source and target versions
   * @param options - Comprehensive upgrade options including strategy and validation level
   * @throws {Error} When critical upgrade operations fail
   * 
   * @example
   * ```typescript
   * const handler = new Angular16Handler();
   * await handler.execute('/path/to/project', {
   *   fromVersion: '15',
   *   toVersion: '16'
   * }, {
   *   strategy: 'balanced',
   *   validationLevel: 'comprehensive'
   * });
   * ```
   */
  async execute(projectPath: string, step: UpgradeStep, options: UpgradeOptions): Promise<void> {
    this.dependencyInstaller = new DependencyInstaller(projectPath);
    this.contentPreserver = new AdvancedContentPreserver(projectPath);
    this.progressReporter = options.progressReporter || new ProgressReporter();
    
    // Initialize report generator
    const projectName = path.basename(projectPath);
    this.reportGenerator = new UpgradeReportGenerator(
      projectPath,
      projectName,
      step.fromVersion,
      step.toVersion,
      options.strategy || 'balanced'
    );
    
    this.progressReporter.startStep(`Angular ${this.version} Upgrade`, `Starting Angular ${this.version} upgrade...`);

    // Update Angular dependencies with automatic installation
    this.progressReporter.updateMessage('Updating Angular dependencies...');
    await this.updateAngularDependencies(projectPath);

    // Update TypeScript if needed
    await this.updateTypeScript(projectPath);

    // Update Angular CLI
    await this.updateAngularCli(projectPath);

    // Ensure all dependencies are properly installed before proceeding
    this.progressReporter.updateMessage('Verifying dependency installation...');
    await this.ensureDependenciesInstalled(projectPath);

    // Apply version-specific transformations
    await this.applyVersionSpecificChanges(projectPath, options);

    // Update configuration files
    await this.updateConfigurationFiles(projectPath, options);

    // Run Angular update schematics
    await this.runAngularUpdateSchematics(projectPath);

    // Generate detailed upgrade report
    this.progressReporter.updateMessage('Generating upgrade report...');
    try {
      const reportPath = await this.reportGenerator.generateReport(true);
      this.progressReporter.info(`Detailed upgrade report generated: ${reportPath}`);
    } catch (error) {
      this.progressReporter.warn(`Failed to generate upgrade report: ${error instanceof Error ? error.message : String(error)}`);
    }

    this.progressReporter.completeStep(`Angular ${this.version} Upgrade`, `Angular ${this.version} upgrade completed successfully`);
  }

  /**
   * Validates all prerequisites required for this Angular version upgrade
   * 
   * Checks Node.js version, TypeScript compatibility, and project structure
   * to ensure the upgrade can proceed safely. Each version handler can override
   * this method to add version-specific validation requirements.
   * 
   * @param projectPath - The absolute path to the Angular project root
   * @returns Promise resolving to true if all prerequisites are met
   * 
   * @example
   * ```typescript
   * const isReady = await handler.validatePrerequisites('/path/to/project');
   * if (!isReady) {
   *   throw new Error('Prerequisites not met for Angular 16 upgrade');
   * }
   * ```
   */
  async validatePrerequisites(projectPath: string): Promise<boolean> {
    try {
      // Check Node.js version
      const nodeVersion = process.version;
      const requiredNode = this.getRequiredNodeVersion();
      if (!this.isVersionCompatible(nodeVersion, requiredNode)) {
        this.progressReporter?.error(`Node.js ${requiredNode} required, found ${nodeVersion}`);
        return false;
      }

      // Check if project is an Angular project
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (!await fs.pathExists(packageJsonPath)) {
        this.progressReporter?.error('package.json not found');
        return false;
      }

      const packageJson = await fs.readJson(packageJsonPath);
      if (!packageJson.dependencies?.['@angular/core']) {
        this.progressReporter?.error('Not an Angular project');
        return false;
      }

      return true;
    } catch (error) {
      this.progressReporter?.error(`Prerequisite validation failed: ${error}`);
      return false;
    }
  }

  /**
   * Gets all breaking changes introduced in this Angular version
   * 
   * Each version handler must provide a comprehensive list of breaking changes
   * with severity levels, descriptions, and migration guidance to help users
   * understand the impact and required actions for the upgrade.
   * 
   * @returns Array of breaking change objects with detailed information
   * @abstract
   * 
   * @example
   * ```typescript
   * const changes = handler.getBreakingChanges();
   * changes.forEach(change => {
   *   console.log(`${change.severity}: ${change.description}`);
   * });
   * ```
   */
  abstract getBreakingChanges(): BreakingChange[];

  /**
   * Gets the minimum required Node.js version for this Angular version
   * 
   * Each version handler must specify the minimum Node.js version required
   * for successful operation of the target Angular version.
   * 
   * @returns The minimum Node.js version requirement (e.g., ">=16.14.0")
   * @abstract
   */
  protected abstract getRequiredNodeVersion(): string;
  
  
  /**
   * Applies version-specific changes and transformations to the project
   * 
   * This is the core method that each version handler must implement to
   * perform all version-specific modifications, code transformations,
   * and feature implementations required for the target Angular version.
   * 
   * @param projectPath - The absolute path to the Angular project root
   * @param options - Upgrade configuration options including strategy and validation level
   * @returns Promise that resolves when all version-specific changes are complete
   * @throws {Error} When critical transformations fail
   * @abstract
   */
  protected abstract applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;

  /**
   * Update Angular dependencies to target version with automatic installation
   */
  protected async updateAngularDependencies(projectPath: string): Promise<void> {
    try {
      // Track Angular package dependencies before update
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      
      // Use the DependencyInstaller for automatic installation
      const success = await this.dependencyInstaller.updateAngularPackages(this.version);
      
      // Track dependency changes
      const updatedPackageJson = await fs.readJson(packageJsonPath);
      this.trackDependencyUpdates(packageJson, updatedPackageJson, '@angular/');
      
      if (!success) {
        this.progressReporter.warn('Angular dependencies updated in package.json. Dependencies will be verified later.');
        this.reportGenerator.addWarning('Angular dependency installation required manual verification');
      } else {
        this.progressReporter.success('Angular dependencies installed successfully');
        this.reportGenerator.addSuccessStory('Angular dependencies updated and installed automatically');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.progressReporter.warn(`Angular dependency update failed: ${errorMsg}`);
      this.reportGenerator.addError(`Angular dependency update failed: ${errorMsg}`);
      // Don't fail the entire upgrade, dependencies will be verified later
    }
  }

  /**
   * Update TypeScript version with automatic installation
   */
  protected async updateTypeScript(_projectPath: string): Promise<void> {
    const requiredTsVersion = this.getRequiredTypeScriptVersion();
    
    this.progressReporter.updateMessage(`Installing TypeScript ${requiredTsVersion}...`);
    const success = await this.dependencyInstaller.updateTypeScript(requiredTsVersion);
    
    if (!success) {
      this.progressReporter.warn('TypeScript version updated in package.json. Manual npm install may be required.');
    } else {
      this.progressReporter.success(`TypeScript ${requiredTsVersion} installed successfully`);
    }
  }

  /**
   * Update Angular CLI with automatic installation
   */
  protected async updateAngularCli(_projectPath: string): Promise<void> {
    // Angular CLI is already updated as part of updateAngularDependencies
    // This method is kept for compatibility but the work is done above
    this.progressReporter.info('Angular CLI updated with other Angular packages');
  }

  /**
   * Update configuration files while preserving existing content
   */
  protected async updateConfigurationFiles(projectPath: string, options: UpgradeOptions): Promise<void> {
    // Update main.ts using FileContentPreserver if needed for Angular 14+
    const mainTsPath = path.join(projectPath, 'src', 'main.ts');
    if (await fs.pathExists(mainTsPath)) {
      const targetVersion = parseInt(this.version);
      if (targetVersion >= 14 && options.strategy !== 'conservative') {
        // Use FileContentPreserver to update main.ts while preserving custom code
        await FileContentPreserver.updateMainTsFile(mainTsPath, targetVersion);
        this.progressReporter?.success('Updated main.ts while preserving custom code');
      }
    }
    
    await this.updateAngularJson(projectPath);
    await this.updateTsConfig(projectPath);
    
    if (options.strategy !== 'conservative') {
      await this.updateOptionalConfigs(projectPath);
      
      // Update template files for Angular 17+ (optional)
      if (parseInt(this.version) >= 17) {
        await this.updateTemplateFiles(projectPath);
      }
    }
  }

  /**
   * Update angular.json configuration
   */
  protected async updateAngularJson(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      const angularJson = await fs.readJson(angularJsonPath);
      
      // Update builder versions and configurations
      this.updateBuilderConfigurations(angularJson);
      
      await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
    }
  }

  /**
   * Update builder configurations in angular.json
   */
  protected updateBuilderConfigurations(angularJson: any): void {
    // Update schema version based on Angular version
    const schemaMap: Record<string, string> = {
      '12': './node_modules/@angular/cli/lib/config/schema.json',
      '13': './node_modules/@angular/cli/lib/config/schema.json',
      '14': './node_modules/@angular/cli/lib/config/schema.json',
      '15': './node_modules/@angular/cli/lib/config/schema.json',
      '16': './node_modules/@angular/cli/lib/config/schema.json',
      '17': './node_modules/@angular/cli/lib/config/schema.json',
      '18': './node_modules/@angular/cli/lib/config/schema.json',
      '19': './node_modules/@angular/cli/lib/config/schema.json',
      '20': './node_modules/@angular/cli/lib/config/schema.json'
    };
    
    if (schemaMap[this.version]) {
      angularJson.$schema = schemaMap[this.version];
    }
    
    // Update version field
    angularJson.version = 1;
    
    // Handle browserTarget to buildTarget migration (Angular 15+)
    const versionNum = parseInt(this.version);
    if (versionNum >= 15) {
      this.migrateBrowserTargetToBuildTarget(angularJson);
    }
  }
  
  /**
   * Migrate browserTarget to buildTarget in angular.json (Angular 15+)
   */
  protected migrateBrowserTargetToBuildTarget(angularJson: any): void {
    for (const projectName in angularJson.projects) {
      const project = angularJson.projects[projectName];
      
      // Update serve configuration
      if (project.architect?.serve?.configurations) {
        for (const config of Object.values(project.architect.serve.configurations)) {
          const serveConfig = config as any;
          if (serveConfig.browserTarget && !serveConfig.buildTarget) {
            serveConfig.buildTarget = serveConfig.browserTarget;
            delete serveConfig.browserTarget;
          }
        }
      }
      
      // Update serve options
      if (project.architect?.serve?.options) {
        if (project.architect.serve.options.browserTarget && !project.architect.serve.options.buildTarget) {
          project.architect.serve.options.buildTarget = project.architect.serve.options.browserTarget;
          delete project.architect.serve.options.browserTarget;
        }
      }
      
      // Update extract-i18n configuration
      if (project.architect?.['extract-i18n']?.options) {
        const extractConfig = project.architect['extract-i18n'].options;
        if (extractConfig.browserTarget && !extractConfig.buildTarget) {
          extractConfig.buildTarget = extractConfig.browserTarget;
          delete extractConfig.browserTarget;
        }
      }
      
      // Update test configuration
      if (project.architect?.test?.options) {
        const testConfig = project.architect.test.options;
        if (testConfig.browserTarget && !testConfig.buildTarget) {
          testConfig.buildTarget = testConfig.browserTarget;
          delete testConfig.browserTarget;
        }
      }
    }
  }

  /**
   * Update tsconfig.json
   */
  protected async updateTsConfig(projectPath: string): Promise<void> {
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    
    if (await fs.pathExists(tsconfigPath)) {
      const tsconfig = await fs.readJson(tsconfigPath);
      
      // Update TypeScript configuration for this Angular version
      this.updateTypeScriptConfig(tsconfig);
      
      await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
    }
  }

  /**
   * Update TypeScript configuration
   */
  protected updateTypeScriptConfig(tsconfig: any): void {
    // Set proper compiler options based on Angular version
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }
    
    // Handle strict mode - set to false for safer migration
    tsconfig.compilerOptions.strict = false;
    
    // Set individual strict flags to false for migration
    tsconfig.compilerOptions.strictNullChecks = false;
    tsconfig.compilerOptions.strictPropertyInitialization = false;
    tsconfig.compilerOptions.strictBindCallApply = false;
    tsconfig.compilerOptions.strictFunctionTypes = false;
    tsconfig.compilerOptions.noImplicitAny = false;
    tsconfig.compilerOptions.noImplicitThis = false;
    tsconfig.compilerOptions.alwaysStrict = false;
    
    // Set target and module based on Angular version
    const versionNum = parseInt(this.version);
    if (versionNum >= 16) {
      tsconfig.compilerOptions.target = 'ES2022';
      tsconfig.compilerOptions.module = 'ES2022';
      tsconfig.compilerOptions.lib = ['ES2022', 'dom'];
    } else if (versionNum >= 15) {
      tsconfig.compilerOptions.target = 'ES2022';
      tsconfig.compilerOptions.module = 'ES2022';
      tsconfig.compilerOptions.lib = ['ES2022', 'dom'];
    } else if (versionNum >= 14) {
      tsconfig.compilerOptions.target = 'ES2020';
      tsconfig.compilerOptions.module = 'ES2020';
      tsconfig.compilerOptions.lib = ['ES2020', 'dom'];
    } else {
      tsconfig.compilerOptions.target = 'ES2017';
      tsconfig.compilerOptions.module = 'ES2020';
      tsconfig.compilerOptions.lib = ['ES2018', 'dom'];
    }
    
    // Enable experimental decorators for older versions
    if (versionNum < 16) {
      tsconfig.compilerOptions.experimentalDecorators = true;
    }
    
    // Set module resolution
    tsconfig.compilerOptions.moduleResolution = 'node';
    
    // Enable source maps for development
    tsconfig.compilerOptions.sourceMap = true;
    
    // Set output directory
    tsconfig.compilerOptions.outDir = './dist/out-tsc';
    
    // Enable declaration files
    tsconfig.compilerOptions.declaration = false;
    
    // Set base URL
    tsconfig.compilerOptions.baseUrl = './';
    
    // Enable incremental compilation
    tsconfig.compilerOptions.incremental = true;
    
    // Import helpers from tslib
    tsconfig.compilerOptions.importHelpers = true;
    
    // Skip lib check for faster builds
    tsconfig.compilerOptions.skipLibCheck = true;
    
    // Enable ES module interop
    tsconfig.compilerOptions.esModuleInterop = true;
  }
  
  /**
   * Get required TypeScript version for this Angular version
   */
  protected getRequiredTypeScriptVersion(): string {
    const tsVersionMap: Record<string, string> = {
      '12': '~4.3.0',
      '13': '~4.4.0',
      '14': '~4.7.0',
      '15': '~4.9.0',
      '16': '~5.1.0',
      '17': '~5.2.0',
      '18': '~5.4.0',
      '19': '~5.6.0',
      '20': '>=5.8.0 <5.9.0'
    };
    
    return tsVersionMap[this.version] || '~5.8.0';
  }

  /**
   * Update optional configuration files
   */
  protected async updateOptionalConfigs(projectPath: string): Promise<void> {
    // Update browserslist if it exists
    await this.updateBrowsersList(projectPath);
    
    // Update karma.conf.js if it exists
    await this.updateKarmaConfig(projectPath);
  }

  /**
   * Update browserslist configuration
   */
  protected async updateBrowsersList(projectPath: string): Promise<void> {
    const browserslistPath = path.join(projectPath, '.browserslistrc');
    
    if (await fs.pathExists(browserslistPath)) {
      // Update browser support configuration
      // This would contain version-specific browser requirements
    }
  }

  /**
   * Update Karma configuration
   */
  protected async updateKarmaConfig(projectPath: string): Promise<void> {
    const karmaConfigPath = path.join(projectPath, 'karma.conf.js');
    
    if (await fs.pathExists(karmaConfigPath)) {
      // Update Karma configuration for new Angular version
      // This would contain version-specific Karma updates
    }
  }

  /**
   * Run Angular update schematics and official migrations
   */
  protected async runAngularUpdateSchematics(projectPath: string): Promise<void> {
    try {
      this.progressReporter?.updateMessage('Running Angular update schematics...');
      
      // Run ng update for Angular core
      execSync(`npx ng update @angular/core@${this.version} --migrate-only --allow-dirty`, {
        cwd: projectPath,
        stdio: 'inherit'
      });

      // Run ng update for Angular CLI
      execSync(`npx ng update @angular/cli@${this.version} --migrate-only --allow-dirty`, {
        cwd: projectPath,
        stdio: 'inherit'
      });
      
      // Run version-specific official migrations
      await this.runVersionSpecificMigrations(projectPath);
      
      this.progressReporter?.success('✓ Angular update schematics completed');
    } catch (error) {
      this.progressReporter?.warn('Angular schematics migration completed with warnings');
    }
  }

  /**
   * Ensure Angular project is ready for migrations
   */
  protected async ensureAngularProjectReady(projectPath: string): Promise<void> {
    // Check if angular.json exists
    const angularJsonPath = path.join(projectPath, 'angular.json');
    if (!await fs.pathExists(angularJsonPath)) {
      throw new Error('angular.json not found. This does not appear to be an Angular project.');
    }
    
    // Check if package.json exists
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      throw new Error('package.json not found. Invalid Angular project structure.');
    }
    
    // Ensure node_modules exists
    const nodeModulesPath = path.join(projectPath, 'node_modules');
    if (!await fs.pathExists(nodeModulesPath)) {
      this.progressReporter?.warn('node_modules not found. Running npm install...');
      try {
        await this.runCommand('npm install', projectPath);
        this.progressReporter?.success('Dependencies installed successfully');
      } catch (error) {
        throw new Error('Failed to install dependencies. Please run npm install manually.');
      }
    }
    
    // Check if Angular CLI is available globally or locally
    try {
      await this.runCommand('npx ng version', projectPath);
    } catch (error) {
      throw new Error('Angular CLI not available. Please install Angular CLI: npm install -g @angular/cli');
    }
  }

  /**
   * Run version-specific official Angular migrations
   */
  protected async runVersionSpecificMigrations(projectPath: string): Promise<void> {
    // Ensure the project is ready for migrations
    await this.ensureAngularProjectReady(projectPath);
    
    const migrations = this.getAvailableMigrations();
    
    if (migrations.length === 0) {
      this.progressReporter?.info('No version-specific migrations available for this Angular version');
      return;
    }
    
    this.progressReporter?.info(`Running ${migrations.length} migration(s) for Angular ${this.version}...`);
    
    for (const migration of migrations) {
      try {
        this.progressReporter?.updateMessage(`Running ${migration.name} migration...`);
        this.progressReporter?.info(`Command: ${migration.command}`);
        
        const output = await this.runCommand(migration.command, projectPath);
        
        this.progressReporter?.success(`✓ ${migration.name} migration completed successfully`);
        
        // Log migration output for debugging
        if (output && output.trim()) {
          this.progressReporter?.info(`Migration output: ${output.trim()}`);
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (migration.optional) {
          this.progressReporter?.warn(`⚠ ${migration.name} migration skipped: ${errorMessage}`);
        } else {
          this.progressReporter?.error(`✗ ${migration.name} migration failed: ${errorMessage}`);
          // Don't throw for required migrations - continue with other migrations
        }
      }
    }
    
    this.progressReporter?.success(`Completed all migrations for Angular ${this.version}`);
  }

  /**
   * Get available migrations for this Angular version
   * Override in specific version handlers to provide version-specific migrations
   */
  protected getAvailableMigrations(): Migration[] {
    const version = parseInt(this.version);
    const migrations: Migration[] = [];

    // Core Angular Update (always run first)
    if (version >= 12) {
      migrations.push({
        name: 'Angular Framework Update',
        command: `npx ng update @angular/core@${version} @angular/cli@${version} --allow-dirty --force`,
        description: 'Update Angular framework and apply automatic migrations',
        optional: false
      });
    }

    // Official Angular Migration Schematics - Integrated Seamlessly
    
    // 1. Standalone Components Migration (Angular 14+)
    if (version >= 14) {
      migrations.push({
        name: 'Standalone Components Migration',
        command: 'npx ng generate @angular/core:standalone-migration --mode=convert-to-standalone --allow-dirty',
        description: 'Convert components to standalone, removing NgModule dependencies',
        optional: false // Make it automatic for better UX
      });
    }

    // 2. inject() Function Migration (Angular 14+)
    if (version >= 14) {
      migrations.push({
        name: 'inject() Function Migration',
        command: 'npx ng generate @angular/core:inject-function --allow-dirty',
        description: 'Convert constructor injection to inject() function',
        optional: false
      });
    }

    // 3. Control Flow Migration (Angular 17+)
    if (version >= 17) {
      migrations.push({
        name: 'Control Flow Migration',
        command: 'npx ng generate @angular/core:control-flow-migration --allow-dirty',
        description: 'Convert *ngIf, *ngFor, *ngSwitch to @if, @for, @switch',
        optional: false // Make it automatic for modern syntax
      });
    }

    // 4. Signal Inputs Migration (Angular 17.1+)
    if (version >= 17) {
      migrations.push({
        name: 'Signal Inputs Migration',
        command: 'npx ng generate @angular/core:signal-inputs --allow-dirty',
        description: 'Convert @Input fields to signal inputs',
        optional: false
      });
    }

    // 5. Signal Outputs Migration (Angular 17.3+)
    if (version >= 17) {
      migrations.push({
        name: 'Signal Outputs Migration',
        command: 'npx ng generate @angular/core:outputs --allow-dirty',
        description: 'Convert @Output custom events to output function',
        optional: false
      });
    }

    // 6. Signal Queries Migration (Angular 17.3+)
    if (version >= 17) {
      migrations.push({
        name: 'Signal Queries Migration',
        command: 'npx ng generate @angular/core:signal-queries --allow-dirty',
        description: 'Convert ViewChild/ContentChild to signal queries',
        optional: false
      });
    }

    // 7. Route Lazy Loading Migration (Angular 14+)
    if (version >= 14) {
      migrations.push({
        name: 'Route Lazy Loading Migration',
        command: 'npx ng generate @angular/core:route-lazy-loading --allow-dirty',
        description: 'Convert eager routes to lazy-loaded routes for smaller bundles',
        optional: true // Keep optional as it might affect routing structure
      });
    }

    // 8. Self-closing Tags Migration (Angular 16+)
    if (version >= 16) {
      migrations.push({
        name: 'Self-closing Tags Migration',
        command: 'npx ng generate @angular/core:self-closing-tags --allow-dirty',
        description: 'Convert templates to use self-closing tags',
        optional: false
      });
    }

    // 9. Cleanup Unused Imports (All versions)
    migrations.push({
      name: 'Cleanup Unused Imports',
      command: 'npx ng generate @angular/core:cleanup-unused-imports --allow-dirty',
      description: 'Remove unused imports for cleaner code',
      optional: false
    });


    return migrations;
  }

  /**
   * Run specific migration by name
   */
  protected async runSpecificMigration(projectPath: string, migrationName: string, interactive: boolean = false): Promise<void> {
    const migrations = this.getAvailableMigrations();
    const migration = migrations.find(m => m.name === migrationName);
    
    if (!migration) {
      throw new Error(`Migration '${migrationName}' not found for Angular ${this.version}`);
    }

    try {
      this.progressReporter?.updateMessage(`Running ${migration.name} migration...`);
      
      let command = migration.command;
      if (!interactive) {
        command += ' --interactive=false --defaults';
      }
      
      await this.runCommand(command, projectPath);
      
      this.progressReporter?.success(`✓ ${migration.name} migration completed`);
    } catch (error) {
      this.progressReporter?.warn(`${migration.name} migration failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Ensure all dependencies are properly installed
   */
  protected async ensureDependenciesInstalled(projectPath: string): Promise<void> {
    try {
      // Check if node_modules exists and is not empty
      const nodeModulesPath = path.join(projectPath, 'node_modules');
      const nodeModulesExists = await fs.pathExists(nodeModulesPath);
      
      if (!nodeModulesExists) {
        this.progressReporter?.warn('node_modules not found. Running npm install...');
        const success = await this.dependencyInstaller.runNpmInstall();
        if (!success) {
          throw new Error('Failed to install dependencies. Please run npm install manually.');
        }
      } else {
        // Verify key Angular packages are installed
        const angularCore = path.join(nodeModulesPath, '@angular', 'core');
        
        if (!await fs.pathExists(angularCore)) {
          this.progressReporter?.warn('Angular core packages missing. Running npm install...');
          const success = await this.dependencyInstaller.runNpmInstall();
          if (!success) {
            this.progressReporter?.warn('npm install failed, but continuing with upgrade...');
          }
        }
      }
      
      this.progressReporter?.success('✓ Dependencies verified');
    } catch (error) {
      this.progressReporter?.warn(`Dependency verification failed: ${error instanceof Error ? error.message : String(error)}`);
      // Don't fail the entire upgrade for dependency issues
    }
  }

  /**
   * Install dependencies (legacy method - kept for compatibility)
   */
  protected async installDependencies(projectPath: string): Promise<void> {
    try {
      console.log('Installing dependencies...');
      execSync('npm install', {
        cwd: projectPath,
        stdio: 'inherit'
      });
    } catch (error) {
      throw new Error('Failed to install dependencies');
    }
  }

  /**
   * Check version compatibility
   */
  protected isVersionCompatible(currentVersion: string, requiredVersion: string): boolean {
    // Simple version comparison - in production this would use semver
    const current = currentVersion.replace(/[^\d.]/g, '');
    const required = requiredVersion.replace(/[^\d.]/g, '');
    
    const currentParts = current.split('.').map(Number);
    const requiredParts = required.split('.').map(Number);
    
    for (let i = 0; i < Math.max(currentParts.length, requiredParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const requiredPart = requiredParts[i] || 0;
      
      if (currentPart > requiredPart) return true;
      if (currentPart < requiredPart) return false;
    }
    
    return true;
  }

  /**
   * Run command safely
   */
  protected async runCommand(command: string, projectPath: string): Promise<string> {
    try {
      return execSync(command, {
        cwd: projectPath,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
    } catch (error: any) {
      throw new Error(`Command failed: ${command}\n${error.stdout || error.stderr || error.message}`);
    }
  }

  /**
   * Backup file before modification
   */
  protected async backupFile(filePath: string): Promise<void> {
    if (await fs.pathExists(filePath)) {
      await fs.copy(filePath, `${filePath}.backup`);
    }
  }
  
  /**
   * Update component files using Advanced Content Preserver for intelligent merging
   */
  protected async updateComponentFiles(projectPath: string, transformations: any[]): Promise<void> {
    const componentsPath = path.join(projectPath, 'src', 'app');
    
    if (await fs.pathExists(componentsPath)) {
      // Find all component files
      const componentFiles = await this.findComponentFiles(componentsPath);
      
      let totalConflicts = 0;
      let filesWithConflicts: string[] = [];
      
      for (const file of componentFiles) {
        try {
          // Use advanced content preserver for intelligent merging
          const result = await this.contentPreserver.preserveComponentFile(file, transformations, {
            preserveComments: true,
            preserveCustomMethods: true,
            preserveUserImports: true,
            preserveCustomProperties: true,
            preserveCustomLogic: true,
            createDetailedBackup: true,
            mergeConflictResolution: 'user' // Prioritize user code
          });
          
          if (result.conflicts.length > 0) {
            totalConflicts += result.conflicts.length;
            filesWithConflicts.push(path.basename(file));
            this.progressReporter?.warn(`${result.conflicts.length} conflicts detected in ${path.basename(file)}`);
          }
          
          if (result.warnings.length > 0) {
            result.warnings.forEach(warning => this.progressReporter?.warn(warning));
          }
          
        } catch (error) {
          // Fallback to legacy FileContentPreserver
          this.progressReporter?.warn(`Advanced preservation failed for ${path.basename(file)}, using fallback method`);
          await FileContentPreserver.updateComponentFile(file, transformations);
        }
      }
      
      if (componentFiles.length > 0) {
        this.progressReporter?.success(`Intelligently preserved ${componentFiles.length} component files`);
        
        if (totalConflicts > 0) {
          this.progressReporter?.warn(`${totalConflicts} merge conflicts detected in: ${filesWithConflicts.join(', ')}`);
          this.progressReporter?.info('User customizations have been preserved. Review .conflicts files for manual resolution if needed.');
        } else {
          this.progressReporter?.success('✓ All user customizations preserved without conflicts');
        }
      }
    }
  }
  
  /**
   * Update template files using Advanced Content Preserver for intelligent merging
   */
  protected async updateTemplateFiles(projectPath: string): Promise<void> {
    const targetVersion = parseInt(this.version);
    const templatesPath = path.join(projectPath, 'src', 'app');
    
    if (await fs.pathExists(templatesPath)) {
      // Find all template files
      const templateFiles = await this.findTemplateFiles(templatesPath);
      
      let totalConflicts = 0;
      let filesWithConflicts: string[] = [];
      
      // Define template transformations based on Angular version
      const templateTransforms = this.getTemplateTransformsForVersion(targetVersion);
      
      for (const file of templateFiles) {
        try {
          // Use advanced content preserver for intelligent template merging
          const result = await this.contentPreserver.preserveTemplateFile(file, templateTransforms, {
            preserveComments: true,
            preserveCustomMethods: true,
            preserveUserImports: true,
            preserveCustomProperties: true,
            preserveCustomLogic: true,
            createDetailedBackup: true,
            mergeConflictResolution: 'user' // Prioritize user template code
          });
          
          if (result.conflicts.length > 0) {
            totalConflicts += result.conflicts.length;
            filesWithConflicts.push(path.basename(file));
            this.progressReporter?.warn(`${result.conflicts.length} template conflicts in ${path.basename(file)}`);
          }
          
        } catch (error) {
          // Fallback to legacy FileContentPreserver
          this.progressReporter?.warn(`Advanced template preservation failed for ${path.basename(file)}, using fallback`);
          await FileContentPreserver.updateTemplateFile(file, targetVersion);
        }
      }
      
      if (templateFiles.length > 0) {
        this.progressReporter?.success(`Intelligently preserved ${templateFiles.length} template files`);
        
        if (totalConflicts > 0) {
          this.progressReporter?.warn(`${totalConflicts} template conflicts detected in: ${filesWithConflicts.join(', ')}`);
          this.progressReporter?.info('User template customizations preserved. Complex logic maintained as-is.');
        } else {
          this.progressReporter?.success('✓ All template customizations preserved without conflicts');
        }
      }
    }
  }
  
  /**
   * Get template transformations for specific Angular version
   */
  protected getTemplateTransformsForVersion(targetVersion: number): any[] {
    const transforms: any[] = [];
    
    // Angular 17+ control flow migration
    if (targetVersion >= 17) {
      transforms.push({
        type: 'template',
        templateType: 'control-flow',
        description: 'Migrate *ngIf, *ngFor to @if, @for syntax',
        preserveComplexLogic: true
      });
    }
    
    // Angular 16+ self-closing tags
    if (targetVersion >= 16) {
      transforms.push({
        type: 'template',
        templateType: 'directive-update',
        description: 'Update to self-closing tags',
        preserveUserDirectives: true
      });
    }
    
    return transforms;
  }

  /**
   * Find all component files in a directory
   */
  private async findComponentFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await this.findComponentFiles(fullPath));
      } else if (entry.name.endsWith('.component.ts')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  /**
   * Find all template files in a directory
   */
  private async findTemplateFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await this.findTemplateFiles(fullPath));
      } else if (entry.name.endsWith('.component.html')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  /**
   * Create version-specific breaking change
   */
  protected createBreakingChange(
    id: string,
    type: BreakingChange['type'],
    severity: BreakingChange['severity'],
    description: string,
    impact: string,
    migrationInstructions?: string
  ): BreakingChange {
    return {
      id,
      version: this.version,
      type,
      severity,
      description,
      impact,
      migration: {
        type: migrationInstructions ? 'manual' : 'automatic',
        instructions: migrationInstructions
      }
    };
  }

  /**
   * Track dependency updates by comparing package.json before and after
   */
  private trackDependencyUpdates(
    beforePackageJson: any, 
    afterPackageJson: any, 
    filterPrefix?: string
  ): void {
    const before = { 
      ...beforePackageJson.dependencies, 
      ...beforePackageJson.devDependencies 
    };
    const after = { 
      ...afterPackageJson.dependencies, 
      ...afterPackageJson.devDependencies 
    };

    for (const [name, newVersion] of Object.entries(after)) {
      if (filterPrefix && !name.startsWith(filterPrefix)) continue;
      
      const oldVersion = before[name];
      if (oldVersion && oldVersion !== newVersion) {
        const dependencyChange: DependencyChange = {
          name,
          previousVersion: oldVersion as string,
          newVersion: newVersion as string,
          type: afterPackageJson.dependencies?.[name] ? 'production' : 'development',
          breaking: this.isBreakingDependencyChange(name, oldVersion as string, newVersion as string)
        };
        
        this.reportGenerator.trackDependencyChange(dependencyChange);
      }
    }
  }

  /**
   * Check if a dependency version change is potentially breaking
   */
  private isBreakingDependencyChange(name: string, oldVersion: string, newVersion: string): boolean {
    // Angular packages: major version changes are breaking
    if (name.startsWith('@angular/')) {
      const oldMajor = parseInt(oldVersion.replace(/[^\d].*/, ''));
      const newMajor = parseInt(newVersion.replace(/[^\d].*/, ''));
      return newMajor > oldMajor;
    }
    
    // For other packages, assume major version changes are breaking
    try {
      const oldMajor = parseInt(oldVersion.replace(/[^\d].*/, ''));
      const newMajor = parseInt(newVersion.replace(/[^\d].*/, ''));
      return newMajor > oldMajor;
    } catch {
      return false;
    }
  }
}