const {
    AndroidConfig,
    withAndroidManifest,
    createRunOncePlugin,
  } = require("expo/config-plugins");
  
  const queries = {
    package: [
      { $: { "android:name": "co.clabs.valora" } }
    ]
  };
  
  
  /**
   * @param {import('@expo/config-plugins').ExportedConfig} config
   */
  const withAndroidManifestService = (config) => {
    return withAndroidManifest(config, (config) => {
      config.modResults.manifest = {
        ...config.modResults.manifest,
        queries,
      };
  
      return config;
    });
  };
  
  module.exports = createRunOncePlugin(
    withAndroidManifestService,
    "withAndroidManifestService",
    "1.0.0"
  );