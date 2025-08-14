import { UpgradeStep, UpgradeOptions, BreakingChange } from '../types';
/**
 * Interface for version-specific upgrade handlers.
 *
 * Each Angular version has a corresponding handler that implements this interface
 * to provide version-specific upgrade logic, prerequisite validation, and breaking
 * change information.
 */
export interface VersionHandler {
    /** Angular version this handler manages (e.g., '17', '18') */
    version: string;
    /**
     * Execute the version-specific upgrade logic.
     * @param projectPath - Path to the Angular project
     * @param step - Upgrade step configuration
     * @param options - Overall upgrade options
     */
    execute(projectPath: string, step: UpgradeStep, options: UpgradeOptions): Promise<void>;
    /**
     * Validate that all prerequisites are met for this version upgrade.
     * @param projectPath - Path to the Angular project
     * @returns Promise resolving to true if prerequisites are met
     */
    validatePrerequisites(projectPath: string): Promise<boolean>;
    /**
     * Get list of breaking changes introduced in this version.
     * @returns Array of breaking changes for this version
     */
    getBreakingChanges(): BreakingChange[];
}
/**
 * Interface for code transformation handlers.
 *
 * These handlers apply specific types of code transformations during upgrades,
 * such as API changes, template updates, or configuration modifications.
 */
export interface TransformationHandler {
    /** Type of transformation this handler manages */
    type: string;
    /**
     * Apply the transformation for a specific breaking change.
     * @param projectPath - Path to the Angular project
     * @param change - Breaking change to apply transformation for
     */
    apply(projectPath: string, change: BreakingChange): Promise<void>;
}
/**
 * Registry for managing version-specific upgrade handlers and code transformers.
 *
 * The VersionHandlerRegistry maintains a collection of handlers for each supported
 * Angular version and provides methods to retrieve handlers, validate configurations,
 * and manage breaking changes across versions.
 *
 * @class VersionHandlerRegistry
 *
 * @example
 * ```typescript
 * const registry = new VersionHandlerRegistry();
 *
 * // Get handler for Angular 17
 * const handler = registry.getHandler('17');
 * if (handler) {
 *   const breakingChanges = handler.getBreakingChanges();
 *   console.log(`Angular 17 has ${breakingChanges.length} breaking changes`);
 * }
 *
 * // Get all supported versions
 * const versions = registry.getSupportedVersions();
 * console.log('Supported versions:', versions.join(', '));
 * ```
 */
export declare class VersionHandlerRegistry {
    private handlers;
    private transformers;
    constructor();
    /**
     * Register default version handlers for Angular 12-20
     */
    private registerDefaultHandlers;
    /**
     * Register default code transformers
     */
    private registerDefaultTransformers;
    /**
     * Register a version-specific handler
     */
    registerHandler(version: string, handler: VersionHandler): void;
    /**
     * Register a transformation handler
     */
    registerTransformer(type: string, transformer: TransformationHandler): void;
    /**
     * Get handler for specific Angular version.
     *
     * Retrieves the version-specific upgrade handler for the given Angular version.
     * The version is normalized to major version number for lookup.
     *
     * @param {string} version - Angular version (e.g., '17', '17.1.0', '17.0.0')
     * @returns {VersionHandler | undefined} Handler for the version, or undefined if not found
     *
     * @example
     * ```typescript
     * const handler = registry.getHandler('17.1.0'); // Returns Angular17Handler
     * const handler = registry.getHandler('99');     // Returns undefined
     * ```
     */
    getHandler(version: string): VersionHandler | undefined;
    /**
     * Get transformer for specific change type.
     *
     * Retrieves the code transformation handler for a specific type of change,
     * such as 'api', 'template', 'config', etc.
     *
     * @param {string} type - Type of transformation ('api', 'template', 'config', etc.)
     * @returns {TransformationHandler | undefined} Transformer for the type, or undefined if not found
     *
     * @example
     * ```typescript
     * const transformer = registry.getTransformer('api');      // Returns API transformer
     * const transformer = registry.getTransformer('unknown'); // Returns undefined
     * ```
     */
    getTransformer(type: string): TransformationHandler | undefined;
    /**
     * Get all registered version handlers
     */
    getAllHandlers(): Map<string, VersionHandler>;
    /**
     * Get all registered transformers
     */
    getAllTransformers(): Map<string, TransformationHandler>;
    /**
     * Check if handler exists for version
     */
    hasHandler(version: string): boolean;
    /**
     * Get supported versions
     */
    getSupportedVersions(): string[];
    /**
     * Get breaking changes for specific version
     */
    getBreakingChanges(version: string): BreakingChange[];
    /**
     * Get all breaking changes for version range
     */
    getBreakingChangesForRange(fromVersion: string, toVersion: string): BreakingChange[];
    /**
     * Validate all handlers are properly configured
     */
    validateHandlers(): Promise<{
        valid: boolean;
        errors: string[];
    }>;
}
//# sourceMappingURL=VersionHandlerRegistry.d.ts.map