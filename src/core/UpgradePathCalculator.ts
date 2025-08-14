import * as semver from 'semver';
import { 
  AngularVersion, 
  UpgradePath, 
  UpgradeStep, 
  UpgradeOptions,
  Prerequisite,
  BreakingChange,
  ValidationStep
} from '../types';
import { VersionHandlerRegistry } from './VersionHandlerRegistry';

export class UpgradePathCalculator {
  private versionHandlers: VersionHandlerRegistry;
  private supportedVersions: string[] = ['12', '13', '14', '15', '16', '17', '18', '19', '20'];

  constructor() {
    this.versionHandlers = new VersionHandlerRegistry();
  }

  /**
   * Calculate optimal upgrade path from current to target version
   */
  async calculatePath(
    currentVersion: AngularVersion,
    targetVersion: AngularVersion,
    options: UpgradeOptions
  ): Promise<UpgradePath> {
    // Validate version compatibility
    this.validateVersions(currentVersion, targetVersion);

    // Generate version sequence
    const versionSequence = this.generateVersionSequence(currentVersion.major, targetVersion.major);

    // Create upgrade steps
    const steps = await this.createUpgradeSteps(versionSequence, options);

    return {
      from: currentVersion,
      to: targetVersion,
      steps
    };
  }

  /**
   * Generate sequence of versions for upgrade path
   */
  private generateVersionSequence(fromMajor: number, toMajor: number): string[] {
    if (fromMajor >= toMajor) {
      throw new Error(`Cannot upgrade from version ${fromMajor} to ${toMajor}. Target version must be higher.`);
    }

    const sequence: string[] = [];
    for (let version = fromMajor + 1; version <= toMajor; version++) {
      if (this.supportedVersions.includes(version.toString())) {
        sequence.push(version.toString());
      } else {
        throw new Error(`Angular version ${version} is not supported for upgrade`);
      }
    }

    return sequence;
  }

  /**
   * Create upgrade steps for version sequence
   */
  private async createUpgradeSteps(versionSequence: string[], options: UpgradeOptions): Promise<UpgradeStep[]> {
    const steps: UpgradeStep[] = [];
    
    for (let i = 0; i < versionSequence.length; i++) {
      const fromVersion = i === 0 ? 'current' : versionSequence[i - 1];
      const toVersion = versionSequence[i];
      
      const step = await this.createUpgradeStep(fromVersion, toVersion, options);
      steps.push(step);
    }

    return steps;
  }

  /**
   * Create individual upgrade step
   */
  private async createUpgradeStep(
    fromVersion: string, 
    toVersion: string, 
    options: UpgradeOptions
  ): Promise<UpgradeStep> {
    const handler = this.versionHandlers.getHandler(toVersion);
    if (!handler) {
      throw new Error(`No handler found for Angular version ${toVersion}`);
    }

    // Get prerequisites for this version
    const prerequisites = this.getPrerequisites(toVersion);

    // Get breaking changes for this version
    const breakingChanges = handler.getBreakingChanges();

    // Get validation steps
    const validations = this.getValidationSteps(toVersion, options);

    return {
      fromVersion,
      toVersion,
      required: true,
      handler: `Angular${toVersion}Handler`,
      prerequisites,
      breakingChanges,
      validations
    };
  }

  /**
   * Get prerequisites for specific Angular version
   */
  private getPrerequisites(version: string): Prerequisite[] {
    const prerequisites: Prerequisite[] = [];

    // Node.js requirements by Angular version
    const nodeRequirements: Record<string, string> = {
      '12': '>=12.20.0',
      '13': '>=12.20.0',
      '14': '>=14.15.0',
      '15': '>=14.20.0',
      '16': '>=16.14.0',
      '17': '>=18.13.0',
      '18': '>=18.19.1',
      '19': '>=18.19.1',
      '20': '>=18.19.1'
    };

    // TypeScript requirements by Angular version
    const tsRequirements: Record<string, string> = {
      '12': '>=4.2.3 <4.4.0',
      '13': '>=4.4.2 <4.6.0',
      '14': '>=4.7.2 <4.8.0',
      '15': '>=4.8.2 <4.10.0',
      '16': '>=4.9.3 <5.1.0',
      '17': '>=5.2.0 <5.3.0',
      '18': '>=5.4.0 <5.5.0',
      '19': '>=5.5.0 <5.6.0',
      '20': '>=5.6.0 <5.7.0'
    };

    // Add Node.js prerequisite
    if (nodeRequirements[version]) {
      prerequisites.push({
        type: 'node',
        name: 'Node.js',
        requiredVersion: nodeRequirements[version],
        compatibleVersions: [nodeRequirements[version]],
        critical: true
      });
    }

    // Add TypeScript prerequisite
    if (tsRequirements[version]) {
      prerequisites.push({
        type: 'typescript',
        name: 'TypeScript',
        requiredVersion: tsRequirements[version],
        compatibleVersions: [tsRequirements[version]],
        critical: true
      });
    }

    // Add Angular CLI prerequisite
    prerequisites.push({
      type: 'dependency',
      name: '@angular/cli',
      requiredVersion: `^${version}.0.0`,
      compatibleVersions: [`^${version}.0.0`],
      critical: true
    });

    return prerequisites;
  }

  /**
   * Get validation steps for version
   */
  private getValidationSteps(version: string, options: UpgradeOptions): ValidationStep[] {
    const validations: ValidationStep[] = [
      {
        type: 'build',
        command: 'npm run build',
        timeout: 300000,
        required: true,
        description: `Validate build after Angular ${version} upgrade`
      }
    ];

    if (options.validationLevel === 'comprehensive') {
      validations.push(
        {
          type: 'test',
          command: 'npm test -- --watch=false',
          timeout: 600000,
          required: true,
          description: `Run tests after Angular ${version} upgrade`
        },
        {
          type: 'lint',
          command: 'npm run lint',
          timeout: 120000,
          required: false,
          description: `Lint code after Angular ${version} upgrade`
        }
      );
    }

    return validations;
  }

  /**
   * Validate version compatibility
   */
  private validateVersions(currentVersion: AngularVersion, targetVersion: AngularVersion): void {
    if (currentVersion.major >= targetVersion.major) {
      throw new Error(
        `Invalid upgrade path: Cannot upgrade from ${currentVersion.full} to ${targetVersion.full}. ` +
        'Target version must be higher than current version.'
      );
    }

    if (!this.supportedVersions.includes(currentVersion.major.toString())) {
      throw new Error(
        `Current Angular version ${currentVersion.major} is not supported. ` +
        `Supported versions: ${this.supportedVersions.join(', ')}`
      );
    }

    if (!this.supportedVersions.includes(targetVersion.major.toString())) {
      throw new Error(
        `Target Angular version ${targetVersion.major} is not supported. ` +
        `Supported versions: ${this.supportedVersions.join(', ')}`
      );
    }

    // Check for version gaps
    const versionGap = targetVersion.major - currentVersion.major;
    if (versionGap > 8) {
      throw new Error(
        `Large version gap detected (${versionGap} major versions). ` +
        'Consider upgrading in smaller increments for safety.'
      );
    }
  }

  /**
   * Get estimated upgrade time
   */
  getEstimatedUpgradeTime(path: UpgradePath, options: UpgradeOptions): number {
    let baseTimePerStep = 15; // minutes

    // Adjust based on strategy
    switch (options.strategy) {
      case 'conservative':
        baseTimePerStep *= 1.5;
        break;
      case 'progressive':
        baseTimePerStep *= 0.8;
        break;
    }

    // Adjust based on validation level
    if (options.validationLevel === 'comprehensive') {
      baseTimePerStep *= 1.3;
    }

    return path.steps.length * baseTimePerStep;
  }

  /**
   * Get upgrade complexity score
   */
  getUpgradeComplexity(path: UpgradePath): { score: number; factors: string[] } {
    let score = 0;
    const factors: string[] = [];

    // Base complexity per step
    score += path.steps.length * 10;

    // Breaking changes complexity
    for (const step of path.steps) {
      const criticalChanges = step.breakingChanges.filter(bc => bc.severity === 'critical').length;
      const highChanges = step.breakingChanges.filter(bc => bc.severity === 'high').length;
      
      score += criticalChanges * 20;
      score += highChanges * 10;

      if (criticalChanges > 0) {
        factors.push(`Angular ${step.toVersion}: ${criticalChanges} critical breaking changes`);
      }
    }

    // Large version jumps
    const versionJump = path.to.major - path.from.major;
    if (versionJump > 4) {
      score += versionJump * 5;
      factors.push(`Large version jump: ${versionJump} major versions`);
    }

    // Specific version complications
    const complicatedVersions = ['13', '15', '17']; // Known complex upgrades
    for (const step of path.steps) {
      if (complicatedVersions.includes(step.toVersion)) {
        score += 15;
        factors.push(`Angular ${step.toVersion} includes significant architectural changes`);
      }
    }

    return { score, factors };
  }

  /**
   * Optimize upgrade path based on project analysis
   */
  async optimizePath(
    path: UpgradePath, 
    projectAnalysis: any, 
    options: UpgradeOptions
  ): Promise<UpgradePath> {
    // For now, return the original path
    // In a full implementation, this would analyze the project
    // and potentially suggest alternative paths or optimizations
    return path;
  }

  /**
   * Get alternative upgrade paths
   */
  getAlternativePaths(
    currentVersion: AngularVersion,
    targetVersion: AngularVersion
  ): UpgradePath[] {
    // For now, return empty array
    // In a full implementation, this could suggest different strategies
    // like skipping intermediate versions where safe
    return [];
  }
}