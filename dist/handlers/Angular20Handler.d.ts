import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate } from '../types';
/**
 * Angular 20 Handler - Latest Angular version with cutting-edge features
 *
 * Key Features in Angular 20:
 * - Stable incremental hydration for SSR applications
 * - Advanced signal stabilization and optimization
 * - Enhanced zoneless change detection
 * - Improved build performance and tree-shaking
 * - Advanced SSR streaming and edge-side rendering
 * - Material 3 design system maturation
 * - Enhanced developer experience and debugging tools
 */
export declare class Angular20Handler extends BaseVersionHandler {
    readonly version = "20";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    /**
     * Get Angular 20 dependencies with latest versions
     */
    getDependencyUpdates(): DependencyUpdate[];
    /**
     * Apply Angular 20 specific changes and optimizations
     */
    protected applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;
    /**
     * Get comprehensive breaking changes for Angular 20
     */
    getBreakingChanges(): BreakingChange[];
    /**
     * Update build configurations for Angular 20 optimizations
     */
    private updateBuildConfigurations;
    /**
     * Configure incremental hydration for SSR applications only
     */
    private configureIncrementalHydration;
    /**
     * Setup advanced signal optimizations
     */
    private setupSignalOptimizations;
    /**
     * Configure zoneless change detection (opt-in)
     */
    private configureZonelessDetection;
    /**
     * Update main.ts for Angular 20 optimizations
     */
    private updateMainTsForAngular20;
    /**
     * Configure advanced SSR features
     */
    private configureAdvancedSSR;
    /**
     * Update TypeScript configuration for Angular 20
     */
    protected updateTypeScriptConfigForAngular20(projectPath: string): Promise<void>;
    /**
     * Configure Material 3 design system (if Material is present)
     */
    private configureMaterial3DesignSystem;
    /**
     * Setup enhanced developer tools and debugging
     */
    private setupEnhancedDevTools;
    /**
     * Migrate from webpack-dev-server to esbuild dev server (Angular 18+)
     */
    private migrateToEsbuildDevServer;
    /**
     * Configure esbuild dev server in angular.json
     */
    private configureEsbuildDevServer;
    /**
     * Configure advanced build optimizations
     */
    private configureAdvancedBuildOptimizations;
}
//# sourceMappingURL=Angular20Handler.d.ts.map