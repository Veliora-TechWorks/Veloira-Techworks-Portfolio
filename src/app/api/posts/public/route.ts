import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const revalidate = 300

export async function GET() {
  try {
    let snapshot
    
    try {
      snapshot = await adminDb.collection('posts')
        .where('isPublished', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get()
    } catch (indexError: any) {
      if (indexError.code === 9 || indexError.message?.includes('index')) {
        snapshot = await adminDb.collection('posts').get()
      } else {
        throw indexError
      }
    }
    
    const posts = snapshot.docs
      .map(doc => {
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
      .filter(post => post.isPublished === true)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50)
    
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
