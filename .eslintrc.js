const { join } = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      join(__dirname, 'frontend', 'tsconfig.json'),
      join(__dirname, 'backend', 'tsconfig.json'),
    ],
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist', 'backend/generated/**/*'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
