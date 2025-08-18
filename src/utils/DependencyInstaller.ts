import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as chalk from 'chalk';
import ora from 'ora';

export interface DependencyUpdate {
  name: string;
  version: string;
  type: 'dependencies' | 'devDependencies';
}

export class DependencyInstaller {
  private spinner: ora.Ora;

  constructor(private projectPath: string) {
    this.spinner = ora();
  }

  /**
   * Install or update multiple dependencies automatically
   */
  async installDependencies(dependencies: DependencyUpdate[], message?: string): Promise<boolean> {
    try {
      this.spinner.start(message || 'Installing dependencies...');
      
      // Group dependencies by type
      const deps = dependencies.filter(d => d.type === 'dependencies');
      const devDeps = dependencies.filter(d => d.type === 'devDependencies');

      // Prepare install commands
      const commands: string[] = [];
      
      if (deps.length > 0) {
        const depsStr = deps.map(d => `${d.name}@${d.version}`).join(' ');
        commands.push(`npm install ${depsStr} --save`);
      }
      
      if (devDeps.length > 0) {
        const devDepsStr = devDeps.map(d => `${d.name}@${d.version}`).join(' ');
        commands.push(`npm install ${devDepsStr} --save-dev`);
      }

      // Execute install commands
      for (const command of commands) {
        this.spinner.text = `Running: ${command}`;
        execSync(command, {
          cwd: this.projectPath,
          stdio: 'pipe', // Use pipe to capture output
          encoding: 'utf-8'
        });
      }

      this.spinner.succeed(chalk.green('✓ Dependencies installed successfully'));
      return true;
    } catch (error) {
      this.spinner.fail(chalk.red('✗ Failed to install dependencies'));
      console.error(chalk.yellow('Error details:'), error instanceof Error ? error.message : String(error));
      
      // Attempt fallback: update package.json and suggest manual install
      const fallbackSuccess = await this.fallbackUpdatePackageJson(dependencies);
      
      if (fallbackSuccess) {
        console.log(chalk.yellow('\n⚠ Dependencies were added to package.json.'));
        console.log(chalk.yellow('Please run "npm install" manually to complete the installation.\n'));
      }
      
      return fallbackSuccess;
    }
  }

  /**
   * Update Angular core packages to specific version
   */
  async updateAngularPackages(version: string): Promise<boolean> {
    const angularPackages: DependencyUpdate[] = [
      // Core Angular packages
      { name: '@angular/animations', version: `^${version}.0.0`, type: 'dependencies' },
      { name: '@angular/common', version: `^${version}.0.0`, type: 'dependencies' },
      { name: '@angular/compiler', version: `^${version}.0.0`, type: 'dependencies' },
      { name: '@angular/core', version: `^${version}.0.0`, type: 'dependencies' },
      { name: '@angular/forms', version: `^${version}.0.0`, type: 'dependencies' },
      { name: '@angular/platform-browser', version: `^${version}.0.0`, type: 'dependencies' },
      { name: '@angular/platform-browser-dynamic', version: `^${version}.0.0`, type: 'dependencies' },
      { name: '@angular/router', version: `^${version}.0.0`, type: 'dependencies' },
      // Dev dependencies
      { name: '@angular/cli', version: `^${version}.0.0`, type: 'devDependencies' },
      { name: '@angular/compiler-cli', version: `^${version}.0.0`, type: 'devDependencies' },
      { name: '@angular-devkit/build-angular', version: `^${version}.0.0`, type: 'devDependencies' }
    ];

    // Filter to only include packages that exist in the project
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    const existingPackages = angularPackages.filter(pkg => 
      packageJson.dependencies?.[pkg.name] || packageJson.devDependencies?.[pkg.name]
    );

    return await this.installDependencies(
      existingPackages,
      `Updating Angular packages to version ${version}...`
    );
  }

  /**
   * Update TypeScript to compatible version
   */
  async updateTypeScript(version: string): Promise<boolean> {
    return await this.installDependencies(
      [{ name: 'typescript', version, type: 'devDependencies' }],
      'Updating TypeScript...'
    );
  }

  /**
   * Install additional required packages
   */
  async installRequiredPackages(packages: DependencyUpdate[]): Promise<boolean> {
    return await this.installDependencies(
      packages,
      'Installing required packages...'
    );
  }

  /**
   * Check if a package is installed
   */
  async isPackageInstalled(packageName: string): Promise<boolean> {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      
      return !!(
        packageJson.dependencies?.[packageName] || 
        packageJson.devDependencies?.[packageName]
      );
    } catch {
      return false;
    }
  }

  /**
   * Get installed version of a package
   */
  async getInstalledVersion(packageName: string): Promise<string | null> {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);
      
      return packageJson.dependencies?.[packageName] || 
             packageJson.devDependencies?.[packageName] || 
             null;
    } catch {
      return null;
    }
  }

  /**
   * Fallback: Update package.json directly if npm install fails
   */
  private async fallbackUpdatePackageJson(dependencies: DependencyUpdate[]): Promise<boolean> {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonPath);

      for (const dep of dependencies) {
        if (dep.type === 'dependencies') {
          if (!packageJson.dependencies) packageJson.dependencies = {};
          packageJson.dependencies[dep.name] = dep.version;
        } else {
          if (!packageJson.devDependencies) packageJson.devDependencies = {};
          packageJson.devDependencies[dep.name] = dep.version;
        }
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      return true;
    } catch (error) {
      console.error(chalk.red('Failed to update package.json:'), error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  /**
   * Run npm install to ensure all dependencies are installed
   */
  async runNpmInstall(): Promise<boolean> {
    try {
      this.spinner.start('Running npm install...');
      
      execSync('npm install', {
        cwd: this.projectPath,
        stdio: 'pipe',
        encoding: 'utf-8'
      });
      
      this.spinner.succeed(chalk.green('✓ npm install completed successfully'));
      return true;
    } catch (error) {
      this.spinner.fail(chalk.red('✗ npm install failed'));
      console.error(chalk.yellow('You may need to run "npm install" manually'));
      return false;
    }
  }
}