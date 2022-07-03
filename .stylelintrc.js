module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-prettier"],
  ignoreFiles: [
    "node_modules/**/*.css",
    "dist/**/*.css",
  ],
  rules: {
    "selector-class-pattern": null,
    "color-hex-length": null,
    "comment-empty-line-before": null,
    "font-family-name-quotes": null,
    "no-missing-end-of-source-newline": true,
    "custom-property-empty-line-before": null,
    "color-function-notation": "legacy",
  },
};
