import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", include: ["ui.test.tsx"], testTimeout: 60000, hookTimeout: 60000, pool: "forks", fileParallelism: false },
});
