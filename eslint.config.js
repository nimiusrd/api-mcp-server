import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'prettier': prettierPlugin,
      'import': importPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          'newlines-between': 'always',
          'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
        }
      ],
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-console': 'off'
    }
  },
  prettier,
  {
    ignores: [
      'node_modules/**',
      'build/**',
      'coverage/**',
      'dist/**',
      '.git/**',
      'package-lock.json'
    ]
  }
];
