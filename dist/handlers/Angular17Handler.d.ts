import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, Migration } from '../types';
/**
 * Angular 17 Handler - New application bootstrap and asset management
 *
 * Manages migration to Angular 17 with new application bootstrap API, asset folder
 * restructuring, enhanced SSR capabilities, and stable control flow syntax. This
 * version introduces significant architectural improvements and developer experience
 * enhancements while maintaining backward compatibility.
 *
 * Key Features in Angular 17:
 * - New application bootstrap API
 * - Assets folder migration to public folder
 * - Stable control flow syntax (@if, @for, @switch)
 * - Enhanced SSR with improved hydration
 * - Build system optimizations
 * - Material Design 3 support
 *
 * @example
 * ```typescript
 * const handler = new Angular17Handler();
 * await handler.applyVersionSpecificChanges('/path/to/project', {
 *   strategy: 'progressive',
 *   enableNewBootstrap: true
 * });
 * ```
 *
 * @since 1.0.0
 * @author Angular Multi-Version Upgrade Orchestrator
 */
export declare class Angular17Handler extends BaseVersionHandler {
    /** The Angular version this handler manages */
    readonly version = "17";
    /**
     * Gets the minimum required Node.js version for Angular 17
     * @returns The minimum Node.js version requirement
     */
    protected getRequiredNodeVersion(): string;
    /**
     * Gets the required TypeScript version range for Angular 17
     * @returns The TypeScript version requirement
     */
    protected getRequiredTypeScriptVersion(): string;
    /**
     * Applies all Angular 17 specific transformations to the project
     *
     * Orchestrates migration including new application bootstrap, asset restructuring,
     * control flow syntax stabilization, and SSR enhancements. Provides safe migration
     * paths while preserving existing functionality.
     *
     * @param projectPath - The absolute path to the Angular project root
     * @param options - Upgrade configuration options including strategy and feature flags
     * @throws {Error} When critical transformations fail
     */
    protected applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;
    /**
     * Update to new application bootstrap while preserving existing code
     */
    private updateApplicationBootstrap;
    /**
     * Prepares for Angular 18+ public folder structure (Angular 17 → 18 preparation)
     *
     * This creates a public folder and copies assets to prepare for Angular 18+ migration,
     * while maintaining full backward compatibility with src/assets. The actual migration
     * to public-only happens in Angular 18+ handlers.
     *
     * @param projectPath - The absolute path to the Angular project root
     * @private
     *
     * @example
     * Before: src/assets/images/logo.png
     * After: Both src/assets/images/logo.png AND public/images/logo.png work
     */
    private migrateAssetsToPublic;
    /**
     * Update asset configuration in angular.json
     */
    private updateAssetConfiguration;
    /**
     * Enable new control flow syntax
     */
    private enableNewControlFlow;
    /**
     * Update SSR configuration
     */
    private updateSSRConfiguration;
    /**
     * Update build configuration
     */
    private updateBuildConfiguration;
    /**
     * Update Angular Material for Angular 17
     * Uses DependencyInstaller for automatic installation
     */
    private updateAngularMaterial;
    /**
     * Update builder configurations for Angular 17
     */
    protected updateBuilderConfigurations(angularJson: any): void;
    /**
     * Update TypeScript configuration for Angular 17
     */
    protected updateTypeScriptConfig(tsconfig: any): void;
    /**
     * Angular 17 breaking changes
     */
    getBreakingChanges(): BreakingChange[];
    /**
     * Override to provide Angular 17 specific migrations
     */
    protected getAvailableMigrations(): Migration[];
    /**
     * Run Angular 17 specific migrations based on strategy
     */
    protected runVersionSpecificMigrations(projectPath: string): Promise<void>;
}
//# sourceMappingURL=Angular17Handler.d.ts.map