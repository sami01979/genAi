import express from "express"
import {
    getAllposts, createPost, deletePost,
    getPostById, getUserPosts, toggleLike, addComment,
} from "../controller/Posts.js"        
import { verifyToken } from "../middleware/verifyToken.js"  

const router = express.Router()

router.get("/", getAllposts)
router.post("/", verifyToken, createPost)

router.get("/user/:userId", getUserPosts)   
router.get("/:id", getPostById)
router.put("/:id/like", verifyToken, toggleLike)
router.post("/:id/comment", verifyToken, addComment)
router.delete("/:id", verifyToken, deletePost)

export default router