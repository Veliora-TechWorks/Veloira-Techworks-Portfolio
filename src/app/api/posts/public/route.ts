import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  try {
    const snapshot = await adminDb.collection('posts')
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()
    
    const posts = snapshot.docs.map(doc => {
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
        createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt,
      }
    })
    
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
