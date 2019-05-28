module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  extends:  [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    'class-methods-use-this': 'off',
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    'no-dupe-class-members': 'off',
    'lines-between-class-members': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error'
  },
};
