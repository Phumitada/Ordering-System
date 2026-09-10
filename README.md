# Ordering System (TypeScript / PostgreSQL)

รีแฟคเตอร์จากโปรเจกต์ JavaScript + MongoDB ตัวเดิม (`Ordering_System`) มาเป็น TypeScript เต็มรูปแบบ
โดยยึด **โครงสร้างและ pattern เดียวกับ `Hotel-Booking-System`** (routes/controllers/services/validation/types แยกชั้นชัดเจน,
refresh-token auth, Prisma + PostgreSQL, docker-compose) — business logic เดิมทั้งหมดถูกย้ายมาโดยไม่มีอะไรหาย
ยกเว้นจุดที่ระบุไว้ด้านล่างว่าตั้งใจแก้/ปรับปรุง

## โครงสร้าง

```
Ordering-System/
├── client/     # React + TypeScript + Vite + Tailwind (UI style เดิมทุกจุด: สี, ฟอนต์ Prompt/Kanit)
├── server/     # Express + TypeScript + Prisma + PostgreSQL + Redis
└── docker-compose.yml   # Postgres + Redis (เหมือน Hotel-Booking-System)
```

## เริ่มใช้งาน

```bash
# 1. ขึ้น Postgres + Redis
docker compose up -d

# 2. Backend
cd server
cp .env.example .env      # แก้ DATABASE_URL, JWT secrets, Cloudinary keys ให้ครบ
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed               # สร้าง admin@example.com / Admin123! + หมวดหมู่/สินค้าตัวอย่าง
npm run dev                 # http://localhost:5000

# 3. Frontend
cd ../client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

> **หมายเหตุ:** ใน sandbox ที่ใช้ generate โปรเจกต์นี้ให้ ไม่สามารถรัน `npx prisma generate` ได้จริง
> เพราะ network ปิดไม่ให้ต่อ `binaries.prisma.sh` (ที่เก็บ engine binary ของ Prisma) — โค้ดฝั่ง TypeScript
> ผ่าน type-check ทั้งหมดแล้ว (ใช้ stub client ชั่วคราวตรวจสอบ) แต่ยังไม่เคยรัน `prisma generate` จริงกับ schema นี้
> รบกวนรันคำสั่งนี้เป็นขั้นตอนแรกบนเครื่อง/VPS ของ Ham เอง แล้วค่อยรัน `migrate dev`

## สิ่งที่เปลี่ยนจากของเดิม

| เดิม (JS + Mongo) | ใหม่ (TS + Postgres) |
|---|---|
| `backend/` `frontend/` | `server/` `client/` (ชื่อตาม Hotel-Booking-System) |
| Mongoose schema | Prisma schema (`server/prisma/schema.prisma`) — embedded array/object ทุกตัว (`addresses`, `order.items`, `order.payment`, `order.delivery_info`) แยกเป็นตารางความสัมพันธ์ปกติ |
| JWT เดี่ยวใน cookie อายุ 20 วัน | Access token (15 นาที, ส่งใน response body + header `Authorization`) + Refresh token (7 วัน, httpOnly cookie) + blacklist ผ่าน Redis ตอน rotate/logout |
| `_id` (ObjectId) | `id` (cuid) — field ทุกจุดใน frontend/backend เปลี่ยนตาม |
| `category_id`, `is_active`, `default_stock`, `total_price`, ... (snake_case) | `categoryId`, `isActive`, `defaultStock`, `totalPrice`, ... (camelCase ตาม Prisma convention) |
| express-mongo-sanitize / xss-clean / perfect-express-sanitizer | ตัดออก — ความเสี่ยง NoSQL-injection หมดไปเพราะ Prisma ใช้ parameterized query อยู่แล้ว (helmet + hpp + rate-limit ยังอยู่เหมือนเดิม) |

## ฟีเจอร์ใหม่ที่เพิ่มเข้ามา (ไม่มีในต้นฉบับเลย)

ต้นฉบับ build แต่ฝั่ง **Admin** เท่านั้น — ฝั่งลูกค้า (`pages/client/Home.jsx`) มีแค่ `<Navbar />` เปล่าๆ ทั้งที่ backend
มี API สั่งซื้อ/จ่ายเงินพร้อมอยู่แล้ว รอบนี้เติมให้ครบทั้งสองฝั่งจนใช้งานเป็นระบบสั่งซื้อได้จริง end-to-end:

**Backend**
- `Address` module ครบ (`GET/POST/PATCH/DELETE /api/addresses`) — เดิมมี field `addresses` ใน User schema แต่ไม่เคยมี route ใช้งานเลย
- `GET /api/order/my` — ประวัติคำสั่งซื้อของตัวเอง (เดิมไม่มี endpoint นี้เลย)
- `GET /api/order/:id` — ดูออเดอร์เดี่ยว พร้อมกันสิทธิ์ (เจ้าของออเดอร์ หรือ admin เท่านั้น)
- **แก้ช่องโหว่**: `confirmPayment` (แนบสลิป) เดิมไม่เช็คเจ้าของออเดอร์เลย — ลูกค้าคนอื่นที่ login อยู่แนบสลิปให้ order คนอื่นได้ถ้ารู้ id ตอนนี้เช็คแล้วว่า `order.userId === req.user.userId` ก่อนอนุญาต
- Socket.io: ลูกค้าที่ login เข้า room `user:{userId}` ของตัวเอง รับ event `myOrderUpdated` แบบ real-time ทุกครั้งที่สถานะออเดอร์เปลี่ยน (สร้าง/จ่ายเงิน/อนุมัติ/ปฏิเสธ/เปลี่ยนสถานะ) — ไม่ต้อง poll เอง

**Frontend**
- `/menu` — เลือกวันที่รับของ + filter หมวดหมู่/ค้นหา + เช็ค stock รายวันจริงก่อนกดสั่ง
- `/cart` — ตะกร้า (ผูกกับวันที่รับของ 1 วันเสมอ เพราะสต็อกเปิดแยกรายวัน — เปลี่ยนวันที่ = เตือนก่อนล้างตะกร้า)
- `/checkout` — เลือกรับที่ร้าน/จัดส่ง, เลือก/เพิ่มที่อยู่จัดส่ง, โน้ตถึงร้าน, ยิง `POST /order` จริง
- `/my-orders`, `/my-orders/:id` — ประวัติคำสั่งซื้อ + หน้ารายละเอียดที่มี **นับถอยหลัง 10 นาทีให้จ่ายเงิน**, อัปโหลดสลิป, และอัปเดตสถานะ **real-time ผ่าน socket** โดยไม่ต้อง refresh
- `/profile` — ดูข้อมูลบัญชี + จัดการที่อยู่จัดส่ง (เพิ่ม/ลบ)
- `RequireAuth` guard ใหม่ — ต่างจาก `ProtectedRoute` (admin-only เดิม) ใช้กับหน้าลูกค้าทั่วไปที่แค่ต้อง login

## บั๊ก/จุดที่ปรับแก้ระหว่างพอร์ต (ตั้งใจ ไม่ใช่พอร์ตผิด)

1. **`orderUpdated` socket event** — เดิม frontend (`useOrderStore.js`) มี listener ดักฟัง event นี้ไว้แล้ว แต่ backend เดิมไม่เคย `emit` เลยสักจุด (approve/reject/updateStatus ไม่ได้ยิง event) ตอนนี้ยิงครบทั้ง 3 จุดแล้ว
2. **`updateUserRole` / `deleteUser`** — มี controller function อยู่แล้วในไฟล์เดิมแต่ไม่เคยถูกผูก route เลย เพิ่ม route ให้ใช้งานได้จริงที่ `PATCH /api/users/:id/role` และ `DELETE /api/users/:id`
3. **Dashboard stats** — เดิมเช็ค `status === 'PAID'` ร่วมกับ `COMPLETED` แต่ enum จริงไม่มีสถานะ `PAID` อยู่เลย (dead code) — ตัดทิ้ง เหลือเช็คแค่ `COMPLETED`
4. **ปุ่ม "ดูทั้งหมด" ใน Dashboard** — เดิมไม่มี `onClick` เลย (กดไม่ได้) ตอนนี้พาไปหน้า Approve Orders
5. **ลบสินค้าที่มีออเดอร์ค้างอยู่** — Mongo เดิมไม่มี referential integrity เลยลบสินค้าที่ถูกสั่งซื้อไปแล้วได้เฉยๆ (ทำให้ order เก่าข้อมูลขาด) ตอนนี้ Postgres FK จะกันไว้ (ลบไม่ได้ถ้ามี order อ้างถึงอยู่) — เป็นการปรับปรุงด้าน data-integrity ไม่ใช่ regression

## UI/UX

Client ยังคงสไตล์เดิมทุกจุดตามที่ขอ: สี primary `#A4161A` / secondary `#FBC02D` / dark `#374151`,
ฟอนต์ Prompt (body) + Kanit (heading), zustand + Tailwind + lucide-react + react-hot-toast + socket.io-client เหมือนเดิม
หน้า/component ที่พอร์ตมาครบ: Login/Register (split-screen), Admin Dashboard, Products (list + add + edit),
Category (+ ย้ายสินค้าข้ามหมวด), Daily Inventory, Orders (Approve / Active/Kitchen), Customers

หน้า client-facing (หน้าร้านลูกค้าเต็มรูปแบบ) เดิมก็เป็นแค่ placeholder อยู่แล้ว (`pages/client/Home.jsx` มี Navbar ตัวเดียว)
เลยคงสภาพเดิมไว้ — โฟกัสหลักคือฝั่ง Admin ที่มี business logic ครบ ตามจุดประสงค์ที่จะใช้ทดสอบระบบ PaaS

## Auth flow (refresh token)

```
Login/Register → accessToken (15m, เก็บใน zustand + localStorage) + refreshToken (7d, httpOnly cookie)
ทุก request แนบ accessToken เป็น Bearer header อัตโนมัติ (api/client.ts)
เมื่อ accessToken หมดอายุ → 401 → interceptor เรียก POST /auth/refresh (ใช้ cookie) → ได้ accessToken ใหม่ → retry request เดิมอัตโนมัติ
Logout → refreshToken เดิมถูก blacklist ใน Redis
```
testing for webhook