import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'

// Config file made with the help of Copilot

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.vite/**',
      '**/coverage/**',
      '**/public/**',
      '**/package-lock.json'
    ]
  },
  // Tests
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest
      }
    }
  },
  // Backend
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '!frontend/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'warn',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'object-shorthand': 'error'
    }
  },
  // Frontend
  {
    files: ['frontend/**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: globals.browser
    },
    plugins: {
      react,
      'react-hooks': reactHooks
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'object-shorthand': 'error'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  prettier
]
