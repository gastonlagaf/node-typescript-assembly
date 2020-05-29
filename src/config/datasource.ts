import Knex from "knex"

const knex = Knex({
    client: process.env.DB_VENDOR,
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_NAME
    },
    pool: { max: Number(process.env.DB_POOL_SIZE) }
  })

export default knex