import { UpgradeStep, UpgradeOptions, BreakingChange, Migration } from '../types';
import { VersionHandler } from '../core/VersionHandlerRegistry';
import { DependencyInstaller } from '../utils/DependencyInstaller';
import { AdvancedContentPreserver } from '../utils/AdvancedContentPreserver';
import { ProgressReporter } from '../utils/ProgressReporter';
import { UpgradeReportGenerator } from '../utils/UpgradeReportGenerator';
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
export declare abstract class BaseVersionHandler implements VersionHandler {
    /** The Angular version this handler manages - must be implemented by concrete classes */
    abstract readonly version: string;
    /** Utility for managing dependency installations and updates */
    protected dependencyInstaller: DependencyInstaller;
    /** Advanced content preservation system for intelligent code merging */
    protected contentPreserver: AdvancedContentPreserver;
    /** Detailed upgrade report generator for tracking all changes */
    protected reportGenerator: UpgradeReportGenerator;
    /** Utility for reporting upgrade progress and status messages */
    protected progressReporter: ProgressReporter;
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
    execute(projectPath: string, step: UpgradeStep, options: UpgradeOptions): Promise<void>;
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
    validatePrerequisites(projectPath: string): Promise<boolean>;
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
    protected updateAngularDependencies(projectPath: string): Promise<void>;
    /**
     * Update third-party dependencies compatible with target Angular version
     * Uses NgCompatibilityUpdater for comprehensive dependency checking
     */
    protected updateThirdPartyDependencies(projectPath: string): Promise<void>;
    /**
     * Fallback method for packages not covered by NgCompatibilityUpdater
     */
    private updateRemainingDependencies;
    /**
     * Update TypeScript version with automatic installation
     */
    protected updateTypeScript(_projectPath: string): Promise<void>;
    /**
     * Update Angular CLI with automatic installation
     */
    protected updateAngularCli(_projectPath: string): Promise<void>;
    /**
     * Update configuration files while preserving existing content
     */
    protected updateConfigurationFiles(projectPath: string, options: UpgradeOptions): Promise<void>;
    /**
     * Update angular.json configuration
     */
    protected updateAngularJson(projectPath: string): Promise<void>;
    /**
     * Update builder configurations in angular.json
     */
    protected updateBuilderConfigurations(angularJson: any): void;
    /**
     * Migrate browserTarget to buildTarget in angular.json (Angular 15+)
     */
    protected migrateBrowserTargetToBuildTarget(angularJson: any): void;
    /**
     * Update tsconfig.json
     */
    protected updateTsConfig(projectPath: string): Promise<void>;
    /**
     * Update TypeScript configuration
     */
    protected updateTypeScriptConfig(tsconfig: any): void;
    /**
     * Get required TypeScript version for this Angular version
     */
    protected getRequiredTypeScriptVersion(): string;
    /**
     * Update optional configuration files
     */
    protected updateOptionalConfigs(projectPath: string): Promise<void>;
    /**
     * Update browserslist configuration
     */
    protected updateBrowsersList(projectPath: string): Promise<void>;
    /**
     * Update Karma configuration
     */
    protected updateKarmaConfig(projectPath: string): Promise<void>;
    /**
     * Run Angular update schematics and official migrations
     */
    protected runAngularUpdateSchematics(projectPath: string): Promise<void>;
    /**
     * Ensure Angular project is ready for migrations
     */
    protected ensureAngularProjectReady(projectPath: string): Promise<void>;
    /**
     * Run version-specific official Angular migrations
     */
    protected runVersionSpecificMigrations(projectPath: string): Promise<void>;
    /**
     * Get available migrations for this Angular version
     * Override in specific version handlers to provide version-specific migrations
     */
    protected getAvailableMigrations(): Migration[];
    /**
     * Run specific migration by name
     */
    protected runSpecificMigration(projectPath: string, migrationName: string, interactive?: boolean): Promise<void>;
    /**
     * Ensure all dependencies are properly installed
     */
    protected ensureDependenciesInstalled(projectPath: string): Promise<void>;
    /**
     * Install dependencies (legacy method - kept for compatibility)
     */
    protected installDependencies(projectPath: string): Promise<void>;
    /**
     * Check version compatibility
     */
    protected isVersionCompatible(currentVersion: string, requiredVersion: string): boolean;
    /**
     * Run command safely
     */
    protected runCommand(command: string, projectPath: string): Promise<string>;
    /**
     * Backup file before modification
     */
    protected backupFile(filePath: string): Promise<void>;
    /**
     * Update component files using Advanced Content Preserver for intelligent merging
     */
    protected updateComponentFiles(projectPath: string, transformations: any[]): Promise<void>;
    /**
     * Update template files using Advanced Content Preserver for intelligent merging
     */
    protected updateTemplateFiles(projectPath: string): Promise<void>;
    /**
     * Get template transformations for specific Angular version
     */
    protected getTemplateTransformsForVersion(targetVersion: number): any[];
    /**
     * Find all component files in a directory
     */
    private findComponentFiles;
    /**
     * Find all template files in a directory
     */
    private findTemplateFiles;
    /**
     * Create version-specific breaking change
     */
    protected createBreakingChange(id: string, type: BreakingChange['type'], severity: BreakingChange['severity'], description: string, impact: string, migrationInstructions?: string): BreakingChange;
    /**
     * Track dependency updates by comparing package.json before and after
     */
    private trackDependencyUpdates;
    /**
     * Check if a dependency version change is potentially breaking
     */
    private isBreakingDependencyChange;
}
//# sourceMappingURL=BaseVersionHandler.d.ts.map