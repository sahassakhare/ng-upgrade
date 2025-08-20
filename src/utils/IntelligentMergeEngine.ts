import * as fs from 'fs-extra';
import * as path from 'path';
// Simple deep merge utility - fallback for ts-deepmerge
function deepmerge(target: any, source: any, customMergers?: any): any {
  if (typeof source !== 'object' || source === null) {
    return source;
  }
  
  if (typeof target !== 'object' || target === null) {
    return source;
  }
  
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (customMergers && customMergers[key]) {
        result[key] = customMergers[key](target[key], source[key]);
      } else if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepmerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
}
import { Project, SourceFile, SyntaxKind, Node, ScriptTarget, ModuleKind, ModuleResolutionKind } from 'ts-morph';
import { ProgressReporter } from './ProgressReporter';

export interface MergeOptions {
  preserveUserCode: boolean;
  preserveComments: boolean;
  preferUserConfiguration: boolean;
  createBackups: boolean;
  mergeStrategy: 'conservative' | 'aggressive' | 'interactive';
  conflictResolution: 'user' | 'migration' | 'merge' | 'ask';
}

export interface MergeResult {
  success: boolean;
  conflicts: MergeConflict[];
  warnings: string[];
  merged: boolean;
  backupPath?: string;
}

export interface MergeConflict {
  file: string;
  type: 'configuration' | 'code' | 'template' | 'style';
  section: string;
  userValue: any;
  migrationValue: any;
  resolution?: 'user' | 'migration' | 'merged';
  mergedValue?: any;
}

/**
 * Intelligent merge engine that combines ts-deepmerge for configurations
 * and custom logic for TypeScript code merging
 */
export class IntelligentMergeEngine {
  private project: Project;
  private progressReporter?: ProgressReporter;

  constructor(projectPath: string, progressReporter?: ProgressReporter) {
    const tsConfigPath = path.join(projectPath, 'tsconfig.json');
    const tsConfigExists = fs.existsSync(tsConfigPath);
    
    this.project = new Project({
      ...(tsConfigExists ? { tsConfigFilePath: tsConfigPath } : {
        compilerOptions: {
          target: ScriptTarget.ES2020,
          module: ModuleKind.ES2020,
          moduleResolution: ModuleResolutionKind.NodeNext,
          strict: false,
          esModuleInterop: true,
          skipLibCheck: true
        }
      })
    });
    this.progressReporter = progressReporter;
  }

  /**
   * Merge package.json configurations intelligently
   */
  async mergePackageJson(
    packageJsonPath: string,
    migrationUpdates: any,
    options: MergeOptions = this.getDefaultOptions()
  ): Promise<MergeResult> {
    try {
      const userPackageJson = await fs.readJson(packageJsonPath);
      const backup = options.createBackups ? await this.createBackup(packageJsonPath) : undefined;

      // Use ts-deepmerge for deep merging with custom merge functions
      const mergedPackageJson = deepmerge(
        userPackageJson,
        migrationUpdates,
        {
          // Custom merge for dependencies - preserve user versions unless migration requires specific version
          dependencies: (userDeps: any, migrationDeps: any) => {
            return this.mergeDependencies(userDeps, migrationDeps, options);
          },
          devDependencies: (userDeps: any, migrationDeps: any) => {
            return this.mergeDependencies(userDeps, migrationDeps, options);
          },
          scripts: (userScripts: any, migrationScripts: any) => {
            return this.mergeScripts(userScripts, migrationScripts, options);
          }
        }
      );

      await fs.writeJson(packageJsonPath, mergedPackageJson, { spaces: 2 });

      this.progressReporter?.success('✓ package.json merged successfully');
      
      return {
        success: true,
        conflicts: [],
        warnings: [],
        merged: true,
        backupPath: backup
      };

    } catch (error) {
      return {
        success: false,
        conflicts: [],
        warnings: [`Failed to merge package.json: ${error instanceof Error ? error.message : String(error)}`],
        merged: false
      };
    }
  }

  /**
   * Merge angular.json configurations
   */
  async mergeAngularJson(
    angularJsonPath: string,
    migrationUpdates: any,
    options: MergeOptions = this.getDefaultOptions()
  ): Promise<MergeResult> {
    try {
      const userAngularJson = await fs.readJson(angularJsonPath);
      const backup = options.createBackups ? await this.createBackup(angularJsonPath) : undefined;

      // Intelligent merge for angular.json with special handling for architect configs
      const mergedAngularJson = deepmerge(
        userAngularJson,
        migrationUpdates,
        {
          // Custom merge for architect configurations
          projects: (userProjects: any, migrationProjects: any) => {
            return this.mergeProjects(userProjects, migrationProjects, options);
          }
        }
      );

      await fs.writeJson(angularJsonPath, mergedAngularJson, { spaces: 2 });

      this.progressReporter?.success('✓ angular.json merged successfully');
      
      return {
        success: true,
        conflicts: [],
        warnings: [],
        merged: true,
        backupPath: backup
      };

    } catch (error) {
      return {
        success: false,
        conflicts: [],
        warnings: [`Failed to merge angular.json: ${error instanceof Error ? error.message : String(error)}`],
        merged: false
      };
    }
  }

  /**
   * Merge TypeScript configuration files (tsconfig.json)
   */
  async mergeTsConfig(
    tsConfigPath: string,
    migrationUpdates: any,
    options: MergeOptions = this.getDefaultOptions()
  ): Promise<MergeResult> {
    try {
      const userTsConfig = await fs.readJson(tsConfigPath);
      const backup = options.createBackups ? await this.createBackup(tsConfigPath) : undefined;

      // Deep merge with special handling for compiler options
      const mergedTsConfig = deepmerge(
        userTsConfig,
        migrationUpdates,
        {
          compilerOptions: (userOptions: any, migrationOptions: any) => {
            return this.mergeCompilerOptions(userOptions, migrationOptions, options);
          }
        }
      );

      await fs.writeJson(tsConfigPath, mergedTsConfig, { spaces: 2 });

      this.progressReporter?.success('✓ tsconfig.json merged successfully');
      
      return {
        success: true,
        conflicts: [],
        warnings: [],
        merged: true,
        backupPath: backup
      };

    } catch (error) {
      return {
        success: false,
        conflicts: [],
        warnings: [`Failed to merge tsconfig.json: ${error instanceof Error ? error.message : String(error)}`],
        merged: false
      };
    }
  }

  /**
   * Merge TypeScript source files with AST-based merging
   */
  async mergeTypeScriptFile(
    filePath: string,
    migrationChanges: any,
    options: MergeOptions = this.getDefaultOptions()
  ): Promise<MergeResult> {
    try {
      const backup = options.createBackups ? await this.createBackup(filePath) : undefined;
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      
      const conflicts: MergeConflict[] = [];
      
      // Merge imports
      if (migrationChanges.imports) {
        this.mergeImports(sourceFile, migrationChanges.imports, conflicts, options);
      }

      // Merge class decorators
      if (migrationChanges.decorators) {
        this.mergeDecorators(sourceFile, migrationChanges.decorators, conflicts, options);
      }

      // Merge class members (properties, methods)
      if (migrationChanges.classMembers) {
        this.mergeClassMembers(sourceFile, migrationChanges.classMembers, conflicts, options);
      }

      // Merge providers and configurations
      if (migrationChanges.providers) {
        this.mergeProviders(sourceFile, migrationChanges.providers, conflicts, options);
      }

      await sourceFile.save();

      this.progressReporter?.success(`✓ ${path.basename(filePath)} merged successfully`);
      
      return {
        success: true,
        conflicts,
        warnings: [],
        merged: true,
        backupPath: backup
      };

    } catch (error) {
      return {
        success: false,
        conflicts: [],
        warnings: [`Failed to merge ${filePath}: ${error instanceof Error ? error.message : String(error)}`],
        merged: false
      };
    }
  }

  /**
   * Merge template files (.html)
   */
  async mergeTemplateFile(
    templatePath: string,
    migrationChanges: any,
    options: MergeOptions = this.getDefaultOptions()
  ): Promise<MergeResult> {
    try {
      const userTemplate = await fs.readFile(templatePath, 'utf-8');
      const backup = options.createBackups ? await this.createBackup(templatePath) : undefined;
      
      let mergedTemplate = userTemplate;
      const conflicts: MergeConflict[] = [];

      // Merge control flow changes (*ngIf to @if)
      if (migrationChanges.controlFlow) {
        const result = this.mergeControlFlow(mergedTemplate, migrationChanges.controlFlow, options);
        mergedTemplate = result.template;
        conflicts.push(...result.conflicts);
      }

      // Merge directive changes
      if (migrationChanges.directives) {
        const result = this.mergeDirectives(mergedTemplate, migrationChanges.directives, options);
        mergedTemplate = result.template;
        conflicts.push(...result.conflicts);
      }

      await fs.writeFile(templatePath, mergedTemplate);

      this.progressReporter?.success(`✓ ${path.basename(templatePath)} template merged successfully`);
      
      return {
        success: true,
        conflicts,
        warnings: [],
        merged: true,
        backupPath: backup
      };

    } catch (error) {
      return {
        success: false,
        conflicts: [],
        warnings: [`Failed to merge template ${templatePath}: ${error instanceof Error ? error.message : String(error)}`],
        merged: false
      };
    }
  }

  /**
   * Custom dependency merging logic
   */
  private mergeDependencies(userDeps: any, migrationDeps: any, options: MergeOptions): any {
    if (!userDeps && !migrationDeps) return {};
    if (!userDeps) return migrationDeps;
    if (!migrationDeps) return userDeps;

    const merged = { ...userDeps };

    Object.entries(migrationDeps).forEach(([pkg, version]) => {
      if (options.preferUserConfiguration && merged[pkg]) {
        // Keep user version unless it's a critical Angular dependency
        if (this.isCriticalAngularDependency(pkg)) {
          merged[pkg] = version;
        }
      } else {
        merged[pkg] = version;
      }
    });

    return merged;
  }

  /**
   * Merge npm scripts intelligently
   */
  private mergeScripts(userScripts: any, migrationScripts: any, options: MergeOptions): any {
    if (!userScripts && !migrationScripts) return {};
    if (!userScripts) return migrationScripts;
    if (!migrationScripts) return userScripts;

    const merged = { ...userScripts };

    Object.entries(migrationScripts).forEach(([scriptName, scriptValue]) => {
      if (options.preferUserConfiguration && merged[scriptName]) {
        // Keep user script unless it's a build/test script that needs updating
        if (this.isCriticalScript(scriptName)) {
          merged[scriptName] = scriptValue;
        }
      } else {
        merged[scriptName] = scriptValue;
      }
    });

    return merged;
  }

  /**
   * Merge Angular projects configuration
   */
  private mergeProjects(userProjects: any, migrationProjects: any, options: MergeOptions): any {
    if (!userProjects) return migrationProjects;
    if (!migrationProjects) return userProjects;

    const merged = { ...userProjects };

    Object.entries(migrationProjects).forEach(([projectName, projectConfig]: [string, any]) => {
      if (merged[projectName]) {
        // Deep merge project configurations
        merged[projectName] = deepmerge(merged[projectName], projectConfig);
      } else {
        merged[projectName] = projectConfig;
      }
    });

    return merged;
  }

  /**
   * Merge compiler options with special handling
   */
  private mergeCompilerOptions(userOptions: any, migrationOptions: any, options: MergeOptions): any {
    if (!userOptions) return migrationOptions;
    if (!migrationOptions) return userOptions;

    const merged = { ...userOptions };

    // Special handling for certain compiler options
    Object.entries(migrationOptions).forEach(([option, value]) => {
      if (this.isStrictOption(option) && options.preferUserConfiguration) {
        // Don't override user's strict settings unless they explicitly want migration
        if (options.mergeStrategy === 'aggressive') {
          merged[option] = value;
        }
      } else {
        merged[option] = value;
      }
    });

    return merged;
  }

  /**
   * Merge imports in TypeScript files
   */
  private mergeImports(sourceFile: SourceFile, newImports: any[], conflicts: MergeConflict[], options: MergeOptions): void {
    newImports.forEach(newImport => {
      const existingImport = sourceFile.getImportDeclarations()
        .find(imp => imp.getModuleSpecifierValue() === newImport.moduleSpecifier);

      if (existingImport) {
        // Merge named imports
        const existingNamedImports = existingImport.getNamedImports().map(ni => ni.getName());
        const newNamedImports = newImport.namedImports || [];
        
        const allImports = [...new Set([...existingNamedImports, ...newNamedImports])];
        
        if (allImports.length > existingNamedImports.length) {
          // Update existing import with merged imports
          existingImport.removeNamedImports();
          existingImport.addNamedImports(allImports);
        }
      } else {
        // Add new import
        sourceFile.addImportDeclaration({
          moduleSpecifier: newImport.moduleSpecifier,
          namedImports: newImport.namedImports
        });
      }
    });
  }

  /**
   * Merge decorators on classes
   */
  private mergeDecorators(sourceFile: SourceFile, decoratorChanges: any[], conflicts: MergeConflict[], options: MergeOptions): void {
    decoratorChanges.forEach(change => {
      const classDecl = sourceFile.getClass(change.className);
      if (!classDecl) return;

      const existingDecorator = classDecl.getDecorator(change.decoratorName);
      
      if (existingDecorator) {
        // Merge decorator arguments
        if (change.mergeArguments && options.preferUserConfiguration) {
          const existingArgs = existingDecorator.getArguments();
          if (existingArgs.length > 0) {
            // Parse and merge object arguments
            try {
              const existingConfig = this.parseDecoratorArgument(existingArgs[0].getText());
              const newConfig = change.newConfiguration;
              const mergedConfig = deepmerge(existingConfig, newConfig);
              
              existingDecorator.remove();
              classDecl.addDecorator({
                name: change.decoratorName,
                arguments: [JSON.stringify(mergedConfig, null, 2)]
              });
            } catch (error) {
              // If parsing fails, create conflict
              conflicts.push({
                file: sourceFile.getFilePath(),
                type: 'code',
                section: `${change.className}.${change.decoratorName}`,
                userValue: existingDecorator.getText(),
                migrationValue: change.newConfiguration,
                resolution: options.conflictResolution === 'user' ? 'user' : 'migration'
              });
            }
          }
        }
      } else {
        // Add new decorator
        classDecl.addDecorator({
          name: change.decoratorName,
          arguments: [JSON.stringify(change.newConfiguration, null, 2)]
        });
      }
    });
  }

  /**
   * Merge class members (properties and methods)
   */
  private mergeClassMembers(sourceFile: SourceFile, memberChanges: any[], conflicts: MergeConflict[], options: MergeOptions): void {
    memberChanges.forEach(change => {
      const classDecl = sourceFile.getClass(change.className);
      if (!classDecl) return;

      if (change.type === 'property') {
        const existingProperty = classDecl.getProperty(change.name);
        if (!existingProperty && !options.preferUserConfiguration) {
          classDecl.addProperty(change.propertyStructure);
        }
      } else if (change.type === 'method') {
        const existingMethod = classDecl.getMethod(change.name);
        if (existingMethod && options.preserveUserCode) {
          // Create conflict - user has custom implementation
          conflicts.push({
            file: sourceFile.getFilePath(),
            type: 'code',
            section: `${change.className}.${change.name}()`,
            userValue: existingMethod.getText(),
            migrationValue: change.methodStructure,
            resolution: 'user' // Preserve user code by default
          });
        } else if (!existingMethod) {
          classDecl.addMethod(change.methodStructure);
        }
      }
    });
  }

  /**
   * Merge providers and dependency injection configurations
   */
  private mergeProviders(sourceFile: SourceFile, providerChanges: any[], conflicts: MergeConflict[], options: MergeOptions): void {
    // Implementation for merging providers in main.ts, app.config.ts, etc.
    providerChanges.forEach(change => {
      // Find bootstrapApplication or similar provider arrays
      const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
      
      callExpressions.forEach(callExpr => {
        if (callExpr.getExpression().getText() === 'bootstrapApplication') {
          // Merge providers in bootstrapApplication
          const args = callExpr.getArguments();
          if (args.length > 1) {
            // Second argument contains providers
            this.mergeProviderArray(args[1], change.providers, options);
          }
        }
      });
    });
  }

  /**
   * Merge control flow syntax in templates
   */
  private mergeControlFlow(template: string, controlFlowChanges: any, options: MergeOptions): { template: string, conflicts: MergeConflict[] } {
    let mergedTemplate = template;
    const conflicts: MergeConflict[] = [];

    // Only migrate simple cases if user prefers to keep their code
    if (options.preserveUserCode) {
      // Check for complex *ngIf expressions that should be preserved
      const complexNgIfPattern = /\*ngIf="[^"]*(\|\||&&|\?)[^"]*"/g;
      const complexMatches = template.match(complexNgIfPattern);
      
      if (complexMatches) {
        // Create conflicts for complex expressions
        complexMatches.forEach(match => {
          conflicts.push({
            file: 'template',
            type: 'template',
            section: 'control-flow',
            userValue: match,
            migrationValue: this.convertToNewControlFlow(match),
            resolution: 'user' // Preserve complex user logic
          });
        });
      }

      // Only migrate simple cases
      const simpleNgIfPattern = /\*ngIf="([a-zA-Z_$][a-zA-Z0-9_$]*)"/g;
      mergedTemplate = mergedTemplate.replace(simpleNgIfPattern, '@if ($1) {');
    }

    return { template: mergedTemplate, conflicts };
  }

  /**
   * Merge directive changes in templates
   */
  private mergeDirectives(template: string, directiveChanges: any, options: MergeOptions): { template: string, conflicts: MergeConflict[] } {
    let mergedTemplate = template;
    const conflicts: MergeConflict[] = [];

    // Apply directive changes while preserving user customizations
    directiveChanges.forEach((change: any) => {
      if (options.preserveUserCode && this.hasCustomDirectiveUsage(template, change.directive)) {
        conflicts.push({
          file: 'template',
          type: 'template',
          section: change.directive,
          userValue: this.extractDirectiveUsage(template, change.directive),
          migrationValue: change.newUsage,
          resolution: 'user'
        });
      } else {
        mergedTemplate = mergedTemplate.replace(change.pattern, change.replacement);
      }
    });

    return { template: mergedTemplate, conflicts };
  }

  // Helper methods
  private async createBackup(filePath: string): Promise<string> {
    const backupPath = `${filePath}.backup-${Date.now()}`;
    await fs.copy(filePath, backupPath);
    return backupPath;
  }

  private isCriticalAngularDependency(packageName: string): boolean {
    return packageName.startsWith('@angular/') || 
           packageName === 'typescript' || 
           packageName === 'zone.js';
  }

  private isCriticalScript(scriptName: string): boolean {
    return ['build', 'test', 'lint', 'start'].includes(scriptName);
  }

  private isStrictOption(option: string): boolean {
    return option.includes('strict') || option === 'noImplicitAny' || option === 'noImplicitReturns';
  }

  private parseDecoratorArgument(argText: string): any {
    try {
      return JSON.parse(argText);
    } catch {
      return {};
    }
  }

  private mergeProviderArray(providerArg: Node, newProviders: string[], options: MergeOptions): void {
    // Implementation for merging provider arrays
    // This would involve AST manipulation to add new providers while preserving existing ones
  }

  private convertToNewControlFlow(oldSyntax: string): string {
    // Convert *ngIf="complex expression" to @if (complex expression) { }
    const match = oldSyntax.match(/\*ngIf="([^"]+)"/);
    return match ? `@if (${match[1]}) { }` : oldSyntax;
  }

  private hasCustomDirectiveUsage(template: string, directive: string): boolean {
    // Check if directive has custom attributes or complex usage
    const pattern = new RegExp(`${directive}[^>]*\\[[^\\]]+\\]`, 'g');
    return pattern.test(template);
  }

  private extractDirectiveUsage(template: string, directive: string): string {
    const pattern = new RegExp(`<[^>]*${directive}[^>]*>`, 'g');
    const matches = template.match(pattern);
    return matches ? matches[0] : '';
  }

  private getDefaultOptions(): MergeOptions {
    return {
      preserveUserCode: true,
      preserveComments: true,
      preferUserConfiguration: true,
      createBackups: true,
      mergeStrategy: 'conservative',
      conflictResolution: 'user'
    };
  }
}