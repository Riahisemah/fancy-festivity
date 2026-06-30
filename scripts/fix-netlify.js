import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Create the required directory structure
const internalDir = path.join(rootDir, ".netlify", "functions-internal", "server");
if (!fs.existsSync(internalDir)) {
  fs.mkdirSync(internalDir, { recursive: true });
  console.log("✅ Created .netlify/functions-internal/server");
}

// Copy server function from dist to the internal location
const sourceFile = path.join(rootDir, "dist", "server", "netlify.mjs");
const destFile = path.join(internalDir, "server.mjs");

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log("✅ Copied server function to .netlify/functions-internal/server/server.mjs");
} else {
  // Try alternative location
  const altSource = path.join(rootDir, "dist", "server", "main.mjs");
  if (fs.existsSync(altSource)) {
    fs.copyFileSync(altSource, destFile);
    console.log("✅ Copied main.mjs as server function");
  } else {
    console.error("❌ Server function not found in dist/server/");
  }
}

// Also copy to netlify/functions for the deploy
const functionsDir = path.join(rootDir, "netlify", "functions");
if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir, { recursive: true });
}

const functionDest = path.join(functionsDir, "server.mjs");
if (fs.existsSync(destFile)) {
  fs.copyFileSync(destFile, functionDest);
  console.log("✅ Copied server function to netlify/functions/server.mjs");
}
