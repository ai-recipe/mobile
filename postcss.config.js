module.exports = {
  plugins: [
    require("tailwindcss"),
    require("nativewind/postcss"),
    require("postcss-css-variables"),
    require("postcss-color-functional-notation"),
    require("postcss-calc")({
      warnWhenCannotResolve: true,
    }),
    require("postcss-nested")({
      bubble: ["selector"],
    }),
  ],
};
