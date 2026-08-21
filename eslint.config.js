import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['node_modules/**', 'tests/__snapshots__/**'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node }
    },
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' }
  },
  prettier
];
