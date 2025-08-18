import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';
export declare class Angular19Handler extends BaseVersionHandler {
    readonly version = "19";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    protected applyVersionSpecificChanges(_projectPath: string, _options: UpgradeOptions): Promise<void>;
    getBreakingChanges(): BreakingChange[];
}
//# sourceMappingURL=Angular19Handler.d.ts.map