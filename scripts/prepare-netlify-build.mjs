import { mkdirSync } from "node:fs";

// Nitro netlify preset expects this folder before writing server.mjs (fresh CI checkouts).
mkdirSync(".netlify/functions-internal/server", { recursive: true });
