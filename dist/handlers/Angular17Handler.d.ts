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
     * Update to new application bootstrap while preserving existing code
     */
    private updateApplicationBootstrap;
    /**
     * Migrate assets folder to public folder (Angular 17+)
     * This preserves the existing assets while adding the new public folder
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
     * Uses DependencyInstaller for automatic installation
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