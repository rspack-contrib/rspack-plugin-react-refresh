export type IntegrationType = 'wds';

export function getSocketIntegration(integrationType: IntegrationType) {
  let resolvedSocketIntegration: string;
  switch (integrationType) {
    case 'wds': {
      resolvedSocketIntegration = require.resolve('../sockets/WDSSocket');
      break;
    }
    default: {
      resolvedSocketIntegration = require.resolve(integrationType);
      break;
    }
  }

  return resolvedSocketIntegration;
}
