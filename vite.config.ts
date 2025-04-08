import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist", // ✅ Vercel이 찾을 수 있도록 빌드 출력 경로 명시
  },
});