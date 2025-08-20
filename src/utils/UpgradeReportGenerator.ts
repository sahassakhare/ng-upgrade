import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { 
  BreakingChange,
  MigrationAction
} from '../types';
import { ValidationResult as BaseValidationResult } from '../core/ValidatorFramework';

export interface ValidationResult extends BaseValidationResult {
  testResults?: {
    total: number;
    passed: number;
    failed: number;
  };
}

export interface ReportSection {
  title: string;
  content: string | string[];
  level: 'info' | 'success' | 'warning' | 'error';
  subsections?: ReportSection[];
}

export interface UpgradeReport {
  projectName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  fromVersion: string;
  toVersion: string;
  strategy: string;
  success: boolean;
  sections: ReportSection[];
  summary: ReportSummary;
  metadata: ReportMetadata;
}

export interface ReportSummary {
  totalFiles: number;
  filesModified: number;
  filesCreated: number;
  filesDeleted: number;
  dependenciesUpdated: number;
  breakingChangesResolved: number;
  migrationsRun: number;
  testsRun: number;
  testsPassed: number;
  testsFailed: number;
  warningsCount: number;
  errorsCount: number;
  backupsCreated: number;
  checkpointsCreated: number;
}

export interface ReportMetadata {
  nodeVersion: string;
  npmVersion: string;
  angularCliVersion: string;
  typeScriptVersion: string;
  operatingSystem: string;
  projectPath: string;
  reportGeneratedAt: Date;
  reportVersion: string;
}

export interface FileChange {
  path: string;
  type: 'modified' | 'created' | 'deleted' | 'renamed';
  changes: string[];
  linesAdded: number;
  linesRemoved: number;
  breakingChanges?: string[];
  migrations?: string[];
}

export interface DependencyChange {
  name: string;
  previousVersion: string;
  newVersion: string;
  type: 'production' | 'development' | 'peer';
  breaking: boolean;
  notes?: string;
}

export class UpgradeReportGenerator {
  private report: UpgradeReport;
  private fileChanges: Map<string, FileChange> = new Map();
  private dependencyChanges: Map<string, DependencyChange> = new Map();
  private breakingChanges: BreakingChange[] = [];
  private migrations: MigrationAction[] = [];
  private validationResults: ValidationResult[] = [];
  private warnings: string[] = [];
  private errors: string[] = [];
  private successStories: string[] = [];

  constructor(
    private projectPath: string,
    private projectName: string,
    private fromVersion: string,
    private toVersion: string,
    private strategy: string
  ) {
    this.report = this.initializeReport();
  }

  private initializeReport(): UpgradeReport {
    return {
      projectName: this.projectName,
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      fromVersion: this.fromVersion,
      toVersion: this.toVersion,
      strategy: this.strategy,
      success: false,
      sections: [],
      summary: {
        totalFiles: 0,
        filesModified: 0,
        filesCreated: 0,
        filesDeleted: 0,
        dependenciesUpdated: 0,
        breakingChangesResolved: 0,
        migrationsRun: 0,
        testsRun: 0,
        testsPassed: 0,
        testsFailed: 0,
        warningsCount: 0,
        errorsCount: 0,
        backupsCreated: 0,
        checkpointsCreated: 0
      },
      metadata: this.collectMetadata()
    };
  }

  private collectMetadata(): ReportMetadata {
    return {
      nodeVersion: process.version,
      npmVersion: this.getNpmVersion(),
      angularCliVersion: this.getAngularCliVersion(),
      typeScriptVersion: this.getTypeScriptVersion(),
      operatingSystem: `${process.platform} ${process.arch}`,
      projectPath: this.projectPath,
      reportGeneratedAt: new Date(),
      reportVersion: '1.0.0'
    };
  }

  private getNpmVersion(): string {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { execSync } = require('child_process');
      return execSync('npm --version').toString().trim();
    } catch {
      return 'unknown';
    }
  }

  private getAngularCliVersion(): string {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      const packageJson = fs.readJsonSync(packageJsonPath);
      return packageJson.devDependencies?.['@angular/cli'] || 
             packageJson.dependencies?.['@angular/cli'] || 
             'unknown';
    } catch {
      return 'unknown';
    }
  }

  private getTypeScriptVersion(): string {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      const packageJson = fs.readJsonSync(packageJsonPath);
      return packageJson.devDependencies?.['typescript'] || 
             packageJson.dependencies?.['typescript'] || 
             'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Track file changes during upgrade
   */
  public trackFileChange(change: FileChange): void {
    this.fileChanges.set(change.path, change);
    
    // Update summary
    switch (change.type) {
      case 'modified':
        this.report.summary.filesModified++;
        break;
      case 'created':
        this.report.summary.filesCreated++;
        break;
      case 'deleted':
        this.report.summary.filesDeleted++;
        break;
    }
  }

  /**
   * Track dependency updates
   */
  public trackDependencyChange(change: DependencyChange): void {
    this.dependencyChanges.set(change.name, change);
    this.report.summary.dependenciesUpdated++;
  }

  /**
   * Track breaking changes
   */
  public trackBreakingChange(change: BreakingChange): void {
    this.breakingChanges.push(change);
    this.report.summary.breakingChangesResolved++;
  }

  /**
   * Track migrations
   */
  public trackMigration(migration: MigrationAction): void {
    this.migrations.push(migration);
    this.report.summary.migrationsRun++;
  }

  /**
   * Track validation results
   */
  public trackValidation(result: ValidationResult): void {
    this.validationResults.push(result);
    if (result.testResults) {
      this.report.summary.testsRun += result.testResults.total || 0;
      this.report.summary.testsPassed += result.testResults.passed || 0;
      this.report.summary.testsFailed += result.testResults.failed || 0;
    }
  }

  /**
   * Add warning
   */
  public addWarning(warning: string): void {
    this.warnings.push(warning);
    this.report.summary.warningsCount++;
  }

  /**
   * Add error
   */
  public addError(error: string): void {
    this.errors.push(error);
    this.report.summary.errorsCount++;
  }

  /**
   * Add success story
   */
  public addSuccessStory(story: string): void {
    this.successStories.push(story);
  }

  /**
   * Track checkpoint creation
   */
  public trackCheckpoint(_checkpointId: string): void {
    this.report.summary.checkpointsCreated++;
  }

  /**
   * Track backup creation
   */
  public trackBackup(_backupPath: string): void {
    this.report.summary.backupsCreated++;
  }

  /**
   * Finalize and generate the report
   */
  public async generateReport(success: boolean): Promise<string> {
    this.report.endTime = new Date();
    this.report.duration = this.report.endTime.getTime() - this.report.startTime.getTime();
    this.report.success = success;
    this.report.summary.totalFiles = this.fileChanges.size;

    // Build report sections
    this.buildReportSections();

    // Generate reports in multiple formats
    const reportDir = path.join(this.projectPath, '.ng-upgrade', 'reports');
    await fs.ensureDir(reportDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFileName = `upgrade-report-${this.fromVersion}-to-${this.toVersion}-${timestamp}`;

    // Generate HTML report
    const htmlPath = path.join(reportDir, `${baseFileName}.html`);
    await this.generateHtmlReport(htmlPath);

    // Generate Markdown report
    const mdPath = path.join(reportDir, `${baseFileName}.md`);
    await this.generateMarkdownReport(mdPath);

    // Generate JSON report
    const jsonPath = path.join(reportDir, `${baseFileName}.json`);
    await this.generateJsonReport(jsonPath);

    // Generate summary in console
    this.printConsoleSummary();

    return htmlPath;
  }

  private buildReportSections(): void {
    // Executive Summary
    this.report.sections.push(this.buildExecutiveSummary());

    // Upgrade Path
    this.report.sections.push(this.buildUpgradePathSection());

    // File Changes
    if (this.fileChanges.size > 0) {
      this.report.sections.push(this.buildFileChangesSection());
    }

    // Dependency Updates
    if (this.dependencyChanges.size > 0) {
      this.report.sections.push(this.buildDependencySection());
    }

    // Breaking Changes
    if (this.breakingChanges.length > 0) {
      this.report.sections.push(this.buildBreakingChangesSection());
    }

    // Migrations
    if (this.migrations.length > 0) {
      this.report.sections.push(this.buildMigrationsSection());
    }

    // Validation Results
    if (this.validationResults.length > 0) {
      this.report.sections.push(this.buildValidationSection());
    }

    // Warnings and Errors
    if (this.warnings.length > 0 || this.errors.length > 0) {
      this.report.sections.push(this.buildIssuesSection());
    }

    // Success Stories
    if (this.successStories.length > 0) {
      this.report.sections.push(this.buildSuccessStoriesSection());
    }

    // Recommendations
    this.report.sections.push(this.buildRecommendationsSection());
  }

  private buildExecutiveSummary(): ReportSection {
    const duration = this.formatDuration(this.report.duration);
    const status = this.report.success ? 'Successfully Completed' : 'Completed with Issues';
    
    return {
      title: 'Executive Summary',
      level: this.report.success ? 'success' : 'warning',
      content: [
        `Project: ${this.report.projectName}`,
        `Status: ${status}`,
        `Upgrade Path: Angular ${this.fromVersion} → Angular ${this.toVersion}`,
        `Strategy: ${this.strategy}`,
        `Duration: ${duration}`,
        `Files Modified: ${this.report.summary.filesModified}`,
        `Dependencies Updated: ${this.report.summary.dependenciesUpdated}`,
        `Breaking Changes Resolved: ${this.report.summary.breakingChangesResolved}`,
        `Migrations Applied: ${this.report.summary.migrationsRun}`
      ]
    };
  }

  private buildUpgradePathSection(): ReportSection {
    const steps = this.calculateUpgradeSteps();
    return {
      title: 'Upgrade Path',
      level: 'info',
      content: [
        `The upgrade from Angular ${this.fromVersion} to Angular ${this.toVersion} was completed through the following steps:`,
        ...steps.map((step, index) => `${index + 1}. Angular ${step.from} → Angular ${step.to}`)
      ]
    };
  }

  private buildFileChangesSection(): ReportSection {
    const subsections: ReportSection[] = [];
    
    // Group changes by type
    const modified = Array.from(this.fileChanges.values()).filter(f => f.type === 'modified');
    const created = Array.from(this.fileChanges.values()).filter(f => f.type === 'created');
    const deleted = Array.from(this.fileChanges.values()).filter(f => f.type === 'deleted');

    if (modified.length > 0) {
      subsections.push({
        title: `Modified Files (${modified.length})`,
        level: 'info',
        content: modified.map(f => `• ${f.path}: ${f.changes.join(', ')}`)
      });
    }

    if (created.length > 0) {
      subsections.push({
        title: `Created Files (${created.length})`,
        level: 'success',
        content: created.map(f => `• ${f.path}`)
      });
    }

    if (deleted.length > 0) {
      subsections.push({
        title: `Deleted Files (${deleted.length})`,
        level: 'warning',
        content: deleted.map(f => `• ${f.path}`)
      });
    }

    return {
      title: 'File Changes',
      level: 'info',
      content: `Total files affected: ${this.fileChanges.size}`,
      subsections
    };
  }

  private buildDependencySection(): ReportSection {
    const deps = Array.from(this.dependencyChanges.values());
    const breaking = deps.filter(d => d.breaking);
    
    const subsections: ReportSection[] = [];

    // Angular packages
    const angularDeps = deps.filter(d => d.name.startsWith('@angular/'));
    if (angularDeps.length > 0) {
      subsections.push({
        title: 'Angular Packages',
        level: 'info',
        content: angularDeps.map(d => 
          `• ${d.name}: ${d.previousVersion} → ${d.newVersion}${d.breaking ? ' ⚠️ Breaking' : ''}`
        )
      });
    }

    // Third-party packages
    const thirdPartyDeps = deps.filter(d => !d.name.startsWith('@angular/'));
    if (thirdPartyDeps.length > 0) {
      subsections.push({
        title: 'Third-Party Packages',
        level: 'info',
        content: thirdPartyDeps.map(d => 
          `• ${d.name}: ${d.previousVersion} → ${d.newVersion}${d.breaking ? ' ⚠️ Breaking' : ''}`
        )
      });
    }

    return {
      title: 'Dependency Updates',
      level: breaking.length > 0 ? 'warning' : 'info',
      content: [
        `Total dependencies updated: ${deps.length}`,
        `Breaking changes: ${breaking.length}`
      ],
      subsections
    };
  }

  private buildBreakingChangesSection(): ReportSection {
    return {
      title: 'Breaking Changes Resolved',
      level: 'warning',
      content: this.breakingChanges.map(change => 
        `• ${change.description} (${change.type})`
      )
    };
  }

  private buildMigrationsSection(): ReportSection {
    return {
      title: 'Migrations Applied',
      level: 'success',
      content: this.migrations.map(migration => 
        `• ${migration.instructions || 'Migration applied'} (${migration.type})`
      )
    };
  }

  private buildValidationSection(): ReportSection {
    const totalTests = this.report.summary.testsRun;
    const passed = this.report.summary.testsPassed;
    const failed = this.report.summary.testsFailed;
    const successRate = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(1) : '0';

    return {
      title: 'Validation Results',
      level: failed > 0 ? 'warning' : 'success',
      content: [
        `Tests Run: ${totalTests}`,
        `Tests Passed: ${passed}`,
        `Tests Failed: ${failed}`,
        `Success Rate: ${successRate}%`
      ]
    };
  }

  private buildIssuesSection(): ReportSection {
    const subsections: ReportSection[] = [];

    if (this.errors.length > 0) {
      subsections.push({
        title: `Errors (${this.errors.length})`,
        level: 'error',
        content: this.errors.map(e => `• ${e}`)
      });
    }

    if (this.warnings.length > 0) {
      subsections.push({
        title: `Warnings (${this.warnings.length})`,
        level: 'warning',
        content: this.warnings.map(w => `• ${w}`)
      });
    }

    return {
      title: 'Issues Encountered',
      level: this.errors.length > 0 ? 'error' : 'warning',
      content: `Total issues: ${this.errors.length + this.warnings.length}`,
      subsections
    };
  }

  private buildSuccessStoriesSection(): ReportSection {
    return {
      title: 'Success Highlights',
      level: 'success',
      content: this.successStories.map(s => `✅ ${s}`)
    };
  }

  private buildRecommendationsSection(): ReportSection {
    const recommendations: string[] = [];

    // Build recommendations based on the upgrade results
    if (this.report.summary.testsFailed > 0) {
      recommendations.push('• Fix failing tests before deploying to production');
    }

    if (this.errors.length > 0) {
      recommendations.push('• Review and resolve all errors listed in the report');
    }

    if (this.warnings.length > 5) {
      recommendations.push('• Address warnings to improve code quality');
    }

    if (this.report.summary.breakingChangesResolved > 10) {
      recommendations.push('• Thoroughly test all features affected by breaking changes');
    }

    recommendations.push('• Run comprehensive regression testing');
    recommendations.push('• Update documentation to reflect Angular version changes');
    recommendations.push('• Train team on new Angular features and patterns');
    recommendations.push('• Monitor application performance after deployment');

    return {
      title: 'Next Steps & Recommendations',
      level: 'info',
      content: recommendations
    };
  }

  private async generateHtmlReport(filePath: string): Promise<void> {
    const html = this.generateHtmlContent();
    await fs.writeFile(filePath, html);
    console.log(chalk.green(`✓ HTML report generated: ${filePath}`));
  }

  private generateHtmlContent(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Angular Upgrade Report - ${this.fromVersion} to ${this.toVersion}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        header {
            background: linear-gradient(135deg, #DD0031 0%, #C3002F 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        .angular-logo {
            width: 50px;
            height: 50px;
        }
        .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            margin-top: 15px;
            font-weight: bold;
        }
        .status.success { background: #4CAF50; }
        .status.warning { background: #FF9800; }
        .status.error { background: #f44336; }
        .content { padding: 40px; }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .summary-card {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            transition: transform 0.3s;
        }
        .summary-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .summary-number {
            font-size: 2em;
            font-weight: bold;
            color: #DD0031;
        }
        .summary-label {
            color: #666;
            margin-top: 5px;
        }
        section {
            margin: 40px 0;
            padding: 30px;
            background: #fafafa;
            border-radius: 8px;
        }
        h2 {
            color: #DD0031;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #DD0031;
        }
        h3 {
            color: #333;
            margin: 20px 0 10px 0;
        }
        ul {
            list-style: none;
            padding-left: 0;
        }
        li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
        }
        li:before {
            content: "▸";
            position: absolute;
            left: 0;
            color: #DD0031;
        }
        .level-success { border-left: 4px solid #4CAF50; }
        .level-warning { border-left: 4px solid #FF9800; }
        .level-error { border-left: 4px solid #f44336; }
        .level-info { border-left: 4px solid #2196F3; }
        .footer {
            background: #f5f5f5;
            padding: 20px;
            text-align: center;
            color: #666;
        }
        .timestamp { font-size: 0.9em; color: #999; }
        @media (max-width: 768px) {
            .summary-grid { grid-template-columns: 1fr; }
            h1 { font-size: 1.8em; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>
                <svg class="angular-logo" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
                    <polygon fill="#DD0031" points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2"/>
                    <polygon fill="#C3002F" points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2 125,30"/>
                    <path fill="#FFFFFF" d="M125,52.1L66.8,182.6h0h21.7h0l11.7-29.2h49.4l11.7,29.2h0h21.7h0L125,52.1L125,52.1L125,52.1L125,52.1L125,52.1z M142,135.4H108l17-40.9L142,135.4z"/>
                </svg>
                Angular Upgrade Report
            </h1>
            <div class="subtitle">${this.fromVersion} → ${this.toVersion}</div>
            <div class="status ${this.report.success ? 'success' : 'warning'}">
                ${this.report.success ? 'SUCCESS' : 'COMPLETED WITH ISSUES'}
            </div>
        </header>
        
        <div class="content">
            <div class="summary-grid">
                <div class="summary-card">
                    <div class="summary-number">${this.report.summary.filesModified}</div>
                    <div class="summary-label">Files Modified</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number">${this.report.summary.dependenciesUpdated}</div>
                    <div class="summary-label">Dependencies Updated</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number">${this.report.summary.breakingChangesResolved}</div>
                    <div class="summary-label">Breaking Changes</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number">${this.report.summary.migrationsRun}</div>
                    <div class="summary-label">Migrations Run</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number">${this.formatDuration(this.report.duration)}</div>
                    <div class="summary-label">Duration</div>
                </div>
                <div class="summary-card">
                    <div class="summary-number">${this.report.summary.checkpointsCreated}</div>
                    <div class="summary-label">Checkpoints</div>
                </div>
            </div>

            ${this.report.sections.map(section => this.generateHtmlSection(section)).join('')}
        </div>
        
        <div class="footer">
            <div class="timestamp">Report generated on ${this.report.metadata.reportGeneratedAt.toLocaleString()}</div>
            <div>Angular Multi-Version Upgrade Orchestrator v${this.report.metadata.reportVersion}</div>
        </div>
    </div>
</body>
</html>`;
  }

  private generateHtmlSection(section: ReportSection): string {
    const levelClass = `level-${section.level}`;
    const content = Array.isArray(section.content) 
      ? `<ul>${section.content.map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>`
      : `<p>${this.escapeHtml(section.content)}</p>`;

    const subsections = section.subsections 
      ? section.subsections.map(sub => `
          <div style="margin-left: 20px;">
            <h3>${this.escapeHtml(sub.title)}</h3>
            ${Array.isArray(sub.content) 
              ? `<ul>${sub.content.map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>`
              : `<p>${this.escapeHtml(sub.content)}</p>`}
          </div>
        `).join('')
      : '';

    return `
      <section class="${levelClass}">
        <h2>${this.escapeHtml(section.title)}</h2>
        ${content}
        ${subsections}
      </section>
    `;
  }

  private async generateMarkdownReport(filePath: string): Promise<void> {
    const markdown = this.generateMarkdownContent();
    await fs.writeFile(filePath, markdown);
    console.log(chalk.green(`✓ Markdown report generated: ${filePath}`));
  }

  private generateMarkdownContent(): string {
    const sections = this.report.sections.map(section => 
      this.generateMarkdownSection(section)
    ).join('\n\n');

    return `# Angular Upgrade Report

## ${this.fromVersion} → ${this.toVersion}

**Status:** ${this.report.success ? '✅ Success' : '⚠️ Completed with Issues'}  
**Date:** ${this.report.metadata.reportGeneratedAt.toLocaleString()}  
**Duration:** ${this.formatDuration(this.report.duration)}

## Summary

| Metric | Value |
|--------|-------|
| Files Modified | ${this.report.summary.filesModified} |
| Dependencies Updated | ${this.report.summary.dependenciesUpdated} |
| Breaking Changes Resolved | ${this.report.summary.breakingChangesResolved} |
| Migrations Run | ${this.report.summary.migrationsRun} |
| Tests Run | ${this.report.summary.testsRun} |
| Tests Passed | ${this.report.summary.testsPassed} |
| Tests Failed | ${this.report.summary.testsFailed} |
| Warnings | ${this.report.summary.warningsCount} |
| Errors | ${this.report.summary.errorsCount} |

${sections}

---
*Generated by Angular Multi-Version Upgrade Orchestrator v${this.report.metadata.reportVersion}*
`;
  }

  private generateMarkdownSection(section: ReportSection, level: number = 2): string {
    const heading = '#'.repeat(level) + ' ' + section.title;
    const content = Array.isArray(section.content)
      ? section.content.map(item => `- ${item}`).join('\n')
      : section.content;

    const subsections = section.subsections
      ? '\n\n' + section.subsections.map(sub => 
          this.generateMarkdownSection(sub, level + 1)
        ).join('\n\n')
      : '';

    return `${heading}\n\n${content}${subsections}`;
  }

  private async generateJsonReport(filePath: string): Promise<void> {
    await fs.writeJson(filePath, this.report, { spaces: 2 });
    console.log(chalk.green(`✓ JSON report generated: ${filePath}`));
  }

  private printConsoleSummary(): void {
    console.log('\n' + chalk.bold.cyan('═'.repeat(60)));
    console.log(chalk.bold.cyan('                    UPGRADE SUMMARY'));
    console.log(chalk.bold.cyan('═'.repeat(60)));

    const status = this.report.success 
      ? chalk.green('✓ Successfully Completed')
      : chalk.yellow('⚠ Completed with Issues');

    console.log(`\n${chalk.bold('Status:')} ${status}`);
    console.log(`${chalk.bold('Upgrade:')} Angular ${this.fromVersion} → Angular ${this.toVersion}`);
    console.log(`${chalk.bold('Duration:')} ${this.formatDuration(this.report.duration)}`);
    
    console.log('\n' + chalk.bold.cyan('Key Metrics:'));
    console.log(`  • Files Modified: ${chalk.yellow(this.report.summary.filesModified)}`);
    console.log(`  • Dependencies Updated: ${chalk.yellow(this.report.summary.dependenciesUpdated)}`);
    console.log(`  • Breaking Changes: ${chalk.yellow(this.report.summary.breakingChangesResolved)}`);
    console.log(`  • Migrations Applied: ${chalk.yellow(this.report.summary.migrationsRun)}`);

    if (this.report.summary.testsRun > 0) {
      const testStatus = this.report.summary.testsFailed > 0
        ? chalk.red(`${this.report.summary.testsPassed}/${this.report.summary.testsRun} passed`)
        : chalk.green(`${this.report.summary.testsPassed}/${this.report.summary.testsRun} passed`);
      console.log(`  • Tests: ${testStatus}`);
    }

    if (this.report.summary.warningsCount > 0 || this.report.summary.errorsCount > 0) {
      console.log('\n' + chalk.bold.cyan('Issues:'));
      if (this.report.summary.errorsCount > 0) {
        console.log(`  • Errors: ${chalk.red(this.report.summary.errorsCount)}`);
      }
      if (this.report.summary.warningsCount > 0) {
        console.log(`  • Warnings: ${chalk.yellow(this.report.summary.warningsCount)}`);
      }
    }

    console.log('\n' + chalk.cyan('═'.repeat(60)) + '\n');
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  private calculateUpgradeSteps(): Array<{ from: string; to: string }> {
    const steps: Array<{ from: string; to: string }> = [];
    const start = parseInt(this.fromVersion);
    const end = parseInt(this.toVersion);

    for (let i = start; i < end; i++) {
      steps.push({ from: i.toString(), to: (i + 1).toString() });
    }

    return steps;
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}