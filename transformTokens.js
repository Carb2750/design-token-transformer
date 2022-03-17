const StyleDictionary = require("style-dictionary");
const baseConfig = require("./config.json");

const { minifyDictionary, fileHeader } = StyleDictionary.formatHelpers;

StyleDictionary.registerTransform({
  name: "size/px",
  type: "value",
  matcher: (token) => {
    return (
      (token.unit === "pixel" || token.type === "dimension") &&
      token.value !== 0
    );
  },
  transformer: (token) => {
    return `${token.value}px`;
  },
});

StyleDictionary.registerTransform({
  name: "size/percent",
  type: "value",
  matcher: (token) => {
    return token.unit === "percent" && token.value !== 0;
  },
  transformer: (token) => {
    return `${token.value}%`;
  },
});

StyleDictionary.registerTransformGroup({
  name: "custom/css",
  transforms: StyleDictionary.transformGroup["css"].concat([
    "size/px",
    "size/percent",
  ]),
});

StyleDictionary.registerTransformGroup({
  name: "custom/less",
  transforms: StyleDictionary.transformGroup["less"].concat([
    "size/px",
    "size/percent",
  ]),
});

StyleDictionary.registerTransformGroup({
  name: "custom/scss",
  transforms: StyleDictionary.transformGroup["less"].concat([
    "size/px",
    "size/percent",
  ]),
});

StyleDictionary.registerFilter({
  name: "validToken",
  matcher: function (token) {
    return ["dimension", "string", "number", "color"].includes(token.type);
  },
});

StyleDictionary.registerFormat({
  name: "typescript/object",
  formatter: function ({ dictionary, file }) {
    return (
      fileHeader({ file }) +
      "export const " +
      (file.name || "tokens") +
      " = " +
      JSON.stringify(minifyDictionary(dictionary.tokens), null, 2) +
      ";"
    );
  },
});

const StyleDictionaryExtended = StyleDictionary.extend(baseConfig);

StyleDictionaryExtended.buildAllPlatforms();
