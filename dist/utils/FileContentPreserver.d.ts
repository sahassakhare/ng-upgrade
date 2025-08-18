export declare class FileContentPreserver {
    /**
     * Update main.ts file while preserving custom code
     */
    static updateMainTsFile(filePath: string, targetAngularVersion: number): Promise<void>;
    /**
     * Update component files preserving custom logic
     */
    static updateComponentFile(filePath: string, transformations: any[]): Promise<void>;
    /**
     * Update template files preserving custom HTML
     */
    static updateTemplateFile(filePath: string, targetAngularVersion: number): Promise<void>;
    /**
     * Extract custom providers from the source file
     */
    private static extractCustomProviders;
    /**
     * Extract custom imports
     */
    private static extractCustomImports;
    /**
     * Extract app module path
     */
    private static extractAppModulePath;
    /**
     * Generate updated bootstrap code
     */
    private static generateUpdatedBootstrap;
    /**
     * Apply a specific transformation to content
     */
    private static applyTransformation;
    /**
     * Insert text at specific position
     */
    private static insertAtPosition;
    /**
     * Find the index after the last import statement
     */
    private static findLastImportIndex;
    /**
     * Update import statement
     */
    private static updateImport;
    /**
     * Migrate control flow syntax (Angular 17+)
     */
    private static migrateControlFlowSyntax;
}
//# sourceMappingURL=FileContentPreserver.d.ts.map