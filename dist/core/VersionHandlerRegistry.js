"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionHandlerRegistry = void 0;
const Angular12Handler_1 = require("../handlers/Angular12Handler");
const Angular13Handler_1 = require("../handlers/Angular13Handler");
const Angular14Handler_1 = require("../handlers/Angular14Handler");
const Angular15Handler_1 = require("../handlers/Angular15Handler");
const Angular16Handler_1 = require("../handlers/Angular16Handler");
const Angular17Handler_1 = require("../handlers/Angular17Handler");
const Angular18Handler_1 = require("../handlers/Angular18Handler");
const Angular19Handler_1 = require("../handlers/Angular19Handler");
const Angular20Handler_1 = require("../handlers/Angular20Handler");
const CodeTransformer_1 = require("../transformers/CodeTransformer");
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
class VersionHandlerRegistry {
    constructor() {
        this.handlers = new Map();
        this.transformers = new Map();
        this.registerDefaultHandlers();
        this.registerDefaultTransformers();
    }
    /**
     * Register default version handlers for Angular 12-20
     */
    registerDefaultHandlers() {
        this.registerHandler('12', new Angular12Handler_1.Angular12Handler());
        this.registerHandler('13', new Angular13Handler_1.Angular13Handler());
        this.registerHandler('14', new Angular14Handler_1.Angular14Handler());
        this.registerHandler('15', new Angular15Handler_1.Angular15Handler());
        this.registerHandler('16', new Angular16Handler_1.Angular16Handler());
        this.registerHandler('17', new Angular17Handler_1.Angular17Handler());
        this.registerHandler('18', new Angular18Handler_1.Angular18Handler());
        this.registerHandler('19', new Angular19Handler_1.Angular19Handler());
        this.registerHandler('20', new Angular20Handler_1.Angular20Handler());
    }
    /**
     * Register default code transformers
     */
    registerDefaultTransformers() {
        const codeTransformer = new CodeTransformer_1.CodeTransformer();
        this.registerTransformer('api', codeTransformer);
        this.registerTransformer('template', codeTransformer);
        this.registerTransformer('config', codeTransformer);
        this.registerTransformer('style', codeTransformer);
        this.registerTransformer('build', codeTransformer);
        this.registerTransformer('dependency', codeTransformer);
    }
    /**
     * Register a version-specific handler
     */
    registerHandler(version, handler) {
        this.handlers.set(version, handler);
    }
    /**
     * Register a transformation handler
     */
    registerTransformer(type, transformer) {
        this.transformers.set(type, transformer);
    }
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
    getHandler(version) {
        const majorVersion = version.split('.')[0];
        return this.handlers.get(majorVersion);
    }
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
    getTransformer(type) {
        return this.transformers.get(type);
    }
    /**
     * Get all registered version handlers
     */
    getAllHandlers() {
        return new Map(this.handlers);
    }
    /**
     * Get all registered transformers
     */
    getAllTransformers() {
        return new Map(this.transformers);
    }
    /**
     * Check if handler exists for version
     */
    hasHandler(version) {
        const majorVersion = version.split('.')[0];
        return this.handlers.has(majorVersion);
    }
    /**
     * Get supported versions
     */
    getSupportedVersions() {
        return Array.from(this.handlers.keys()).sort((a, b) => Number(a) - Number(b));
    }
    /**
     * Get breaking changes for specific version
     */
    getBreakingChanges(version) {
        const handler = this.getHandler(version);
        return handler ? handler.getBreakingChanges() : [];
    }
    /**
     * Get all breaking changes for version range
     */
    getBreakingChangesForRange(fromVersion, toVersion) {
        const fromMajor = Number(fromVersion.split('.')[0]);
        const toMajor = Number(toVersion.split('.')[0]);
        const changes = [];
        for (let version = fromMajor + 1; version <= toMajor; version++) {
            const versionChanges = this.getBreakingChanges(version.toString());
            changes.push(...versionChanges);
        }
        return changes;
    }
    /**
     * Validate all handlers are properly configured
     */
    async validateHandlers() {
        const errors = [];
        for (const [version, handler] of this.handlers) {
            try {
                if (!handler.version) {
                    errors.push(`Handler for version ${version} missing version property`);
                }
                if (typeof handler.execute !== 'function') {
                    errors.push(`Handler for version ${version} missing execute method`);
                }
                if (typeof handler.validatePrerequisites !== 'function') {
                    errors.push(`Handler for version ${version} missing validatePrerequisites method`);
                }
                if (typeof handler.getBreakingChanges !== 'function') {
                    errors.push(`Handler for version ${version} missing getBreakingChanges method`);
                }
            }
            catch (error) {
                errors.push(`Handler validation failed for version ${version}: ${error}`);
            }
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
exports.VersionHandlerRegistry = VersionHandlerRegistry;
//# sourceMappingURL=VersionHandlerRegistry.js.map