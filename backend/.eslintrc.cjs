module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["standard", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    camelcase: [
      "error",
      {
        allow: ["upload_at"],
      },
    ],
  },
};
