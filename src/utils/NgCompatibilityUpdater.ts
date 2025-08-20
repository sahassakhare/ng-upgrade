import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';
import semver from 'semver';

export interface DependencyUpdate {
  name: string;
  currentVersion: string;
  compatibleVersion: string;
  updateType: 'major' | 'minor' | 'patch' | 'compatible' | 'deprecated';
  notes?: string;
  required: boolean;
}

export interface UpdateResult {
  updates: DependencyUpdate[];
  warnings: string[];
  deprecated: string[];
  totalUpdates: number;
  criticalUpdates: number;
}

/**
 * Angular-aware dependency updater similar to npm-check-updates
 * Automatically detects and updates dependencies to Angular-compatible versions
 */
export class NgCompatibilityUpdater {
  private angularVersion: string;
  private compatibilityMatrix: Map<string, any>;

  constructor(angularVersion: string) {
    this.angularVersion = angularVersion;
    this.compatibilityMatrix = this.buildCompatibilityMatrix();
  }

  /**
   * Check and update all dependencies for Angular compatibility
   */
  async checkAndUpdate(projectPath: string, options: {
    dryRun?: boolean;
    includeDevDependencies?: boolean;
    onlyAngularEcosystem?: boolean;
    updateStrategy?: 'conservative' | 'aggressive';
  } = {}): Promise<UpdateResult> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (!await fs.pathExists(packageJsonPath)) {
      throw new Error('package.json not found');
    }

    const packageJson = await fs.readJson(packageJsonPath);
    const result: UpdateResult = {
      updates: [],
      warnings: [],
      deprecated: [],
      totalUpdates: 0,
      criticalUpdates: 0
    };

    // Check dependencies
    if (packageJson.dependencies) {
      const depUpdates = await this.checkDependencies(
        packageJson.dependencies, 
        'dependencies',
        options
      );
      result.updates.push(...depUpdates.updates);
      result.warnings.push(...depUpdates.warnings);
      result.deprecated.push(...depUpdates.deprecated);
    }

    // Check devDependencies if requested
    if (options.includeDevDependencies && packageJson.devDependencies) {
      const devDepUpdates = await this.checkDependencies(
        packageJson.devDependencies,
        'devDependencies', 
        options
      );
      result.updates.push(...devDepUpdates.updates);
      result.warnings.push(...devDepUpdates.warnings);
      result.deprecated.push(...devDepUpdates.deprecated);
    }

    result.totalUpdates = result.updates.length;
    result.criticalUpdates = result.updates.filter(u => u.required || u.updateType === 'major').length;

    // Apply updates if not dry run
    if (!options.dryRun && result.updates.length > 0) {
      await this.applyUpdates(packageJsonPath, packageJson, result.updates);
    }

    return result;
  }

  /**
   * Check specific dependencies for updates
   */
  private async checkDependencies(
    dependencies: Record<string, string>,
    type: 'dependencies' | 'devDependencies',
    options: any
  ): Promise<{ updates: DependencyUpdate[], warnings: string[], deprecated: string[] }> {
    const updates: DependencyUpdate[] = [];
    const warnings: string[] = [];
    const deprecated: string[] = [];

    for (const [name, currentVersion] of Object.entries(dependencies)) {
      try {
        const updateInfo = await this.checkPackageUpdate(name, currentVersion, options);
        
        if (updateInfo) {
          updates.push({
            ...updateInfo,
            name
          });

          if (updateInfo.updateType === 'deprecated') {
            deprecated.push(name);
          }
        }
      } catch (error) {
        warnings.push(`Failed to check ${name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return { updates, warnings, deprecated };
  }

  /**
   * Check individual package for Angular compatibility
   */
  private async checkPackageUpdate(
    packageName: string, 
    currentVersion: string,
    options: any
  ): Promise<Omit<DependencyUpdate, 'name'> | null> {
    // Skip if only checking Angular ecosystem and this isn't an Angular package
    if (options.onlyAngularEcosystem && !this.isAngularEcosystemPackage(packageName)) {
      return null;
    }

    // Check if package is in our compatibility matrix
    const compatibilityInfo = this.compatibilityMatrix.get(packageName);
    
    if (compatibilityInfo) {
      return this.getCompatibilityUpdate(packageName, currentVersion, compatibilityInfo, options);
    }

    // For packages not in matrix, try to get latest compatible version
    return this.getLatestCompatibleVersion(packageName, currentVersion, options);
  }

  /**
   * Get update info from compatibility matrix
   */
  private getCompatibilityUpdate(
    packageName: string,
    currentVersion: string,
    compatibilityInfo: any,
    options: any
  ): Omit<DependencyUpdate, 'name'> | null {
    const targetVersionInfo = compatibilityInfo[this.angularVersion];
    
    if (!targetVersionInfo) {
      return null;
    }

    // Handle deprecated packages
    if (targetVersionInfo.deprecated) {
      return {
        currentVersion,
        compatibleVersion: 'DEPRECATED',
        updateType: 'deprecated',
        notes: targetVersionInfo.deprecationMessage || `${packageName} is deprecated for Angular ${this.angularVersion}`,
        required: false
      };
    }

    const compatibleVersion = targetVersionInfo.version;
    const cleanCurrent = this.cleanVersion(currentVersion);
    const cleanCompatible = this.cleanVersion(compatibleVersion);

    if (semver.eq(cleanCurrent, cleanCompatible)) {
      return null; // Already up to date
    }

    const updateType = this.determineUpdateType(cleanCurrent, cleanCompatible);
    
    return {
      currentVersion,
      compatibleVersion,
      updateType,
      notes: targetVersionInfo.notes,
      required: targetVersionInfo.required || updateType === 'major'
    };
  }

  /**
   * Get latest compatible version from npm registry
   */
  private async getLatestCompatibleVersion(
    packageName: string,
    currentVersion: string,
    options: any
  ): Promise<Omit<DependencyUpdate, 'name'> | null> {
    try {
      // Get package info from npm
      const packageInfo = await this.getPackageInfo(packageName);
      
      if (!packageInfo) {
        return null;
      }

      // Find best compatible version based on Angular peer dependencies
      const compatibleVersion = await this.findAngularCompatibleVersion(packageInfo);
      
      if (!compatibleVersion) {
        return null;
      }

      const cleanCurrent = this.cleanVersion(currentVersion);
      const cleanCompatible = this.cleanVersion(compatibleVersion);

      if (semver.gte(cleanCurrent, cleanCompatible)) {
        return null; // Current version is already compatible or newer
      }

      const updateType = this.determineUpdateType(cleanCurrent, cleanCompatible);
      
      // Only suggest updates for conservative strategy if they're minor/patch
      if (options.updateStrategy === 'conservative' && updateType === 'major') {
        return null;
      }

      return {
        currentVersion,
        compatibleVersion,
        updateType,
        notes: `Auto-detected Angular ${this.angularVersion} compatible version`,
        required: false
      };
    } catch (error) {
      // Silently fail for packages that can't be checked
      return null;
    }
  }

  /**
   * Get package information from npm registry
   */
  private async getPackageInfo(packageName: string): Promise<any> {
    try {
      const result = execSync(`npm view ${packageName} --json`, { 
        encoding: 'utf8',
        timeout: 5000 
      });
      return JSON.parse(result);
    } catch (error) {
      return null;
    }
  }

  /**
   * Find Angular-compatible version by checking peer dependencies
   */
  private async findAngularCompatibleVersion(packageInfo: any): Promise<string | null> {
    const versions = Object.keys(packageInfo.versions || {}).reverse(); // Latest first
    const majorAngularVersion = parseInt(this.angularVersion);

    for (const version of versions) {
      const versionInfo = packageInfo.versions[version];
      const peerDeps = versionInfo.peerDependencies || {};
      
      // Check if this version supports our Angular version
      const angularPeerDep = peerDeps['@angular/core'] || peerDeps['@angular/common'];
      
      if (angularPeerDep) {
        // Parse the peer dependency range
        const supportedAngularVersions = this.parseVersionRange(angularPeerDep);
        
        if (supportedAngularVersions.includes(majorAngularVersion)) {
          return version;
        }
      }
    }

    // Fallback: return latest version
    return packageInfo['dist-tags']?.latest || null;
  }

  /**
   * Parse npm version range to extract supported versions
   */
  private parseVersionRange(range: string): number[] {
    const versions: number[] = [];
    
    // Handle ranges like "^16.0.0 || ^17.0.0" or ">=16.0.0 <19.0.0"
    const cleanRange = range.replace(/[\^~]/g, '').replace(/\|\|/g, ' ');
    const versionMatches = cleanRange.match(/\d+/g);
    
    if (versionMatches) {
      const uniqueVersions = [...new Set(versionMatches.map(v => parseInt(v)))];
      versions.push(...uniqueVersions.filter(v => v >= 12 && v <= 25)); // Reasonable Angular version range
    }
    
    return versions;
  }

  /**
   * Apply updates to package.json
   */
  private async applyUpdates(
    packageJsonPath: string,
    packageJson: any,
    updates: DependencyUpdate[]
  ): Promise<void> {
    for (const update of updates) {
      if (update.updateType === 'deprecated') {
        // Remove deprecated packages
        if (packageJson.dependencies?.[update.name]) {
          delete packageJson.dependencies[update.name];
        }
        if (packageJson.devDependencies?.[update.name]) {
          delete packageJson.devDependencies[update.name];
        }
      } else {
        // Update to compatible version
        if (packageJson.dependencies?.[update.name]) {
          packageJson.dependencies[update.name] = update.compatibleVersion;
        }
        if (packageJson.devDependencies?.[update.name]) {
          packageJson.devDependencies[update.name] = update.compatibleVersion;
        }
      }
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  /**
   * Build comprehensive Angular compatibility matrix
   */
  private buildCompatibilityMatrix(): Map<string, any> {
    const matrix = new Map();

    // Angular ecosystem packages
    const angularPackages = [
      '@angular/core', '@angular/common', '@angular/forms', '@angular/http',
      '@angular/platform-browser', '@angular/platform-browser-dynamic',
      '@angular/router', '@angular/animations', '@angular/material',
      '@angular/cdk', '@angular/cli', '@angular/compiler-cli'
    ];

    angularPackages.forEach(pkg => {
      matrix.set(pkg, this.getAngularVersionMap(pkg));
    });

    // Third-party Angular ecosystem
    matrix.set('@ngrx/store', {
      '12': { version: '^12.0.0' },
      '13': { version: '^13.0.0' },
      '14': { version: '^14.0.0' },
      '15': { version: '^15.0.0' },
      '16': { version: '^16.0.0' },
      '17': { version: '^17.0.0' },
      '18': { version: '^18.0.0' },
      '19': { version: '^19.0.0' },
      '20': { version: '^20.0.0' }
    });

    matrix.set('@ngrx/effects', {
      '12': { version: '^12.0.0' },
      '13': { version: '^13.0.0' },
      '14': { version: '^14.0.0' },
      '15': { version: '^15.0.0' },
      '16': { version: '^16.0.0' },
      '17': { version: '^17.0.0' },
      '18': { version: '^18.0.0' },
      '19': { version: '^19.0.0' },
      '20': { version: '^20.0.0' }
    });

    matrix.set('primeng', {
      '12': { version: '^12.0.0' },
      '13': { version: '^13.0.0' },
      '14': { version: '^14.0.0' },
      '15': { version: '^15.0.0' },
      '16': { version: '^16.0.0' },
      '17': { version: '^17.0.0' },
      '18': { version: '^18.0.0' },
      '19': { version: '^19.0.0' },
      '20': { version: '^20.0.0' }
    });

    matrix.set('@ng-bootstrap/ng-bootstrap', {
      '12': { version: '^10.0.0' },
      '13': { version: '^11.0.0' },
      '14': { version: '^12.0.0' },
      '15': { version: '^14.0.0' },
      '16': { version: '^15.0.0' },
      '17': { version: '^16.0.0' },
      '18': { version: '^17.0.0' },
      '19': { version: '^18.0.0' },
      '20': { version: '^19.0.0' }
    });

    // Deprecated packages
    matrix.set('@angular/flex-layout', {
      '12': { version: '^12.0.0' },
      '13': { version: '^13.0.0' },
      '14': { version: '^14.0.0', notes: 'Consider migrating to CSS Grid/Flexbox' },
      '15': { deprecated: true, deprecationMessage: 'Angular Flex Layout is deprecated. Migrate to CSS Grid and Flexbox.' },
      '16': { deprecated: true, deprecationMessage: 'Angular Flex Layout is deprecated. Use modern CSS layout solutions.' },
      '17': { deprecated: true, deprecationMessage: 'Angular Flex Layout is no longer maintained. Use CSS Grid and Flexbox.' },
      '18': { deprecated: true, deprecationMessage: 'Angular Flex Layout is no longer maintained. Use CSS Grid and Flexbox.' },
      '19': { deprecated: true, deprecationMessage: 'Angular Flex Layout is no longer maintained. Use CSS Grid and Flexbox.' },
      '20': { deprecated: true, deprecationMessage: 'Angular Flex Layout is no longer maintained. Use CSS Grid and Flexbox.' }
    });

    // TypeScript compatibility
    matrix.set('typescript', {
      '12': { version: '~4.3.0' },
      '13': { version: '~4.4.0' },
      '14': { version: '~4.7.0' },
      '15': { version: '~4.8.0' },
      '16': { version: '~4.9.0' },
      '17': { version: '~5.2.0' },
      '18': { version: '~5.4.0' },
      '19': { version: '~5.5.0' },
      '20': { version: '~5.6.0' }
    });

    return matrix;
  }

  /**
   * Generate Angular package version map
   */
  private getAngularVersionMap(packageName: string): any {
    const baseMap: any = {};
    
    for (let version = 12; version <= 20; version++) {
      baseMap[version.toString()] = {
        version: `^${version}.0.0`,
        required: true
      };
    }
    
    return baseMap;
  }

  /**
   * Check if package is part of Angular ecosystem
   */
  private isAngularEcosystemPackage(packageName: string): boolean {
    const angularPatterns = [
      /^@angular\//,
      /^@ngrx\//,
      /^@ng-bootstrap\//,
      /^@ionic\//,
      /^primeng$/,
      /^primeicons$/,
      /angular/i
    ];

    return angularPatterns.some(pattern => pattern.test(packageName));
  }

  /**
   * Clean version string for semver comparison
   */
  private cleanVersion(version: string): string {
    return version.replace(/^[\^~]/, '');
  }

  /**
   * Determine update type
   */
  private determineUpdateType(current: string, target: string): 'major' | 'minor' | 'patch' | 'compatible' {
    if (semver.major(target) > semver.major(current)) {
      return 'major';
    } else if (semver.minor(target) > semver.minor(current)) {
      return 'minor';
    } else if (semver.patch(target) > semver.patch(current)) {
      return 'patch';
    }
    return 'compatible';
  }

  /**
   * Generate update report similar to npm-check-updates
   */
  generateReport(result: UpdateResult): string {
    let report = `\n🔍 Angular ${this.angularVersion} Compatibility Check\n`;
    report += '='.repeat(50) + '\n\n';

    if (result.updates.length === 0) {
      report += '✅ All dependencies are already compatible with Angular ' + this.angularVersion + '\n';
      return report;
    }

    report += `📊 Found ${result.totalUpdates} updates (${result.criticalUpdates} critical)\n\n`;

    // Group updates by type
    const groups = {
      critical: result.updates.filter(u => u.required),
      major: result.updates.filter(u => u.updateType === 'major' && !u.required),
      minor: result.updates.filter(u => u.updateType === 'minor'),
      patch: result.updates.filter(u => u.updateType === 'patch'),
      deprecated: result.updates.filter(u => u.updateType === 'deprecated')
    };

    Object.entries(groups).forEach(([type, updates]) => {
      if (updates.length > 0) {
        report += `\n${this.getTypeIcon(type)} ${type.toUpperCase()} UPDATES:\n`;
        updates.forEach(update => {
          report += `  ${update.name}: ${update.currentVersion} → ${update.compatibleVersion}`;
          if (update.notes) {
            report += ` (${update.notes})`;
          }
          report += '\n';
        });
      }
    });

    if (result.warnings.length > 0) {
      report += '\n⚠️  WARNINGS:\n';
      result.warnings.forEach(warning => {
        report += `  ${warning}\n`;
      });
    }

    report += '\n💡 Run with --apply to update package.json\n';
    return report;
  }

  private getTypeIcon(type: string): string {
    const icons = {
      critical: '🚨',
      major: '🔴',
      minor: '🟡', 
      patch: '🟢',
      deprecated: '🗑️'
    };
    return icons[type as keyof typeof icons] || '📦';
  }
}