import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/", // MUST match IIS folder
  plugins: [react()],
  build: {
    outDir: path.resolve(
      "C:/Users/USER/source/repos/fathigasim/EbasketRepo/wwwroot"
    ),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://localhost:7000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
