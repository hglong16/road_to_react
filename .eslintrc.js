module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  "parser": "@babel/eslint-parser",
  extends: [
    'eslint:recommended',
    'plugin:react/all',
    'standard',
    'prettier',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'max-len': ['error', 81],
    'object-curly-newline': ['error', { "multiline": true }],
    'object-property-newline': 'error',
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  }
}
