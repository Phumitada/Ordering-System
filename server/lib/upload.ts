import multer from 'multer'

// เก็บไฟล์ใน memory แล้วค่อยแปลงเป็น base64 ส่งขึ้น Cloudinary
// (พฤติกรรมเดิมจากโปรเจกต์ JS — ไม่เปลี่ยน เพราะทำงานได้ดีอยู่แล้ว)
const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})
