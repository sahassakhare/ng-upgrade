import { ProjectAnalysis } from '../types';
export declare class ProjectAnalyzer {
    private projectPath;
    constructor(projectPath: string);
    /**
     * Analyze Angular project for upgrade readiness
     */
    analyze(): Promise<ProjectAnalysis>;
    /**
     * Detect current Angular version
     */
    private detectAngularVersion;
    /**
     * Detect project type
     */
    private detectProjectType;
    /**
     * Detect build system
     */
    private detectBuildSystem;
    /**
     * Analyze project dependencies
     */
    private analyzeDependencies;
    /**
     * Analyze individual library
     */
    private analyzeLibrary;
    /**
     * Get library compatibility matrix
     */
    private getLibraryCompatibilityMatrix;
    /**
     * Check if library migration is required
     */
    private checkMigrationRequired;
    /**
     * Get alternative libraries
     */
    private getAlternativeLibraries;
    /**
     * Get deprecation status
     */
    private getDeprecationStatus;
    /**
     * Detect dependency conflicts
     */
    private detectDependencyConflicts;
    /**
     * Calculate code metrics
     */
    private calculateCodeMetrics;
    /**
     * Analyze directory recursively
     */
    private analyzeDirectory;
    /**
     * Check if directory should be skipped
     */
    private shouldSkipDirectory;
    /**
     * Check if file should be analyzed
     */
    private shouldAnalyzeFile;
    /**
     * Get test coverage
     */
    private getTestCoverage;
    /**
     * Calculate technical debt
     */
    private calculateTechnicalDebt;
    /**
     * Assess upgrade risks
     */
    private assessRisks;
    /**
     * Calculate overall risk level
     */
    private calculateOverallRisk;
    /**
     * Generate mitigation strategies
     */
    private generateMitigationStrategies;
}
//# sourceMappingURL=ProjectAnalyzer.d.ts.map