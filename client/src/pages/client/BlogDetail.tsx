import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '@/components/client/Navbar'
import { useBlogStore } from '@/stores/blog.store'
import { Loader, ChevronLeft } from 'lucide-react'

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { currentPost, getPostBySlug, isLoading, isError } = useBlogStore()

  useEffect(() => {
    if (slug) getPostBySlug(slug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center py-24">
          <Loader className="animate-spin text-primary" size={36} />
        </div>
      </div>
    )
  }

  if (isError || !currentPost) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center text-stone-400">
          <p>ไม่พบบทความนี้</p>
          <Link to="/blogs" className="inline-block mt-4 text-primary font-bold hover:underline">
            กลับไปหน้าบทความ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/blogs" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-primary mb-4">
          <ChevronLeft size={16} /> บทความทั้งหมด
        </Link>

        <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-stone-100 mb-6">
          <img src={currentPost.coverImage} alt={currentPost.title} className="w-full h-full object-cover" />
        </div>

        <p className="text-xs text-stone-400 mb-2">{new Date(currentPost.publishedAt).toLocaleDateString('th-TH')}</p>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-dark mb-6">{currentPost.title}</h1>

        <div className="prose prose-stone max-w-none whitespace-pre-line text-stone-600 leading-relaxed">{currentPost.content}</div>
      </div>
    </div>
  )
}

export default BlogDetail
