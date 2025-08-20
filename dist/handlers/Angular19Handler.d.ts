import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate } from '../types';
/**
 * Angular 19 Handler - Zoneless change detection and event replay
 *
 * Key Features in Angular 19:
 * - Zoneless change detection (experimental)
 * - Enhanced event replay for SSR hydration
 * - Improved incremental hydration
 * - Advanced SSR optimizations
 * - Better performance monitoring
 * - Enhanced developer experience
 * - Improved i18n support
 * - Advanced build optimizations
 */
export declare class Angular19Handler extends BaseVersionHandler {
    readonly version = "19";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    /**
     * Get Angular 19 dependencies with correct versions
     */
    getDependencyUpdates(): DependencyUpdate[];
    protected applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;
    getBreakingChanges(): BreakingChange[];
    /**
     * Setup zoneless change detection (experimental)
     */
    private setupZonelessChangeDetection;
    /**
     * Enhanced event replay for SSR hydration
     */
    private enhanceEventReplaySSR;
    /**
     * Implement incremental hydration improvements
     */
    private implementIncrementalHydration;
    /**
     * Implement advanced SSR optimizations
     */
    private implementAdvancedSSROptimizations;
    /**
     * Enhanced performance monitoring
     */
    private enhancePerformanceMonitoring;
    /**
     * Improved developer experience features
     */
    private improveDeveloperExperience;
    /**
     * Enhanced i18n support improvements
     */
    private enhanceI18nSupport;
    /**
     * Implement advanced build optimizations
     */
    private implementAdvancedBuildOptimizations;
    /**
     * Update build configurations for Angular 19
     */
    private updateBuildConfigurations;
    /**
     * Validate third-party compatibility for Angular 19
     */
    private validateThirdPartyCompatibility;
    /**
     * Check if a library can benefit from zoneless change detection
     */
    private canBenefitFromZoneless;
    /**
     * Check if a library can benefit from SSR optimizations
     */
    private canBenefitFromSSROptimizations;
    /**
     * Migrate from webpack-dev-server to esbuild dev server (Angular 18+)
     */
    private migrateToEsbuildDevServer;
    /**
     * Configure esbuild dev server in angular.json
     */
    private configureEsbuildDevServer;
}
//# sourceMappingURL=Angular19Handler.d.ts.map