import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err: any) {
    next(err);
  }
};

export const updatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      const error = new Error("User not found");
      res.status(404);
      return next(error);
    }
    res.json(updatedUser);
  } catch (err: any) {
    next(err);
  }
};

export const deletedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      const error = new Error("User not found");
      res.status(404);
      return next(error);
    }
    res.json({ deletedUser, message: "User deleted successfully" });
  } catch (err: any) {
    next(err);
  }
};
