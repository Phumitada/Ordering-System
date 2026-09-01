import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'

let io: Server

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    const role = socket.handshake.query.role
    const userId = socket.handshake.query.userId

    if (role === 'admin') {
      socket.join('admin_room')
    }

    // ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — ลูกค้าที่ login เข้า room ของตัวเอง
    // เพื่อรับอัปเดตสถานะออเดอร์แบบ real-time โดยไม่ต้อง poll เอง
    if (userId && typeof userId === 'string') {
      socket.join(`user:${userId}`)
    }
  })

  return io
}

export { io }
