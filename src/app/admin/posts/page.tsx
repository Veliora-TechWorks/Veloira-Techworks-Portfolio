'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    image: '',
    publishedAt: '',
    linkedinUrl: '',
    isPublished: true
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      console.log('Fetched posts:', data)
      setPosts(data)
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Get or create default author
      let authorId = localStorage.getItem('authorId')
      
      if (!authorId) {
        const usersRes = await fetch('/api/users')
        const users = await usersRes.json()
        if (users.length > 0) {
          authorId = users[0].id
          if (authorId) {
            localStorage.setItem('authorId', authorId)
          }
        }
      }

      const payload = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: formData.excerpt,
        content: formData.excerpt,
        category: 'Article',
        image: formData.image,
        tags: [formData.linkedinUrl],
        readTime: 5,
        isPublished: formData.isPublished,
        authorId: authorId || 'default-author-id',
        createdAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : new Date().toISOString()
      }

      console.log('Submitting payload:', payload)

      if (editingPost) {
        const res = await fetch(`/api/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const result = await res.json()
        console.log('Update result:', result)
        toast.success('Article updated')
      } else {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const result = await res.json()
        console.log('Create result:', result)
        if (!res.ok) {
          throw new Error(result.error || 'Failed to create')
        }
        toast.success('Article created')
      }
      setShowModal(false)
      setEditingPost(null)
      resetForm()
      fetchPosts()
    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(error.message || 'Operation failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      toast.success('Post deleted')
      fetchPosts()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const handleEdit = (post: any) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      image: post.image || '',
      publishedAt: post.createdAt?.split('T')[0] || '',
      linkedinUrl: post.tags?.[0] || '',
      isPublished: post.isPublished
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      image: '',
      publishedAt: '',
      linkedinUrl: '',
      isPublished: true
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'blog')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Upload failed')

      const result = await res.json()
      setFormData(prev => ({ ...prev, image: result.url }))
      toast.success('Image uploaded')
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Articles</h1>
            <p className="text-gray-600 mt-2">Manage blog articles</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true) }} className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Article</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEdit(post)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">{editingPost ? 'Edit Article' : 'New Article'}</h2>
                <button onClick={() => { setShowModal(false); setEditingPost(null) }} className="p-2 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  required
                />
                <input
                  type="date"
                  placeholder="Publish Date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <label className="btn-outline px-4 py-2 cursor-pointer flex items-center">
                      {uploading ? 'Uploading...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="mt-2 h-32 w-auto rounded-lg" />
                  )}
                </div>
                <input
                  type="url"
                  placeholder="LinkedIn Article URL"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  <span>Published</span>
                </label>
                <button type="submit" className="btn-primary w-full">
                  {editingPost ? 'Update' : 'Create'} Article
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
