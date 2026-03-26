// Load env for Prisma CLI (Next.js uses .env.local; Prisma defaults to .env only)
import { config } from "dotenv"
config({ path: ".env.local" })
config({ path: ".env" })
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
