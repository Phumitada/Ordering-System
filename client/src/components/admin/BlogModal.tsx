import { useState, useEffect } from 'react'
import { X, Save, Upload, Loader, Newspaper } from 'lucide-react'
import { useBlogStore } from '@/stores/blog.store'
import type { BlogPost } from '@/types/blog.type'

interface BlogModalProps {
  post: BlogPost | null
  onClose: () => void
}

const BlogModal = ({ post, onClose }: BlogModalProps) => {
  const { addPost, editPost, isLoading } = useBlogStore()

  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', is_published: true })
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        is_published: post.isPublished,
      })
      setImagePreview(post.coverImage)
    }
  }, [post])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) return
    if (!post && !imageFile) return

    const data = new FormData()
    data.append('title', formData.title)
    data.append('excerpt', formData.excerpt)
    data.append('content', formData.content)
    data.append('is_published', String(formData.is_published))
    if (imageFile) data.append('cover', imageFile)

    const success = post ? await editPost(post.id, data) : await addPost(data)
    if (success) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark flex items-center gap-2">
            <Newspaper className="text-primary" size={22} />
            {post ? 'แก้ไขบทความ' : 'เขียนบทความใหม่'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-stone-200 group bg-stone-50">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <Upload size={28} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
              <Upload className="text-white mb-2" size={24} />
              <span className="text-white text-xs font-bold">อัปโหลดรูปปก</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">หัวข้อบทความ</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="เช่น เคล็ดลับเลือกเค้กวันเกิด"
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">คำโปรย (แสดงในหน้ารายการ)</label>
            <textarea
              name="excerpt"
              rows={2}
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-dark uppercase tracking-wider mb-1 block">เนื้อหาบทความ</label>
            <textarea
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleChange}
              className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
            <input
              type="checkbox"
              name="is_published"
              id="blog-published"
              checked={formData.is_published}
              onChange={handleChange}
              className="w-5 h-5 accent-primary rounded cursor-pointer"
            />
            <label htmlFor="blog-published" className="text-sm font-bold text-stone-600 cursor-pointer select-none">
              เผยแพร่ (แสดงในหน้าบทความของลูกค้า)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-500 font-bold hover:bg-stone-200 transition-colors">
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BlogModal
