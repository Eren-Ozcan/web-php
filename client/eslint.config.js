import js from '@eslint/js';
import react from 'eslint-plugin-react';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  // Genel JS kuralları (ES2021 + browser + node)
  {
    ...js.configs.recommended,
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
    }
  },
  // TypeScript kuralları
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
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
    plugins: {
      '@typescript-eslint': tseslint,
      react
    },
    rules: {
      // TypeScript ve React ile ilgili özel kurallar buraya
    }
  },
  // JSX/TSX dosyalarına özel React kuralları
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: { react },
    rules: {
      'react/react-in-jsx-scope': 'off' // React 17+
    }
  }
];
