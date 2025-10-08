import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import passport from "passport";
import "./utils/Passport";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import fileRoutes from "./routes/fileRoutes";

import { connectDb } from "./lib/mongo-service";
import { errorHandler } from "./middlewares/ErrorHandler";

const app: Application = express();

//middleware
app.use(express.json()); //parse JSON request and put data in req.body

app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

//connect db
connectDb();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server is running:" + port));
