import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    read: { type: Boolean, default: false },
}, { timestamps: true })

MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 })
MessageSchema.index({ receiver: 1, read: 1 })

export default mongoose.model("Message", MessageSchema)