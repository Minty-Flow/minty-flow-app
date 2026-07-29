import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/database/drizzle/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo",
})
