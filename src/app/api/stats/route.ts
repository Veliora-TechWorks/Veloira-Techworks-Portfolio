import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const [projectsCount, postsCount, servicesCount, contactsCount, teamCount, jobsCount] = await Promise.all([
      adminDb.collection('projects').where('isActive', '!=', false).count().get(),
      adminDb.collection('posts').count().get(),
      adminDb.collection('services').where('isActive', '!=', false).count().get(),
      adminDb.collection('contacts').count().get(),
      adminDb.collection('team').count().get(),
      adminDb.collection('jobs').count().get()
    ])

    return NextResponse.json({
      projects: projectsCount.data().count,
      posts: postsCount.data().count,
      articles: postsCount.data().count,
      services: servicesCount.data().count,
      contacts: contactsCount.data().count,
      teamMembers: teamCount.data().count,
      jobs: jobsCount.data().count
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
