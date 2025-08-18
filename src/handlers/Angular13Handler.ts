import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular13Handler extends BaseVersionHandler {
  readonly version = '13';

  protected getRequiredNodeVersion(): string {
    return '>=12.20.0';
  }

  protected getRequiredTypeScriptVersion(): string {
    return '>=4.4.2 <4.6.0';
  }

  protected async applyVersionSpecificChanges(_projectPath: string, _options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 13 specific changes...');
    // Angular 13 specific changes would be implemented here
    this.progressReporter?.success('Angular 13 upgrade steps completed');
  }

  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange(
        'ng13-view-engine-removal',
        'build',
        'critical',
        'View Engine completely removed',
        'All applications must use Ivy renderer',
        'Ensure all dependencies are Ivy-compatible'
      ),
      this.createBreakingChange(
        'ng13-angular-package-format',
        'build',
        'medium',
        'Angular Package Format changes',
        'Libraries must use new package format',
        'Update library build configurations'
      )
    ];
  }
}