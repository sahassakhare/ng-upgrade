"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyInstaller = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
class DependencyInstaller {
    projectPath;
    spinner;
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.spinner = (0, ora_1.default)();
    }
    /**
     * Install or update multiple dependencies automatically
     */
    async installDependencies(dependencies, message) {
        try {
            this.spinner.start(message || 'Installing dependencies...');
            // First, update package.json with new dependencies
            const packageJsonUpdated = await this.updatePackageJsonSafely(dependencies);
            if (!packageJsonUpdated) {
                this.spinner.fail(chalk_1.default.red('✗ Failed to update package.json'));
                return false;
            }
            // Then run npm install to install all dependencies
            this.spinner.text = 'Running npm install to install all dependencies...';
            const npmInstallSuccess = await this.runNpmInstallWithRetry();
            if (npmInstallSuccess) {
                this.spinner.succeed(chalk_1.default.green('✓ Dependencies installed successfully'));
                return true;
            }
            else {
                this.spinner.fail(chalk_1.default.red('✗ npm install failed'));
                // Try individual package installation as fallback
                console.log(chalk_1.default.yellow('Attempting individual package installation...'));
                return await this.installIndividualPackages(dependencies);
            }
        }
        catch (error) {
            this.spinner.fail(chalk_1.default.red('✗ Failed to install dependencies'));
            console.error(chalk_1.default.yellow('Error details:'), error instanceof Error ? error.message : String(error));
            // Final fallback: just update package.json
            const fallbackSuccess = await this.fallbackUpdatePackageJson(dependencies);
            if (fallbackSuccess) {
                console.log(chalk_1.default.yellow('\n⚠ Dependencies were added to package.json.'));
                console.log(chalk_1.default.yellow('Please run "npm install" manually to complete the installation.\n'));
            }
            return fallbackSuccess;
        }
    }
    /**
     * Update Angular core packages to specific version
     */
    async updateAngularPackages(version) {
        const angularPackages = [
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
        const existingPackages = angularPackages.filter(pkg => packageJson.dependencies?.[pkg.name] || packageJson.devDependencies?.[pkg.name]);
        return await this.installDependencies(existingPackages, `Updating Angular packages to version ${version}...`);
    }
    /**
     * Update TypeScript to compatible version
     */
    async updateTypeScript(version) {
        return await this.installDependencies([{ name: 'typescript', version, type: 'devDependencies' }], 'Updating TypeScript...');
    }
    /**
     * Install additional required packages
     */
    async installRequiredPackages(packages) {
        return await this.installDependencies(packages, 'Installing required packages...');
    }
    /**
     * Check if a package is installed
     */
    async isPackageInstalled(packageName) {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            const packageJson = await fs.readJson(packageJsonPath);
            return !!(packageJson.dependencies?.[packageName] ||
                packageJson.devDependencies?.[packageName]);
        }
        catch {
            return false;
        }
    }
    /**
     * Get installed version of a package
     */
    async getInstalledVersion(packageName) {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            const packageJson = await fs.readJson(packageJsonPath);
            return packageJson.dependencies?.[packageName] ||
                packageJson.devDependencies?.[packageName] ||
                null;
        }
        catch {
            return null;
        }
    }
    /**
     * Fallback: Update package.json directly if npm install fails
     */
    async fallbackUpdatePackageJson(dependencies) {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            const packageJson = await fs.readJson(packageJsonPath);
            for (const dep of dependencies) {
                if (dep.type === 'dependencies') {
                    if (!packageJson.dependencies)
                        packageJson.dependencies = {};
                    packageJson.dependencies[dep.name] = dep.version;
                }
                else {
                    if (!packageJson.devDependencies)
                        packageJson.devDependencies = {};
                    packageJson.devDependencies[dep.name] = dep.version;
                }
            }
            await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
            return true;
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to update package.json:'), error instanceof Error ? error.message : String(error));
            return false;
        }
    }
    /**
     * Run npm install to ensure all dependencies are installed
     */
    async runNpmInstall() {
        try {
            this.spinner.start('Running npm install...');
            (0, child_process_1.execSync)('npm install', {
                cwd: this.projectPath,
                stdio: 'pipe',
                encoding: 'utf-8'
            });
            this.spinner.succeed(chalk_1.default.green('✓ npm install completed successfully'));
            return true;
        }
        catch (error) {
            this.spinner.fail(chalk_1.default.red('✗ npm install failed'));
            console.error(chalk_1.default.yellow('You may need to run "npm install" manually'));
            return false;
        }
    }
    /**
     * Run npm install with retry mechanism
     */
    async runNpmInstallWithRetry(maxRetries = 2) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const command = attempt === 1 ? 'npm install' : 'npm install --force';
                this.spinner.text = `Running npm install (attempt ${attempt}/${maxRetries})...`;
                (0, child_process_1.execSync)(command, {
                    cwd: this.projectPath,
                    stdio: 'pipe',
                    encoding: 'utf-8',
                    timeout: 300000 // 5 minutes timeout
                });
                return true;
            }
            catch (error) {
                if (attempt === maxRetries) {
                    console.error(chalk_1.default.red(`npm install failed after ${maxRetries} attempts:`));
                    console.error(chalk_1.default.yellow(error instanceof Error ? error.message : String(error)));
                    return false;
                }
                // Wait a bit before retrying
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        return false;
    }
    /**
     * Install individual packages as fallback
     */
    async installIndividualPackages(dependencies) {
        let successCount = 0;
        for (const dep of dependencies) {
            try {
                const saveFlag = dep.type === 'dependencies' ? '--save' : '--save-dev';
                const command = `npm install ${dep.name}@${dep.version} ${saveFlag}`;
                this.spinner.text = `Installing ${dep.name}@${dep.version}...`;
                (0, child_process_1.execSync)(command, {
                    cwd: this.projectPath,
                    stdio: 'pipe',
                    encoding: 'utf-8',
                    timeout: 120000 // 2 minutes per package
                });
                successCount++;
            }
            catch (error) {
                console.log(chalk_1.default.yellow(`⚠ Failed to install ${dep.name}: ${error instanceof Error ? error.message : String(error)}`));
            }
        }
        const success = successCount > 0;
        if (success) {
            console.log(chalk_1.default.green(`✓ Successfully installed ${successCount}/${dependencies.length} packages`));
        }
        return success;
    }
    /**
     * Safely update package.json with new dependencies
     */
    async updatePackageJsonSafely(dependencies) {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            // Create backup
            const backupPath = `${packageJsonPath}.backup.${Date.now()}`;
            await fs.copy(packageJsonPath, backupPath);
            const packageJson = await fs.readJson(packageJsonPath);
            for (const dep of dependencies) {
                if (dep.type === 'dependencies') {
                    if (!packageJson.dependencies)
                        packageJson.dependencies = {};
                    packageJson.dependencies[dep.name] = dep.version;
                }
                else {
                    if (!packageJson.devDependencies)
                        packageJson.devDependencies = {};
                    packageJson.devDependencies[dep.name] = dep.version;
                }
            }
            await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
            // Clean up backup on success
            await fs.remove(backupPath);
            return true;
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to update package.json safely:'), error instanceof Error ? error.message : String(error));
            return false;
        }
    }
    /**
     * Verify that dependencies are actually installed
     */
    async verifyDependenciesInstalled(dependencies) {
        try {
            for (const dep of dependencies) {
                const depPath = path.join(this.projectPath, 'node_modules', dep.name);
                if (!await fs.pathExists(depPath)) {
                    console.log(chalk_1.default.yellow(`⚠ Package ${dep.name} not found in node_modules`));
                    return false;
                }
            }
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.DependencyInstaller = DependencyInstaller;
//# sourceMappingURL=DependencyInstaller.js.map