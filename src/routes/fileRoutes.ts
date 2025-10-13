/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file
 *     description: Upload exactly 100MB file.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload.
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request (e.g., file size exceeds limit)
 *       500:
 *         description: Internal server error
 *
 * /api/files/download:
 *   get:
 *     summary: Download a file
 *     description: Download a file from the upload folder.
 *     parameters:
 *       - in: query
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The exact name of the file to download.
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       400:
 *         description: Missing filename
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal server error
 */

import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { uploadedFile, downloadFile } from "../controllers/fileController";
import { validateFileSize } from "../middlewares/fileHandler";

const router = Router();

// create uploads folder if missing
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), validateFileSize, (req, res) =>
  res.status(201).json({ message: "File uploaded" })
);
router.get("/download", downloadFile);

export default router;
