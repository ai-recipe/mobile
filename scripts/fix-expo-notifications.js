const fs = require("fs");
const path = require("path");

const file = path.join(
  __dirname,
  "../node_modules/expo-notifications/ios/ExpoNotifications/Notifications/DateComponentsSerializer.swift"
);

if (!fs.existsSync(file)) process.exit(0);

const content = fs.readFileSync(file, "utf8");
const patched = content.replace(
  /\s*if #available\(iOS 26\.0, \*\) \{\s*serializedComponents\["isRepeatedDay"\][^\n]+\n\s*\}/g,
  ""
);

if (content !== patched) {
  fs.writeFileSync(file, patched, "utf8");
  console.log("✓ Patched expo-notifications DateComponentsSerializer.swift");
}
