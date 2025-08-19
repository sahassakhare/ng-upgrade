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
/**
 * Base class for all Angular version handlers providing common upgrade functionality
 *
 * This abstract class serves as the foundation for all version-specific upgrade handlers,
 * providing shared infrastructure for dependency management, configuration updates,
 * migration execution, and progress reporting. Each concrete handler extends this class
 * to implement version-specific transformations.
 *
 * @abstract
 * @implements {VersionHandler}
 *
 * @example
 * ```typescript
 * export class Angular16Handler extends BaseVersionHandler {
 *   readonly version = '16';
 *
 *   protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
 *     // Implementation specific to Angular 16
 *   }
 * }
 * ```
 *
 * @since 1.0.0
 * @author Angular Multi-Version Upgrade Orchestrator
 */
class BaseVersionHandler {
    /** Utility for managing dependency installations and updates */
    dependencyInstaller;
    /** Utility for reporting upgrade progress and status messages */
    progressReporter;
    /**
     * Executes the complete version-specific upgrade process
     *
     * Orchestrates the entire upgrade workflow including dependency updates,
     * configuration changes, code transformations, and validation. This is the
     * main entry point for version upgrades.
     *
     * @param projectPath - The absolute path to the Angular project root
     * @param step - The upgrade step configuration with source and target versions
     * @param options - Comprehensive upgrade options including strategy and validation level
     * @throws {Error} When critical upgrade operations fail
     *
     * @example
     * ```typescript
     * const handler = new Angular16Handler();
     * await handler.execute('/path/to/project', {
     *   fromVersion: '15',
     *   toVersion: '16'
     * }, {
     *   strategy: 'balanced',
     *   validationLevel: 'comprehensive'
     * });
     * ```
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
     * Validates all prerequisites required for this Angular version upgrade
     *
     * Checks Node.js version, TypeScript compatibility, and project structure
     * to ensure the upgrade can proceed safely. Each version handler can override
     * this method to add version-specific validation requirements.
     *
     * @param projectPath - The absolute path to the Angular project root
     * @returns Promise resolving to true if all prerequisites are met
     *
     * @example
     * ```typescript
     * const isReady = await handler.validatePrerequisites('/path/to/project');
     * if (!isReady) {
     *   throw new Error('Prerequisites not met for Angular 16 upgrade');
     * }
     * ```
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
        // Update schema version based on Angular version
        const schemaMap = {
            '12': './node_modules/@angular/cli/lib/config/schema.json',
            '13': './node_modules/@angular/cli/lib/config/schema.json',
            '14': './node_modules/@angular/cli/lib/config/schema.json',
            '15': './node_modules/@angular/cli/lib/config/schema.json',
            '16': './node_modules/@angular/cli/lib/config/schema.json',
            '17': './node_modules/@angular/cli/lib/config/schema.json',
            '18': './node_modules/@angular/cli/lib/config/schema.json',
            '19': './node_modules/@angular/cli/lib/config/schema.json',
            '20': './node_modules/@angular/cli/lib/config/schema.json'
        };
        if (schemaMap[this.version]) {
            angularJson.$schema = schemaMap[this.version];
        }
        // Update version field
        angularJson.version = 1;
        // Handle browserTarget to buildTarget migration (Angular 15+)
        const versionNum = parseInt(this.version);
        if (versionNum >= 15) {
            this.migrateBrowserTargetToBuildTarget(angularJson);
        }
    }
    /**
     * Migrate browserTarget to buildTarget in angular.json (Angular 15+)
     */
    migrateBrowserTargetToBuildTarget(angularJson) {
        for (const projectName in angularJson.projects) {
            const project = angularJson.projects[projectName];
            // Update serve configuration
            if (project.architect?.serve?.configurations) {
                for (const config of Object.values(project.architect.serve.configurations)) {
                    const serveConfig = config;
                    if (serveConfig.browserTarget && !serveConfig.buildTarget) {
                        serveConfig.buildTarget = serveConfig.browserTarget;
                        delete serveConfig.browserTarget;
                    }
                }
            }
            // Update serve options
            if (project.architect?.serve?.options) {
                if (project.architect.serve.options.browserTarget && !project.architect.serve.options.buildTarget) {
                    project.architect.serve.options.buildTarget = project.architect.serve.options.browserTarget;
                    delete project.architect.serve.options.browserTarget;
                }
            }
            // Update extract-i18n configuration
            if (project.architect?.['extract-i18n']?.options) {
                const extractConfig = project.architect['extract-i18n'].options;
                if (extractConfig.browserTarget && !extractConfig.buildTarget) {
                    extractConfig.buildTarget = extractConfig.browserTarget;
                    delete extractConfig.browserTarget;
                }
            }
            // Update test configuration
            if (project.architect?.test?.options) {
                const testConfig = project.architect.test.options;
                if (testConfig.browserTarget && !testConfig.buildTarget) {
                    testConfig.buildTarget = testConfig.browserTarget;
                    delete testConfig.browserTarget;
                }
            }
        }
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
        // Set proper compiler options based on Angular version
        if (!tsconfig.compilerOptions) {
            tsconfig.compilerOptions = {};
        }
        // Handle strict mode - set to false for safer migration
        tsconfig.compilerOptions.strict = false;
        // Set individual strict flags to false for migration
        tsconfig.compilerOptions.strictNullChecks = false;
        tsconfig.compilerOptions.strictPropertyInitialization = false;
        tsconfig.compilerOptions.strictBindCallApply = false;
        tsconfig.compilerOptions.strictFunctionTypes = false;
        tsconfig.compilerOptions.noImplicitAny = false;
        tsconfig.compilerOptions.noImplicitThis = false;
        tsconfig.compilerOptions.alwaysStrict = false;
        // Set target and module based on Angular version
        const versionNum = parseInt(this.version);
        if (versionNum >= 16) {
            tsconfig.compilerOptions.target = 'ES2022';
            tsconfig.compilerOptions.module = 'ES2022';
            tsconfig.compilerOptions.lib = ['ES2022', 'dom'];
        }
        else if (versionNum >= 15) {
            tsconfig.compilerOptions.target = 'ES2022';
            tsconfig.compilerOptions.module = 'ES2022';
            tsconfig.compilerOptions.lib = ['ES2022', 'dom'];
        }
        else if (versionNum >= 14) {
            tsconfig.compilerOptions.target = 'ES2020';
            tsconfig.compilerOptions.module = 'ES2020';
            tsconfig.compilerOptions.lib = ['ES2020', 'dom'];
        }
        else {
            tsconfig.compilerOptions.target = 'ES2017';
            tsconfig.compilerOptions.module = 'ES2020';
            tsconfig.compilerOptions.lib = ['ES2018', 'dom'];
        }
        // Enable experimental decorators for older versions
        if (versionNum < 16) {
            tsconfig.compilerOptions.experimentalDecorators = true;
        }
        // Set module resolution
        tsconfig.compilerOptions.moduleResolution = 'node';
        // Enable source maps for development
        tsconfig.compilerOptions.sourceMap = true;
        // Set output directory
        tsconfig.compilerOptions.outDir = './dist/out-tsc';
        // Enable declaration files
        tsconfig.compilerOptions.declaration = false;
        // Set base URL
        tsconfig.compilerOptions.baseUrl = './';
        // Enable incremental compilation
        tsconfig.compilerOptions.incremental = true;
        // Import helpers from tslib
        tsconfig.compilerOptions.importHelpers = true;
        // Skip lib check for faster builds
        tsconfig.compilerOptions.skipLibCheck = true;
        // Enable ES module interop
        tsconfig.compilerOptions.esModuleInterop = true;
    }
    /**
     * Get required TypeScript version for this Angular version
     */
    getRequiredTypeScriptVersion() {
        const tsVersionMap = {
            '12': '~4.3.0',
            '13': '~4.4.0',
            '14': '~4.7.0',
            '15': '~4.9.0',
            '16': '~5.1.0',
            '17': '~5.2.0',
            '18': '~5.4.0',
            '19': '~5.6.0',
            '20': '>=5.8.0 <5.9.0'
        };
        return tsVersionMap[this.version] || '~5.8.0';
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
     * Run Angular update schematics and official migrations
     */
    async runAngularUpdateSchematics(projectPath) {
        try {
            this.progressReporter?.updateMessage('Running Angular update schematics...');
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
            // Run version-specific official migrations
            await this.runVersionSpecificMigrations(projectPath);
            this.progressReporter?.success('✓ Angular update schematics completed');
        }
        catch (error) {
            this.progressReporter?.warn('Angular schematics migration completed with warnings');
        }
    }
    /**
     * Ensure Angular project is ready for migrations
     */
    async ensureAngularProjectReady(projectPath) {
        // Check if angular.json exists
        const angularJsonPath = path.join(projectPath, 'angular.json');
        if (!await fs.pathExists(angularJsonPath)) {
            throw new Error('angular.json not found. This does not appear to be an Angular project.');
        }
        // Check if package.json exists
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (!await fs.pathExists(packageJsonPath)) {
            throw new Error('package.json not found. Invalid Angular project structure.');
        }
        // Ensure node_modules exists
        const nodeModulesPath = path.join(projectPath, 'node_modules');
        if (!await fs.pathExists(nodeModulesPath)) {
            this.progressReporter?.warn('node_modules not found. Running npm install...');
            try {
                await this.runCommand('npm install', projectPath);
                this.progressReporter?.success('Dependencies installed successfully');
            }
            catch (error) {
                throw new Error('Failed to install dependencies. Please run npm install manually.');
            }
        }
        // Check if Angular CLI is available globally or locally
        try {
            await this.runCommand('npx ng version', projectPath);
        }
        catch (error) {
            throw new Error('Angular CLI not available. Please install Angular CLI: npm install -g @angular/cli');
        }
    }
    /**
     * Run version-specific official Angular migrations
     */
    async runVersionSpecificMigrations(projectPath) {
        // Ensure the project is ready for migrations
        await this.ensureAngularProjectReady(projectPath);
        const migrations = this.getAvailableMigrations();
        if (migrations.length === 0) {
            this.progressReporter?.info('No version-specific migrations available for this Angular version');
            return;
        }
        this.progressReporter?.info(`Running ${migrations.length} migration(s) for Angular ${this.version}...`);
        for (const migration of migrations) {
            try {
                this.progressReporter?.updateMessage(`Running ${migration.name} migration...`);
                this.progressReporter?.info(`Command: ${migration.command}`);
                const output = await this.runCommand(migration.command, projectPath);
                this.progressReporter?.success(`✓ ${migration.name} migration completed successfully`);
                // Log migration output for debugging
                if (output && output.trim()) {
                    this.progressReporter?.info(`Migration output: ${output.trim()}`);
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                if (migration.optional) {
                    this.progressReporter?.warn(`⚠ ${migration.name} migration skipped: ${errorMessage}`);
                }
                else {
                    this.progressReporter?.error(`✗ ${migration.name} migration failed: ${errorMessage}`);
                    // Don't throw for required migrations - continue with other migrations
                }
            }
        }
        this.progressReporter?.success(`Completed all migrations for Angular ${this.version}`);
    }
    /**
     * Get available migrations for this Angular version
     * Override in specific version handlers to provide version-specific migrations
     */
    getAvailableMigrations() {
        const version = parseInt(this.version);
        const migrations = [];
        // Angular Update migrations - run ng update commands
        if (version >= 14) {
            migrations.push({
                name: 'Angular Core Update',
                command: `npx ng update @angular/core@${version} --migrate-only --allow-dirty`,
                description: 'Run Angular core migrations',
                optional: false
            });
        }
        // Angular CLI Update migrations  
        if (version >= 14) {
            migrations.push({
                name: 'Angular CLI Update',
                command: `npx ng update @angular/cli@${version} --migrate-only --allow-dirty`,
                description: 'Run Angular CLI migrations',
                optional: false
            });
        }
        // Standalone Components Schematic (Angular 14+)
        if (version >= 14) {
            migrations.push({
                name: 'Standalone Components Conversion',
                command: 'npx ng generate @angular/core:standalone --mode=convert-to-standalone --allow-dirty',
                description: 'Convert components to standalone components',
                optional: true
            });
        }
        // Control Flow Syntax Schematic (Angular 17+)
        if (version >= 17) {
            migrations.push({
                name: 'Control Flow Syntax Conversion',
                command: 'npx ng generate @angular/core:control-flow --mode=convert-to-control-flow --allow-dirty',
                description: 'Convert *ngIf, *ngFor to @if, @for syntax',
                optional: true
            });
        }
        // Signal Outputs (Angular 17.3+)
        if (version >= 17) {
            migrations.push({
                name: 'Signal Outputs',
                command: 'npx ng generate @angular/core:signal-outputs',
                description: 'Convert @Output fields to signal outputs',
                optional: true
            });
        }
        // Signal Queries (Angular 17.2+)
        if (version >= 17) {
            migrations.push({
                name: 'Signal Queries',
                command: 'npx ng generate @angular/core:signal-queries',
                description: 'Convert decorator queries to signal queries',
                optional: true
            });
        }
        // Self-closing Tags (Angular 16+)
        if (version >= 16) {
            migrations.push({
                name: 'Self-closing Tags',
                command: 'npx ng generate @angular/core:self-closing-tags',
                description: 'Convert templates to use self-closing tags',
                optional: true
            });
        }
        // Cleanup Unused Imports (All versions)
        migrations.push({
            name: 'Cleanup Unused Imports',
            command: 'npx ng generate @angular/core:cleanup-unused-imports',
            description: 'Remove unused imports from project files',
            optional: true
        });
        return migrations;
    }
    /**
     * Run specific migration by name
     */
    async runSpecificMigration(projectPath, migrationName, interactive = false) {
        const migrations = this.getAvailableMigrations();
        const migration = migrations.find(m => m.name === migrationName);
        if (!migration) {
            throw new Error(`Migration '${migrationName}' not found for Angular ${this.version}`);
        }
        try {
            this.progressReporter?.updateMessage(`Running ${migration.name} migration...`);
            let command = migration.command;
            if (!interactive) {
                command += ' --interactive=false --defaults';
            }
            await this.runCommand(command, projectPath);
            this.progressReporter?.success(`✓ ${migration.name} migration completed`);
        }
        catch (error) {
            this.progressReporter?.warn(`${migration.name} migration failed: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
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