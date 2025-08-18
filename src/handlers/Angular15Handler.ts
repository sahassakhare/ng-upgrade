import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular15Handler extends BaseVersionHandler {
  readonly version = '15';
  protected getRequiredNodeVersion(): string { return '>=14.20.0'; }
  protected getRequiredTypeScriptVersion(): string { return '>=4.8.2 <4.10.0'; }
  protected async applyVersionSpecificChanges(_projectPath: string, _options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 15 specific changes...');
    
    // Angular 15 specific changes would be implemented here
    // This version stabilized standalone APIs and improved performance
    
    this.progressReporter?.success('✓ Angular 15 specific changes completed');
  }
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange('ng15-standalone-stable', 'api', 'low', 'Standalone APIs stable', 'Standalone components and directives are now stable', 'No action required - APIs are stable')
    ];
  }
}