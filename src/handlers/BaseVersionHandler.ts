import { UpgradeStep, UpgradeOptions, BreakingChange } from '../types';
import { VersionHandler } from '../core/VersionHandlerRegistry';
import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';

export abstract class BaseVersionHandler implements VersionHandler {
  abstract readonly version: string;

  /**
   * Execute version-specific upgrade logic
   */
  async execute(projectPath: string, step: UpgradeStep, options: UpgradeOptions): Promise<void> {
    console.log(`Starting Angular ${this.version} upgrade...`);

    // Update Angular dependencies
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

    console.log(`Angular ${this.version} upgrade completed successfully`);
  }

  /**
   * Validate prerequisites for this version
   */
  async validatePrerequisites(projectPath: string): Promise<boolean> {
    try {
      // Check Node.js version
      const nodeVersion = process.version;
      const requiredNode = this.getRequiredNodeVersion();
      if (!this.isVersionCompatible(nodeVersion, requiredNode)) {
        console.error(`Node.js ${requiredNode} required, found ${nodeVersion}`);
        return false;
      }

      // Check if project is an Angular project
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (!await fs.pathExists(packageJsonPath)) {
        console.error('package.json not found');
        return false;
      }

      const packageJson = await fs.readJson(packageJsonPath);
      if (!packageJson.dependencies?.['@angular/core']) {
        console.error('Not an Angular project');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Prerequisite validation failed:', error);
      return false;
    }
  }

  /**
   * Get breaking changes for this version
   */
  abstract getBreakingChanges(): BreakingChange[];

  /**
   * Get version-specific methods that must be implemented by each version handler
   */
  protected abstract getRequiredNodeVersion(): string;
  protected abstract getRequiredTypeScriptVersion(): string;
  protected abstract applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;

  /**
   * Update Angular dependencies to target version
   */
  protected async updateAngularDependencies(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    const angularPackages = [
      '@angular/animations',
      '@angular/common',
      '@angular/compiler',
      '@angular/core',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/router'
    ];

    const devAngularPackages = [
      '@angular/cli',
      '@angular/compiler-cli',
      '@angular-devkit/build-angular'
    ];

    // Update production dependencies
    for (const pkg of angularPackages) {
      if (packageJson.dependencies?.[pkg]) {
        packageJson.dependencies[pkg] = `^${this.version}.0.0`;
      }
    }

    // Update dev dependencies
    for (const pkg of devAngularPackages) {
      if (packageJson.devDependencies?.[pkg]) {
        packageJson.devDependencies[pkg] = `^${this.version}.0.0`;
      }
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  /**
   * Update TypeScript version
   */
  protected async updateTypeScript(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    const requiredTsVersion = this.getRequiredTypeScriptVersion();
    
    if (packageJson.devDependencies?.typescript) {
      packageJson.devDependencies.typescript = requiredTsVersion;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  /**
   * Update Angular CLI
   */
  protected async updateAngularCli(projectPath: string): Promise<void> {
    try {
      execSync(`npm install @angular/cli@^${this.version}.0.0 --save-dev`, {
        cwd: projectPath,
        stdio: 'inherit'
      });
    } catch (error) {
      console.warn('Failed to update Angular CLI automatically');
    }
  }

  /**
   * Update configuration files
   */
  protected async updateConfigurationFiles(projectPath: string, options: UpgradeOptions): Promise<void> {
    await this.updateAngularJson(projectPath);
    await this.updateTsConfig(projectPath);
    
    if (options.strategy !== 'conservative') {
      await this.updateOptionalConfigs(projectPath);
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
   * Run Angular update schematics
   */
  protected async runAngularUpdateSchematics(projectPath: string): Promise<void> {
    try {
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
    } catch (error) {
      console.warn('Angular schematics migration completed with warnings');
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