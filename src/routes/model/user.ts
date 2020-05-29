import {check, validationResult} from "express-validator"
import { User } from "@entity/user"
import { TransferObject } from "@shared/api/transferObject"

export class UserDTO implements TransferObject<User> {

    id: number = 0

    email: string

    name: string

    constructor(user: User) {
        this.id = user.id
        this.email = user.email
        this.name = user.name
    }

    toEntity(): User {
        return {
            id: this.id,
            email: this.email,
            name: this.name
        }
    }

    static getValidationConstraints(): any[] {
        return [
            check("email", "Email should not be blank").notEmpty(),
            check("password", "Email should not be blank").notEmpty()
        ]
    }

}