import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true,
      clientPort: 8080,
    },
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  optimizeDeps: {
    exclude: ["server"],
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      try {
        // Dynamically import server only in development
        const { createServer } = await import("./server/index.js");
        const app = createServer();

        // Add Express app as middleware to Vite dev server BEFORE Vite's internal middleware
        server.middlewares.use((req: any, res: any, next: any) => {
          if (req.url?.startsWith("/api")) {
            app(req, res, next);
          } else {
            next();
          }
        });

        console.log("✅ Express middleware configured for /api routes");
      } catch (error) {
        console.error("❌ Failed to setup express middleware:", error);
      }
    },
  };
}
