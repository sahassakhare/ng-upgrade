import { TransformationHandler } from '../core/VersionHandlerRegistry';
import { BreakingChange } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';

export class CodeTransformer implements TransformationHandler {
  readonly type = 'code';

  async apply(projectPath: string, change: BreakingChange): Promise<void> {
    console.log(`Applying transformation for: ${change.description}`);

    switch (change.type) {
      case 'api':
        await this.applyApiTransformation(projectPath, change);
        break;
      case 'template':
        await this.applyTemplateTransformation(projectPath, change);
        break;
      case 'config':
        await this.applyConfigTransformation(projectPath, change);
        break;
      case 'style':
        await this.applyStyleTransformation(projectPath, change);
        break;
      case 'build':
        await this.applyBuildTransformation(projectPath, change);
        break;
      case 'dependency':
        await this.applyDependencyTransformation(projectPath, change);
        break;
      default:
        console.warn(`Unknown transformation type: ${change.type}`);
    }
  }

  private async applyApiTransformation(projectPath: string, change: BreakingChange): Promise<void> {
    // Apply API-related transformations
    if (change.migration.transform) {
      await this.applyCodeTransformation(projectPath, change.migration.transform);
    }
  }

  private async applyTemplateTransformation(projectPath: string, change: BreakingChange): Promise<void> {
    // Apply template-related transformations
    const templateFiles = await this.findFiles(projectPath, '**/*.html');
    
    for (const file of templateFiles) {
      if (change.migration.transform) {
        await this.transformFile(file, change.migration.transform);
      }
    }
  }

  private async applyConfigTransformation(projectPath: string, change: BreakingChange): Promise<void> {
    // Apply configuration transformations
    const configFiles = ['angular.json', 'tsconfig.json', 'package.json'];
    
    for (const configFile of configFiles) {
      const filePath = path.join(projectPath, configFile);
      if (await fs.pathExists(filePath) && change.migration.transform) {
        await this.transformFile(filePath, change.migration.transform);
      }
    }
  }

  private async applyStyleTransformation(projectPath: string, change: BreakingChange): Promise<void> {
    // Apply style-related transformations
    const styleFiles = await this.findFiles(projectPath, '**/*.{css,scss,sass,less}');
    
    for (const file of styleFiles) {
      if (change.migration.transform) {
        await this.transformFile(file, change.migration.transform);
      }
    }
  }

  private async applyBuildTransformation(projectPath: string, change: BreakingChange): Promise<void> {
    // Apply build-related transformations
    const buildFiles = ['angular.json', 'webpack.config.js', 'tsconfig.json'];
    
    for (const buildFile of buildFiles) {
      const filePath = path.join(projectPath, buildFile);
      if (await fs.pathExists(filePath) && change.migration.transform) {
        await this.transformFile(filePath, change.migration.transform);
      }
    }
  }

  private async applyDependencyTransformation(projectPath: string, change: BreakingChange): Promise<void> {
    // Apply dependency-related transformations
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath) && change.migration.transform) {
      await this.transformFile(packageJsonPath, change.migration.transform);
    }
  }

  private async applyCodeTransformation(projectPath: string, transform: any): Promise<void> {
    switch (transform.type) {
      case 'regex':
        await this.applyRegexTransformation(projectPath, transform);
        break;
      case 'ast':
        await this.applyAstTransformation(projectPath, transform);
        break;
      case 'file':
        await this.applyFileTransformation(projectPath, transform);
        break;
      default:
        console.warn(`Unknown transformation type: ${transform.type}`);
    }
  }

  private async applyRegexTransformation(projectPath: string, transform: any): Promise<void> {
    const files = transform.filePaths || await this.findFiles(projectPath, '**/*.ts');
    
    for (const file of files) {
      await this.transformFile(file, transform);
    }
  }

  private async applyAstTransformation(projectPath: string, transform: any): Promise<void> {
    // AST-based transformations would be implemented here
    // For now, this is a placeholder
    console.log('AST transformation not yet implemented');
  }

  private async applyFileTransformation(projectPath: string, transform: any): Promise<void> {
    // File-level transformations
    if (transform.filePaths) {
      for (const filePath of transform.filePaths) {
        const fullPath = path.join(projectPath, filePath);
        if (await fs.pathExists(fullPath)) {
          await this.transformFile(fullPath, transform);
        }
      }
    }
  }

  private async transformFile(filePath: string, transform: any): Promise<void> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      if (transform.pattern && transform.replacement) {
        const pattern = typeof transform.pattern === 'string' 
          ? new RegExp(transform.pattern, 'g')
          : transform.pattern;
        
        const newContent = content.replace(pattern, transform.replacement);
        
        if (newContent !== content) {
          await fs.writeFile(filePath, newContent);
          console.log(`✓ Transformed: ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`Failed to transform file ${filePath}:`, error);
    }
  }

  private async findFiles(projectPath: string, pattern: string): Promise<string[]> {
    // Simple file finding - in production this would use glob
    const files: string[] = [];
    
    const findFilesRecursive = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !this.shouldSkipDirectory(entry.name)) {
          await findFilesRecursive(fullPath);
        } else if (entry.isFile() && this.matchesPattern(entry.name, pattern)) {
          files.push(fullPath);
        }
      }
    };
    
    await findFilesRecursive(projectPath);
    return files;
  }

  private shouldSkipDirectory(dirName: string): boolean {
    const skipDirs = ['node_modules', 'dist', '.angular', '.git', 'coverage'];
    return skipDirs.includes(dirName);
  }

  private matchesPattern(fileName: string, pattern: string): boolean {
    // Simple pattern matching - in production this would use proper glob matching
    if (pattern.includes('**/*.ts')) {
      return fileName.endsWith('.ts');
    }
    if (pattern.includes('**/*.html')) {
      return fileName.endsWith('.html');
    }
    if (pattern.includes('**/*.{css,scss,sass,less}')) {
      return /\.(css|scss|sass|less)$/.test(fileName);
    }
    return false;
  }
}