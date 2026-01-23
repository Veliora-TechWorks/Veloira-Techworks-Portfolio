import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('posts')
      .get()
    
    const posts = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        // Convert Firebase Timestamp to serializable format
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
      }
    })
    
    // Sort by createdAt in JavaScript
    posts.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate document size to prevent Firestore limit issues
    const dataSize = JSON.stringify(data).length
    if (dataSize > 900000) { // 900KB limit to stay under 1MB
      return NextResponse.json({ 
        error: 'Document too large. Please use external image URLs instead of base64 data.' 
      }, { status: 400 })
    }
    
    console.log('Creating post with data size:', dataSize, 'bytes')
    const docRef = await adminDb.collection('posts').add({ ...data, createdAt: new Date() })
    const post = { id: docRef.id, ...data }
    return NextResponse.json(post)
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
