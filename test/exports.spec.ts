const DefaultExport = require('../exports/index.cjs');

test('should allow to require from the package', () => {
  expect(DefaultExport.loader).toBeTruthy();
});
