import type { RuleSetCondition } from '@rspack/core';
import type { IntegrationType } from './utils/getSocketIntegration';

interface OverlayOptions {
  entry: string;
  module: string;
  sockIntegration: IntegrationType;
  sockHost?: string;
  sockPath?: string;
  sockPort?: string;
  sockProtocol?: string;
}

export type PluginOptions = {
  /**
   * Include files to be processed by the plugin.
   * The value is the same as the `rule.test` option in Rspack.
   * @default /\.([cm]js|[jt]sx?|flow)$/i
   */
  include?: RuleSetCondition | null;
  /**
   * Exclude files from being processed by the plugin.
   * The value is the same as the `rule.exclude` option in Rspack.
   * @default /node_modules/
   */
  exclude?: RuleSetCondition | null;
  library?: string;
  forceEnable?: boolean;
  overlay?: boolean | OverlayOptions;
};

export interface NormalizedPluginOptions extends Required<PluginOptions> {
  overlay: false | OverlayOptions;
}

const d = <K extends keyof PluginOptions>(
  object: PluginOptions,
  property: K,
  defaultValue?: PluginOptions[K],
) => {
  // TODO: should we also add default for null?
  if (
    typeof object[property] === 'undefined' &&
    typeof defaultValue !== 'undefined'
  ) {
    object[property] = defaultValue;
  }
  return object[property];
};

const normalizeOverlay = (options: PluginOptions['overlay']) => {
  const defaultOverlay: OverlayOptions = {
    entry: require.resolve('../client/errorOverlayEntry.js'),
    module: require.resolve('../client/overlay/index.js'),
    sockIntegration: 'wds',
  };
  if (!options) {
    return false;
  }
  if (typeof options === 'undefined' || options === true) {
    return defaultOverlay;
  }
  options.entry = options.entry ?? defaultOverlay.entry;
  options.module = options.module ?? defaultOverlay.module;
  options.sockIntegration =
    options.sockIntegration ?? defaultOverlay.sockIntegration;
  return options;
};

export function normalizeOptions(
  options: PluginOptions,
): NormalizedPluginOptions {
  d(options, 'exclude', /node_modules/i);
  d(options, 'include', /\.([cm]js|[jt]sx?|flow)$/i);
  d(options, 'library');
  d(options, 'forceEnable', false);
  options.overlay = normalizeOverlay(options.overlay);
  return options as NormalizedPluginOptions;
}
