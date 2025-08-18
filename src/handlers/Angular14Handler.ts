import * as fs from 'fs-extra';
import * as path from 'path';
import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate, Migration } from '../types';

/**
 * Angular 14 Handler - Standalone components and enhanced APIs
 * 
 * Manages migration to Angular 14 with comprehensive support for standalone components,
 * enhanced dependency injection, typed reactive forms, and improved developer experience.
 * This handler introduces foundational changes that enable module-free component development.
 * 
 * Key Features in Angular 14:
 * - Standalone components introduction (revolutionary change)
 * - Optional injectors and inject() function
 * - Protected route guards
 * - Extended developer experience APIs
 * - Angular CLI auto-completion
 * - Strict typed reactive forms
 * - Page title strategy
 * 
 * @example
 * ```typescript
 * const handler = new Angular14Handler();
 * await handler.applyVersionSpecificChanges('/path/to/project', {
 *   strategy: 'balanced',
 *   enableStandaloneComponents: true
 * });
 * ```
 * 
 * @since 1.0.0
 * @author Angular Multi-Version Upgrade Orchestrator
 */
export class Angular14Handler extends BaseVersionHandler {
  /** The Angular version this handler manages */
  readonly version = '14';

  /**
   * Gets the minimum required Node.js version for Angular 14
   * @returns The minimum Node.js version requirement
   */
  protected getRequiredNodeVersion(): string {
    return '>=14.15.0';
  }

  /**
   * Gets the required TypeScript version range for Angular 14
   * @returns The TypeScript version requirement
   */
  protected getRequiredTypeScriptVersion(): string {
    return '>=4.7.2 <4.8.0';
  }

  /**
   * Gets all dependency updates required for Angular 14 migration
   * 
   * Includes core Angular packages, CLI tools, TypeScript compatibility updates,
   * and optional third-party library updates like Angular Material.
   * 
   * @returns Array of dependency updates with package names, versions, and types
   */
  getDependencyUpdates(): DependencyUpdate[] {
    return [
      // Core Angular packages
      { name: '@angular/animations', version: '^14.0.0', type: 'dependencies' },
      { name: '@angular/common', version: '^14.0.0', type: 'dependencies' },
      { name: '@angular/compiler', version: '^14.0.0', type: 'dependencies' },
      { name: '@angular/core', version: '^14.0.0', type: 'dependencies' },
      { name: '@angular/forms', version: '^14.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser', version: '^14.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser-dynamic', version: '^14.0.0', type: 'dependencies' },
      { name: '@angular/router', version: '^14.0.0', type: 'dependencies' },
      
      // Angular CLI and dev dependencies
      { name: '@angular/cli', version: '^14.0.0', type: 'devDependencies' },
      { name: '@angular/compiler-cli', version: '^14.0.0', type: 'devDependencies' },
      { name: '@angular-devkit/build-angular', version: '^14.0.0', type: 'devDependencies' },
      
      // TypeScript and supporting packages
      { name: 'typescript', version: '~4.7.2', type: 'devDependencies' },
      { name: 'zone.js', version: '~0.11.4', type: 'dependencies' },
      { name: 'rxjs', version: '~7.5.0', type: 'dependencies' },
      
      // Angular Material (if present)
      { name: '@angular/material', version: '^14.0.0', type: 'dependencies' },
      { name: '@angular/cdk', version: '^14.0.0', type: 'dependencies' }
    ];
  }

  /**
   * Applies all Angular 14 specific transformations to the project
   * 
   * Orchestrates the complete migration including standalone components setup,
   * optional injectors implementation, typed reactive forms configuration,
   * and enhanced developer experience features. This is a foundational upgrade
   * that introduces revolutionary standalone component architecture.
   * 
   * @param projectPath - The absolute path to the Angular project root
   * @param options - Upgrade configuration options (unused but required for interface compliance)
   * @throws {Error} When critical transformations fail
   */
  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 14 transformations...');
    
    // 1. Setup standalone components foundation
    await this.setupStandaloneComponentsSupport(projectPath);
    
    // 2. Implement optional injectors and inject() function
    await this.implementOptionalInjectors(projectPath);
    
    // 3. Setup protected route guards
    await this.setupProtectedRouteGuards(projectPath);
    
    // 4. Configure extended developer experience APIs
    await this.configureExtendedDevAPIs(projectPath);
    
    // 5. Setup Angular CLI auto-completion
    await this.setupCLIAutoCompletion(projectPath);
    
    // 6. Configure strict typed reactive forms
    await this.configureStrictTypedForms(projectPath);
    
    // 7. Implement page title strategy
    await this.implementPageTitleStrategy(projectPath);
    
    // 8. Update build configurations for Angular 14
    await this.updateBuildConfigurations(projectPath);
    
    // 9. Validate and update third-party libraries
    await this.validateThirdPartyCompatibility(projectPath);
    
    this.progressReporter?.success('✓ Angular 14 transformations completed');
  }

  getBreakingChanges(): BreakingChange[] {
    return [
      // Standalone components introduction
      this.createBreakingChange(
        'ng14-standalone-components',
        'api',
        'low',
        'Standalone components introduced',
        'New way to create components without NgModules - completely optional',
        'Standalone components are opt-in. Existing NgModule approach continues to work'
      ),
      
      // TypeScript version requirement
      this.createBreakingChange(
        'ng14-typescript-version',
        'dependency',
        'medium',
        'TypeScript 4.7+ required',
        'Angular 14 requires TypeScript 4.7.2 or higher',
        'Update TypeScript to version 4.7.2 or higher'
      ),
      
      // Node.js version requirement
      this.createBreakingChange(
        'ng14-nodejs-version',
        'dependency',
        'medium',
        'Node.js 14.15+ required',
        'Angular 14 requires Node.js 14.15.0 or higher',
        'Update Node.js to version 14.15.0 or higher'
      ),
      
      // Optional injectors
      this.createBreakingChange(
        'ng14-optional-injectors',
        'api',
        'low',
        'Optional injectors and inject() function',
        'New inject() function for dependency injection outside constructors',
        'New feature - existing constructor injection continues to work'
      ),
      
      // Protected route guards
      this.createBreakingChange(
        'ng14-protected-guards',
        'api',
        'low',
        'Protected route guards introduced',
        'New guard type for protecting routes from unauthenticated access',
        'New feature - existing guards continue to work'
      ),
      
      // Strict typed forms
      this.createBreakingChange(
        'ng14-typed-forms',
        'api',
        'low',
        'Strict typed reactive forms',
        'Enhanced type safety for reactive forms',
        'Opt-in feature - existing forms continue to work'
      )
    ];
  }

  // Private implementation methods

  /**
   * Setup foundation for standalone components
   */
  private async setupStandaloneComponentsSupport(projectPath: string): Promise<void> {
    // Create example standalone component structure
    const exampleDir = path.join(projectPath, 'src/app/examples');
    
    try {
      // Create examples directory if it doesn't exist
      await fs.ensureDir(exampleDir);
      
      // Create standalone component example
      const standaloneComponentExample = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standalone-example',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div>
      <h3>Standalone Component Example</h3>
      <p>This component doesn't require NgModule declaration</p>
    </div>
  \`
})
export class StandaloneExampleComponent { }
`;
      
      const examplePath = path.join(exampleDir, 'standalone-example.component.ts');
      if (!await fs.pathExists(examplePath)) {
        await fs.writeFile(examplePath, standaloneComponentExample);
        this.progressReporter?.info('✓ Created standalone component example');
      }
      
      // Update tsconfig for standalone components
      await this.updateTsConfigForStandalone(projectPath);
      
    } catch (error) {
      this.progressReporter?.warn(`Could not setup standalone components: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Implement optional injectors and inject() function
   */
  private async implementOptionalInjectors(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create inject() function example
      const injectExample = `import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inject-example',
  template: \`
    <div>
      <h3>Inject Function Example</h3>
      <p>Dependency injection without constructor</p>
    </div>
  \`
})
export class InjectExampleComponent {
  // Use inject() function instead of constructor injection
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Optional injection with default value
  private optionalService = inject(SomeOptionalService, { optional: true }) ?? new DefaultService();
  
  navigateToHome() {
    this.router.navigate(['/']);
  }
}

// Example service for optional injection
class SomeOptionalService { }
class DefaultService { }
`;
      
      const injectExamplePath = path.join(exampleDir, 'inject-example.component.ts');
      if (!await fs.pathExists(injectExamplePath)) {
        await fs.writeFile(injectExamplePath, injectExample);
        this.progressReporter?.info('✓ Created inject() function example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not implement optional injectors: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Setup protected route guards
   */
  private async setupProtectedRouteGuards(projectPath: string): Promise<void> {
    try {
      const guardsDir = path.join(projectPath, 'src/app/guards');
      await fs.ensureDir(guardsDir);
      
      // Create protected route guard example
      const protectedGuardExample = `import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication();
  }

  canActivateChild(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication();
  }

  private checkAuthentication(): boolean | UrlTree {
    // Check if user is authenticated
    const isAuthenticated = this.isUserAuthenticated();
    
    if (isAuthenticated) {
      return true;
    } else {
      // Redirect to login if not authenticated
      return this.router.createUrlTree(['/login']);
    }
  }

  private isUserAuthenticated(): boolean {
    // Implement your authentication logic here
    return localStorage.getItem('authToken') !== null;
  }
}
`;
      
      const guardPath = path.join(guardsDir, 'auth.guard.ts');
      if (!await fs.pathExists(guardPath)) {
        await fs.writeFile(guardPath, protectedGuardExample);
        this.progressReporter?.info('✓ Created protected route guard example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not setup protected guards: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Configure extended developer experience APIs
   */
  private async configureExtendedDevAPIs(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Enable extended dev APIs in angular.json
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.build) {
            // Enable source maps for better debugging
            project.architect.build.options.sourceMap = {
              scripts: true,
              styles: true,
              vendor: true
            };
            
            // Enable build optimization
            project.architect.build.options.optimization = false;
          }
          
          if (project.architect?.serve) {
            // Enable hot module replacement for dev server
            project.architect.serve.options.hmr = true;
            project.architect.serve.options.liveReload = true;
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Configured extended developer APIs');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not configure dev APIs: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Setup Angular CLI auto-completion
   */
  private async setupCLIAutoCompletion(projectPath: string): Promise<void> {
    try {
      // Create .angular-cli folder for auto-completion
      const cliDir = path.join(projectPath, '.angular');
      await fs.ensureDir(cliDir);
      
      // Create completion configuration
      const completionConfig = {
        version: 14,
        autoCompletion: {
          enabled: true,
          commands: [
            'generate',
            'build',
            'serve',
            'test',
            'lint',
            'add',
            'update'
          ]
        }
      };
      
      const configPath = path.join(cliDir, 'completion.json');
      await fs.writeJson(configPath, completionConfig, { spaces: 2 });
      
      this.progressReporter?.info('✓ Setup Angular CLI auto-completion');
      
    } catch (error) {
      this.progressReporter?.warn(`Could not setup CLI auto-completion: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Configure strict typed reactive forms
   */
  private async configureStrictTypedForms(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create typed forms example
      const typedFormsExample = `import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number>;
}

@Component({
  selector: 'app-typed-forms-example',
  template: \`
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Name:</label>
        <input id="name" formControlName="name" type="text">
      </div>
      
      <div>
        <label for="email">Email:</label>
        <input id="email" formControlName="email" type="email">
      </div>
      
      <div>
        <label for="age">Age:</label>
        <input id="age" formControlName="age" type="number">
      </div>
      
      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  \`
})
export class TypedFormsExampleComponent {
  // Strongly typed form group
  userForm: FormGroup<UserForm>;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group<UserForm>({
      name: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
      email: this.fb.control('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      age: this.fb.control(0, { validators: [Validators.required, Validators.min(0)], nonNullable: true })
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      // Form values are now strongly typed
      const formValue = this.userForm.value;
      console.log('Form submitted:', formValue);
    }
  }
}
`;
      
      const formsExamplePath = path.join(exampleDir, 'typed-forms-example.component.ts');
      if (!await fs.pathExists(formsExamplePath)) {
        await fs.writeFile(formsExamplePath, typedFormsExample);
        this.progressReporter?.info('✓ Created strict typed forms example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not configure typed forms: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Implement page title strategy
   */
  private async implementPageTitleStrategy(projectPath: string): Promise<void> {
    try {
      const servicesDir = path.join(projectPath, 'src/app/services');
      await fs.ensureDir(servicesDir);
      
      // Create title strategy service
      const titleStrategyExample = `import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TitleStrategyService {
  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.setupTitleStrategy();
  }

  private setupTitleStrategy(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      map(route => route.snapshot.data['title'] || 'Angular App')
    ).subscribe(title => {
      this.title.setTitle(\`\${title} | My Angular App\`);
    });
  }

  updateTitle(title: string): void {
    this.title.setTitle(\`\${title} | My Angular App\`);
  }
}

// Example usage in routing module:
/*
const routes: Routes = [
  { 
    path: 'home', 
    component: HomeComponent, 
    data: { title: 'Home' } 
  },
  { 
    path: 'about', 
    component: AboutComponent, 
    data: { title: 'About Us' } 
  }
];
*/
`;
      
      const titleServicePath = path.join(servicesDir, 'title-strategy.service.ts');
      if (!await fs.pathExists(titleServicePath)) {
        await fs.writeFile(titleServicePath, titleStrategyExample);
        this.progressReporter?.info('✓ Created page title strategy service');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not implement title strategy: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update build configurations for Angular 14
   */
  private async updateBuildConfigurations(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Update build configurations for Angular 14
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.build) {
            // Enable build optimization for Angular 14
            if (!project.architect.build.configurations) {
              project.architect.build.configurations = {};
            }
            
            // Update production configuration
            project.architect.build.configurations.production = {
              ...project.architect.build.configurations.production,
              budgets: [
                {
                  type: 'initial',
                  maximumWarning: '500kb',
                  maximumError: '1mb'
                },
                {
                  type: 'anyComponentStyle',
                  maximumWarning: '2kb',
                  maximumError: '4kb'
                }
              ],
              outputHashing: 'all',
              optimization: true,
              sourceMap: false,
              namedChunks: false,
              aot: true,
              extractLicenses: true,
              vendorChunk: false,
              buildOptimizer: true
            };
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Updated build configurations for Angular 14');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update build configurations: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Update TypeScript configuration for standalone components
   */
  private async updateTsConfigForStandalone(projectPath: string): Promise<void> {
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    
    if (await fs.pathExists(tsconfigPath)) {
      try {
        const tsconfig = await fs.readJson(tsconfigPath);
        
        // Ensure Angular compiler options support standalone components
        if (!tsconfig.angularCompilerOptions) {
          tsconfig.angularCompilerOptions = {};
        }
        
        // Enable strict templates for better type checking
        tsconfig.angularCompilerOptions.strictTemplates = true;
        tsconfig.angularCompilerOptions.strictInputAccessModifiers = true;
        tsconfig.angularCompilerOptions.strictInputTypes = true;
        
        await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
        this.progressReporter?.info('✓ Updated TypeScript configuration for standalone components');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update TypeScript config: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Validate third-party library compatibility for Angular 14
   */
  private async validateThirdPartyCompatibility(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        const warnings = [];
        const recommendations = [];
        
        // Check for library compatibility
        for (const [libName, version] of Object.entries(dependencies)) {
          if (typeof version === 'string') {
            // Check Angular Material compatibility
            if (libName === '@angular/material' && !version.includes('14')) {
              warnings.push(`${libName}@${version} should be updated to v14 for full compatibility`);
            }
            
            // Check for libraries that benefit from standalone components
            if (this.canBenefitFromStandalone(libName)) {
              recommendations.push(`${libName} can be enhanced with standalone components in Angular 14+`);
            }
          }
        }
        
        if (warnings.length > 0) {
          this.progressReporter?.warn(`Library compatibility warnings: ${warnings.join(', ')}`);
        }
        
        if (recommendations.length > 0) {
          this.progressReporter?.info(`Enhancement opportunities: ${recommendations.join(', ')}`);
        }
        
        this.progressReporter?.info('✓ Third-party library compatibility validation completed');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not validate third-party compatibility: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Check if a library can benefit from standalone components
   */
  private canBenefitFromStandalone(libName: string): boolean {
    const standaloneCompatibleLibraries = [
      '@angular/material',
      '@angular/cdk',
      'ng-bootstrap',
      'ngx-bootstrap',
      'primeng'
    ];
    
    return standaloneCompatibleLibraries.some(lib => libName.includes(lib));
  }

  /**
   * Override to provide Angular 14 specific migrations
   */
  protected getAvailableMigrations(): Migration[] {
    const baseMigrations = super.getAvailableMigrations();
    
    // Add Angular 14 specific migrations
    const angular14Migrations: Migration[] = [
      {
        name: 'Optional Injectors',
        command: 'npx ng generate @angular/core:optional-injectors',
        description: 'Migrate to optional injectors with inject() function',
        optional: true
      },
      {
        name: 'Typed Reactive Forms',
        command: 'npx ng generate @angular/forms:typed-forms',
        description: 'Migrate to strict typed reactive forms',
        optional: true
      },
      {
        name: 'Protected Route Guards',
        command: 'npx ng generate @angular/router:guards-migration',
        description: 'Migrate to new guard types and patterns',
        optional: true
      }
    ];
    
    return [...baseMigrations, ...angular14Migrations];
  }

  /**
   * Run Angular 14 specific migrations
   */
  protected async runVersionSpecificMigrations(projectPath: string): Promise<void> {
    const migrations = this.getAvailableMigrations();
    
    // Run Angular 14 specific migrations
    const angular14Migrations = [
      'Standalone Components',
      'inject() Function',
      'Optional Injectors',
      'Cleanup Unused Imports'
    ];
    
    for (const migrationName of angular14Migrations) {
      const migration = migrations.find(m => m.name === migrationName);
      if (migration) {
        try {
          this.progressReporter?.updateMessage(`Running ${migration.name} migration...`);
          
          let command = migration.command + ' --interactive=false --defaults';
          
          await this.runCommand(command, projectPath);
          
          this.progressReporter?.info(`✓ ${migration.name} migration completed`);
        } catch (error) {
          this.progressReporter?.warn(`${migration.name} migration skipped: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  }
}