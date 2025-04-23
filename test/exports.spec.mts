import DefaultExport, { ReactRefreshRspackPlugin } from '../exports/index.mjs';

test('should allow to import from the package', () => {
  expect(DefaultExport.loader).toBeTruthy();
  expect(DefaultExport).toEqual(ReactRefreshRspackPlugin);
});
