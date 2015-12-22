/*global module*/
module.exports = {
    rules: {
        indent: [
            0,
            2
        ],
        quotes: [
            0,
            'single'
        ],
        'linebreak-style': [
            2,
            'unix'
        ],
        'no-console': [0],
        'no-unused-vars': [2, {varsIgnorePattern: "^React$"}],
        'quote-props': [1, 'as-needed'],
        semi: [
            1,
            'never'
        ]
    },
    env: {
        es6: true,
        browser: true
    },
    extends: 'eslint:recommended',
    ecmaFeatures: {
        jsx: true,
        experimentalObjectRestSpread: true,
        modules: true
    },
    plugins: [
        'react'
    ]
}