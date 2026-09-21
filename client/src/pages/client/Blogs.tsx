import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/client/Navbar'
import { useBlogStore } from '@/stores/blog.store'
import { Loader, Newspaper, ArrowRight } from 'lucide-react'

const Blogs = () => {
  const { posts, getPosts, isLoading } = useBlogStore()

  useEffect(() => {
    getPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark">บทความ</h1>
          <p className="text-stone-400 text-sm mt-1">เรื่องราว เคล็ดลับ และข่าวสารจากร้านของเรา</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-primary" size={36} />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blogs/${post.slug}`}
                className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col"
              >
                <div className="aspect-[16/9] bg-stone-100 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-[11px] text-stone-400 mb-1.5">{new Date(post.publishedAt).toLocaleDateString('th-TH')}</p>
                  <h3 className="font-bold text-dark mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-stone-500 line-clamp-2 mb-3">{post.excerpt}</p>}
                  <span className="mt-auto inline-flex items-center gap-1.5 text-primary text-sm font-bold">
                    อ่านต่อ <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
            <Newspaper size={48} className="text-stone-300 mb-3" />
            <p className="text-stone-400 font-medium">ยังไม่มีบทความในตอนนี้</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blogs
