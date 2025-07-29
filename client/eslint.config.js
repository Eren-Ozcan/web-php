
export default [
  // General JS rules
  {
    ignores: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        prompt: 'readonly',
        module: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-undef': 'error'
    }
  },
  // TypeScript files are ignored as TypeScript parser is unavailable
];
