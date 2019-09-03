module.exports = {
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error"
  },
  extends: ["prettier/@typescript-eslint", "plugin:prettier/recommended"],
  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
