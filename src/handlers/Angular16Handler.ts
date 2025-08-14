import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular16Handler extends BaseVersionHandler {
  readonly version = '16';
  protected getRequiredNodeVersion(): string { return '>=16.14.0'; }
  protected getRequiredTypeScriptVersion(): string { return '>=4.9.3 <5.1.0'; }
  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    console.log('Applying Angular 16 specific changes...');
  }
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange('ng16-required-inputs', 'api', 'medium', 'Required inputs introduced', 'New required inputs API available', 'Optional feature - existing inputs continue to work')
    ];
  }
}