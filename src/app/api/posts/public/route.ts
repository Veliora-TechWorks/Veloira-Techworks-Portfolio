import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('posts')
      .where('isPublished', '==', true)
      .get()
    
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    // Sort by createdAt in JavaScript instead of Firestore
    posts.sort((a: any, b: any) => {
      const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt)
      const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
