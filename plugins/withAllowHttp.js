const { withInfoPlist } = require("expo/config-plugins");

/**
 * Config plugin to allow HTTP (cleartext) and local networking on iOS.
 * Required when the app talks to HTTP APIs (e.g. dev backend at http://...).
 * Apply with: npx expo prebuild --clean && npx expo run:ios
 */
function withAllowHttp(config) {
  return withInfoPlist(config, (config) => {
    config.modResults.NSAppTransportSecurity = {
      NSAllowsArbitraryLoads: true,
      NSAllowsLocalNetworking: true,
    };
    return config;
  });
}

module.exports = withAllowHttp;
