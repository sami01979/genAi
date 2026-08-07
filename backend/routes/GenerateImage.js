import express from "express"
import { generateImage } from "../controller/GenerateAiImage.js";


const router = express.Router();

router.get("/",generateImage);


export default router;