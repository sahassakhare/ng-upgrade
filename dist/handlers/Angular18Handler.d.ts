import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate } from '../types';
/**
 * Angular 18 Handler - Material 3 and built-in control flow stabilization
 *
 * Key Features in Angular 18:
 * - Material Design 3 (M3) support in Angular Material
 * - Built-in control flow syntax stabilization (@if, @for, @switch)
 * - New lifecycle hooks (afterRender, afterNextRender)
 * - Event replay for SSR hydration
 * - Hybrid rendering capabilities
 * - Angular DevKit improvements
 * - Improved i18n extraction and tooling
 * - Enhanced change detection optimizations
 */
export declare class Angular18Handler extends BaseVersionHandler {
    readonly version = "18";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    /**
     * Get Angular 18 dependencies with correct versions
     */
    getDependencyUpdates(): DependencyUpdate[];
    protected applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;
    getBreakingChanges(): BreakingChange[];
    /**
     * Implement Material Design 3 support
     */
    private implementMaterial3Support;
    /**
     * Stabilize built-in control flow syntax
     */
    private stabilizeBuiltInControlFlow;
    /**
     * Implement new lifecycle hooks
     */
    private implementNewLifecycleHooks;
    /**
     * Setup event replay for SSR hydration
     */
    private setupEventReplaySSR;
    /**
     * Configure hybrid rendering capabilities
     */
    private configureHybridRendering;
    /**
     * Enhanced i18n extraction and tooling
     */
    private enhanceI18nTooling;
    /**
     * Optimize change detection improvements
     */
    private optimizeChangeDetection;
    /**
     * Update build configurations for Angular 18
     */
    private updateBuildConfigurations;
    /**
     * Validate third-party compatibility for Angular 18
     */
    private validateThirdPartyCompatibility;
    /**
     * Check if a library can benefit from control flow syntax
     */
    private canBenefitFromControlFlow;
    /**
     * Check if a library can benefit from new lifecycle hooks
     */
    private canBenefitFromLifecycleHooks;
}
//# sourceMappingURL=Angular18Handler.d.ts.map