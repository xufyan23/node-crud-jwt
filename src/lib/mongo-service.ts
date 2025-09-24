import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const url = process.env.MONGO_URI;
    if (!url) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    await mongoose.connect(url);
    console.log("MongoDB connected");
  } catch (err: any) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
