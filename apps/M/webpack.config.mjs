import commonAppConfigs from '@mobile/client/webpack-apps.config.mjs';

export const exposes = {
  './navPages': './src/navigation/index.tsx',
};
export default (env) =>
  commonAppConfigs({
    name: 'm',
    env,
    entry: './index.js',
    exposes,
    remotes: {
      d: 'd@dynamic',
    },
    shared: {},
  });
