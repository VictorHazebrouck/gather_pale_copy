import jsdoc from "eslint-plugin-jsdoc";

export default [
    jsdoc.configs["flat/recommended"],
    {
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            semi: ["error", "always"],
            quotes: ["error", "double"],
            "no-trailing-spaces": "error",
            "no-restricted-syntax": [
                "error",
                {
                    selector: "ConditionalExpression",
                    message: "Ternary expressions are not allowed.",
                },
            ],
            "jsdoc/tag-lines": "off",
            "jsdoc/no-undefined-types": "off",
        },
        ignores: [
            "node_modules/",
            "dist/",
            "build/",
            "*.min.js",
            "src/vendor/*.js",
            "public/**/*.min.js",
        ],
    },
];
