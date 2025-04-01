import { createConfig } from '@eslint/eslintrc';
import nextConfig from '@eslint/config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...createConfig({ 
    extends: [
      'next',
      'next/core-web-vitals'
    ]
  }).map(config => ({
    ...config,
    rules: {
      ...config.rules,
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-const': 'off'
    }
  })),
  {
    ignores: [
      'node_modules',
      '.next',
      'out',
      'public',
      '*.config.js'
    ]
  }
]; 