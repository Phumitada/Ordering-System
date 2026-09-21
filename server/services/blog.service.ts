import { prisma } from '../db/prisma'
import { destroyCloudinaryAsset, getPublicIdFromUrl, uploadBufferToCloudinary } from '../lib/cloudinaryUpload'
import type { CreateBlogPayload, UpdateBlogPayload } from '../types/blog.type'

const BLOG_FOLDER = 'blogs'

const slugify = (title: string) => {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
  return (base || 'post') + '-' + Date.now().toString(36)
}

export const blogService = {
  listPublished: async () => {
    return prisma.blogPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' } })
  },

  listAll: async () => {
    return prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  },

  getBySlug: async (slug: string) => {
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (!post || !post.isPublished) {
      throw new Error('ไม่พบบทความนี้')
    }
    return post
  },

  getById: async (id: string) => {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) {
      throw new Error('ไม่พบบทความนี้')
    }
    return post
  },

  create: async (body: CreateBlogPayload, file?: Express.Multer.File) => {
    if (!file) {
      throw new Error('กรุณาอัปโหลดรูปปกบทความ')
    }
    const coverImage = await uploadBufferToCloudinary(file, BLOG_FOLDER)

    return prisma.blogPost.create({
      data: {
        title: body.title,
        slug: slugify(body.title),
        excerpt: body.excerpt ?? '',
        content: body.content,
        isPublished: body.is_published ?? true,
        coverImage,
      },
    })
  },

  update: async (id: string, body: UpdateBlogPayload, file?: Express.Multer.File) => {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) {
      throw new Error('ไม่พบบทความนี้')
    }

    let coverImage = post.coverImage
    if (file) {
      const oldPublicId = getPublicIdFromUrl(post.coverImage, BLOG_FOLDER)
      await destroyCloudinaryAsset(oldPublicId)
      coverImage = await uploadBufferToCloudinary(file, BLOG_FOLDER)
    }

    return prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title ?? post.title,
        excerpt: body.excerpt ?? post.excerpt,
        content: body.content ?? post.content,
        isPublished: body.is_published ?? post.isPublished,
        coverImage,
      },
    })
  },

  remove: async (id: string) => {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) {
      throw new Error('ไม่พบบทความนี้')
    }
    const publicId = getPublicIdFromUrl(post.coverImage, BLOG_FOLDER)
    await destroyCloudinaryAsset(publicId)
    await prisma.blogPost.delete({ where: { id } })
  },
}
