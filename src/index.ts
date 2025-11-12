import type { Compiler } from '@rspack/core';
import { normalizeOptions } from './options';
import type { NormalizedPluginOptions, PluginOptions } from './options';
import {
  getRefreshRuntimeDirPath,
  getRefreshRuntimePaths,
  reactRefreshPath,
  refreshUtilsPath,
} from './paths';
import { getAdditionalEntries } from './utils/getAdditionalEntries';
import { getIntegrationEntry } from './utils/getIntegrationEntry';
import {
  type IntegrationType,
  getSocketIntegration,
} from './utils/getSocketIntegration';

export type { PluginOptions };

function addEntry(entry: string, compiler: Compiler) {
  new compiler.rspack.EntryPlugin(compiler.context, entry, {
    name: undefined,
  }).apply(compiler);
}

function addSocketEntry(sockIntegration: IntegrationType, compiler: Compiler) {
  const integrationEntry = getIntegrationEntry(sockIntegration);

  if (integrationEntry) {
    addEntry(integrationEntry, compiler);
  }
}

const PLUGIN_NAME = 'ReactRefreshRspackPlugin';

class ReactRefreshRspackPlugin {
  options: NormalizedPluginOptions;

  /**
   * @deprecated
   */
  static get deprecated_runtimePaths() {
    return getRefreshRuntimePaths();
  }

  static loader = 'builtin:react-refresh-loader';

  constructor(options: PluginOptions = {}) {
    this.options = normalizeOptions(options);
  }

  apply(compiler: Compiler) {
    if (
      // Webpack do not set process.env.NODE_ENV, so we need to check for mode.
      // Ref: https://github.com/webpack/webpack/issues/7074
      (compiler.options.mode !== 'development' ||
        // We also check for production process.env.NODE_ENV,
        // in case it was set and mode is non-development (e.g. 'none')
        (process.env.NODE_ENV && process.env.NODE_ENV === 'production')) &&
      !this.options.forceEnable
    ) {
      return;
    }

    const addEntries = getAdditionalEntries({
      devServer: compiler.options.devServer,
      options: this.options,
    });

    if (this.options.injectEntry) {
      for (const entry of addEntries.prependEntries) {
        addEntry(entry, compiler);
      }
    }

    if (
      this.options.overlay !== false &&
      this.options.overlay.sockIntegration
    ) {
      addSocketEntry(this.options.overlay.sockIntegration, compiler);
    }

    for (const entry of addEntries.overlayEntries) {
      addEntry(entry, compiler);
    }

    new compiler.rspack.ProvidePlugin({
      $ReactRefreshRuntime$: reactRefreshPath,
    }).apply(compiler);

    if (this.options.injectLoader) {
      compiler.options.module.rules.unshift({
        test: this.options.test,
        // biome-ignore lint: exists
        include: this.options.include!,
        exclude: {
          // biome-ignore lint: exists
          or: [this.options.exclude!, [...getRefreshRuntimePaths()]].filter(
            Boolean,
          ),
        },
        resourceQuery: this.options.resourceQuery,
        dependency: {
          // Assets loaded via `new URL("static/sdk.js", import.meta.url)` are asset modules
          // React Refresh should not be injected for asset modules as they are static resources
          not: ['url'],
        },
        use: ReactRefreshRspackPlugin.loader,
      });
    }

    const definedModules: Record<string, string | boolean> = {
      // For Multiple Instance Mode
      __react_refresh_library__: JSON.stringify(
        compiler.rspack.Template.toIdentifier(
          this.options.library ||
            compiler.options.output.uniqueName ||
            compiler.options.output.library,
        ),
      ),
      __reload_on_runtime_errors__: this.options.reloadOnRuntimeErrors,
    };
    const providedModules: Record<string, string> = {
      __react_refresh_utils__: refreshUtilsPath,
    };
    if (this.options.overlay === false) {
      // Stub errorOverlay module so their calls can be erased
      definedModules.__react_refresh_error_overlay__ = false;
      definedModules.__react_refresh_socket__ = false;
    } else {
      if (this.options.overlay.module) {
        providedModules.__react_refresh_error_overlay__ = require.resolve(
          this.options.overlay.module,
        );
      }

      if (this.options.overlay.sockIntegration) {
        providedModules.__react_refresh_socket__ = getSocketIntegration(
          this.options.overlay.sockIntegration,
        );
      }
    }
    new compiler.rspack.DefinePlugin(definedModules).apply(compiler);
    new compiler.rspack.ProvidePlugin(providedModules).apply(compiler);

    compiler.options.resolve.alias = {
      'react-refresh': getRefreshRuntimeDirPath(),
      ...compiler.options.resolve.alias,
    };

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.additionalTreeRuntimeRequirements.tap(
        PLUGIN_NAME,
        (_, runtimeRequirements) => {
          runtimeRequirements.add(compiler.rspack.RuntimeGlobals.moduleCache);
        },
      );
    });
  }
}

export { ReactRefreshRspackPlugin };
export default ReactRefreshRspackPlugin;
