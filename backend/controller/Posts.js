import Post from "../models/Post.js"
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export const getAllposts = async (req, res, next) => {
    try {
        const posts = await Post.find({})
        return res.status(200).json({
            success: true,
            data: posts
        })
    } catch (error) {
        console.error(error)
        console.error("kuch to garbar hey")
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

        if (post.owner.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Post deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};