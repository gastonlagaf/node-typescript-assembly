import knex from "@config/datasource"
import Knex from "knex"
import { createNamespace, Namespace } from "cls-ts";

const localStorage = createNamespace("tx-session")

export function transactional(datasource: Knex = knex) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            return localStorage.runAndReturn(() => {
                return datasource.transaction((tx) => {
                    localStorage.set("datasource", tx)
                    return originalMethod.apply(this, args)
                })
                .then((result) => {return result})
                .catch((error) => {throw error})
            })
        }
    }
}

export function getDatasource(name: string | null = null): Knex {
    const connection = localStorage.get("datasource") as Knex
    if (!connection) {
        return knex
    }
    return connection
}