import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

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

    return NextResponse.json({
      projects: projectsSnapshot.size,
      posts: postsSnapshot.size,
      articles: postsSnapshot.size,
      services: servicesSnapshot.size,
      contacts: contactsSnapshot.size,
      teamMembers: teamSnapshot.size,
      jobs: jobsSnapshot.size
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
