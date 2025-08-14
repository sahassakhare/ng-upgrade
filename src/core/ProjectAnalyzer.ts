import * as fs from 'fs-extra';
import * as path from 'path';
import { 
  ProjectAnalysis, 
  AngularVersion, 
  DependencyAnalysis, 
  CodeMetrics, 
  RiskAssessment,
  ThirdPartyLibrary,
  DependencyConflict,
  RiskFactor
} from '../types';

export class ProjectAnalyzer {
  constructor(private projectPath: string) {}

  /**
   * Analyze Angular project for upgrade readiness
   */
  async analyze(): Promise<ProjectAnalysis> {
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
  private async detectAngularVersion(): Promise<AngularVersion> {
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
    } catch (error) {
      throw new Error(`Failed to detect Angular version: ${error}`);
    }
  }

  /**
   * Detect project type
   */
  private async detectProjectType(): Promise<'application' | 'library' | 'workspace'> {
    const angularJsonPath = path.join(this.projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      const angularJson = await fs.readJson(angularJsonPath);
      const projects = angularJson.projects || {};
      
      const projectEntries = Object.entries(projects);
      
      if (projectEntries.length > 1) {
        return 'workspace';
      } else if (projectEntries.length === 1) {
        const [, projectConfig] = projectEntries[0] as [string, any];
        return projectConfig.projectType === 'library' ? 'library' : 'application';
      }
    }

    return 'application';
  }

  /**
   * Detect build system
   */
  private async detectBuildSystem(): Promise<'angular-cli' | 'webpack' | 'nx' | 'other'> {
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
  private async analyzeDependencies(): Promise<DependencyAnalysis> {
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    
    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    const compatible: ThirdPartyLibrary[] = [];
    const incompatible: ThirdPartyLibrary[] = [];
    const requiresUpdate: ThirdPartyLibrary[] = [];
    const conflicts: DependencyConflict[] = [];

    // Analyze each dependency
    for (const [name, version] of Object.entries(allDependencies)) {
      const library = await this.analyzeLibrary(name, version as string);
      
      if (library.compatibilityMatrix && Object.keys(library.compatibilityMatrix).length > 0) {
        if (library.migrationRequired) {
          requiresUpdate.push(library);
        } else {
          compatible.push(library);
        }
      } else {
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
  private async analyzeLibrary(name: string, version: string): Promise<ThirdPartyLibrary> {
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
  private getLibraryCompatibilityMatrix(libraryName: string): Record<string, string[]> {
    // Comprehensive compatibility matrix for popular Angular libraries
    const compatibilityDatabase: Record<string, Record<string, string[]>> = {
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
  private checkMigrationRequired(libraryName: string, currentVersion: string): boolean {
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
  private getAlternativeLibraries(libraryName: string): string[] {
    const alternatives: Record<string, string[]> = {
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
  private getDeprecationStatus(libraryName: string): 'stable' | 'deprecated' | 'discontinued' {
    const deprecatedLibraries: Record<string, 'deprecated' | 'discontinued'> = {
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
  private async detectDependencyConflicts(dependencies: Record<string, string>): Promise<DependencyConflict[]> {
    const conflicts: DependencyConflict[] = [];

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
  private async calculateCodeMetrics(): Promise<CodeMetrics> {
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
        } else if (filePath.includes('.service.ts')) {
          serviceCount++;
        } else if (filePath.includes('.module.ts')) {
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
  private async analyzeDirectory(
    dirPath: string, 
    fileProcessor: (filePath: string, content: string) => void
  ): Promise<void> {
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isDirectory() && !this.shouldSkipDirectory(file)) {
        await this.analyzeDirectory(filePath, fileProcessor);
      } else if (stat.isFile() && this.shouldAnalyzeFile(file)) {
        const content = await fs.readFile(filePath, 'utf-8');
        fileProcessor(filePath, content);
      }
    }
  }

  /**
   * Check if directory should be skipped
   */
  private shouldSkipDirectory(dirName: string): boolean {
    const skipDirs = ['node_modules', 'dist', '.angular', 'coverage', '.nyc_output'];
    return skipDirs.includes(dirName);
  }

  /**
   * Check if file should be analyzed
   */
  private shouldAnalyzeFile(fileName: string): boolean {
    return fileName.endsWith('.ts') || fileName.endsWith('.js') || fileName.endsWith('.html');
  }

  /**
   * Get test coverage
   */
  private async getTestCoverage(): Promise<number | undefined> {
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
  private async calculateTechnicalDebt(): Promise<number | undefined> {
    // This would analyze code for technical debt indicators
    // For now, return placeholder
    return 15; // Placeholder percentage
  }

  /**
   * Assess upgrade risks
   */
  private async assessRisks(
    dependencies: DependencyAnalysis, 
    codeMetrics: CodeMetrics
  ): Promise<RiskAssessment> {
    const riskFactors: RiskFactor[] = [];
    
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
  private calculateOverallRisk(riskFactors: RiskFactor[]): 'low' | 'medium' | 'high' | 'critical' {
    if (riskFactors.length === 0) return 'low';
    
    const hasHighRisk = riskFactors.some(rf => rf.severity === 'high' || rf.severity === 'critical');
    const mediumRiskCount = riskFactors.filter(rf => rf.severity === 'medium').length;
    
    if (riskFactors.some(rf => rf.severity === 'critical')) return 'critical';
    if (hasHighRisk || mediumRiskCount > 2) return 'high';
    if (mediumRiskCount > 0) return 'medium';
    
    return 'low';
  }

  /**
   * Generate mitigation strategies
   */
  private generateMitigationStrategies(riskFactors: RiskFactor[]): string[] {
    const strategies: string[] = [];
    
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