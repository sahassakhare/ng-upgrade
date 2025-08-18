export interface DependencyUpdate {
    name: string;
    version: string;
    type: 'dependencies' | 'devDependencies';
}
export declare class DependencyInstaller {
    private projectPath;
    private spinner;
    constructor(projectPath: string);
    /**
     * Install or update multiple dependencies automatically
     */
    installDependencies(dependencies: DependencyUpdate[], message?: string): Promise<boolean>;
    /**
     * Update Angular core packages to specific version
     */
    updateAngularPackages(version: string): Promise<boolean>;
    /**
     * Update TypeScript to compatible version
     */
    updateTypeScript(version: string): Promise<boolean>;
    /**
     * Install additional required packages
     */
    installRequiredPackages(packages: DependencyUpdate[]): Promise<boolean>;
    /**
     * Check if a package is installed
     */
    isPackageInstalled(packageName: string): Promise<boolean>;
    /**
     * Get installed version of a package
     */
    getInstalledVersion(packageName: string): Promise<string | null>;
    /**
     * Fallback: Update package.json directly if npm install fails
     */
    private fallbackUpdatePackageJson;
    /**
     * Run npm install to ensure all dependencies are installed
     */
    runNpmInstall(): Promise<boolean>;
}
//# sourceMappingURL=DependencyInstaller.d.ts.map