import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('projects').get()
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    // Sort by createdAt in JavaScript
    projects.sort((a: any, b: any) => {
      const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt)
      const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate document size to prevent Firestore limit issues
    const dataSize = JSON.stringify(data).length
    if (dataSize > 900000) { // 900KB limit to stay under 1MB
      return NextResponse.json({ 
        error: 'Document too large. Please reduce image data or use external URLs.' 
      }, { status: 400 })
    }
    
    console.log('Creating project with data size:', dataSize, 'bytes')
    const projectData = {
      ...data,
      createdAt: new Date(),
      order: Date.now(),
      isActive: data.isActive !== false // Default to true if not specified
    }
    const docRef = await adminDb.collection('projects').add(projectData)
    const project = { id: docRef.id, ...projectData }
    return NextResponse.json(project)
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
