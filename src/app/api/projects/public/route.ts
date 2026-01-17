import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('projects').get()
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    // Filter active projects and sort in JavaScript
    const activeProjects = projects
      .filter((project: any) => project.isActive !== false) // Show if isActive is true or undefined
      .sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt)
        const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })
    
    return NextResponse.json(activeProjects)
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
