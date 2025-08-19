import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ProgressReporter } from './ProgressReporter';

/**
 * Runs Angular's built-in schematics and ng update commands
 * to leverage Angular's official migration capabilities
 */
export class AngularSchematicsRunner {
  private progressReporter: ProgressReporter;

  constructor(
    private projectPath: string,
    progressReporter?: ProgressReporter
  ) {
    this.progressReporter = progressReporter || new ProgressReporter();
  }

  /**
   * Run ng update for a specific Angular version
   * This uses Angular's official migration schematics
   */
  async runNgUpdate(
    targetVersion: string,
    options: {
      force?: boolean;
      migrateOnly?: boolean;
      packages?: string[];
      createCommits?: boolean;
    } = {}
  ): Promise<{ success: boolean; output: string; migrationsApplied: string[] }> {
    try {
      this.progressReporter.updateMessage(`Running Angular ${targetVersion} official migrations...`);

      // Build the ng update command
      const packages = options.packages || [
        '@angular/core',
        '@angular/cli'
      ];

      const packageSpecs = packages.map(pkg => `${pkg}@${targetVersion}`).join(' ');
      
      let command = `npx ng update ${packageSpecs}`;
      
      // Add options
      if (options.force) command += ' --force';
      if (options.migrateOnly) command += ' --migrate-only';
      if (options.createCommits) command += ' --create-commits';
      
      // Run the command
      const output = execSync(command, {
        cwd: this.projectPath,
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large outputs
      });

      // Parse migrations that were applied
      const migrationsApplied = this.parseMigrationsFromOutput(output);

      this.progressReporter.success(`✓ Angular ${targetVersion} migrations completed`);
      
      return {
        success: true,
        output,
        migrationsApplied
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.progressReporter.error(`Failed to run ng update: ${errorMessage}`);
      
      return {
        success: false,
        output: errorMessage,
        migrationsApplied: []
      };
    }
  }

  /**
   * Run a specific Angular schematic
   */
  async runSchematic(
    schematicName: string,
    options: Record<string, any> = {}
  ): Promise<{ success: boolean; output: string }> {
    try {
      this.progressReporter.updateMessage(`Running schematic: ${schematicName}`);

      // Build the schematic command
      let command = `npx ng generate ${schematicName}`;
      
      // Add options
      for (const [key, value] of Object.entries(options)) {
        if (typeof value === 'boolean') {
          if (value) command += ` --${key}`;
        } else {
          command += ` --${key}="${value}"`;
        }
      }

      const output = execSync(command, {
        cwd: this.projectPath,
        encoding: 'utf-8'
      });

      this.progressReporter.success(`✓ Schematic ${schematicName} completed`);
      
      return { success: true, output };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.progressReporter.error(`Failed to run schematic: ${errorMessage}`);
      
      return { success: false, output: errorMessage };
    }
  }

  /**
   * Check available migrations for a package
   */
  async checkAvailableMigrations(
    packageName: string,
    fromVersion: string,
    toVersion: string
  ): Promise<string[]> {
    try {
      const command = `npx ng update ${packageName} --from="${fromVersion}" --to="${toVersion}" --migrate-only --dry-run`;
      
      const output = execSync(command, {
        cwd: this.projectPath,
        encoding: 'utf-8'
      });

      return this.parseMigrationsFromOutput(output);
    } catch (error) {
      // If command fails, it might mean no migrations are available
      return [];
    }
  }

  /**
   * Run Angular's built-in code modernization schematics
   */
  async runModernizationSchematics(targetVersion: number): Promise<void> {
    // Angular 14+: Standalone components migration
    if (targetVersion >= 14) {
      await this.runStandaloneComponentsMigration();
    }

    // Angular 15+: Material MDC migration
    if (targetVersion >= 15) {
      await this.runMaterialMDCMigration();
    }

    // Angular 16+: Control flow migration
    if (targetVersion >= 16) {
      await this.runControlFlowMigration();
    }

    // Angular 17+: Application builder migration
    if (targetVersion >= 17) {
      await this.runApplicationBuilderMigration();
    }

    // Angular 18+: Built-in control flow completion
    if (targetVersion >= 18) {
      await this.completeControlFlowMigration();
    }
  }

  /**
   * Migrate to standalone components (Angular 14+)
   */
  private async runStandaloneComponentsMigration(): Promise<void> {
    this.progressReporter.info('Checking for standalone components migration...');
    
    // This schematic converts NgModules to standalone components
    const result = await this.runSchematic('@angular/core:standalone', {
      migrate: true,
      'convert-to-standalone': true
    });

    if (result.success) {
      this.progressReporter.success('✓ Standalone components migration completed');
    }
  }

  /**
   * Migrate Angular Material to MDC (Angular 15+)
   */
  private async runMaterialMDCMigration(): Promise<void> {
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    if (packageJson.dependencies?.['@angular/material']) {
      this.progressReporter.info('Running Angular Material MDC migration...');
      
      const result = await this.runSchematic('@angular/material:mdc-migration', {
        'migrate-styles': true,
        'migrate-templates': true
      });

      if (result.success) {
        this.progressReporter.success('✓ Material MDC migration completed');
      }
    }
  }

  /**
   * Migrate to new control flow syntax (Angular 17+)
   */
  private async runControlFlowMigration(): Promise<void> {
    this.progressReporter.info('Migrating to new control flow syntax...');
    
    // This schematic converts *ngIf, *ngFor to @if, @for
    const result = await this.runSchematic('@angular/core:control-flow', {
      path: 'src',
      'migrate-all': true
    });

    if (result.success) {
      this.progressReporter.success('✓ Control flow migration completed');
    }
  }

  /**
   * Migrate to application builder (Angular 17+)
   */
  private async runApplicationBuilderMigration(): Promise<void> {
    this.progressReporter.info('Migrating to application builder...');
    
    const result = await this.runSchematic('@angular-devkit/build-angular:application', {
      project: 'default'
    });

    if (result.success) {
      this.progressReporter.success('✓ Application builder migration completed');
    }
  }

  /**
   * Complete control flow migration (Angular 18+)
   */
  private async completeControlFlowMigration(): Promise<void> {
    this.progressReporter.info('Completing control flow migration...');
    
    // Remove any remaining structural directives
    const result = await this.runSchematic('@angular/core:control-flow-complete', {
      'remove-structural-directives': true
    });

    if (result.success) {
      this.progressReporter.success('✓ Control flow migration completed');
    }
  }

  /**
   * Parse migrations from ng update output
   */
  private parseMigrationsFromOutput(output: string): string[] {
    const migrations: string[] = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      // Look for migration indicators in the output
      if (line.includes('Migration')) {
        migrations.push(line.trim());
      }
    }
    
    return migrations;
  }

  /**
   * Run ng update with analysis only (dry run)
   */
  async analyzeUpdate(targetVersion: string): Promise<{
    canUpdate: boolean;
    incompatibilities: string[];
    recommendations: string[];
  }> {
    try {
      const command = `npx ng update @angular/core@${targetVersion} @angular/cli@${targetVersion} --dry-run`;
      
      const output = execSync(command, {
        cwd: this.projectPath,
        encoding: 'utf-8'
      });

      // Parse the output to understand what would be updated
      const incompatibilities = this.parseIncompatibilities(output);
      const recommendations = this.parseRecommendations(output);

      return {
        canUpdate: incompatibilities.length === 0,
        incompatibilities,
        recommendations
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Parse error for incompatibilities
      const incompatibilities = this.parseIncompatibilities(errorMessage);
      
      return {
        canUpdate: false,
        incompatibilities,
        recommendations: []
      };
    }
  }

  /**
   * Parse incompatibilities from ng update output
   */
  private parseIncompatibilities(output: string): string[] {
    const incompatibilities: string[] = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('incompatible') || 
          line.includes('peer dependency') ||
          line.includes('cannot resolve')) {
        incompatibilities.push(line.trim());
      }
    }
    
    return incompatibilities;
  }

  /**
   * Parse recommendations from ng update output
   */
  private parseRecommendations(output: string): string[] {
    const recommendations: string[] = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('recommend') || 
          line.includes('consider') ||
          line.includes('should')) {
        recommendations.push(line.trim());
      }
    }
    
    return recommendations;
  }
}