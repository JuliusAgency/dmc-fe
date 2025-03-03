module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "node_modules"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-console": "warn",
    "no-debugger": "warn",
    "no-unused-vars": "warn",
    "no-var": "error",
    "prefer-const": "error",
    "react/prop-types": "off",
    eqeqeq: "error",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
