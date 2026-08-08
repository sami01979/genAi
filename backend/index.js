import "./loadEnv.js"
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import dns from "dns";
dns.setServers(["8.8.8.8"])
import PostRouter from "./routes/Posts.js"
import GenerateImageRouter from "./routes/GenerateImage.js"
import AuthRouter from "./routes/Auth.js"

dotenv.config();
const app=express();
app.use(cors());
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use("/api/post",PostRouter);
app.use("/api/generateImage", GenerateImageRouter)
app.use("/api/auth", AuthRouter)

app.use((err,req,res,next)=>{
    const status = err.status ||500;
    const message = err.message|| "something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message,
    })
})

app.get("/",async (req,res)=>{
    res.status(200).json({
        message:"hey there how are you"
    })
})

const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{console.log("connected to db")})
    .catch((err)=>{console.error("failed to connect")
        console.error(err)
    })
}

const startServer=async()=>{
    connectDB();
    try {
        app.listen(3000,()=>{
            console.log("the server is running on port 3000")
        })
    } catch (error) {
        console.log(error)
    }
}

startServer();