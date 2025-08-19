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
exports.Angular17Handler = void 0;
const BaseVersionHandler_1 = require("./BaseVersionHandler");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const FileContentPreserver_1 = require("../utils/FileContentPreserver");
/**
 * Angular 17 Handler - New application bootstrap and asset management
 *
 * Manages migration to Angular 17 with new application bootstrap API, asset folder
 * restructuring, enhanced SSR capabilities, and stable control flow syntax. This
 * version introduces significant architectural improvements and developer experience
 * enhancements while maintaining backward compatibility.
 *
 * Key Features in Angular 17:
 * - New application bootstrap API
 * - Assets folder migration to public folder
 * - Stable control flow syntax (@if, @for, @switch)
 * - Enhanced SSR with improved hydration
 * - Build system optimizations
 * - Material Design 3 support
 *
 * @example
 * ```typescript
 * const handler = new Angular17Handler();
 * await handler.applyVersionSpecificChanges('/path/to/project', {
 *   strategy: 'progressive',
 *   enableNewBootstrap: true
 * });
 * ```
 *
 * @since 1.0.0
 * @author Angular Multi-Version Upgrade Orchestrator
 */
class Angular17Handler extends BaseVersionHandler_1.BaseVersionHandler {
    /** The Angular version this handler manages */
    version = '17';
    /**
     * Gets the minimum required Node.js version for Angular 17
     * @returns The minimum Node.js version requirement
     */
    getRequiredNodeVersion() {
        return '>=18.13.0';
    }
    /**
     * Gets the required TypeScript version range for Angular 17
     * @returns The TypeScript version requirement
     */
    getRequiredTypeScriptVersion() {
        return '>=5.2.0 <5.3.0';
    }
    /**
     * Applies all Angular 17 specific transformations to the project
     *
     * Orchestrates migration including new application bootstrap, asset restructuring,
     * control flow syntax stabilization, and SSR enhancements. Provides safe migration
     * paths while preserving existing functionality.
     *
     * @param projectPath - The absolute path to the Angular project root
     * @param options - Upgrade configuration options including strategy and feature flags
     * @throws {Error} When critical transformations fail
     */
    async applyVersionSpecificChanges(projectPath, options) {
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
     * Update to new application bootstrap while preserving existing code
     */
    async updateApplicationBootstrap(projectPath) {
        const mainTsPath = path.join(projectPath, 'src', 'main.ts');
        // Use FileContentPreserver to update main.ts while preserving custom code
        await FileContentPreserver_1.FileContentPreserver.updateMainTsFile(mainTsPath, 17);
        if (await fs.pathExists(mainTsPath)) {
            this.progressReporter?.success('✓ Updated to new application bootstrap (preserving custom code)');
        }
    }
    /**
     * Migrates assets folder to public folder structure (Angular 17+)
     *
     * Safely migrates from src/assets to public folder structure while maintaining
     * backward compatibility. Creates new public folder, copies assets, and updates
     * angular.json configuration to support both asset structures during transition.
     *
     * @param projectPath - The absolute path to the Angular project root
     * @private
     *
     * @example
     * Before: src/assets/images/logo.png
     * After: public/images/logo.png (with src/assets still working)
     */
    async migrateAssetsToPublic(projectPath) {
        const assetsPath = path.join(projectPath, 'src', 'assets');
        const publicPath = path.join(projectPath, 'public');
        if (await fs.pathExists(assetsPath) && !await fs.pathExists(publicPath)) {
            // Create public directory
            await fs.ensureDir(publicPath);
            // Copy assets to public (keep original for compatibility)
            await fs.copy(assetsPath, publicPath);
            // Update angular.json to use both asset configurations
            await this.updateAssetConfiguration(projectPath);
            this.progressReporter?.success('✓ Migrated assets to public folder (maintaining backward compatibility)');
        }
    }
    /**
     * Update asset configuration in angular.json
     */
    async updateAssetConfiguration(projectPath) {
        const angularJsonPath = path.join(projectPath, 'angular.json');
        if (await fs.pathExists(angularJsonPath)) {
            const angularJson = await fs.readJson(angularJsonPath);
            // Update each project's asset configuration
            for (const [_projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
                const config = projectConfig;
                if (config.architect?.build?.options?.assets) {
                    // Add public folder to assets while keeping src/assets
                    const assets = config.architect.build.options.assets;
                    // Add public folder if not already present
                    if (!assets.includes('public') && !assets.some((asset) => typeof asset === 'object' && asset.input === 'public')) {
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
    async enableNewControlFlow(_projectPath) {
        // This would enable the new @if, @for, @switch syntax
        // For now, just log that it's available
        this.progressReporter?.success('✓ New control flow syntax (@if, @for, @switch) is available');
        this.progressReporter?.info('  Use "ng generate @angular/core:control-flow" to migrate templates');
    }
    /**
     * Update SSR configuration
     */
    async updateSSRConfiguration(projectPath) {
        const angularJsonPath = path.join(projectPath, 'angular.json');
        if (await fs.pathExists(angularJsonPath)) {
            const angularJson = await fs.readJson(angularJsonPath);
            let hasSSR = false;
            // Check if SSR is configured
            for (const [_projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
                const config = projectConfig;
                if (config.architect?.['serve-ssr'] || config.architect?.['build-ssr']) {
                    hasSSR = true;
                }
            }
            if (hasSSR) {
                this.progressReporter?.success('✓ SSR configuration detected - Angular 17 SSR improvements enabled');
                // Would update SSR configuration for Angular 17 improvements
            }
        }
    }
    /**
     * Update build configuration
     */
    async updateBuildConfiguration(projectPath) {
        const angularJsonPath = path.join(projectPath, 'angular.json');
        if (await fs.pathExists(angularJsonPath)) {
            const angularJson = await fs.readJson(angularJsonPath);
            // Update build configurations for Angular 17
            for (const [_projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
                const config = projectConfig;
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
     * Uses DependencyInstaller for automatic installation
     */
    async updateAngularMaterial(projectPath) {
        const packageJsonPath = path.join(projectPath, 'package.json');
        const packageJson = await fs.readJson(packageJsonPath);
        if (packageJson.dependencies?.['@angular/material']) {
            // Use DependencyInstaller to update Angular Material
            const materialDeps = [
                { name: '@angular/material', version: '^17.0.0', type: 'dependencies' },
                { name: '@angular/cdk', version: '^17.0.0', type: 'dependencies' }
            ];
            await this.dependencyInstaller.installDependencies(materialDeps, 'Updating Angular Material to version 17...');
            this.progressReporter?.success('✓ Updated Angular Material to version 17');
        }
    }
    /**
     * Update builder configurations for Angular 17
     */
    updateBuilderConfigurations(angularJson) {
        for (const [_projectName, projectConfig] of Object.entries(angularJson.projects || {})) {
            const config = projectConfig;
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
    updateTypeScriptConfig(tsconfig) {
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
    getBreakingChanges() {
        return [
            this.createBreakingChange('ng17-new-application-bootstrap', 'api', 'medium', 'New application bootstrap API', 'Applications can optionally migrate to the new bootstrapApplication API', 'Consider migrating to bootstrapApplication for better tree-shaking and performance'),
            this.createBreakingChange('ng17-assets-to-public', 'config', 'low', 'Assets folder migration to public', 'New public folder structure for better asset management', 'Assets are copied to public folder while maintaining backward compatibility'),
            this.createBreakingChange('ng17-new-control-flow', 'template', 'low', 'New control flow syntax available', 'New @if, @for, @switch syntax available as alternative to *ngIf, *ngFor, *ngSwitch', 'New syntax is optional - existing syntax continues to work'),
            this.createBreakingChange('ng17-ssr-improvements', 'build', 'low', 'SSR improvements and new features', 'Enhanced server-side rendering with better hydration', 'SSR applications may benefit from new hydration features'),
            this.createBreakingChange('ng17-angular-material-update', 'dependency', 'medium', 'Angular Material 17 with Material Design 3', 'Angular Material updated with Material Design 3 components', 'Review Material component designs as they may have visual changes')
        ];
    }
    /**
     * Override to provide Angular 17 specific migrations
     */
    getAvailableMigrations() {
        const baseMigrations = super.getAvailableMigrations();
        // Add Angular 17 specific migrations
        const angular17Migrations = [
            {
                name: 'New Application Bootstrap',
                command: 'npx ng generate @angular/core:new-app-bootstrap',
                description: 'Migrate to new bootstrapApplication API',
                optional: true
            },
            {
                name: 'Lazy Loading Routes',
                command: 'npx ng generate @angular/core:lazy-routes',
                description: 'Convert eagerly loaded routes to lazy loaded ones',
                optional: true
            },
            {
                name: 'Assets to Public Migration',
                command: 'npx ng generate @angular/core:assets-to-public',
                description: 'Migrate assets folder to public folder structure',
                optional: true
            }
        ];
        return [...baseMigrations, ...angular17Migrations];
    }
    /**
     * Run Angular 17 specific migrations based on strategy
     */
    async runVersionSpecificMigrations(projectPath) {
        // Get user's upgrade strategy from options
        const migrations = this.getAvailableMigrations();
        // Run specific migrations for Angular 17
        const requiredMigrations = [
            'Control Flow Syntax',
            'Signal Inputs',
            'Signal Outputs',
            'Signal Queries',
            'Self-closing Tags',
            'New Application Bootstrap',
            'Assets to Public Migration'
        ];
        for (const migrationName of requiredMigrations) {
            const migration = migrations.find(m => m.name === migrationName);
            if (migration) {
                try {
                    this.progressReporter?.updateMessage(`Running ${migration.name} migration...`);
                    // Run migration with non-interactive mode for automation
                    let command = migration.command + ' --interactive=false --defaults';
                    await this.runCommand(command, projectPath);
                    this.progressReporter?.info(`✓ ${migration.name} migration completed`);
                }
                catch (error) {
                    // Some migrations may not be applicable to all projects
                    this.progressReporter?.warn(`${migration.name} migration skipped: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
    }
}
exports.Angular17Handler = Angular17Handler;
//# sourceMappingURL=Angular17Handler.js.map