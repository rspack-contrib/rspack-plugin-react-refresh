import { type JestConfigWithTsJest, createDefaultPreset } from 'ts-jest';

export default {
  ...createDefaultPreset(),
  watchPathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/tests/dist'],
  testEnvironment: './scripts/patch-node-env.cjs',
  testTimeout: process.env.CI ? 60000 : 30000,
  testMatch: ['<rootDir>/test/*.spec.ts', '<rootDir>/test/*.spec.mts'],
  extensionsToTreatAsEsm: ['.mts'],
  globals: {
    updateSnapshot:
      process.argv.includes('-u') || process.argv.includes('--updateSnapshot'),
  },
} satisfies JestConfigWithTsJest;
