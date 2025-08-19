// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off', // Allow any for now
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      'no-console': 'off',
      'prefer-const': 'warn', // Downgrade to warning
      'no-case-declarations': 'error', // Keep this as error
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.js', '*.mjs', 'docs/**'],
  }
);