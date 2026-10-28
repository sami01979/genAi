import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
})

const PostSchema = new mongoose.Schema({
    name: { type: String, required: true },
    prompt: { type: String, required: true },
    img: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
}, { timestamps: true })

const Post = mongoose.model("Post", PostSchema)

export default Post;