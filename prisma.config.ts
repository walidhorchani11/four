// Load env for Prisma CLI (Next.js uses .env.local; Prisma defaults to .env only)
import { config } from "dotenv"
config({ path: ".env.local" })
config({ path: ".env" })
import { defineConfig } from "prisma/config"
import { normalizeDatabaseUrlForPg } from "./lib/database-url"

const rawUrl = process.env["DATABASE_URL"]
const datasourceUrl = rawUrl ? normalizeDatabaseUrlForPg(rawUrl) : undefined

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
