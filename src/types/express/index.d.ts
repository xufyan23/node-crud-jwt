import "express";

declare global {
  namespace Express {
    interface User {
      userId?: string;
      role: "user" | "admin";
    }
  }
}
