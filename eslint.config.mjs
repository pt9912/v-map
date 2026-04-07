import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'loader/**',
      'www/**',
      '**/*.stories.*',
      '**/*.story.*',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.e2e.ts',
      '**/*.e2e-utils.ts',
      'src/testing/**',
      'scripts/**',
      'docs/**',
      '.storybook/**',
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^(_|h)$' }],
    },
  },
);
