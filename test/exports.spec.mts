import DefaultExport, { ReactRefreshRspackPlugin } from '../exports/index.mjs';

test('should allow to import from the package', () => {
  const instance = new ReactRefreshRspackPlugin();
  expect(instance.options.reactRefreshLoader).toBeTruthy();
});

test('should allow the default import from the package', () => {
  const instance = new DefaultExport();
  expect(instance.options.reactRefreshLoader).toBeTruthy();
});

test('default import picks the same plugin class', () => {
  expect(DefaultExport).toEqual(ReactRefreshRspackPlugin);
});
