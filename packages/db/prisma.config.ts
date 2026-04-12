import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Use the direct connection (port 5432) for CLI operations like db push/migrate.
    // PgBouncer (port 6543) doesn't support prepared statements needed by the schema engine.
    // The Prisma Client at runtime uses DATABASE_URL from the environment separately.
    url: process.env.DIRECT_URL!,
  }
});