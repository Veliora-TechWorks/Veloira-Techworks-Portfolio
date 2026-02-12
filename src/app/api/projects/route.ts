import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const snapshot = await adminDb.collection('projects')
      .where('isActive', '!=', false)
      .orderBy('isActive')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()
      
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    return NextResponse.json(projects, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' }
    })
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
