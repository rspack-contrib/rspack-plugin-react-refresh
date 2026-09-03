// Configuration guide: https://rstack.rs/config
import { define } from 'rstack';

define.lib({
  bundle: true,
  dts: true,
});

define.test({
  testEnvironment: 'node',
  testTimeout: process.env.CI ? 60000 : 30000,
  include: ['<rootDir>/test/*.spec.ts', '<rootDir>/test/*.spec.mts'],
  globals: true,
});

define.fmt({
  singleQuote: true,
});

define.staged({
  '*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}': ['rs lint --fix', 'rs fmt'],
  '*.{json,jsonc,md,mdx,css,scss,less,html,yml,yaml}': 'rs fmt',
});

define.lint(({ js, ts }) => [js.configs.recommended, ts.configs.recommended]);
