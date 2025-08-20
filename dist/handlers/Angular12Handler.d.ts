import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';
export declare class Angular12Handler extends BaseVersionHandler {
    readonly version = "12";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    protected applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void>;
    private ensureIvyRenderer;
    private updateWebpackConfiguration;
    private updatePackageFormat;
    private enableStrictMode;
    private updateAngularCDKMaterial;
    private updateHMRSupport;
    getBreakingChanges(): BreakingChange[];
}
//# sourceMappingURL=Angular12Handler.d.ts.map