module.exports = {
    "parser": "babel-eslint",
    "root": true,
    "plugins": [
        "react"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
        }
    },
    "env": {
        "browser": true,
        "amd": true,
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "rules": {
        "no-useless-escape": 1,
        "no-console": 0,
        "no-undef": 0,
        "no-debugger": 1,
        "no-unused-vars": 1,
        "no-var": 1,
        "block-scoped-var": 1,
        "no-use-before-define": 0,
        "comma-dangle": 0,
        "no-caller": 1,
        "no-loop-func": 1,
        "no-extend-native": 1,
        "no-global-assign": 1,
        "no-proto": 1,
        "no-eq-null": 1,
        "no-floating-decimal": 1,
        "curly": 1,
        "react/prop-types": 0,
        "semi": 0,
        "arrow-parens": 0,
        "arrow-body-style": [0, "as-needed"]
    }
}