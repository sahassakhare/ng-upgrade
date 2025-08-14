import { AngularVersion, UpgradePath, UpgradeOptions } from '../types';
export declare class UpgradePathCalculator {
    private versionHandlers;
    private supportedVersions;
    constructor();
    /**
     * Calculate optimal upgrade path from current to target version
     */
    calculatePath(currentVersion: AngularVersion, targetVersion: AngularVersion, options: UpgradeOptions): Promise<UpgradePath>;
    /**
     * Generate sequence of versions for upgrade path
     */
    private generateVersionSequence;
    /**
     * Create upgrade steps for version sequence
     */
    private createUpgradeSteps;
    /**
     * Create individual upgrade step
     */
    private createUpgradeStep;
    /**
     * Get prerequisites for specific Angular version
     */
    private getPrerequisites;
    /**
     * Get validation steps for version
     */
    private getValidationSteps;
    /**
     * Validate version compatibility
     */
    private validateVersions;
    /**
     * Get estimated upgrade time
     */
    getEstimatedUpgradeTime(path: UpgradePath, options: UpgradeOptions): number;
    /**
     * Get upgrade complexity score
     */
    getUpgradeComplexity(path: UpgradePath): {
        score: number;
        factors: string[];
    };
    /**
     * Optimize upgrade path based on project analysis
     */
    optimizePath(path: UpgradePath, projectAnalysis: any, options: UpgradeOptions): Promise<UpgradePath>;
    /**
     * Get alternative upgrade paths
     */
    getAlternativePaths(currentVersion: AngularVersion, targetVersion: AngularVersion): UpgradePath[];
}
//# sourceMappingURL=UpgradePathCalculator.d.ts.map