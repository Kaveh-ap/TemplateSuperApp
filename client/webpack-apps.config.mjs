import * as Repack from "@callstack/repack";
import sizeOf from "image-size";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";
import { babelLoaderIncludes, sharedDeps } from "./consts.mjs";

/**
 * More documentation, installation, usage, motivation and differences with Metro is available at:
 * https://github.com/callstack/repack/blob/main/README.md
 *
 * The API documentation for the functions and plugins used in this file is available at:
 * https://re-pack.netlify.app/
 */

/**
 * Webpack configuration.
 * You can also export a static object or a function returning a Promise.
 *
 * @param env Environment options passed from either Webpack CLI or React Native CLI
 *            when running with `react-native start/bundle`.
 */
export default ({
  name,
  env,
  entry: entryFile = "./index.js",
  exposes = {},
  remotes = {},
  shared = {},
}) => {
  const {
    mode = "development",
    context = Repack.getDirname(import.meta.url),
    entry = entryFile,
    platform = process.env.PLATFORM || "android",
    minimize = mode === "production",
    devServer = undefined,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    reactNativePath = new URL("./node_modules/react-native", import.meta.url)
      .pathname,
  } = env;
  const dirname = Repack.getDirname(import.meta.url);

  if (!platform) {
    throw new Error("Missing platform");
  }

  /**
   * Using Module Federation might require disabling hmr.
   * Uncomment below to set `devServer.hmr` to `false`.
   *
   * Keep in mind that `devServer` object is not available
   * when running `webpack-bundle` command. Be sure
   * to check its value to avoid accessing undefined value,
   * otherwise an error might occur.
   */
  if (devServer) {
    devServer.hmr = true;
  }

  /**
   * Depending on your Babel configuration you might want to keep it.
   * If you don't use `env` in your Babel config, you can remove it.
   *
   * Keep in mind that if you remove it you should set `BABEL_ENV` or `NODE_ENV`
   * to `development` or `production`. Otherwise your production code might be compiled with
   * in development mode by Babel.
   */
  process.env.BABEL_ENV = mode;

  return {
    mode,
    /**
     * This should be always `false`, since the Source Map configuration is done
     * by `SourceMapDevToolPlugin`.
     */
    devtool: false,
    context,
    /**
     * `getInitializationEntries` will return necessary entries with setup and initialization code.
     * If you don't want to use Hot Module Replacement, set `hmr` option to `false`. By default,
     * HMR will be enabled in development mode.
     */
    entry: [
      ...Repack.getInitializationEntries(reactNativePath, {
        hmr: devServer && devServer.hmr,
      }),
      entry,
    ],
    resolve: {
      /**
       * `getResolveOptions` returns additional resolution configuration for React Native.
       * If it's removed, you won't be able to use `<file>.<platform>.<ext>` (eg: `file.ios.js`)
       * convention and some 3rd-party libraries that specify `react-native` field
       * in their `package.json` might not work correctly.
       */
      ...Repack.getResolveOptions(platform),
      conditionNames: ["default", "require"],

      /**
       * Uncomment this to ensure all `react-native*` imports will resolve to the same React Native
       * dependency. You might need it when using workspaces/monorepos or unconventional project
       * structure. For simple/typical project you won't need it.
       */
      // alias: {
      //   'react-native': reactNativePath,
      // },
    },
    /**
     * Configures output.
     * It's recommended to leave it as it is unless you know what you're doing.
     * By default Webpack will emit files into the directory specified under `path`. In order for the
     * React Native app use them when bundling the `.ipa`/`.apk`, they need to be copied over with
     * `Repack.OutputPlugin`, which is configured by default inside `Repack.RepackPlugin`.
     */
    output: {
      clean: true,
      path: path.join(dirname, "build", platform),
      filename: "index.bundle",
      chunkFilename: "[name].chunk.bundle",
      publicPath: Repack.getPublicPath({ platform, devServer }),
    },
    /**
     * Configures optimization of the built bundle.
     */
    optimization: {
      /** Enables minification based on values passed from React Native CLI or from fallback. */
      minimize,
      /** Configure minimizer to process the bundle. */
      minimizer: [
        new TerserPlugin({
          test: /\.(js)?bundle(\?.*)?$/i,
          /**
           * Prevents emitting text file with comments, licenses etc.
           * If you want to gather in-file licenses, feel free to remove this line or configure it
           * differently.
           */
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
      chunkIds: "named",
    },
    module: {
      /**
       * This rule will process all React Native related dependencies with Babel.
       * If you have a 3rd-party dependency that you need to transpile, you can add it to the
       * `include` list.
       *
       * You can also enable persistent caching with `cacheDirectory` - please refer to:
       * https://github.com/babel/babel-loader#options
       */
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: [...babelLoaderIncludes],
          use: "babel-loader",
        },
        /**
         * Here you can adjust loader that will process your files.
         *
         * You can also enable persistent caching with `cacheDirectory` - please refer to:
         * https://github.com/babel/babel-loader#options
         */
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              /** Add React Refresh transform only when HMR is enabled. */
              plugins:
                devServer && devServer.hmr
                  ? ["module:react-refresh/babel"]
                  : undefined,
            },
          },
        },
        /**
         * This loader handles all static assets (images, video, audio and others), so that you can
         * use (reference) them inside your application.
         *
         * If you wan to handle specific asset type manually, filter out the extension
         * from `ASSET_EXTENSIONS`, for example:
         * ```
         * Repack.ASSET_EXTENSIONS.filter((ext) => ext !== 'svg')
         * ```
         */
        {
          test: Repack.getAssetExtensionsRegExp(
            Repack.ASSET_EXTENSIONS.filter((ext) => ext !== "svg")
          ),

          loader: "file-loader",
          options: {
            publicPath: (url, resourcePath, context) => {
              const dimensions = sizeOf(resourcePath);

              let publicPath = `(function(){
                  const {Platform} = require("react-native");
                  const DeviceInfo = require("react-native-device-info");
                  const buildNumber = DeviceInfo.getBuildNumber();
                  const platform = Platform.OS;
                  return (__webpack_public_path__ === "noop:///"? __webpack_require__.g.__URL_${name.toUpperCase()}__.replace("[platform]",platform).replace("[build]",buildNumber).replace("[name][ext]","") :__webpack_public_path__) + ${JSON.stringify(
                url
              )}
              })()`;

              return `{uri:${publicPath},width:${dimensions.width},height:${dimensions.height}}`;
            },
            postTransformPublicPath: (p) => {
              return JSON.parse(p);
            },
          },
          // test: Repack.getAssetExtensionsRegExp(
          //   Repack.ASSET_EXTENSIONS.filter((ext) => ext !== "svg")
          // ),
          // use: {
          //   loader: "@callstack/repack/assets-loader",
          //   options: {
          //     platform,
          //     devServerEnabled: Boolean(devServer),
          //     /**
          //      * Defines which assets are scalable - which assets can have
          //      * scale suffixes: `@1x`, `@2x` and so on.
          //      * By default all images are scalable.
          //      */
          //     scalableAssetExtensions: Repack.SCALABLE_ASSETS,
          //   },
          // },
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                native: true,
                dimensions: false,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      /**
       * Configure other required and additional plugins to make the bundle
       * work in React Native and provide good development experience with
       * sensible defaults.
       *
       * `Repack.RepackPlugin` provides some degree of customization, but if you
       * need more control, you can replace `Repack.RepackPlugin` with plugins
       * from `Repack.plugins`.
       */
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
        },
      }),

      new Repack.plugins.ModuleFederationPlugin({
        name,
        exposes,
        remotes,
        shared: { ...sharedDeps, ...shared },
      }),
      new webpack.DefinePlugin({
        __URL_M__: `__webpack_require__.g.__URL_M__`,
        __URL_D__: `__webpack_require__.g.__URL_D__`,
        __BASE_API__: `__webpack_require__.g.__BASE_API__`,
      }),
    ],
  };
};
