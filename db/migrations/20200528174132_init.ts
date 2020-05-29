import * as Knex from "knex";
import fs from "fs";

export async function up(knex: Knex): Promise<any> {
    const sql = fs.readFileSync(`${__dirname}/raw/init.sql`, "utf-8")
    return knex.schema.raw(sql)
}


export async function down(knex: Knex): Promise<any> {
}

