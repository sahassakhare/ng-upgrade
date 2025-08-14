import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular15Handler extends BaseVersionHandler {
  readonly version = '15';
  protected getRequiredNodeVersion(): string { return '>=14.20.0'; }
  protected getRequiredTypeScriptVersion(): string { return '>=4.8.2 <4.10.0'; }
  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    console.log('Applying Angular 15 specific changes...');
  }
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange('ng15-standalone-stable', 'api', 'low', 'Standalone APIs stable', 'Standalone components and directives are now stable', 'No action required - APIs are stable')
    ];
  }
}