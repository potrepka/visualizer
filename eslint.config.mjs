import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import perfectionist from 'eslint-plugin-perfectionist'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'

const importRules = {
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  'perfectionist/sort-imports': [
    'error',
    {
      newlinesBetween: 0,
      groups: ['builtin', 'external', ['parent', 'sibling', 'index']],
    },
  ],
  'perfectionist/sort-named-imports': 'error',
  'perfectionist/sort-exports': 'error',
  'perfectionist/sort-named-exports': 'error',
}

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        clearInterval: true,
        clearTimeout: true,
        console: true,
        process: true,
        setInterval: true,
        setTimeout: true,
      },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      perfectionist,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-undef': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs['recommended-latest'].rules,
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react/no-unknown-property': 'off',
      ...reactRefresh.configs.vite.rules,
      ...importRules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
