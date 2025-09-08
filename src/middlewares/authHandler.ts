import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface AuthRequest extends Request {
  user?: string;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as string;
    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
