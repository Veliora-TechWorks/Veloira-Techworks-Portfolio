import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const [projectsSnapshot, postsSnapshot, servicesSnapshot, contactsSnapshot, teamSnapshot, jobsSnapshot] = await Promise.all([
      adminDb.collection('projects').get(),
      adminDb.collection('posts').get(),
      adminDb.collection('services').get(),
      adminDb.collection('contacts').get(),
      adminDb.collection('team').get(),
      adminDb.collection('jobs').get()
    ])

    // Filter active projects only
    const activeProjects = projectsSnapshot.docs.filter(doc => {
      const data = doc.data()
      return data.isActive !== false
    })

    return NextResponse.json({
      projects: activeProjects.length,
      posts: postsSnapshot.size,
      articles: postsSnapshot.size,
      services: servicesSnapshot.size,
      contacts: contactsSnapshot.size,
      teamMembers: teamSnapshot.size,
      jobs: jobsSnapshot.size
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
