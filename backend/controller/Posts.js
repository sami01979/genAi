import mongoose from "mongoose"
import Post from "../models/Post.js"
import User from "../models/User.js"
import ImageKit from "imagekit";
import jwt from "jsonwebtoken"

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export const getAllposts = async (req, res, next) => {
    try {
        const posts = await Post.find({})
        return res.status(200).json({ success: true, data: posts })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const createPost = async (req, res, next) => {
    try {
        const { name, prompt, img } = req.body;

        const uploadResponse = await imagekit.upload({
            file: img,
            fileName: `${Date.now()}-${name}.png`
        });

        const newPost = await Post.create({
            name,
            prompt,
            img: uploadResponse.url,
            owner: req.userId
        });

        return res.status(200).json({ success: true, data: newPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const requester = await User.findById(req.userId).select("email");
        const isAdmin =
            !!process.env.ADMIN_EMAIL &&
            requester?.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
        const isOwner = post.owner.toString() === req.userId;

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Post deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


const getRequesterId = (req) => {
    const header = req.headers.authorization
    if (!header || !header.startsWith("Bearer ")) return null
    try {
        return jwt.verify(header.split(" ")[1], process.env.JWT_SECRET).id
    } catch {
        return null
    }
}

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }

        const post = await Post.findById(id)
            .populate("owner", "name")
            .populate("comments.user", "name")

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }

        let canDelete = false
        const requesterId = getRequesterId(req)
        if (requesterId) {
            const requester = await User.findById(requesterId).select("email")
            const isAdmin =
                !!process.env.ADMIN_EMAIL &&
                requester?.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
            const isOwner = post.owner?._id?.toString() === requesterId
            canDelete = isAdmin || isOwner
        }

        return res.status(200).json({
            success: true,
            data: { ...post.toObject(), canDelete },
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const user = await User.findById(userId).select("name")
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const posts = await Post.find({ owner: userId }).sort({ _id: -1 })
        return res.status(200).json({ success: true, data: { user, posts } })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }

        const post = await Post.findById(id).select("likes")
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }

        const alreadyLiked = post.likes.some((uid) => uid.toString() === req.userId)

        const updated = await Post.findByIdAndUpdate(
            id,
            alreadyLiked
                ? { $pull: { likes: req.userId } }
                : { $addToSet: { likes: req.userId } },
            { new: true }
        ).select("likes")

        return res.status(200).json({ success: true, data: { likes: updated.likes } })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const addComment = async (req, res) => {
    try {
        const { id } = req.params
        const text = req.body.text?.trim()

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }
        if (!text) {
            return res.status(400).json({ success: false, message: "Comment can't be empty" })
        }
        if (text.length > 500) {
            return res.status(400).json({ success: false, message: "Comment is too long (max 500)" })
        }

        const post = await Post.findByIdAndUpdate(
            id,
            { $push: { comments: { user: req.userId, text } } },
            { new: true }
        ).populate("comments.user", "name")

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }
        return res.status(201).json({ success: true, data: post.comments })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}