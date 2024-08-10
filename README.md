<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://assets.rspack.dev/rspack/rspack-banner-plain-dark.png">
  <img alt="Rspack Banner" src="https://assets.rspack.dev/rspack/rspack-banner-plain-light.png">
</picture>

# @rspack/plugin-react-refresh

<p>
  <a href="https://www.npmjs.com/package/@@rspack/plugin-react-refresh?activeTab=readme"><img src="https://img.shields.io/npm/v/@@rspack/plugin-react-refresh?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" /></a>
  <a href="https://npmcharts.com/compare/@@rspack/plugin-react-refresh?minimal=true"><img src="https://img.shields.io/npm/dm/@@rspack/plugin-react-refresh.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
  <a href="https://github.com/web-infra-dev/rspack/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" /></a>
</p>

React refresh plugin for [Rspack](https://github.com/web-infra-dev/rspack).

## Installation

First you need to install this plugin and its dependencies:

```bash
npm add @rspack/plugin-react-refresh react-refresh -D
# or
yarn add @rspack/plugin-react-refresh react-refresh -D
# or
pnpm add @rspack/plugin-react-refresh react-refresh -D
# or
bun add @rspack/plugin-react-refresh react-refresh -D
```

## Usage

Enabling [React Fast Refresh](https://reactnative.dev/docs/fast-refresh) functionality primarily involves two aspects: code injection and code transformation.

- Code injection will inject some code from the [react-refresh](https://www.npmjs.com/package/react-refresh) package, as well as some custom runtime code, all of which are integrated in this plugin and can be injected through.
- Code transformation can be added through loaders, such as [jsc.transform.react.refresh](https://swc.rs/docs/configuration/compilation#jsctransformreactrefresh) for [swc-loader](https://swc.rs/docs/usage/swc-loader) or the [react-refresh/babel](https://github.com/facebook/react/tree/main/packages/react-refresh) for [babel-loader](https://github.com/babel/babel-loader).

```js
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");
const isDev = process.env.NODE_ENV === "development";

module.exports = {
  experiments: {
    rspackFuture: {
      disableTransformByDefault: true,
    },
  },
  // ...
  mode: isDev ? "development" : "production",
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
              transform: {
                react: {
                  development: isDev,
                  refresh: isDev,
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [isDev && new ReactRefreshPlugin()].filter(Boolean),
};
```

Compared to the previous approach, this method decouples the React Fast Refresh code injection logic from the transformation logic. The code injection logic is handled uniformly by this plugin, while the code transformation is handled by loaders. This means that this plugin can be used in conjunction with `builtin:swc-loader`, `swc-loader`, or `babel-loader`.

## Example

- For usage with `builtin:swc-loader`, you can refer to the example at [examples/react-refresh](https://github.com/rspack-contrib/rspack-examples/tree/main/rspack/react-refresh/rspack.config.js), When using with `swc-loader`, simply replace `builtin:swc-loader` with `swc-loader`.
- For usage with `babel-loader`, you can refer to the example at [examples/react-refresh-babel-loader](https://github.com/rspack-contrib/rspack-examples/tree/main/rspack/react-refresh-babel-loader/rspack.config.js)

## Credits

Thanks to the [react-refresh-webpack-plugin](https://github.com/pmmmwh/react-refresh-webpack-plugin) created by [@pmmmwh](https://github.com/pmmmwh), which inspires implement this plugin.

## License

`@rspack/plugin-react-refresh` is [MIT licensed](https://github.com/web-infra-dev/rspack/blob/main/LICENSE).
