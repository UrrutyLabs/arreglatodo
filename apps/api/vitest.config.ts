import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
    exclude: ["node_modules", ".next", "dist"],
    setupFiles: ["./src/test-setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@modules": path.resolve(__dirname, "./src/server/modules"),
      "@infra": path.resolve(__dirname, "./src/server/infrastructure"),
      "@shared": path.resolve(__dirname, "./src/server/shared"),
      "@repo/domain": path.resolve(__dirname, "../../packages/domain/src"),
    },
  },
});
