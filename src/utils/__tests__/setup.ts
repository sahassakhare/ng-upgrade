// Jest setup file for AdvancedContentPreserver tests

// Mock console methods to reduce test noise
global.console = {
  ...console,
  // Uncomment to silence console output during tests
  // log: jest.fn(),
  // error: jest.fn(),
  // warn: jest.fn(),
  // info: jest.fn(),
} as any;

// Mock process.cwd for consistent test environment
jest.mock('process', () => ({
  ...jest.requireActual('process'),
  cwd: jest.fn().mockReturnValue('/test/project')
}));

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toContainTypeScriptCode(expected: string): R;
      toHaveValidTypeScriptSyntax(): R;
    }
  }
}

// Custom Jest matchers for TypeScript content
expect.extend({
  toContainTypeScriptCode(received: string, expected: string) {
    const pass = received.includes(expected);
    return {
      message: () =>
        pass
          ? `Expected TypeScript content not to contain "${expected}"`
          : `Expected TypeScript content to contain "${expected}"`,
      pass,
    };
  },

  toHaveValidTypeScriptSyntax(received: string) {
    // Basic TypeScript syntax validation
    const hasValidBraces = (received.match(/\{/g) || []).length === (received.match(/\}/g) || []).length;
    const hasValidParens = (received.match(/\(/g) || []).length === (received.match(/\)/g) || []).length;
    
    const pass = hasValidBraces && hasValidParens;
    return {
      message: () =>
        pass
          ? `Expected TypeScript content to have invalid syntax`
          : `Expected TypeScript content to have valid syntax (balanced braces and parentheses)`,
      pass,
    };
  },
});

// Common test data
export const SAMPLE_COMPONENT = `
import { Component, OnInit } from '@angular/core';
import { CustomService } from './custom.service';

@Component({
  selector: 'app-test',
  template: '<div>Test</div>'
})
export class TestComponent implements OnInit {
  customProperty = 'value';
  
  constructor(private customService: CustomService) {}
  
  ngOnInit() {
    this.initializeComponent();
  }
  
  customMethod() {
    return this.customService.getData();
  }
}`;

export const MIGRATED_COMPONENT = `
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  template: '<div>Test</div>',
  standalone: true
})
export class TestComponent implements OnInit {
  ngOnInit() {
    // Migration generated
  }
}`;

export const SAMPLE_TEMPLATE = `
<div class="wrapper">
  <h1>{{title}}</h1>
  <div *ngIf="showContent">
    <p>{{description}}</p>
    <custom-component [data]="customData"></custom-component>
  </div>
</div>`;

export const MIGRATED_TEMPLATE = `
<div>
  <h1>{{title}}</h1>
  @if (showContent) {
    <p>Content</p>
  }
</div>`;