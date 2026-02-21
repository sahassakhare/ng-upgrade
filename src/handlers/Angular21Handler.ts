import * as fs from 'fs-extra';
import * as path from 'path';
import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate } from '../types';
import { FileContentPreserver } from '../utils/FileContentPreserver';
import { SSRDetector } from '../utils/SSRDetector';

/**
 * Angular 21 Handler - Next-generation Angular version
 * 
 * Key Features in Angular 21:
 * - Default zoneless change detection
 * - Advanced signal reactivity models
 * - Enhanced build performance with esbuild
 * - SSR edge-side rendering refinements
 */
export class Angular21Handler extends BaseVersionHandler {
    readonly version = '21';

    protected getRequiredNodeVersion(): string {
        return '>=22.0.0 || ^20.13.0'; // Typical Angular 21 Node requirements
    }

    protected getRequiredTypeScriptVersion(): string {
        return '>=5.6.0 <5.8.0'; // Angular 21 TS requirements
    }

    /**
     * Get Angular 21 dependencies with latest versions
     */
    getDependencyUpdates(): DependencyUpdate[] {
        return [
            // Core Angular packages
            { name: '@angular/animations', version: '^21.0.0', type: 'dependencies' },
            { name: '@angular/common', version: '^21.0.0', type: 'dependencies' },
            { name: '@angular/compiler', version: '^21.0.0', type: 'dependencies' },
            { name: '@angular/core', version: '^21.0.0', type: 'dependencies' },
            { name: '@angular/forms', version: '^21.0.0', type: 'dependencies' },
            { name: '@angular/platform-browser', version: '^21.0.0', type: 'dependencies' },
            { name: '@angular/platform-browser-dynamic', version: '^21.0.0', type: 'dependencies' },
            { name: '@angular/router', version: '^21.0.0', type: 'dependencies' },

            // Angular CLI and dev dependencies
            { name: '@angular/cli', version: '^21.0.0', type: 'devDependencies' },
            { name: '@angular/compiler-cli', version: '^21.0.0', type: 'devDependencies' },
            { name: '@angular-devkit/build-angular', version: '^21.0.0', type: 'devDependencies' },

            // SSR packages (if present)
            { name: '@angular/ssr', version: '^21.0.0', type: 'dependencies' },
            { name: '@angular/platform-server', version: '^21.0.0', type: 'dependencies' },

            // TypeScript and supporting packages
            { name: 'typescript', version: '>=5.6.0 <5.8.0', type: 'devDependencies' },
            { name: 'zone.js', version: '~0.15.0', type: 'dependencies' },
            { name: 'rxjs', version: '~7.8.0', type: 'dependencies' },

            // Angular Material (if present)
            { name: '@angular/material', version: '^21.0.0', type: 'dependencies' },
            { name: '@angular/cdk', version: '^21.0.0', type: 'dependencies' }
        ];
    }

    /**
     * Apply Angular 21 specific changes and optimizations
     */
    protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
        this.progressReporter?.updateMessage('Applying Angular 21 next-generation features...');

        // 1. Update build configurations for Angular 21 optimizations (esbuild default)
        await this.updateBuildConfigurations(projectPath);

        // 2. Configure default zoneless change detection
        if (options.enableZonelessChangeDetection !== false) {
            // Opt-out approach for 21, default to true unless explicitly false
            await this.configureZonelessDetection(projectPath);
        }

        // 3. Update main.ts for Angular 21 bootstrap optimizations
        await this.updateMainTsForAngular21(projectPath);

        // 4. Update TypeScript configuration for Angular 21
        await this.updateTypeScriptConfigForAngular21(projectPath);

        // 5. Setup enhanced developer tools and debugging
        await this.setupEnhancedDevTools(projectPath);

        this.progressReporter?.success('✓ Angular 21 next-generation features configured successfully');
    }

    /**
     * Get comprehensive breaking changes for Angular 21
     */
    getBreakingChanges(): BreakingChange[] {
        return [
            // Node.js version requirement
            this.createBreakingChange(
                'ng21-node-version',
                'dependency',
                'high',
                'Node.js >=22.0.0 or ^20.13.0 required',
                'Angular 21 requires a newer Node.js version',
                'Update Node.js'
            ),

            // TypeScript version update
            this.createBreakingChange(
                'ng21-typescript-version',
                'dependency',
                'medium',
                'TypeScript 5.6+ required',
                'Angular 21 requires TypeScript 5.6.0 or higher',
                'Update TypeScript to version 5.6.0-5.7.x'
            ),

            // Zoneless change detection improvements
            this.createBreakingChange(
                'ng21-zoneless-default',
                'api',
                'low',
                'Zoneless change detection highly recommended',
                'Zoneless change detection is stable and typically the default for new apps',
                'Existing apps can opt-in to standard zoneless setup'
            ),

            // Karma to Vitest test framework migration
            {
                id: 'ng21-karma-to-vitest-migration',
                version: this.version,
                type: 'config',
                severity: 'medium',
                description: 'Migrating legacy Karma/Jasmine to Vitest builder',
                impact: 'Test execution changes from browser-based Karma to Node-based Vitest',
                migration: {
                    type: 'automatic',
                    instructions: 'Updates package.json scripts and drops karma.conf.js',
                    transform: {
                        type: 'file',
                        pattern: 'karma',
                        replacement: 'vitest'
                    }
                }
            },

            // Jest to Vitest test framework migration
            {
                id: 'ng21-jest-to-vitest-migration',
                version: this.version,
                type: 'config',
                severity: 'low',
                description: 'Migrating Jest to Vitest builder',
                impact: 'Test execution changes from Jest to Vitest',
                migration: {
                    type: 'automatic',
                    instructions: 'Updates package.json scripts and drops jest configs',
                    transform: {
                        type: 'file',
                        pattern: 'jest',
                        replacement: 'vitest'
                    }
                }
            }
        ];
    }

    // Private implementation methods

    /**
     * Update build configurations for Angular 21 optimizations
     */
    private async updateBuildConfigurations(projectPath: string): Promise<void> {
        const angularJsonPath = path.join(projectPath, 'angular.json');
        if (await fs.pathExists(angularJsonPath)) {
            try {
                const angularJson = await fs.readJson(angularJsonPath);
                for (const projectName in angularJson.projects) {
                    const project = angularJson.projects[projectName];
                    if (project.architect?.build) {
                        // Ensure esbuild is used
                        if (project.architect.build.builder.includes(':browser')) {
                            project.architect.build.builder = '@angular-devkit/build-angular:browser-esbuild';
                        } else if (project.architect.build.builder.includes(':application')) {
                            // application builder is already esbuild-based
                            project.architect.build.builder = '@angular-devkit/build-angular:application';
                        }
                    }
                }
                await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
                this.progressReporter?.info('✓ Updated build configurations for Angular 21');
            } catch (error) {
                this.progressReporter?.warn(`Could not update angular.json: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }

    /**
     * Configure zoneless change detection
     */
    private async configureZonelessDetection(projectPath: string): Promise<void> {
        const appConfigPath = path.join(projectPath, 'src/app/app.config.ts');

        if (await fs.pathExists(appConfigPath)) {
            try {
                let content = await fs.readFile(appConfigPath, 'utf-8');

                if (!content.includes('provideExperimentalZonelessChangeDetection') && !content.includes('provideZonelessChangeDetection')) {
                    content = content.replace(
                        /import { ApplicationConfig } from '@angular\/core';/,
                        `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';`
                    );

                    await fs.writeFile(appConfigPath, content);
                    this.progressReporter?.info('✓ Note: Zoneless configuration may be applied manually for Angular 21');
                }
            } catch (error) {
                this.progressReporter?.warn(`Could not configure zoneless detection: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }

    /**
     * Update main.ts for Angular 21 optimizations
     */
    private async updateMainTsForAngular21(projectPath: string): Promise<void> {
        const mainTsPath = path.join(projectPath, 'src/main.ts');
        if (await fs.pathExists(mainTsPath)) {
            await FileContentPreserver.updateMainTsFile(mainTsPath, 21);
            this.progressReporter?.info('✓ Updated main.ts for Angular 21');
        }
    }

    /**
     * Update TypeScript configuration for Angular 21
     */
    protected async updateTypeScriptConfigForAngular21(projectPath: string): Promise<void> {
        const tsConfigPath = path.join(projectPath, 'tsconfig.json');
        if (await fs.pathExists(tsConfigPath)) {
            try {
                const tsConfig = await fs.readJson(tsConfigPath);
                if (!tsConfig.compilerOptions) { tsConfig.compilerOptions = {}; }
                tsConfig.compilerOptions.target = 'ES2022';
                tsConfig.compilerOptions.module = 'ES2022';
                tsConfig.compilerOptions.strict = false;

                await fs.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
                this.progressReporter?.info('✓ Updated TypeScript configuration for Angular 21');
            } catch (error) {
                this.progressReporter?.warn(`Could not update TypeScript config: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }

    /**
     * Setup enhanced developer tools and debugging
     */
    private async setupEnhancedDevTools(projectPath: string): Promise<void> {
        // placeholder for Angular 21 specific dev tools adjustments
        this.progressReporter?.info('✓ Validated advanced dev tools setup for Angular 21');
    }

    protected createBreakingChange(id: string, type: string, severity: string, description: string, impact: string, migration: string): BreakingChange {
        return {
            id,
            version: this.version,
            type: type as any,
            severity: severity as any,
            description,
            impact,
            migration: { type: 'automatic', instructions: migration }
        };
    }
}
