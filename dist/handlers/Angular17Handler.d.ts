import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';
export declare class Angular17Handler extends BaseVersionHandler {
    readonly version = "17";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    /**
     * Apply Angular 17 specific changes
     */
    protected applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;
    /**
     * Update to new application bootstrap
     */
    private updateApplicationBootstrap;
    /**
     * Generate new bootstrap code
     */
    private generateNewBootstrapCode;
    /**
     * Migrate assets folder to public folder (Angular 17+)
     */
    private migrateAssetsToPublic;
    /**
     * Update asset configuration in angular.json
     */
    private updateAssetConfiguration;
    /**
     * Enable new control flow syntax
     */
    private enableNewControlFlow;
    /**
     * Update SSR configuration
     */
    private updateSSRConfiguration;
    /**
     * Update build configuration
     */
    private updateBuildConfiguration;
    /**
     * Update Angular Material for Angular 17
     */
    private updateAngularMaterial;
    /**
     * Update builder configurations for Angular 17
     */
    protected updateBuilderConfigurations(angularJson: any): void;
    /**
     * Update TypeScript configuration for Angular 17
     */
    protected updateTypeScriptConfig(tsconfig: any): void;
    /**
     * Angular 17 breaking changes
     */
    getBreakingChanges(): BreakingChange[];
}
//# sourceMappingURL=Angular17Handler.d.ts.map