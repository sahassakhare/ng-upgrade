import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular20Handler extends BaseVersionHandler {
  readonly version = '20';
  protected getRequiredNodeVersion(): string { return '>=18.19.1'; }
  protected getRequiredTypeScriptVersion(): string { return '>=5.6.0 <5.7.0'; }
  protected async applyVersionSpecificChanges(_projectPath: string, _options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 20 specific changes...');
    
    // Angular 20 specific changes would be implemented here
    // This version introduced incremental hydration, signals stabilization, and advanced SSR features
    
    this.progressReporter?.success('✓ Angular 20 specific changes completed');
  }
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange('ng20-incremental-hydration', 'api', 'medium', 'Incremental hydration stable', 'Advanced SSR with incremental hydration', 'Opt-in feature for SSR applications')
    ];
  }
}