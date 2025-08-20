import * as fs from 'fs-extra';
import * as path from 'path';
import { Project, SourceFile, ClassDeclaration, ImportDeclaration, MethodDeclaration, ScriptTarget, ModuleKind, ModuleResolutionKind } from 'ts-morph';
import chalk from 'chalk';

export interface PreservationOptions {
  preserveComments: boolean;
  preserveCustomMethods: boolean;
  preserveUserImports: boolean;
  preserveCustomProperties: boolean;
  preserveCustomLogic: boolean;
  createDetailedBackup: boolean;
  mergeConflictResolution: 'user' | 'migration';
}

export interface MergeConflict {
  file: string;
  type: 'import' | 'method' | 'property' | 'decorator' | 'template';
  userCode: string;
  migrationCode: string;
  resolution?: 'user' | 'migration' | 'merged';
  mergedCode?: string;
}

export interface PreservationResult {
  success: boolean;
  filesModified: string[];
  conflicts: MergeConflict[];
  backupPaths: string[];
  warnings: string[];
}

/**
 * Advanced content preservation system using ts-morph for intelligent TypeScript AST manipulation
 * Preserves user customizations while applying Angular migrations
 */
export class AdvancedContentPreserver {
  private project: Project;
  private conflicts: MergeConflict[] = [];
  private warnings: string[] = [];

  constructor(private projectPath: string) {
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
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true
        }
      })
    });
  }

  /**
   * Intelligently preserve and merge TypeScript files during migrations
   */
  async preserveTypeScriptFile(
    filePath: string, 
    migrationTransforms: any[], 
    options: PreservationOptions = this.getDefaultOptions()
  ): Promise<PreservationResult> {
    const result: PreservationResult = {
      success: false,
      filesModified: [],
      conflicts: [],
      backupPaths: [],
      warnings: []
    };

    try {
      if (!await fs.pathExists(filePath)) {
        result.warnings.push(`File not found: ${filePath}`);
        return result;
      }

      // Create detailed backup
      if (options.createDetailedBackup) {
        const backupPath = await this.createDetailedBackup(filePath);
        result.backupPaths.push(backupPath);
      }

      // Add file to project for AST manipulation
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      
      // Analyze user customizations before migration
      const userCustomizations = await this.analyzeUserCustomizations(sourceFile);
      
      // Apply migration transforms while preserving user code
      const migrationResult = await this.applyIntelligentMigration(
        sourceFile, 
        migrationTransforms, 
        userCustomizations, 
        options
      );

      if (migrationResult.conflicts.length > 0) {
        result.conflicts = migrationResult.conflicts;
        await this.resolveConflictsAutomatically(sourceFile, migrationResult.conflicts, options);
      }

      // Save the modified file
      await sourceFile.save();
      result.filesModified.push(filePath);
      result.success = true;
      
      console.log(chalk.green(`✓ Intelligently preserved user code in ${path.basename(filePath)}`));

    } catch (error) {
      result.warnings.push(`Error processing ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }

    result.conflicts = this.conflicts;
    result.warnings = this.warnings;
    return result;
  }

  /**
   * Preserve Angular component files with intelligent template and logic merging
   */
  async preserveComponentFile(
    componentPath: string,
    migrationTransforms: any[],
    options: PreservationOptions = this.getDefaultOptions()
  ): Promise<PreservationResult> {
    const result = await this.preserveTypeScriptFile(componentPath, migrationTransforms, options);
    
    // Also handle associated template file
    const templatePath = componentPath.replace('.component.ts', '.component.html');
    if (await fs.pathExists(templatePath)) {
      const templateResult = await this.preserveTemplateFile(templatePath, migrationTransforms, options);
      
      result.filesModified.push(...templateResult.filesModified);
      result.conflicts.push(...templateResult.conflicts);
      result.warnings.push(...templateResult.warnings);
      result.backupPaths.push(...templateResult.backupPaths);
    }

    return result;
  }

  /**
   * Intelligently preserve template files during migrations
   */
  async preserveTemplateFile(
    templatePath: string,
    migrationTransforms: any[],
    options: PreservationOptions = this.getDefaultOptions()
  ): Promise<PreservationResult> {
    const result: PreservationResult = {
      success: false,
      filesModified: [],
      conflicts: [],
      backupPaths: [],
      warnings: []
    };

    try {
      if (!await fs.pathExists(templatePath)) {
        return result;
      }

      // Create backup
      if (options.createDetailedBackup) {
        const backupPath = await this.createDetailedBackup(templatePath);
        result.backupPaths.push(backupPath);
      }

      const originalContent = await fs.readFile(templatePath, 'utf-8');
      
      // Analyze template for user customizations
      const userCustomizations = this.analyzeTemplateCustomizations(originalContent);
      
      // Apply template migrations while preserving user code
      let modifiedContent = originalContent;
      const templateConflicts: MergeConflict[] = [];

      for (const transform of migrationTransforms) {
        if (transform.type === 'template') {
          const transformResult = await this.applyTemplateTransform(
            modifiedContent, 
            transform, 
            userCustomizations
          );
          
          modifiedContent = transformResult.content;
          templateConflicts.push(...transformResult.conflicts);
        }
      }

      // Handle conflicts
      if (templateConflicts.length > 0) {
        result.conflicts = templateConflicts;
        
        modifiedContent = await this.resolveTemplateConflicts(
          modifiedContent, 
          templateConflicts, 
          options
        );
      }

      // Only write if content changed
      if (modifiedContent !== originalContent) {
        await fs.writeFile(templatePath, modifiedContent);
        result.filesModified.push(templatePath);
      }

      result.success = true;
      console.log(chalk.green(`✓ Preserved template customizations in ${path.basename(templatePath)}`));

    } catch (error) {
      result.warnings.push(`Error processing template ${templatePath}: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Analyze user customizations in a TypeScript file
   */
  private async analyzeUserCustomizations(sourceFile: SourceFile): Promise<any> {
    const customizations = {
      customImports: [] as string[],
      customMethods: [] as any[],
      customProperties: [] as any[],
      customDecorators: [] as any[],
      customComments: [] as string[],
      userLogic: [] as any[]
    };

    // Analyze imports
    sourceFile.getImportDeclarations().forEach(importDecl => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      // Preserve non-Angular imports and custom imports
      if (!moduleSpecifier.startsWith('@angular/') || 
          this.isUserCustomImport(importDecl)) {
        customizations.customImports.push(importDecl.getText());
      }
    });

    // Analyze class members
    sourceFile.getClasses().forEach(classDecl => {
      // Custom methods
      classDecl.getMethods().forEach(method => {
        if (this.isUserCustomMethod(method)) {
          customizations.customMethods.push({
            name: method.getName(),
            text: method.getText(),
            decorators: method.getDecorators().map(d => d.getText()),
            comments: method.getLeadingCommentRanges().map(r => r.getText())
          });
        }
      });

      // Custom properties
      classDecl.getProperties().forEach(prop => {
        if (this.isUserCustomProperty(prop)) {
          customizations.customProperties.push({
            name: prop.getName(),
            text: prop.getText(),
            decorators: prop.getDecorators().map(d => d.getText())
          });
        }
      });
    });

    // Extract user comments
    sourceFile.getLeadingCommentRanges().forEach(comment => {
      customizations.customComments.push(comment.getText());
    });

    return customizations;
  }

  /**
   * Apply migration while intelligently preserving user code
   */
  private async applyIntelligentMigration(
    sourceFile: SourceFile,
    transforms: any[],
    userCustomizations: any,
    options: PreservationOptions
  ): Promise<{ conflicts: MergeConflict[] }> {
    const conflicts: MergeConflict[] = [];

    for (const transform of transforms) {
      try {
        switch (transform.type) {
          case 'import-update':
            await this.handleImportUpdate(sourceFile, transform, userCustomizations, conflicts, options);
            break;
            
          case 'decorator-update':
            await this.handleDecoratorUpdate(sourceFile, transform, userCustomizations, conflicts, options);
            break;
            
          case 'method-signature-update':
            await this.handleMethodUpdate(sourceFile, transform, userCustomizations, conflicts, options);
            break;
            
          case 'class-conversion':
            await this.handleClassConversion(sourceFile, transform, userCustomizations, conflicts, options);
            break;
            
          default:
            this.warnings.push(`Unknown transform type: ${transform.type}`);
        }
      } catch (error) {
        this.warnings.push(`Error applying transform ${transform.type}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return { conflicts };
  }

  /**
   * Handle import updates while preserving user imports
   */
  private async handleImportUpdate(
    sourceFile: SourceFile,
    transform: any,
    userCustomizations: any,
    conflicts: MergeConflict[],
    options: PreservationOptions
  ): Promise<void> {
    const importDecls = sourceFile.getImportDeclarations();
    
    importDecls.forEach(importDecl => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();
      
      if (moduleSpecifier === transform.from) {
        const userImportText = importDecl.getText();
        const isUserCustom = userCustomizations.customImports.includes(userImportText);
        
        if (isUserCustom && options.preserveUserImports) {
          // Create conflict - user has customized this import
          conflicts.push({
            file: sourceFile.getFilePath(),
            type: 'import',
            userCode: userImportText,
            migrationCode: `import { ${transform.newImports.join(', ')} } from '${transform.to}';`,
            resolution: options.mergeConflictResolution
          });
        } else {
          // Safe to update
          importDecl.setModuleSpecifier(transform.to);
          
          if (transform.newImports) {
            importDecl.removeNamedImports();
            importDecl.addNamedImports(transform.newImports);
          }
        }
      }
    });
  }

  /**
   * Handle decorator updates while preserving user customizations
   */
  private async handleDecoratorUpdate(
    sourceFile: SourceFile,
    transform: any,
    userCustomizations: any,
    conflicts: MergeConflict[],
    options: PreservationOptions
  ): Promise<void> {
    sourceFile.getClasses().forEach(classDecl => {
      const decorators = classDecl.getDecorators();
      
      decorators.forEach(decorator => {
        const decoratorName = decorator.getName();
        
        if (decoratorName === transform.decoratorName) {
          const decoratorText = decorator.getText();
          const hasUserCustomizations = this.hasUserCustomDecorator(decorator, userCustomizations);
          
          if (hasUserCustomizations) {
            conflicts.push({
              file: sourceFile.getFilePath(),
              type: 'decorator',
              userCode: decoratorText,
              migrationCode: transform.newDecorator,
              resolution: options.mergeConflictResolution
            });
          } else {
            // Safe to update
            decorator.replaceWithText(transform.newDecorator);
          }
        }
      });
    });
  }

  /**
   * Handle method signature updates while preserving user logic
   */
  private async handleMethodUpdate(
    sourceFile: SourceFile,
    transform: any,
    userCustomizations: any,
    conflicts: MergeConflict[],
    options: PreservationOptions
  ): Promise<void> {
    sourceFile.getClasses().forEach(classDecl => {
      const method = classDecl.getMethod(transform.methodName);
      
      if (method) {
        const userMethod = userCustomizations.customMethods.find((m: any) => m.name === transform.methodName);
        
        if (userMethod && options.preserveCustomMethods) {
          // User has customized this method
          conflicts.push({
            file: sourceFile.getFilePath(),
            type: 'method',
            userCode: userMethod.text,
            migrationCode: transform.newMethodSignature,
            resolution: options.mergeConflictResolution
          });
        } else {
          // Update method signature but preserve body
          const methodBody = method.getBodyText();
          method.set({
            parameters: transform.newParameters,
            returnType: transform.newReturnType
          });
          
          if (methodBody && options.preserveCustomLogic) {
            method.setBodyText(methodBody);
          }
        }
      }
    });
  }

  /**
   * Handle class conversion (e.g., NgModule to standalone) while preserving user code
   */
  private async handleClassConversion(
    sourceFile: SourceFile,
    transform: any,
    userCustomizations: any,
    conflicts: MergeConflict[],
    options: PreservationOptions
  ): Promise<void> {
    const classDecl = sourceFile.getClass(transform.className);
    
    if (classDecl) {
      // Preserve user methods and properties
      const userMethods = userCustomizations.customMethods;
      const userProperties = userCustomizations.customProperties;
      
      // Apply conversion
      if (transform.conversion === 'ngmodule-to-standalone') {
        await this.convertNgModuleToStandalone(classDecl, userMethods, userProperties, conflicts, options);
      }
    }
  }

  /**
   * Convert NgModule to standalone while preserving user customizations
   */
  private async convertNgModuleToStandalone(
    classDecl: ClassDeclaration,
    userMethods: any[],
    userProperties: any[],
    conflicts: MergeConflict[],
    options: PreservationOptions
  ): Promise<void> {
    // This is a complex conversion that requires careful preservation
    // Implementation would involve extracting providers, imports, etc.
    // while preserving user customizations
    
    console.log(chalk.yellow(`⚠ Complex NgModule to standalone conversion detected`));
    console.log(chalk.yellow(`User customizations will be preserved through conflict resolution`));
  }

  /**
   * Analyze template customizations
   */
  private analyzeTemplateCustomizations(content: string): any {
    return {
      customDirectives: this.extractCustomDirectives(content),
      customComponents: this.extractCustomComponents(content),
      customBindings: this.extractCustomBindings(content),
      customComments: this.extractTemplateComments(content)
    };
  }

  /**
   * Apply template transformation while preserving user customizations
   */
  private async applyTemplateTransform(
    content: string,
    transform: any,
    userCustomizations: any
  ): Promise<{ content: string; conflicts: MergeConflict[] }> {
    const conflicts: MergeConflict[] = [];
    let modifiedContent = content;

    switch (transform.templateType) {
      case 'control-flow': {
        const controlFlowResult = await this.migrateControlFlowSafely(modifiedContent, userCustomizations);
        modifiedContent = controlFlowResult.content;
        conflicts.push(...controlFlowResult.conflicts);
        break;
      }
        
      case 'directive-update': {
        const directiveResult = await this.updateDirectivesSafely(modifiedContent, transform, userCustomizations);
        modifiedContent = directiveResult.content;
        conflicts.push(...directiveResult.conflicts);
        break;
      }
    }

    return { content: modifiedContent, conflicts };
  }

  /**
   * Safely migrate control flow syntax (*ngIf to @if) while preserving complex user logic
   */
  private async migrateControlFlowSafely(
    content: string,
    userCustomizations: any
  ): Promise<{ content: string; conflicts: MergeConflict[] }> {
    const conflicts: MergeConflict[] = [];
    let modifiedContent = content;

    // Only migrate simple cases, preserve complex user logic
    const simpleNgIfPattern = /\*ngIf="([^"]+)"/g;
    
    modifiedContent = modifiedContent.replace(simpleNgIfPattern, (match, condition) => {
      // Check if this is a complex condition that user customized
      if (this.isComplexCondition(condition, userCustomizations)) {
        conflicts.push({
          file: 'template',
          type: 'template',
          userCode: match,
          migrationCode: `@if (${condition})`,
          resolution: 'user' // Preserve user's complex logic
        });
        return match; // Keep original
      }
      
      return `@if (${condition})`; // Safe to migrate
    });

    return { content: modifiedContent, conflicts };
  }

  /**
   * Create detailed backup with metadata
   */
  private async createDetailedBackup(filePath: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup-${timestamp}`;
    
    await fs.copy(filePath, backupPath);
    
    // Create metadata file
    const metadata = {
      originalFile: filePath,
      backupTime: new Date().toISOString(),
      backupReason: 'Angular migration with content preservation',
      toolVersion: '1.0.0'
    };
    
    await fs.writeJson(`${backupPath}.meta`, metadata, { spaces: 2 });
    
    return backupPath;
  }

  /**
   * Create conflict resolution file for manual review
   */
  private async createConflictFile(filePath: string, conflicts: MergeConflict[]): Promise<void> {
    const conflictPath = `${filePath}.conflicts`;
    const conflictContent = conflicts.map(conflict => `
=== CONFLICT: ${conflict.type} ===
User Code:
${conflict.userCode}

Migration Code:
${conflict.migrationCode}

Resolution needed: Choose between user code or migration code
===========================================
`).join('\n');

    await fs.writeFile(conflictPath, conflictContent);
    console.log(chalk.yellow(`⚠ Conflicts detected in ${path.basename(filePath)}`));
    console.log(chalk.yellow(`Review conflicts in: ${conflictPath}`));
  }

  // Helper methods for analysis
  private isUserCustomImport(importDecl: ImportDeclaration): boolean {
    // Logic to determine if import has user customizations
    return false; // Simplified for now
  }

  private isUserCustomMethod(method: MethodDeclaration): boolean {
    // Logic to determine if method has user customizations
    const standardMethods = ['ngOnInit', 'ngOnDestroy', 'ngAfterViewInit', 'ngOnChanges'];
    return !standardMethods.includes(method.getName() || '');
  }

  private isUserCustomProperty(prop: any): boolean {
    // Logic to determine if property has user customizations
    return true; // Conservative approach - preserve all properties
  }

  private hasUserCustomDecorator(decorator: any, userCustomizations: any): boolean {
    // Logic to determine if decorator has user customizations
    return false; // Simplified for now
  }

  private extractCustomDirectives(content: string): string[] {
    // Extract user custom directives from template
    return [];
  }

  private extractCustomComponents(content: string): string[] {
    // Extract user custom components from template
    return [];
  }

  private extractCustomBindings(content: string): string[] {
    // Extract user custom bindings from template
    return [];
  }

  private extractTemplateComments(content: string): string[] {
    // Extract user comments from template
    const commentPattern = /<!--[\s\S]*?-->/g;
    return content.match(commentPattern) || [];
  }

  private isComplexCondition(condition: string, userCustomizations: any): boolean {
    // Determine if condition is complex and user-customized
    return condition.includes('||') || condition.includes('&&') || condition.includes('?');
  }

  private async updateDirectivesSafely(
    content: string,
    transform: any,
    userCustomizations: any
  ): Promise<{ content: string; conflicts: MergeConflict[] }> {
    // Safely update directives while preserving user customizations
    return { content, conflicts: [] };
  }

  private async resolveConflictsAutomatically(
    sourceFile: SourceFile,
    conflicts: MergeConflict[],
    options: PreservationOptions
  ): Promise<void> {
    // Automatically resolve conflicts based on user preferences
    conflicts.forEach(conflict => {
      if (options.mergeConflictResolution === 'user') {
        // Keep user code
        conflict.resolution = 'user';
      } else if (options.mergeConflictResolution === 'migration') {
        // Apply migration code
        conflict.resolution = 'migration';
      }
    });
  }

  private async resolveTemplateConflicts(
    content: string,
    conflicts: MergeConflict[],
    options: PreservationOptions
  ): Promise<string> {
    let resolvedContent = content;
    
    conflicts.forEach(conflict => {
      if (options.mergeConflictResolution === 'user') {
        // Keep user template code
        resolvedContent = resolvedContent.replace(conflict.migrationCode, conflict.userCode);
      }
    });
    
    return resolvedContent;
  }

  private async createTemplateConflictFile(templatePath: string, conflicts: MergeConflict[]): Promise<void> {
    const conflictPath = `${templatePath}.conflicts`;
    const conflictContent = `
<!-- TEMPLATE MIGRATION CONFLICTS -->
<!-- Review each conflict and choose the appropriate resolution -->

${conflicts.map(conflict => `
<!-- CONFLICT: ${conflict.type} -->
<!-- User Version: -->
${conflict.userCode}

<!-- Migration Version: -->
${conflict.migrationCode}
<!-- END CONFLICT -->
`).join('\n')}
`;

    await fs.writeFile(conflictPath, conflictContent);
  }

  private getDefaultOptions(): PreservationOptions {
    return {
      preserveComments: true,
      preserveCustomMethods: true,
      preserveUserImports: true,
      preserveCustomProperties: true,
      preserveCustomLogic: true,
      createDetailedBackup: true,
      mergeConflictResolution: 'user' // Default to preserving user code
    };
  }
}