module.exports = {
  env: {
    browser: true,
  },
  extends: ["next/core-web-vitals", "./node_modules/fx-style/"],
  ignorePatterns: ["public/**/*", "*.md", "*.mdx"],
  plugins: ["sort-keys-fix"],
  rules: {
    "sort-keys-fix/sort-keys-fix": 0,
    "import/no-anonymous-default-export": 0,
  },
};
