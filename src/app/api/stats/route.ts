import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const [projectsSnapshot, articlesSnapshot, servicesSnapshot] = await Promise.all([
      adminDb.collection('projects').where('isActive', '==', true).get(),
      adminDb.collection('posts').where('isPublished', '==', true).get(),
      adminDb.collection('services').where('isActive', '==', true).get()
    ])

    return NextResponse.json({
      projects: projectsSnapshot.size,
      articles: articlesSnapshot.size,
      services: servicesSnapshot.size
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
