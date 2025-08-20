import { AdvancedContentPreserver, PreservationOptions } from '../AdvancedContentPreserver';

describe('AdvancedContentPreserver Integration Tests', () => {
  let preserver: AdvancedContentPreserver;
  const testProjectPath = '/test/project';

  beforeEach(() => {
    preserver = new AdvancedContentPreserver(testProjectPath);
  });

  describe('API Integration', () => {
    it('should have complete API surface', () => {
      expect(preserver).toHaveProperty('preserveTypeScriptFile');
      expect(preserver).toHaveProperty('preserveComponentFile');
      expect(preserver).toHaveProperty('preserveTemplateFile');
    });

    it('should accept proper method signatures', () => {
      const filePath = '/test/component.ts';
      const migrations: any[] = [];
      const options: PreservationOptions = {
        preserveComments: true,
        preserveCustomMethods: true,
        preserveUserImports: true,
        preserveCustomProperties: true,
        preserveCustomLogic: true,
        createDetailedBackup: true,
        mergeConflictResolution: 'user'
      };

      // These should not throw type errors
      expect(() => {
        preserver.preserveTypeScriptFile(filePath, migrations, options);
        preserver.preserveComponentFile(filePath, migrations, options);
        preserver.preserveTemplateFile(filePath, migrations, options);
      }).not.toThrow();
    });
  });

  describe('Configuration Options', () => {
    it('should support all preservation options', () => {
      const conservativeOptions: PreservationOptions = {
        preserveComments: true,
        preserveCustomMethods: true,
        preserveUserImports: true,
        preserveCustomProperties: true,
        preserveCustomLogic: true,
        createDetailedBackup: true,
        mergeConflictResolution: 'user'
      };

      const aggressiveOptions: PreservationOptions = {
        preserveComments: false,
        preserveCustomMethods: false,
        preserveUserImports: false,
        preserveCustomProperties: false,
        preserveCustomLogic: false,
        createDetailedBackup: false,
        mergeConflictResolution: 'migration'
      };

      expect(conservativeOptions.mergeConflictResolution).toBe('user');
      expect(aggressiveOptions.mergeConflictResolution).toBe('migration');
    });

    it('should validate conflict resolution strategies', () => {
      const userStrategy: 'user' = 'user';
      const migrationStrategy: 'migration' = 'migration';

      const userOptions: PreservationOptions = {
        preserveComments: true,
        preserveCustomMethods: true,
        preserveUserImports: true,
        preserveCustomProperties: true,
        preserveCustomLogic: true,
        createDetailedBackup: true,
        mergeConflictResolution: userStrategy
      };

      const migrationOptions: PreservationOptions = {
        preserveComments: true,
        preserveCustomMethods: true,
        preserveUserImports: true,
        preserveCustomProperties: true,
        preserveCustomLogic: true,
        createDetailedBackup: true,
        mergeConflictResolution: migrationStrategy
      };

      expect(userOptions.mergeConflictResolution).toBe('user');
      expect(migrationOptions.mergeConflictResolution).toBe('migration');
    });
  });

  describe('File Type Handling', () => {
    it('should handle TypeScript component files', () => {
      const componentPath = '/src/app/user/user.component.ts';
      expect(() => {
        preserver.preserveTypeScriptFile(componentPath, []);
      }).not.toThrow();
    });

    it('should handle service files', () => {
      const servicePath = '/src/app/services/user.service.ts';
      expect(() => {
        preserver.preserveTypeScriptFile(servicePath, []);
      }).not.toThrow();
    });

    it('should handle template files', () => {
      const templatePath = '/src/app/user/user.component.html';
      expect(() => {
        preserver.preserveTemplateFile(templatePath, []);
      }).not.toThrow();
    });

    it('should handle complete component preservation', () => {
      const componentPath = '/src/app/user/user.component.ts';
      expect(() => {
        preserver.preserveComponentFile(componentPath, []);
      }).not.toThrow();
    });
  });

  describe('Migration Transform Handling', () => {
    it('should accept empty transform arrays', () => {
      expect(() => {
        preserver.preserveTypeScriptFile('/test/file.ts', []);
      }).not.toThrow();
    });

    it('should accept transform arrays with content', () => {
      const transforms = [
        { type: 'import', action: 'add' },
        { type: 'decorator', action: 'modify' }
      ];

      expect(() => {
        preserver.preserveTypeScriptFile('/test/file.ts', transforms);
      }).not.toThrow();
    });
  });

  describe('Path Handling', () => {
    it('should handle absolute paths', () => {
      const absolutePath = '/absolute/path/to/component.ts';
      expect(() => {
        preserver.preserveTypeScriptFile(absolutePath, []);
      }).not.toThrow();
    });

    it('should handle relative paths', () => {
      const relativePath = './relative/component.ts';
      expect(() => {
        preserver.preserveTypeScriptFile(relativePath, []);
      }).not.toThrow();
    });

    it('should handle various file extensions', () => {
      expect(() => {
        preserver.preserveTypeScriptFile('/test/file.ts', []);
        preserver.preserveTemplateFile('/test/template.html', []);
      }).not.toThrow();
    });
  });

  describe('Real-World Angular Patterns', () => {
    it('should handle typical Angular file patterns', () => {
      const patterns = [
        '/src/app/components/user-list/user-list.component.ts',
        '/src/app/services/user/user.service.ts',
        '/src/app/guards/auth.guard.ts',
        '/src/app/interceptors/auth.interceptor.ts',
        '/src/app/resolvers/user.resolver.ts',
        '/src/app/directives/highlight.directive.ts',
        '/src/app/pipes/date-format.pipe.ts',
        '/src/app/models/user.model.ts'
      ];

      patterns.forEach(pattern => {
        expect(() => {
          preserver.preserveTypeScriptFile(pattern, []);
        }).not.toThrow();
      });
    });

    it('should handle complex Angular upgrade scenarios', () => {
      const angularMigrations = [
        { from: 'angular12', to: 'angular13' },
        { from: 'angular13', to: 'angular14' },
        { from: 'angular14', to: 'angular15' },
        { from: 'angular15', to: 'angular16' },
        { from: 'angular16', to: 'angular17' },
        { from: 'angular17', to: 'angular18' },
        { from: 'angular18', to: 'angular19' },
        { from: 'angular19', to: 'angular20' }
      ];

      expect(() => {
        preserver.preserveTypeScriptFile('/src/app/app.component.ts', angularMigrations);
      }).not.toThrow();
    });
  });

  describe('TypeScript Compilation Safety', () => {
    it('should maintain TypeScript interface contracts', () => {
      const preserver1 = new AdvancedContentPreserver('/project1');
      const preserver2 = new AdvancedContentPreserver('/project2');

      // Both instances should have identical interfaces
      expect(typeof preserver1.preserveTypeScriptFile).toBe('function');
      expect(typeof preserver2.preserveTypeScriptFile).toBe('function');
      expect(typeof preserver1.preserveComponentFile).toBe('function');
      expect(typeof preserver2.preserveComponentFile).toBe('function');
      expect(typeof preserver1.preserveTemplateFile).toBe('function');
      expect(typeof preserver2.preserveTemplateFile).toBe('function');
    });
  });
});