import { prisma } from '../db/prisma'
import { io } from '../socket/socket'
import { uploadBufferToCloudinary } from '../lib/cloudinaryUpload'
import type { AdminOrderQuery, CreateOrderPayload } from '../types/order.type'

const SLIP_FOLDER = 'payment_slips'

// เดิม: generateShortRef() ใน order.js
const generateShortRef = (dateStr: string) => {
  const day = dateStr.split('-')[2]
  const random = Math.floor(100 + Math.random() * 900)
  return `D${day}-${random}`
}

const orderInclude = {
  items: true,
  payment: true,
  deliveryInfo: true,
  user: { select: { id: true, name: true, phoneNumber: true } },
} as const

// ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — แจ้งเตือนลูกค้าเจ้าของออเดอร์แบบ real-time
// คู่กับ admin_room เดิม เพื่อให้หน้า "ติดตามออเดอร์" ของลูกค้าอัปเดตเองโดยไม่ต้อง refresh
const emitToCustomer = (order: { userId: string }, event: string) => {
  if (io) {
    io.to(`user:${order.userId}`).emit(event, order)
  }
}

export const orderService = {
  // เดิม: createOrder() — วน check สต็อกทีละรายการ + กันจองเกิน (reserved_qty + sold_qty) + hold คิวจ่ายเงิน 10 นาที
  create: async (userId: string, payload: CreateOrderPayload) => {
    const order = await prisma.$transaction(async (tx) => {
      let totalPrice = 0
      const orderItemsData: {
        productId: string
        quantity: number
        priceAtTime: number
        customNote: string
        name: string
        image: string
      }[] = []

      for (const item of payload.items) {
        const product = await tx.product.findUnique({ where: { id: item.product_id } })
        if (!product) {
          throw new Error(`ไม่พบสินค้า ID: ${item.product_id}`)
        }

        const inventory = await tx.dailyInventory.findUnique({
          where: { date_productId: { date: payload.pickup_date, productId: item.product_id } },
        })

        if (!inventory) {
          throw new Error(`ยังไม่เปิดจองสินค้า ${product.name} สำหรับวันที่ ${payload.pickup_date}`)
        }

        const available = inventory.totalCapacity - (inventory.reservedQty + inventory.soldQty)
        if (available < item.quantity) {
          throw new Error(`ขออภัย สินค้า ${product.name} หมดแล้ว (เหลือ ${available} ชิ้น)`)
        }

        await tx.dailyInventory.update({
          where: { id: inventory.id },
          data: { reservedQty: { increment: item.quantity } },
        })

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtTime: product.price,
          customNote: item.custom_note || '',
          name: product.name,
          image: product.image,
        })
        totalPrice += product.price * item.quantity
      }

      const expireAt = new Date()
      expireAt.setMinutes(expireAt.getMinutes() + 10)

      const order = await tx.order.create({
        data: {
          userId,
          shortRef: generateShortRef(payload.pickup_date),
          totalPrice,
          status: 'PENDING_PAYMENT',
          expireAt,
          fulfillmentType: payload.fulfillment_type,
          pickupDate: payload.pickup_date,
          shopNote: payload.shop_note || '',
          items: { create: orderItemsData },
          deliveryInfo:
            payload.fulfillment_type === 'DELIVERY' && payload.delivery_info
              ? {
                  create: {
                    recipientName: payload.delivery_info.recipient_name,
                    phone: payload.delivery_info.phone,
                    address: payload.delivery_info.address,
                    riderNote: payload.delivery_info.rider_note,
                  },
                }
              : undefined,
        },
        include: orderInclude,
      })

      return order
    })

    if (io) {
      io.to('admin_room').emit('newOrder', order)
    }
    emitToCustomer(order, 'myOrderUpdated')

    return order
  },

  // เดิม: confirmPayment() — อัปโหลดสลิปขึ้น Cloudinary แล้วเปลี่ยนสถานะเป็นรอตรวจสอบ
  // เพิ่ม ownership check (เดิมไม่มี — ลูกค้าคนอื่นที่ login อยู่สามารถแนบสลิปให้ order ของคนอื่นได้ถ้ารู้ id)
  confirmPayment: async (orderId: string, userId: string, file?: Express.Multer.File) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      throw new Error('ไม่พบออเดอร์')
    }
    if (order.userId !== userId) {
      throw new Error('ไม่มีสิทธิ์เข้าถึงออเดอร์นี้')
    }

    if (!file) {
      throw new Error('กรุณาแนบหลักฐานการโอนเงิน (สลิป)')
    }

    const slipUrl = await uploadBufferToCloudinary(file, SLIP_FOLDER)

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'WAITING_FOR_VERIFICATION',
        payment: {
          upsert: {
            create: { slipImage: slipUrl, uploadedAt: new Date() },
            update: { slipImage: slipUrl, uploadedAt: new Date() },
          },
        },
      },
      include: orderInclude,
    })

    if (io) {
      io.to('admin_room').emit('paymentUploaded', updatedOrder)
    }
    emitToCustomer(updatedOrder, 'myOrderUpdated')

    return updatedOrder
  },

  // เดิม: getAdminOrders()
  adminList: async (query: AdminOrderQuery) => {
    const {
      status,
      date,
      startDate,
      endDate,
      fulfillment_type,
      search,
      sortOrder = 'oldest',
      limit = '10',
      page = '1',
    } = query

    const where: any = {}
    if (status) where.status = status
    if (date) where.pickupDate = date
    if (fulfillment_type) where.fulfillmentType = fulfillment_type
    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate), lte: new Date(endDate) }
    }
    if (search) {
      where.OR = [
        { shortRef: { contains: search, mode: 'insensitive' } },
        { deliveryInfo: { recipientName: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: orderInclude,
        orderBy: { createdAt: sortOrder === 'newest' ? 'desc' : 'asc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ])

    return {
      orders,
      totalOrders: total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    }
  },

  // เดิม: approveOrder() — ยืนยันสต็อกจริง (ย้าย reserved -> sold) แล้วเข้าสถานะ DELIVERING/READY_TO_PICKUP
  approve: async (orderId: string, adminUserId: string) => {
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } })
      if (!order) throw new Error('Order not found')
      if (order.status !== 'WAITING_FOR_VERIFICATION') {
        throw new Error('ออเดอร์นี้ไม่ได้อยู่ในสถานะรอตรวจสอบ')
      }

      for (const item of order.items) {
        await tx.dailyInventory.updateMany({
          where: { date: order.pickupDate, productId: item.productId },
          data: {
            reservedQty: { decrement: item.quantity },
            soldQty: { increment: item.quantity },
          },
        })
      }

      const nextStatus = order.fulfillmentType === 'DELIVERY' ? 'DELIVERING' : 'READY_TO_PICKUP'

      return tx.order.update({
        where: { id: orderId },
        data: { status: nextStatus, approvedAt: new Date(), approvedById: adminUserId },
        include: orderInclude,
      })
    })

    if (io) {
      io.to('admin_room').emit('orderUpdated', updatedOrder)
    }
    emitToCustomer(updatedOrder, 'myOrderUpdated')

    return updatedOrder
  },

  // เดิม: rejectOrder() — คืน reserved_qty แล้วยกเลิกออเดอร์
  reject: async (orderId: string, reason?: string) => {
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } })
      if (!order) throw new Error('Order not found')

      for (const item of order.items) {
        await tx.dailyInventory.updateMany({
          where: { date: order.pickupDate, productId: item.productId },
          data: { reservedQty: { decrement: item.quantity } },
        })
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED', note: reason || 'สลิปไม่ถูกต้อง / ยอดเงินไม่ครบ' },
        include: orderInclude,
      })
    })

    if (io) {
      io.to('admin_room').emit('orderUpdated', updatedOrder)
    }
    emitToCustomer(updatedOrder, 'myOrderUpdated')

    return updatedOrder
  },

  // เดิม: updateOrderStatus()
  updateStatus: async (orderId: string, status: string) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      throw new Error('Order not found')
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: orderInclude,
    })

    if (io) {
      io.to('admin_room').emit('orderUpdated', updatedOrder)
    }
    emitToCustomer(updatedOrder, 'myOrderUpdated')

    return updatedOrder
  },

  // ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — ลูกค้าเดิมไม่มีหน้า "ประวัติการสั่งซื้อ" เลย เพิ่ม endpoint สำหรับ list ออเดอร์ของตัวเอง
  myOrders: async (userId: string, query: { page?: string; limit?: string }) => {
    const pageNum = parseInt(query.page || '1')
    const limitNum = parseInt(query.limit || '10')
    const skip = (pageNum - 1) * limitNum

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: orderInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where: { userId } }),
    ])

    return { orders, totalOrders: total, totalPages: Math.ceil(total / limitNum), currentPage: pageNum }
  },

  // ฟีเจอร์ใหม่ (ไม่มีในต้นฉบับ) — ดึงออเดอร์เดี่ยว พร้อมกันสิทธิ์ (เจ้าของออเดอร์ หรือ admin เท่านั้น)
  getById: async (orderId: string, userId: string, isAdmin: boolean) => {
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: orderInclude })
    if (!order) {
      throw new Error('ไม่พบออเดอร์')
    }
    if (!isAdmin && order.userId !== userId) {
      throw new Error('ไม่มีสิทธิ์เข้าถึงออเดอร์นี้')
    }
    return order
  },
}
