import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@context": resolve(__dirname, "./src/context"),
      "@types": resolve(__dirname, "./src/types"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["three", "@react-three/fiber", "@react-three/drei"],
          ui: ["react", "react-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
