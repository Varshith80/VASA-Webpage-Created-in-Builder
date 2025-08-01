#!/usr/bin/env node

import { build } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildProduction() {
  try {
    console.log("🔨 Building VASA for production...");

    // Build the client-side application
    await build({
      root: process.cwd(),
      build: {
        outDir: "dist/spa",
        emptyOutDir: true,
      },
      resolve: {
        alias: {
          "@": resolve(__dirname, "./client"),
          "@shared": resolve(__dirname, "./shared"),
        },
      },
    });

    console.log("✅ Build completed successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

buildProduction();
