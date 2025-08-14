import { UpgradeStep, UpgradeOptions, BreakingChange } from '../types';
import { Angular12Handler } from '../handlers/Angular12Handler';
import { Angular13Handler } from '../handlers/Angular13Handler';
import { Angular14Handler } from '../handlers/Angular14Handler';
import { Angular15Handler } from '../handlers/Angular15Handler';
import { Angular16Handler } from '../handlers/Angular16Handler';
import { Angular17Handler } from '../handlers/Angular17Handler';
import { Angular18Handler } from '../handlers/Angular18Handler';
import { Angular19Handler } from '../handlers/Angular19Handler';
import { Angular20Handler } from '../handlers/Angular20Handler';
import { CodeTransformer } from '../transformers/CodeTransformer';

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
export class VersionHandlerRegistry {
  private handlers = new Map<string, VersionHandler>();
  private transformers = new Map<string, TransformationHandler>();

  constructor() {
    this.registerDefaultHandlers();
    this.registerDefaultTransformers();
  }

  /**
   * Register default version handlers for Angular 12-20
   */
  private registerDefaultHandlers(): void {
    this.registerHandler('12', new Angular12Handler());
    this.registerHandler('13', new Angular13Handler());
    this.registerHandler('14', new Angular14Handler());
    this.registerHandler('15', new Angular15Handler());
    this.registerHandler('16', new Angular16Handler());
    this.registerHandler('17', new Angular17Handler());
    this.registerHandler('18', new Angular18Handler());
    this.registerHandler('19', new Angular19Handler());
    this.registerHandler('20', new Angular20Handler());
  }

  /**
   * Register default code transformers
   */
  private registerDefaultTransformers(): void {
    const codeTransformer = new CodeTransformer();
    
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
  registerHandler(version: string, handler: VersionHandler): void {
    this.handlers.set(version, handler);
  }

  /**
   * Register a transformation handler
   */
  registerTransformer(type: string, transformer: TransformationHandler): void {
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
  getHandler(version: string): VersionHandler | undefined {
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
  getTransformer(type: string): TransformationHandler | undefined {
    return this.transformers.get(type);
  }

  /**
   * Get all registered version handlers
   */
  getAllHandlers(): Map<string, VersionHandler> {
    return new Map(this.handlers);
  }

  /**
   * Get all registered transformers
   */
  getAllTransformers(): Map<string, TransformationHandler> {
    return new Map(this.transformers);
  }

  /**
   * Check if handler exists for version
   */
  hasHandler(version: string): boolean {
    const majorVersion = version.split('.')[0];
    return this.handlers.has(majorVersion);
  }

  /**
   * Get supported versions
   */
  getSupportedVersions(): string[] {
    return Array.from(this.handlers.keys()).sort((a, b) => Number(a) - Number(b));
  }

  /**
   * Get breaking changes for specific version
   */
  getBreakingChanges(version: string): BreakingChange[] {
    const handler = this.getHandler(version);
    return handler ? handler.getBreakingChanges() : [];
  }

  /**
   * Get all breaking changes for version range
   */
  getBreakingChangesForRange(fromVersion: string, toVersion: string): BreakingChange[] {
    const fromMajor = Number(fromVersion.split('.')[0]);
    const toMajor = Number(toVersion.split('.')[0]);
    const changes: BreakingChange[] = [];

    for (let version = fromMajor + 1; version <= toMajor; version++) {
      const versionChanges = this.getBreakingChanges(version.toString());
      changes.push(...versionChanges);
    }

    return changes;
  }

  /**
   * Validate all handlers are properly configured
   */
  async validateHandlers(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
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
      } catch (error) {
        errors.push(`Handler validation failed for version ${version}: ${error}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}