/**
 * Comprehensive dependency compatibility matrix for Angular versions
 */
export interface CompatibleVersion {
  name: string;
  version: string;
  type: 'dependencies' | 'devDependencies';
  required?: boolean;
  notes?: string;
}

export class DependencyCompatibilityMatrix {
  /**
   * Get compatible third-party dependencies for Angular version
   */
  static getCompatibleDependencies(angularVersion: string): CompatibleVersion[] {
    const versionMap: Record<string, CompatibleVersion[]> = {
      '12': [
        // Angular Material & CDK
        { name: '@angular/material', version: '^12.0.0', type: 'dependencies' },
        { name: '@angular/cdk', version: '^12.0.0', type: 'dependencies' },
        
        // NgRx
        { name: '@ngrx/store', version: '^12.0.0', type: 'dependencies' },
        { name: '@ngrx/effects', version: '^12.0.0', type: 'dependencies' },
        { name: '@ngrx/entity', version: '^12.0.0', type: 'dependencies' },
        { name: '@ngrx/router-store', version: '^12.0.0', type: 'dependencies' },
        
        // Angular Flex Layout
        { name: '@angular/flex-layout', version: '^12.0.0', type: 'dependencies' },
        
        // PrimeNG
        { name: 'primeng', version: '^12.0.0', type: 'dependencies' },
        { name: 'primeicons', version: '^4.1.0', type: 'dependencies' },
        
        // ng-bootstrap
        { name: '@ng-bootstrap/ng-bootstrap', version: '^10.0.0', type: 'dependencies' },
        
        // Angular PWA
        { name: '@angular/service-worker', version: '^12.0.0', type: 'dependencies' },
        
        // Testing
        { name: '@angular/cdk/testing', version: '^12.0.0', type: 'devDependencies' },
        
        // RxJS
        { name: 'rxjs', version: '~7.1.0', type: 'dependencies' }
      ],
      
      '13': [
        // Angular Material & CDK
        { name: '@angular/material', version: '^13.0.0', type: 'dependencies' },
        { name: '@angular/cdk', version: '^13.0.0', type: 'dependencies' },
        
        // NgRx
        { name: '@ngrx/store', version: '^13.0.0', type: 'dependencies' },
        { name: '@ngrx/effects', version: '^13.0.0', type: 'dependencies' },
        { name: '@ngrx/entity', version: '^13.0.0', type: 'dependencies' },
        { name: '@ngrx/router-store', version: '^13.0.0', type: 'dependencies' },
        
        // Angular Flex Layout
        { name: '@angular/flex-layout', version: '^13.0.0', type: 'dependencies' },
        
        // PrimeNG
        { name: 'primeng', version: '^13.0.0', type: 'dependencies' },
        { name: 'primeicons', version: '^5.0.0', type: 'dependencies' },
        
        // ng-bootstrap
        { name: '@ng-bootstrap/ng-bootstrap', version: '^11.0.0', type: 'dependencies' },
        
        // Angular PWA
        { name: '@angular/service-worker', version: '^13.0.0', type: 'dependencies' },
        
        // Testing
        { name: '@angular/cdk/testing', version: '^13.0.0', type: 'devDependencies' },
        
        // RxJS
        { name: 'rxjs', version: '~7.4.0', type: 'dependencies' }
      ],
      
      '14': [
        // Angular Material & CDK
        { name: '@angular/material', version: '^14.0.0', type: 'dependencies' },
        { name: '@angular/cdk', version: '^14.0.0', type: 'dependencies' },
        
        // NgRx
        { name: '@ngrx/store', version: '^14.0.0', type: 'dependencies' },
        { name: '@ngrx/effects', version: '^14.0.0', type: 'dependencies' },
        { name: '@ngrx/entity', version: '^14.0.0', type: 'dependencies' },
        { name: '@ngrx/router-store', version: '^14.0.0', type: 'dependencies' },
        
        // Angular Flex Layout (deprecated - migrate to CSS Grid/Flexbox)
        { name: '@angular/flex-layout', version: '^14.0.0', type: 'dependencies', notes: 'Consider migrating to CSS Grid/Flexbox' },
        
        // PrimeNG
        { name: 'primeng', version: '^14.0.0', type: 'dependencies' },
        { name: 'primeicons', version: '^5.0.0', type: 'dependencies' },
        
        // ng-bootstrap
        { name: '@ng-bootstrap/ng-bootstrap', version: '^12.0.0', type: 'dependencies' },
        
        // Angular PWA
        { name: '@angular/service-worker', version: '^14.0.0', type: 'dependencies' },
        
        // Testing
        { name: '@angular/cdk/testing', version: '^14.0.0', type: 'devDependencies' },
        
        // RxJS
        { name: 'rxjs', version: '~7.5.0', type: 'dependencies' }
      ],
      
      '15': [
        // Angular Material & CDK
        { name: '@angular/material', version: '^15.0.0', type: 'dependencies' },
        { name: '@angular/cdk', version: '^15.0.0', type: 'dependencies' },
        
        // NgRx
        { name: '@ngrx/store', version: '^15.0.0', type: 'dependencies' },
        { name: '@ngrx/effects', version: '^15.0.0', type: 'dependencies' },
        { name: '@ngrx/entity', version: '^15.0.0', type: 'dependencies' },
        { name: '@ngrx/router-store', version: '^15.0.0', type: 'dependencies' },
        
        // Angular Flex Layout (deprecated)
        { name: '@angular/flex-layout', version: '^15.0.0', type: 'dependencies', notes: 'Deprecated - migrate to CSS Grid/Flexbox' },
        
        // PrimeNG
        { name: 'primeng', version: '^15.0.0', type: 'dependencies' },
        { name: 'primeicons', version: '^6.0.0', type: 'dependencies' },
        
        // ng-bootstrap
        { name: '@ng-bootstrap/ng-bootstrap', version: '^14.0.0', type: 'dependencies' },
        
        // Angular PWA
        { name: '@angular/service-worker', version: '^15.0.0', type: 'dependencies' },
        
        // Testing
        { name: '@angular/cdk/testing', version: '^15.0.0', type: 'devDependencies' },
        
        // RxJS
        { name: 'rxjs', version: '~7.5.0', type: 'dependencies' }
      ],
      
      '16': [
        // Angular Material & CDK
        { name: '@angular/material', version: '^16.0.0', type: 'dependencies' },
        { name: '@angular/cdk', version: '^16.0.0', type: 'dependencies' },
        
        // NgRx
        { name: '@ngrx/store', version: '^16.0.0', type: 'dependencies' },
        { name: '@ngrx/effects', version: '^16.0.0', type: 'dependencies' },
        { name: '@ngrx/entity', version: '^16.0.0', type: 'dependencies' },
        { name: '@ngrx/router-store', version: '^16.0.0', type: 'dependencies' },
        
        // PrimeNG
        { name: 'primeng', version: '^16.0.0', type: 'dependencies' },
        { name: 'primeicons', version: '^6.0.0', type: 'dependencies' },
        
        // ng-bootstrap
        { name: '@ng-bootstrap/ng-bootstrap', version: '^15.0.0', type: 'dependencies' },
        
        // Angular PWA
        { name: '@angular/service-worker', version: '^16.0.0', type: 'dependencies' },
        
        // Testing
        { name: '@angular/cdk/testing', version: '^16.0.0', type: 'devDependencies' },
        
        // RxJS
        { name: 'rxjs', version: '~7.8.0', type: 'dependencies' }
      ],
      
      '17': [
        // Angular Material & CDK
        { name: '@angular/material', version: '^17.0.0', type: 'dependencies' },
        { name: '@angular/cdk', version: '^17.0.0', type: 'dependencies' },
        
        // NgRx
        { name: '@ngrx/store', version: '^17.0.0', type: 'dependencies' },
        { name: '@ngrx/effects', version: '^17.0.0', type: 'dependencies' },
        { name: '@ngrx/entity', version: '^17.0.0', type: 'dependencies' },
        { name: '@ngrx/router-store', version: '^17.0.0', type: 'dependencies' },
        
        // PrimeNG
        { name: 'primeng', version: '^17.0.0', type: 'dependencies' },
        { name: 'primeicons', version: '^6.0.0', type: 'dependencies' },
        
        // ng-bootstrap
        { name: '@ng-bootstrap/ng-bootstrap', version: '^16.0.0', type: 'dependencies' },
        
        // Angular PWA
        { name: '@angular/service-worker', version: '^17.0.0', type: 'dependencies' },
        
        // Testing
        { name: '@angular/cdk/testing', version: '^17.0.0', type: 'devDependencies' },
        
        // RxJS
        { name: 'rxjs', version: '~7.8.0', type: 'dependencies' }
      ],
      
      '18': [
        // Angular Material & CDK
        { name: '@angular/material', version: '^18.0.0', type: 'dependencies' },
        { name: '@angular/cdk', version: '^18.0.0', type: 'dependencies' },
        
        // NgRx
        { name: '@ngrx/store', version: '^18.0.0', type: 'dependencies' },
        { name: '@ngrx/effects', version: '^18.0.0', type: 'dependencies' },
        { name: '@ngrx/entity', version: '^18.0.0', type: 'dependencies' },
        { name: '@ngrx/router-store', version: '^18.0.0', type: 'dependencies' },
        
        // PrimeNG
        { name: 'primeng', version: '^18.0.0', type: 'dependencies' },
        { name: 'primeicons', version: '^7.0.0', type: 'dependencies' },
        
        // ng-bootstrap
        { name: '@ng-bootstrap/ng-bootstrap', version: '^17.0.0', type: 'dependencies' },
        
        // Angular PWA
        { name: '@angular/service-worker', version: '^18.0.0', type: 'dependencies' },
        
        // Testing
        { name: '@angular/cdk/testing', version: '^18.0.0', type: 'devDependencies' },
        
        // RxJS
        { name: 'rxjs', version: '~7.8.0', type: 'dependencies' }
      ],
      
      '19': [
        // Angular Material & CDK
        { name: '@angular/material', version: '^19.0.0', type: 'dependencies' },
        { name: '@angular/cdk', version: '^19.0.0', type: 'dependencies' },
        
        // NgRx
        { name: '@ngrx/store', version: '^19.0.0', type: 'dependencies' },
        { name: '@ngrx/effects', version: '^19.0.0', type: 'dependencies' },
        { name: '@ngrx/entity', version: '^19.0.0', type: 'dependencies' },
        { name: '@ngrx/router-store', version: '^19.0.0', type: 'dependencies' },
        
        // PrimeNG
        { name: 'primeng', version: '^19.0.0', type: 'dependencies' },
        { name: 'primeicons', version: '^7.0.0', type: 'dependencies' },
        
        // ng-bootstrap
        { name: '@ng-bootstrap/ng-bootstrap', version: '^18.0.0', type: 'dependencies' },
        
        // Angular PWA
        { name: '@angular/service-worker', version: '^19.0.0', type: 'dependencies' },
        
        // Testing
        { name: '@angular/cdk/testing', version: '^19.0.0', type: 'devDependencies' },
        
        // RxJS
        { name: 'rxjs', version: '~7.8.0', type: 'dependencies' }
      ],
      
      '20': [
        // Angular Material & CDK
        { name: '@angular/material', version: '^20.0.0', type: 'dependencies' },
        { name: '@angular/cdk', version: '^20.0.0', type: 'dependencies' },
        
        // NgRx
        { name: '@ngrx/store', version: '^20.0.0', type: 'dependencies' },
        { name: '@ngrx/effects', version: '^20.0.0', type: 'dependencies' },
        { name: '@ngrx/entity', version: '^20.0.0', type: 'dependencies' },
        { name: '@ngrx/router-store', version: '^20.0.0', type: 'dependencies' },
        
        // PrimeNG
        { name: 'primeng', version: '^20.0.0', type: 'dependencies' },
        { name: 'primeicons', version: '^7.0.0', type: 'dependencies' },
        
        // ng-bootstrap
        { name: '@ng-bootstrap/ng-bootstrap', version: '^19.0.0', type: 'dependencies' },
        
        // Angular PWA
        { name: '@angular/service-worker', version: '^20.0.0', type: 'dependencies' },
        
        // Testing
        { name: '@angular/cdk/testing', version: '^20.0.0', type: 'devDependencies' },
        
        // RxJS
        { name: 'rxjs', version: '~7.8.0', type: 'dependencies' }
      ]
    };
    
    return versionMap[angularVersion] || [];
  }

  /**
   * Check if a package should be removed for a specific Angular version
   */
  static getDeprecatedPackages(angularVersion: string): string[] {
    const deprecatedMap: Record<string, string[]> = {
      '15': ['@angular/flex-layout'], // Deprecated in Angular 15
      '16': [], 
      '17': [],
      '18': [],
      '19': [],
      '20': []
    };
    
    return deprecatedMap[angularVersion] || [];
  }

  /**
   * Get migration notes for specific packages
   */
  static getMigrationNotes(packageName: string, angularVersion: string): string | undefined {
    const migrationNotes: Record<string, Record<string, string>> = {
      '@angular/flex-layout': {
        '15': 'Angular Flex Layout is deprecated. Consider migrating to CSS Grid and Flexbox.',
        '16': 'Angular Flex Layout is deprecated. Migrate to modern CSS layout solutions.',
        '17': 'Angular Flex Layout is no longer maintained. Use CSS Grid and Flexbox instead.',
        '18': 'Angular Flex Layout is no longer maintained. Use CSS Grid and Flexbox instead.',
        '19': 'Angular Flex Layout is no longer maintained. Use CSS Grid and Flexbox instead.',
        '20': 'Angular Flex Layout is no longer maintained. Use CSS Grid and Flexbox instead.'
      }
    };
    
    return migrationNotes[packageName]?.[angularVersion];
  }
}