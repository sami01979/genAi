import mongoose from "mongoose"
import Message from "../models/Message.js"
import Block from "../models/Block.js"
import User from "../models/User.js"
import { getIO } from "../socket.js"

const isId = (id) => mongoose.isValidObjectId(id)
const fail = (res, error) => {
    console.error(error)
    return res.status(500).json({ success: false, message: "Something went wrong" })
}

export const getConversations = async (req, res) => {
    try {
        const me = new mongoose.Types.ObjectId(req.userId)

        const rows = await Message.aggregate([
            { $match: { $or: [{ sender: me }, { receiver: me }] } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: { $cond: [{ $eq: ["$sender", me] }, "$receiver", "$sender"] },
                    lastMessage: { $first: "$text" },
                    lastAt: { $first: "$createdAt" },
                    lastSender: { $first: "$sender" },
                    unread: {
                        $sum: {
                            $cond: [{ $and: [{ $eq: ["$receiver", me] }, { $eq: ["$read", false] }] }, 1, 0],
                        },
                    },
                },
            },
            { $sort: { lastAt: -1 } },
        ])

        const users = await User.find({ _id: { $in: rows.map((r) => r._id) } }).select("name")
        const names = Object.fromEntries(users.map((u) => [u._id.toString(), u.name]))

        const data = rows.map((r) => ({
            userId: r._id,
            name: names[r._id.toString()] || "Deleted user",
            lastMessage: r.lastMessage,
            lastAt: r.lastAt,
            mine: r.lastSender.toString() === req.userId,
            unread: r.unread,
        }))

        return res.status(200).json({ success: true, data })
    } catch (error) {
        return fail(res, error)
    }
}

export const getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({ receiver: req.userId, read: false })
        return res.status(200).json({ success: true, data: { count } })
    } catch (error) {
        return fail(res, error)
    }
}

export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params
        if (!isId(userId)) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const other = await User.findById(userId).select("name")
        if (!other) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        await Message.updateMany(
            { sender: userId, receiver: req.userId, read: false },
            { read: true }
        )

        const latest = await Message.find({
            $or: [
                { sender: req.userId, receiver: userId },
                { sender: userId, receiver: req.userId },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(200)

        const blockedByMe = !!(await Block.exists({ blocker: req.userId, blocked: userId }))
        const blockedByThem = !!(await Block.exists({ blocker: userId, blocked: req.userId }))

        return res.status(200).json({
            success: true,
            data: { other, messages: latest.reverse(), blockedByMe, blockedByThem },
        })
    } catch (error) {
        return fail(res, error)
    }
}

export const markRead = async (req, res) => {
    try {
        const { userId } = req.params
        if (!isId(userId)) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        await Message.updateMany(
            { sender: userId, receiver: req.userId, read: false },
            { read: true }
        )
        return res.status(200).json({ success: true })
    } catch (error) {
        return fail(res, error)
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.params
        const text = req.body.text?.trim()

        if (!isId(userId)) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        if (userId === req.userId) {
            return res.status(400).json({ success: false, message: "You can't message yourself" })
        }
        if (!text) {
            return res.status(400).json({ success: false, message: "Message can't be empty" })
        }
        if (text.length > 1000) {
            return res.status(400).json({ success: false, message: "Message is too long (max 1000)" })
        }

        const exists = await User.exists({ _id: userId })
        if (!exists) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const blocked = await Block.exists({
            $or: [
                { blocker: req.userId, blocked: userId },
                { blocker: userId, blocked: req.userId },
            ],
        })
        if (blocked) {
            return res.status(403).json({ success: false, message: "You can't message this user" })
        }

        const msg = await Message.create({ sender: req.userId, receiver: userId, text })

        const io = getIO()
        if (io) {
            const payload = JSON.parse(JSON.stringify(msg))
            io.to(`user:${userId}`).emit("message:new", payload)
            io.to(`user:${req.userId}`).emit("message:new", payload)
        }

        return res.status(201).json({ success: true, data: msg })
    } catch (error) {
        return fail(res, error)
    }
}

export const toggleBlock = async (req, res) => {
    try {
        const { userId } = req.params
        if (!isId(userId)) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        if (userId === req.userId) {
            return res.status(400).json({ success: false, message: "You can't block yourself" })
        }

        const existing = await Block.findOneAndDelete({ blocker: req.userId, blocked: userId })
        if (existing) {
            return res.status(200).json({ success: true, data: { blockedByMe: false } })
        }

        await Block.create({ blocker: req.userId, blocked: userId })
        return res.status(200).json({ success: true, data: { blockedByMe: true } })
    } catch (error) {
        return fail(res, error)
    }
}