import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular20Handler extends BaseVersionHandler {
  readonly version = '20';
  protected getRequiredNodeVersion(): string { return '>=18.19.1'; }
  protected getRequiredTypeScriptVersion(): string { return '>=5.6.0 <5.7.0'; }
  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    console.log('Applying Angular 20 specific changes...');
  }
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange('ng20-incremental-hydration', 'api', 'medium', 'Incremental hydration stable', 'Advanced SSR with incremental hydration', 'Opt-in feature for SSR applications')
    ];
  }
}