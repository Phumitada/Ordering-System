import cloudinary from '../config/cloudinary'

// เดิมกระจายอยู่ใน product.js และ order.js (แปลง buffer -> base64 -> upload) — รวมเป็น helper เดียว
export const uploadBufferToCloudinary = async (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  const b64 = Buffer.from(file.buffer).toString('base64')
  const dataURI = 'data:' + file.mimetype + ';base64,' + b64
  const result = await cloudinary.uploader.upload(dataURI, { folder })
  return result.secure_url
}

// เดิม: getPublicIdFromUrl() ใน product.js
export const getPublicIdFromUrl = (url: string | null | undefined, folder: string): string | null => {
  if (!url) return null
  const splitUrl = url.split('/')
  const filename = splitUrl[splitUrl.length - 1]
  return `${folder}/` + filename.split('.')[0]
}

export const destroyCloudinaryAsset = async (publicId: string | null) => {
  if (!publicId) return
  await cloudinary.uploader.destroy(publicId)
}
