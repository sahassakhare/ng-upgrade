import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate, Migration } from '../types';
/**
 * Angular 16 Handler - Required inputs, signals, and new control flow
 *
 * Handles the migration to Angular 16 with comprehensive support for all new features
 * including required inputs, signals introduction, new control flow syntax, and enhanced
 * developer experience improvements.
 *
 * Key Features in Angular 16:
 * - Required inputs (@Input({ required: true }))
 * - Router data as input
 * - New control flow syntax (@if, @for, @switch) - developer preview
 * - Signals introduction (developer preview)
 * - Self-closing tags support
 * - Standalone ng new collection
 * - Non-destructive hydration (developer preview)
 * - esbuild and Vite support for dev server
 *
 * @example
 * ```typescript
 * const handler = new Angular16Handler();
 * await handler.applyVersionSpecificChanges('/path/to/project', options);
 * ```
 *
 * @since 1.0.0
 * @author Angular Multi-Version Upgrade Orchestrator
 */
export declare class Angular16Handler extends BaseVersionHandler {
    /** The Angular version this handler manages */
    readonly version = "16";
    /**
     * Gets the minimum required Node.js version for Angular 16
     * @returns The minimum Node.js version requirement
     */
    protected getRequiredNodeVersion(): string;
    /**
     * Gets the required TypeScript version range for Angular 16
     * @returns The TypeScript version requirement
     */
    protected getRequiredTypeScriptVersion(): string;
    /**
     * Gets all dependency updates required for Angular 16 migration
     *
     * Includes core Angular packages, CLI tools, TypeScript, and third-party
     * libraries like Angular Material that need version alignment.
     *
     * @returns Array of dependency updates with package names, versions, and types
     * @example
     * ```typescript
     * const updates = handler.getDependencyUpdates();
     * // Returns: [{ name: '@angular/core', version: '^16.0.0', type: 'dependencies' }, ...]
     * ```
     */
    getDependencyUpdates(): DependencyUpdate[];
    /**
     * Applies all Angular 16 specific transformations to the project
     *
     * This method orchestrates the complete migration process including:
     * - Required inputs implementation
     * - Router data as input setup
     * - New control flow syntax introduction
     * - Signals foundation implementation
     * - Self-closing tags support
     * - Build configuration updates
     * - Third-party compatibility validation
     *
     * @param projectPath - The absolute path to the Angular project root
     * @param options - Upgrade configuration options including strategy and validation level
     * @throws {Error} When critical transformations fail
     *
     * @example
     * ```typescript
     * await handler.applyVersionSpecificChanges('/path/to/project', {
     *   strategy: 'balanced',
     *   validationLevel: 'comprehensive'
     * });
     * ```
     */
    protected applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;
    /**
     * Gets all breaking changes introduced in Angular 16
     *
     * Returns a comprehensive list of breaking changes with severity levels,
     * descriptions, and migration guidance. Most Angular 16 changes are opt-in
     * features with low impact on existing applications.
     *
     * @returns Array of breaking change objects with migration guidance
     *
     * @example
     * ```typescript
     * const changes = handler.getBreakingChanges();
     * changes.forEach(change => {
     *   console.log(`${change.id}: ${change.description}`);
     * });
     * ```
     */
    getBreakingChanges(): BreakingChange[];
    /**
     * Implements required inputs support with comprehensive examples
     *
     * Creates example components demonstrating the new @Input({ required: true })
     * syntax and input transforms. Generates practical examples that developers
     * can use as reference for migrating their own components.
     *
     * @param projectPath - The absolute path to the Angular project root
     * @private
     *
     * @example
     * Generated example includes:
     * ```typescript
     * @Input({ required: true }) name!: string;
     * @Input({ transform: (value: string) => value.toUpperCase() }) displayName?: string;
     * ```
     */
    private implementRequiredInputs;
    /**
     * Setup router data as input feature
     */
    private setupRouterDataAsInput;
    /**
     * Introduce new control flow syntax (developer preview)
     */
    private introduceNewControlFlowSyntax;
    /**
     * Implements signals foundation with comprehensive examples and patterns
     *
     * Creates example components demonstrating Angular 16's new signals API including
     * basic signals, computed signals, effects, and practical usage patterns. Signals
     * are in developer preview and provide a new reactive primitive for state management.
     *
     * @param projectPath - The absolute path to the Angular project root
     * @private
     *
     * @example
     * Generated examples include:
     * ```typescript
     * count = signal(0);
     * doubleCount = computed(() => this.count() * 2);
     * effect(() => console.log(`Count: ${this.count()}`));
     * ```
     */
    private implementSignalsFoundation;
    /**
     * Enable self-closing tags support
     */
    private enableSelfClosingTagsSupport;
    /**
     * Setup standalone ng new collection
     */
    private setupStandaloneCollection;
    /**
     * Configure non-destructive hydration - only for SSR applications
     */
    private configureNonDestructiveHydration;
    /**
     * Setup esbuild and Vite support
     */
    private setupESBuildAndViteSupport;
    /**
     * Update build configurations for Angular 16
     */
    private updateBuildConfigurations;
    /**
     * Validate and update third-party compatibility for Angular 16
     */
    private validateThirdPartyCompatibility;
    /**
     * Check if a library can benefit from signals
     */
    private canBenefitFromSignals;
    /**
     * Check if a library can benefit from standalone components
     */
    private canBenefitFromStandalone;
    /**
     * Gets all available migrations for Angular 16 including base and version-specific ones
     *
     * Combines inherited migrations from the base handler with Angular 16 specific
     * migrations like required inputs, router data as input, and non-destructive hydration.
     * Each migration includes command, description, and optional flag.
     *
     * @returns Array of available migration objects
     * @protected
     * @override
     *
     * @example
     * ```typescript
     * const migrations = handler.getAvailableMigrations();
     * // Returns migrations for: Required Inputs, Router Data as Input, etc.
     * ```
     */
    protected getAvailableMigrations(): Migration[];
    /**
     * Run Angular 16 specific migrations
     */
    protected runVersionSpecificMigrations(projectPath: string): Promise<void>;
}
//# sourceMappingURL=Angular16Handler.d.ts.map