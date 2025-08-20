import * as fs from 'fs-extra';
import * as path from 'path';
import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate } from '../types';

/**
 * Angular 19 Handler - Zoneless change detection and event replay
 * 
 * Key Features in Angular 19:
 * - Zoneless change detection (experimental)
 * - Enhanced event replay for SSR hydration
 * - Improved incremental hydration
 * - Advanced SSR optimizations
 * - Better performance monitoring
 * - Enhanced developer experience
 * - Improved i18n support
 * - Advanced build optimizations
 */
export class Angular19Handler extends BaseVersionHandler {
  readonly version = '19';

  protected getRequiredNodeVersion(): string {
    return '>=18.19.1';
  }

  protected getRequiredTypeScriptVersion(): string {
    return '>=5.5.0 <5.7.0';
  }

  /**
   * Get Angular 19 dependencies with correct versions
   */
  getDependencyUpdates(): DependencyUpdate[] {
    return [
      // Core Angular packages
      { name: '@angular/animations', version: '^19.0.0', type: 'dependencies' },
      { name: '@angular/common', version: '^19.0.0', type: 'dependencies' },
      { name: '@angular/compiler', version: '^19.0.0', type: 'dependencies' },
      { name: '@angular/core', version: '^19.0.0', type: 'dependencies' },
      { name: '@angular/forms', version: '^19.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser', version: '^19.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser-dynamic', version: '^19.0.0', type: 'dependencies' },
      { name: '@angular/router', version: '^19.0.0', type: 'dependencies' },
      { name: '@angular/ssr', version: '^19.0.0', type: 'dependencies' },
      
      // Angular CLI and dev dependencies
      { name: '@angular/cli', version: '^19.0.0', type: 'devDependencies' },
      { name: '@angular/compiler-cli', version: '^19.0.0', type: 'devDependencies' },
      { name: '@angular-devkit/build-angular', version: '^19.0.0', type: 'devDependencies' },
      
      // TypeScript and supporting packages
      { name: 'typescript', version: '~5.5.0', type: 'devDependencies' },
      { name: 'zone.js', version: '~0.14.0', type: 'dependencies' }, // Still needed for compatibility
      { name: 'rxjs', version: '~7.8.0', type: 'dependencies' },
      
      // Angular Material
      { name: '@angular/material', version: '^19.0.0', type: 'dependencies' },
      { name: '@angular/cdk', version: '^19.0.0', type: 'dependencies' }
    ];
  }

  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 19 transformations...');
    
    // 1. Setup zoneless change detection (experimental)
    if (options.enableZonelessChangeDetection) {
      await this.setupZonelessChangeDetection(projectPath);
    }
    
    // 2. Enhanced event replay for SSR hydration
    await this.enhanceEventReplaySSR(projectPath);
    
    // 3. Implement incremental hydration improvements
    await this.implementIncrementalHydration(projectPath);
    
    // 4. Advanced SSR optimizations
    await this.implementAdvancedSSROptimizations(projectPath);
    
    // 5. Enhanced performance monitoring
    await this.enhancePerformanceMonitoring(projectPath);
    
    // 6. Improved developer experience features
    await this.improveDeveloperExperience(projectPath);
    
    // 7. Advanced i18n support improvements
    await this.enhanceI18nSupport(projectPath);
    
    // 8. Advanced build optimizations
    await this.implementAdvancedBuildOptimizations(projectPath);
    
    // 9. Update build configurations for Angular 19
    await this.updateBuildConfigurations(projectPath);
    
    // 10. Migrate from webpack-dev-server to esbuild dev server (Angular 18+)
    await this.migrateToEsbuildDevServer(projectPath);
    
    // 11. Validate third-party compatibility
    await this.validateThirdPartyCompatibility(projectPath);
    
    this.progressReporter?.success('✓ Angular 19 transformations completed');
  }

  getBreakingChanges(): BreakingChange[] {
    return [
      // Zoneless change detection (experimental)
      this.createBreakingChange(
        'ng19-zoneless-detection',
        'api',
        'high',
        'Zoneless change detection (experimental)',
        'Experimental zoneless change detection available as opt-in feature',
        'Opt-in experimental feature - Zone.js continues to work by default'
      ),
      
      // TypeScript version requirement
      this.createBreakingChange(
        'ng19-typescript-version',
        'dependency',
        'medium',
        'TypeScript 5.5+ required',
        'Angular 19 requires TypeScript 5.5.0 or higher',
        'Update TypeScript to version 5.5.0 or higher'
      ),
      
      // Node.js version requirement
      this.createBreakingChange(
        'ng19-nodejs-version',
        'dependency',
        'medium',
        'Node.js 18.19.1+ required',
        'Angular 19 requires Node.js 18.19.1 or higher',
        'Update Node.js to version 18.19.1 or higher'
      ),
      
      // Enhanced event replay
      this.createBreakingChange(
        'ng19-enhanced-event-replay',
        'api',
        'low',
        'Enhanced event replay for SSR',
        'Improved event capture and replay mechanisms for better hydration UX',
        'Automatic improvement - no action required'
      ),
      
      // Incremental hydration
      this.createBreakingChange(
        'ng19-incremental-hydration',
        'api',
        'low',
        'Improved incremental hydration',
        'Better strategies for selective component hydration',
        'New feature - existing hydration continues to work'
      ),
      
      // Advanced SSR optimizations
      this.createBreakingChange(
        'ng19-advanced-ssr',
        'api',
        'low',
        'Advanced SSR optimizations',
        'Enhanced server-side rendering with better performance and caching',
        'Automatic improvements - no breaking changes'
      ),
      
      // Performance monitoring
      this.createBreakingChange(
        'ng19-performance-monitoring',
        'api',
        'low',
        'Enhanced performance monitoring',
        'Better built-in performance tracking and debugging tools',
        'New feature - additional monitoring capabilities'
      )
    ];
  }

  // Private implementation methods

  /**
   * Setup zoneless change detection (experimental)
   */
  private async setupZonelessChangeDetection(projectPath: string): Promise<void> {
    try {
      // Update main.ts for zoneless change detection
      const mainTsPath = path.join(projectPath, 'src/main.ts');
      
      if (await fs.pathExists(mainTsPath)) {
        let content = await fs.readFile(mainTsPath, 'utf-8');
        
        // Add zoneless imports
        if (!content.includes('provideExperimentalZonelessChangeDetection')) {
          content = content.replace(
            /import { bootstrapApplication } from '@angular\/platform-browser';/,
            `import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';`
          );
          
          // Add zoneless provider
          content = content.replace(
            /providers: \[([\s\S]*?)\]/,
            `providers: [
    provideExperimentalZonelessChangeDetection(),
    $1
  ]`
          );
          
          await fs.writeFile(mainTsPath, content);
          this.progressReporter?.info('✓ Configured experimental zoneless change detection');
        }
      }
      
      // Create zoneless examples
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      const zonelessExample = `import { Component, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Zoneless Change Detection Example (Angular 19+ Experimental)
 * 
 * This component demonstrates how to work with zoneless change detection,
 * where Angular doesn't rely on Zone.js for detecting changes.
 */
@Component({
  selector: 'app-zoneless-example',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="zoneless-demo">
      <h3>Zoneless Change Detection (Experimental)</h3>
      
      <div class="demo-section">
        <h4>Signal-Based State Management</h4>
        <div class="counter-demo">
          <p>Counter: {{ counter() }}</p>
          <p>Double: {{ doubleCounter() }}</p>
          <p>Updates: {{ updateCount() }}</p>
          
          <div class="controls">
            <button (click)="increment()">Increment</button>
            <button (click)="decrement()">Decrement</button>
            <button (click)="reset()">Reset</button>
          </div>
        </div>
      </div>
      
      <div class="demo-section">
        <h4>Manual Change Detection</h4>
        <div class="manual-demo">
          <p>Manual value: {{ manualValue }}</p>
          <p>Last updated: {{ lastManualUpdate }}</p>
          
          <div class="controls">
            <button (click)="updateManualValue()">Update Manual Value</button>
            <button (click)="triggerChangeDetection()">Trigger Change Detection</button>
          </div>
        </div>
      </div>
      
      <div class="demo-section">
        <h4>Async Operations</h4>
        <div class="async-demo">
          <p>Async counter: {{ asyncCounter() }}</p>
          <p>Status: {{ asyncStatus() }}</p>
          
          <div class="controls">
            <button (click)="startAsyncOperation()">Start Async</button>
            <button (click)="stopAsyncOperation()">Stop</button>
          </div>
        </div>
      </div>
      
      <div class="demo-section">
        <h4>Form Integration</h4>
        <div class="form-demo">
          <input 
            type="text" 
            [(ngModel)]="formValue" 
            (input)="onFormInput($event)"
            placeholder="Type something...">
          <p>Form value: {{ formValue }}</p>
          <p>Character count: {{ formValue.length }}</p>
        </div>
      </div>
      
      <div class="info-section">
        <h4>Zoneless Benefits</h4>
        <ul>
          <li>Better performance - no Zone.js overhead</li>
          <li>Smaller bundle size - can exclude Zone.js</li>
          <li>More predictable change detection</li>
          <li>Better integration with modern web APIs</li>
          <li>Easier testing without Zone.js patches</li>
        </ul>
      </div>
    </div>
  \`,
  styles: [\`
    .zoneless-demo {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .demo-section {
      margin: 24px 0;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    
    .demo-section h4 {
      margin-top: 0;
      color: #1976d2;
    }
    
    .controls {
      display: flex;
      gap: 12px;
      margin: 16px 0;
      flex-wrap: wrap;
    }
    
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #1976d2;
      color: white;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    button:hover {
      background: #1565c0;
    }
    
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      margin-bottom: 12px;
    }
    
    .counter-demo, .manual-demo, .async-demo, .form-demo {
      background: #f9f9f9;
      padding: 16px;
      border-radius: 4px;
    }
    
    .info-section {
      background: #e3f2fd;
      padding: 20px;
      border-radius: 8px;
    }
    
    .info-section ul {
      margin: 16px 0;
    }
    
    .info-section li {
      margin: 8px 0;
    }
  \`]
})
export class ZonelessExampleComponent {
  // Signals work perfectly with zoneless change detection
  counter = signal(0);
  updateCount = signal(0);
  asyncCounter = signal(0);
  asyncStatus = signal('idle');
  
  // Traditional properties require manual change detection
  manualValue = 'Initial value';
  lastManualUpdate = new Date().toLocaleTimeString();
  formValue = '';
  
  private intervalId: any;
  
  // Computed signals
  doubleCounter = signal.computed(() => this.counter() * 2);
  
  constructor() {
    // Effects work great with zoneless change detection
    effect(() => {
      console.log('Counter changed to: ' + this.counter());
      this.updateCount.update(count => count + 1);
    });
    
    effect(() => {
      console.log('Async counter: ' + this.asyncCounter());
    });
  }
  
  // Signal-based operations (automatic change detection)
  increment() {
    this.counter.update(value => value + 1);
  }
  
  decrement() {
    this.counter.update(value => value - 1);
  }
  
  reset() {
    this.counter.set(0);
    this.updateCount.set(0);
  }
  
  // Manual change detection required for non-signal properties
  updateManualValue() {
    this.manualValue = 'Updated at ' + new Date().toLocaleTimeString();
    this.lastManualUpdate = new Date().toLocaleTimeString();
    // In zoneless mode, you need to manually trigger change detection
    // This would typically be done through a service or ChangeDetectorRef
  }
  
  triggerChangeDetection() {
    // In a real application, you would use ChangeDetectorRef.markForCheck()
    // or convert to signals for automatic updates
    console.log('Manual change detection triggered');
  }
  
  // Async operations
  startAsyncOperation() {
    this.asyncStatus.set('running');
    this.intervalId = setInterval(() => {
      this.asyncCounter.update(count => count + 1);
    }, 1000);
    
    // Auto-stop after 10 seconds
    setTimeout(() => {
      this.stopAsyncOperation();
    }, 10000);
  }
  
  stopAsyncOperation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.asyncStatus.set('stopped');
    }
  }
  
  onFormInput(event: Event) {
    // Form input with ngModel still works in zoneless mode
    const target = event.target as HTMLInputElement;
    console.log('Form input:', target.value);
  }
  
  ngOnDestroy() {
    this.stopAsyncOperation();
  }
}

/*
Zoneless Change Detection in Angular 19:

1. What is Zoneless?
   - No dependency on Zone.js
   - Manual or signal-based change detection
   - Better performance and smaller bundles
   - More predictable change detection timing

2. Migration Strategy:
   - Gradually convert to signals
   - Use OnPush change detection strategy
   - Manual change detection for edge cases
   - Test thoroughly in zoneless mode

3. Best Practices:
   - Prefer signals over traditional properties
   - Use effects for side effects
   - OnPush strategy for all components
   - Manual change detection when needed

4. Compatibility:
   - Most Angular features work without changes
   - Third-party libraries may need updates
   - Forms and router work seamlessly
   - Some async operations need manual handling

5. Performance Benefits:
   - No Zone.js monkey patching
   - Smaller bundle size
   - Faster change detection cycles
   - Better integration with modern APIs
   - Easier testing

6. Migration Checklist:
   - Enable experimental zoneless change detection
   - Convert components to use signals
   - Add OnPush change detection strategy
   - Test async operations
   - Update third-party library usage
   - Verify form functionality
   - Test routing and navigation
*/
`;
      
      const zonelessPath = path.join(exampleDir, 'zoneless-example.component.ts');
      if (!await fs.pathExists(zonelessPath)) {
        await fs.writeFile(zonelessPath, zonelessExample);
        this.progressReporter?.info('✓ Created zoneless change detection example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not setup zoneless change detection: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Enhanced event replay for SSR hydration
   */
  private async enhanceEventReplaySSR(projectPath: string): Promise<void> {
    const mainTsPath = path.join(projectPath, 'src/main.ts');
    
    if (await fs.pathExists(mainTsPath)) {
      try {
        let content = await fs.readFile(mainTsPath, 'utf-8');
        
        // Enhanced event replay configuration
        if (content.includes('provideClientHydration') && !content.includes('withEventReplay')) {
          content = content.replace(
            /import { provideClientHydration } from '@angular\/platform-browser';/,
            `import { provideClientHydration, withEventReplay } from '@angular/platform-browser';`
          );
          
          // Enhanced event replay with options
          content = content.replace(
            /provideClientHydration\(\)/,
            `provideClientHydration(
      withEventReplay({
        // Capture more event types for better UX
        events: ['click', 'input', 'change', 'submit', 'keydown', 'focus', 'blur'],
        // Increase replay buffer for complex interactions
        bufferSize: 100,
        // Enable replay debugging in development
        debug: !environment.production
      })
    )`
          );
          
          await fs.writeFile(mainTsPath, content);
          this.progressReporter?.info('✓ Enhanced event replay for SSR hydration');
        }
        
      } catch (error) {
        this.progressReporter?.warn(`Could not enhance event replay: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Implement incremental hydration improvements
   */
  private async implementIncrementalHydration(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create incremental hydration example
      const hydrationExample = `/*
 * Incremental Hydration Example for Angular 19+
 * 
 * Demonstrates advanced hydration strategies for better performance
 * and user experience during the hydration process.
 */

import { Component, signal, afterRender, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

// Hydration priority levels
type HydrationPriority = 'immediate' | 'visible' | 'interaction' | 'lazy';

@Component({
  selector: 'app-incremental-hydration',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="hydration-demo">
      <h3>Incremental Hydration (Angular 19+)</h3>
      
      <!-- Immediate hydration - critical above-the-fold content -->
      <section class="hydration-section immediate" data-hydration="immediate">
        <h4>Immediate Hydration</h4>
        <p>Critical content that hydrates immediately</p>
        <button (click)="immediateAction()">Immediate Action</button>
        <p>Status: {{ immediateStatus() }}</p>
      </section>
      
      <!-- Visible hydration - content visible in viewport -->
      <section class="hydration-section visible" data-hydration="visible">
        <h4>Visible Hydration</h4>
        <p>Content that hydrates when visible</p>
        <div class="interactive-content">
          <button (click)="visibleAction()">Visible Action</button>
          <p>Clicks: {{ visibleClicks() }}</p>
        </div>
      </section>
      
      <!-- Interaction hydration - hydrates on first interaction -->
      <section class="hydration-section interaction" data-hydration="interaction">
        <h4>Interaction Hydration</h4>
        <p>Hydrates only when user interacts</p>
        <div class="lazy-content">
          <button (click)="interactionAction()">Click to Hydrate</button>
          <p *ngIf="interactionHydrated()">Now hydrated! Actions: {{ interactionActions() }}</p>
        </div>
      </section>
      
      <!-- Lazy hydration - lowest priority -->
      <section class="hydration-section lazy" data-hydration="lazy">
        <h4>Lazy Hydration</h4>
        <p>Background content with lowest priority</p>
        <div class="background-content">
          <p>Background data: {{ backgroundData() }}</p>
          <button (click)="lazyAction()">Lazy Action</button>
        </div>
      </section>
      
      <!-- Hydration status dashboard -->
      <section class="hydration-status">
        <h4>Hydration Status</h4>
        <div class="status-grid">
          <div class="status-item">
            <label>Page Load Time:</label>
            <span>{{ pageLoadTime() }}ms</span>
          </div>
          <div class="status-item">
            <label>Hydration Complete:</label>
            <span>{{ hydrationComplete() ? 'Yes' : 'In Progress' }}</span>
          </div>
          <div class="status-item">
            <label>Interactive Time:</label>
            <span>{{ interactiveTime() }}ms</span>
          </div>
          <div class="status-item">
            <label>Components Hydrated:</label>
            <span>{{ hydratedComponents() }}</span>
          </div>
        </div>
      </section>
    </div>
  \`,
  styles: [\`
    .hydration-demo {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .hydration-section {
      margin: 24px 0;
      padding: 20px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    
    .hydration-section h4 {
      margin-top: 0;
    }
    
    .immediate {
      background: #e8f5e8;
      border: 2px solid #4caf50;
    }
    
    .visible {
      background: #e3f2fd;
      border: 2px solid #2196f3;
    }
    
    .interaction {
      background: #fff3e0;
      border: 2px solid #ff9800;
    }
    
    .lazy {
      background: #f3e5f5;
      border: 2px solid #9c27b0;
    }
    
    .hydration-status {
      background: #f5f5f5;
      border: 2px solid #666;
      margin-top: 32px;
    }
    
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    
    .status-item {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      background: white;
      border-radius: 4px;
    }
    
    .status-item label {
      font-weight: bold;
    }
    
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #1976d2;
      color: white;
      cursor: pointer;
      margin: 8px 0;
      transition: background 0.2s;
    }
    
    button:hover {
      background: #1565c0;
    }
    
    .interactive-content,
    .lazy-content,
    .background-content {
      margin-top: 12px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 4px;
    }
  \`]
})
export class IncrementalHydrationComponent {
  // Hydration status signals
  immediateStatus = signal('Hydrated immediately');
  visibleClicks = signal(0);
  interactionActions = signal(0);
  interactionHydrated = signal(false);
  backgroundData = signal('Loading...');
  
  // Performance metrics
  pageLoadTime = signal(0);
  hydrationComplete = signal(false);
  interactiveTime = signal(0);
  hydratedComponents = signal(1); // Start with immediate component
  
  private loadStartTime = performance.now();
  
  constructor() {
    // Track initial hydration
    afterNextRender(() => {
      this.pageLoadTime.set(Math.round(performance.now() - this.loadStartTime));
      this.setupIncrementalHydration();
    });
    
    // Track ongoing hydration
    afterRender(() => {
      this.updateHydrationStatus();
    });
  }
  
  immediateAction() {
    this.immediateStatus.set('Action at ' + new Date().toLocaleTimeString());
  }
  
  visibleAction() {
    this.visibleClicks.update(count => count + 1);
    if (!this.interactionHydrated()) {
      this.hydratedComponents.update(count => count + 1);
    }
  }
  
  interactionAction() {
    if (!this.interactionHydrated()) {
      this.interactionHydrated.set(true);
      this.hydratedComponents.update(count => count + 1);
      this.interactiveTime.set(Math.round(performance.now() - this.loadStartTime));
    }
    this.interactionActions.update(count => count + 1);
  }
  
  lazyAction() {
    console.log('Lazy action triggered');
    this.backgroundData.set('Updated at ' + new Date().toLocaleTimeString());
  }
  
  private setupIncrementalHydration() {
    // Simulate visible hydration with Intersection Observer
    this.setupVisibleHydration();
    
    // Setup lazy background hydration
    this.setupLazyHydration();
    
    // Mark initial hydration as complete
    setTimeout(() => {
      this.hydrationComplete.set(true);
    }, 100);
  }
  
  private setupVisibleHydration() {
    const visibleSection = document.querySelector('[data-hydration="visible"]');
    if (visibleSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Simulate hydration of visible component
            setTimeout(() => {
              this.hydratedComponents.update(count => count + 1);
            }, 100);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(visibleSection);
    }
  }
  
  private setupLazyHydration() {
    // Simulate background data loading
    setTimeout(() => {
      this.backgroundData.set('Lazy loaded data');
      this.hydratedComponents.update(count => count + 1);
    }, 2000);
  }
  
  private updateHydrationStatus() {
    // Update performance metrics
    const currentTime = performance.now() - this.loadStartTime;
    
    // Check if all components are hydrated
    if (this.hydratedComponents() >= 4 && !this.hydrationComplete()) {
      this.hydrationComplete.set(true);
      this.interactiveTime.set(Math.round(currentTime));
    }
  }
}

/*
Incremental Hydration Strategies in Angular 19:

1. Immediate Hydration:
   - Critical above-the-fold content
   - Navigation and essential interactions
   - User authentication state
   - Error boundaries

2. Visible Hydration:
   - Content visible in the viewport
   - Uses Intersection Observer
   - Balances performance and UX
   - Progressive enhancement

3. Interaction Hydration:
   - Lazy-loaded on first user interaction
   - Reduces initial JavaScript load
   - Good for complex widgets
   - Maintains perceived performance

4. Lazy Hydration:
   - Background content
   - Analytics and tracking
   - Non-critical features
   - Lowest priority

Benefits:
- Faster initial page loads
- Better Core Web Vitals scores
- Improved perceived performance
- Reduced JavaScript execution time
- Better resource utilization

Implementation Tips:
- Use signals for reactive updates
- Implement proper loading states
- Monitor hydration performance
- Test on slow devices/networks
- Graceful degradation for JavaScript disabled

Performance Metrics to Track:
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
*/
`;
      
      const hydrationPath = path.join(exampleDir, 'incremental-hydration.component.ts');
      if (!await fs.pathExists(hydrationPath)) {
        await fs.writeFile(hydrationPath, hydrationExample);
        this.progressReporter?.info('✓ Created incremental hydration example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not implement incremental hydration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Implement advanced SSR optimizations
   */
  private async implementAdvancedSSROptimizations(projectPath: string): Promise<void> {
    try {
      const serverDir = path.join(projectPath, 'src/app/server');
      await fs.ensureDir(serverDir);
      
      // Create advanced SSR configuration
      const ssrConfig = `/*
 * Advanced SSR Optimizations for Angular 19+
 * 
 * Demonstrates cutting-edge server-side rendering optimizations
 * for maximum performance and user experience.
 */

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, withFetch } from '@angular/common/http';

// Advanced SSR configuration
export const advancedSSRConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // Advanced server rendering with optimizations
    provideServerRendering({
      // Enable streaming for faster TTFB
      streaming: true,
      
      // Cache frequently requested pages
      caching: {
        enabled: true,
        ttl: 300, // 5 minutes
        strategy: 'lru',
        maxSize: 100
      },
      
      // Optimize critical resource hints
      resourceHints: {
        preload: ['fonts', 'critical-css'],
        prefetch: ['next-page-bundles'],
        preconnect: ['api-endpoints']
      },
      
      // Advanced hydration settings
      hydration: {
        strategy: 'incremental',
        prioritize: ['above-fold', 'interactive'],
        defer: ['analytics', 'tracking']
      }
    }),
    
    // Use fetch API for better server performance
    provideHttpClient(withFetch()),
    
    // Additional SSR optimizations
    // ... your other providers
  ]
};

// Server-side caching service
export class SSRCacheService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Advanced page optimization
export class PageOptimizationService {
  // Critical CSS inlining
  inlineCriticalCSS(html: string, criticalCSS: string): string {
    const inlineStyle = '<style>' + criticalCSS + '</style>';
    return html.replace('</head>', inlineStyle + '</head>');
  }
  
  // Resource hints injection
  injectResourceHints(html: string, hints: ResourceHints): string {
    let hintsHTML = '';
    
    // Preload critical resources
    hints.preload.forEach(resource => {
      hintsHTML += '<link rel="preload" href="' + resource + '" as="style">\n';
    });
    
    // Prefetch next page resources
    hints.prefetch.forEach(resource => {
      hintsHTML += '<link rel="prefetch" href="' + resource + '">\n';
    });
    
    // Preconnect to external domains
    hints.preconnect.forEach(domain => {
      hintsHTML += '<link rel="preconnect" href="' + domain + '">\n';
    });
    
    return html.replace('</head>', hintsHTML + '</head>');
  }
  
  // Optimize images for SSR
  optimizeImages(html: string): string {
    // Add loading="lazy" to images below the fold
    return html.replace(
      /<img(?![^>]*loading=)[^>]*>/g,
      (match) => {
        if (match.includes('above-fold')) {
          return match;
        }
        return match.replace('<img', '<img loading="lazy"');
      }
    );
  }
  
  // Add performance timing
  addPerformanceTiming(html: string): string {
    const timing = \`
      <script>
        window.ssrStartTime = Date.now();
        window.addEventListener('DOMContentLoaded', () => {
          const ssrTime = Date.now() - window.ssrStartTime;
          console.log('SSR hydration time:', ssrTime + 'ms');
        });
      </script>
    \`;
    
    return html.replace('</body>', timing + '</body>');
  }
}

interface ResourceHints {
  preload: string[];
  prefetch: string[];
  preconnect: string[];
}

// Express.js middleware for advanced SSR
export function advancedSSRMiddleware() {
  const cacheService = new SSRCacheService();
  const optimizationService = new PageOptimizationService();
  
  return async (req: any, res: any, next: any) => {
    const cacheKey = req.url;
    
    // Check cache first
    const cachedResponse = cacheService.get(cacheKey);
    if (cachedResponse) {
      res.setHeader('X-Cache', 'HIT');
      return res.send(cachedResponse);
    }
    
    // Intercept response to add optimizations
    const originalSend = res.send;
    res.send = function(html: string) {
      try {
        // Apply optimizations
        let optimizedHTML = html;
        
        // Inline critical CSS
        optimizedHTML = optimizationService.inlineCriticalCSS(
          optimizedHTML,
          getCriticalCSS(req.url)
        );
        
        // Add resource hints
        optimizedHTML = optimizationService.injectResourceHints(
          optimizedHTML,
          getResourceHints(req.url)
        );
        
        // Optimize images
        optimizedHTML = optimizationService.optimizeImages(optimizedHTML);
        
        // Add performance timing
        optimizedHTML = optimizationService.addPerformanceTiming(optimizedHTML);
        
        // Cache the optimized response
        cacheService.set(cacheKey, optimizedHTML);
        
        res.setHeader('X-Cache', 'MISS');
        originalSend.call(this, optimizedHTML);
      } catch (error) {
        console.error('SSR optimization error:', error);
        originalSend.call(this, html);
      }
    };
    
    next();
  };
}

// Helper functions
function getCriticalCSS(url: string): string {
  // Implementation would extract critical CSS based on route
  return '/* Critical CSS for ' + url + ' */';
}

function getResourceHints(url: string): ResourceHints {
  // Implementation would return appropriate hints based on route
  return {
    preload: ['/assets/fonts/roboto.woff2'],
    prefetch: ['/next-page-bundle.js'],
    preconnect: ['https://api.example.com']
  };
}

const routes = [
  // Your application routes
];

/*
Advanced SSR Optimizations in Angular 19:

1. Streaming SSR:
   - Faster Time to First Byte (TTFB)
   - Progressive content rendering
   - Better user perceived performance
   - Reduced server memory usage

2. Intelligent Caching:
   - Page-level caching with TTL
   - Component-level caching
   - CDN integration
   - Cache invalidation strategies

3. Resource Optimization:
   - Critical CSS inlining
   - Resource hints (preload, prefetch, preconnect)
   - Image optimization
   - Font optimization

4. Performance Monitoring:
   - Server-side timing
   - Core Web Vitals tracking
   - Error monitoring
   - Performance budgets

5. Security Enhancements:
   - Content Security Policy (CSP)
   - Security headers
   - XSS protection
   - CSRF protection

Best Practices:
- Monitor server performance metrics
- Implement proper error handling
- Use CDN for static assets
- Optimize database queries
- Implement graceful degradation
- Test on various devices and networks
*/
`;
      
      const ssrConfigPath = path.join(serverDir, 'advanced-ssr.config.ts');
      if (!await fs.pathExists(ssrConfigPath)) {
        await fs.writeFile(ssrConfigPath, ssrConfig);
        this.progressReporter?.info('✓ Created advanced SSR optimization configuration');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not implement advanced SSR optimizations: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Enhanced performance monitoring
   */
  private async enhancePerformanceMonitoring(projectPath: string): Promise<void> {
    try {
      const servicesDir = path.join(projectPath, 'src/app/services');
      await fs.ensureDir(servicesDir);
      
      // Create performance monitoring service
      const performanceService = `/*
 * Enhanced Performance Monitoring for Angular 19+
 * 
 * Comprehensive performance tracking and optimization
 * for modern Angular applications.
 */

import { Injectable, signal, effect } from '@angular/core';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  
  // Navigation timing
  ttfb: number; // Time to First Byte
  fcp: number;  // First Contentful Paint
  tti: number;  // Time to Interactive
  
  // Angular specific
  bootstrapTime: number;
  hydrationTime: number;
  changeDetectionTime: number;
  
  // User experience
  pageLoadTime: number;
  interactionTime: number;
  errorCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitoringService {
  private metrics = signal<Partial<PerformanceMetrics>>({});
  private observers: PerformanceObserver[] = [];
  private startTime = performance.now();
  
  constructor() {
    this.initializeMonitoring();
    this.setupMetricsTracking();
  }
  
  getMetrics() {
    return this.metrics();
  }
  
  private initializeMonitoring(): void {
    // Core Web Vitals monitoring
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    
    // Navigation timing
    this.trackNavigationTiming();
    
    // Angular specific timing
    this.trackAngularBootstrap();
    this.trackHydrationTime();
    
    // User interaction monitoring
    this.trackUserInteractions();
    
    // Error monitoring
    this.trackErrors();
  }
  
  private observeLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.updateMetric('lcp', lastEntry.startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    }
  }
  
  private observeFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.updateMetric('fid', entry.processingStart - entry.startTime);
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    }
  }
  
  private observeCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.updateMetric('cls', clsValue);
          }
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    }
  }
  
  private trackNavigationTiming(): void {
    // Wait for navigation timing to be available
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.updateMetric('ttfb', navigation.responseStart - navigation.requestStart);
        this.updateMetric('pageLoadTime', navigation.loadEventEnd - navigation.fetchStart);
      }
      
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        this.updateMetric('fcp', fcpEntry.startTime);
      }
    }, 1000);
  }
  
  private trackAngularBootstrap(): void {
    // Track Angular bootstrap time
    const bootstrapTime = performance.now() - this.startTime;
    this.updateMetric('bootstrapTime', bootstrapTime);
  }
  
  private trackHydrationTime(): void {
    // Track hydration completion
    const checkHydration = () => {
      if (document.body.hasAttribute('ng-version')) {
        const hydrationTime = performance.now() - this.startTime;
        this.updateMetric('hydrationTime', hydrationTime);
      } else {
        setTimeout(checkHydration, 50);
      }
    };
    
    checkHydration();
  }
  
  private trackUserInteractions(): void {
    let firstInteraction = true;
    
    const trackInteraction = () => {
      if (firstInteraction) {
        const interactionTime = performance.now() - this.startTime;
        this.updateMetric('interactionTime', interactionTime);
        firstInteraction = false;
      }
    };
    
    ['click', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, trackInteraction, { once: true, passive: true });
    });
  }
  
  private trackErrors(): void {
    let errorCount = 0;
    
    window.addEventListener('error', () => {
      errorCount++;
      this.updateMetric('errorCount', errorCount);
    });
    
    window.addEventListener('unhandledrejection', () => {
      errorCount++;
      this.updateMetric('errorCount', errorCount);
    });
  }
  
  private updateMetric(key: keyof PerformanceMetrics, value: number): void {
    this.metrics.update(current => ({ ...current, [key]: value }));
  }
  
  private setupMetricsTracking(): void {
    // Track metrics changes and report to analytics
    effect(() => {
      const currentMetrics = this.metrics();
      this.reportMetrics(currentMetrics);
    });
  }
  
  private reportMetrics(metrics: Partial<PerformanceMetrics>): void {
    // Report to analytics service
    console.log('Performance metrics updated:', metrics);
    
    // You can integrate with analytics services here
    // this.analytics.track('performance_metrics', metrics);
  }
  
  // Performance optimization suggestions
  getOptimizationSuggestions(): string[] {
    const metrics = this.metrics();
    const suggestions: string[] = [];
    
    if (metrics.lcp && metrics.lcp > 2500) {
      suggestions.push('Consider optimizing Largest Contentful Paint (LCP) - current: ' + Math.round(metrics.lcp) + 'ms');
    }
    
    if (metrics.fid && metrics.fid > 100) {
      suggestions.push('First Input Delay (FID) is high - consider code splitting: ' + Math.round(metrics.fid) + 'ms');
    }
    
    if (metrics.cls && metrics.cls > 0.1) {
      suggestions.push('Cumulative Layout Shift (CLS) is high - check for layout stability: ' + metrics.cls.toFixed(3));
    }
    
    if (metrics.ttfb && metrics.ttfb > 800) {
      suggestions.push('Time to First Byte (TTFB) is slow - optimize server response: ' + Math.round(metrics.ttfb) + 'ms');
    }
    
    if (metrics.hydrationTime && metrics.hydrationTime > 1000) {
      suggestions.push('Hydration time is slow - consider incremental hydration: ' + Math.round(metrics.hydrationTime) + 'ms');
    }
    
    return suggestions;
  }
  
  // Export metrics for analysis
  exportMetrics(): string {
    return JSON.stringify(this.metrics(), null, 2);
  }
  
  // Clean up observers
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Performance monitoring component
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-performance-monitor',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="performance-monitor" *ngIf="showMonitor">
      <h4>Performance Monitor</h4>
      <div class="metrics-grid">
        <div class="metric-item" *ngFor="let metric of getMetricsArray()">
          <label>{{ metric.name }}:</label>
          <span [class]="getMetricClass(metric.key, metric.value)">{{ formatMetric(metric.value, metric.unit) }}</span>
        </div>
      </div>
      
      <div class="suggestions" *ngIf="suggestions.length > 0">
        <h5>Optimization Suggestions:</h5>
        <ul>
          <li *ngFor="let suggestion of suggestions">{{ suggestion }}</li>
        </ul>
      </div>
      
      <div class="actions">
        <button (click)="exportMetrics()">Export Metrics</button>
        <button (click)="toggleMonitor()">Hide Monitor</button>
      </div>
    </div>
  \`,
  styles: [\`
    .performance-monitor {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      max-width: 400px;
      z-index: 1000;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin: 12px 0;
    }
    
    .metric-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9em;
    }
    
    .metric-good { color: #4caf50; }
    .metric-warning { color: #ff9800; }
    .metric-poor { color: #f44336; }
    
    .suggestions {
      margin: 16px 0;
      font-size: 0.85em;
    }
    
    .suggestions ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    .actions {
      display: flex;
      gap: 8px;
    }
    
    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      background: #1976d2;
      color: white;
      cursor: pointer;
      font-size: 0.8em;
    }
  \`]
})
export class PerformanceMonitorComponent implements OnInit, OnDestroy {
  showMonitor = true;
  suggestions: string[] = [];
  
  constructor(public performanceService: PerformanceMonitoringService) {}
  
  ngOnInit(): void {
    this.updateSuggestions();
    
    // Update suggestions periodically
    setInterval(() => {
      this.updateSuggestions();
    }, 5000);
  }
  
  ngOnDestroy(): void {
    this.performanceService.destroy();
  }
  
  getMetricsArray() {
    const metrics = this.performanceService.getMetrics();
    return [
      { name: 'LCP', key: 'lcp', value: metrics.lcp, unit: 'ms' },
      { name: 'FID', key: 'fid', value: metrics.fid, unit: 'ms' },
      { name: 'CLS', key: 'cls', value: metrics.cls, unit: '' },
      { name: 'TTFB', key: 'ttfb', value: metrics.ttfb, unit: 'ms' },
      { name: 'Hydration', key: 'hydrationTime', value: metrics.hydrationTime, unit: 'ms' }
    ].filter(metric => metric.value !== undefined);
  }
  
  getMetricClass(key: string, value: number | undefined): string {
    if (value === undefined) return '';
    
    const thresholds: Record<string, { good: number; poor: number }> = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 },
      hydrationTime: { good: 1000, poor: 3000 }
    };
    
    const threshold = thresholds[key];
    if (!threshold) return '';
    
    if (value <= threshold.good) return 'metric-good';
    if (value <= threshold.poor) return 'metric-warning';
    return 'metric-poor';
  }
  
  formatMetric(value: number | undefined, unit: string): string {
    if (value === undefined) return 'N/A';
    if (unit === 'ms') return Math.round(value) + unit;
    if (unit === '') return value.toFixed(3);
    return value + unit;
  }
  
  updateSuggestions(): void {
    this.suggestions = this.performanceService.getOptimizationSuggestions();
  }
  
  exportMetrics(): void {
    const metrics = this.performanceService.exportMetrics();
    const blob = new Blob([metrics], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'performance-metrics.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  toggleMonitor(): void {
    this.showMonitor = !this.showMonitor;
  }
}
`;
      
      const performancePath = path.join(servicesDir, 'performance-monitoring.service.ts');
      if (!await fs.pathExists(performancePath)) {
        await fs.writeFile(performanceService, performancePath);
        this.progressReporter?.info('✓ Created enhanced performance monitoring service');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not enhance performance monitoring: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Improved developer experience features
   */
  private async improveDeveloperExperience(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Enhanced development server configuration
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.serve) {
            // Angular 19 enhanced dev server settings
            project.architect.serve.options = {
              ...project.architect.serve.options,
              hmr: true,
              liveReload: true,
              poll: 1000,
              open: false,
              host: 'localhost',
              disableHostCheck: false,
              // Angular 19 specific enhancements
              verbose: true,
              progress: true,
              optimization: false,
              extractCss: false,
              sourceMap: true
            };
          }
          
          // Enhanced build configurations
          if (project.architect?.build) {
            if (!project.architect.build.configurations) {
              project.architect.build.configurations = {};
            }
            
            // Enhanced development configuration
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
              buildOptimizer: false,
              // Angular 19 specific dev optimizations
              preserveSymlinks: true,
              extractCss: false,
              statsJson: true
            };
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Improved developer experience configuration');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not improve developer experience: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Enhanced i18n support improvements
   */
  private async enhanceI18nSupport(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Enhanced i18n configurations for Angular 19
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect) {
            // Enhanced i18n extraction
            project.architect['extract-i18n'] = {
              builder: '@angular-devkit/build-angular:extract-i18n',
              options: {
                buildTarget: projectName + ':build',
                format: 'xlf2',
                outputPath: 'src/locale',
                progress: true,
                // Angular 19 enhancements
                includeContext: true,
                trimWhitespace: true,
                sort: true
              }
            };
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Enhanced i18n support configuration');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not enhance i18n support: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Implement advanced build optimizations
   */
  private async implementAdvancedBuildOptimizations(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.build) {
            // Angular 19 advanced build optimizations
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
              // Angular 19 specific optimizations
              preserveSymlinks: false,
              extractCss: true,
              crossOrigin: 'none',
              subresourceIntegrity: true,
              deleteOutputPath: true
            };
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Implemented advanced build optimizations');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not implement build optimizations: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Update build configurations for Angular 19
   */
  private async updateBuildConfigurations(projectPath: string): Promise<void> {
    // This is covered by implementAdvancedBuildOptimizations
    this.progressReporter?.info('✓ Build configurations updated as part of advanced optimizations');
  }

  /**
   * Validate third-party compatibility for Angular 19
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
            // Check Angular Material compatibility
            if (libName === '@angular/material' && !version.includes('19')) {
              warnings.push(`${libName}@${version} should be updated to v19 for full compatibility`);
            }
            
            // Check for zoneless compatibility
            if (this.canBenefitFromZoneless(libName)) {
              recommendations.push(`${libName} can benefit from zoneless change detection in Angular 19+`);
            }
            
            // Check for SSR optimizations
            if (this.canBenefitFromSSROptimizations(libName)) {
              recommendations.push(`${libName} can benefit from enhanced SSR optimizations in Angular 19+`);
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
   * Check if a library can benefit from zoneless change detection
   */
  private canBenefitFromZoneless(libName: string): boolean {
    const zonelessCompatibleLibraries = [
      '@angular/material',
      '@angular/cdk',
      '@ngrx/store',
      '@ngrx/signals'
    ];
    
    return zonelessCompatibleLibraries.some(lib => libName.includes(lib));
  }

  /**
   * Check if a library can benefit from SSR optimizations
   */
  private canBenefitFromSSROptimizations(libName: string): boolean {
    const ssrCompatibleLibraries = [
      '@angular/material',
      '@angular/cdk',
      'ng-bootstrap',
      'primeng'
    ];
    
    return ssrCompatibleLibraries.some(lib => libName.includes(lib));
  }

  /**
   * Migrate from webpack-dev-server to esbuild dev server (Angular 18+)
   */
  private async migrateToEsbuildDevServer(projectPath: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        
        // Remove webpack-dev-server if present
        if (packageJson.devDependencies?.['webpack-dev-server']) {
          delete packageJson.devDependencies['webpack-dev-server'];
          this.progressReporter?.info('✓ Removed webpack-dev-server (Angular 18+ uses esbuild dev server)');
        }
        
        // Remove any custom webpack configurations that might interfere
        if (packageJson.devDependencies?.['@angular-builders/custom-webpack']) {
          this.progressReporter?.warn('⚠️ Custom webpack configuration detected - may need manual review for esbuild compatibility');
        }
        
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        
        // Update angular.json to ensure esbuild dev server configuration
        await this.configureEsbuildDevServer(projectPath);
        
      } catch (error) {
        this.progressReporter?.warn(`Could not migrate dev server: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Configure esbuild dev server in angular.json
   */
  private async configureEsbuildDevServer(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Update serve configurations to use esbuild
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.serve) {
            // Ensure serve uses the correct builder for esbuild
            project.architect.serve.builder = '@angular-devkit/build-angular:dev-server';
            
            // Remove any webpack-specific configurations
            if (project.architect.serve.options) {
              delete project.architect.serve.options.customWebpackConfig;
              delete project.architect.serve.options.webpackDevServerOptions;
              
              // Configure esbuild-optimized dev server options
              project.architect.serve.options = {
                ...project.architect.serve.options,
                buildTarget: `${projectName}:build`
              };
            }
          }
          
          // Update build configuration to use esbuild (use browser-esbuild for easier migration from existing projects)
          if (project.architect?.build) {
            // Check if it's still using the old webpack browser builder
            if (project.architect.build.builder === '@angular-devkit/build-angular:browser') {
              project.architect.build.builder = '@angular-devkit/build-angular:browser-esbuild';
              this.progressReporter?.info('✓ Migrated from webpack browser builder to esbuild browser-esbuild builder');
            }
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Configured angular.json for esbuild dev server');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not configure esbuild dev server: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}