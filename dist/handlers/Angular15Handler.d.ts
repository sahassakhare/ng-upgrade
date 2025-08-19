import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate } from '../types';
/**
 * Angular 15 Handler - Standalone APIs stabilization and Image directive
 *
 * Key Features in Angular 15:
 * - Standalone APIs stabilization (components, directives, pipes)
 * - Angular Image directive with built-in optimizations
 * - MDC-based Angular Material migration
 * - Better stack traces in development
 * - Directive composition API
 * - Optional guards with inject() function
 * - Extended developer experience improvements
 */
export declare class Angular15Handler extends BaseVersionHandler {
    readonly version = "15";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    /**
     * Get Angular 15 dependencies with correct versions
     */
    getDependencyUpdates(): DependencyUpdate[];
    protected applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;
    getBreakingChanges(): BreakingChange[];
    /**
     * Stabilize standalone APIs and provide migration examples
     */
    private stabilizeStandaloneAPIs;
    /**
     * Implement Angular Image directive with optimizations
     */
    private implementImageDirective;
    /**
     * Setup MDC-based Angular Material migration
     */
    private setupMDCMaterialMigration;
    /**
     * Configure better stack traces for development
     */
    private configureBetterStackTraces;
    /**
     * Implement directive composition API
     */
    private implementDirectiveComposition;
    /**
     * Setup optional guards with inject() function
     */
    private setupOptionalInjectGuards;
    /**
     * Enhanced developer experience improvements
     */
    private enhancedDeveloperExperience;
    /**
     * Update build configurations for Angular 15
     */
    private updateBuildConfigurations;
    /**
     * Validate third-party compatibility for Angular 15
     */
    private validateThirdPartyCompatibility;
    /**
     * Check if a library can benefit from standalone components
     */
    private canBenefitFromStandalone;
    /**
     * Check if a library can benefit from directive composition
     */
    private canBenefitFromDirectiveComposition;
}
//# sourceMappingURL=Angular15Handler.d.ts.map