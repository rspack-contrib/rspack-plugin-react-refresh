import path from 'node:path';

export const reactRefreshPath = path.join(
  __dirname,
  '../client/reactRefresh.js',
);
export const reactRefreshEntryPath = path.join(
  __dirname,
  '../client/reactRefreshEntry.js',
);
export const refreshUtilsPath = path.join(
  __dirname,
  '../client/refreshUtils.js',
);
export const refreshRuntimeDirPath = path.dirname(
  require.resolve('react-refresh', {
    paths: [reactRefreshPath],
  }),
);
export const runtimePaths = [
  reactRefreshEntryPath,
  reactRefreshPath,
  refreshUtilsPath,
  refreshRuntimeDirPath,
];
