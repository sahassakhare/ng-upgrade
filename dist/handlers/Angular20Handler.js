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
exports.Angular20Handler = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const BaseVersionHandler_1 = require("./BaseVersionHandler");
const FileContentPreserver_1 = require("../utils/FileContentPreserver");
/**
 * Angular 20 Handler - Latest Angular version with cutting-edge features
 *
 * Key Features in Angular 20:
 * - Stable incremental hydration for SSR applications
 * - Advanced signal stabilization and optimization
 * - Enhanced zoneless change detection
 * - Improved build performance and tree-shaking
 * - Advanced SSR streaming and edge-side rendering
 * - Material 3 design system maturation
 * - Enhanced developer experience and debugging tools
 */
class Angular20Handler extends BaseVersionHandler_1.BaseVersionHandler {
    version = '20';
    getRequiredNodeVersion() {
        return '>=20.11.1'; // Angular 20 requires Node 20.11.1+
    }
    getRequiredTypeScriptVersion() {
        return '>=5.6.0 <5.7.0';
    }
    /**
     * Get Angular 20 dependencies with latest versions
     */
    getDependencyUpdates() {
        return [
            // Core Angular packages
            { name: '@angular/animations', version: '^20.0.0', type: 'dependencies' },
            { name: '@angular/common', version: '^20.0.0', type: 'dependencies' },
            { name: '@angular/compiler', version: '^20.0.0', type: 'dependencies' },
            { name: '@angular/core', version: '^20.0.0', type: 'dependencies' },
            { name: '@angular/forms', version: '^20.0.0', type: 'dependencies' },
            { name: '@angular/platform-browser', version: '^20.0.0', type: 'dependencies' },
            { name: '@angular/platform-browser-dynamic', version: '^20.0.0', type: 'dependencies' },
            { name: '@angular/router', version: '^20.0.0', type: 'dependencies' },
            // Angular CLI and dev dependencies
            { name: '@angular/cli', version: '^20.0.0', type: 'devDependencies' },
            { name: '@angular/compiler-cli', version: '^20.0.0', type: 'devDependencies' },
            { name: '@angular-devkit/build-angular', version: '^20.0.0', type: 'devDependencies' },
            // SSR packages (if present)
            { name: '@angular/ssr', version: '^20.0.0', type: 'dependencies' },
            { name: '@angular/platform-server', version: '^20.0.0', type: 'dependencies' },
            // TypeScript and supporting packages - Angular 20 requires TypeScript >=5.8.0 <5.9.0
            { name: 'typescript', version: '>=5.8.0 <5.9.0', type: 'devDependencies' },
            { name: 'zone.js', version: '~0.15.0', type: 'dependencies' },
            { name: 'rxjs', version: '~7.8.0', type: 'dependencies' },
            // Angular Material (if present)
            { name: '@angular/material', version: '^20.0.0', type: 'dependencies' },
            { name: '@angular/cdk', version: '^20.0.0', type: 'dependencies' },
            // Testing packages
            { name: '@angular/testing', version: '^20.0.0', type: 'devDependencies' },
            { name: 'jasmine-core', version: '~5.4.0', type: 'devDependencies' },
            { name: 'karma', version: '~6.4.0', type: 'devDependencies' },
            { name: 'karma-chrome-launcher', version: '~3.2.0', type: 'devDependencies' },
            { name: 'karma-coverage', version: '~2.2.0', type: 'devDependencies' },
            { name: 'karma-jasmine', version: '~5.1.0', type: 'devDependencies' },
            { name: 'karma-jasmine-html-reporter', version: '~2.1.0', type: 'devDependencies' }
        ];
    }
    /**
     * Apply Angular 20 specific changes and optimizations
     */
    async applyVersionSpecificChanges(projectPath, options) {
        this.progressReporter?.updateMessage('Applying Angular 20 cutting-edge features...');
        // 1. Update build configurations for Angular 20 optimizations
        await this.updateBuildConfigurations(projectPath);
        // 2. Configure incremental hydration for SSR applications
        await this.configureIncrementalHydration(projectPath);
        // 3. Setup advanced signal optimization
        await this.setupSignalOptimizations(projectPath);
        // 4. Configure zoneless change detection (opt-in)
        if (options.enableZonelessChangeDetection) {
            await this.configureZonelessDetection(projectPath);
        }
        // 5. Update main.ts for Angular 20 bootstrap optimizations
        await this.updateMainTsForAngular20(projectPath);
        // 6. Configure advanced SSR features
        await this.configureAdvancedSSR(projectPath);
        // 7. Update TypeScript configuration for Angular 20
        await this.updateTypeScriptConfigForAngular20(projectPath);
        // 8. Configure Material 3 design system (if Material is present)
        await this.configureMaterial3DesignSystem(projectPath);
        // 9. Setup enhanced developer tools and debugging
        await this.setupEnhancedDevTools(projectPath);
        // 10. Configure advanced build optimizations
        await this.configureAdvancedBuildOptimizations(projectPath);
        this.progressReporter?.success('✓ Angular 20 cutting-edge features configured successfully');
    }
    /**
     * Get comprehensive breaking changes for Angular 20
     */
    getBreakingChanges() {
        return [
            // Node.js version requirement
            this.createBreakingChange('ng20-node-version', 'dependency', 'high', 'Node.js 20.11.1+ required', 'Angular 20 requires Node.js 20.11.1 or higher', 'Update Node.js to version 20.11.1 or higher'),
            // TypeScript version update
            this.createBreakingChange('ng20-typescript-version', 'dependency', 'medium', 'TypeScript 5.6+ required', 'Angular 20 requires TypeScript 5.6.0 or higher', 'Update TypeScript to version 5.6.0'),
            // Incremental hydration default changes
            this.createBreakingChange('ng20-incremental-hydration', 'api', 'low', 'Incremental hydration stabilized', 'Incremental hydration is now stable and recommended for SSR applications', 'Opt-in feature - existing SSR applications continue to work unchanged'),
            // Signal optimization changes
            this.createBreakingChange('ng20-signal-optimizations', 'api', 'low', 'Enhanced signal performance', 'Signal-based applications get automatic performance optimizations', 'Existing applications benefit automatically - no action required'),
            // Zoneless change detection improvements
            this.createBreakingChange('ng20-zoneless-improvements', 'api', 'low', 'Enhanced zoneless change detection', 'Zoneless change detection is more stable and performant', 'Opt-in feature - Zone.js applications continue to work unchanged'),
            // Build system optimizations
            this.createBreakingChange('ng20-build-optimizations', 'build', 'low', 'Advanced build optimizations', 'Enhanced tree-shaking and bundle optimization', 'Applications may see smaller bundle sizes automatically'),
            // Developer experience improvements
            this.createBreakingChange('ng20-dev-experience', 'config', 'low', 'Enhanced developer tools', 'Improved debugging and development experience', 'New tools available - existing workflows continue to work')
        ];
    }
    // Private implementation methods
    /**
     * Update build configurations for Angular 20 optimizations
     */
    async updateBuildConfigurations(projectPath) {
        const angularJsonPath = path.join(projectPath, 'angular.json');
        if (await fs.pathExists(angularJsonPath)) {
            try {
                const angularJson = await fs.readJson(angularJsonPath);
                // Update build configurations for each project
                for (const projectName in angularJson.projects) {
                    const project = angularJson.projects[projectName];
                    if (project.architect?.build?.options) {
                        // Enable advanced optimizations
                        project.architect.build.options.optimization = {
                            scripts: true,
                            styles: true,
                            fonts: true
                        };
                        // Enable advanced bundle optimization
                        project.architect.build.options.bundleOptimization = true;
                        // Enable source map optimization
                        project.architect.build.options.sourceMap = {
                            scripts: true,
                            styles: true,
                            vendor: false,
                            hidden: true
                        };
                        // Configure advanced build options
                        project.architect.build.options.buildOptimizer = true;
                        project.architect.build.options.vendorChunk = true;
                        project.architect.build.options.commonChunk = true;
                    }
                }
                await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
                this.progressReporter?.info('✓ Updated build configurations for Angular 20 optimizations');
            }
            catch (error) {
                this.progressReporter?.warn(`Could not update angular.json: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    /**
     * Configure incremental hydration for SSR applications
     */
    async configureIncrementalHydration(projectPath) {
        const appConfigPath = path.join(projectPath, 'src/app/app.config.ts');
        if (await fs.pathExists(appConfigPath)) {
            try {
                let content = await fs.readFile(appConfigPath, 'utf-8');
                // Add incremental hydration import if not present
                if (!content.includes('provideClientHydration')) {
                    content = content.replace(/import { ApplicationConfig } from '@angular\/core';/, `import { ApplicationConfig } from '@angular/core';
import { provideClientHydration, withIncrementalHydration } from '@angular/platform-browser';`);
                    // Add incremental hydration provider
                    content = content.replace(/providers: \[([\s\S]*?)\]/, `providers: [
    provideClientHydration(withIncrementalHydration()),
    $1
  ]`);
                    await fs.writeFile(appConfigPath, content);
                    this.progressReporter?.info('✓ Configured incremental hydration for SSR');
                }
            }
            catch (error) {
                this.progressReporter?.warn(`Could not configure incremental hydration: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    /**
     * Setup advanced signal optimizations
     */
    async setupSignalOptimizations(projectPath) {
        const tsConfigPath = path.join(projectPath, 'tsconfig.json');
        if (await fs.pathExists(tsConfigPath)) {
            try {
                const tsConfig = await fs.readJson(tsConfigPath);
                // Enable signal optimization compiler options
                if (!tsConfig.compilerOptions) {
                    tsConfig.compilerOptions = {};
                }
                tsConfig.compilerOptions.experimentalDecorators = true;
                tsConfig.compilerOptions.useDefineForClassFields = false;
                // Enable Angular 20 signal optimizations
                if (!tsConfig.angularCompilerOptions) {
                    tsConfig.angularCompilerOptions = {};
                }
                tsConfig.angularCompilerOptions.enableSignalOptimizations = true;
                tsConfig.angularCompilerOptions.optimizeFor = 'signals';
                await fs.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
                this.progressReporter?.info('✓ Configured advanced signal optimizations');
            }
            catch (error) {
                this.progressReporter?.warn(`Could not setup signal optimizations: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    /**
     * Configure zoneless change detection (opt-in)
     */
    async configureZonelessDetection(projectPath) {
        const appConfigPath = path.join(projectPath, 'src/app/app.config.ts');
        if (await fs.pathExists(appConfigPath)) {
            try {
                let content = await fs.readFile(appConfigPath, 'utf-8');
                // Add zoneless change detection import
                if (!content.includes('provideExperimentalZonelessChangeDetection')) {
                    content = content.replace(/import { ApplicationConfig } from '@angular\/core';/, `import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';`);
                    // Add zoneless change detection provider
                    content = content.replace(/providers: \[([\s\S]*?)\]/, `providers: [
    provideExperimentalZonelessChangeDetection(),
    $1
  ]`);
                    await fs.writeFile(appConfigPath, content);
                    this.progressReporter?.info('✓ Configured zoneless change detection (experimental)');
                }
            }
            catch (error) {
                this.progressReporter?.warn(`Could not configure zoneless detection: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    /**
     * Update main.ts for Angular 20 optimizations
     */
    async updateMainTsForAngular20(projectPath) {
        const mainTsPath = path.join(projectPath, 'src/main.ts');
        if (await fs.pathExists(mainTsPath)) {
            await FileContentPreserver_1.FileContentPreserver.updateMainTsFile(mainTsPath, 20);
            this.progressReporter?.info('✓ Updated main.ts for Angular 20 optimizations');
        }
    }
    /**
     * Configure advanced SSR features
     */
    async configureAdvancedSSR(projectPath) {
        const serverTsPath = path.join(projectPath, 'src/main.server.ts');
        if (await fs.pathExists(serverTsPath)) {
            try {
                let content = await fs.readFile(serverTsPath, 'utf-8');
                // Add advanced SSR optimizations
                if (!content.includes('withSSROptimizations')) {
                    content = content.replace(/import { bootstrapApplication } from '@angular\/platform-browser';/, `import { bootstrapApplication } from '@angular/platform-browser';
import { withSSROptimizations, withStreamingRendering } from '@angular/ssr';`);
                    // Configure SSR optimizations
                    content = content.replace(/bootstrapApplication\(([^,]+),\s*([^)]+)\)/, `bootstrapApplication($1, {
  ...$2,
  providers: [
    ...$2.providers,
    withSSROptimizations(),
    withStreamingRendering()
  ]
})`);
                    await fs.writeFile(serverTsPath, content);
                    this.progressReporter?.info('✓ Configured advanced SSR features');
                }
            }
            catch (error) {
                this.progressReporter?.warn(`Could not configure advanced SSR: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    /**
     * Update TypeScript configuration for Angular 20
     */
    async updateTypeScriptConfigForAngular20(projectPath) {
        const tsConfigPath = path.join(projectPath, 'tsconfig.json');
        if (await fs.pathExists(tsConfigPath)) {
            try {
                const tsConfig = await fs.readJson(tsConfigPath);
                // Update TypeScript compiler options for Angular 20
                if (!tsConfig.compilerOptions) {
                    tsConfig.compilerOptions = {};
                }
                // Enable latest TypeScript features
                tsConfig.compilerOptions.target = 'ES2022';
                tsConfig.compilerOptions.lib = ['ES2022', 'DOM'];
                tsConfig.compilerOptions.module = 'ES2022';
                tsConfig.compilerOptions.moduleResolution = 'bundler';
                // Enable strict mode optimizations
                tsConfig.compilerOptions.strict = true;
                tsConfig.compilerOptions.strictNullChecks = true;
                tsConfig.compilerOptions.strictFunctionTypes = true;
                await fs.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
                this.progressReporter?.info('✓ Updated TypeScript configuration for Angular 20');
            }
            catch (error) {
                this.progressReporter?.warn(`Could not update TypeScript config: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    /**
     * Configure Material 3 design system (if Material is present)
     */
    async configureMaterial3DesignSystem(projectPath) {
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
            try {
                const packageJson = await fs.readJson(packageJsonPath);
                // Check if Angular Material is present
                if (packageJson.dependencies?.['@angular/material']) {
                    const stylesPath = path.join(projectPath, 'src/styles.css');
                    if (await fs.pathExists(stylesPath)) {
                        let styles = await fs.readFile(stylesPath, 'utf-8');
                        // Add Material 3 theme import if not present
                        if (!styles.includes('@angular/material/theming')) {
                            styles = `/* Angular Material 3 Design System */
@import '@angular/material/theming';

/* Include Material 3 theme */
@include mat.core();

/* Define Material 3 theme */
$primary: mat.define-palette(mat.$azure-palette);
$accent: mat.define-palette(mat.$blue-palette);
$warn: mat.define-palette(mat.$red-palette);

$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: $primary,
    tertiary: $accent,
  ),
  typography: (
    brand-family: 'Roboto, sans-serif',
    plain-family: 'Roboto, sans-serif',
  ),
  density: (
    scale: 0,
  )
));

/* Apply Material 3 theme */
@include mat.all-component-themes($theme);

${styles}`;
                            await fs.writeFile(stylesPath, styles);
                            this.progressReporter?.info('✓ Configured Material 3 design system');
                        }
                    }
                }
            }
            catch (error) {
                this.progressReporter?.warn(`Could not configure Material 3: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    /**
     * Setup enhanced developer tools and debugging
     */
    async setupEnhancedDevTools(projectPath) {
        const angularJsonPath = path.join(projectPath, 'angular.json');
        if (await fs.pathExists(angularJsonPath)) {
            try {
                const angularJson = await fs.readJson(angularJsonPath);
                // Update serve configurations for enhanced dev experience
                for (const projectName in angularJson.projects) {
                    const project = angularJson.projects[projectName];
                    if (project.architect?.serve?.options) {
                        // Enable advanced dev server features
                        project.architect.serve.options.hmr = true;
                        project.architect.serve.options.liveReload = true;
                        project.architect.serve.options.watch = true;
                        // Enable enhanced debugging
                        project.architect.serve.options.verbose = true;
                        project.architect.serve.options.progress = true;
                        // Configure source maps for development
                        project.architect.serve.options.sourceMap = {
                            scripts: true,
                            styles: true,
                            vendor: true
                        };
                    }
                }
                await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
                this.progressReporter?.info('✓ Configured enhanced developer tools');
            }
            catch (error) {
                this.progressReporter?.warn(`Could not setup enhanced dev tools: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    /**
     * Configure advanced build optimizations
     */
    async configureAdvancedBuildOptimizations(projectPath) {
        const angularJsonPath = path.join(projectPath, 'angular.json');
        if (await fs.pathExists(angularJsonPath)) {
            try {
                const angularJson = await fs.readJson(angularJsonPath);
                // Configure advanced build optimizations
                for (const projectName in angularJson.projects) {
                    const project = angularJson.projects[projectName];
                    if (project.architect?.build?.configurations?.production) {
                        const prodConfig = project.architect.build.configurations.production;
                        // Enable advanced tree-shaking
                        prodConfig.optimization = {
                            scripts: true,
                            styles: {
                                minify: true,
                                inlineCritical: true
                            },
                            fonts: true
                        };
                        // Enable advanced bundling
                        prodConfig.outputHashing = 'all';
                        prodConfig.namedChunks = false;
                        prodConfig.aot = true;
                        prodConfig.buildOptimizer = true;
                        // Configure advanced file replacements
                        if (!prodConfig.fileReplacements) {
                            prodConfig.fileReplacements = [];
                        }
                        // Enable service worker (if configured)
                        if (await fs.pathExists(path.join(projectPath, 'ngsw-config.json'))) {
                            prodConfig.serviceWorker = true;
                            prodConfig.ngswConfigPath = 'ngsw-config.json';
                        }
                    }
                }
                await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
                this.progressReporter?.info('✓ Configured advanced build optimizations');
            }
            catch (error) {
                this.progressReporter?.warn(`Could not configure build optimizations: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
}
exports.Angular20Handler = Angular20Handler;
//# sourceMappingURL=Angular20Handler.js.map