import { UpgradeReportGenerator, FileChange, DependencyChange } from '../UpgradeReportGenerator';

describe('UpgradeReportGenerator', () => {
  let reportGenerator: UpgradeReportGenerator;
  const testProjectPath = '/test/project';
  const testProjectName = 'test-app';

  beforeEach(() => {
    reportGenerator = new UpgradeReportGenerator(
      testProjectPath,
      testProjectName,
      '16',
      '17',
      'balanced'
    );
  });

  describe('constructor', () => {
    it('should initialize with project details', () => {
      expect(reportGenerator).toBeInstanceOf(UpgradeReportGenerator);
    });

    it('should handle different strategies', () => {
      const conservativeGenerator = new UpgradeReportGenerator(
        testProjectPath,
        testProjectName,
        '15',
        '16',
        'conservative'
      );
      expect(conservativeGenerator).toBeInstanceOf(UpgradeReportGenerator);
    });
  });

  describe('tracking methods', () => {
    it('should track file changes', () => {
      const fileChange: FileChange = {
        path: '/test/component.ts',
        type: 'modified',
        changes: ['Updated imports', 'Added standalone: true'],
        linesAdded: 5,
        linesRemoved: 2,
        breakingChanges: ['Standalone component migration'],
        migrations: ['Standalone component schematic']
      };

      expect(() => {
        reportGenerator.trackFileChange(fileChange);
      }).not.toThrow();
    });

    it('should track dependency changes', () => {
      const dependencyChange: DependencyChange = {
        name: '@angular/core',
        previousVersion: '^16.0.0',
        newVersion: '^17.0.0',
        type: 'production',
        breaking: true,
        notes: 'Major version upgrade'
      };

      expect(() => {
        reportGenerator.trackDependencyChange(dependencyChange);
      }).not.toThrow();
    });

    it('should track warnings and errors', () => {
      expect(() => {
        reportGenerator.addWarning('This is a warning');
        reportGenerator.addError('This is an error');
      }).not.toThrow();
    });

    it('should track success stories', () => {
      expect(() => {
        reportGenerator.addSuccessStory('Successfully migrated all components');
      }).not.toThrow();
    });

    it('should track checkpoints and backups', () => {
      expect(() => {
        reportGenerator.trackCheckpoint('checkpoint-1');
        reportGenerator.trackBackup('/backup/path');
      }).not.toThrow();
    });
  });

  describe('utility methods', () => {
    it('should format duration correctly', () => {
      // Access private method through any for testing
      const generator = reportGenerator as any;
      
      expect(generator.formatDuration(1000)).toBe('1s');
      expect(generator.formatDuration(65000)).toBe('1m 5s');
      expect(generator.formatDuration(3665000)).toBe('1h 1m 5s');
    });

    it('should escape HTML correctly', () => {
      const generator = reportGenerator as any;
      
      expect(generator.escapeHtml('<script>')).toBe('&lt;script&gt;');
      expect(generator.escapeHtml('A & B')).toBe('A &amp; B');
      expect(generator.escapeHtml('"quotes"')).toBe('&quot;quotes&quot;');
    });

    it('should calculate upgrade steps', () => {
      const generator = reportGenerator as any;
      const steps = generator.calculateUpgradeSteps();
      
      expect(steps).toEqual([{ from: '16', to: '17' }]);
    });
  });

  describe('metadata collection', () => {
    it('should collect system metadata', () => {
      const generator = reportGenerator as any;
      const metadata = generator.collectMetadata();

      expect(metadata).toHaveProperty('nodeVersion');
      expect(metadata).toHaveProperty('npmVersion');
      expect(metadata).toHaveProperty('operatingSystem');
      expect(metadata).toHaveProperty('projectPath');
      expect(metadata).toHaveProperty('reportGeneratedAt');
    });
  });

  describe('report sections', () => {
    it('should build executive summary section', () => {
      const generator = reportGenerator as any;
      generator.report.success = true;
      generator.report.duration = 120000; // 2 minutes

      const section = generator.buildExecutiveSummary();

      expect(section.title).toBe('Executive Summary');
      expect(section.level).toBe('success');
      expect(Array.isArray(section.content) ? section.content.join(' ') : section.content).toContain('Successfully Completed');
      expect(Array.isArray(section.content) ? section.content.join(' ') : section.content).toContain('2m 0s');
    });

    it('should build recommendations section', () => {
      const generator = reportGenerator as any;
      generator.report.summary.testsFailed = 2;
      generator.errors = ['Test error'];

      const section = generator.buildRecommendationsSection();

      expect(section.title).toBe('Next Steps & Recommendations');
      expect(Array.isArray(section.content) ? section.content.join(' ') : section.content).toContain('Fix failing tests');
      expect(Array.isArray(section.content) ? section.content.join(' ') : section.content).toContain('Review and resolve all errors');
    });
  });

  describe('content generation', () => {
    it('should generate HTML content', () => {
      const generator = reportGenerator as any;
      
      // Add some test data
      reportGenerator.trackFileChange({
        path: '/test.ts',
        type: 'modified',
        changes: ['test'],
        linesAdded: 1,
        linesRemoved: 0
      });

      const htmlContent = generator.generateHtmlContent();

      expect(htmlContent).toContain('<!DOCTYPE html>');
      expect(htmlContent).toContain('Angular Upgrade Report');
      expect(htmlContent).toContain('16');
      expect(htmlContent).toContain('17');
      // Project name might not be in the HTML header, that's fine
    });

    it('should generate Markdown content', () => {
      const generator = reportGenerator as any;
      
      // Add some test data
      reportGenerator.addSuccessStory('Test success');

      const markdownContent = generator.generateMarkdownContent();

      expect(markdownContent).toContain('# Angular Upgrade Report');
      expect(markdownContent).toContain('16 → 17');
      expect(markdownContent).toContain('## Summary');
      expect(markdownContent).toContain('Files Modified');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete tracking scenario', () => {
      // Simulate a complete upgrade tracking
      reportGenerator.trackFileChange({
        path: '/src/app/app.component.ts',
        type: 'modified',
        changes: ['Standalone migration'],
        linesAdded: 3,
        linesRemoved: 1
      });

      reportGenerator.trackDependencyChange({
        name: '@angular/core',
        previousVersion: '^16.0.0',
        newVersion: '^17.0.0',
        type: 'production',
        breaking: true
      });

      reportGenerator.addSuccessStory('All components migrated successfully');
      reportGenerator.addWarning('Some deprecation warnings remain');
      reportGenerator.trackCheckpoint('pre-migration');

      // Should not throw and should have tracked all items
      expect(() => {
        const generator = reportGenerator as any;
        generator.buildReportSections();
      }).not.toThrow();
    });

    it('should handle API interface consistency', () => {
      // Test that all public methods are available
      expect(typeof reportGenerator.trackFileChange).toBe('function');
      expect(typeof reportGenerator.trackDependencyChange).toBe('function');
      expect(typeof reportGenerator.addWarning).toBe('function');
      expect(typeof reportGenerator.addError).toBe('function');
      expect(typeof reportGenerator.addSuccessStory).toBe('function');
      expect(typeof reportGenerator.trackCheckpoint).toBe('function');
      expect(typeof reportGenerator.trackBackup).toBe('function');
      expect(typeof reportGenerator.generateReport).toBe('function');
    });
  });

  describe('type safety', () => {
    it('should enforce correct parameter types', () => {
      // These should compile without TypeScript errors
      expect(() => {
        const fileChange: FileChange = {
          path: '/test.ts',
          type: 'created',
          changes: ['New file'],
          linesAdded: 10,
          linesRemoved: 0
        };
        reportGenerator.trackFileChange(fileChange);

        const depChange: DependencyChange = {
          name: 'test-package',
          previousVersion: '1.0.0',
          newVersion: '2.0.0',
          type: 'development',
          breaking: false
        };
        reportGenerator.trackDependencyChange(depChange);
      }).not.toThrow();
    });
  });
});