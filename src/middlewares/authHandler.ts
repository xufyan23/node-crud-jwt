import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role?: "user" | "admin";
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & {
      userId: string;
      role: "user" | "admin";
    };

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
