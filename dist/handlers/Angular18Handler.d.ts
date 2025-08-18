import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';
export declare class Angular18Handler extends BaseVersionHandler {
    readonly version = "18";
    protected getRequiredNodeVersion(): string;
    protected getRequiredTypeScriptVersion(): string;
    protected applyVersionSpecificChanges(_projectPath: string, _options: UpgradeOptions): Promise<void>;
    getBreakingChanges(): BreakingChange[];
}
//# sourceMappingURL=Angular18Handler.d.ts.map