import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tanstack/react-router": path.resolve(__dirname, "./src/lib/router-compat.tsx"),
      "@tanstack/react-query": path.resolve(__dirname, "./src/lib/query-compat.tsx"),
      "@tanstack/react-start": path.resolve(__dirname, "./src/lib/start-compat.ts"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  server: {
    port: 3000,
  },
});
