import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

export const uploadedFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(); // pass control to next middleware
};

export const downloadFile = (req: Request, res: Response) => {
  const fileName = req.query.filename as string;

  if (!fileName) {
    return res.status(400).json({ message: "Please provide ?filename=" });
  }
  const filePath = path.join(
    process.cwd(),
    "uploads",
    req.query.filename as string
  );

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  //get file details
  const stats = fs.statSync(filePath);
  const totalSize = stats.size;
  let readBytes = 0;

  //set download headers
  res.setHeader("Content-Length", totalSize);
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

  //create read stream
  const stream = fs.createReadStream(filePath);

  stream.on("data", (chunk) => {
    readBytes += chunk.length;
    const progress = readBytes / totalSize;
    const barLength = 60;
    const filled = Math.floor(barLength * progress);
    const bar = "█".repeat(filled) + "-".repeat(barLength - filled);

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `📦 Downloading [${bar}] ${(progress * 100).toFixed(2)}%`
    );
  });

  stream.on("end", () => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log("Download complete");
  });

  stream.on("error", (err) => res.status(500).json({ message: err.message }));
  stream.pipe(res);
};
