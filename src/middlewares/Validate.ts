import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: err.errors.map((e: any) => ({
          path: e.path,
          message: e.message,
        })),
      });
    }
  };
