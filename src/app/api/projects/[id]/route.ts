import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const doc = await adminDb.collection('projects').doc(params.id).get()
    
    if (!doc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const project = { id: doc.id, ...doc.data() }
    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    console.log('Updating project with data:', data)
    await adminDb.collection('projects').doc(params.id).update({ ...data, updatedAt: new Date() })
    const updatedDoc = await adminDb.collection('projects').doc(params.id).get()
    const project = { id: updatedDoc.id, ...updatedDoc.data() }
    console.log('Updated project:', project)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await adminDb.collection('projects').doc(params.id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
