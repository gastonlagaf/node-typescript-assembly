// Update with your config settings.

import dotenv from "dotenv"

dotenv.config({
  path: `./env/${process.env.NODE_ENV}.env`
})

module.exports = {
  production: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    migrations: {
      directory: "db/migrations",
      tableName: "knex_migrations"
    }
  }

};
