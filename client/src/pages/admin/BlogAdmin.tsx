import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Newspaper, Loader } from 'lucide-react'
import { useBlogStore } from '@/stores/blog.store'
import BlogModal from '@/components/admin/BlogModal'
import type { BlogPost } from '@/types/blog.type'

const BlogAdmin = () => {
  const { posts, getAdminPosts, deletePost, isLoading } = useBlogStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    getAdminPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAdd = () => {
    setEditingPost(null)
    setIsModalOpen(true)
  }
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setIsModalOpen(true)
  }
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`คุณแน่ใจว่าจะลบบทความ "${title}"?`)) {
      await deletePost(id)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark flex items-center gap-3">
            <Newspaper className="text-primary" size={32} />
            จัดการบทความ
          </h1>
          <p className="text-stone-400 text-sm mt-1">มีทั้งหมด {posts.length} บทความ</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={20} />
          เขียนบทความ
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader className="animate-spin mx-auto text-primary mb-3" size={36} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden group">
              <div className="relative aspect-[16/9] bg-stone-100">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                {!post.isPublished && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white/90 text-stone-700 text-xs font-bold px-3 py-1 rounded-full">ฉบับร่าง</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-dark mb-1 line-clamp-1">{post.title}</h3>
                <p className="text-xs text-stone-400 line-clamp-2 mb-3">{post.excerpt || 'ไม่มีคำโปรย'}</p>
                <p className="text-[11px] text-stone-300 mb-4">{new Date(post.publishedAt).toLocaleDateString('th-TH')}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-stone-50">
                  <button
                    onClick={() => handleEdit(post)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-50 text-stone-600 font-bold text-sm hover:bg-primary-light hover:text-primary transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} /> แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="w-10 h-10 rounded-xl bg-stone-50 text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full py-12 text-center text-stone-400 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
              <Newspaper size={48} className="mx-auto mb-3 opacity-20" />
              <p>ยังไม่มีบทความ</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && <BlogModal post={editingPost} onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default BlogAdmin
