import * as fs from 'fs-extra';
import * as path from 'path';
import * as ts from 'typescript';

export class FileContentPreserver {
  /**
   * Update main.ts file while preserving custom code
   */
  static async updateMainTsFile(filePath: string, targetAngularVersion: number): Promise<void> {
    if (!await fs.pathExists(filePath)) {
      return;
    }

    const content = await fs.readFile(filePath, 'utf-8');
    
    // Parse the file to understand its structure
    const sourceFile = ts.createSourceFile(
      'main.ts',
      content,
      ts.ScriptTarget.Latest,
      true
    );

    // Check if already using new bootstrap (Angular 14+)
    if (targetAngularVersion >= 14 && content.includes('bootstrapApplication')) {
      return; // Already migrated
    }

    // Check if using old bootstrap
    if (targetAngularVersion >= 14 && content.includes('platformBrowserDynamic')) {
      // Preserve custom providers and configurations
      const customProviders = this.extractCustomProviders(sourceFile);
      const customImports = this.extractCustomImports(sourceFile);
      const appModulePath = this.extractAppModulePath(sourceFile);

      // Generate new bootstrap code preserving custom elements
      const newContent = this.generateUpdatedBootstrap(
        customImports,
        customProviders,
        appModulePath,
        targetAngularVersion
      );

      // Backup original file
      await fs.copy(filePath, `${filePath}.backup`);
      
      // Write updated content
      await fs.writeFile(filePath, newContent);
    }
  }

  /**
   * Update component files preserving custom logic
   */
  static async updateComponentFile(filePath: string, transformations: any[]): Promise<void> {
    if (!await fs.pathExists(filePath)) {
      return;
    }

    let content = await fs.readFile(filePath, 'utf-8');
    const originalContent = content;

    // Apply transformations while preserving structure
    for (const transform of transformations) {
      content = await this.applyTransformation(content, transform);
    }

    // Only write if content changed
    if (content !== originalContent) {
      await fs.copy(filePath, `${filePath}.backup`);
      await fs.writeFile(filePath, content);
    }
  }

  /**
   * Update template files preserving custom HTML
   */
  static async updateTemplateFile(filePath: string, targetAngularVersion: number): Promise<void> {
    if (!await fs.pathExists(filePath)) {
      return;
    }

    let content = await fs.readFile(filePath, 'utf-8');
    const originalContent = content;

    // Angular 17+ control flow migration (optional, preserve old syntax by default)
    if (targetAngularVersion >= 17) {
      // Only update if explicitly requested, otherwise preserve existing syntax
      // This ensures backward compatibility
      if (process.env.MIGRATE_CONTROL_FLOW === 'true') {
        content = this.migrateControlFlowSyntax(content);
      }
    }

    // Only write if content changed
    if (content !== originalContent) {
      await fs.copy(filePath, `${filePath}.backup`);
      await fs.writeFile(filePath, content);
    }
  }

  /**
   * Extract custom providers from the source file
   */
  private static extractCustomProviders(sourceFile: ts.SourceFile): string[] {
    const providers: string[] = [];
    
    // Visit all nodes to find provider configurations
    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const expression = node.expression;
        if (ts.isPropertyAccessExpression(expression)) {
          if (expression.name.text === 'bootstrapModule') {
            // Look for second argument (options with providers)
            if (node.arguments.length > 1) {
              const options = node.arguments[1];
              // Extract provider configuration
              providers.push(options.getText());
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    
    visit(sourceFile);
    return providers;
  }

  /**
   * Extract custom imports
   */
  private static extractCustomImports(sourceFile: ts.SourceFile): string[] {
    const imports: string[] = [];
    
    sourceFile.statements.forEach(statement => {
      if (ts.isImportDeclaration(statement)) {
        const importText = statement.getText();
        // Skip Angular platform imports that will be replaced
        if (!importText.includes('@angular/platform-browser-dynamic') &&
            !importText.includes('./app/app.module')) {
          imports.push(importText);
        }
      }
    });
    
    return imports;
  }

  /**
   * Extract app module path
   */
  private static extractAppModulePath(sourceFile: ts.SourceFile): string {
    let appModulePath = './app/app.module';
    
    sourceFile.statements.forEach(statement => {
      if (ts.isImportDeclaration(statement)) {
        const importText = statement.getText();
        if (importText.includes('AppModule')) {
          const moduleSpecifier = statement.moduleSpecifier;
          if (ts.isStringLiteral(moduleSpecifier)) {
            appModulePath = moduleSpecifier.text;
          }
        }
      }
    });
    
    return appModulePath;
  }

  /**
   * Generate updated bootstrap code
   */
  private static generateUpdatedBootstrap(
    customImports: string[],
    customProviders: string[],
    appModulePath: string,
    targetVersion: number
  ): string {
    if (targetVersion >= 14) {
      // Generate standalone bootstrap
      return `import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppModule } from '${appModulePath}';
import { AppComponent } from './app/app.component';
${customImports.join('\n')}

// Preserved custom configuration
const customProviders = ${customProviders.length > 0 ? customProviders[0] : '{}'};

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppModule),
    // Custom providers preserved from original configuration
    ...(customProviders.providers || [])
  ]
}).catch(err => console.error(err));
`;
    }
    
    // For older versions, preserve existing structure
    return '';
  }

  /**
   * Apply a specific transformation to content
   */
  private static async applyTransformation(content: string, transform: any): Promise<string> {
    // Apply transformation based on type
    switch (transform.type) {
      case 'replace':
        return content.replace(transform.pattern, transform.replacement);
      
      case 'insert':
        return this.insertAtPosition(content, transform.position, transform.text);
      
      case 'update-import':
        return this.updateImport(content, transform.oldImport, transform.newImport);
      
      default:
        return content;
    }
  }

  /**
   * Insert text at specific position
   */
  private static insertAtPosition(content: string, position: string, text: string): string {
    switch (position) {
      case 'after-imports': {
        const importEndIndex = this.findLastImportIndex(content);
        return content.slice(0, importEndIndex) + '\n' + text + content.slice(importEndIndex);
      }
      
      case 'before-class': {
        const classIndex = content.indexOf('export class');
        return content.slice(0, classIndex) + text + '\n' + content.slice(classIndex);
      }
      
      default:
        return content;
    }
  }

  /**
   * Find the index after the last import statement
   */
  private static findLastImportIndex(content: string): number {
    const lines = content.split('\n');
    let lastImportIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    // Calculate character index
    let charIndex = 0;
    for (let i = 0; i <= lastImportIndex; i++) {
      charIndex += lines[i].length + 1; // +1 for newline
    }
    
    return charIndex;
  }

  /**
   * Update import statement
   */
  private static updateImport(content: string, oldImport: string, newImport: any): string {
    const regex = new RegExp(`import.*from\\s*['"]${oldImport}['"];?`, 'g');
    if (typeof newImport === 'string') {
      return content.replace(regex, newImport);
    }
    return content.replace(regex, `import { ${newImport.items} } from '${newImport.module}';`);
  }

  /**
   * Migrate control flow syntax (Angular 17+)
   */
  private static migrateControlFlowSyntax(content: string): string {
    // This is a simplified migration - in production, use Angular's migration tools
    // Preserve original by default, only migrate if safe
    
    // Simple *ngIf to @if migration (only for simple cases)
    content = content.replace(
      /<(\w+)\s+\*ngIf="([^"]+)"\s*>/g,
      '@if ($2) {\n  <$1>'
    );
    
    // Close the @if block
    content = content.replace(
      /<\/(\w+)>(\s*)<!--\s*end\s*ngIf\s*-->/g,
      '</$1>\n}'
    );
    
    return content;
  }
}