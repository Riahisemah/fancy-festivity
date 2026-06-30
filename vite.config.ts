import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "netlify",
    noExternals: true,
    // Disable the problematic internal function generation
    netlify: {
      functions: 'netlify/functions',
    },
    output: {
      publicDir: 'dist/client',
      serverDir: 'dist/server',
    },
    // Skip the internal functions directory
    skipFunctions: true,
  },
});