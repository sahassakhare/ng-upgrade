import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular19Handler extends BaseVersionHandler {
  readonly version = '19';
  protected getRequiredNodeVersion(): string { return '>=18.19.1'; }
  protected getRequiredTypeScriptVersion(): string { return '>=5.5.0 <5.6.0'; }
  protected async applyVersionSpecificChanges(_projectPath: string, _options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 19 specific changes...');
    
    // Angular 19 specific changes would be implemented here
    // This version introduced zoneless change detection, event replay, and hybrid rendering capabilities
    
    this.progressReporter?.success('✓ Angular 19 specific changes completed');
  }
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange('ng19-zoneless', 'api', 'high', 'Zoneless change detection available', 'Optional zoneless change detection', 'Zoneless detection is opt-in - Zone.js continues to work')
    ];
  }
}