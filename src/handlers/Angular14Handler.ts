import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions } from '../types';

export class Angular14Handler extends BaseVersionHandler {
  readonly version = '14';

  protected getRequiredNodeVersion(): string {
    return '>=14.15.0';
  }

  protected getRequiredTypeScriptVersion(): string {
    return '>=4.7.2 <4.8.0';
  }

  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    console.log('Applying Angular 14 specific changes...');
    // Angular 14 specific changes would be implemented here
  }

  getBreakingChanges(): BreakingChange[] {
    return [
      this.createBreakingChange(
        'ng14-standalone-components',
        'api',
        'medium',
        'Standalone components introduced',
        'New way to create components without NgModules',
        'Standalone components are optional - existing NgModule approach still works'
      )
    ];
  }
}