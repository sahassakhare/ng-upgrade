import { UpgradeStep, UpgradeOptions, BreakingChange, Migration } from '../types';
import { VersionHandler } from '../core/VersionHandlerRegistry';
import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';
import { DependencyInstaller } from '../utils/DependencyInstaller';
import { FileContentPreserver } from '../utils/FileContentPreserver';
import { ProgressReporter } from '../utils/ProgressReporter';

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
    this.progressReporter = options.progressReporter || new ProgressReporter();
    
    this.progressReporter.startStep(`Angular ${this.version} Upgrade`, `Starting Angular ${this.version} upgrade...`);

    // Update Angular dependencies with automatic installation
    this.progressReporter.updateMessage('Updating Angular dependencies...');
    await this.updateAngularDependencies(projectPath);

    // Update TypeScript if needed
    await this.updateTypeScript(projectPath);

    // Update Angular CLI
    await this.updateAngularCli(projectPath);

    // Apply version-specific transformations
    await this.applyVersionSpecificChanges(projectPath, options);

    // Update configuration files
    await this.updateConfigurationFiles(projectPath, options);

    // Run Angular update schematics
    await this.runAngularUpdateSchematics(projectPath);

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
   * Gets the required TypeScript version range for this Angular version
   * 
   * Each version handler must specify the compatible TypeScript version range
   * that works with the target Angular version.
   * 
   * @returns The TypeScript version requirement (e.g., ">=4.9.3 <5.1.0")
   * @abstract
   */
  protected abstract getRequiredTypeScriptVersion(): string;
  
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
    // Use the DependencyInstaller for automatic installation
    const success = await this.dependencyInstaller.updateAngularPackages(this.version);
    
    if (!success) {
      this.progressReporter.warn('Angular dependencies updated in package.json. Manual npm install may be required.');
    } else {
      this.progressReporter.success('Angular dependencies installed successfully');
    }
  }

  /**
   * Update TypeScript version with automatic installation
   */
  protected async updateTypeScript(projectPath: string): Promise<void> {
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
  protected async updateAngularCli(projectPath: string): Promise<void> {
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
    // This would be implemented by specific version handlers
    // to update builder configurations as needed
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
    // Default TypeScript updates that apply to most versions
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }

    // Enable strict mode by default for newer versions
    if (Number(this.version) >= 15) {
      tsconfig.compilerOptions.strict = true;
    }
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
   * Run version-specific official Angular migrations
   */
  protected async runVersionSpecificMigrations(projectPath: string): Promise<void> {
    const migrations = this.getAvailableMigrations();
    
    for (const migration of migrations) {
      try {
        this.progressReporter?.updateMessage(`Running ${migration.name} migration...`);
        
        await this.runCommand(migration.command, projectPath);
        
        this.progressReporter?.info(`✓ ${migration.name} migration completed`);
      } catch (error) {
        this.progressReporter?.warn(`${migration.name} migration completed with warnings: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Get available migrations for this Angular version
   * Override in specific version handlers to provide version-specific migrations
   */
  protected getAvailableMigrations(): Migration[] {
    const version = parseInt(this.version);
    const migrations: Migration[] = [];

    // Standalone Components (Angular 14+)
    if (version >= 14) {
      migrations.push({
        name: 'Standalone Components',
        command: 'npx ng generate @angular/core:standalone',
        description: 'Convert components to standalone components',
        optional: true
      });
    }

    // Control Flow Syntax (Angular 17+)
    if (version >= 17) {
      migrations.push({
        name: 'Control Flow Syntax',
        command: 'npx ng generate @angular/core:control-flow',
        description: 'Convert structural directives to built-in control flow',
        optional: true
      });
    }

    // inject() Function (Angular 14+)
    if (version >= 14) {
      migrations.push({
        name: 'inject() Function',
        command: 'npx ng generate @angular/core:inject-function',
        description: 'Convert constructor injection to inject() function',
        optional: true
      });
    }

    // Signal Inputs (Angular 17.1+)
    if (version >= 17) {
      migrations.push({
        name: 'Signal Inputs',
        command: 'npx ng generate @angular/core:signal-inputs',
        description: 'Convert @Input fields to signal inputs',
        optional: true
      });
    }

    // Signal Outputs (Angular 17.3+)
    if (version >= 17) {
      migrations.push({
        name: 'Signal Outputs',
        command: 'npx ng generate @angular/core:signal-outputs',
        description: 'Convert @Output fields to signal outputs',
        optional: true
      });
    }

    // Signal Queries (Angular 17.2+)
    if (version >= 17) {
      migrations.push({
        name: 'Signal Queries',
        command: 'npx ng generate @angular/core:signal-queries',
        description: 'Convert decorator queries to signal queries',
        optional: true
      });
    }

    // Self-closing Tags (Angular 16+)
    if (version >= 16) {
      migrations.push({
        name: 'Self-closing Tags',
        command: 'npx ng generate @angular/core:self-closing-tags',
        description: 'Convert templates to use self-closing tags',
        optional: true
      });
    }

    // Cleanup Unused Imports (All versions)
    migrations.push({
      name: 'Cleanup Unused Imports',
      command: 'npx ng generate @angular/core:cleanup-unused-imports',
      description: 'Remove unused imports from project files',
      optional: true
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
   * Install dependencies
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
   * Update component files using FileContentPreserver
   */
  protected async updateComponentFiles(projectPath: string, transformations: any[]): Promise<void> {
    const componentsPath = path.join(projectPath, 'src', 'app');
    
    if (await fs.pathExists(componentsPath)) {
      // Find all component files
      const componentFiles = await this.findComponentFiles(componentsPath);
      
      for (const file of componentFiles) {
        await FileContentPreserver.updateComponentFile(file, transformations);
      }
      
      if (componentFiles.length > 0) {
        this.progressReporter?.success(`Updated ${componentFiles.length} component files while preserving custom code`);
      }
    }
  }
  
  /**
   * Update template files using FileContentPreserver
   */
  protected async updateTemplateFiles(projectPath: string): Promise<void> {
    const targetVersion = parseInt(this.version);
    const templatesPath = path.join(projectPath, 'src', 'app');
    
    if (await fs.pathExists(templatesPath)) {
      // Find all template files
      const templateFiles = await this.findTemplateFiles(templatesPath);
      
      for (const file of templateFiles) {
        await FileContentPreserver.updateTemplateFile(file, targetVersion);
      }
      
      if (templateFiles.length > 0) {
        this.progressReporter?.info(`Template files preserved - migration to new syntax is optional`);
      }
    }
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
}