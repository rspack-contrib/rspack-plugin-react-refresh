const path = require('node:path');

/** @type {import('jest').Config} */
const config = {
  watchPathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/tests/dist'],
  testEnvironment: './scripts/patch-node-env.cjs',
  testTimeout: process.env.CI ? 60000 : 30000,
  testMatch: ['<rootDir>/test/*.spec.ts'],
  globals: {
    updateSnapshot:
      process.argv.includes('-u') || process.argv.includes('--updateSnapshot'),
  },
};

module.exports = config;
