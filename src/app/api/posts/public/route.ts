import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const revalidate = 300 // Revalidate every 5 minutes

export async function GET() {
  try {
    const snapshot = await adminDb.collection('posts').get()
    
    const allPosts = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        image: data.image,
        author: data.author,
        readTime: data.readTime,
        tags: data.tags,
        isPublished: data.isPublished,
        createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt,
      }
    })
    
    const posts = allPosts
      .filter(post => post.isPublished === true || post.isPublished === 'true')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json(posts, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' }
    })
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
