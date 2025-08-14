- **Multi-Version Dependency Planning**: Plan dependency updates across multiple Angular versions
- **Incremental Package Updates**: Update packages incrementally to maintain compatibility at each step
- **Version Constraint Management**: Handle complex version constraints across the upgrade path
- **Lock File Synchronization**: Maintain package-lock.json consistency throughout the upgrade process
- **Dependency Tree Validation**: Validate dependency trees at each upgrade checkpoint
- **Package Compatibility Verification**: Verify package compatibility before proceeding to next version# Angular Multi-Version Upgrade Orchestrator Development Prompt

## Overview  
Create an intelligent multi-step upgrade orchestrator that safely migrates Angular applications across multiple major versions (12→13→14→...→20) by performing incremental upgrades, validating each step, handling breaking changes systematically, and ensuring zero functionality loss throughout the entire upgrade journey.

## Core Requirements

### 1. Intelligent Multi-Step Orchestration
- **Upgrade Path Planning**: Automatically determine the optimal upgrade path from current version to target version
- **Version Sequence Validation**: Ensure each major version step is supported and safe
- **Prerequisite Checking**: Validate Node.js, TypeScript, and dependency compatibility before each step
- **Checkpoint System**: Create restoration points at each major version milestone
- **Progress Tracking**: Provide detailed progress reporting across the entire upgrade journey

### 2. Prerequisite Validation System
- **Node.js Compatibility**: Check and validate Node.js version requirements for each Angular version
- **TypeScript Compatibility**: Verify TypeScript version compatibility and upgrade path
- **Dependency Analysis**: Analyze all package.json dependencies for version compatibility
- **Third-party Library Validation**: Check compatibility of Angular Material, NgRx, PrimeNG, and other libraries
- **Build Tool Compatibility**: Validate webpack, build tools, and CLI version requirements
- **Environment Validation**: Check development environment setup and requirements

### 3. Incremental Migration Engine
- **Step-by-Step Execution**: Perform one major version upgrade at a time (e.g., 12→13, then 13→14)
- **Version-Specific Migrations**: Apply breaking change fixes specific to each Angular version
- **Validation Gates**: Test application functionality after each major version upgrade
- **Automatic Rollback**: Rollback to previous checkpoint if any step fails
- **Dependency Synchronization**: Update third-party libraries in sync with Angular version upgrades
- **Code Transformation Pipeline**: Apply version-specific code transformations incrementally

### 4. Breaking Change Management
- **Breaking Change Database**: Maintain comprehensive database of breaking changes per Angular version
- **Systematic Change Application**: Apply breaking change fixes in the correct order and dependency sequence
- **Impact Analysis**: Assess the impact of each breaking change on the specific codebase
- **Custom Fix Generation**: Generate application-specific fixes for complex breaking changes
- **Deprecation Handling**: Manage deprecated APIs with proper migration timelines
- **API Bridge Creation**: Create temporary compatibility layers during transition periods

### 5. Third-Party Library Orchestration
- **Library Compatibility Mapping**: Maintain compatibility matrix for popular Angular libraries across versions
- **Synchronized Updates**: Update third-party libraries in coordination with Angular version upgrades
- **Dependency Conflict Resolution**: Resolve peer dependency conflicts and version mismatches
- **Library Migration Path**: Provide migration paths for libraries that require major version changes
- **Custom Library Handling**: Handle internal/custom libraries and their compatibility requirements
- **Fallback Library Suggestions**: Suggest alternative libraries when current ones become incompatible

### 6. Advanced Code Transformation
- **AST-Based Analysis**: Use TypeScript AST for accurate code parsing and transformation
- **Version-Specific Transformations**: Apply transformations specific to each Angular version upgrade
- **Structural Directive Migration**: Gradually migrate *ngIf, *ngFor to @if, @for across versions
- **API Migration Scheduling**: Schedule API migrations based on deprecation timelines
- **Template Transformation**: Update templates incrementally to maintain compatibility
- **Import Path Management**: Handle import path changes across different Angular versions

### 7. Comprehensive Rollback System
- **Checkpoint Creation**: Create full application snapshots at each major version milestone
- **Granular Rollback**: Rollback to any previous checkpoint in the upgrade journey
- **Partial Rollback**: Rollback specific changes while preserving others
- **State Preservation**: Maintain application state and configuration during rollbacks
- **Dependency Rollback**: Rollback dependency versions in sync with application rollback
- **Automated Recovery**: Automatically recover from failed upgrade attempts
### 8. Progressive Dependency Management

### 3. Safe Code Migration Features
- **Compatibility-First Approach**: Prioritize maintaining existing functionality over modernization
- **Optional Modernization**: Mark new features as opt-in rather than automatic migration
- **API Bridging**: Create bridge functions for deprecated APIs to maintain backward compatibility
- **Gradual Component Updates**: Allow mixed usage of old and new component patterns
- **Service Compatibility**: Maintain existing service patterns while enabling new injection methods
- **Router Backward Compatibility**: Preserve existing routing while enabling new features
- **Form Migration Safety**: Ensure existing forms continue working during typed forms migration
- **HTTP Client Compatibility**: Maintain existing interceptor patterns during functional migration
- **Change Detection Coexistence**: Allow Zone.js and zoneless patterns to coexist during transition
- **Hydration Opt-in**: Make SSR hydration improvements opt-in to avoid breaking existing SSR
- **Event Replay Safety**: Implement event replay without affecting existing event handling
- **Control Flow Coexistence**: Allow *ngIf, *ngFor to work alongside new @if, @for syntax
- **Signal Integration**: Enable signal adoption without breaking existing reactive patterns

### 10. Safe Template and Styling Updates
- **Template Compatibility**: Maintain existing template syntax while enabling new control flow
- **Signal Coexistence**: Allow traditional data binding and signals to work together
- **Angular Material Safety**: Ensure Material component upgrades don't break existing UI
- **CSS Preservation**: Preserve existing styles while adding modern CSS features
- **Accessibility Enhancement**: Add accessibility improvements without changing existing behavior
- **Hydration Safety**: Implement hydration optimizations without breaking non-SSR applications
- **Event Handling Preservation**: Maintain existing event handling patterns during upgrades
- **Asset Reference Safety**: Ensure asset migration maintains all existing asset functionality

### 11. Safe Configuration Updates
- **Angular.json**: Update build configurations, architect targets, and build options
- **Assets Migration**: Migrate from `src/assets` to `public` folder structure (Angular 17+)
- **TypeScript Config**: Update tsconfig.json for latest TypeScript features and Angular requirements
- **ESLint/TSLint**: Migrate from TSLint to ESLint with Angular-specific rules
- **Build Optimization**: Update build configurations for modern bundling and optimization
- **Static Asset References**: Update asset references in components, styles, and index.html

## Safe Multi-Version Migration Strategy

### Multi-Version Backward Compatibility Preservation
- **Cross-Version Pattern Support**: Allow both old and new patterns to coexist during multi-step transitions
- **Progressive Deprecation Management**: Handle deprecation warnings across multiple Angular versions
- **Version-Aware Feature Flags**: Use feature flags to control modernizations at each version step
- **Multi-Layer API Compatibility**: Create compatibility layers that work across version boundaries
- **Incremental Polyfill Integration**: Add necessary polyfills at appropriate version steps

### Multi-Step Progressive Enhancement Approach
- **Version-Gated Modernization**: Make advanced features opt-in at appropriate Angular versions
- **Incremental Component Migration**: Allow migration of components across multiple version steps
- **Cross-Version Service Compatibility**: Maintain service interfaces while adding capabilities incrementally
- **Multi-Version Route Updates**: Enable new routing features without breaking existing routes across versions
- **Progressive Form Enhancement**: Add new form features incrementally across Angular versions

### Multi-Version Safety Mechanisms
- **Per-Version Validation**: Validate application works correctly after each Angular version upgrade
- **Incremental Testing Strategy**: Test each migration step across the version sequence
- **Cross-Version Compatibility Checks**: Include runtime checks for deprecated APIs across versions
- **Staged Feature Adoption**: Enable teams to adopt new features gradually across version boundaries
- **Version-Aware Legacy Preservation**: Preserve legacy code patterns until appropriate version for modernization

### Multi-Version Migration Modes
- **Ultra-Conservative Mode**: Minimal changes per version, maximum compatibility preservation across all steps
- **Balanced Multi-Step Mode**: Moderate modernization with strong backward compatibility at each version
- **Progressive Multi-Version Mode**: Advanced features with compatibility layers across version boundaries
- **Custom Path Mode**: User-defined migration scope and compatibility requirements for each version step

## Technical Specifications

### Multi-Version Upgrade Architecture
- **Upgrade Path Engine**: Intelligent system to determine optimal upgrade sequence
- **Version-Specific Handlers**: Dedicated handlers for each Angular version's requirements
- **Checkpoint Management**: System for creating, managing, and restoring upgrade checkpoints
- **Validation Framework**: Comprehensive testing and validation at each upgrade step
- **Rollback Engine**: Sophisticated rollback system with granular control
- **Progress Orchestration**: Coordinate complex multi-step upgrade processes

### Input Requirements
- **Source Directory**: Path to Angular application root
- **Current Version**: Automatically detect current Angular version
- **Target Version**: Desired final Angular version (validates upgrade path feasibility)
- **Upgrade Strategy**: Conservative (maximum safety) vs Progressive (faster adoption)
- **Checkpoint Frequency**: How often to create restoration points
- **Validation Level**: Comprehensive testing vs basic functionality checks
- **Third-party Handling**: Automatic vs manual third-party library updates
- **Rollback Policy**: Automatic rollback on failure vs manual intervention
- **Parallel Processing**: Enable concurrent processing where safe

### Output Deliverables
- **Multi-Version Migration Report**: Comprehensive report covering entire upgrade journey
- **Version-by-Version Changelog**: Detailed changes made at each Angular version step
- **Breaking Changes Summary**: Complete list of breaking changes handled across all versions
- **Third-party Library Report**: Status and changes for all third-party dependencies
- **Performance Impact Analysis**: Performance comparison before, during, and after upgrade
- **Rollback Documentation**: Instructions for rolling back to any checkpoint
- **Upgraded Codebase**: Fully migrated Angular application at target version
- **Upgrade Playbook**: Custom playbook for future similar upgrades

### Multi-Version Code Analysis Capabilities
- **Cross-Version Compatibility Analysis**: Analyze code compatibility across multiple Angular versions
- **Breaking Change Impact Assessment**: Assess cumulative impact of breaking changes across versions
- **Dependency Graph Evolution**: Track how dependency graphs change across Angular versions
- **Migration Complexity Scoring**: Score the complexity of migration between specific versions
- **Risk Assessment**: Identify high-risk areas that require careful handling during upgrades
- **Upgrade Path Optimization**: Optimize the upgrade path based on codebase analysis

### Intelligent Orchestration Features
- **Version-Aware Transformations**: Apply different transformation strategies based on source and target versions
- **Incremental Configuration Updates**: Update configurations gradually to maintain compatibility
- **Progressive Code Modernization**: Modernize code incrementally without breaking functionality
- **Smart Rollback Points**: Intelligently determine optimal rollback checkpoint locations
- **Dependency Synchronization**: Keep all dependencies synchronized throughout the upgrade process
- **Validation Scheduling**: Schedule comprehensive validation at optimal points in the upgrade journey

## Implementation Guidelines

### Multi-Version Architecture Requirements
- **Version Handler Registry**: Extensible system for registering version-specific upgrade handlers
- **Checkpoint Management System**: Robust system for creating, storing, and restoring application checkpoints
- **Upgrade Path Calculator**: Algorithm to determine optimal upgrade sequences
- **Validation Framework**: Comprehensive testing framework that works across Angular versions
- **Rollback Engine**: Sophisticated rollback system with granular restoration capabilities
- **Progress Orchestrator**: System to coordinate complex multi-step processes with dependencies

### Advanced Error Handling
- **Multi-Level Error Recovery**: Handle errors at individual transformation, version step, and overall upgrade levels
- **Intelligent Error Diagnosis**: Analyze errors to determine if they're resolvable automatically
- **Contextual Error Reporting**: Provide detailed context about where in the upgrade process errors occur
- **Automated Error Resolution**: Attempt automatic resolution of common upgrade issues
- **Manual Intervention Protocols**: Clear protocols for when manual intervention is required
- **Error Pattern Learning**: Learn from error patterns to improve future upgrade success

### Performance and Scalability
- **Incremental Processing**: Process upgrades in manageable chunks to handle large applications
- **Memory Management**: Optimize memory usage across long-running multi-version upgrades
- **Parallel Processing**: Utilize parallel processing where safe during upgrade steps
- **Progress Persistence**: Persist progress to handle interruptions and resumption
- **Resource Monitoring**: Monitor system resources during intensive upgrade operations
- **Scalable Checkpoint Storage**: Efficiently store and manage multiple upgrade checkpoints

## Multi-Version Upgrade Scenarios

### Comprehensive Version Coverage
- **Angular 12→13**: Ivy renderer finalization, Angular Package Format changes
- **Angular 13→14**: Standalone components introduction, Angular CLI auto-completion
- **Angular 14→15**: Standalone APIs stabilization, MDC-based Angular Material
- **Angular 15→16**: Required inputs, router data as input, new control flow syntax
- **Angular 16→17**: New application bootstrap, SSR improvements, new control flow stable
- **Angular 17→18**: Material 3 support, new lifecycle hooks, built-in control flow
- **Angular 18→19**: Zoneless change detection, event replay, hybrid rendering capabilities
- **Angular 19→20**: Incremental hydration, signals stabilization, advanced SSR features

### Version-Specific Breaking Change Management
- **Node.js Version Requirements**: Handle Node.js version upgrades required by different Angular versions
- **TypeScript Compatibility**: Manage TypeScript version compatibility across Angular versions
- **Package Structure Changes**: Handle changes in Angular package organization across versions
- **API Deprecation Cycles**: Manage deprecated APIs across their complete lifecycle
- **Build System Evolution**: Handle webpack, build tools, and CLI changes across versions
- **Third-party Library Compatibility**: Manage library compatibility matrices across Angular versions

### Safe Multi-Version Legacy Pattern Enhancement
- **Gradual Module-Standalone Transition**: Allow NgModules and standalone components to coexist across version upgrades
- **Progressive ViewChild/ContentChild Updates**: Update decorators incrementally while maintaining existing functionality
- **Multi-Step Form Enhancement**: Add typed forms capabilities while preserving existing forms across versions
- **HTTP Interceptor Evolution**: Support both class-based and functional interceptors during version transitions
- **Guard Migration Path**: Allow both class-based and functional guards simultaneously across versions
- **Zoneless Gradual Introduction**: Enable zoneless detection opt-in without breaking Zone.js usage (Angular 18+)
- **Structural Directive Coexistence**: Maintain *ngIf, *ngFor while enabling new control flow across versions
- **Observable-Signal Progressive Integration**: Allow observables and signals to work together during transitions
- **SSR Incremental Enhancement**: Add hydration improvements without breaking existing SSR across versions
- **Event Handling Preservation**: Preserve existing event patterns during replay implementation
- **Asset Reference Multi-Path Support**: Support both asset folder structures simultaneously across versions
- **Build Configuration Evolution**: Add new build features while maintaining existing configurations

### Safe Multi-Version API Enhancement (Not Replacement)
- **Router Evolution**: Add new router features while maintaining existing router APIs across versions
- **Forms Progressive Enhancement**: Enhance form capabilities while preserving existing validators and controls
- **HTTP Client Incremental Updates**: Add new HTTP client features while maintaining existing methods
- **Testing Framework Evolution**: Enhance testing utilities while preserving existing test patterns
- **Animations Gradual Enhancement**: Add new animation features while maintaining existing animation APIs
- **Change Detection Progressive Migration**: Enable zoneless detection as opt-in while preserving Zone.js
- **Renderer API Evolution**: Add new renderer capabilities while maintaining existing renderer methods
- **Lifecycle Hooks Enhancement**: Enhance lifecycle hooks while preserving existing hook patterns
- **DI Pattern Coexistence**: Enable inject() function while maintaining constructor injection
- **Template Reference Evolution**: Add new template features while preserving existing reference patterns

### Multi-Version Testing and Validation

### Comprehensive Testing Strategy
- **Per-Version Validation**: Run full test suite after each major version upgrade
- **Regression Testing**: Ensure no functionality is lost during version transitions
- **Integration Testing**: Validate third-party library integrations at each version
- **Performance Benchmarking**: Compare performance metrics across version upgrades
- **Cross-Browser Testing**: Validate browser compatibility after each upgrade step
- **Build Verification**: Ensure application builds successfully at each version milestone

### Advanced Quality Assurance
- **Incremental Quality Metrics**: Track code quality improvements across version upgrades
- **Bundle Size Monitoring**: Monitor bundle size changes throughout the upgrade process
- **Runtime Performance Validation**: Ensure runtime performance remains stable or improves
- **Accessibility Compliance**: Verify accessibility compliance is maintained across upgrades
- **Security Scanning**: Perform security scans after each major version upgrade
- **Dependency Vulnerability Assessment**: Check for security vulnerabilities in updated dependencies

## User Interface Requirements

### Multi-Version Progress Interface
- **Upgrade Journey Visualization**: Visual representation of the entire upgrade path
- **Real-time Progress Tracking**: Show progress through each version upgrade step
- **Checkpoint Status Display**: Visual indicators of checkpoint creation and validation
- **Interactive Rollback Interface**: Easy-to-use interface for rolling back to any checkpoint
- **Detailed Step Information**: Expandable details for each upgrade step and its changes
- **Error Resolution Guidance**: Interactive guidance for resolving upgrade issues

### Advanced Configuration Options
- **Upgrade Path Customization**: Allow users to customize the upgrade sequence
- **Checkpoint Configuration**: Configure checkpoint frequency and validation depth
- **Third-party Library Handling**: Choose automatic vs manual library update strategies
- **Breaking Change Tolerance**: Configure how aggressively to handle breaking changes
- **Rollback Policies**: Set automatic rollback triggers and manual intervention points
- **Validation Depth Settings**: Configure testing and validation thoroughness at each step

## Documentation and Reporting

### Comprehensive Upgrade Documentation
- **Multi-Version Journey Report**: Complete documentation of the entire upgrade process
- **Version-by-Version Analysis**: Detailed analysis of changes made at each Angular version
- **Breaking Changes Impact Report**: Assessment of how breaking changes affected the application
- **Third-party Library Migration Report**: Status and changes for all external dependencies
- **Performance Evolution Report**: Performance metrics tracked across the entire upgrade journey
- **Rollback Procedures**: Detailed procedures for rolling back to any point in the upgrade
- **Future Upgrade Recommendations**: Recommendations for maintaining upgrade readiness

### Advanced User Documentation
- **Upgrade Path Planning Guide**: How to plan and prepare for multi-version upgrades
- **Checkpoint Management Manual**: Best practices for managing upgrade checkpoints
- **Troubleshooting Playbook**: Solutions for common multi-version upgrade issues
- **Custom Configuration Guide**: How to customize the upgrade process for specific needs
- **Enterprise Deployment Guide**: Special considerations for large-scale enterprise upgrades

## Safe Asset Folder Migration (Angular 17+)

### Backward Compatible Asset Migration
- **Dual Path Support**: Support both `src/assets/` and `public/` paths during transition
- **Legacy Path Preservation**: Keep existing asset references working while adding new structure
- **Migration Strategy**: Create public folder while maintaining assets folder compatibility
- **Reference Compatibility**: Ensure both old and new asset reference patterns work

### Safe Automated Asset Migration
- **Non-breaking File Movement**: Copy files to `public/` while preserving `src/assets/`
- **Angular.json Enhancement**: Add public assets while maintaining legacy asset configuration
- **Template Compatibility**: Support both asset path patterns in templates
- **CSS/SCSS Safety**: Maintain existing stylesheet asset references during transition
- **TypeScript Compatibility**: Preserve existing asset imports while enabling new patterns
- **Index.html Safety**: Add new asset references without removing legacy ones
- **Testing Configuration**: Maintain test compatibility with both asset structures

### Safe Path Reference Updates
- **Template Assets**: Support both `src="assets/image.png"` and `src="image.png"`
- **CSS Background**: Allow both `url('assets/bg.jpg')` and `url('bg.jpg')`  
- **Angular.json**: Maintain both asset configurations for maximum compatibility
- **Component Assets**: Preserve existing programmatic asset references
- **Environment Files**: Add new asset path constants while keeping legacy ones

### Build System Compatibility
- **Development Server**: Serve assets from both locations during transition
- **Production Builds**: Include assets from both folder structures
- **Hot Reload**: Maintain hot reload for both asset locations
- **Asset Optimization**: Apply optimization to both asset structures
- **Cache Busting**: Support cache busting for both old and new asset patterns

### Safe Validation and Testing
- **Compatibility Verification**: Ensure both asset path patterns work correctly
- **Build Verification**: Verify all assets are accessible through both paths
- **Runtime Testing**: Test asset loading from both locations
- **Path Consistency**: Validate that asset migration doesn't break existing functionality

## Angular 19-20 Specific Multi-Version Migration Features

### Safe Zoneless Change Detection Migration (Angular 19+)
- **Gradual Zone.js Removal**: Remove Zone.js dependencies incrementally across version upgrades
- **Progressive Signal Migration**: Convert component properties to signals during appropriate version steps
- **OnPush Strategy Evolution**: Update change detection strategies for zoneless compatibility at optimal timing
- **Manual Change Detection Integration**: Implement manual change detection triggers where needed during transitions
- **Third-party Compatibility Validation**: Update third-party libraries for zoneless compatibility across versions

### Incremental Hydration Implementation (Angular 19-20)
- **Progressive Hydration Boundaries**: Identify and configure incremental hydration boundaries during version upgrades
- **Defer Block Implementation**: Implement @defer blocks for lazy hydration during appropriate Angular versions
- **Critical Path Optimization**: Prioritize above-the-fold content for immediate hydration across version transitions
- **Multi-Version Hydration Strategies**: Configure different hydration strategies per component across upgrades
- **Performance Monitoring Integration**: Add hydration performance tracking during version migrations

### Event Replay System Integration
- **Event Capture Implementation**: Set up event capture during server-side rendering across version upgrades
- **Replay Configuration Management**: Configure which events should be replayed during multi-version transitions
- **User Interaction Preservation**: Ensure user interactions are preserved during hydration across versions
- **Event Prioritization Strategy**: Prioritize critical events for immediate replay during upgrades

### Built-in Control Flow Stabilization
- **Progressive *ngIf Migration**: Complete migration to @if syntax during appropriate Angular versions
- **Incremental *ngFor Migration**: Complete migration to @for syntax with track expressions across versions
- **Gradual *ngSwitch Migration**: Complete migration to @switch syntax during version transitions
- **Performance Optimization**: Optimize control flow for better runtime performance across upgrades
- **Type Safety Enhancement**: Enhance type safety with new control flow syntax during appropriate versions

### Advanced SSR Features Implementation (Angular 20)
- **Streaming SSR Integration**: Implement streaming server-side rendering during final version upgrades
- **Selective Hydration Configuration**: Configure selective hydration based on user interaction
- **Edge-side Rendering Setup**: Set up edge-side rendering capabilities during advanced version steps
- **Cache Optimization Implementation**: Implement advanced caching strategies for SSR during upgrades
- **SEO Enhancement Integration**: Add advanced SEO optimizations for server-rendered content

## Success Criteria
- Successfully orchestrates Angular application upgrades across multiple major versions (12→20)
- **Zero Functionality Loss**: Maintains all existing functionality throughout the entire upgrade journey
- **Intelligent Path Planning**: Automatically determines the optimal upgrade sequence (12→13→14→15→16→17→18→19→20)
- **Comprehensive Checkpoint System**: Provides reliable rollback points at each major version milestone
- **Advanced Error Recovery**: Handles complex upgrade scenarios with intelligent error resolution
- **Third-party Compatibility Management**: Successfully manages third-party library compatibility across all version transitions
- Reduces manual upgrade effort by at least 85% while maintaining 100% functionality preservation
- **Step-by-Step Validation**: Ensures application works correctly after each individual version upgrade
- **Enterprise-Ready Architecture**: Supports both small applications and large enterprise codebases
- **Performance Optimization**: Maintains or improves application performance throughout all upgrades
- **Comprehensive Documentation**: Provides detailed documentation and upgrade playbooks for entire journey
- **Future-Proof Design**: Designed to handle future Angular versions and complex upgrade scenarios
- **Multi-Version Rollback Capability**: Can rollback to any checkpoint in the entire upgrade sequence
- **Prerequisite Validation**: Validates Node.js, TypeScript, and dependency compatibility at each step
- **Breaking Change Management**: Systematically handles breaking changes specific to each Angular version

Create this orchestrator as a sophisticated, enterprise-grade tool that development teams can confidently use to navigate complex multi-version Angular upgrades while maintaining absolute reliability, zero functionality loss, and seamless rollback capabilities throughout the entire upgrade journey from Angular 12 to Angular 20.