import { Prerequisite, ValidationStep } from '../types';
export interface ValidationResult {
    success: boolean;
    message: string;
    error?: string;
    warnings?: string[];
}
export declare class ValidatorFramework {
    private projectPath;
    constructor(projectPath: string);
    /**
     * Validate prerequisite requirements
     */
    validatePrerequisite(prerequisite: Prerequisite): Promise<boolean>;
    /**
     * Run validation step
     */
    runValidation(validation: ValidationStep): Promise<ValidationResult>;
    /**
     * Validate Node.js version
     */
    private validateNodeVersion;
    /**
     * Validate TypeScript version
     */
    private validateTypeScriptVersion;
    /**
     * Validate dependency version
     */
    private validateDependency;
    /**
     * Validate environment requirements
     */
    private validateEnvironment;
    /**
     * Check if command exists
     */
    private commandExists;
    /**
     * Run build validation
     */
    private runBuildValidation;
    /**
     * Run test validation
     */
    private runTestValidation;
    /**
     * Run lint validation
     */
    private runLintValidation;
    /**
     * Run runtime validation
     */
    private runRuntimeValidation;
    /**
     * Run compatibility validation
     */
    private runCompatibilityValidation;
    /**
     * Get appropriate lint command
     */
    private getLintCommand;
    /**
     * Extract warnings from command output
     */
    private extractWarnings;
    /**
     * Check for deprecated API usage
     */
    private checkDeprecatedApis;
    /**
     * Check peer dependencies
     */
    private checkPeerDependencies;
    /**
     * Check Angular version compatibility
     */
    private checkVersionCompatibility;
    /**
     * Run comprehensive validation suite
     */
    runComprehensiveValidation(): Promise<ValidationResult[]>;
}
//# sourceMappingURL=ValidatorFramework.d.ts.map