'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import { Upload, Search, Image as ImageIcon, Trash2, Edit, Copy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinary'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface Media {
  id: string
  filename: string
  originalName: string
  url: string
  category: string | null
  size: number
  createdAt: string
}

export default function MediaPage() {
  const [uploading, setUploading] = useState(false)
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState('')

  const categories = ['all', 'hero', 'about', 'portfolio', 'blog', 'team', 'culture', 'general']

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media')
      const data = await res.json()
      console.log('Fetched media:', data)
      setMedia(data)
    } catch (error) {
      console.error('Fetch media error:', error)
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (selectedCategory === 'all') {
      toast.error('Please select a specific category first')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', selectedCategory)

      console.log('Uploading to category:', selectedCategory)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const result = await res.json()
      console.log('Upload result:', result)
      
      // Add the new media to state immediately
      setMedia(prev => [...prev, result])
      
      toast.success(`File uploaded to ${selectedCategory} category!`)
      await fetchMedia()
      // Reset file input
      e.target.value = ''
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return

    try {
      await fetch(`/api/media/${id}`, { method: 'DELETE' })
      toast.success('File deleted')
      fetchMedia()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  const handleUpdateCategory = async (id: string, category: string) => {
    try {
      await fetch(`/api/media/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      })
      toast.success('Category updated')
      setEditingId(null)
      fetchMedia()
    } catch (error) {
      toast.error('Update failed')
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied!')
  }

  const filteredMedia = selectedCategory === 'all' 
    ? media 
    : media.filter(m => m.category === selectedCategory)

  // Debug logging
  useEffect(() => {
    console.log('Media data:', media)
    console.log('Selected category:', selectedCategory)
    console.log('Filtered media:', filteredMedia)
  }, [media, selectedCategory, filteredMedia])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-600 mt-2">Manage website images</p>
            {selectedCategory !== 'all' && (
              <p className="text-sm text-primary-500 mt-1">Uploading to: {selectedCategory}</p>
            )}
          </div>
          <label className={`btn-primary flex items-center space-x-2 cursor-pointer ${
            selectedCategory === 'all' ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            <Upload className="w-5 h-5" />
            <span>{uploading ? 'Uploading...' : 'Upload'}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading || selectedCategory === 'all'}
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat} {cat !== 'all' && selectedCategory === cat && '(Upload here)'}
            </button>
          ))}
        </div>

        {selectedCategory === 'all' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              📌 Select a specific category above to upload images to that category
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Total images: {media.length} | Filtered: {filteredMedia.length} | Selected: {selectedCategory}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No images in {selectedCategory} category
                </div>
              ) : (
                filteredMedia.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                    <div className="aspect-square relative bg-gray-100">
                      <Image
                        src={item.url}
                        alt={item.originalName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.originalName}</p>
                      {editingId === item.id ? (
                        <div className="flex gap-1 mt-1">
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="text-xs flex-1 border rounded px-2 py-1"
                          >
                            {categories.filter(c => c !== 'all').map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdateCategory(item.id, editCategory)}
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">{item.category || 'general'}</p>
                      )}
                      <div className="flex gap-1 mt-2">
                        <button
                          onClick={() => {
                            setEditingId(item.id)
                            setEditCategory(item.category || 'general')
                          }}
                          className="flex-1 p-1.5 text-blue-600 hover:bg-blue-50 rounded text-xs"
                        >
                          <Edit className="w-3 h-3 mx-auto" />
                        </button>
                        <button
                          onClick={() => copyUrl(item.url)}
                          className="flex-1 p-1.5 text-green-600 hover:bg-green-50 rounded text-xs"
                        >
                          <Copy className="w-3 h-3 mx-auto" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 p-1.5 text-red-600 hover:bg-red-50 rounded text-xs"
                        >
                          <Trash2 className="w-3 h-3 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}