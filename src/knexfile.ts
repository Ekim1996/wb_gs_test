import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
  },
};

export default config;