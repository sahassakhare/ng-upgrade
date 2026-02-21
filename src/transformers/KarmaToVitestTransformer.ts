import * as fs from 'fs-extra';
import * as path from 'path';
import { TransformationHandler } from '../core/VersionHandlerRegistry';
import { BreakingChange } from '../types';

export class KarmaToVitestTransformer implements TransformationHandler {
    readonly type = 'config';

    async apply(projectPath: string, change: BreakingChange): Promise<void> {
        console.log(`Applying test migration transformation: ${change.description}`);

        // 1. Remove Karma & Jasmine Dependencies
        await this.removeKarmaDependencies(projectPath);

        // 2. Add Vitest Dependencies
        await this.addVitestDependencies(projectPath);

        // 3. Update angular.json 
        await this.updateAngularJson(projectPath);

        // 4. Generate necessary files (vitest.config.ts, test-setup.ts)
        await this.generateVitestConfig(projectPath);

        // 5. Remove Karma specific artifacts (karma.conf.js, test.ts)
        await this.removeKarmaArtifacts(projectPath);

        // 6. Update TSConfig types
        await this.updateTsConfigs(projectPath);

        // 7. Update Test Files Regex (Jasmine -> Vitest)
        await this.updateTestFiles(projectPath);
    }

    private async removeKarmaDependencies(projectPath: string): Promise<void> {
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (!(await fs.pathExists(packageJsonPath))) return;

        try {
            const packageJson = await fs.readJson(packageJsonPath);
            const devDeps: Record<string, string> = packageJson.devDependencies || {};

            const karmaDeps = [
                'karma',
                'karma-chrome-launcher',
                'karma-coverage',
                'karma-jasmine',
                'karma-jasmine-html-reporter',
                'jasmine-core',
                '@types/jasmine'
            ];

            let removed = false;
            for (const dep of karmaDeps) {
                if (devDeps[dep]) {
                    delete devDeps[dep];
                    removed = true;
                }
            }

            if (removed) {
                packageJson.devDependencies = devDeps;
                await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
                console.log('✓ Removed Karma/Jasmine dependencies');
            }
        } catch (e) {
            console.warn('Failed to remove Karma dependencies', e);
        }
    }

    private async addVitestDependencies(projectPath: string): Promise<void> {
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (!(await fs.pathExists(packageJsonPath))) return;

        try {
            const packageJson = await fs.readJson(packageJsonPath);
            const devDeps: Record<string, string> = packageJson.devDependencies || {};

            devDeps['vitest'] = '^2.1.0';
            devDeps['@analogjs/vite-plugin-angular'] = '^1.8.0';
            devDeps['jsdom'] = '^25.0.0';

            packageJson.devDependencies = devDeps;
            await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
            console.log('✓ Added Vitest dependencies');
        } catch (e) {
            console.warn('Failed to add Vitest dependencies', e);
        }
    }

    private async updateAngularJson(projectPath: string): Promise<void> {
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
            try {
                const packageJson = await fs.readJson(packageJsonPath);
                packageJson.scripts = packageJson.scripts || {};
                packageJson.scripts['test'] = 'vitest run';
                await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
            } catch (e) {
                console.warn('Failed to add test script to package.json', e);
            }
        }

        const angularJsonPath = path.join(projectPath, 'angular.json');
        if (!(await fs.pathExists(angularJsonPath))) return;

        try {
            const angularJson = await fs.readJson(angularJsonPath);
            const projects = angularJson.projects || {};

            let updated = false;

            for (const projectName of Object.keys(projects)) {
                const project = projects[projectName];

                if (project.architect && project.architect.test) {
                    if (project.architect.test.builder === '@angular-devkit/build-angular:karma') {
                        // Drop karma and rely on npm script or custom generic builders
                        delete project.architect.test;
                        updated = true;
                    }
                }
            }

            if (updated) {
                await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
                console.log('✓ Updated angular.json to remove Karma targets (replaced by npm test)');
            }
        } catch (e) {
            console.warn('Failed to update angular.json for Vitest', e);
        }
    }

    private async generateVitestConfig(projectPath: string): Promise<void> {
        const setupTsContent = `import '@analogjs/vite-plugin-angular/setup-vitest';\n`;
        const vitestConfigTemplate = `import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
  }
});`;

        try {
            const angularJsonPath = path.join(projectPath, 'angular.json');
            let hasProjectsFolder = false;
            let projectEntries: { name: string, root: string }[] = [];

            if (await fs.pathExists(angularJsonPath)) {
                const angularJson = await fs.readJson(angularJsonPath);
                const projects = angularJson.projects || {};
                for (const [key, value] of Object.entries(projects) as any) {
                    if (value.root && value.root.startsWith('projects/')) {
                        hasProjectsFolder = true;
                        projectEntries.push({ name: key, root: value.root });
                    }
                }
            }

            if (hasProjectsFolder && projectEntries.length > 0) {
                // Monorepo Workspace - Generate per-project vitest config
                let workspaceProjects: string[] = [];
                for (const proj of projectEntries) {
                    const projPath = path.join(projectPath, proj.root);
                    await fs.ensureDir(path.join(projPath, 'src'));

                    const setupTsPath = path.join(projPath, 'src', 'test-setup.ts');
                    const vitestConfigPath = path.join(projPath, 'vitest.config.ts');

                    await fs.writeFile(setupTsPath, setupTsContent);
                    await fs.writeFile(vitestConfigPath, vitestConfigTemplate);
                    workspaceProjects.push(`'${proj.root}/*'`);
                }

                // Construct vitest.workspace.ts
                const workspaceContent = `export default [\n  ${workspaceProjects.join(',\n  ')}\n];\n`;
                const workspacePath = path.join(projectPath, 'vitest.workspace.ts');
                await fs.writeFile(workspacePath, workspaceContent);
                console.log('✓ Generated workspace-aware vitest.config.ts files & vitest.workspace.ts aggregator');
            } else {
                // Standard single-app layout
                await fs.ensureDir(path.join(projectPath, 'src'));
                const setupTsPath = path.join(projectPath, 'src', 'test-setup.ts');
                const vitestConfigPath = path.join(projectPath, 'vitest.config.ts');
                await fs.writeFile(setupTsPath, setupTsContent);
                await fs.writeFile(vitestConfigPath, vitestConfigTemplate);
                console.log('✓ Generated vitest.config.ts and test-setup.ts');
            }
        } catch (e) {
            console.warn('Failed to generate Vitest configurations', e);
        }
    }

    private async removeKarmaArtifacts(projectPath: string): Promise<void> {
        const findArtifactFiles = async (dir: string): Promise<string[]> => {
            let results: string[] = [];
            if (!(await fs.pathExists(dir))) return results;
            const list = await fs.readdir(dir);
            for (const file of list) {
                const fullPath = path.join(dir, file);
                const stat = await fs.stat(fullPath);
                if (stat && stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
                    results = results.concat(await findArtifactFiles(fullPath));
                } else if ((file.startsWith('karma.') && file.endsWith('.js')) || file === 'test.ts') {
                    // test.ts is usually the legacy karma bootstrap file in angular
                    results.push(fullPath);
                }
            }
            return results;
        };

        try {
            const filesToRemove = await findArtifactFiles(projectPath);
            for (const file of filesToRemove) {
                if (await fs.pathExists(file)) {
                    await fs.remove(file);
                    console.log(`✓ Removed legacy artifact: ${path.basename(file)}`);
                }
            }
        } catch (e) {
            console.warn('Failed to clean up all Karma config artifacts', e);
        }
    }

    private async updateTsConfigs(projectPath: string): Promise<void> {
        const findTsConfigFiles = async (dir: string): Promise<string[]> => {
            let results: string[] = [];
            if (!(await fs.pathExists(dir))) return results;
            const list = await fs.readdir(dir);
            for (const file of list) {
                const fullPath = path.join(dir, file);
                const stat = await fs.stat(fullPath);
                if (stat && stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
                    results = results.concat(await findTsConfigFiles(fullPath));
                } else if (file === 'tsconfig.spec.json' || file === 'tsconfig.app.json') {
                    results.push(fullPath);
                }
            }
            return results;
        };

        try {
            const tsConfigFiles = await findTsConfigFiles(projectPath);
            let updatedCount = 0;

            for (const file of tsConfigFiles) {
                let content = await fs.readFile(file, 'utf-8');
                if (content.includes('"jasmine"')) {
                    content = content.replace(/"jasmine"/g, '"vitest/globals"');
                    await fs.writeFile(file, content);
                    updatedCount++;
                }
            }

            if (updatedCount > 0) {
                console.log(`✓ Updated ${updatedCount} tsconfig files (replaced jasmine types with vitest/globals)`);
            }
        } catch (e) {
            console.warn('Failed to update tsconfig types', e);
        }
    }

    private async updateTestFiles(projectPath: string): Promise<void> {
        const findSpecFiles = async (dir: string): Promise<string[]> => {
            let results: string[] = [];
            if (!(await fs.pathExists(dir))) return results;
            const list = await fs.readdir(dir);
            for (const file of list) {
                const fullPath = path.join(dir, file);
                const stat = await fs.stat(fullPath);
                if (stat && stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
                    results = results.concat(await findSpecFiles(fullPath));
                } else if (file.endsWith('.spec.ts')) {
                    results.push(fullPath);
                }
            }
            return results;
        };

        try {
            const specFiles = await findSpecFiles(projectPath);
            let updatedCount = 0;
            let warningFiles: string[] = [];

            for (const file of specFiles) {
                let content = await fs.readFile(file, 'utf-8');
                let modified = false;

                // Detect complex matchers we cannot safely migrate
                if (content.match(/jasmine\.any\(|jasmine\.objectContaining\(|jasmine\.clock\(/)) {
                    warningFiles.push(file);
                }

                if (content.includes('jasmine.createSpy(') || content.includes('jasmine.createSpyObj(')) {
                    content = content.replace(/jasmine\.createSpy(Obj)?\([^)]*\)/g, 'vi.fn()');
                    modified = true;
                }

                if (content.includes('spyOn(') || content.includes('spyOnProperty(')) {
                    content = content.replace(/\bspyOn(Property)?\(/g, 'vi.spyOn(');
                    modified = true;
                }

                if (modified) {
                    if (!content.includes('import { vi }')) {
                        content = `import { vi } from 'vitest';\n` + content;
                    }
                    await fs.writeFile(file, content);
                    updatedCount++;
                }
            }

            if (updatedCount > 0) {
                console.log(`✓ Updated ${updatedCount} test files from Jasmine API to Vitest API`);
            }
            if (warningFiles.length > 0) {
                console.warn(`⚠ WARNING: Found ${warningFiles.length} files with complex Jasmine AST structures (e.g., jasmine.any). Manual developer review required for Vitest equivalents:`);
                warningFiles.forEach(f => console.warn(`   - ${f}`));
            }
        } catch (e) {
            console.warn('Failed to update spec test files', e);
        }
    }
}
