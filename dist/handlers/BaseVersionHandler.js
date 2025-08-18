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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseVersionHandler = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const DependencyInstaller_1 = require("../utils/DependencyInstaller");
const FileContentPreserver_1 = require("../utils/FileContentPreserver");
const ProgressReporter_1 = require("../utils/ProgressReporter");
class BaseVersionHandler {
    /**
     * Execute version-specific upgrade logic
     */
    async execute(projectPath, step, options) {
        this.dependencyInstaller = new DependencyInstaller_1.DependencyInstaller(projectPath);
        this.progressReporter = options.progressReporter || new ProgressReporter_1.ProgressReporter();
        this.progressReporter.startStep(`Angular ${this.version} Upgrade`, `Starting Angular ${this.version} upgrade...`);
        // Update Angular dependencies with automatic installation
        this.progressReporter.updateMessage('Updating Angular dependencies...');
        await this.updateAngularDependencies(projectPath);
        // Update TypeScript if needed
        await this.updateTypeScript(projectPath);
        // Update Angular CLI
        await this.updateAngularCli(projectPath);
        // Apply version-specific transformations
        await this.applyVersionSpecificChanges(projectPath, options);
        // Update configuration files
        await this.updateConfigurationFiles(projectPath, options);
        // Run Angular update schematics
        await this.runAngularUpdateSchematics(projectPath);
        this.progressReporter.completeStep(`Angular ${this.version} Upgrade`, `Angular ${this.version} upgrade completed successfully`);
    }
    /**
     * Validate prerequisites for this version
     */
    async validatePrerequisites(projectPath) {
        try {
            // Check Node.js version
            const nodeVersion = process.version;
            const requiredNode = this.getRequiredNodeVersion();
            if (!this.isVersionCompatible(nodeVersion, requiredNode)) {
                this.progressReporter?.error(`Node.js ${requiredNode} required, found ${nodeVersion}`);
                return false;
            }
            // Check if project is an Angular project
            const packageJsonPath = path.join(projectPath, 'package.json');
            if (!await fs.pathExists(packageJsonPath)) {
                this.progressReporter?.error('package.json not found');
                return false;
            }
            const packageJson = await fs.readJson(packageJsonPath);
            if (!packageJson.dependencies?.['@angular/core']) {
                this.progressReporter?.error('Not an Angular project');
                return false;
            }
            return true;
        }
        catch (error) {
            this.progressReporter?.error(`Prerequisite validation failed: ${error}`);
            return false;
        }
    }
    /**
     * Update Angular dependencies to target version with automatic installation
     */
    async updateAngularDependencies(projectPath) {
        // Use the DependencyInstaller for automatic installation
        const success = await this.dependencyInstaller.updateAngularPackages(this.version);
        if (!success) {
            this.progressReporter.warn('Angular dependencies updated in package.json. Manual npm install may be required.');
        }
        else {
            this.progressReporter.success('Angular dependencies installed successfully');
        }
    }
    /**
     * Update TypeScript version with automatic installation
     */
    async updateTypeScript(projectPath) {
        const requiredTsVersion = this.getRequiredTypeScriptVersion();
        this.progressReporter.updateMessage(`Installing TypeScript ${requiredTsVersion}...`);
        const success = await this.dependencyInstaller.updateTypeScript(requiredTsVersion);
        if (!success) {
            this.progressReporter.warn('TypeScript version updated in package.json. Manual npm install may be required.');
        }
        else {
            this.progressReporter.success(`TypeScript ${requiredTsVersion} installed successfully`);
        }
    }
    /**
     * Update Angular CLI with automatic installation
     */
    async updateAngularCli(projectPath) {
        // Angular CLI is already updated as part of updateAngularDependencies
        // This method is kept for compatibility but the work is done above
        this.progressReporter.info('Angular CLI updated with other Angular packages');
    }
    /**
     * Update configuration files while preserving existing content
     */
    async updateConfigurationFiles(projectPath, options) {
        // Update main.ts using FileContentPreserver if needed for Angular 14+
        const mainTsPath = path.join(projectPath, 'src', 'main.ts');
        if (await fs.pathExists(mainTsPath)) {
            const targetVersion = parseInt(this.version);
            if (targetVersion >= 14 && options.strategy !== 'conservative') {
                // Use FileContentPreserver to update main.ts while preserving custom code
                await FileContentPreserver_1.FileContentPreserver.updateMainTsFile(mainTsPath, targetVersion);
                this.progressReporter?.success('Updated main.ts while preserving custom code');
            }
        }
        await this.updateAngularJson(projectPath);
        await this.updateTsConfig(projectPath);
        if (options.strategy !== 'conservative') {
            await this.updateOptionalConfigs(projectPath);
            // Update template files for Angular 17+ (optional)
            if (parseInt(this.version) >= 17) {
                await this.updateTemplateFiles(projectPath);
            }
        }
    }
    /**
     * Update angular.json configuration
     */
    async updateAngularJson(projectPath) {
        const angularJsonPath = path.join(projectPath, 'angular.json');
        if (await fs.pathExists(angularJsonPath)) {
            const angularJson = await fs.readJson(angularJsonPath);
            // Update builder versions and configurations
            this.updateBuilderConfigurations(angularJson);
            await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        }
    }
    /**
     * Update builder configurations in angular.json
     */
    updateBuilderConfigurations(angularJson) {
        // This would be implemented by specific version handlers
        // to update builder configurations as needed
    }
    /**
     * Update tsconfig.json
     */
    async updateTsConfig(projectPath) {
        const tsconfigPath = path.join(projectPath, 'tsconfig.json');
        if (await fs.pathExists(tsconfigPath)) {
            const tsconfig = await fs.readJson(tsconfigPath);
            // Update TypeScript configuration for this Angular version
            this.updateTypeScriptConfig(tsconfig);
            await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
        }
    }
    /**
     * Update TypeScript configuration
     */
    updateTypeScriptConfig(tsconfig) {
        // Default TypeScript updates that apply to most versions
        if (!tsconfig.compilerOptions) {
            tsconfig.compilerOptions = {};
        }
        // Enable strict mode by default for newer versions
        if (Number(this.version) >= 15) {
            tsconfig.compilerOptions.strict = true;
        }
    }
    /**
     * Update optional configuration files
     */
    async updateOptionalConfigs(projectPath) {
        // Update browserslist if it exists
        await this.updateBrowsersList(projectPath);
        // Update karma.conf.js if it exists
        await this.updateKarmaConfig(projectPath);
    }
    /**
     * Update browserslist configuration
     */
    async updateBrowsersList(projectPath) {
        const browserslistPath = path.join(projectPath, '.browserslistrc');
        if (await fs.pathExists(browserslistPath)) {
            // Update browser support configuration
            // This would contain version-specific browser requirements
        }
    }
    /**
     * Update Karma configuration
     */
    async updateKarmaConfig(projectPath) {
        const karmaConfigPath = path.join(projectPath, 'karma.conf.js');
        if (await fs.pathExists(karmaConfigPath)) {
            // Update Karma configuration for new Angular version
            // This would contain version-specific Karma updates
        }
    }
    /**
     * Run Angular update schematics
     */
    async runAngularUpdateSchematics(projectPath) {
        try {
            // Run ng update for Angular core
            (0, child_process_1.execSync)(`npx ng update @angular/core@${this.version} --migrate-only --allow-dirty`, {
                cwd: projectPath,
                stdio: 'inherit'
            });
            // Run ng update for Angular CLI
            (0, child_process_1.execSync)(`npx ng update @angular/cli@${this.version} --migrate-only --allow-dirty`, {
                cwd: projectPath,
                stdio: 'inherit'
            });
        }
        catch (error) {
            console.warn('Angular schematics migration completed with warnings');
        }
    }
    /**
     * Install dependencies
     */
    async installDependencies(projectPath) {
        try {
            console.log('Installing dependencies...');
            (0, child_process_1.execSync)('npm install', {
                cwd: projectPath,
                stdio: 'inherit'
            });
        }
        catch (error) {
            throw new Error('Failed to install dependencies');
        }
    }
    /**
     * Check version compatibility
     */
    isVersionCompatible(currentVersion, requiredVersion) {
        // Simple version comparison - in production this would use semver
        const current = currentVersion.replace(/[^\d.]/g, '');
        const required = requiredVersion.replace(/[^\d.]/g, '');
        const currentParts = current.split('.').map(Number);
        const requiredParts = required.split('.').map(Number);
        for (let i = 0; i < Math.max(currentParts.length, requiredParts.length); i++) {
            const currentPart = currentParts[i] || 0;
            const requiredPart = requiredParts[i] || 0;
            if (currentPart > requiredPart)
                return true;
            if (currentPart < requiredPart)
                return false;
        }
        return true;
    }
    /**
     * Run command safely
     */
    async runCommand(command, projectPath) {
        try {
            return (0, child_process_1.execSync)(command, {
                cwd: projectPath,
                encoding: 'utf-8',
                stdio: 'pipe'
            });
        }
        catch (error) {
            throw new Error(`Command failed: ${command}\n${error.stdout || error.stderr || error.message}`);
        }
    }
    /**
     * Backup file before modification
     */
    async backupFile(filePath) {
        if (await fs.pathExists(filePath)) {
            await fs.copy(filePath, `${filePath}.backup`);
        }
    }
    /**
     * Update component files using FileContentPreserver
     */
    async updateComponentFiles(projectPath, transformations) {
        const componentsPath = path.join(projectPath, 'src', 'app');
        if (await fs.pathExists(componentsPath)) {
            // Find all component files
            const componentFiles = await this.findComponentFiles(componentsPath);
            for (const file of componentFiles) {
                await FileContentPreserver_1.FileContentPreserver.updateComponentFile(file, transformations);
            }
            if (componentFiles.length > 0) {
                this.progressReporter?.success(`Updated ${componentFiles.length} component files while preserving custom code`);
            }
        }
    }
    /**
     * Update template files using FileContentPreserver
     */
    async updateTemplateFiles(projectPath) {
        const targetVersion = parseInt(this.version);
        const templatesPath = path.join(projectPath, 'src', 'app');
        if (await fs.pathExists(templatesPath)) {
            // Find all template files
            const templateFiles = await this.findTemplateFiles(templatesPath);
            for (const file of templateFiles) {
                await FileContentPreserver_1.FileContentPreserver.updateTemplateFile(file, targetVersion);
            }
            if (templateFiles.length > 0) {
                this.progressReporter?.info(`Template files preserved - migration to new syntax is optional`);
            }
        }
    }
    /**
     * Find all component files in a directory
     */
    async findComponentFiles(dir) {
        const files = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...await this.findComponentFiles(fullPath));
            }
            else if (entry.name.endsWith('.component.ts')) {
                files.push(fullPath);
            }
        }
        return files;
    }
    /**
     * Find all template files in a directory
     */
    async findTemplateFiles(dir) {
        const files = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...await this.findTemplateFiles(fullPath));
            }
            else if (entry.name.endsWith('.component.html')) {
                files.push(fullPath);
            }
        }
        return files;
    }
    /**
     * Create version-specific breaking change
     */
    createBreakingChange(id, type, severity, description, impact, migrationInstructions) {
        return {
            id,
            version: this.version,
            type,
            severity,
            description,
            impact,
            migration: {
                type: migrationInstructions ? 'manual' : 'automatic',
                instructions: migrationInstructions
            }
        };
    }
}
exports.BaseVersionHandler = BaseVersionHandler;
//# sourceMappingURL=BaseVersionHandler.js.map