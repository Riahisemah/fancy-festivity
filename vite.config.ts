import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "netlify",
    noExternals: true,
    // Add this to fix the server function path
    netlify: {
      functions: 'netlify/functions',
    },
    // Ensure proper output structure
    output: {
      publicDir: 'dist/client',
      serverDir: 'dist/server',
    },
  },
  // Add this to fix the function generation
  vite: {
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      fs: {
        allow: ['.'],
      },
    },
  },
});