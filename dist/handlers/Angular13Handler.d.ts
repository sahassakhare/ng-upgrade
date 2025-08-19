import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate } from '../types';
/**
 * Angular 13 Handler - Complete View Engine removal and APF updates
 *
 * Key Features in Angular 13:
 * - Complete View Engine removal - Ivy only
 * - Angular Package Format (APF) improvements
 * - Dynamic import support for lazy routes
 * - Node.js ES modules support
 * - Angular CLI modernization
 * - Webpack 5 full support
 * - IE11 deprecation warnings
 */
export declare class Angular13Handler extends BaseVersionHandler {
    readonly version = "13";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    /**
     * Get Angular 13 dependencies with correct versions
     */
    getDependencyUpdates(): DependencyUpdate[];
    protected applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;
    getBreakingChanges(): BreakingChange[];
    /**
     * Ensure Ivy compatibility and remove View Engine references
     */
    private ensureIvyCompatibility;
    /**
     * Update Angular Package Format for libraries
     */
    private updateAngularPackageFormat;
    /**
     * Migrate to dynamic imports for lazy routes
     */
    private migrateToDynamicImports;
    /**
     * Update webpack configuration for v5 compatibility
     */
    private updateWebpackConfiguration;
    /**
     * Configure ES modules support
     */
    private configureESModulesSupport;
    /**
     * Update Angular CLI configuration for v13
     */
    private updateAngularCliConfiguration;
    /**
     * Remove IE11 support and update browser compatibility
     */
    private removeIE11Support;
    /**
     * Validate third-party library compatibility
     */
    private validateThirdPartyCompatibility;
    /**
     * Find all routing files in the project
     */
    private findRoutingFiles;
    /**
     * Check if a library is known to be View Engine dependent
     */
    private isViewEngineDependentLibrary;
}
//# sourceMappingURL=Angular13Handler.d.ts.map