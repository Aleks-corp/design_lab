import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "./",

  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve("index.html"),
        404: resolve("404.html"),
      },
    },
    target: "esnext",
  },
  resolve: {
    alias: {
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern-compiler",
      },
    },
  },
});
