import express from "express"
import { createPost, getAllposts, deletePost } from "../controller/Posts.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router();

router.get("/", getAllposts);
router.post("/", verifyToken, createPost)
router.delete("/:id", verifyToken, deletePost)

export default router;