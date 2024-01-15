// config-overrides.js
const { override } = require("customize-cra");

module.exports = override((config) => {
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false,
    },
  };
  config.optimization.runtimeChunk = false;
  return config;
});