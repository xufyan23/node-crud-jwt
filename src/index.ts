import express, { Application } from "express";
import { errorHandler } from "./middlewares/ErrorHandler";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { connectDb } from "./lib/mongo-service";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

//middleware
app.use(express.json()); //parse JSON request and put data in req.body

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

//connect db
connectDb();
const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server is running:" + port));
