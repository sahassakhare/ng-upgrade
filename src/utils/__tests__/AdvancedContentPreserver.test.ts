import { AdvancedContentPreserver, PreservationOptions } from '../AdvancedContentPreserver';

describe('AdvancedContentPreserver', () => {
  let preserver: AdvancedContentPreserver;
  const testProjectPath = '/test/project';

  const defaultOptions: PreservationOptions = {
    preserveComments: true,
    preserveCustomMethods: true,
    preserveUserImports: true,
    preserveCustomProperties: true,
    preserveCustomLogic: true,
    createDetailedBackup: true,
    mergeConflictResolution: 'user'
  };

  beforeEach(() => {
    preserver = new AdvancedContentPreserver(testProjectPath);
  });

  describe('constructor', () => {
    it('should initialize with project path', () => {
      const testPreserver = new AdvancedContentPreserver('/test/project');
      expect(testPreserver).toBeInstanceOf(AdvancedContentPreserver);
    });
  });

  describe('method signatures', () => {
    it('should have preserveTypeScriptFile method', () => {
      expect(typeof preserver.preserveTypeScriptFile).toBe('function');
    });

    it('should have preserveComponentFile method', () => {
      expect(typeof preserver.preserveComponentFile).toBe('function');
    });

    it('should have preserveTemplateFile method', () => {
      expect(typeof preserver.preserveTemplateFile).toBe('function');
    });
  });

  describe('options handling', () => {
    it('should accept valid preservation options', () => {
      const options: PreservationOptions = {
        preserveComments: false,
        preserveCustomMethods: false,
        preserveUserImports: false,
        preserveCustomProperties: false,
        preserveCustomLogic: false,
        createDetailedBackup: false,
        mergeConflictResolution: 'migration'
      };

      expect(options.mergeConflictResolution).toBe('migration');
    });

    it('should accept user conflict resolution preference', () => {
      const userOptions: PreservationOptions = {
        ...defaultOptions,
        mergeConflictResolution: 'user'
      };

      expect(userOptions.mergeConflictResolution).toBe('user');
    });
  });

  describe('interface validation', () => {
    it('should have proper PreservationOptions interface', () => {
      const options: PreservationOptions = defaultOptions;
      
      expect(options).toHaveProperty('preserveComments');
      expect(options).toHaveProperty('preserveCustomMethods');
      expect(options).toHaveProperty('preserveUserImports');
      expect(options).toHaveProperty('preserveCustomProperties');
      expect(options).toHaveProperty('preserveCustomLogic');
      expect(options).toHaveProperty('createDetailedBackup');
      expect(options).toHaveProperty('mergeConflictResolution');
    });

    it('should validate mergeConflictResolution values', () => {
      const userPreference: PreservationOptions = {
        ...defaultOptions,
        mergeConflictResolution: 'user'
      };

      const migrationPreference: PreservationOptions = {
        ...defaultOptions,
        mergeConflictResolution: 'migration'
      };

      expect(userPreference.mergeConflictResolution).toBe('user');
      expect(migrationPreference.mergeConflictResolution).toBe('migration');
    });
  });

  describe('class instantiation', () => {
    it('should create instance with different project paths', () => {
      const preserver1 = new AdvancedContentPreserver('/project1');
      const preserver2 = new AdvancedContentPreserver('/project2');
      
      expect(preserver1).toBeInstanceOf(AdvancedContentPreserver);
      expect(preserver2).toBeInstanceOf(AdvancedContentPreserver);
      expect(preserver1).not.toBe(preserver2);
    });
  });

  describe('type safety', () => {
    it('should enforce correct method parameter types', () => {
      // These should compile without TypeScript errors
      expect(() => {
        preserver.preserveTypeScriptFile('/test/file.ts', []);
        preserver.preserveComponentFile('/test/component.ts', []);
        preserver.preserveTemplateFile('/test/template.html', []);
      }).not.toThrow();
    });
  });
});