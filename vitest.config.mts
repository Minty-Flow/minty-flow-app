import { defineConfig } from "vitest/config"

import { fileURLToPath } from "node:url"

export default defineConfig({
  // React Native sets this global; the logger reads it.
  define: { __DEV__: false },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "@tests": fileURLToPath(new URL("./__tests__", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.ts"],
  },
})
