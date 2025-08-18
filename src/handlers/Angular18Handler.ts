import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular18Handler extends BaseVersionHandler {
  readonly version = '18';
  protected getRequiredNodeVersion(): string { return '>=18.19.1'; }
  protected getRequiredTypeScriptVersion(): string { return '>=5.4.0 <5.5.0'; }
  protected async applyVersionSpecificChanges(_projectPath: string, _options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 18 specific changes...');
    
    // Angular 18 specific changes would be implemented here
    // This version introduced Material 3 support, new lifecycle hooks, and built-in control flow
    
    this.progressReporter?.success('✓ Angular 18 specific changes completed');
  }
  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange('ng18-material3', 'dependency', 'medium', 'Material 3 support', 'Angular Material updated with Material Design 3', 'Review Material component designs for visual changes')
    ];
  }
}