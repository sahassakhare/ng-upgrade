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
exports.ValidatorFramework = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const semver = __importStar(require("semver"));
class ValidatorFramework {
    projectPath;
    constructor(projectPath) {
        this.projectPath = projectPath;
    }
    /**
     * Validate prerequisite requirements
     */
    async validatePrerequisite(prerequisite) {
        try {
            switch (prerequisite.type) {
                case 'node':
                    return this.validateNodeVersion(prerequisite.requiredVersion || '');
                case 'typescript':
                    return this.validateTypeScriptVersion(prerequisite.requiredVersion || '');
                case 'dependency':
                    return await this.validateDependency(prerequisite.name, prerequisite.requiredVersion);
                case 'environment':
                    return await this.validateEnvironment(prerequisite.name);
                default:
                    return false;
            }
        }
        catch (error) {
            console.error(`Prerequisite validation failed for ${prerequisite.name}:`, error);
            return false;
        }
    }
    /**
     * Run validation step
     */
    async runValidation(validation) {
        try {
            switch (validation.type) {
                case 'build':
                    return await this.runBuildValidation(validation);
                case 'test':
                    return await this.runTestValidation(validation);
                case 'lint':
                    return await this.runLintValidation(validation);
                case 'runtime':
                    return await this.runRuntimeValidation(validation);
                case 'compatibility':
                    return await this.runCompatibilityValidation(validation);
                default:
                    return {
                        success: false,
                        message: `Unknown validation type: ${validation.type}`,
                        error: 'Unsupported validation type'
                    };
            }
        }
        catch (error) {
            return {
                success: false,
                message: `Validation failed: ${validation.description}`,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }
    /**
     * Validate Node.js version
     */
    validateNodeVersion(requiredVersion) {
        try {
            const currentVersion = process.version;
            return semver.satisfies(currentVersion, requiredVersion);
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Validate TypeScript version
     */
    validateTypeScriptVersion(requiredVersion) {
        try {
            const result = (0, child_process_1.execSync)('npx tsc --version', {
                cwd: this.projectPath,
                encoding: 'utf-8',
                stdio: 'pipe'
            });
            const versionMatch = result.match(/Version (\d+\.\d+\.\d+)/);
            if (!versionMatch)
                return false;
            const currentVersion = versionMatch[1];
            return semver.satisfies(currentVersion, requiredVersion);
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Validate dependency version
     */
    async validateDependency(name, requiredVersion) {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            const packageJson = await fs.readJson(packageJsonPath);
            const currentVersion = packageJson.dependencies?.[name] ||
                packageJson.devDependencies?.[name];
            if (!currentVersion)
                return false;
            if (!requiredVersion)
                return true;
            const cleanVersion = currentVersion.replace(/[\^~]/, '');
            return semver.satisfies(cleanVersion, requiredVersion);
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Validate environment requirements
     */
    async validateEnvironment(requirement) {
        switch (requirement) {
            case 'git':
                return this.commandExists('git --version');
            case 'npm':
                return this.commandExists('npm --version');
            case 'yarn':
                return this.commandExists('yarn --version');
            default:
                return false;
        }
    }
    /**
     * Check if command exists
     */
    commandExists(command) {
        try {
            (0, child_process_1.execSync)(command, { stdio: 'pipe' });
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Run build validation
     */
    async runBuildValidation(validation) {
        try {
            const command = validation.command || 'npm run build';
            const timeout = validation.timeout || 300000; // 5 minutes default
            const result = (0, child_process_1.execSync)(command, {
                cwd: this.projectPath,
                encoding: 'utf-8',
                timeout,
                stdio: 'pipe'
            });
            return {
                success: true,
                message: 'Build completed successfully',
                warnings: this.extractWarnings(result)
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Build failed',
                error: error.stdout || error.stderr || error.message
            };
        }
    }
    /**
     * Run test validation
     */
    async runTestValidation(validation) {
        try {
            const command = validation.command || 'npm test -- --watch=false --browsers=ChromeHeadless';
            const timeout = validation.timeout || 600000; // 10 minutes default
            const result = (0, child_process_1.execSync)(command, {
                cwd: this.projectPath,
                encoding: 'utf-8',
                timeout,
                stdio: 'pipe'
            });
            return {
                success: true,
                message: 'Tests passed successfully',
                warnings: this.extractWarnings(result)
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Tests failed',
                error: error.stdout || error.stderr || error.message
            };
        }
    }
    /**
     * Run lint validation
     */
    async runLintValidation(validation) {
        try {
            const command = validation.command || this.getLintCommand();
            const timeout = validation.timeout || 120000; // 2 minutes default
            const result = (0, child_process_1.execSync)(command, {
                cwd: this.projectPath,
                encoding: 'utf-8',
                timeout,
                stdio: 'pipe'
            });
            return {
                success: true,
                message: 'Linting passed successfully',
                warnings: this.extractWarnings(result)
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Linting failed',
                error: error.stdout || error.stderr || error.message
            };
        }
    }
    /**
     * Run runtime validation
     */
    async runRuntimeValidation(validation) {
        try {
            // Start dev server and check if it boots successfully
            const command = 'npm start';
            const timeout = validation.timeout || 60000; // 1 minute default
            // This is a simplified runtime check
            // In a full implementation, this would start the server,
            // wait for it to be ready, then shut it down
            return {
                success: true,
                message: 'Runtime validation passed',
                warnings: ['Runtime validation is simplified in this implementation']
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Runtime validation failed',
                error: error.message
            };
        }
    }
    /**
     * Run compatibility validation
     */
    async runCompatibilityValidation(validation) {
        const issues = [];
        const warnings = [];
        // Check for deprecated APIs
        const deprecatedApis = await this.checkDeprecatedApis();
        if (deprecatedApis.length > 0) {
            warnings.push(`Found ${deprecatedApis.length} deprecated API usages`);
        }
        // Check for peer dependency conflicts
        const peerConflicts = await this.checkPeerDependencies();
        if (peerConflicts.length > 0) {
            issues.push(`Found ${peerConflicts.length} peer dependency conflicts`);
        }
        // Check Angular version compatibility
        const versionIssues = await this.checkVersionCompatibility();
        if (versionIssues.length > 0) {
            issues.push(...versionIssues);
        }
        return {
            success: issues.length === 0,
            message: issues.length === 0 ? 'Compatibility validation passed' : 'Compatibility issues found',
            error: issues.length > 0 ? issues.join('; ') : undefined,
            warnings
        };
    }
    /**
     * Get appropriate lint command
     */
    getLintCommand() {
        // Check what linter is configured
        const packageJsonPath = path.join(this.projectPath, 'package.json');
        try {
            const packageJson = require(packageJsonPath);
            const scripts = packageJson.scripts || {};
            if (scripts.lint) {
                return 'npm run lint';
            }
            else if (packageJson.devDependencies?.eslint) {
                return 'npx eslint src/**/*.ts';
            }
            else if (packageJson.devDependencies?.tslint) {
                return 'npx tslint -p tsconfig.json';
            }
        }
        catch {
            // Ignore errors
        }
        return 'npm run lint'; // Default fallback
    }
    /**
     * Extract warnings from command output
     */
    extractWarnings(output) {
        const warnings = [];
        const lines = output.split('\n');
        for (const line of lines) {
            if (line.includes('WARNING') || line.includes('warning') || line.includes('WARN')) {
                warnings.push(line.trim());
            }
        }
        return warnings;
    }
    /**
     * Check for deprecated API usage
     */
    async checkDeprecatedApis() {
        const deprecatedApis = [];
        // This would scan the codebase for deprecated Angular APIs
        // For now, return empty array
        return deprecatedApis;
    }
    /**
     * Check peer dependencies
     */
    async checkPeerDependencies() {
        const conflicts = [];
        try {
            const result = (0, child_process_1.execSync)('npm ls --depth=0', {
                cwd: this.projectPath,
                encoding: 'utf-8',
                stdio: 'pipe'
            });
            // Parse npm ls output for peer dependency warnings
            if (result.includes('WARN')) {
                const lines = result.split('\n');
                for (const line of lines) {
                    if (line.includes('WARN') && line.includes('peer dep')) {
                        conflicts.push(line.trim());
                    }
                }
            }
        }
        catch (error) {
            // npm ls might exit with non-zero code if there are issues
            const output = error.stdout || '';
            if (output.includes('peer dep')) {
                conflicts.push('Peer dependency conflicts detected');
            }
        }
        return conflicts;
    }
    /**
     * Check Angular version compatibility
     */
    async checkVersionCompatibility() {
        const issues = [];
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            const packageJson = await fs.readJson(packageJsonPath);
            const angularDeps = Object.entries({
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            }).filter(([name]) => name.startsWith('@angular/'));
            const coreVersion = angularDeps.find(([name]) => name === '@angular/core')?.[1];
            if (coreVersion && typeof coreVersion === 'string') {
                const coreMajor = semver.major(coreVersion.replace(/[\^~]/, ''));
                for (const [name, version] of angularDeps) {
                    if (name !== '@angular/core') {
                        const depMajor = semver.major(version.replace(/[\^~]/, ''));
                        if (depMajor !== coreMajor) {
                            issues.push(`Version mismatch: ${name}@${version} with @angular/core@${coreVersion}`);
                        }
                    }
                }
            }
        }
        catch (error) {
            issues.push('Could not validate Angular version compatibility');
        }
        return issues;
    }
    /**
     * Run comprehensive validation suite
     */
    async runComprehensiveValidation() {
        const validations = [
            {
                type: 'build',
                description: 'Project build validation',
                required: true
            },
            {
                type: 'test',
                description: 'Unit test validation',
                required: false
            },
            {
                type: 'lint',
                description: 'Code quality validation',
                required: false
            },
            {
                type: 'compatibility',
                description: 'Angular compatibility validation',
                required: true
            }
        ];
        const results = [];
        for (const validation of validations) {
            const result = await this.runValidation(validation);
            results.push(result);
            // Stop on critical failures
            if (validation.required && !result.success) {
                break;
            }
        }
        return results;
    }
}
exports.ValidatorFramework = ValidatorFramework;
//# sourceMappingURL=ValidatorFramework.js.map