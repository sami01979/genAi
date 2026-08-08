import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    prompt:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        required:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Post = mongoose.model("Post",PostSchema)

export default Post;