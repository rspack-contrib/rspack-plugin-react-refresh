import { defineConfig } from '@rstest/core';

export default defineConfig({
  testEnvironment: 'node',
  testTimeout: process.env.CI ? 60000 : 30000,
  include: ['<rootDir>/test/*.spec.ts', '<rootDir>/test/*.spec.mts'],
  globals: true,
});
