import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

// Needed to use __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Base path for Vercel root deployment
  base: "/",

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
