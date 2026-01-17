import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    const snapshot = await adminDb.collection('media')
      .where('category', '==', params.category)
      .orderBy('createdAt', 'desc')
      .get()
    
    const media = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}
