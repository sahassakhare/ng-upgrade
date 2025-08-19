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
exports.ProjectAnalyzer = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class ProjectAnalyzer {
    projectPath;
    constructor(projectPath) {
        this.projectPath = projectPath;
    }
    /**
     * Analyze Angular project for upgrade readiness
     */
    async analyze() {
        const currentVersion = await this.detectAngularVersion();
        const projectType = await this.detectProjectType();
        const buildSystem = await this.detectBuildSystem();
        const dependencies = await this.analyzeDependencies();
        const codeMetrics = await this.calculateCodeMetrics();
        const riskAssessment = await this.assessRisks(dependencies, codeMetrics);
        return {
            currentVersion,
            projectType,
            buildSystem,
            dependencies,
            codeMetrics,
            riskAssessment
        };
    }
    /**
     * Detect current Angular version
     */
    async detectAngularVersion() {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            const packageJson = await fs.readJson(packageJsonPath);
            const coreVersion = packageJson.dependencies?.['@angular/core'] ||
                packageJson.devDependencies?.['@angular/core'];
            if (!coreVersion) {
                throw new Error('Angular core dependency not found');
            }
            const versionString = coreVersion.replace(/[\^~]/, '');
            const [major, minor = 0, patch = 0] = versionString.split('.').map(Number);
            return {
                major,
                minor,
                patch,
                full: `${major}.${minor}.${patch}`
            };
        }
        catch (error) {
            throw new Error(`Failed to detect Angular version: ${error}`);
        }
    }
    /**
     * Detect project type
     */
    async detectProjectType() {
        const angularJsonPath = path.join(this.projectPath, 'angular.json');
        if (await fs.pathExists(angularJsonPath)) {
            const angularJson = await fs.readJson(angularJsonPath);
            const projects = angularJson.projects || {};
            const projectEntries = Object.entries(projects);
            if (projectEntries.length > 1) {
                return 'workspace';
            }
            else if (projectEntries.length === 1) {
                const [, projectConfig] = projectEntries[0];
                return projectConfig.projectType === 'library' ? 'library' : 'application';
            }
        }
        return 'application';
    }
    /**
     * Detect build system
     */
    async detectBuildSystem() {
        // Check for Nx workspace
        if (await fs.pathExists(path.join(this.projectPath, 'nx.json'))) {
            return 'nx';
        }
        // Check for Angular CLI
        if (await fs.pathExists(path.join(this.projectPath, 'angular.json'))) {
            return 'angular-cli';
        }
        // Check for custom webpack config
        const webpackConfigs = [
            'webpack.config.js',
            'webpack.config.ts',
            'webpack.common.js',
            'webpack.dev.js',
            'webpack.prod.js'
        ];
        for (const config of webpackConfigs) {
            if (await fs.pathExists(path.join(this.projectPath, config))) {
                return 'webpack';
            }
        }
        return 'other';
    }
    /**
     * Analyze project dependencies
     */
    async analyzeDependencies() {
        const packageJsonPath = path.join(this.projectPath, 'package.json');
        const packageJson = await fs.readJson(packageJsonPath);
        const allDependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies
        };
        const compatible = [];
        const incompatible = [];
        const requiresUpdate = [];
        const conflicts = [];
        // Analyze each dependency
        for (const [name, version] of Object.entries(allDependencies)) {
            const library = await this.analyzeLibrary(name, version);
            if (library.compatibilityMatrix && Object.keys(library.compatibilityMatrix).length > 0) {
                if (library.migrationRequired) {
                    requiresUpdate.push(library);
                }
                else {
                    compatible.push(library);
                }
            }
            else {
                incompatible.push(library);
            }
        }
        // Detect conflicts
        const detectedConflicts = await this.detectDependencyConflicts(allDependencies);
        conflicts.push(...detectedConflicts);
        return {
            compatible,
            incompatible,
            requiresUpdate,
            conflicts
        };
    }
    /**
     * Analyze individual library
     */
    async analyzeLibrary(name, version) {
        // This would contain a comprehensive database of Angular library compatibility
        // For now, implementing basic logic for common libraries
        const compatibilityMatrix = this.getLibraryCompatibilityMatrix(name);
        const migrationRequired = this.checkMigrationRequired(name, version);
        const alternativeLibraries = this.getAlternativeLibraries(name);
        const deprecationStatus = this.getDeprecationStatus(name);
        return {
            name,
            currentVersion: version,
            compatibilityMatrix,
            migrationRequired,
            alternativeLibraries,
            deprecationStatus
        };
    }
    /**
     * Get library compatibility matrix
     */
    getLibraryCompatibilityMatrix(libraryName) {
        // Comprehensive compatibility matrix for popular Angular libraries
        const compatibilityDatabase = {
            '@angular/material': {
                '12': ['^12.0.0'],
                '13': ['^13.0.0'],
                '14': ['^14.0.0'],
                '15': ['^15.0.0'],
                '16': ['^16.0.0'],
                '17': ['^17.0.0'],
                '18': ['^18.0.0'],
                '19': ['^19.0.0'],
                '20': ['^20.0.0']
            },
            '@ngrx/store': {
                '12': ['^12.0.0'],
                '13': ['^13.0.0'],
                '14': ['^14.0.0'],
                '15': ['^15.0.0'],
                '16': ['^16.0.0'],
                '17': ['^17.0.0'],
                '18': ['^18.0.0'],
                '19': ['^19.0.0'],
                '20': ['^20.0.0']
            },
            'primeng': {
                '12': ['^12.0.0', '^13.0.0'],
                '13': ['^13.0.0', '^14.0.0'],
                '14': ['^14.0.0', '^15.0.0'],
                '15': ['^15.0.0', '^16.0.0'],
                '16': ['^16.0.0', '^17.0.0'],
                '17': ['^17.0.0', '^18.0.0'],
                '18': ['^18.0.0', '^19.0.0'],
                '19': ['^19.0.0', '^20.0.0'],
                '20': ['^20.0.0']
            },
            'ng-bootstrap': {
                '12': ['^12.0.0'],
                '13': ['^13.0.0'],
                '14': ['^14.0.0'],
                '15': ['^15.0.0'],
                '16': ['^16.0.0'],
                '17': ['^17.0.0'],
                '18': ['^18.0.0'],
                '19': ['^19.0.0'],
                '20': ['^20.0.0']
            }
        };
        return compatibilityDatabase[libraryName] || {};
    }
    /**
     * Check if library migration is required
     */
    checkMigrationRequired(libraryName, currentVersion) {
        // Libraries that commonly require migration
        const migrationRequiredLibraries = [
            '@angular/material',
            '@ngrx/store',
            '@angular/flex-layout', // Deprecated
            'primeng'
        ];
        return migrationRequiredLibraries.includes(libraryName);
    }
    /**
     * Get alternative libraries
     */
    getAlternativeLibraries(libraryName) {
        const alternatives = {
            '@angular/flex-layout': ['@angular/cdk/layout', 'tailwindcss', 'bootstrap'],
            'tslint': ['eslint', '@typescript-eslint/eslint-plugin'],
            'protractor': ['cypress', '@playwright/test', 'webdriver-io'],
            'karma': ['jest', 'vitest'],
            'codelyzer': ['@typescript-eslint/eslint-plugin']
        };
        return alternatives[libraryName] || [];
    }
    /**
     * Get deprecation status
     */
    getDeprecationStatus(libraryName) {
        const deprecatedLibraries = {
            '@angular/flex-layout': 'deprecated',
            'tslint': 'discontinued',
            'protractor': 'discontinued',
            'codelyzer': 'deprecated'
        };
        return deprecatedLibraries[libraryName] || 'stable';
    }
    /**
     * Detect dependency conflicts
     */
    async detectDependencyConflicts(dependencies) {
        const conflicts = [];
        // Check for known conflicting libraries
        const conflictPairs = [
            ['@angular/flex-layout', '@angular/cdk'],
            ['tslint', 'eslint'],
            ['karma', 'jest']
        ];
        for (const [lib1, lib2] of conflictPairs) {
            if (dependencies[lib1] && dependencies[lib2]) {
                conflicts.push({
                    library1: lib1,
                    library2: lib2,
                    conflictType: 'api',
                    severity: 'warning',
                    resolution: `Consider migrating from ${lib1} to ${lib2}`
                });
            }
        }
        return conflicts;
    }
    /**
     * Calculate code metrics
     */
    async calculateCodeMetrics() {
        let totalFiles = 0;
        let componentCount = 0;
        let serviceCount = 0;
        let moduleCount = 0;
        let linesOfCode = 0;
        const srcPath = path.join(this.projectPath, 'src');
        if (await fs.pathExists(srcPath)) {
            await this.analyzeDirectory(srcPath, (filePath, content) => {
                totalFiles++;
                linesOfCode += content.split('\n').length;
                if (filePath.includes('.component.ts')) {
                    componentCount++;
                }
                else if (filePath.includes('.service.ts')) {
                    serviceCount++;
                }
                else if (filePath.includes('.module.ts')) {
                    moduleCount++;
                }
            });
        }
        return {
            totalFiles,
            componentCount,
            serviceCount,
            moduleCount,
            linesOfCode,
            testCoverage: await this.getTestCoverage(),
            technicalDebt: await this.calculateTechnicalDebt()
        };
    }
    /**
     * Analyze directory recursively
     */
    async analyzeDirectory(dirPath, fileProcessor) {
        const files = await fs.readdir(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = await fs.stat(filePath);
            if (stat.isDirectory() && !this.shouldSkipDirectory(file)) {
                await this.analyzeDirectory(filePath, fileProcessor);
            }
            else if (stat.isFile() && this.shouldAnalyzeFile(file)) {
                const content = await fs.readFile(filePath, 'utf-8');
                fileProcessor(filePath, content);
            }
        }
    }
    /**
     * Check if directory should be skipped
     */
    shouldSkipDirectory(dirName) {
        const skipDirs = ['node_modules', 'dist', '.angular', 'coverage', '.nyc_output'];
        return skipDirs.includes(dirName);
    }
    /**
     * Check if file should be analyzed
     */
    shouldAnalyzeFile(fileName) {
        return fileName.endsWith('.ts') || fileName.endsWith('.js') || fileName.endsWith('.html');
    }
    /**
     * Get test coverage
     */
    async getTestCoverage() {
        const coverageFile = path.join(this.projectPath, 'coverage', 'lcov-report', 'index.html');
        if (await fs.pathExists(coverageFile)) {
            // Parse coverage file for percentage
            // This is a simplified implementation
            return 75; // Placeholder
        }
        return undefined;
    }
    /**
     * Calculate technical debt
     */
    async calculateTechnicalDebt() {
        // This would analyze code for technical debt indicators
        // For now, return placeholder
        return 15; // Placeholder percentage
    }
    /**
     * Assess upgrade risks
     */
    async assessRisks(dependencies, codeMetrics) {
        const riskFactors = [];
        // Dependency risks
        if (dependencies.incompatible.length > 0) {
            riskFactors.push({
                type: 'dependency',
                severity: 'high',
                description: `${dependencies.incompatible.length} incompatible dependencies`,
                impact: 'May require manual migration or replacement',
                likelihood: 0.8
            });
        }
        if (dependencies.conflicts.length > 0) {
            riskFactors.push({
                type: 'dependency',
                severity: 'medium',
                description: `${dependencies.conflicts.length} dependency conflicts`,
                impact: 'May cause build or runtime issues',
                likelihood: 0.6
            });
        }
        // Code complexity risks
        if (codeMetrics.linesOfCode > 50000) {
            riskFactors.push({
                type: 'code',
                severity: 'medium',
                description: 'Large codebase',
                impact: 'Increased upgrade time and potential for issues',
                likelihood: 0.7
            });
        }
        if (codeMetrics.testCoverage && codeMetrics.testCoverage < 50) {
            riskFactors.push({
                type: 'code',
                severity: 'high',
                description: 'Low test coverage',
                impact: 'Difficult to validate upgrade success',
                likelihood: 0.9
            });
        }
        // Calculate overall risk
        const overallRisk = this.calculateOverallRisk(riskFactors);
        const mitigationStrategies = this.generateMitigationStrategies(riskFactors);
        return {
            overallRisk,
            riskFactors,
            mitigationStrategies
        };
    }
    /**
     * Calculate overall risk level
     */
    calculateOverallRisk(riskFactors) {
        if (riskFactors.length === 0)
            return 'low';
        const hasHighRisk = riskFactors.some(rf => rf.severity === 'high' || rf.severity === 'critical');
        const mediumRiskCount = riskFactors.filter(rf => rf.severity === 'medium').length;
        if (riskFactors.some(rf => rf.severity === 'critical'))
            return 'critical';
        if (hasHighRisk || mediumRiskCount > 2)
            return 'high';
        if (mediumRiskCount > 0)
            return 'medium';
        return 'low';
    }
    /**
     * Generate mitigation strategies
     */
    generateMitigationStrategies(riskFactors) {
        const strategies = [];
        for (const factor of riskFactors) {
            switch (factor.type) {
                case 'dependency':
                    if (factor.description.includes('incompatible')) {
                        strategies.push('Review and update incompatible dependencies before upgrade');
                    }
                    if (factor.description.includes('conflicts')) {
                        strategies.push('Resolve dependency conflicts to prevent build issues');
                    }
                    break;
                case 'code':
                    if (factor.description.includes('Large codebase')) {
                        strategies.push('Consider upgrading in smaller increments with extensive testing');
                    }
                    if (factor.description.includes('test coverage')) {
                        strategies.push('Increase test coverage before attempting upgrade');
                    }
                    break;
            }
        }
        return Array.from(new Set(strategies));
    }
}
exports.ProjectAnalyzer = ProjectAnalyzer;
//# sourceMappingURL=ProjectAnalyzer.js.map