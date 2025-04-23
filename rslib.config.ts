import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'cjs',
      bundle: false,
      dts: true,
      source: {
        tsconfigPath: './tsconfig.build.json',
      },
    },
  ],
});
