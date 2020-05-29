import { Request, Response, Router } from "express"
import { UserDTO } from "@routes/model/user";
import { BaseHttpController, controller, httpGet, httpPost } from "inversify-express-utils";
import { UserService } from "@service/user";
import { inject } from "inversify";
import TYPE from "@shared/type";

@controller("/api")
class SampleController {

    constructor(@inject(TYPE.UserService) private userService: UserService) {}

    @httpGet("/all")
    async sampleGet(req: Request, res: Response): Promise<UserDTO> {
        const result = await this.userService.get()
        return new UserDTO(result)
    }

    @httpPost("/post", ...UserDTO.getValidationConstraints())
    async samplePost(req: Request, res: Response) {
        const user = req.body as UserDTO
        return res.json({title: "Done"})
    }

}
