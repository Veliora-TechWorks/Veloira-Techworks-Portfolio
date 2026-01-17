import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('services').get()
    const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    // Sort by order field, fallback to createdAt
    services.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    return NextResponse.json(services)
  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    // Add required fields
    const serviceData = {
      ...data,
      createdAt: new Date(),
      order: Date.now() // Simple ordering by creation time
    }
    const docRef = await adminDb.collection('services').add(serviceData)
    return NextResponse.json({ id: docRef.id, ...serviceData })
  } catch (error) {
    console.error('Create service error:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}
