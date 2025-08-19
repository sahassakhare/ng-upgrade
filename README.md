# Angular Multi-Version Upgrade Orchestrator

[![npm version](https://badge.fury.io/js/ng-upgrade-orchestrator.svg)](https://badge.fury.io/js/ng-upgrade-orchestrator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-compodoc-blue.svg)](./docs/)
[![Angular Versions](https://img.shields.io/badge/Angular-12%20to%2020-red.svg)](https://angular.io/)

An enterprise-grade, intelligent multi-step upgrade orchestrator that safely migrates Angular applications across multiple major versions (12→13→14→...→20) by performing incremental upgrades, validating each step, handling breaking changes systematically, and ensuring **zero functionality loss** throughout the entire upgrade journey. Features **automatic npm installation**, **comprehensive dependency management**, and seamless integration of **all 9 official Angular migrations**.

## 🚀 **Key Highlights**

✅ **Production-Ready**: Robust architecture designed for enterprise-scale applications  
✅ **Zero Downtime**: Maintains functionality during upgrades  
✅ **Automatic npm Installation**: Intelligent dependency management with retry mechanisms  
✅ **Official Migrations**: Integrates all 9 Angular CLI migrations seamlessly  
✅ **Smart Rollback**: Granular checkpoint system with backup restoration  
✅ **Third-Party Support**: Handles Angular Material, NgRx, PrimeNG+  
✅ **TypeScript AST**: Precise code transformations  
✅ **99% Automation**: Minimal manual intervention required

## Features

### Core Capabilities
- **Multi-Version Orchestration**: Seamlessly upgrade through multiple Angular versions in sequence
- **Intelligent Path Planning**: Automatically determines the optimal upgrade path from current to target version
- **Zero Functionality Loss**: Prioritizes maintaining existing functionality over modernization
- **Automatic npm Installation**: Robust dependency management with retry mechanisms and fallback strategies
- **Official Angular Migrations**: Seamless integration of all 9 Angular CLI migrations from angular.dev/reference/migrations
- **Comprehensive Rollback System**: Full application snapshots at each major version milestone
- **Breaking Change Management**: Systematic handling of breaking changes with automated fixes
- **Third-Party Library Coordination**: Synchronized updates for Angular Material, NgRx, PrimeNG, and more

### Dependency Management Excellence
- **Multi-Layer Installation Strategy**: Primary npm install → Retry with --force → Individual packages → Manual fallback
- **Safe package.json Updates**: Automatic backup creation before modifications
- **Dependency Verification**: Ensures packages are actually installed before proceeding
- **Timeout Handling**: Configurable timeouts with automatic retry mechanisms
- **Comprehensive Error Recovery**: Graceful degradation when installation issues occur

### Official Angular Migrations Integration
- **Standalone Components Migration**: Automatically converts components to standalone (Angular 14+)
- **inject() Function Migration**: Converts constructor injection to inject() function (Angular 14+)
- **Control Flow Migration**: Migrates *ngIf, *ngFor, *ngSwitch to @if, @for, @switch (Angular 17+)
- **Signal Inputs Migration**: Converts @Input fields to signal inputs (Angular 17+)
- **Signal Outputs Migration**: Converts @Output events to signal outputs (Angular 17+)
- **Signal Queries Migration**: Converts ViewChild/ContentChild to signal queries (Angular 17+)
- **Route Lazy Loading Migration**: Converts eager routes to lazy-loaded routes (Angular 14+)
- **Self-closing Tags Migration**: Updates templates to use self-closing tags (Angular 16+)
- **Cleanup Unused Imports**: Removes unused imports for cleaner code (All versions)

### Advanced Features
- **Checkpoint System**: Create restoration points at each upgrade milestone
- **AST-Based Code Transformations**: Precise code modifications using TypeScript AST
- **Multi-Layer Compatibility**: Allow old and new patterns to coexist during transitions
- **Progressive Enhancement**: Opt-in modernization without breaking existing functionality
- **Comprehensive Validation**: Build, test, and runtime validation at each step

## Quick Start

### Installation

```bash
npm install -g ng-upgrade-orchestrator
```

### Basic Usage

```bash
# Analyze your project
ng-upgrade analyze

# Upgrade to Angular 17
ng-upgrade upgrade --target 17

# Show upgrade plan without executing
ng-upgrade upgrade --target 20 --dry-run

# Conservative upgrade strategy
ng-upgrade upgrade --target 16 --strategy conservative
```

### Interactive Mode

```bash
ng-upgrade upgrade
```

The CLI will guide you through:
1. Target version selection
2. Upgrade strategy configuration
3. Validation level settings
4. Confirmation and execution

## Upgrade Strategies

### Conservative Mode
- **Maximum Safety**: Minimal changes per version
- **Compatibility First**: Preserves all existing patterns
- **Manual Opt-in**: New features require explicit adoption
- **Extensive Validation**: Comprehensive testing at each step

### Balanced Mode (Default)
- **Moderate Modernization**: Strategic updates with compatibility layers
- **Smart Defaults**: Sensible choices for most applications
- **Gradual Enhancement**: Progressive adoption of new features
- **Balanced Validation**: Essential checks with optional comprehensive testing

### Progressive Mode
- **Advanced Features**: Enables cutting-edge Angular capabilities
- **Modern Patterns**: Migrates to latest best practices
- **Performance Optimized**: Leverages newest optimization features
- **Future Ready**: Prepares codebase for upcoming versions

## CLI Commands

### Upgrade Command
```bash
ng-upgrade upgrade [options]

Options:
  -t, --target <version>     Target Angular version (12-20)
  -p, --path <path>          Project path (default: current directory)
  -s, --strategy <strategy>  conservative|balanced|progressive (default: balanced)
  --dry-run                  Show upgrade plan without executing
  --no-backup                Skip automatic backup creation
  --validation <level>       basic|comprehensive (default: basic)
```

### Analysis Command
```bash
ng-upgrade analyze [options]

Options:
  -p, --path <path>         Project path (default: current directory)
```

### Checkpoint Management
```bash
ng-upgrade checkpoints [options]

Options:
  -p, --path <path>         Project path (default: current directory)
  --list                    List all checkpoints
  --rollback <id>           Rollback to specific checkpoint
  --create <description>    Create new checkpoint
  --cleanup                 Clean up old checkpoints
```

## Project Analysis

The analyzer provides comprehensive insights:

```bash
ng-upgrade analyze
```

**Sample Output:**
```
Analyzing Angular project

Analysis completed

Project Analysis Results:
Current Angular version: 12.2.0
Project type: Application
Build system: Angular CLI
Dependencies: 45 total, 3 require updates
Lines of code: 15,420
Components: 28
Services: 12
Risk level: Medium

Upgrade Recommendations:
  - Update deprecated dependencies before upgrade
  - Increase test coverage for better validation
  - Consider incremental upgrade strategy
```

## Checkpoint System

### Automatic Checkpoints
- Created before each major version upgrade
- Include complete project state and metadata
- Enable instant rollback to any point in upgrade journey

### Manual Checkpoint Management
```bash
# List all checkpoints
ng-upgrade checkpoints --list

# Create manual checkpoint
ng-upgrade checkpoints --create "Before custom modifications"

# Rollback to specific checkpoint
ng-upgrade checkpoints --rollback checkpoint-id

# Cleanup old checkpoints
ng-upgrade checkpoints --cleanup
```

## Supported Angular Versions

| Version | Status | Key Features |
|---------|--------|--------------|
| 12 → 13 | Supported | Ivy renderer finalization, View Engine removal |
| 13 → 14 | Supported | Standalone components, Angular CLI auto-completion |
| 14 → 15 | Supported | Standalone APIs stable, Image directive |
| 15 → 16 | Supported | Required inputs, router data as input |
| 16 → 17 | Supported | New application bootstrap, SSR improvements |
| 17 → 18 | Supported | Material 3 support, built-in control flow |
| 18 → 19 | Supported | Zoneless change detection, event replay |
| 19 → 20 | Supported | Incremental hydration, advanced SSR |

## Configuration

### Upgrade Options

```typescript
interface UpgradeOptions {
  targetVersion: string;
  strategy: 'conservative' | 'balanced' | 'progressive';
  checkpointFrequency: 'every-step' | 'major-versions' | 'custom';
  validationLevel: 'basic' | 'comprehensive';
  thirdPartyHandling: 'automatic' | 'manual' | 'prompt';
  rollbackPolicy: 'auto-on-failure' | 'manual' | 'never';
  parallelProcessing: boolean;
}
```

## Safety Features

### Zero Functionality Loss
- **Compatibility-First Approach**: Prioritizes maintaining existing functionality
- **API Bridging**: Creates bridge functions for deprecated APIs
- **Gradual Migration**: Allows mixed usage of old and new patterns
- **Optional Modernization**: New features are opt-in rather than forced

### Multi-Version Safety Mechanisms
- **Per-Version Validation**: Comprehensive testing after each Angular version upgrade
- **Cross-Version Compatibility**: Runtime checks for deprecated APIs across versions
- **Progressive Feature Adoption**: Teams can adopt new features gradually
- **Legacy Preservation**: Maintains legacy code patterns until appropriate for modernization

### Rollback Capabilities
- **Granular Rollback**: Rollback to any checkpoint in the upgrade sequence
- **Automatic Recovery**: Auto-rollback on failure if configured
- **State Preservation**: Maintains application state during rollbacks
- **Dependency Synchronization**: Rollback dependencies in sync with application state

## Programmatic API

```typescript
import { UpgradeOrchestrator } from 'ng-upgrade-orchestrator';

const orchestrator = new UpgradeOrchestrator('/path/to/project');

// Set up event listeners
orchestrator.on('progress', (report) => {
  console.log(`Progress: ${report.message}`);
});

orchestrator.on('step-complete', (step) => {
  console.log(`Completed: ${step.fromVersion} → ${step.toVersion}`);
});

// Execute upgrade
const result = await orchestrator.orchestrateUpgrade({
  targetVersion: '17',
  strategy: 'balanced',
  checkpointFrequency: 'major-versions',
  validationLevel: 'comprehensive',
  thirdPartyHandling: 'automatic',
  rollbackPolicy: 'auto-on-failure',
  parallelProcessing: false
});

if (result.success) {
  console.log('Upgrade completed successfully!');
} else {
  console.error('Upgrade failed:', result.error);
}
```

## Breaking Changes Handled

### Angular 12 → 13
- View Engine complete removal
- Angular Package Format changes
- Ivy renderer optimizations

### Angular 13 → 14
- Standalone components introduction
- Optional injectors in ViewChild/ContentChild
- Angular CLI improvements

### Angular 14 → 15
- Standalone APIs stabilization
- Image directive with optimization
- MDC-based Angular Material

### Angular 15 → 16
- Required inputs API
- Router data as input
- New control flow syntax introduction

### Angular 16 → 17
- New application bootstrap API
- Assets folder migration to public
- Control flow syntax stable
- SSR improvements

### Angular 17 → 18
- Material 3 design system
- New lifecycle hooks
- Enhanced build optimizations

### Angular 18 → 19
- Zoneless change detection (opt-in)
- Event replay for better UX
- Hybrid rendering capabilities

### Angular 19 → 20
- Incremental hydration stable
- Signals ecosystem maturation
- Advanced SSR features

## Best Practices

### Before Upgrade
1. **Create Backup**: Always create project backup before starting
2. **Update Dependencies**: Resolve any known dependency conflicts
3. **Run Tests**: Ensure all tests pass in current version
4. **Clean Build**: Verify project builds successfully
5. **Commit Changes**: Commit all pending changes to version control

### During Upgrade
1. **Monitor Progress**: Watch for any warnings or errors
2. **Validate Each Step**: Don't skip validation phases
3. **Review Changes**: Understand what each version brings
4. **Test Incrementally**: Test application after major milestones

### After Upgrade
1. **Run Full Test Suite**: Comprehensive testing after completion
2. **Performance Check**: Verify performance hasn't degraded
3. **Update Documentation**: Update project documentation
4. **Team Training**: Educate team on new features and patterns

## Troubleshooting

### Common Issues

**npm Installation Issues**
```bash
# Check npm and Node.js versions
npm --version
node --version

# Clear npm cache
npm cache clean --force

# Remove and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# If npm install still fails, try:
npm install --legacy-peer-deps
# or
npm install --force
```

**Build Failures**
```bash
# Check Node.js version compatibility
node --version

# Clear caches
npm run ng cache clean
rm -rf node_modules package-lock.json
npm install
```

**Dependency Conflicts**
```bash
# Analyze dependency tree
npm ls --depth=0

# Check for peer dependency warnings
npm install --dry-run

# Resolve conflicts with legacy peer deps
npm install --legacy-peer-deps
```

**Angular Migration Issues**
```bash
# If migrations fail, try running them individually:
npx ng generate @angular/core:standalone-migration --mode=convert-to-standalone
npx ng generate @angular/core:control-flow-migration
npx ng generate @angular/core:signal-inputs

# For TypeScript compilation errors:
npx tsc --noEmit
npm run build
```

**Rollback Issues**
```bash
# List available checkpoints
ng-upgrade checkpoints --list

# Validate checkpoint integrity
ng-upgrade checkpoints --validate <checkpoint-id>
```

### Getting Help

- [Generated API Documentation](./docs/api/index.html) - Interactive documentation with search
- [Documentation](./docs/README.md) - Complete documentation index
- [Issues](https://github.com/sahassakhare/ng-upgrade/issues)
- [Discussions](https://github.com/sahassakhare/ng-upgrade/discussions)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/ng-upgrade-orchestrator/ng-upgrade-orchestrator.git
cd ng-upgrade-orchestrator
npm install
npm run build
npm link
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Angular Team for the amazing framework
- Community contributors for feedback and improvements
- All the developers who helped test and refine the orchestrator

---

**Built with love for the Angular community**