module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: 'eslint:recommended',
  parser: 'typescript-eslint-parser',
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module'
  }
};
