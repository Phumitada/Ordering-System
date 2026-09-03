import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.routes'
import categoryRoutes from './routes/category.routes'
import productRoutes from './routes/product.routes'
import inventoryRoutes from './routes/inventory.routes'
import orderRoutes from './routes/order.routes'
import userRoutes from './routes/user.routes'
import addressRoutes from './routes/address.routes'

import { initSocket, io } from './socket/socket'
import { initAutoCancelCron } from './cron/cancel.cron'
import { initStockOpenCron } from './cron/dailyOpenStock.cron'

dotenv.config()

const PORT = process.env.PORT || 5001

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())
app.use(
  cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
    credentials: true,
  })
)
app.use(hpp())

// เดิมมี express-mongo-sanitize / xss-clean / perfect-express-sanitizer
// เพราะเดิมใช้ MongoDB ที่เสี่ยง NoSQL-injection ผ่าน query object โดยตรง
// ตอนนี้ผ่าน Prisma (parameterized queries) แล้ว ความเสี่ยงจุดนั้นหมดไป จึงตัดออกเพื่อลด dependency ที่ไม่จำเป็น
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

initSocket(server)
app.use((req, _res, next) => {
  ;(req as any).io = io
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/addresses', addressRoutes)

initStockOpenCron()
initAutoCancelCron()

server.listen(PORT, () => {
  console.log(`🚀 Server & Socket running on port ${PORT}`)
})
