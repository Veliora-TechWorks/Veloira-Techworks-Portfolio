import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    console.log('Fetching public posts...')
    
    // Get all posts first, then filter in JavaScript for better debugging
    const snapshot = await adminDb.collection('posts').get()
    
    console.log(`Found ${snapshot.docs.length} total posts in database`)
    
    const allPosts = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        // Convert Firebase Timestamp to serializable format
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
      }
    })
    
    // Filter published posts
    const publishedPosts = allPosts.filter((post: any) => {
      console.log(`Post "${post.title}": isPublished = ${post.isPublished}`)
      return post.isPublished === true
    })
    
    console.log(`Found ${publishedPosts.length} published posts`)
    
    // Sort by createdAt in JavaScript
    publishedPosts.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
    
    return NextResponse.json(publishedPosts)
  } catch (error) {
    console.error('Posts public API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
