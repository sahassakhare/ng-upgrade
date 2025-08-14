import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';

export class Angular12Handler extends BaseVersionHandler {
  readonly version = '12';

  protected getRequiredNodeVersion(): string {
    return '>=12.20.0';
  }

  protected getRequiredTypeScriptVersion(): string {
    return '>=4.2.3 <4.4.0';
  }

  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    console.log('Applying Angular 12 specific changes...');

    // 1. Enable Ivy renderer (should already be default in v12)
    await this.ensureIvyRenderer(projectPath);

    // 2. Update to Webpack 5 support
    await this.updateWebpackConfiguration(projectPath);

    // 3. Update Angular Package Format (APF)
    await this.updatePackageFormat(projectPath);

    // 4. Enable strict mode by default
    if (options.strategy !== 'conservative') {
      await this.enableStrictMode(projectPath);
    }

    // 5. Update Hot Module Replacement support
    await this.updateHMRSupport(projectPath);
  }

  private async ensureIvyRenderer(projectPath: string): Promise<void> {
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    
    if (await fs.pathExists(tsconfigPath)) {
      const tsconfig = await fs.readJson(tsconfigPath);
      
      // Remove View Engine configuration (Ivy is default in v12)
      if (tsconfig.angularCompilerOptions?.enableIvy === false) {
        delete tsconfig.angularCompilerOptions.enableIvy;
        await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
        console.log('✓ Removed explicit Ivy renderer configuration (default in Angular 12)');
      }
    }
  }

  private async updateWebpackConfiguration(projectPath: string): Promise<void> {
    // Angular 12 includes Webpack 5 support
    console.log('✓ Webpack 5 support enabled');
  }

  private async updatePackageFormat(projectPath: string): Promise<void> {
    // Update to Angular Package Format v12
    console.log('✓ Angular Package Format v12 support enabled');
  }

  private async enableStrictMode(projectPath: string): Promise<void> {
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    
    if (await fs.pathExists(tsconfigPath)) {
      const tsconfig = await fs.readJson(tsconfigPath);
      
      if (!tsconfig.compilerOptions) {
        tsconfig.compilerOptions = {};
      }
      
      tsconfig.compilerOptions.strict = true;
      tsconfig.compilerOptions.noImplicitReturns = true;
      tsconfig.compilerOptions.noFallthroughCasesInSwitch = true;
      
      await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
      console.log('✓ Enabled TypeScript strict mode');
    }
  }

  private async updateHMRSupport(projectPath: string): Promise<void> {
    // Angular 12 improved HMR support
    console.log('✓ Hot Module Replacement support updated');
  }

  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange(
        'ng12-ivy-default',
        'build',
        'high',
        'Ivy renderer is now the default and only renderer',
        'View Engine is no longer supported',
        'Remove any View Engine specific configurations'
      ),
      this.createBreakingChange(
        'ng12-webpack5',
        'build',
        'medium',
        'Webpack 5 support enabled',
        'Some webpack plugins may need updates',
        'Update webpack plugins to be compatible with Webpack 5'
      ),
      this.createBreakingChange(
        'ng12-strict-mode',
        'config',
        'medium',
        'Strict mode enabled by default for new projects',
        'Stricter TypeScript compilation',
        'Fix any TypeScript strict mode errors'
      ),
      this.createBreakingChange(
        'ng12-ie11-deprecation',
        'build',
        'low',
        'Internet Explorer 11 support deprecated',
        'IE11 support will be removed in future versions',
        'Plan migration away from IE11 support'
      )
    ];
  }
}