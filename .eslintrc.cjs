try {
  const { structuredClone } = require('node:util');
  if (structuredClone && typeof global.structuredClone !== 'function') {
    global.structuredClone = structuredClone;
  }
} catch (error) {
  // util.structuredClone not available, fall back below
}

if (typeof global.structuredClone !== 'function') {
  global.structuredClone = require('@ungap/structured-clone');
}

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    es2021: true,
    jquery: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
  },
  overrides: [
    {
      files: ['.eslintrc.cjs', 'webpack.config.js', 'gulpfile.js'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
