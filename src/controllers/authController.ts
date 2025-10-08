import { Response, Request, NextFunction } from "express";
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";

const signJwt = (payload: object, secret: string, options: SignOptions) => {
  return jwt.sign(payload, secret, options);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("📩 Register hit:", req.body);
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = new User({ name, email, password: hashedPassword });
    console.log("user", user);
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("login");
  try {
    const user = req.user as any; // safeUser returned by LocalStrategy
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Sign access token with payload { id, role }
    const token = signJwt(
      { id: user.userId, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions
    );

    const refreshToken = signJwt(
      { id: user.userId },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN } as SignOptions
    );

    return res.json({ success: true, token, refreshToken });
  } catch (err: any) {
    return next(err);
  }
};

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as any; // safeUser from GoogleStrategy
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const token = signJwt(
      { id: user.userId, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions
    );

    const refreshToken = signJwt(
      { id: user.userId },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN } as SignOptions
    );

    return res.json({ success: true, token, refreshToken });
  } catch (err: any) {
    return next(err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    //verify token
    jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        //create new token
        const newToken = signJwt(
          { id: decoded.id, role: decoded.role },
          process.env.JWT_SECRET as string,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          } as SignOptions
        );
        res.json({ success: true, token: newToken });
      }
    );
  } catch (err: any) {
    next(err);
  }
};
