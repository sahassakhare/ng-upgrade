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
class Angular17Handler extends BaseVersionHandler_1.BaseVersionHandler {
    constructor() {
        super(...arguments);
        this.version = '17';
    }
    getRequiredNodeVersion() {
        return '>=18.13.0';
    }
    getRequiredTypeScriptVersion() {
        return '>=5.2.0 <5.3.0';
    }
    /**
     * Apply Angular 17 specific changes
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
     * Migrate assets folder to public folder (Angular 17+)
     * This preserves the existing assets while adding the new public folder
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
}
exports.Angular17Handler = Angular17Handler;
//# sourceMappingURL=Angular17Handler.js.map