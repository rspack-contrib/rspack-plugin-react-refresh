import getSocketUrlParts from './utils/getSocketUrlParts';
import getUrlFromParts from './utils/getUrlFromParts';
import getWDSMetadata from './utils/getWDSMetadata';
import type { SocketClient } from './utils/getWDSMetadata';

declare global {
  var __webpack_dev_server_client__: SocketClient | { default: SocketClient };
}

/**
 * Initializes a socket server for HMR for webpack-dev-server.
 * @param messageHandler A handler to consume Webpack compilation messages.
 * @param resourceQuery Webpack's `__resourceQuery` string.
 * @returns
 */
export function init(
  messageHandler: (...args: unknown[]) => void,
  resourceQuery: string,
) {
  if (typeof __webpack_dev_server_client__ !== 'undefined') {
    let SocketClient: SocketClient;

    if ('default' in __webpack_dev_server_client__) {
      SocketClient = __webpack_dev_server_client__.default;
    } else {
      SocketClient = __webpack_dev_server_client__;
    }

    const wdsMeta = getWDSMetadata(SocketClient);
    const urlParts = getSocketUrlParts(resourceQuery, wdsMeta);

    const connection = new SocketClient(getUrlFromParts(urlParts, wdsMeta));

    connection.onMessage(function onSocketMessage(data) {
      const message = JSON.parse(data as string);
      messageHandler(message);
    });
  }
}
