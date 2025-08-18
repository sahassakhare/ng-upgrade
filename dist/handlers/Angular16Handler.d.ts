import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';
export declare class Angular16Handler extends BaseVersionHandler {
    readonly version = "16";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    protected applyVersionSpecificChanges(_projectPath: string, _options: UpgradeOptions): Promise<void>;
    getBreakingChanges(): BreakingChange[];
}
//# sourceMappingURL=Angular16Handler.d.ts.map