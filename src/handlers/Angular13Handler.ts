import * as fs from 'fs-extra';
import * as path from 'path';
import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate } from '../types';

/**
 * Angular 13 Handler - Complete View Engine removal and APF updates
 * 
 * Key Features in Angular 13:
 * - Complete View Engine removal - Ivy only
 * - Angular Package Format (APF) improvements
 * - Dynamic import support for lazy routes
 * - Node.js ES modules support
 * - Angular CLI modernization
 * - Webpack 5 full support
 * - IE11 deprecation warnings
 */
export class Angular13Handler extends BaseVersionHandler {
  readonly version = '13';

  protected getRequiredNodeVersion(): string {
    return '>=12.20.0';
  }

  protected getRequiredTypeScriptVersion(): string {
    return '>=4.4.2 <4.6.0';
  }

  /**
   * Get Angular 13 dependencies with correct versions
   */
  getDependencyUpdates(): DependencyUpdate[] {
    return [
      // Core Angular packages
      { name: '@angular/animations', version: '^13.0.0', type: 'dependencies' },
      { name: '@angular/common', version: '^13.0.0', type: 'dependencies' },
      { name: '@angular/compiler', version: '^13.0.0', type: 'dependencies' },
      { name: '@angular/core', version: '^13.0.0', type: 'dependencies' },
      { name: '@angular/forms', version: '^13.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser', version: '^13.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser-dynamic', version: '^13.0.0', type: 'dependencies' },
      { name: '@angular/router', version: '^13.0.0', type: 'dependencies' },
      
      // Angular CLI and dev dependencies
      { name: '@angular/cli', version: '^13.0.0', type: 'devDependencies' },
      { name: '@angular/compiler-cli', version: '^13.0.0', type: 'devDependencies' },
      { name: '@angular-devkit/build-angular', version: '^13.0.0', type: 'devDependencies' },
      
      // TypeScript and supporting packages
      { name: 'typescript', version: '~4.4.2', type: 'devDependencies' },
      { name: 'zone.js', version: '~0.11.4', type: 'dependencies' },
      { name: 'rxjs', version: '~7.4.0', type: 'dependencies' },
      
      // Angular Material (if present)
      { name: '@angular/material', version: '^13.0.0', type: 'dependencies' },
      { name: '@angular/cdk', version: '^13.0.0', type: 'dependencies' }
    ];
  }

  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 13 transformations...');
    
    // 1. Remove View Engine references and ensure Ivy compatibility
    await this.ensureIvyCompatibility(projectPath);
    
    // 2. Update Angular Package Format for libraries
    await this.updateAngularPackageFormat(projectPath);
    
    // 3. Migrate to dynamic imports for lazy routes
    await this.migrateToDynamicImports(projectPath);
    
    // 4. Update webpack configuration for v5 compatibility
    await this.updateWebpackConfiguration(projectPath);
    
    // 5. Handle Node.js ES modules support
    await this.configureESModulesSupport(projectPath);
    
    // 6. Update Angular CLI configuration
    await this.updateAngularCliConfiguration(projectPath);
    
    // 7. Remove IE11 polyfills and update browser support
    await this.removeIE11Support(projectPath);
    
    // 8. Update third-party library compatibility
    await this.validateThirdPartyCompatibility(projectPath);
    
    this.progressReporter?.success('✓ Angular 13 transformations completed');
  }

  getBreakingChanges(): BreakingChange[] {
    return [
      // View Engine removal - Critical
      this.createBreakingChange(
        'ng13-view-engine-removal',
        'build',
        'critical',
        'View Engine completely removed',
        'All applications must use Ivy renderer. View Engine is no longer supported.',
        'Ensure all dependencies are Ivy-compatible and remove View Engine configurations'
      ),
      
      // Angular Package Format updates
      this.createBreakingChange(
        'ng13-angular-package-format',
        'build',
        'high',
        'Angular Package Format v13 changes',
        'Libraries must use the new package format with updated metadata',
        'Update library build configurations and package.json exports'
      ),
      
      // TypeScript version requirement
      this.createBreakingChange(
        'ng13-typescript-version',
        'dependency',
        'medium',
        'TypeScript 4.4+ required',
        'Angular 13 requires TypeScript 4.4.2 or higher',
        'Update TypeScript to version 4.4.2 or higher'
      ),
      
      // IE11 deprecation
      this.createBreakingChange(
        'ng13-ie11-deprecation',
        'config',
        'medium',
        'IE11 support deprecated',
        'IE11 support is deprecated and will be removed in Angular 15',
        'Plan migration away from IE11 support and update browser compatibility'
      ),
      
      // Dynamic imports requirement
      this.createBreakingChange(
        'ng13-dynamic-imports',
        'api',
        'low',
        'Dynamic imports for lazy routes',
        'Lazy route loading now uses dynamic imports by default',
        'Update route configurations to use dynamic import syntax'
      ),
      
      // Webpack 5 compatibility
      this.createBreakingChange(
        'ng13-webpack5',
        'build',
        'low',
        'Webpack 5 full support',
        'Build system now fully supports Webpack 5 features',
        'Update custom webpack configurations for Webpack 5 compatibility'
      )
    ];
  }

  // Private implementation methods

  /**
   * Ensure Ivy compatibility and remove View Engine references
   */
  private async ensureIvyCompatibility(projectPath: string): Promise<void> {
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    
    if (await fs.pathExists(tsconfigPath)) {
      try {
        const tsconfig = await fs.readJson(tsconfigPath);
        
        // Remove View Engine configurations
        if (tsconfig.angularCompilerOptions) {
          delete tsconfig.angularCompilerOptions.enableIvy;
          delete tsconfig.angularCompilerOptions.disableTypeScriptVersionCheck;
          
          // Ensure Ivy-specific options are set
          tsconfig.angularCompilerOptions.enableI18nLegacyMessageIdFormat = false;
          tsconfig.angularCompilerOptions.strictInjectionParameters = true;
          tsconfig.angularCompilerOptions.strictInputAccessModifiers = true;
          tsconfig.angularCompilerOptions.strictTemplates = true;
        }
        
        await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
        this.progressReporter?.info('✓ Ensured Ivy compatibility in TypeScript configuration');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update TypeScript config: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Update Angular Package Format for libraries
   */
  private async updateAngularPackageFormat(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Update library projects for new APF
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.projectType === 'library') {
            // Update build configuration for APF v13
            if (project.architect?.build?.builder === '@angular-devkit/build-angular:ng-packagr') {
              project.architect.build.options = {
                ...project.architect.build.options,
                project: project.architect.build.options.project || 'ng-package.json'
              };
            }
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Updated Angular Package Format configuration');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update Angular Package Format: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Migrate to dynamic imports for lazy routes
   */
  private async migrateToDynamicImports(projectPath: string): Promise<void> {
    const routingFiles = await this.findRoutingFiles(projectPath);
    
    for (const file of routingFiles) {
      try {
        let content = await fs.readFile(file, 'utf-8');
        
        // Replace loadChildren string syntax with dynamic imports
        const loadChildrenRegex = /loadChildren:\s*['"`]([^'"`]+)#([^'"`]+)['"`]/g;
        content = content.replace(loadChildrenRegex, (match, modulePath, className) => {
          return `loadChildren: () => import('${modulePath}').then(m => m.${className})`;
        });
        
        // Update relative path imports
        content = content.replace(/loadChildren:\s*['"`]\.\/([^'"`]+)#([^'"`]+)['"`]/g, 
          `loadChildren: () => import('./$1').then(m => m.$2)`);
        
        await fs.writeFile(file, content);
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update routing file ${file}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    if (routingFiles.length > 0) {
      this.progressReporter?.info(`✓ Updated ${routingFiles.length} routing files to use dynamic imports`);
    }
  }

  /**
   * Update webpack configuration for v5 compatibility
   */
  private async updateWebpackConfiguration(projectPath: string): Promise<void> {
    const webpackConfigPath = path.join(projectPath, 'webpack.config.js');
    const customWebpackPath = path.join(projectPath, 'webpack.config.ts');
    
    const configPath = await fs.pathExists(webpackConfigPath) ? webpackConfigPath :
                      await fs.pathExists(customWebpackPath) ? customWebpackPath : null;
    
    if (configPath) {
      try {
        let content = await fs.readFile(configPath, 'utf-8');
        
        // Add Webpack 5 compatibility configurations
        if (!content.includes('resolve.fallback')) {
          const fallbackConfig = `
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util")
    }
  },`;
          
          content = content.replace(
            /module\.exports\s*=\s*{/,
            `module.exports = {${fallbackConfig}`
          );
        }
        
        await fs.writeFile(configPath, content);
        this.progressReporter?.info('✓ Updated webpack configuration for v5 compatibility');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update webpack config: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Configure ES modules support
   */
  private async configureESModulesSupport(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        
        // Add ES modules support configuration
        if (!packageJson.type) {
          // Don't force ES modules, but ensure compatibility
          packageJson.exports = packageJson.exports || {};
          
          // Add conditional exports for better ES modules support
          if (!packageJson.exports['.']) {
            packageJson.exports['.'] = {
              "import": "./dist/index.js",
              "require": "./dist/index.js"
            };
          }
        }
        
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        this.progressReporter?.info('✓ Configured ES modules support');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not configure ES modules: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Update Angular CLI configuration for v13
   */
  private async updateAngularCliConfiguration(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Update CLI workspace version
        angularJson.version = 1;
        
        // Update project configurations
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          // Update build configurations
          if (project.architect?.build) {
            // Enable build optimizer by default
            project.architect.build.options.buildOptimizer = true;
            
            // Update production configuration
            if (project.architect.build.configurations?.production) {
              project.architect.build.configurations.production.buildOptimizer = true;
            }
          }
          
          // Update test configuration
          if (project.architect?.test) {
            project.architect.test.options.codeCoverage = false;
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Updated Angular CLI configuration');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update Angular CLI config: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Remove IE11 support and update browser compatibility
   */
  private async removeIE11Support(projectPath: string): Promise<void> {
    const browserslistPath = path.join(projectPath, '.browserslistrc');
    
    if (await fs.pathExists(browserslistPath)) {
      try {
        let content = await fs.readFile(browserslistPath, 'utf-8');
        
        // Remove IE11 from supported browsers
        content = content.replace(/IE\s+\d+/gi, '');
        content = content.replace(/not IE \d+/gi, '');
        
        // Add modern browser support
        if (!content.includes('last 2 Chrome versions')) {
          content += '\nlast 2 Chrome versions\nlast 2 Firefox versions\nlast 2 Safari versions\nlast 2 Edge versions';
        }
        
        await fs.writeFile(browserslistPath, content);
        this.progressReporter?.info('✓ Updated browser support configuration (removed IE11)');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update browserslist: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Remove IE11 polyfills from polyfills.ts
    const polyfillsPath = path.join(projectPath, 'src/polyfills.ts');
    if (await fs.pathExists(polyfillsPath)) {
      try {
        let content = await fs.readFile(polyfillsPath, 'utf-8');
        
        // Comment out IE11 polyfills
        content = content.replace(/import 'classlist\.js';/g, '// import \'classlist.js\'; // IE11 support removed in Angular 13');
        content = content.replace(/import 'web-animations-js';/g, '// import \'web-animations-js\'; // IE11 support removed in Angular 13');
        
        await fs.writeFile(polyfillsPath, content);
        this.progressReporter?.info('✓ Removed IE11 polyfills');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update polyfills: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Validate third-party library compatibility
   */
  private async validateThirdPartyCompatibility(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        const incompatibleLibraries = [];
        const warnings = [];
        
        // Check for known incompatible libraries
        for (const [libName, version] of Object.entries(dependencies)) {
          if (typeof version === 'string') {
            // Check Angular Material compatibility
            if (libName === '@angular/material' && !version.includes('13')) {
              warnings.push(`${libName}@${version} should be updated to v13 for full compatibility`);
            }
            
            // Check for View Engine dependent libraries
            if (this.isViewEngineDependentLibrary(libName)) {
              incompatibleLibraries.push(`${libName}@${version} may not be compatible with Ivy-only Angular 13`);
            }
          }
        }
        
        if (warnings.length > 0) {
          this.progressReporter?.warn(`Library compatibility warnings: ${warnings.join(', ')}`);
        }
        
        if (incompatibleLibraries.length > 0) {
          this.progressReporter?.warn(`Potentially incompatible libraries detected: ${incompatibleLibraries.join(', ')}`);
        }
        
        this.progressReporter?.info('✓ Third-party library compatibility validation completed');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not validate third-party compatibility: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Find all routing files in the project
   */
  private async findRoutingFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          files.push(...await this.findRoutingFiles(fullPath));
        } else if (entry.name.endsWith('-routing.module.ts') || 
                   entry.name.endsWith('.routing.ts') ||
                   (entry.name.endsWith('.module.ts') && entry.name.includes('routing'))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist or be inaccessible
    }
    
    return files;
  }

  /**
   * Check if a library is known to be View Engine dependent
   */
  private isViewEngineDependentLibrary(libName: string): boolean {
    const viewEngineDependentLibraries = [
      '@angular/upgrade',
      'ngx-bootstrap',
      'ng-bootstrap'
    ];
    
    return viewEngineDependentLibraries.some(lib => libName.includes(lib));
  }
}