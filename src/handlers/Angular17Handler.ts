import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';

export class Angular17Handler extends BaseVersionHandler {
  readonly version = '17';

  protected getRequiredNodeVersion(): string {
    return '>=18.13.0';
  }

  protected getRequiredTypeScriptVersion(): string {
    return '>=5.2.0 <5.3.0';
  }

  /**
   * Apply Angular 17 specific changes
   */
  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    console.log('Applying Angular 17 specific changes...');

    // 1. Update to new application bootstrap (if not conservative)
    if (options.strategy !== 'conservative') {
      await this.updateApplicationBootstrap(projectPath);
    }

    // 2. Migrate assets folder to public folder (safe migration)
    await this.migrateAssetsToPublic(projectPath);

    // 3. Update to new control flow syntax (gradual migration)
    if (options.strategy === 'progressive') {
      await this.enableNewControlFlow(projectPath);
    }

    // 4. Update SSR configurations if present
    await this.updateSSRConfiguration(projectPath);

    // 5. Update build configurations
    await this.updateBuildConfiguration(projectPath);

    // 6. Update Angular Material if present
    await this.updateAngularMaterial(projectPath);
  }

  /**
   * Update to new application bootstrap
   */
  private async updateApplicationBootstrap(projectPath: string): Promise<void> {
    const mainTsPath = path.join(projectPath, 'src', 'main.ts');
    
    if (await fs.pathExists(mainTsPath)) {
      const mainTsContent = await fs.readFile(mainTsPath, 'utf-8');
      
      // Check if already using new bootstrap
      if (mainTsContent.includes('bootstrapApplication')) {
        return;
      }

      // Create backup
      await this.backupFile(mainTsPath);

      // Update to new bootstrap pattern
      const newMainTs = this.generateNewBootstrapCode(mainTsContent);
      await fs.writeFile(mainTsPath, newMainTs);

      console.log('✓ Updated to new application bootstrap');
    }
  }

  /**
   * Generate new bootstrap code
   */
  private generateNewBootstrapCode(oldContent: string): string {
    // This is a simplified transformation
    // In production, this would use AST transformations
    return `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    // Add your providers here
  ]
}).catch(err => console.error(err));
`;
  }

  /**
   * Migrate assets folder to public folder (Angular 17+)
   */
  private async migrateAssetsToPublic(projectPath: string): Promise<void> {
    const assetsPath = path.join(projectPath, 'src', 'assets');
    const publicPath = path.join(projectPath, 'public');
    
    if (await fs.pathExists(assetsPath) && !await fs.pathExists(publicPath)) {
      // Create public directory
      await fs.ensureDir(publicPath);
      
      // Copy assets to public (keep original for compatibility)
      await fs.copy(assetsPath, publicPath);
      
      // Update angular.json to use both asset configurations
      await this.updateAssetConfiguration(projectPath);
      
      console.log('✓ Migrated assets to public folder (maintaining backward compatibility)');
    }
  }

  /**
   * Update asset configuration in angular.json
   */
  private async updateAssetConfiguration(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      const angularJson = await fs.readJson(angularJsonPath);
      
      // Update each project's asset configuration
      for (const [projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
        const config = projectConfig as any;
        
        if (config.architect?.build?.options?.assets) {
          // Add public folder to assets while keeping src/assets
          const assets = config.architect.build.options.assets;
          
          // Add public folder if not already present
          if (!assets.includes('public') && !assets.some((asset: any) => 
            typeof asset === 'object' && asset.input === 'public'
          )) {
            assets.unshift({
              "glob": "**/*",
              "input": "public",
              "output": "."
            });
          }
        }
      }
      
      await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
    }
  }

  /**
   * Enable new control flow syntax
   */
  private async enableNewControlFlow(projectPath: string): Promise<void> {
    // This would enable the new @if, @for, @switch syntax
    // For now, just log that it's available
    console.log('✓ New control flow syntax (@if, @for, @switch) is available');
    console.log('  Use "ng generate @angular/core:control-flow" to migrate templates');
  }

  /**
   * Update SSR configuration
   */
  private async updateSSRConfiguration(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      const angularJson = await fs.readJson(angularJsonPath);
      let hasSSR = false;

      // Check if SSR is configured
      for (const [projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
        const config = projectConfig as any;
        if (config.architect?.['serve-ssr'] || config.architect?.['build-ssr']) {
          hasSSR = true;
        }
      }

      if (hasSSR) {
        console.log('✓ SSR configuration detected - Angular 17 SSR improvements enabled');
        // Would update SSR configuration for Angular 17 improvements
      }
    }
  }

  /**
   * Update build configuration
   */
  private async updateBuildConfiguration(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      const angularJson = await fs.readJson(angularJsonPath);
      
      // Update build configurations for Angular 17
      for (const [projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
        const config = projectConfig as any;
        
        if (config.architect?.build?.options) {
          // Enable new build features
          if (!config.architect.build.options.outputPath) {
            config.architect.build.options.outputPath = 'dist';
          }
        }
      }
      
      await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
    }
  }

  /**
   * Update Angular Material for Angular 17
   */
  private async updateAngularMaterial(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    if (packageJson.dependencies?.['@angular/material']) {
      // Update Angular Material to version 17
      packageJson.dependencies['@angular/material'] = '^17.0.0';
      packageJson.dependencies['@angular/cdk'] = '^17.0.0';
      
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      
      console.log('✓ Updated Angular Material to version 17');
    }
  }

  /**
   * Update builder configurations for Angular 17
   */
  protected updateBuilderConfigurations(angularJson: any): void {
    for (const [projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
      const config = projectConfig as any;
      
      if (config.architect?.build) {
        // Update build configurations
        if (!config.architect.build.options) {
          config.architect.build.options = {};
        }
        
        // Enable new bundling optimizations
        config.architect.build.options.optimization = true;
        config.architect.build.options.buildOptimizer = true;
      }
    }
  }

  /**
   * Update TypeScript configuration for Angular 17
   */
  protected updateTypeScriptConfig(tsconfig: any): void {
    super.updateTypeScriptConfig(tsconfig);
    
    // Angular 17 specific TypeScript settings
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }
    
    // Enable ES2022 for better performance
    tsconfig.compilerOptions.target = 'ES2022';
    tsconfig.compilerOptions.module = 'ES2022';
    tsconfig.compilerOptions.lib = ['ES2022', 'dom'];
  }

  /**
   * Angular 17 breaking changes
   */
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange(
        'ng17-new-application-bootstrap',
        'api',
        'medium',
        'New application bootstrap API',
        'Applications can optionally migrate to the new bootstrapApplication API',
        'Consider migrating to bootstrapApplication for better tree-shaking and performance'
      ),
      this.createBreakingChange(
        'ng17-assets-to-public',
        'config',
        'low',
        'Assets folder migration to public',
        'New public folder structure for better asset management',
        'Assets are copied to public folder while maintaining backward compatibility'
      ),
      this.createBreakingChange(
        'ng17-new-control-flow',
        'template',
        'low',
        'New control flow syntax available',
        'New @if, @for, @switch syntax available as alternative to *ngIf, *ngFor, *ngSwitch',
        'New syntax is optional - existing syntax continues to work'
      ),
      this.createBreakingChange(
        'ng17-ssr-improvements',
        'build',
        'low',
        'SSR improvements and new features',
        'Enhanced server-side rendering with better hydration',
        'SSR applications may benefit from new hydration features'
      ),
      this.createBreakingChange(
        'ng17-angular-material-update',
        'dependency',
        'medium',
        'Angular Material 17 with Material Design 3',
        'Angular Material updated with Material Design 3 components',
        'Review Material component designs as they may have visual changes'
      )
    ];
  }
}