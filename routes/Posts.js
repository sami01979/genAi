import express from "express"
import { createPost, getAllposts } from "../controller/Posts.js"

const router = express.Router();

router.get("/",getAllposts);
router.post("/",createPost)

export default router;