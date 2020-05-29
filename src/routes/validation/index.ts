import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator"

export const validate = (constraints: any[]) => {
    return async(req: Request, res: Response, next: NextFunction) => {
      await Promise.all(constraints.map(validation => validation.run(req)));
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      res.status(400).json({ errors: errors.array() });
  };
}