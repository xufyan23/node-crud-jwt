import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import passport from "passport";
import "./utils/Passport";

import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import fileRoutes from "./routes/fileRoutes";

import { connectDb } from "./lib/mongo-service";
import { errorHandler } from "./middlewares/ErrorHandler";
import { setupSwagger } from "./utils/swagger";

const app: Express = express();

//middleware
app.use(express.json()); //parse JSON request and put data in req.body

app.use(passport.initialize());

//swagger
setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);

//404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

//connect db
connectDb();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server is running:" + port));
