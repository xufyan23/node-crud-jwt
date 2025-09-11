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
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
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
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Access JWT
    const token = signJwt(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      } as SignOptions
    );

    //refresh Token
    const refreshToken = signJwt(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      } as SignOptions
    );

    res.json({ success: true, token, refreshToken });
  } catch (err: any) {
    next(err);
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
          { userId: decoded.userId },
          process.env.JWT_SECRET as string,
          {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
          } as SignOptions
        );
        res.json({ success: true, token: newToken });
      }
    );
  } catch (err: any) {
    next(err);
  }
};
