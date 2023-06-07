import commonAppConfigs from '@mobile/client/webpack-apps.config.mjs';

export const exposes = {
  './App': './index.js',
};

export default (env) =>
  commonAppConfigs({
    name: 'd',
    env,
    entry: './index.js',
    exposes,
    remotes: {
      m: 'm@dynamic',
    },
    shared: {},
  });
