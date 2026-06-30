import { defineNitroConfig } from 'nitro/config';

export default defineNitroConfig({
    preset: 'netlify',
    noExternals: true,
    output: {
        publicDir: 'dist/client',
        serverDir: 'dist/server',
    },
    netlify: {
        functions: 'netlify/functions',
    },
    // Ensure server function is properly generated
    rollupConfig: {
        output: {
            entryFileNames: '[name].mjs',
        },
    },
});