import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  
  build: {
    outDir: "dist", // Vercel 기본 설정
  },
});
