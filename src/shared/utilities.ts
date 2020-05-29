import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const check = async (req: Request, res: Response) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        res.status(400).jsonp(err.array())
    }
}
