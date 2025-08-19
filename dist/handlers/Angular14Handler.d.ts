import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate, Migration } from '../types';
/**
 * Angular 14 Handler - Standalone components and enhanced APIs
 *
 * Manages migration to Angular 14 with comprehensive support for standalone components,
 * enhanced dependency injection, typed reactive forms, and improved developer experience.
 * This handler introduces foundational changes that enable module-free component development.
 *
 * Key Features in Angular 14:
 * - Standalone components introduction (revolutionary change)
 * - Optional injectors and inject() function
 * - Protected route guards
 * - Extended developer experience APIs
 * - Angular CLI auto-completion
 * - Strict typed reactive forms
 * - Page title strategy
 *
 * @example
 * ```typescript
 * const handler = new Angular14Handler();
 * await handler.applyVersionSpecificChanges('/path/to/project', {
 *   strategy: 'balanced',
 *   enableStandaloneComponents: true
 * });
 * ```
 *
 * @since 1.0.0
 * @author Angular Multi-Version Upgrade Orchestrator
 */
export declare class Angular14Handler extends BaseVersionHandler {
    /** The Angular version this handler manages */
    readonly version = "14";
    /**
     * Gets the minimum required Node.js version for Angular 14
     * @returns The minimum Node.js version requirement
     */
    protected getRequiredNodeVersion(): string;
    /**
     * Gets the required TypeScript version range for Angular 14
     * @returns The TypeScript version requirement
     */
    protected getRequiredTypeScriptVersion(): string;
    /**
     * Gets all dependency updates required for Angular 14 migration
     *
     * Includes core Angular packages, CLI tools, TypeScript compatibility updates,
     * and optional third-party library updates like Angular Material.
     *
     * @returns Array of dependency updates with package names, versions, and types
     */
    getDependencyUpdates(): DependencyUpdate[];
    /**
     * Applies all Angular 14 specific transformations to the project
     *
     * Orchestrates the complete migration including standalone components setup,
     * optional injectors implementation, typed reactive forms configuration,
     * and enhanced developer experience features. This is a foundational upgrade
     * that introduces revolutionary standalone component architecture.
     *
     * @param projectPath - The absolute path to the Angular project root
     * @param options - Upgrade configuration options (unused but required for interface compliance)
     * @throws {Error} When critical transformations fail
     */
    protected applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;
    getBreakingChanges(): BreakingChange[];
    /**
     * Setup foundation for standalone components
     */
    private setupStandaloneComponentsSupport;
    /**
     * Implement optional injectors and inject() function
     */
    private implementOptionalInjectors;
    /**
     * Setup protected route guards
     */
    private setupProtectedRouteGuards;
    /**
     * Configure extended developer experience APIs
     */
    private configureExtendedDevAPIs;
    /**
     * Setup Angular CLI auto-completion
     */
    private setupCLIAutoCompletion;
    /**
     * Configure strict typed reactive forms
     */
    private configureStrictTypedForms;
    /**
     * Implement page title strategy
     */
    private implementPageTitleStrategy;
    /**
     * Update build configurations for Angular 14
     */
    private updateBuildConfigurations;
    /**
     * Update TypeScript configuration for standalone components
     */
    private updateTsConfigForStandalone;
    /**
     * Validate third-party library compatibility for Angular 14
     */
    private validateThirdPartyCompatibility;
    /**
     * Check if a library can benefit from standalone components
     */
    private canBenefitFromStandalone;
    /**
     * Override to provide Angular 14 specific migrations
     */
    protected getAvailableMigrations(): Migration[];
    /**
     * Run Angular 14 specific migrations
     */
    protected runVersionSpecificMigrations(projectPath: string): Promise<void>;
}
//# sourceMappingURL=Angular14Handler.d.ts.map