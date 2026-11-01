import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    "global": "window",
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tanstack/react-router": path.resolve(__dirname, "./src/lib/router-compat.tsx"),
      "@tanstack/react-query": path.resolve(__dirname, "./src/lib/query-compat.tsx"),
      "@tanstack/react-start": path.resolve(__dirname, "./src/lib/start-compat.ts"),
      "@/backend/db": path.resolve(__dirname, "./src/lib/db-shim.ts"),
      "postgres": path.resolve(__dirname, "./src/lib/postgres-shim.ts"),
      "nodemailer": path.resolve(__dirname, "./src/lib/empty-shim.ts"),
      "google-auth-library": path.resolve(__dirname, "./src/lib/empty-shim.ts"),
      "bcryptjs": path.resolve(__dirname, "./src/lib/empty-shim.ts"),
      "jsonwebtoken": path.resolve(__dirname, "./src/lib/empty-shim.ts"),
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
