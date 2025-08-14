import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular18Handler extends BaseVersionHandler {
  readonly version = '18';
  protected getRequiredNodeVersion(): string { return '>=18.19.1'; }
  protected getRequiredTypeScriptVersion(): string { return '>=5.4.0 <5.5.0'; }
  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    console.log('Applying Angular 18 specific changes...');
  }
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange('ng18-material3', 'dependency', 'medium', 'Material 3 support', 'Angular Material updated with Material Design 3', 'Review Material component designs for visual changes')
    ];
  }
}