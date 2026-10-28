import { Server } from "socket.io"
import jwt from "jsonwebtoken"

let io

export const initSocket = (httpServer, origins) => {
    io = new Server(httpServer, { cors: { origin: origins } })

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.userId = decoded.id
            next()
        } catch {
            next(new Error("unauthorized"))
        }
    })

    io.on("connection", (socket) => {
        socket.join(`user:${socket.userId}`)
    })

    return io
}

export const getIO = () => io