import { Request, Response, NextFunction } from "express";

export const authorize = (roles: ("user" | "admin")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role!)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};
