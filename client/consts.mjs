import fs from "fs";

const pack = JSON.parse(fs.readFileSync("./package.json").toString());

export const dependencies = pack.dependencies;

export const sharedDeps = Object.entries(dependencies)
  .map(([key, requiredVersion]) => {
    return { [key]: { singleton: true, eager: true, requiredVersion } };
  })
  .reduce(function (result, item) {
    var key = Object.keys(item)[0];
    result[key] = item[key];
    return result;
  }, {});

export const babelLoaderIncludes = [
  /node_modules(.*[/\\])+@callstack\/repack/,
  /node_modules(.*[/\\])+react/,
  /node_modules(.*[/\\])+@react-native/,
  /node_modules(.*[/\\])+@react-native(.*)/,
  /node_modules(.*[/\\])+@react-navigation/,
  /node_modules(.*[/\\])+@expo/,
  /node_modules(.*[/\\])+@d/,
  /node_modules(.*[/\\])+@mobile/,
  /node_modules(.*[/\\])+@georstat/,
  /node_modules(.*[/\\])+@tanstack/,
  /node_modules(.*[/\\])+pretty-format/,
  /node_modules(.*[/\\])+metro/,
  /node_modules(.*[/\\])+abort-controller/,
  /node_modules(.*[/\\])+reanimated-bottom-sheet/,
  /node_modules(.*[/\\])+superstruct/,
  /node_modules(.*[/\\])+prop-types/,
  /node_modules(.*[/\\])+react_native_mqtt/,
];
