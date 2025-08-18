import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';
export declare class Angular20Handler extends BaseVersionHandler {
    readonly version = "20";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    protected applyVersionSpecificChanges(_projectPath: string, _options: UpgradeOptions): Promise<void>;
    getBreakingChanges(): BreakingChange[];
}
//# sourceMappingURL=Angular20Handler.d.ts.map