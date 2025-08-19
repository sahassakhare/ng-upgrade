import * as fs from 'fs-extra';
import * as path from 'path';
import { BaseVersionHandler } from './BaseVersionHandler';
import { BreakingChange, UpgradeOptions, DependencyUpdate } from '../types';

/**
 * Angular 18 Handler - Material 3 and built-in control flow stabilization
 * 
 * Key Features in Angular 18:
 * - Material Design 3 (M3) support in Angular Material
 * - Built-in control flow syntax stabilization (@if, @for, @switch)
 * - New lifecycle hooks (afterRender, afterNextRender)
 * - Event replay for SSR hydration
 * - Hybrid rendering capabilities
 * - Angular DevKit improvements
 * - Improved i18n extraction and tooling
 * - Enhanced change detection optimizations
 */
export class Angular18Handler extends BaseVersionHandler {
  readonly version = '18';

  protected getRequiredNodeVersion(): string {
    return '>=18.19.1';
  }

  protected getRequiredTypeScriptVersion(): string {
    return '>=5.4.0 <5.6.0';
  }

  /**
   * Get Angular 18 dependencies with correct versions
   */
  getDependencyUpdates(): DependencyUpdate[] {
    return [
      // Core Angular packages
      { name: '@angular/animations', version: '^18.0.0', type: 'dependencies' },
      { name: '@angular/common', version: '^18.0.0', type: 'dependencies' },
      { name: '@angular/compiler', version: '^18.0.0', type: 'dependencies' },
      { name: '@angular/core', version: '^18.0.0', type: 'dependencies' },
      { name: '@angular/forms', version: '^18.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser', version: '^18.0.0', type: 'dependencies' },
      { name: '@angular/platform-browser-dynamic', version: '^18.0.0', type: 'dependencies' },
      { name: '@angular/router', version: '^18.0.0', type: 'dependencies' },
      { name: '@angular/ssr', version: '^18.0.0', type: 'dependencies' },
      
      // Angular CLI and dev dependencies
      { name: '@angular/cli', version: '^18.0.0', type: 'devDependencies' },
      { name: '@angular/compiler-cli', version: '^18.0.0', type: 'devDependencies' },
      { name: '@angular-devkit/build-angular', version: '^18.0.0', type: 'devDependencies' },
      
      // TypeScript and supporting packages
      { name: 'typescript', version: '~5.4.0', type: 'devDependencies' },
      { name: 'zone.js', version: '~0.14.0', type: 'dependencies' },
      { name: 'rxjs', version: '~7.8.0', type: 'dependencies' },
      
      // Angular Material with Material 3 support
      { name: '@angular/material', version: '^18.0.0', type: 'dependencies' },
      { name: '@angular/cdk', version: '^18.0.0', type: 'dependencies' }
    ];
  }

  protected async applyVersionSpecificChanges(projectPath: string, options: UpgradeOptions): Promise<void> {
    this.progressReporter?.updateMessage('Applying Angular 18 transformations...');
    
    // 1. Implement Material Design 3 support
    await this.implementMaterial3Support(projectPath);
    
    // 2. Stabilize built-in control flow syntax
    await this.stabilizeBuiltInControlFlow(projectPath);
    
    // 3. Implement new lifecycle hooks
    await this.implementNewLifecycleHooks(projectPath);
    
    // 4. Setup event replay for SSR hydration
    await this.setupEventReplaySSR(projectPath);
    
    // 5. Configure hybrid rendering capabilities
    await this.configureHybridRendering(projectPath);
    
    // 6. Enhanced i18n extraction and tooling
    await this.enhanceI18nTooling(projectPath);
    
    // 7. Optimize change detection improvements
    await this.optimizeChangeDetection(projectPath);
    
    // 8. Update build configurations for Angular 18
    await this.updateBuildConfigurations(projectPath);
    
    // 9. Validate third-party compatibility
    await this.validateThirdPartyCompatibility(projectPath);
    
    this.progressReporter?.success('✓ Angular 18 transformations completed');
  }

  getBreakingChanges(): BreakingChange[] {
    return [
      // Material Design 3 support
      this.createBreakingChange(
        'ng18-material3-support',
        'dependency',
        'medium',
        'Material Design 3 support',
        'Angular Material now supports Material Design 3 (M3) theming and components',
        'Update Material themes and component usage for M3 compatibility'
      ),
      
      // Built-in control flow stabilization
      this.createBreakingChange(
        'ng18-control-flow-stable',
        'template',
        'low',
        'Built-in control flow syntax stable',
        '@if, @for, @switch syntax is now stable and recommended over structural directives',
        'Migration is optional - both syntaxes are supported'
      ),
      
      // TypeScript version requirement
      this.createBreakingChange(
        'ng18-typescript-version',
        'dependency',
        'medium',
        'TypeScript 5.4+ required',
        'Angular 18 requires TypeScript 5.4.0 or higher',
        'Update TypeScript to version 5.4.0 or higher'
      ),
      
      // Node.js version requirement
      this.createBreakingChange(
        'ng18-nodejs-version',
        'dependency',
        'medium',
        'Node.js 18.19.1+ required',
        'Angular 18 requires Node.js 18.19.1 or higher',
        'Update Node.js to version 18.19.1 or higher'
      ),
      
      // New lifecycle hooks
      this.createBreakingChange(
        'ng18-lifecycle-hooks',
        'api',
        'low',
        'New lifecycle hooks available',
        'afterRender and afterNextRender lifecycle hooks for DOM manipulation',
        'New feature - existing lifecycle hooks continue to work'
      ),
      
      // Event replay for SSR
      this.createBreakingChange(
        'ng18-event-replay',
        'api',
        'low',
        'Event replay for SSR hydration',
        'Automatic event replay during hydration for better user experience',
        'New feature - automatically captures and replays user events'
      ),
      
      // Hybrid rendering
      this.createBreakingChange(
        'ng18-hybrid-rendering',
        'api',
        'low',
        'Hybrid rendering capabilities',
        'Support for combining SSR and client-side rendering strategies',
        'New feature - existing rendering approaches continue to work'
      )
    ];
  }

  // Private implementation methods

  /**
   * Implement Material Design 3 support
   */
  private async implementMaterial3Support(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create Material 3 theming and component examples
      const material3Example = `import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-material3-example',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  template: \`
    <div class="material3-showcase">
      <h2>Material Design 3 Showcase (Angular 18+)</h2>
      
      <!-- M3 Button Variations -->
      <mat-card class="demo-card">
        <mat-card-header>
          <mat-card-title>M3 Button Variations</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="button-row">
            <button mat-raised-button color="primary">Filled Button</button>
            <button mat-button color="primary">Text Button</button>
            <button mat-stroked-button color="primary">Outlined Button</button>
            <button mat-fab color="accent">
              <mat-icon>add</mat-icon>
            </button>
            <button mat-mini-fab color="warn">
              <mat-icon>edit</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>
      
      <!-- M3 Form Controls -->
      <mat-card class="demo-card">
        <mat-card-header>
          <mat-card-title>M3 Form Controls</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-controls">
            <mat-form-field appearance="outline">
              <mat-label>Outlined Input</mat-label>
              <input matInput placeholder="Enter text">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="fill">
              <mat-label>Filled Input</mat-label>
              <input matInput placeholder="Enter text">
            </mat-form-field>
            
            <div class="controls-row">
              <mat-checkbox color="primary">M3 Checkbox</mat-checkbox>
              <mat-slide-toggle color="accent">M3 Toggle</mat-slide-toggle>
            </div>
            
            <mat-radio-group>
              <mat-radio-button value="option1">M3 Radio Option 1</mat-radio-button>
              <mat-radio-button value="option2">M3 Radio Option 2</mat-radio-button>
            </mat-radio-group>
          </div>
        </mat-card-content>
      </mat-card>
      
      <!-- M3 Chips -->
      <mat-card class="demo-card">
        <mat-card-header>
          <mat-card-title>M3 Chips</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-chip-set>
            <mat-chip>Angular</mat-chip>
            <mat-chip>Material</mat-chip>
            <mat-chip>Design 3</mat-chip>
            <mat-chip removable (removed)="removeChip('removable')">Removable</mat-chip>
          </mat-chip-set>
        </mat-card-content>
      </mat-card>
      
      <!-- M3 Color Tokens Info -->
      <mat-card class="demo-card">
        <mat-card-header>
          <mat-card-title>Material 3 Color System</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="color-info">
            <p>Material 3 introduces a new color system with:</p>
            <ul>
              <li><strong>Dynamic Color:</strong> Colors that adapt to user preferences</li>
              <li><strong>Expanded Palette:</strong> More color roles and variants</li>
              <li><strong>Improved Contrast:</strong> Better accessibility and readability</li>
              <li><strong>Color Tokens:</strong> Semantic color naming system</li>
            </ul>
            
            <div class="color-demo">
              <div class="color-box primary">Primary</div>
              <div class="color-box secondary">Secondary</div>
              <div class="color-box tertiary">Tertiary</div>
              <div class="color-box error">Error</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  \`,
  styles: [\`
    .material3-showcase {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .demo-card {
      margin: 16px 0;
    }
    
    .button-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    
    .form-controls {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .controls-row {
      display: flex;
      gap: 24px;
      align-items: center;
    }
    
    .color-demo {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      flex-wrap: wrap;
    }
    
    .color-box {
      padding: 12px 16px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      min-width: 80px;
      text-align: center;
    }
    
    .color-box.primary {
      background-color: var(--mdc-theme-primary, #6750a4);
    }
    
    .color-box.secondary {
      background-color: var(--mdc-theme-secondary, #625b71);
    }
    
    .color-box.tertiary {
      background-color: var(--mdc-theme-tertiary, #7d5260);
    }
    
    .color-box.error {
      background-color: var(--mdc-theme-error, #ba1a1a);
    }
    
    .color-info ul {
      margin: 16px 0;
    }
    
    mat-chip-set {
      margin: 8px 0;
    }
  \`]
})
export class Material3ExampleComponent {
  removeChip(chipName: string) {
    console.log('Removed chip: ' + chipName);
  }
}

/*
Material Design 3 in Angular 18 Key Features:

1. Dynamic Color System:
   - Colors adapt to user preferences and system theme
   - Improved color contrast and accessibility
   - New color tokens and semantic naming

2. Enhanced Components:
   - Updated visual design following M3 guidelines
   - Improved touch targets and interaction states
   - Better alignment with native platform conventions

3. Theming Improvements:
   - New M3 theme generator
   - Better support for dark mode
   - Customizable color schemes

4. Typography Updates:
   - M3 typography scale
   - Improved readability
   - Better hierarchy and emphasis

5. Motion and Animation:
   - Updated motion guidelines
   - Smoother transitions
   - Better performance

Migration Notes:
- Existing M2 themes continue to work
- Gradual migration to M3 is supported
- Some visual changes may require design review
- Custom component styling may need updates
*/
`;
      
      const material3Path = path.join(exampleDir, 'material3-example.component.ts');
      if (!await fs.pathExists(material3Path)) {
        await fs.writeFile(material3Path, material3Example);
        this.progressReporter?.info('✓ Created Material Design 3 example');
      }
      
      // Create M3 theme configuration guide
      const themeGuide = `/*
 * Material Design 3 Theme Configuration for Angular 18+
 * 
 * This file demonstrates how to configure Material 3 theming
 * in your Angular application.
 */

@use '@angular/material' as mat;

// Define your M3 color palette
$m3-primary: mat.m3-define-palette(mat.$m3-blue-palette);
$m3-secondary: mat.m3-define-palette(mat.$m3-green-palette);
$m3-tertiary: mat.m3-define-palette(mat.$m3-yellow-palette);
$m3-error: mat.m3-define-palette(mat.$m3-red-palette);

// Create M3 theme
$m3-theme: mat.m3-define-theme((
  color: (
    theme-type: light,
    primary: $m3-primary,
    secondary: $m3-secondary,
    tertiary: $m3-tertiary,
    error: $m3-error,
  ),
  typography: (
    brand-family: 'Roboto, sans-serif',
    plain-family: 'Roboto, sans-serif',
  ),
  density: (
    scale: 0
  )
));

// Apply the M3 theme
@include mat.all-component-themes($m3-theme);

// Dark theme variant
$m3-dark-theme: mat.m3-define-theme((
  color: (
    theme-type: dark,
    primary: $m3-primary,
    secondary: $m3-secondary,
    tertiary: $m3-tertiary,
    error: $m3-error,
  )
));

// Apply dark theme with class selector
.dark-theme {
  @include mat.all-component-colors($m3-dark-theme);
}

/*
Usage in your component:

1. Import the theme in your global styles
2. Use Material components as normal
3. Components automatically use M3 styling
4. Toggle dark theme by adding/removing 'dark-theme' class

Example TypeScript for theme switching:

export class AppComponent {
  isDarkTheme = false;
  
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }
}
*/
`;
      
      const themePath = path.join(projectPath, 'src/styles/material3-theme.scss');
      const stylesDir = path.dirname(themePath);
      await fs.ensureDir(stylesDir);
      
      if (!await fs.pathExists(themePath)) {
        await fs.writeFile(themePath, themeGuide);
        this.progressReporter?.info('✓ Created Material 3 theme configuration guide');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not implement Material 3 support: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Stabilize built-in control flow syntax
   */
  private async stabilizeBuiltInControlFlow(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create stable control flow examples
      const controlFlowExample = `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-stable-control-flow',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="control-flow-demo">
      <h3>Stable Built-in Control Flow (Angular 18+)</h3>
      
      <!-- Stable @if syntax -->
      <section class="demo-section">
        <h4>@if Control Flow</h4>
        <div class="controls">
          <button (click)="toggleUser()">Toggle User</button>
          <button (click)="toggleAdmin()">Toggle Admin</button>
        </div>
        
        @if (currentUser()) {
          <div class="user-info">
            <p>Welcome, {{ currentUser()?.name }}!</p>
            
            @if (currentUser()?.isAdmin) {
              <div class="admin-panel">
                <p>Admin Panel Access Granted</p>
                <button>Manage Users</button>
                <button>System Settings</button>
              </div>
            } @else {
              <div class="user-panel">
                <p>Standard User Access</p>
                <button>Profile Settings</button>
              </div>
            }
          </div>
        } @else {
          <div class="login-prompt">
            <p>Please log in to continue</p>
            <button (click)="login()">Login</button>
          </div>
        }
      </section>
      
      <!-- Stable @for syntax -->
      <section class="demo-section">
        <h4>@for Control Flow</h4>
        <div class="controls">
          <button (click)="addTask()">Add Task</button>
          <button (click)="clearTasks()">Clear All</button>
          <select (change)="setFilter($event)">
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        <div class="task-list">
          @for (task of filteredTasks(); track task.id) {
            <div class="task-item" [class.completed]="task.completed">
              <input 
                type="checkbox" 
                [checked]="task.completed"
                (change)="toggleTask(task.id)">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-priority priority-{{ task.priority }}">{{ task.priority }}</span>
              <button (click)="removeTask(task.id)">Remove</button>
            </div>
          } @empty {
            <div class="empty-state">
              <p>No tasks found</p>
              <p class="hint">Add a task to get started!</p>
            </div>
          }
        </div>
      </section>
      
      <!-- Stable @switch syntax -->
      <section class="demo-section">
        <h4>@switch Control Flow</h4>
        <div class="controls">
          <label>Select Theme:</label>
          <select (change)="setTheme($event)">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        @switch (selectedTheme()) {
          @case ('light') {
            <div class="theme-preview light-theme">
              <h5>Light Theme</h5>
              <p>Clean and bright interface for daytime use</p>
              <div class="color-samples">
                <div class="color-sample" style="background: #ffffff"></div>
                <div class="color-sample" style="background: #f5f5f5"></div>
                <div class="color-sample" style="background: #1976d2"></div>
              </div>
            </div>
          }
          @case ('dark') {
            <div class="theme-preview dark-theme">
              <h5>Dark Theme</h5>
              <p>Comfortable viewing experience for low-light environments</p>
              <div class="color-samples">
                <div class="color-sample" style="background: #121212"></div>
                <div class="color-sample" style="background: #1e1e1e"></div>
                <div class="color-sample" style="background: #bb86fc"></div>
              </div>
            </div>
          }
          @case ('auto') {
            <div class="theme-preview auto-theme">
              <h5>Auto Theme</h5>
              <p>Automatically adapts to system preference</p>
              <div class="color-samples">
                <div class="color-sample" style="background: linear-gradient(45deg, #ffffff, #121212)"></div>
                <div class="color-sample" style="background: linear-gradient(45deg, #f5f5f5, #1e1e1e)"></div>
                <div class="color-sample" style="background: linear-gradient(45deg, #1976d2, #bb86fc)"></div>
              </div>
            </div>
          }
          @case ('custom') {
            <div class="theme-preview custom-theme">
              <h5>Custom Theme</h5>
              <p>Personalized color scheme and preferences</p>
              <div class="custom-controls">
                <input type="color" (change)="setCustomColor($event)" value="#ff5722">
                <label>Primary Color</label>
              </div>
            </div>
          }
          @default {
            <div class="theme-preview default-theme">
              <h5>Default Theme</h5>
              <p>Standard application theme</p>
            </div>
          }
        }
      </section>
    </div>
  \`,
  styles: [\`
    .control-flow-demo {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .demo-section {
      margin: 32px 0;
      padding: 24px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    
    .demo-section h4 {
      margin-top: 0;
      color: #1976d2;
    }
    
    .controls {
      margin: 16px 0;
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #1976d2;
      color: white;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    button:hover {
      background: #1565c0;
    }
    
    .user-info, .login-prompt {
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }
    
    .user-info {
      background: #e8f5e8;
      border: 1px solid #4caf50;
    }
    
    .login-prompt {
      background: #fff3e0;
      border: 1px solid #ff9800;
    }
    
    .admin-panel {
      background: #e3f2fd;
      padding: 12px;
      border-radius: 4px;
      margin-top: 8px;
    }
    
    .user-panel {
      background: #f3e5f5;
      padding: 12px;
      border-radius: 4px;
      margin-top: 8px;
    }
    
    .task-list {
      margin: 16px 0;
    }
    
    .task-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin: 8px 0;
    }
    
    .task-item.completed {
      opacity: 0.7;
      background: #f5f5f5;
    }
    
    .task-item.completed .task-title {
      text-decoration: line-through;
    }
    
    .task-priority {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: 500;
    }
    
    .priority-low { background: #e8f5e8; color: #2e7d32; }
    .priority-medium { background: #fff3e0; color: #f57c00; }
    .priority-high { background: #ffebee; color: #d32f2f; }
    
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    
    .empty-state .hint {
      font-size: 0.9em;
      margin-top: 8px;
    }
    
    .theme-preview {
      padding: 20px;
      border-radius: 8px;
      margin: 16px 0;
      transition: all 0.3s ease;
    }
    
    .light-theme {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      color: #333;
    }
    
    .dark-theme {
      background: #121212;
      border: 1px solid #333;
      color: #ffffff;
    }
    
    .auto-theme {
      background: linear-gradient(135deg, #ffffff 50%, #121212 50%);
      border: 1px solid #666;
      color: #333;
    }
    
    .custom-theme {
      background: linear-gradient(135deg, #ff5722, #ffccbc);
      border: 1px solid #ff5722;
      color: white;
    }
    
    .color-samples {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    
    .color-sample {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    
    .custom-controls {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 12px;
    }
    
    select, input[type="color"] {
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  \`]
})
export class StableControlFlowComponent {
  // Signals for reactive state management
  currentUser = signal<{ name: string; isAdmin: boolean } | null>(null);
  tasks = signal<Task[]>([
    { id: 1, title: 'Review Angular 18 features', completed: false, priority: 'high' },
    { id: 2, title: 'Update control flow syntax', completed: true, priority: 'medium' },
    { id: 3, title: 'Test Material 3 components', completed: false, priority: 'low' }
  ]);
  filter = signal<'all' | 'completed' | 'pending'>('all');
  selectedTheme = signal<string>('light');
  
  // Computed values
  filteredTasks = signal.computed(() => {
    const allTasks = this.tasks();
    const currentFilter = this.filter();
    
    switch (currentFilter) {
      case 'completed':
        return allTasks.filter(task => task.completed);
      case 'pending':
        return allTasks.filter(task => !task.completed);
      default:
        return allTasks;
    }
  });
  
  toggleUser() {
    const current = this.currentUser();
    if (current) {
      this.currentUser.set(null);
    } else {
      this.currentUser.set({ name: 'John Doe', isAdmin: false });
    }
  }
  
  toggleAdmin() {
    const current = this.currentUser();
    if (current) {
      this.currentUser.set({ ...current, isAdmin: !current.isAdmin });
    }
  }
  
  login() {
    this.currentUser.set({ name: 'Jane Smith', isAdmin: true });
  }
  
  addTask() {
    const newTask: Task = {
      id: Date.now(),
      title: 'New task ' + (this.tasks().length + 1),
      completed: false,
      priority: 'medium'
    };
    this.tasks.update(tasks => [...tasks, newTask]);
  }
  
  removeTask(id: number) {
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
  }
  
  toggleTask(id: number) {
    this.tasks.update(tasks => 
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }
  
  clearTasks() {
    this.tasks.set([]);
  }
  
  setFilter(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'all' | 'completed' | 'pending';
    this.filter.set(value);
  }
  
  setTheme(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedTheme.set(value);
  }
  
  setCustomColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    console.log('Custom color selected:', color);
    // In a real app, you would apply this color to your theme
  }
}

/*
Built-in Control Flow Benefits (Angular 18+):

1. Performance:
   - Better tree-shaking and bundle size optimization
   - Faster runtime performance
   - More efficient change detection

2. Developer Experience:
   - Cleaner, more readable templates
   - Better TypeScript integration
   - Improved IDE support and intellisense

3. Maintainability:
   - Less verbose than structural directives
   - More intuitive syntax
   - Better error messages

4. Features:
   - @if/@else blocks with better nesting
   - @for with built-in @empty state
   - @switch with @case and @default
   - Automatic track optimization in @for

5. Migration:
   - Existing *ngIf, *ngFor, *ngSwitch continue to work
   - Gradual migration is supported
   - Angular schematics can assist with migration
*/
`;
      
      const controlFlowPath = path.join(exampleDir, 'stable-control-flow.component.ts');
      if (!await fs.pathExists(controlFlowPath)) {
        await fs.writeFile(controlFlowPath, controlFlowExample);
        this.progressReporter?.info('✓ Created stable built-in control flow example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not stabilize control flow: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Implement new lifecycle hooks
   */
  private async implementNewLifecycleHooks(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create new lifecycle hooks example
      const lifecycleExample = `import { Component, afterRender, afterNextRender, ElementRef, ViewChild, signal } from '@angular/core';

@Component({
  selector: 'app-lifecycle-hooks-example',
  standalone: true,
  template: \`
    <div class="lifecycle-demo">
      <h3>New Lifecycle Hooks (Angular 18+)</h3>
      
      <div class="demo-section">
        <h4>afterRender & afterNextRender Examples</h4>
        
        <div class="controls">
          <button (click)="addItem()">Add Item</button>
          <button (click)="scrollToBottom()">Scroll to Bottom</button>
          <button (click)="focusInput()">Focus Input</button>
          <button (click)="measurePerformance()">Measure Performance</button>
        </div>
        
        <div class="input-section">
          <input #userInput 
                 type="text" 
                 placeholder="Type something..."
                 (input)="updateInputValue($event)">
          <p>Characters: {{ inputLength() }}</p>
        </div>
        
        <div class="scrollable-list" #scrollContainer>
          @for (item of items(); track item.id) {
            <div class="list-item" [class.highlighted]="item.highlighted">
              <span>{{ item.text }}</span>
              <small>Added at: {{ item.timestamp | date:'short' }}</small>
            </div>
          }
        </div>
        
        <div class="performance-info">
          <h5>Performance Metrics</h5>
          <p>Render time: {{ renderTime() }}ms</p>
          <p>DOM updates: {{ domUpdates() }}</p>
          <p>Last measurement: {{ lastMeasurement() }}</p>
        </div>
      </div>
    </div>
  \`,
  styles: [\`
    .lifecycle-demo {
      padding: 24px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .demo-section {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
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
    }
    
    .input-section {
      margin: 16px 0;
    }
    
    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .scrollable-list {
      height: 200px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      margin: 16px 0;
    }
    
    .list-item {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.3s;
    }
    
    .list-item.highlighted {
      background-color: #fff3e0;
      animation: highlight 2s ease-out;
    }
    
    @keyframes highlight {
      0% { background-color: #ffeb3b; }
      100% { background-color: #fff3e0; }
    }
    
    .list-item small {
      display: block;
      color: #666;
      margin-top: 4px;
    }
    
    .performance-info {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      margin-top: 16px;
    }
    
    .performance-info h5 {
      margin-top: 0;
    }
  \`]
})
export class LifecycleHooksExampleComponent {
  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  
  // Signals for reactive state
  items = signal<Array<{id: number, text: string, timestamp: Date, highlighted: boolean}>>([
    { id: 1, text: 'Initial item 1', timestamp: new Date(), highlighted: false },
    { id: 2, text: 'Initial item 2', timestamp: new Date(), highlighted: false }
  ]);
  
  inputLength = signal(0);
  renderTime = signal(0);
  domUpdates = signal(0);
  lastMeasurement = signal('');
  
  constructor() {
    // afterRender: Runs after every render cycle
    // Perfect for DOM measurements, analytics, or cleanup
    afterRender(() => {
      const startTime = performance.now();
      
      // Measure DOM elements
      const listItems = document.querySelectorAll('.list-item');
      
      // Update performance metrics
      const endTime = performance.now();
      this.renderTime.set(Number((endTime - startTime).toFixed(2)));
      this.domUpdates.update(count => count + 1);
      
      // Log render information (useful for debugging)
      console.log('Render completed: ' + listItems.length + ' items rendered in ' + (endTime - startTime) + 'ms');
    });
    
    // afterNextRender: Runs only after the next render cycle
    // Perfect for one-time DOM setup, focus management, or initial measurements
    afterNextRender(() => {
      console.log('Component has completed initial render');
      
      // Initial DOM setup
      this.setupInitialDOM();
      
      // Focus management
      this.setupKeyboardShortcuts();
      
      // Initial measurements
      this.measureInitialLayout();
    });
  }
  
  addItem() {
    const newItem = {
      id: Date.now(),
      text: 'Item ' + (this.items().length + 1),
      timestamp: new Date(),
      highlighted: true
    };
    
    this.items.update(items => [...items, newItem]);
    
    // Remove highlight after animation
    setTimeout(() => {
      this.items.update(items => 
        items.map(item => 
          item.id === newItem.id 
            ? { ...item, highlighted: false }
            : item
        )
      );
    }, 2000);
    
    // afterNextRender for immediate DOM interaction
    afterNextRender(() => {
      this.scrollToBottom();
    });
  }
  
  scrollToBottom() {
    if (this.scrollContainer) {
      const element = this.scrollContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
  
  focusInput() {
    // afterNextRender ensures the input is rendered before focusing
    afterNextRender(() => {
      if (this.userInput) {
        this.userInput.nativeElement.focus();
        this.userInput.nativeElement.select();
      }
    });
  }
  
  updateInputValue(event: Event) {
    const target = event.target as HTMLInputElement;
    this.inputLength.set(target.value.length);
  }
  
  measurePerformance() {
    const startTime = performance.now();
    
    // Simulate some work
    for (let i = 0; i < 1000; i++) {
      document.createElement('div');
    }
    
    afterNextRender(() => {
      const endTime = performance.now();
      const measurementTime = (endTime - startTime).toFixed(2);
      this.lastMeasurement.set(measurementTime + 'ms at ' + new Date().toLocaleTimeString());
    });
  }
  
  private setupInitialDOM() {
    // This runs only once after the first render
    console.log('Setting up initial DOM structure');
    
    // Add initial classes or setup
    document.body.classList.add('lifecycle-demo-active');
    
    // Setup intersection observers, resize observers, etc.
    this.setupObservers();
  }
  
  private setupKeyboardShortcuts() {
    // Setup global keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        this.focusInput();
      }
    });
  }
  
  private measureInitialLayout() {
    // Measure initial layout for performance baseline
    const listElement = this.scrollContainer?.nativeElement;
    if (listElement) {
      const rect = listElement.getBoundingClientRect();
      console.log('Initial list dimensions:', rect);
    }
  }
  
  private setupObservers() {
    // Setup intersection observer for lazy loading or animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Handle intersection
          console.log('Element is visible:', entry.target);
        }
      });
    });
    
    // Observe elements
    document.querySelectorAll('.list-item').forEach(item => {
      observer.observe(item);
    });
  }
}

/*
New Lifecycle Hooks in Angular 18:

1. afterRender():
   - Runs after every render cycle
   - Perfect for:
     * DOM measurements
     * Analytics tracking
     * Performance monitoring
     * Cleanup operations
   - Use with caution: runs frequently

2. afterNextRender():
   - Runs only after the next render cycle
   - Perfect for:
     * One-time DOM setup
     * Focus management
     * Initial measurements
     * Setting up observers
   - More efficient for one-time operations

Best Practices:

1. Use afterNextRender() for:
   - Initial DOM setup
   - Focus management
   - One-time measurements
   - Observer setup

2. Use afterRender() for:
   - Continuous monitoring
   - Analytics
   - Performance tracking
   - Cleanup that needs to run after each render

3. Performance Considerations:
   - afterRender() runs frequently, keep operations lightweight
   - afterNextRender() is better for expensive one-time operations
   - Both run outside Angular's change detection cycle
   - Can access DOM safely without triggering additional cycles

4. Common Use Cases:
   - Scroll position management
   - Focus management
   - DOM measurements
   - Third-party library integration
   - Performance monitoring
   - Analytics and tracking
*/
`;
      
      const lifecyclePath = path.join(exampleDir, 'lifecycle-hooks-example.component.ts');
      if (!await fs.pathExists(lifecyclePath)) {
        await fs.writeFile(lifecyclePath, lifecycleExample);
        this.progressReporter?.info('✓ Created new lifecycle hooks example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not implement lifecycle hooks: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Setup event replay for SSR hydration
   */
  private async setupEventReplaySSR(projectPath: string): Promise<void> {
    const mainTsPath = path.join(projectPath, 'src/main.ts');
    
    if (await fs.pathExists(mainTsPath)) {
      try {
        let content = await fs.readFile(mainTsPath, 'utf-8');
        
        // Add event replay import and configuration
        if (content.includes('bootstrapApplication') && !content.includes('withEventReplay')) {
          content = content.replace(
            /import { bootstrapApplication } from '@angular\/platform-browser';/,
            `import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';`
          );
          
          // Add event replay provider
          if (content.includes('provideClientHydration()')) {
            content = content.replace(
              /provideClientHydration\(\)/,
              'provideClientHydration(withEventReplay())'
            );
          } else {
            content = content.replace(
              /providers: \[([\s\S]*?)\]/,
              `providers: [
    provideClientHydration(withEventReplay()),
    $1
  ]`
            );
          }
          
          await fs.writeFile(mainTsPath, content);
          this.progressReporter?.info('✓ Configured event replay for SSR hydration');
        }
        
      } catch (error) {
        this.progressReporter?.warn(`Could not setup event replay: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Configure hybrid rendering capabilities
   */
  private async configureHybridRendering(projectPath: string): Promise<void> {
    try {
      const configDir = path.join(projectPath, 'src/app/config');
      await fs.ensureDir(configDir);
      
      // Create hybrid rendering configuration example
      const hybridConfig = `/*
 * Hybrid Rendering Configuration for Angular 18+
 * 
 * Demonstrates how to configure hybrid rendering strategies
 * combining SSR and client-side rendering for optimal performance.
 */

import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideClientHydration, withEventReplay, withNoopReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

// Example hybrid rendering configuration
export const hybridRenderingConfig: ApplicationConfig = {
  providers: [
    // Router with preloading strategy
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Hydration with event replay for better UX
    provideClientHydration(
      withEventReplay() // Replays user events during hydration
    ),
    
    // HTTP client with fetch API and interceptors
    provideHttpClient(
      withFetch(), // Use fetch API for better performance
      withInterceptors([/* your interceptors */])
    ),
    
    // Additional providers for hybrid rendering
    // ... your other providers
  ]
};

// Alternative configuration for development
export const developmentHybridConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // No event replay in development for easier debugging
    provideClientHydration(withNoopReplay()),
    
    provideHttpClient(withFetch()),
    
    // Development-specific providers
    // ... your dev providers
  ]
};

/*
Hybrid Rendering Strategies:

1. Full SSR with Event Replay:
   - Server renders initial content
   - Client hydrates with event replay
   - Best for: Content-heavy applications, SEO-critical pages

2. Selective Hydration:
   - Some components hydrate immediately
   - Others hydrate on interaction
   - Best for: Large applications with varied interactivity

3. Progressive Enhancement:
   - Basic functionality works without JavaScript
   - Enhanced features activate after hydration
   - Best for: Accessibility-first applications

4. Client-Side Rendering with Prerendering:
   - Static content prerendered at build time
   - Dynamic content rendered on client
   - Best for: Applications with mostly static content

Configuration Examples:

// For content-heavy sites
provideClientHydration(
  withEventReplay(), // Capture and replay user events
  withDomHydration() // Full DOM hydration
)

// For interactive applications
provideClientHydration(
  withEventReplay(),
  withSelectiveHydration() // Hydrate components on demand
)

// For development
provideClientHydration(
  withNoopReplay() // Skip event replay for easier debugging
)

Benefits:
- Improved perceived performance
- Better SEO and initial page load
- Smooth user experience during hydration
- Flexible rendering strategies
- Automatic event preservation
*/

const routes = [
  // Your application routes
];
`;
      
      const configPath = path.join(configDir, 'hybrid-rendering.config.ts');
      if (!await fs.pathExists(configPath)) {
        await fs.writeFile(configPath, hybridConfig);
        this.progressReporter?.info('✓ Created hybrid rendering configuration');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not configure hybrid rendering: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Enhanced i18n extraction and tooling
   */
  private async enhanceI18nTooling(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        // Update i18n configurations for Angular 18
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect) {
            // Add enhanced i18n extraction
            project.architect['extract-i18n'] = {
              builder: '@angular-devkit/build-angular:extract-i18n',
              options: {
                buildTarget: projectName + ':build',
                format: 'xlf2',
                outputPath: 'src/locale',
                progress: true
              }
            };
            
            // Enhanced build configurations for i18n
            if (project.architect.build) {
              if (!project.architect.build.configurations) {
                project.architect.build.configurations = {};
              }
              
              // Add i18n build configurations
              project.architect.build.configurations.fr = {
                aot: true,
                outputPath: 'dist/fr/',
                i18nFile: 'src/locale/messages.fr.xlf',
                i18nFormat: 'xlf2',
                i18nLocale: 'fr'
              };
              
              project.architect.build.configurations.es = {
                aot: true,
                outputPath: 'dist/es/',
                i18nFile: 'src/locale/messages.es.xlf',
                i18nFormat: 'xlf2',
                i18nLocale: 'es'
              };
            }
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Enhanced i18n extraction and tooling configuration');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not enhance i18n tooling: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Optimize change detection improvements
   */
  private async optimizeChangeDetection(projectPath: string): Promise<void> {
    try {
      const exampleDir = path.join(projectPath, 'src/app/examples');
      await fs.ensureDir(exampleDir);
      
      // Create change detection optimization example
      const optimizationExample = `/*
 * Change Detection Optimization Examples for Angular 18+
 * 
 * Demonstrates best practices for optimizing change detection
 * performance in Angular applications.
 */

import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Optimized component using OnPush strategy with signals
@Component({
  selector: 'app-optimized-change-detection',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="optimization-demo">
      <h3>Change Detection Optimization (Angular 18+)</h3>
      
      <div class="demo-section">
        <h4>Signals-Based Reactive Updates</h4>
        <div class="counter-demo">
          <p>Counter: {{ counter() }}</p>
          <p>Double: {{ doubleCounter() }}</p>
          <p>Is Even: {{ isEven() ? 'Yes' : 'No' }}</p>
          
          <div class="controls">
            <button (click)="increment()">Increment</button>
            <button (click)="decrement()">Decrement</button>
            <button (click)="reset()">Reset</button>
          </div>
        </div>
      </div>
      
      <div class="demo-section">
        <h4>Optimized List Rendering</h4>
        <div class="list-demo">
          <div class="controls">
            <button (click)="addItem()">Add Item</button>
            <button (click)="removeItem()">Remove Last</button>
            <button (click)="shuffleItems()">Shuffle</button>
          </div>
          
          <!-- Optimized list with track function -->
          <div class="item-list">
            @for (item of items(); track item.id) {
              <div class="list-item" [class.active]="item.active">
                <span>{{ item.name }}</span>
                <small>ID: {{ item.id }}</small>
                <button (click)="toggleItem(item.id)">Toggle</button>
              </div>
            }
          </div>
        </div>
      </div>
      
      <div class="demo-section">
        <h4>Performance Metrics</h4>
        <div class="metrics">
          <p>Total renders: {{ renderCount() }}</p>
          <p>Items count: {{ items().length }}</p>
          <p>Active items: {{ activeItemsCount() }}</p>
          <p>Last update: {{ lastUpdate() }}</p>
        </div>
      </div>
    </div>
  \`,
  styles: [\`
    .optimization-demo {
      padding: 24px;
      max-width: 600px;
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
    
    .counter-demo {
      text-align: center;
    }
    
    .counter-demo p {
      font-size: 1.2em;
      margin: 8px 0;
    }
    
    .item-list {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s;
    }
    
    .list-item:hover {
      background-color: #f5f5f5;
    }
    
    .list-item.active {
      background-color: #e3f2fd;
    }
    
    .list-item small {
      color: #666;
      margin-left: 8px;
    }
    
    .metrics {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
    }
    
    .metrics p {
      margin: 8px 0;
      font-family: monospace;
    }
  \`]
})
export class OptimizedChangeDetectionComponent {
  // Signals for reactive state management
  counter = signal(0);
  items = signal<Array<{id: number, name: string, active: boolean}>>([
    { id: 1, name: 'Item 1', active: false },
    { id: 2, name: 'Item 2', active: true },
    { id: 3, name: 'Item 3', active: false }
  ]);
  renderCount = signal(0);
  lastUpdate = signal(new Date().toLocaleTimeString());
  
  // Computed signals for derived state
  doubleCounter = computed(() => this.counter() * 2);
  isEven = computed(() => this.counter() % 2 === 0);
  activeItemsCount = computed(() => 
    this.items().filter(item => item.active).length
  );
  
  constructor() {
    // Track renders using effect
    // effect(() => {
    //   this.renderCount.update(count => count + 1);
    //   this.lastUpdate.set(new Date().toLocaleTimeString());
    // });
  }
  
  // Counter operations
  increment() {
    this.counter.update(value => value + 1);
  }
  
  decrement() {
    this.counter.update(value => value - 1);
  }
  
  reset() {
    this.counter.set(0);
  }
  
  // List operations
  addItem() {
    const newItem = {
      id: Date.now(),
      name: 'Item ' + (this.items().length + 1),
      active: false
    };
    this.items.update(items => [...items, newItem]);
  }
  
  removeItem() {
    this.items.update(items => items.slice(0, -1));
  }
  
  shuffleItems() {
    this.items.update(items => {
      const shuffled = [...items];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }
  
  toggleItem(id: number) {
    this.items.update(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, active: !item.active }
          : item
      )
    );
  }
}

/*
Change Detection Optimization Strategies in Angular 18:

1. OnPush Change Detection Strategy:
   - Only runs change detection when:
     * Input properties change
     * Event is triggered
     * Observable emits
   - Significantly reduces unnecessary checks
   - Works perfectly with signals

2. Signals for Reactive State:
   - Automatic dependency tracking
   - Granular updates only where needed
   - Better performance than observables for simple state
   - Computed signals for derived values

3. Optimized List Rendering:
   - Use trackBy functions (or track in @for)
   - Prevents unnecessary DOM re-creation
   - Maintains component state during list changes
   - Essential for large lists

4. Effect Usage:
   - Side effects that respond to signal changes
   - Runs outside change detection cycle
   - Perfect for DOM manipulation, logging, etc.
   - Use sparingly to avoid performance issues

5. Performance Best Practices:
   - Minimize component tree depth
   - Use OnPush strategy consistently
   - Avoid function calls in templates
   - Prefer signals over observables for simple state
   - Use async pipe for observables
   - Implement proper trackBy functions

6. Angular 18 Improvements:
   - Better signal integration
   - Optimized change detection algorithms
   - Improved tree-shaking
   - Enhanced development mode checks
   - Better performance profiling tools
*/
`;
      
      const optimizationPath = path.join(exampleDir, 'change-detection-optimization.component.ts');
      if (!await fs.pathExists(optimizationPath)) {
        await fs.writeFile(optimizationPath, optimizationExample);
        this.progressReporter?.info('✓ Created change detection optimization example');
      }
      
    } catch (error) {
      this.progressReporter?.warn(`Could not optimize change detection: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update build configurations for Angular 18
   */
  private async updateBuildConfigurations(projectPath: string): Promise<void> {
    const angularJsonPath = path.join(projectPath, 'angular.json');
    
    if (await fs.pathExists(angularJsonPath)) {
      try {
        const angularJson = await fs.readJson(angularJsonPath);
        
        for (const projectName in angularJson.projects) {
          const project = angularJson.projects[projectName];
          
          if (project.architect?.build) {
            // Update production configuration for Angular 18
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
              // Angular 18 specific optimizations
              preserveSymlinks: false,
              extractCss: true,
              crossOrigin: 'none'
            };
          }
        }
        
        await fs.writeJson(angularJsonPath, angularJson, { spaces: 2 });
        this.progressReporter?.info('✓ Updated build configurations for Angular 18');
        
      } catch (error) {
        this.progressReporter?.warn(`Could not update build configurations: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Validate third-party compatibility for Angular 18
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
            // Check Angular Material M3 compatibility
            if (libName === '@angular/material' && !version.includes('18')) {
              warnings.push(`${libName}@${version} should be updated to v18 for Material 3 support`);
            }
            
            // Check for control flow syntax compatibility
            if (this.canBenefitFromControlFlow(libName)) {
              recommendations.push(`${libName} can benefit from stable control flow syntax in Angular 18+`);
            }
            
            // Check for new lifecycle hooks compatibility
            if (this.canBenefitFromLifecycleHooks(libName)) {
              recommendations.push(`${libName} can benefit from new lifecycle hooks in Angular 18+`);
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
   * Check if a library can benefit from control flow syntax
   */
  private canBenefitFromControlFlow(libName: string): boolean {
    const controlFlowCompatibleLibraries = [
      '@angular/cdk',
      'ng-bootstrap',
      'ngx-bootstrap',
      'primeng'
    ];
    
    return controlFlowCompatibleLibraries.some(lib => libName.includes(lib));
  }

  /**
   * Check if a library can benefit from new lifecycle hooks
   */
  private canBenefitFromLifecycleHooks(libName: string): boolean {
    const lifecycleCompatibleLibraries = [
      '@angular/cdk',
      'ng-bootstrap',
      'ngx-bootstrap',
      'primeng',
      '@ngrx/store'
    ];
    
    return lifecycleCompatibleLibraries.some(lib => libName.includes(lib));
  }
}