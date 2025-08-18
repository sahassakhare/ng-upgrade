import { UpgradeStep, UpgradeOptions, BreakingChange } from '../types';
import { VersionHandler } from '../core/VersionHandlerRegistry';
import { DependencyInstaller } from '../utils/DependencyInstaller';
import { ProgressReporter } from '../utils/ProgressReporter';
export declare abstract class BaseVersionHandler implements VersionHandler {
    abstract readonly version: string;
    protected dependencyInstaller: DependencyInstaller;
    protected progressReporter: ProgressReporter;
    /**
     * Execute version-specific upgrade logic
     */
    execute(projectPath: string, step: UpgradeStep, options: UpgradeOptions): Promise<void>;
    /**
     * Validate prerequisites for this version
     */
    validatePrerequisites(projectPath: string): Promise<boolean>;
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
     * Update Angular dependencies to target version with automatic installation
     */
    protected updateAngularDependencies(projectPath: string): Promise<void>;
    /**
     * Update TypeScript version with automatic installation
     */
    protected updateTypeScript(projectPath: string): Promise<void>;
    /**
     * Update Angular CLI with automatic installation
     */
    protected updateAngularCli(projectPath: string): Promise<void>;
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
     * Update tsconfig.json
     */
    protected updateTsConfig(projectPath: string): Promise<void>;
    /**
     * Update TypeScript configuration
     */
    protected updateTypeScriptConfig(tsconfig: any): void;
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
     * Run Angular update schematics
     */
    protected runAngularUpdateSchematics(projectPath: string): Promise<void>;
    /**
     * Install dependencies
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
     * Update component files using FileContentPreserver
     */
    protected updateComponentFiles(projectPath: string, transformations: any[]): Promise<void>;
    /**
     * Update template files using FileContentPreserver
     */
    protected updateTemplateFiles(projectPath: string): Promise<void>;
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
}
//# sourceMappingURL=BaseVersionHandler.d.ts.map