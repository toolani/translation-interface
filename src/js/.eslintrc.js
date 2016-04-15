/*global module*/
module.exports = {
    rules: {
        indent: ['off', 2],
        quotes: ['off', 'single'],
        'linebreak-style': ['error', 'unix'],
        'no-console': ['off'],
        'no-unused-vars': ['error', {varsIgnorePattern: "^React$"}],
        'quote-props': ['warn', 'as-needed'],
        semi: ['warn', 'never']
    },
    env: {
        es6: true,
        browser: true
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
        experimentalObjectRestSpread: true
      }
    },
    plugins: [
        'react'
    ]
}