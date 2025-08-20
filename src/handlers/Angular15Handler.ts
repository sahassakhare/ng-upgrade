import * as fs from 'fs-extra';
import * as path from 'path';
import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate } from '../types';
import { SSRDetector } from '../utils/SSRDetector';
import { DependencyCompatibilityMatrix } from '../utils/DependencyCompatibilityMatrix';

/**
 * Angular 15 Handler - Standalone APIs stabilization and Image directive
 * 
 * Key Features in Angular 15:
 * - Standalone APIs stabilization (components, directives, pipes)
 * - Angular Image directive with built-in optimizations
 * - MDC-based Angular Material migration
 * - Better stack traces in development
 * - Directive composition API
 * - Optional guards with inject() function
 * - Extended developer experience improvements
 */
export class Angular15Handler extends BaseVersionHandler {
  readonly version = '15';

  protected getRequiredNodeVersion(): string {
    return '>=14.20.0';
  }

  protected getRequiredTypeScriptVersion(): string {
    return '>=4.8.2 <4.10.0';
  }

  /**
   * Get Angular 15 dependencies with correct versions
   */
  getDependencyUpdates(): DependencyUpdate[] {
    return [
      // Core Angular packages
      { name: '@angular/animations', version: '^15.0.0', type: 'dependencies' },
      { name: '@angular/common', version: '^15.0.0', type: 'dependencies' },
      { name: '@angular/compiler', version: '^15.0.0', type: 'dependencies' },
      { name: '@angular/core', version: '^15.0.0', type: 'dependencies' },
      { name: '@angular/forms', version: '^15.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser', version: '^15.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser-dynamic', version: '^15.0.0', type: 'dependencies' },
      { name: '@angular/router', version: '^15.0.0', type: 'dependencies' },
      
      // Angular CLI and dev dependencies
      { name: '@angular/cli', version: '^15.0.0', type: 'devDependencies' },
      { name: '@angular/compiler-cli', version: '^15.0.0', type: 'devDependencies' },
      { name: '@angular-devkit/build-angular', version: '^15.0.0', type: 'devDependencies' },
      
      // TypeScript and supporting packages
      { name: 'typescript', version: '~4.8.2', type: 'devDependencies' },
      { name: 'zone.js', version: '~0.12.0', type: 'dependencies' },
      { name: 'rxjs', version: '~7.5.0', type: 'dependencies' },
      
      // Angular Material and CDK - MDC-based
      { name: '@angular/material', version: '^15.0.0', type: 'dependencies' },
      { name: '@angular/cdk', version: '^15.0.0', type: 'dependencies' },
      
      // Third-party Angular ecosystem packages
      ...DependencyCompatibilityMatrix.getCompatibleDependencies('15').map(dep => ({
        name: dep.name,
        version: dep.version,
        type: dep.type as 'dependencies' | 'devDependencies'
      }))
    ];
  }

  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 15 transformations...');
    
    // Check if this is an SSR application
    const isSSRApp = await SSRDetector.isSSRApplication(projectPath);
    this.progressReporter?.info(`Application type: ${isSSRApp ? 'SSR (Server-Side Rendering)' : 'CSR (Client-Side Rendering)'}`);
    
    // 1. Stabilize standalone APIs and components
    await this.stabilizeStandaloneAPIs(projectPath);
    
    // 2. Implement Angular Image directive with optimizations
    await this.implementImageDirective(projectPath);
    
    // 3. Setup MDC-based Angular Material migration
    await this.setupMDCMaterialMigration(projectPath);
    
    // 4. Configure better stack traces for development
    await this.configureBetterStackTraces(projectPath);
    
    // 5. Implement directive composition API
    await this.implementDirectiveComposition(projectPath);
    
    // 6. Setup optional guards with inject() function
    await this.setupOptionalInjectGuards(projectPath);
    
    // 7. Enhanced developer experience improvements
    await this.enhancedDeveloperExperience(projectPath);
    
    // 8. Update build configurations for Angular 15
    await this.updateBuildConfigurations(projectPath);
    
    // 9. Validate third-party compatibility
    await this.validateThirdPartyCompatibility(projectPath);
    
    this.progressReporter?.success('✓ Angular 15 transformations completed');
  }

  getBreakingChanges(): BreakingChange[] {
    return [
      // Standalone APIs stabilization
      this.createBreakingChange(
        'ng15-standalone-apis-stable',
        'api',
        'low',
        'Standalone APIs stabilized',
        'Standalone components, directives, and pipes are now stable APIs',
        'No breaking changes - APIs are now stable and ready for production use'
      ),
      
      // TypeScript version requirement
      this.createBreakingChange(
        'ng15-typescript-version',
        'dependency',
        'medium',
        'TypeScript 4.8+ required',
        'Angular 15 requires TypeScript 4.8.2 or higher',
        'Update TypeScript to version 4.8.2 or higher'
      ),
      
      // Node.js version requirement
      this.createBreakingChange(
        'ng15-nodejs-version',
        'dependency',
        'medium',
        'Node.js 14.20+ required',
        'Angular 15 requires Node.js 14.20.0 or higher',
        'Update Node.js to version 14.20.0 or higher'
      ),
      
      // MDC-based Angular Material
      this.createBreakingChange(
        'ng15-material-mdc',
        'dependency',
        'medium',
        'Angular Material now MDC-based',
        'Angular Material components are now based on Material Design Components (MDC)',
        'Update Material components and styles for MDC compatibility'
      ),
      
      // Image directive optimization
      this.createBreakingChange(
        'ng15-image-directive',
        'api',
        'low',
        'New optimized Image directive',
        'NgOptimizedImage directive provides built-in image optimizations',
        'New feature - existing img tags continue to work'
      ),
      
      // Directive composition API
      this.createBreakingChange(
        'ng15-directive-composition',
        'api',
        'low',
        'Directive composition API',
        'New API for composing directive functionality',
        'New feature - existing directive patterns continue to work'
      ),
      
      // Better stack traces
      this.createBreakingChange(
        'ng15-stack-traces',
        'config',
        'low',
        'Improved development stack traces',
        'Better error reporting and debugging in development mode',
        'No action required - automatic improvement'
      )
    ];
  }

  // Private implementation methods

  /**
   * Stabilize standalone APIs and provide migration examples
   */
  private async stabilizeStandaloneAPIs(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create stable standalone API examples
      const standaloneExample = `import { Component, Directive, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Stable standalone component with imports
@Component({
  selector: 'app-standalone-stable',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: \`
    <div class="standalone-component">
      <h3>Stable Standalone Component (Angular 15+)</h3>
      <p>{{ message | uppercase }}</p>
      <input [(ngModel)]="message" placeholder="Enter message">
      <div *ngIf="showDetails">
        <p>Standalone APIs are now stable and production-ready!</p>
        <button (click)="toggleDetails()">Hide Details</button>
      </div>
      <div *ngIf="!showDetails">
        <button (click)="toggleDetails()">Show Details</button>
      </div>
      <nav>
        <a routerLink="/home">Home</a> |
        <a routerLink="/about">About</a>
      </nav>
    </div>
  \`,
  styles: [\`
    .standalone-component {
      padding: 20px;
      border: 2px solid #4caf50;
      border-radius: 8px;
      margin: 16px 0;
    }
    button {
      margin: 8px 4px;
      padding: 8px 16px;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    input {
      padding: 8px;
      margin: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    nav {
      margin-top: 16px;
    }
    nav a {
      color: #1976d2;
      text-decoration: none;
      margin: 0 8px;
    }
  \`]
})
export class StandaloneStableComponent {
  message = 'Hello from stable standalone component!';
  showDetails = false;
  
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}

// Stable standalone directive
@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = '#ffeb3b';
    this.el.nativeElement.style.padding = '4px';
    this.el.nativeElement.style.borderRadius = '2px';
  }
}

// Stable standalone pipe
@Pipe({
  name: 'titleCase',
  standalone: true
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

// Example of using standalone APIs together
@Component({
  selector: 'app-standalone-composition',
  standalone: true,
  imports: [CommonModule, HighlightDirective, TitleCasePipe],
  template: \`
    <div>
      <h4>Standalone API Composition</h4>
      <p appHighlight>{{ title | titleCase }}</p>
      <p>This demonstrates stable standalone components, directives, and pipes working together.</p>
    </div>
  \`
})
export class StandaloneCompositionComponent {
  title = 'angular 15 standalone apis are stable';
}
`;
      
      const stablePath = path.join(exampleDir, 'standalone-stable-apis.component.ts');
      if (!await fs.pathExists(stablePath)) {
        await fs.writeFile(stablePath, standaloneExample);
        this.progressReporter?.info('✓ Created stable standalone APIs examples');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not stabilize standalone APIs: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Implement Angular Image directive with optimizations
   */
  private async implementImageDirective(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create optimized image directive example
      const imageExample = `import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-optimized-image-example',
  standalone: true,
  imports: [NgOptimizedImage],
  template: \`
    <div class="image-gallery">
      <h3>Optimized Image Directive (Angular 15+)</h3>
      
      <!-- Basic optimized image -->
      <div class="image-container">
        <h4>Basic Optimized Image</h4>
        <img ngSrc="/assets/hero-image.jpg" 
             alt="Hero image"
             width="400" 
             height="300"
             priority>
      </div>
      
      <!-- Responsive optimized image -->
      <div class="image-container">
        <h4>Responsive Optimized Image</h4>
        <img ngSrc="/assets/responsive-image.jpg" 
             alt="Responsive image"
             width="800" 
             height="600"
             sizes="(max-width: 768px) 100vw, 50vw">
      </div>
      
      <!-- Lazy loaded optimized image -->
      <div class="image-container">
        <h4>Lazy Loaded Optimized Image</h4>
        <img ngSrc="/assets/lazy-image.jpg" 
             alt="Lazy loaded image"
             width="400" 
             height="300"
             loading="lazy">
      </div>
      
      <!-- Image with placeholder -->
      <div class="image-container">
        <h4>Image with Placeholder</h4>
        <img ngSrc="/assets/placeholder-image.jpg" 
             alt="Image with placeholder"
             width="400" 
             height="300"
             placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+">
      </div>
    </div>
  \`,
  styles: [\`
    .image-gallery {
      padding: 20px;
    }
    .image-container {
      margin: 20px 0;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .image-container h4 {
      margin-top: 0;
      color: #1976d2;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  \`]
})
export class OptimizedImageExampleComponent {
  // Component logic for handling image events if needed
  onImageLoad(event: Event) {
    console.log('Image loaded:', event);
  }
  
  onImageError(event: Event) {
    console.log('Image failed to load:', event);
  }
}

/*
Key benefits of NgOptimizedImage directive:

1. Automatic performance optimizations:
   - Lazy loading by default
   - Proper sizing to prevent layout shift
   - Preload critical images with 'priority'
   - Responsive image loading with 'sizes'

2. Built-in best practices:
   - Requires width and height attributes
   - Warns about missing alt text
   - Validates image loading performance
   - Prevents common performance pitfalls

3. Developer experience:
   - Clear error messages for misconfigurations
   - Runtime warnings for performance issues
   - Easy migration from standard img tags
   - TypeScript support for all attributes

Usage guidelines:
- Use 'priority' for above-the-fold images
- Set appropriate 'sizes' for responsive images
- Provide 'alt' text for accessibility
- Include 'width' and 'height' to prevent layout shift
- Use 'loading="lazy"' for below-the-fold images
*/
`;
      
      const imagePath = path.join(exampleDir, 'optimized-image-example.component.ts');
      if (!await fs.pathExists(imagePath)) {
        await fs.writeFile(imagePath, imageExample);
        this.progressReporter?.info('✓ Created optimized image directive example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not implement image directive: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Setup MDC-based Angular Material migration
   */
  private async setupMDCMaterialMigration(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        
        // Check if Angular Material is being used
        if (packageJson.dependencies?.['@angular/material']) {
          // Create MDC migration guide
          const migrationDir = path.join(projectPath, 'src/app/migrations');
          await fs.ensureDir(migrationDir);
          
          const mdcMigrationGuide = `/**
 * Angular Material 15+ MDC Migration Guide
 * 
 * Angular Material 15 introduces Material Design Components (MDC) as the foundation
 * for all components. This provides better alignment with Material Design specifications.
 * 
 * Key Changes:
 * 
 * 1. Component Structure:
 *    - Internal DOM structure of components has changed
 *    - CSS classes have been updated to follow MDC naming
 *    - Some component APIs have been refined
 * 
 * 2. Styling Changes:
 *    - Update custom CSS that targets internal component structure
 *    - Use Angular Material's theming APIs instead of direct CSS targeting
 *    - Check for styling regressions after upgrade
 * 
 * 3. Migration Steps:
 *    - Run: ng update @angular/material
 *    - Test all Material components thoroughly
 *    - Update custom CSS that targets Material component internals
 *    - Verify accessibility improvements
 * 
 * 4. Components Affected:
 *    - MatButton: New ripple implementation
 *    - MatCard: Updated elevation and styling
 *    - MatCheckbox: MDC-based implementation
 *    - MatChips: Significant API changes
 *    - MatFormField: Improved accessibility
 *    - MatList: Better semantic structure
 *    - MatMenu: Enhanced keyboard navigation
 *    - MatRadio: MDC-based styling
 *    - MatSelect: Improved dropdown behavior
 *    - MatSlider: New MDC implementation
 *    - MatTabs: Enhanced accessibility
 *    - MatTooltip: Better positioning
 * 
 * 5. Testing Checklist:
 *    □ Visual regression testing for all Material components
 *    □ Accessibility testing (screen readers, keyboard navigation)
 *    □ Custom theme compatibility
 *    □ Component behavior in different screen sizes
 *    □ Custom CSS overrides still working
 *    □ Form validation and interaction
 */

// Example of updated Material component usage in Angular 15
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-mdc-migration-example',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  template: \`
    <mat-card class="example-card">
      <mat-card-header>
        <mat-card-title>MDC-Based Material Components</mat-card-title>
        <mat-card-subtitle>Angular 15+ Material Design Components</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <p>These components are now based on Material Design Components (MDC):</p>
        
        <mat-form-field appearance="fill">
          <mat-label>Enter your name</mat-label>
          <input matInput placeholder="Name">
        </mat-form-field>
        
        <mat-checkbox>I agree to the terms</mat-checkbox>
      </mat-card-content>
      
      <mat-card-actions>
        <button mat-raised-button color="primary">Submit</button>
        <button mat-button>Cancel</button>
      </mat-card-actions>
    </mat-card>
  \`,
  styles: [\`
    .example-card {
      max-width: 400px;
      margin: 20px;
    }
    mat-form-field {
      width: 100%;
      margin: 10px 0;
    }
    mat-checkbox {
      margin: 10px 0;
    }
  \`]
})
export class MDCMigrationExampleComponent {}
`;
          
          const guidePath = path.join(migrationDir, 'mdc-migration-guide.ts');
          if (!await fs.pathExists(guidePath)) {
            await fs.writeFile(guidePath, mdcMigrationGuide);
            this.progressReporter?.info('✓ Created MDC migration guide for Angular Material');
          }
        }
        
      } catch (error) {
        this.progressReporter?.warn(`Could not setup MDC migration: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Configure better stack traces for development
   */
  private async configureBetterStackTraces(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Update development configurations for better stack traces
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.build) {
            // Enhanced development configuration
            if (!project.architect.build.configurations) {
              project.architect.build.configurations = {};
            }
            
            // Update development configuration for better debugging
            project.architect.build.configurations.development = {
              ...project.architect.build.configurations.development,
              sourceMap: {
                scripts: true,
                styles: true,
                vendor: true,
                hidden: false
              },
              optimization: false,
              namedChunks: true,
              vendorChunk: true,
              buildOptimizer: false
            };
          }
          
          if (project.architect?.serve) {
            // Enhanced serve configuration
            project.architect.serve.options = {
              ...project.architect.serve.options,
              buildTarget: `${projectName}:build:development`
            };
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Configured better stack traces for development');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not configure stack traces: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Implement directive composition API
   */
  private async implementDirectiveComposition(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create directive composition example
      const compositionExample = `import { Component, Directive, HostBinding, HostListener, Input } from '@angular/core';

// Base directives for composition
@Directive({
  selector: '[appClickable]',
  standalone: true
})
export class ClickableDirective {
  @HostBinding('style.cursor') cursor = 'pointer';
  @HostBinding('tabindex') tabindex = '0';
  
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log('Clickable element clicked:', event.target);
  }
  
  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
    (event.target as HTMLElement).click();
  }
}

@Directive({
  selector: '[appHighlightable]',
  standalone: true
})
export class HighlightableDirective {
  @Input() highlightColor = '#ffeb3b';
  
  @HostListener('mouseenter')
  onMouseEnter() {
    this.setHighlight(this.highlightColor);
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    this.setHighlight('');
  }
  
  private setHighlight(color: string) {
    const element = document.querySelector('[appHighlightable]') as HTMLElement;
    if (element) {
      element.style.backgroundColor = color;
    }
  }
}

@Directive({
  selector: '[appLoadingState]',
  standalone: true
})
export class LoadingStateDirective {
  @Input() set appLoadingState(isLoading: boolean) {
    this.updateLoadingState(isLoading);
  }
  
  private updateLoadingState(isLoading: boolean) {
    const element = document.querySelector('[appLoadingState]') as HTMLElement;
    if (element) {
      element.style.opacity = isLoading ? '0.5' : '1';
      element.style.pointerEvents = isLoading ? 'none' : 'auto';
      
      if (isLoading) {
        element.setAttribute('aria-busy', 'true');
      } else {
        element.removeAttribute('aria-busy');
      }
    }
  }
}

// Composed directive using multiple behaviors
@Directive({
  selector: '[appInteractiveCard]',
  standalone: true,
  hostDirectives: [
    ClickableDirective,
    {
      directive: HighlightableDirective,
      inputs: ['highlightColor']
    },
    {
      directive: LoadingStateDirective,
      inputs: ['appLoadingState']
    }
  ]
})
export class InteractiveCardDirective {
  // This directive composes multiple behaviors
  // without implementing them directly
}

// Example component using directive composition
@Component({
  selector: 'app-directive-composition-example',
  standalone: true,
  imports: [
    ClickableDirective,
    HighlightableDirective,
    LoadingStateDirective,
    InteractiveCardDirective
  ],
  template: \`
    <div class="composition-demo">
      <h3>Directive Composition API (Angular 15+)</h3>
      
      <div class="card-container">
        <h4>Individual Directives</h4>
        <div class="card" 
             appClickable 
             appHighlightable 
             [highlightColor]="'#e3f2fd'"
             [appLoadingState]="isLoading1">
          <p>Card with individual directives</p>
          <button (click)="toggleLoading1()">Toggle Loading</button>
        </div>
      </div>
      
      <div class="card-container">
        <h4>Composed Directive</h4>
        <div class="card" 
             appInteractiveCard
             [highlightColor]="'#f3e5f5'"
             [appLoadingState]="isLoading2">
          <p>Card with composed directive (all behaviors included)</p>
          <button (click)="toggleLoading2()">Toggle Loading</button>
        </div>
      </div>
      
      <div class="info">
        <h4>Benefits of Directive Composition:</h4>
        <ul>
          <li>Reusable behavior composition</li>
          <li>Cleaner template syntax</li>
          <li>Better separation of concerns</li>
          <li>Type-safe directive combinations</li>
          <li>Automatic input/output forwarding</li>
        </ul>
      </div>
    </div>
  \`,
  styles: [\`
    .composition-demo {
      padding: 20px;
    }
    .card-container {
      margin: 20px 0;
    }
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      margin: 8px 0;
      transition: all 0.3s ease;
    }
    .card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    button {
      padding: 8px 16px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 8px;
    }
    .info {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .info ul {
      margin: 8px 0;
    }
  \`]
})
export class DirectiveCompositionExampleComponent {
  isLoading1 = false;
  isLoading2 = false;
  
  toggleLoading1() {
    this.isLoading1 = !this.isLoading1;
  }
  
  toggleLoading2() {
    this.isLoading2 = !this.isLoading2;
  }
}

/*
Directive Composition API Benefits:

1. Reusability:
   - Create small, focused directives
   - Compose them into more complex behaviors
   - Avoid code duplication

2. Maintainability:
   - Single responsibility principle
   - Easy to test individual behaviors
   - Clear separation of concerns

3. Developer Experience:
   - Type-safe composition
   - Automatic input/output forwarding
   - Cleaner template syntax
   - Better IDE support

4. Performance:
   - No runtime overhead
   - Compile-time composition
   - Optimized by Angular compiler
*/
`;
      
      const compositionPath = path.join(exampleDir, 'directive-composition-example.component.ts');
      if (!await fs.pathExists(compositionPath)) {
        await fs.writeFile(compositionPath, compositionExample);
        this.progressReporter?.info('✓ Created directive composition API example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not implement directive composition: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Setup optional guards with inject() function
   */
  private async setupOptionalInjectGuards(projectPath: string): Promise<void> {
    try {
      const guardsDir = path.join(projectPath, 'src/app/guards');
      await fs.ensureDir(guardsDir);
      
      // Create inject-based functional guards
      const injectGuardsExample = `import { inject } from '@angular/core';
import { Router, CanActivateFn, CanActivateChildFn, CanDeactivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Functional guard using inject() - Angular 15+ approach
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAuthenticated().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};

// Role-based functional guard
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    return authService.getUserRole().pipe(
      map(userRole => {
        if (userRole === requiredRole || userRole === 'admin') {
          return true;
        } else {
          router.navigate(['/unauthorized']);
          return false;
        }
      }),
      catchError(() => {
        router.navigate(['/login']);
        return of(false);
      })
    );
  };
};

// Child route guard using inject()
export const childAuthGuard: CanActivateChildFn = (route, state) => {
  // Reuse the auth guard logic for child routes
  return authGuard(route, state);
};

// Unsaved changes guard using inject()
export const unsavedChangesGuard: CanDeactivateFn<any> = (component) => {
  const router = inject(Router);
  
  if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Do you want to leave this page?');
  }
  return true;
};

// Advanced permission guard with dependency injection
export const permissionGuard = (permission: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    // Extract additional permission from route data
    const routePermission = route.data?.['permission'];
    const requiredPermission = routePermission || permission;
    
    return authService.hasPermission(requiredPermission).pipe(
      map(hasPermission => {
        if (hasPermission) {
          return true;
        } else {
          router.navigate(['/access-denied'], {
            queryParams: { 
              required: requiredPermission,
              attempted: state.url 
            }
          });
          return false;
        }
      })
    );
  };
};

// Example service that guards depend on
// (This would typically be in a separate file)
export interface AuthService {
  isAuthenticated(): Observable<boolean>;
  getUserRole(): Observable<string>;
  hasPermission(permission: string): Observable<boolean>;
}

/*
Example usage in routing configuration:

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard('admin')]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [permissionGuard('users.read')],
    canActivateChild: [childAuthGuard],
    children: [
      {
        path: 'edit/:id',
        component: UserEditComponent,
        data: { permission: 'users.write' }
      }
    ]
  }
];

Benefits of functional guards with inject():

1. Simpler syntax - no need for classes
2. Better tree-shaking - only import what you need
3. Easier composition - guards can be easily combined
4. Type safety - full TypeScript support
5. Testability - easier to unit test pure functions
6. Reusability - guards can be parameterized
*/
`;
      
      const guardsPath = path.join(guardsDir, 'functional-guards.ts');
      if (!await fs.pathExists(guardsPath)) {
        await fs.writeFile(guardsPath, injectGuardsExample);
        this.progressReporter?.info('✓ Created functional guards with inject() example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not setup inject guards: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Enhanced developer experience improvements
   */
  private async enhancedDeveloperExperience(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Enhanced development server configuration
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.serve) {
            // Improved development server settings
            project.architect.serve.options = {
              ...project.architect.serve.options,
              hmr: true,
              liveReload: true,
              poll: 1000, // For better file watching
              open: false, // Don't auto-open browser
              host: 'localhost',
              disableHostCheck: false
            };
            
            // Enhanced development configuration
            if (!project.architect.serve.configurations) {
              project.architect.serve.configurations = {};
            }
            
            project.architect.serve.configurations.development = {
              ...project.architect.serve.configurations.development,
              buildTarget: `${projectName}:build:development`,
              hmr: true,
              liveReload: true
            };
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Enhanced developer experience configuration');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not enhance developer experience: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Update build configurations for Angular 15
   */
  private async updateBuildConfigurations(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.build) {
            // Update production configuration for Angular 15
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
                styles: {
                  minify: true,
                  inlineCritical: true
                },
                fonts: true
              },
              sourceMap: false,
              namedChunks: false,
              aot: true,
              extractLicenses: true,
              vendorChunk: false,
              buildOptimizer: true,
              // Angular 15 specific optimizations
              preserveSymlinks: false,
              extractCss: true
            };
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Updated build configurations for Angular 15');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update build configurations: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Validate third-party compatibility for Angular 15
   */
  private async validateThirdPartyCompatibility(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        const warnings = [];
        const recommendations = [];
        
        for (const [libName, version] of Object.entries(dependencies)) {
          if (typeof version === 'string') {
            // Check Angular Material MDC compatibility
            if (libName === '@angular/material' && !version.includes('15')) {
              warnings.push(`${libName}@${version} should be updated to v15 for MDC-based components`);
            }
            
            // Check for standalone components compatibility
            if (this.canBenefitFromStandalone(libName)) {
              recommendations.push(`${libName} can benefit from stable standalone APIs in Angular 15+`);
            }
            
            // Check for directive composition opportunities
            if (this.canBenefitFromDirectiveComposition(libName)) {
              recommendations.push(`${libName} can benefit from directive composition API in Angular 15+`);
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
      'primeng',
      '@ngrx/store'
    ];
    
    return standaloneCompatibleLibraries.some(lib => libName.includes(lib));
  }

  /**
   * Check if a library can benefit from directive composition
   */
  private canBenefitFromDirectiveComposition(libName: string): boolean {
    const compositionCompatibleLibraries = [
      '@angular/cdk',
      'ngx-bootstrap',
      'primeng'
    ];
    
    return compositionCompatibleLibraries.some(lib => libName.includes(lib));
  }
}