import express from "express"
import {
    getConversations, getUnreadCount, getMessages,
    markRead, sendMessage, toggleBlock,
} from "../controller/Messages.js"
import { verifyToken } from "../middleware/verifyToken.js"   // <- your middleware path

const router = express.Router()

router.use(verifyToken)

router.get("/", getConversations)
router.get("/unread-count", getUnreadCount)   // must be above "/:userId"
router.post("/block/:userId", toggleBlock)
router.put("/:userId/read", markRead)
router.get("/:userId", getMessages)
router.post("/:userId", sendMessage)

export default router