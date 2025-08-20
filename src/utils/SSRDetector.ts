import * as fs from 'fs-extra';
import * as path from 'path';

export class SSRDetector {
  /**
   * Detect if the application is configured for Server-Side Rendering
   */
  static async isSSRApplication(projectPath: string): Promise<boolean> {
    // Check for various SSR indicators
    const indicators = [
      await this.hasServerMain(projectPath),
      await this.hasSSRConfiguration(projectPath),
      await this.hasSSRBuildTarget(projectPath),
      await this.hasSSRDependencies(projectPath),
      await this.hasSSRFiles(projectPath)
    ];

    // Return true if any SSR indicator is found
    return indicators.some(indicator => indicator);
  }

  /**
   * Check for main.server.ts file
   */
  private static async hasServerMain(projectPath: string): Promise<boolean> {
    const serverMainPaths = [
      path.join(projectPath, 'src/main.server.ts'),
      path.join(projectPath, 'src/server/main.ts'),
      path.join(projectPath, 'server.ts')
    ];

    for (const serverPath of serverMainPaths) {
      if (await fs.pathExists(serverPath)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check for SSR configuration in angular.json
   */
  private static async hasSSRConfiguration(projectPath: string): Promise<boolean> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Check for server build configuration
        for (const projectName of Object.keys(angularJson.projects || {})) {
          const project = angularJson.projects[projectName];
          if (project.architect?.server || project.architect?.['build-ssr'] || project.architect?.prerender) {
            return true;
          }
        }
      } catch (error) {
        // Ignore JSON parsing errors
      }
    }
    return false;
  }

  /**
   * Check for server build target in angular.json
   */
  private static async hasSSRBuildTarget(projectPath: string): Promise<boolean> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const content = await fs.readFile(angularJsonPath, 'utf-8');
        return content.includes('@nguniversal/builders') || 
               content.includes('server') ||
               content.includes('prerender');
      } catch (error) {
        // Ignore file reading errors
      }
    }
    return false;
  }

  /**
   * Check for SSR-related dependencies
   */
  private static async hasSSRDependencies(projectPath: string): Promise<boolean> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        const ssrPackages = [
          '@nguniversal/express-engine',
          '@nguniversal/builders',
          '@angular/platform-server',
          '@angular/ssr'
        ];

        return ssrPackages.some(pkg => dependencies[pkg]);
      } catch (error) {
        // Ignore JSON parsing errors
      }
    }
    return false;
  }

  /**
   * Check for SSR-related files
   */
  private static async hasSSRFiles(projectPath: string): Promise<boolean> {
    const ssrFiles = [
      path.join(projectPath, 'server.ts'),
      path.join(projectPath, 'webpack.server.config.js'),
      path.join(projectPath, 'src/app/app.server.module.ts'),
      path.join(projectPath, 'prerender.js')
    ];

    for (const filePath of ssrFiles) {
      if (await fs.pathExists(filePath)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if main.ts already has SSR-related imports
   */
  static async hasSSRImports(mainTsPath: string): Promise<boolean> {
    if (!await fs.pathExists(mainTsPath)) {
      return false;
    }

    try {
      const content = await fs.readFile(mainTsPath, 'utf-8');
      return content.includes('provideClientHydration') ||
             content.includes('@angular/platform-server') ||
             content.includes('withEventReplay') ||
             content.includes('withIncrementalHydration');
    } catch (error) {
      return false;
    }
  }
}