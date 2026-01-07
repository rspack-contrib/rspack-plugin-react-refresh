const DefaultExport = require('../exports/index.cjs');

test('should allow to require from the package', () => {
  const instance = new DefaultExport();
  expect(instance.options.reactRefreshLoader).toBeTruthy();
});
