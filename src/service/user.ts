import { provide } from "inversify-binding-decorators";
import "reflect-metadata";
import TYPE from "@shared/type";
import { transactional } from "@shared/txSupport"
import { inject } from "inversify";
import { UserRepository } from "@repository/user";
import { User } from "@entity/user";

@provide(TYPE.UserService)
export class UserService {

    constructor(@inject(TYPE.UserRepository) private userRepository: UserRepository) {}

    @transactional()
    async get(): Promise<User> {
        const user = this.userRepository.save({ email: "name", name: "name" } as User)
        return this.userRepository.get(1)
    }

}