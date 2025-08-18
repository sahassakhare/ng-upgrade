import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';
export declare class Angular13Handler extends BaseVersionHandler {
    readonly version = "13";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    protected applyVersionSpecificChanges(_projectPath: string, _options: UpgradeOptions): Promise<void>;
    getBreakingChanges(): BreakingChange[];
}
//# sourceMappingURL=Angular13Handler.d.ts.map