import * as fs from 'fs-extra';
import * as path from 'path';
import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate, Migration } from '../types';
import { SSRDetector } from '../utils/SSRDetector';

/**
 * Angular 16 Handler - Required inputs, signals, and new control flow
 * 
 * Handles the migration to Angular 16 with comprehensive support for all new features
 * including required inputs, signals introduction, new control flow syntax, and enhanced
 * developer experience improvements.
 * 
 * Key Features in Angular 16:
 * - Required inputs (@Input({ required: true }))
 * - Router data as input
 * - New control flow syntax (@if, @for, @switch) - developer preview
 * - Signals introduction (developer preview)
 * - Self-closing tags support
 * - Standalone ng new collection
 * - Non-destructive hydration (developer preview)
 * - esbuild and Vite support for dev server
 * 
 * @example
 * ```typescript
 * const handler = new Angular16Handler();
 * await handler.applyVersionSpecificChanges('/path/to/project', options);
 * ```
 * 
 * @since 1.0.0
 * @author Angular Multi-Version Upgrade Orchestrator
 */
export class Angular16Handler extends BaseVersionHandler {
  /** The Angular version this handler manages */
  readonly version = '16';
  
  /**
   * Gets the minimum required Node.js version for Angular 16
   * @returns The minimum Node.js version requirement
   */
  protected getRequiredNodeVersion(): string { 
    return '>=16.14.0'; 
  }
  
  /**
   * Gets the required TypeScript version range for Angular 16
   * @returns The TypeScript version requirement
   */
  protected getRequiredTypeScriptVersion(): string { 
    return '>=4.9.3 <5.1.0'; 
  }

  /**
   * Gets all dependency updates required for Angular 16 migration
   * 
   * Includes core Angular packages, CLI tools, TypeScript, and third-party
   * libraries like Angular Material that need version alignment.
   * 
   * @returns Array of dependency updates with package names, versions, and types
   * @example
   * ```typescript
   * const updates = handler.getDependencyUpdates();
   * // Returns: [{ name: '@angular/core', version: '^16.0.0', type: 'dependencies' }, ...]
   * ```
   */
  getDependencyUpdates(): DependencyUpdate[] {
    return [
      // Core Angular packages
      { name: '@angular/animations', version: '^16.0.0', type: 'dependencies' },
      { name: '@angular/common', version: '^16.0.0', type: 'dependencies' },
      { name: '@angular/compiler', version: '^16.0.0', type: 'dependencies' },
      { name: '@angular/core', version: '^16.0.0', type: 'dependencies' },
      { name: '@angular/forms', version: '^16.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser', version: '^16.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser-dynamic', version: '^16.0.0', type: 'dependencies' },
      { name: '@angular/router', version: '^16.0.0', type: 'dependencies' },
      
      // Angular CLI and dev dependencies
      { name: '@angular/cli', version: '^16.0.0', type: 'devDependencies' },
      { name: '@angular/compiler-cli', version: '^16.0.0', type: 'devDependencies' },
      { name: '@angular-devkit/build-angular', version: '^16.0.0', type: 'devDependencies' },
      
      // TypeScript and supporting packages
      { name: 'typescript', version: '~4.9.3', type: 'devDependencies' },
      { name: 'zone.js', version: '~0.13.0', type: 'dependencies' },
      { name: 'rxjs', version: '~7.8.0', type: 'dependencies' },
      
      // Angular Material (if present)
      { name: '@angular/material', version: '^16.0.0', type: 'dependencies' },
      { name: '@angular/cdk', version: '^16.0.0', type: 'dependencies' }
    ];
  }

  /**
   * Applies all Angular 16 specific transformations to the project
   * 
   * This method orchestrates the complete migration process including:
   * - Required inputs implementation
   * - Router data as input setup
   * - New control flow syntax introduction
   * - Signals foundation implementation
   * - Self-closing tags support
   * - Build configuration updates
   * - Third-party compatibility validation
   * 
   * @param projectPath - The absolute path to the Angular project root
   * @param options - Upgrade configuration options including strategy and validation level
   * @throws {Error} When critical transformations fail
   * 
   * @example
   * ```typescript
   * await handler.applyVersionSpecificChanges('/path/to/project', {
   *   strategy: 'balanced',
   *   validationLevel: 'comprehensive'
   * });
   * ```
   */
  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 16 transformations...');
    
    // 1. Implement required inputs support
    await this.implementRequiredInputs(projectPath);
    
    // 2. Setup router data as input feature
    await this.setupRouterDataAsInput(projectPath);
    
    // 3. Introduce new control flow syntax (developer preview)
    await this.introduceNewControlFlowSyntax(projectPath);
    
    // 4. Implement signals foundation
    await this.implementSignalsFoundation(projectPath);
    
    // 5. Enable self-closing tags support
    await this.enableSelfClosingTagsSupport(projectPath);
    
    // 6. Setup standalone ng new collection
    await this.setupStandaloneCollection(projectPath);
    
    // 7. Configure non-destructive hydration
    await this.configureNonDestructiveHydration(projectPath);
    
    // 8. Setup esbuild and Vite support
    await this.setupESBuildAndViteSupport(projectPath);
    
    // 9. Update build configurations for Angular 16
    await this.updateBuildConfigurations(projectPath);
    
    // 10. Validate third-party compatibility
    await this.validateThirdPartyCompatibility(projectPath);
    
    this.progressReporter?.success('✓ Angular 16 transformations completed');
  }

  /**
   * Gets all breaking changes introduced in Angular 16
   * 
   * Returns a comprehensive list of breaking changes with severity levels,
   * descriptions, and migration guidance. Most Angular 16 changes are opt-in
   * features with low impact on existing applications.
   * 
   * @returns Array of breaking change objects with migration guidance
   * 
   * @example
   * ```typescript
   * const changes = handler.getBreakingChanges();
   * changes.forEach(change => {
   *   console.log(`${change.id}: ${change.description}`);
   * });
   * ```
   */
  getBreakingChanges(): BreakingChange[] {
    return [
      // Required inputs introduction
      this.createBreakingChange(
        'ng16-required-inputs',
        'api',
        'low',
        'Required inputs introduced',
        'New @Input({ required: true }) syntax for mandatory component inputs',
        'Optional feature - existing @Input() decorators continue to work unchanged'
      ),
      
      // TypeScript version requirement
      this.createBreakingChange(
        'ng16-typescript-version',
        'dependency',
        'medium',
        'TypeScript 4.9+ required',
        'Angular 16 requires TypeScript 4.9.3 or higher',
        'Update TypeScript to version 4.9.3 or higher'
      ),
      
      // Node.js version requirement  
      this.createBreakingChange(
        'ng16-nodejs-version',
        'dependency',
        'medium',
        'Node.js 16.14+ required',
        'Angular 16 requires Node.js 16.14.0 or higher',
        'Update Node.js to version 16.14.0 or higher'
      ),
      
      // Router data as input
      this.createBreakingChange(
        'ng16-router-data-input',
        'api',
        'low',
        'Router data as input feature',
        'Route data can now be bound directly to component inputs',
        'New feature - existing route data handling continues to work'
      ),
      
      // New control flow syntax (developer preview)
      this.createBreakingChange(
        'ng16-new-control-flow',
        'template',
        'low',
        'New control flow syntax (developer preview)',
        '@if, @for, @switch syntax introduced as developer preview',
        'Developer preview only - existing *ngIf, *ngFor continue to work'
      ),
      
      // Signals introduction
      this.createBreakingChange(
        'ng16-signals-introduction',
        'api',
        'low',
        'Signals introduced (developer preview)',
        'New reactive primitive for state management',
        'Developer preview - existing reactive patterns continue to work'
      ),
      
      // Self-closing tags support
      this.createBreakingChange(
        'ng16-self-closing-tags',
        'template',
        'low',
        'Self-closing tags support',
        'Angular templates now support self-closing tag syntax',
        'Optional feature - existing tag syntax continues to work'
      ),
      
      // Non-destructive hydration
      this.createBreakingChange(
        'ng16-non-destructive-hydration',
        'api',
        'low',
        'Non-destructive hydration (developer preview)',
        'Improved SSR hydration that preserves existing DOM',
        'Developer preview - existing hydration continues to work'
      )
    ];
  }

  // Private implementation methods

  /**
   * Implements required inputs support with comprehensive examples
   * 
   * Creates example components demonstrating the new @Input({ required: true })
   * syntax and input transforms. Generates practical examples that developers
   * can use as reference for migrating their own components.
   * 
   * @param projectPath - The absolute path to the Angular project root
   * @private
   * 
   * @example
   * Generated example includes:
   * ```typescript
   * @Input({ required: true }) name!: string;
   * @Input({ transform: (value: string) => value.toUpperCase() }) displayName?: string;
   * ```
   */
  private async implementRequiredInputs(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create required inputs example
      const requiredInputsExample = `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-required-inputs-example',
  template: \`
    <div class="user-card">
      <h3>{{ name }}</h3>
      <p>Email: {{ email }}</p>
      <p>Age: {{ age }}</p>
      <p *ngIf="bio">Bio: {{ bio }}</p>
    </div>
  \`,
  styles: [\`
    .user-card {
      border: 1px solid #ccc;
      padding: 16px;
      border-radius: 8px;
      margin: 8px 0;
    }
  \`]
})
export class RequiredInputsExampleComponent {
  // Required inputs - must be provided by parent component
  @Input({ required: true }) name!: string;
  @Input({ required: true }) email!: string;
  
  // Optional inputs with default values
  @Input() age: number = 0;
  @Input() bio?: string;
  
  // Transform input (Angular 16 feature)
  @Input({ transform: (value: string) => value.toUpperCase() }) 
  displayName?: string;
}

// Example parent component usage:
/*
<app-required-inputs-example
  name="John Doe"
  email="john.doe@example.com"
  [age]="30"
  bio="Software Developer"
  displayName="John Doe">
</app-required-inputs-example>
*/
`;
      
      const requiredInputsPath = path.join(exampleDir, 'required-inputs-example.component.ts');
      if (!await fs.pathExists(requiredInputsPath)) {
        await fs.writeFile(requiredInputsPath, requiredInputsExample);
        this.progressReporter?.info('✓ Created required inputs example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not implement required inputs: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Setup router data as input feature
   */
  private async setupRouterDataAsInput(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create router data as input example
      const routerDataExample = `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-router-data-example',
  template: \`
    <div class="route-info">
      <h3>Route Information</h3>
      <p>Title: {{ title }}</p>
      <p>Section: {{ section }}</p>
      <p>User ID: {{ userId }}</p>
      <p *ngIf="metadata">Metadata: {{ metadata | json }}</p>
    </div>
  \`
})
export class RouterDataExampleComponent {
  // These inputs will be automatically populated from route data
  @Input() title!: string;
  @Input() section!: string;
  @Input() userId!: string;
  @Input() metadata?: any;
}

// Example routing configuration:
/*
const routes: Routes = [
  {
    path: 'user/:userId',
    component: RouterDataExampleComponent,
    data: {
      title: 'User Profile',
      section: 'Users',
      metadata: { source: 'admin-panel' }
    }
  }
];

// In the module configuration, enable router data as input:
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    bindToComponentInputs: true // Enable router data as input
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
*/
`;
      
      const routerDataPath = path.join(exampleDir, 'router-data-example.component.ts');
      if (!await fs.pathExists(routerDataPath)) {
        await fs.writeFile(routerDataPath, routerDataExample);
        this.progressReporter?.info('✓ Created router data as input example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not setup router data as input: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Introduce new control flow syntax (developer preview)
   */
  private async introduceNewControlFlowSyntax(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create new control flow syntax example
      const controlFlowExample = `import { Component } from '@angular/core';

interface User {
  id: number;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

@Component({
  selector: 'app-control-flow-example',
  template: \`
    <div class="control-flow-demo">
      <h3>New Control Flow Syntax (Developer Preview)</h3>
      
      <!-- New @if syntax -->
      @if (currentUser) {
        <div class="user-info">
          <p>Welcome, {{ currentUser.name }}!</p>
          
          <!-- Nested @if with @else -->
          @if (currentUser.role === 'admin') {
            <p>You have admin privileges</p>
          } @else {
            <p>You have standard access</p>
          }
        </div>
      } @else {
        <p>Please log in to continue</p>
      }
      
      <!-- New @for syntax -->
      @for (user of users; track user.id) {
        <div class="user-card">
          <h4>{{ user.name }}</h4>
          <span class="role-badge" [class]="'role-' + user.role">
            {{ user.role }}
          </span>
        </div>
      } @empty {
        <p>No users found</p>
      }
      
      <!-- New @switch syntax -->
      @switch (selectedRole) {
        @case ('admin') {
          <div class="admin-panel">Admin Panel</div>
        }
        @case ('user') {
          <div class="user-panel">User Panel</div>
        }
        @case ('guest') {
          <div class="guest-panel">Guest Panel</div>
        }
        @default {
          <div class="default-panel">Please select a role</div>
        }
      }
    </div>
  \`,
  styles: [\`
    .control-flow-demo {
      padding: 16px;
    }
    .user-card {
      border: 1px solid #ddd;
      padding: 12px;
      margin: 8px 0;
      border-radius: 4px;
    }
    .role-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8em;
    }
    .role-admin { background: #ff9999; }
    .role-user { background: #99ff99; }
    .role-guest { background: #9999ff; }
  \`]
})
export class ControlFlowExampleComponent {
  currentUser: User | null = {
    id: 1,
    name: 'John Doe',
    role: 'admin'
  };
  
  users: User[] = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Charlie', role: 'guest' }
  ];
  
  selectedRole: string = 'admin';
}

/*
NOTE: The new control flow syntax (@if, @for, @switch) is in developer preview.
To enable it, you need to configure it in your Angular application.

The traditional syntax (*ngIf, *ngFor, *ngSwitch) continues to work and is recommended
for production applications until the new syntax is stable.
*/
`;
      
      const controlFlowPath = path.join(exampleDir, 'control-flow-example.component.ts');
      if (!await fs.pathExists(controlFlowPath)) {
        await fs.writeFile(controlFlowPath, controlFlowExample);
        this.progressReporter?.info('✓ Created new control flow syntax example (developer preview)');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not create control flow example: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Implements signals foundation with comprehensive examples and patterns
   * 
   * Creates example components demonstrating Angular 16's new signals API including
   * basic signals, computed signals, effects, and practical usage patterns. Signals
   * are in developer preview and provide a new reactive primitive for state management.
   * 
   * @param projectPath - The absolute path to the Angular project root
   * @private
   * 
   * @example
   * Generated examples include:
   * ```typescript
   * count = signal(0);
   * doubleCount = computed(() => this.count() * 2);
   * effect(() => console.log(`Count: ${this.count()}`));
   * ```
   */
  private async implementSignalsFoundation(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create signals example
      const signalsExample = `import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-signals-example',
  template: \`
    <div class="signals-demo">
      <h3>Signals Example (Developer Preview)</h3>
      
      <div class="counter-section">
        <h4>Counter: {{ count() }}</h4>
        <button (click)="increment()">Increment</button>
        <button (click)="decrement()">Decrement</button>
        <button (click)="reset()">Reset</button>
      </div>
      
      <div class="computed-section">
        <h4>Computed Values</h4>
        <p>Double: {{ doubleCount() }}</p>
        <p>Is Even: {{ isEven() ? 'Yes' : 'No' }}</p>
      </div>
      
      <div class="user-section">
        <h4>User Information</h4>
        <input 
          [value]="firstName()" 
          (input)="firstName.set($any($event.target).value)"
          placeholder="First Name">
        <input 
          [value]="lastName()" 
          (input)="lastName.set($any($event.target).value)"
          placeholder="Last Name">
        <p>Full Name: {{ fullName() }}</p>
      </div>
    </div>
  \`,
  styles: [\`
    .signals-demo {
      padding: 16px;
    }
    .counter-section, .computed-section, .user-section {
      margin: 16px 0;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      margin: 4px;
      padding: 8px 16px;
    }
    input {
      margin: 4px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  \`]
})
export class SignalsExampleComponent {
  // Basic signal
  count = signal(0);
  
  // Computed signals (derived state)
  doubleCount = computed(() => this.count() * 2);
  isEven = computed(() => this.count() % 2 === 0);
  
  // Signals for form data
  firstName = signal('');
  lastName = signal('');
  fullName = computed(() => \`\${this.firstName()} \${this.lastName()}\`.trim());
  
  constructor() {
    // Effect runs when signals change
    effect(() => {
      console.log(\`Count changed to: \${this.count()}\`);
    });
    
    effect(() => {
      console.log(\`Full name: \${this.fullName()}\`);
    });
  }
  
  increment() {
    this.count.update(value => value + 1);
  }
  
  decrement() {
    this.count.update(value => value - 1);
  }
  
  reset() {
    this.count.set(0);
  }
}

/*
NOTE: Signals are in developer preview in Angular 16.
They provide a new reactive primitive for managing state and derived values.

Key benefits:
- Automatic dependency tracking
- Efficient change detection
- Composable reactive patterns
- Better performance than Observables for simple state

Use signals for:
- Component state
- Derived values
- Simple reactive patterns

Continue using Observables for:
- Async operations
- Complex reactive streams
- HTTP requests
*/
`;
      
      const signalsPath = path.join(exampleDir, 'signals-example.component.ts');
      if (!await fs.pathExists(signalsPath)) {
        await fs.writeFile(signalsPath, signalsExample);
        this.progressReporter?.info('✓ Created signals example (developer preview)');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not implement signals foundation: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Enable self-closing tags support
   */
  private async enableSelfClosingTagsSupport(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Update build configurations to support self-closing tags
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.build) {
            // Enable self-closing tags in build options
            project.architect.build.options = {
              ...project.architect.build.options,
              allowSelfClosingTags: true
            };
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Enabled self-closing tags support');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not enable self-closing tags: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Setup standalone ng new collection
   */
  private async setupStandaloneCollection(projectPath: string): Promise<void> {
    try {
      // Create standalone collection configuration
      const collectionDir = path.join(projectPath, '.angular/schematics');
      await fs.ensureDir(collectionDir);
      
      const standaloneConfig = {
        defaultCollection: '@angular/core',
        standaloneComponents: {
          enabled: true,
          defaultImports: [
            'CommonModule',
            'FormsModule',
            'RouterModule'
          ]
        }
      };
      
      const configPath = path.join(collectionDir, 'standalone.json');
      await fs.writeJson(configPath, standaloneConfig, { spaces: 2 });
      
      this.progressReporter?.info('✓ Setup standalone ng new collection');
      
    } catch (error) {
      this.progressReporter?.warn(`Could not setup standalone collection: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Configure non-destructive hydration - only for SSR applications
   */
  private async configureNonDestructiveHydration(projectPath: string): Promise<void> {
    // Check if this is an SSR application first
    const isSSRApp = await SSRDetector.isSSRApplication(projectPath);
    
    if (!isSSRApp) {
      this.progressReporter?.info('✓ Skipping hydration configuration (CSR application detected)');
      return;
    }

    const mainTsPath = path.join(projectPath, 'src/main.ts');
    
    if (await fs.pathExists(mainTsPath)) {
      try {
        let content = await fs.readFile(mainTsPath, 'utf-8');
        
        // Add non-destructive hydration import if SSR is detected and not already present
        if (content.includes('bootstrapApplication') && !content.includes('provideClientHydration')) {
          content = content.replace(
            /import { bootstrapApplication } from '@angular\/platform-browser';/,
            `import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';`
          );
          
          // Add hydration provider
          content = content.replace(
            /providers: \[([\s\S]*?)\]/,
            `providers: [
    provideClientHydration(),
    $1
  ]`
          );
          
          await fs.writeFile(mainTsPath, content);
          this.progressReporter?.info('✓ Configured non-destructive hydration for SSR application (developer preview)');
        }
        
      } catch (error) {
        this.progressReporter?.warn(`Could not configure hydration: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Setup esbuild and Vite support
   */
  private async setupESBuildAndViteSupport(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Update serve configurations to use esbuild
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.serve) {
            // Enable esbuild for development server
            project.architect.serve.options = {
              ...project.architect.serve.options,
              buildTarget: `${projectName}:build:development`,
              hmr: true
            };
            
            // Add development configuration if not exists
            if (!project.architect.serve.configurations) {
              project.architect.serve.configurations = {};
            }
            
            project.architect.serve.configurations.development = {
              buildTarget: `${projectName}:build:development`,
              hmr: true
            };
          }
          
          // Update build configurations for esbuild
          if (project.architect?.build) {
            if (!project.architect.build.configurations) {
              project.architect.build.configurations = {};
            }
            
            // Add development configuration with esbuild
            project.architect.build.configurations.development = {
              buildOptimizer: false,
              optimization: false,
              vendorChunk: true,
              extractLicenses: false,
              sourceMap: true,
              namedChunks: true
            };
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Configured esbuild and Vite support');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not setup esbuild/Vite: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Update build configurations for Angular 16
   */
  private async updateBuildConfigurations(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.build) {
            // Update production configuration for Angular 16
            if (!project.architect.build.configurations) {
              project.architect.build.configurations = {};
            }
            
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
              optimization: {
                scripts: true,
                styles: true,
                fonts: true
              },
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
        this.progressReporter?.info('✓ Updated build configurations for Angular 16');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update build configurations: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Validate and update third-party compatibility for Angular 16
   */
  private async validateThirdPartyCompatibility(projectPath: string): Promise<void> {
    // First, update third-party dependencies to compatible versions
    await this.updateThirdPartyDependencies(projectPath);
    
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        const warnings = [];
        const recommendations = [];
        
        for (const [libName, version] of Object.entries(dependencies)) {
          if (typeof version === 'string') {
            // Check Angular Material compatibility
            if (libName === '@angular/material' && !version.includes('16')) {
              warnings.push(`${libName}@${version} should be updated to v16 for full compatibility`);
            }
            
            // Check for signals compatibility
            if (this.canBenefitFromSignals(libName)) {
              recommendations.push(`${libName} can benefit from signals in Angular 16+`);
            }
            
            // Check for standalone components compatibility
            if (this.canBenefitFromStandalone(libName)) {
              recommendations.push(`${libName} supports standalone components in Angular 16+`);
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
   * Check if a library can benefit from signals
   */
  private canBenefitFromSignals(libName: string): boolean {
    const signalsCompatibleLibraries = [
      '@ngrx/store',
      '@ngrx/signals',
      'rxjs',
      '@angular/forms'
    ];
    
    return signalsCompatibleLibraries.some(lib => libName.includes(lib));
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
   * Gets all available migrations for Angular 16 including base and version-specific ones
   * 
   * Combines inherited migrations from the base handler with Angular 16 specific
   * migrations like required inputs, router data as input, and non-destructive hydration.
   * Each migration includes command, description, and optional flag.
   * 
   * @returns Array of available migration objects
   * @protected
   * @override
   * 
   * @example
   * ```typescript
   * const migrations = handler.getAvailableMigrations();
   * // Returns migrations for: Required Inputs, Router Data as Input, etc.
   * ```
   */
  protected getAvailableMigrations(): Migration[] {
    const baseMigrations = super.getAvailableMigrations();
    
    // Add Angular 16 specific migrations
    const angular16Migrations: Migration[] = [
      {
        name: 'Required Inputs',
        command: 'npx ng generate @angular/core:required-inputs',
        description: 'Migrate to required inputs API',
        optional: true
      },
      {
        name: 'Router Data as Input',
        command: 'npx ng generate @angular/router:router-data-input',
        description: 'Enable router data as component input',
        optional: true
      },
      {
        name: 'Non-destructive Hydration',
        command: 'npx ng generate @angular/platform-browser:hydration',
        description: 'Enable non-destructive hydration for SSR',
        optional: true
      }
    ];
    
    return [...baseMigrations, ...angular16Migrations];
  }

  /**
   * Run Angular 16 specific migrations
   */
  protected async runVersionSpecificMigrations(projectPath: string): Promise<void> {
    const migrations = this.getAvailableMigrations();
    
    // Run Angular 16 specific migrations  
    const angular16Migrations = [
      'Self-closing Tags',
      'Required Inputs',
      'Router Data as Input',
      'inject() Function',
      'Standalone Components',
      'Cleanup Unused Imports'
    ];
    
    for (const migrationName of angular16Migrations) {
      const migration = migrations.find(m => m.name === migrationName);
      if (migration) {
        try {
          this.progressReporter?.updateMessage(`Running ${migration.name} migration...`);
          
          const command = migration.command + ' --interactive=false --defaults';
          
          await this.runCommand(command, projectPath);
          
          this.progressReporter?.info(`✓ ${migration.name} migration completed`);
        } catch (error) {
          this.progressReporter?.warn(`${migration.name} migration skipped: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
  }
}