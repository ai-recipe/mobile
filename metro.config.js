const { withNativeWind } = require("nativewind/metro");
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// Ensure proper module resolution for @env
config.resolver = {
  ...config.resolver,
  sourceExts: [...(config.resolver?.sourceExts || []), "env"],
};

module.exports = withNativeWind(config, { input: "./global.css" });