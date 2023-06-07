import { Federated, Script, ScriptManager } from "@callstack/repack/client";
import React, { Suspense } from "react";
import { AppRegistry, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { name as appName } from "../app.json";
import ErrorBoundary from "./ErrorBoundary";

const replaceUrlParams = (url: string) => {
  if (__DEV__) {
    if (
      DeviceInfo.getBuildNumber() !=
      require("@mobile/client/package.json").appBuildNumber
    ) {
      console.warn("App is not compatible with @mobile/client");
    }
  }

  return url
    .replace("[platform]", Platform.OS)
    .replace("[build]", DeviceInfo.getBuildNumber());
};

console.log({
  d: replaceUrlParams(__URL_D__),
  m: replaceUrlParams(__URL_M__),
});

const resolveURL = Federated.createURLResolver({
  containers: {
    d: replaceUrlParams(__URL_D__),
    m: replaceUrlParams(__URL_M__),
  },
});

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  let url;
  if (caller === "main") {
    url = Script.getDevServerURL(scriptId);
  } else {
    url = resolveURL(scriptId, caller);
  }

  if (!url) {
    return undefined;
  }

  return {
    url,
    cache: !__DEV__, // For development
    timeout: 1000 * 60 * 10,
    query: {
      platform: Platform.OS,
    },
  };
});

const D = React.lazy(() => Federated.importModule("d", "./App"));

function App({ isHeadless }: { isHeadless: boolean }) {

  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <Suspense>
          <D />
        </Suspense>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
