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
const chalk = __importStar(require("chalk"));
const ora_1 = __importDefault(require("ora"));
class DependencyInstaller {
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
            // Group dependencies by type
            const deps = dependencies.filter(d => d.type === 'dependencies');
            const devDeps = dependencies.filter(d => d.type === 'devDependencies');
            // Prepare install commands
            const commands = [];
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
                (0, child_process_1.execSync)(command, {
                    cwd: this.projectPath,
                    stdio: 'pipe', // Use pipe to capture output
                    encoding: 'utf-8'
                });
            }
            this.spinner.succeed(chalk.green('✓ Dependencies installed successfully'));
            return true;
        }
        catch (error) {
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
            console.error(chalk.red('Failed to update package.json:'), error instanceof Error ? error.message : String(error));
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
            this.spinner.succeed(chalk.green('✓ npm install completed successfully'));
            return true;
        }
        catch (error) {
            this.spinner.fail(chalk.red('✗ npm install failed'));
            console.error(chalk.yellow('You may need to run "npm install" manually'));
            return false;
        }
    }
}
exports.DependencyInstaller = DependencyInstaller;
//# sourceMappingURL=DependencyInstaller.js.map