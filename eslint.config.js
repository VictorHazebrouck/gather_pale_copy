export default [
    {
        ignores: [
            "node_modules/",
            "dist/",
            "build/",
            "*.min.js",
            "src/vendor/*.js",
            "public/**/*.min.js",
        ],
    },
    {
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            semi: ["error", "always"],
            quotes: ["error", "double"],
            "no-trailing-spaces": "error",
        },
    },
];
