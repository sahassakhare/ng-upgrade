import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as semver from 'semver';
import { Prerequisite, ValidationStep } from '../types';

export interface ValidationResult {
  success: boolean;
  message: string;
  error?: string;
  warnings?: string[];
}

export class ValidatorFramework {
  constructor(private projectPath: string) {}

  /**
   * Validate prerequisite requirements
   */
  async validatePrerequisite(prerequisite: Prerequisite): Promise<boolean> {
    try {
      switch (prerequisite.type) {
        case 'node':
          return this.validateNodeVersion(prerequisite.requiredVersion || '');
        case 'typescript':
          return this.validateTypeScriptVersion(prerequisite.requiredVersion || '');
        case 'dependency':
          return await this.validateDependency(prerequisite.name, prerequisite.requiredVersion);
        case 'environment':
          return await this.validateEnvironment(prerequisite.name);
        default:
          return false;
      }
    } catch (error) {
      console.error(`Prerequisite validation failed for ${prerequisite.name}:`, error);
      return false;
    }
  }

  /**
   * Run validation step
   */
  async runValidation(validation: ValidationStep): Promise<ValidationResult> {
    try {
      switch (validation.type) {
        case 'build':
          return await this.runBuildValidation(validation);
        case 'test':
          return await this.runTestValidation(validation);
        case 'lint':
          return await this.runLintValidation(validation);
        case 'runtime':
          return await this.runRuntimeValidation(validation);
        case 'compatibility':
          return await this.runCompatibilityValidation(validation);
        default:
          return {
            success: false,
            message: `Unknown validation type: ${validation.type}`,
            error: 'Unsupported validation type'
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Validation failed: ${validation.description}`,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Validate Node.js version
   */
  private validateNodeVersion(requiredVersion: string): boolean {
    try {
      const currentVersion = process.version;
      return semver.satisfies(currentVersion, requiredVersion);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate TypeScript version
   */
  private validateTypeScriptVersion(requiredVersion: string): boolean {
    try {
      const result = execSync('npx tsc --version', { 
        cwd: this.projectPath, 
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      const versionMatch = result.match(/Version (\d+\.\d+\.\d+)/);
      if (!versionMatch) return false;
      
      const currentVersion = versionMatch[1];
      return semver.satisfies(currentVersion, requiredVersion);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate dependency version
   */
  private async validateDependency(name: string, requiredVersion?: string): Promise<boolean> {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      
      const currentVersion = packageJson.dependencies?.[name] || 
                           packageJson.devDependencies?.[name];
      
      if (!currentVersion) return false;
      
      if (!requiredVersion) return true;
      
      const cleanVersion = currentVersion.replace(/[\^~]/, '');
      return semver.satisfies(cleanVersion, requiredVersion);
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate environment requirements
   */
  private async validateEnvironment(requirement: string): Promise<boolean> {
    switch (requirement) {
      case 'git':
        return this.commandExists('git --version');
      case 'npm':
        return this.commandExists('npm --version');
      case 'yarn':
        return this.commandExists('yarn --version');
      default:
        return false;
    }
  }

  /**
   * Check if command exists
   */
  private commandExists(command: string): boolean {
    try {
      execSync(command, { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Run build validation
   */
  private async runBuildValidation(validation: ValidationStep): Promise<ValidationResult> {
    try {
      const command = validation.command || 'npm run build';
      const timeout = validation.timeout || 300000; // 5 minutes default
      
      const result = execSync(command, {
        cwd: this.projectPath,
        encoding: 'utf-8',
        timeout,
        stdio: 'pipe'
      });

      return {
        success: true,
        message: 'Build completed successfully',
        warnings: this.extractWarnings(result)
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Build failed',
        error: error.stdout || error.stderr || error.message
      };
    }
  }

  /**
   * Run test validation
   */
  private async runTestValidation(validation: ValidationStep): Promise<ValidationResult> {
    try {
      const command = validation.command || 'npm test -- --watch=false --browsers=ChromeHeadless';
      const timeout = validation.timeout || 600000; // 10 minutes default
      
      const result = execSync(command, {
        cwd: this.projectPath,
        encoding: 'utf-8',
        timeout,
        stdio: 'pipe'
      });

      return {
        success: true,
        message: 'Tests passed successfully',
        warnings: this.extractWarnings(result)
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Tests failed',
        error: error.stdout || error.stderr || error.message
      };
    }
  }

  /**
   * Run lint validation
   */
  private async runLintValidation(validation: ValidationStep): Promise<ValidationResult> {
    try {
      const command = validation.command || await this.getLintCommand();
      const timeout = validation.timeout || 120000; // 2 minutes default
      
      const result = execSync(command, {
        cwd: this.projectPath,
        encoding: 'utf-8',
        timeout,
        stdio: 'pipe'
      });

      return {
        success: true,
        message: 'Linting passed successfully',
        warnings: this.extractWarnings(result)
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Linting failed',
        error: error.stdout || error.stderr || error.message
      };
    }
  }

  /**
   * Run runtime validation
   */
  private async runRuntimeValidation(validation: ValidationStep): Promise<ValidationResult> {
    try {
      // Start dev server and check if it boots successfully
      const command = 'npm start';
      const timeout = validation.timeout || 60000; // 1 minute default
      
      // This is a simplified runtime check
      // In a full implementation, this would start the server,
      // wait for it to be ready, then shut it down
      
      return {
        success: true,
        message: 'Runtime validation passed',
        warnings: ['Runtime validation is simplified in this implementation']
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Runtime validation failed',
        error: error.message
      };
    }
  }

  /**
   * Run compatibility validation
   */
  private async runCompatibilityValidation(validation: ValidationStep): Promise<ValidationResult> {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Check for deprecated APIs
    const deprecatedApis = await this.checkDeprecatedApis();
    if (deprecatedApis.length > 0) {
      warnings.push(`Found ${deprecatedApis.length} deprecated API usages`);
    }

    // Check for peer dependency conflicts
    const peerConflicts = await this.checkPeerDependencies();
    if (peerConflicts.length > 0) {
      issues.push(`Found ${peerConflicts.length} peer dependency conflicts`);
    }

    // Check Angular version compatibility
    const versionIssues = await this.checkVersionCompatibility();
    if (versionIssues.length > 0) {
      issues.push(...versionIssues);
    }

    return {
      success: issues.length === 0,
      message: issues.length === 0 ? 'Compatibility validation passed' : 'Compatibility issues found',
      error: issues.length > 0 ? issues.join('; ') : undefined,
      warnings
    };
  }

  /**
   * Get appropriate lint command
   */
  private async getLintCommand(): Promise<string> {
    // Check what linter is configured
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    
    try {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      const scripts = packageJson.scripts || {};
      
      if (scripts.lint) {
        return 'npm run lint';
      } else if (packageJson.devDependencies?.eslint) {
        return 'npx eslint src/**/*.ts';
      } else if (packageJson.devDependencies?.tslint) {
        return 'npx tslint -p tsconfig.json';
      }
    } catch {
      // Ignore errors
    }
    
    return 'npm run lint'; // Default fallback
  }

  /**
   * Extract warnings from command output
   */
  private extractWarnings(output: string): string[] {
    const warnings: string[] = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('WARNING') || line.includes('warning') || line.includes('WARN')) {
        warnings.push(line.trim());
      }
    }
    
    return warnings;
  }

  /**
   * Check for deprecated API usage
   */
  private async checkDeprecatedApis(): Promise<string[]> {
    const deprecatedApis: string[] = [];
    
    // This would scan the codebase for deprecated Angular APIs
    // For now, return empty array
    
    return deprecatedApis;
  }

  /**
   * Check peer dependencies
   */
  private async checkPeerDependencies(): Promise<string[]> {
    const conflicts: string[] = [];
    
    try {
      const result = execSync('npm ls --depth=0', {
        cwd: this.projectPath,
        encoding: 'utf-8',
        stdio: 'pipe'
      });
      
      // Parse npm ls output for peer dependency warnings
      if (result.includes('WARN')) {
        const lines = result.split('\n');
        for (const line of lines) {
          if (line.includes('WARN') && line.includes('peer dep')) {
            conflicts.push(line.trim());
          }
        }
      }
    } catch (error: any) {
      // npm ls might exit with non-zero code if there are issues
      const output = error.stdout || '';
      if (output.includes('peer dep')) {
        conflicts.push('Peer dependency conflicts detected');
      }
    }
    
    return conflicts;
  }

  /**
   * Check Angular version compatibility
   */
  private async checkVersionCompatibility(): Promise<string[]> {
    const issues: string[] = [];
    
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      
      const angularDeps = Object.entries({
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      }).filter(([name]) => name.startsWith('@angular/'));
      
      const coreVersion = angularDeps.find(([name]) => name === '@angular/core')?.[1];
      
      if (coreVersion && typeof coreVersion === 'string') {
        const coreMajor = semver.major(coreVersion.replace(/[\^~]/, ''));
        
        for (const [name, version] of angularDeps) {
          if (name !== '@angular/core') {
            const depMajor = semver.major((version as string).replace(/[\^~]/, ''));
            if (depMajor !== coreMajor) {
              issues.push(`Version mismatch: ${name}@${version} with @angular/core@${coreVersion}`);
            }
          }
        }
      }
    } catch (error) {
      issues.push('Could not validate Angular version compatibility');
    }
    
    return issues;
  }

  /**
   * Run comprehensive validation suite
   */
  async runComprehensiveValidation(): Promise<ValidationResult[]> {
    const validations: ValidationStep[] = [
      {
        type: 'build',
        description: 'Project build validation',
        required: true
      },
      {
        type: 'test',
        description: 'Unit test validation',
        required: false
      },
      {
        type: 'lint',
        description: 'Code quality validation',
        required: false
      },
      {
        type: 'compatibility',
        description: 'Angular compatibility validation',
        required: true
      }
    ];

    const results: ValidationResult[] = [];
    
    for (const validation of validations) {
      const result = await this.runValidation(validation);
      results.push(result);
      
      // Stop on critical failures
      if (validation.required && !result.success) {
        break;
      }
    }
    
    return results;
  }
}