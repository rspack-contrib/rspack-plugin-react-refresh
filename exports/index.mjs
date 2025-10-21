// ES modules wrapper
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { ReactRefreshRspackPlugin } = require('../dist/index.js');

// default export will be deprecated in next major version
export default ReactRefreshRspackPlugin;
export { ReactRefreshRspackPlugin };
