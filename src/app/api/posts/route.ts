import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('posts')
      .orderBy('createdAt', 'desc')
      .get()
    
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Creating post with data:', data)
    const docRef = await adminDb.collection('posts').add({ ...data, createdAt: new Date() })
    const post = { id: docRef.id, ...data }
    console.log('Created post:', post)
    return NextResponse.json(post)
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
