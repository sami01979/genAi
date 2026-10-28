import "./loadEnv.js";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8"]);
import PostRouter from "./routes/Posts.js";
import GenerateImageRouter from "./routes/GenerateImage.js";
import AuthRouter from "./routes/Auth.js";

const app = express();


const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : "*";

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/post", PostRouter);
app.use("/api/generateImage", GenerateImageRouter);
app.use("/api/auth", AuthRouter);

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "hey there how are you",
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});


app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => {
      console.error("failed to connect");
      console.error(err);
    });
};

const startServer = async () => {
  connectDB();
  try {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`the server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();