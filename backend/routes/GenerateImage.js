import express from "express"
import { generateImage } from "../controller/GenerateAiImage.js";


const router = express.Router();

router.post("/",generateImage);


export default router;