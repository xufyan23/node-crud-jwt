import { Request, Response, NextFunction } from "express";
import fs from "fs";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB (binary accurate)

export const validateFileSize = (
  req: Request & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const size = req.file.size;

  if (size > MAX_FILE_SIZE) {
    // Delete file if it exceeds the limit
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error("Failed to delete oversized file:", err);
    }

    return res.status(400).json({
      message: `File too large. Maximum allowed size is 100 MB.`,
    });
  }

  next();
};
