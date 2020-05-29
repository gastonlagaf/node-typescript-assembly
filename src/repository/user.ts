import BaseRepository from "@shared/api/baseRepository"
import { provide } from "inversify-binding-decorators";
import TYPE from "@shared/type";
import { User } from "@entity/user";
import { getDatasource } from "@shared/txSupport";

@provide(TYPE.UserRepository)
export class UserRepository extends BaseRepository<User> {

    async get(id: number): Promise<User> {
        const datasource = getDatasource()
        return datasource.from("users").select("id", "name", "email").where({id: id}).first<User>()
    }

    async save(user: User): Promise<User> {
        const datasource = getDatasource()
        return datasource("users").insert(this.transform(user)).returning(this.getAliases().id).then((id) => {
            user.id = Number(id)
            return user
        })
    }

    getAliases(): any {
        return {
            id: "id",
            name: "name",
            email: "email"
        }
    }

}