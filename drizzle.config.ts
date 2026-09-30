import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./migrations",
	schema: "./server/database/schema.ts",
	dialect: "sqlite",
});
