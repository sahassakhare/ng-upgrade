import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular19Handler extends BaseVersionHandler {
  readonly version = '19';
  protected getRequiredNodeVersion(): string { return '>=18.19.1'; }
  protected getRequiredTypeScriptVersion(): string { return '>=5.5.0 <5.6.0'; }
  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    console.log('Applying Angular 19 specific changes...');
  }
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange('ng19-zoneless', 'api', 'high', 'Zoneless change detection available', 'Optional zoneless change detection', 'Zoneless detection is opt-in - Zone.js continues to work')
    ];
  }
}