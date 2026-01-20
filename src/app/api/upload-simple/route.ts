import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    console.log('Simple upload started')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'general'

    console.log('File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    })

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64 for simple storage
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    console.log('Saving to Firebase...')
    
    const docRef = await adminDb.collection('media').add({
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: dataUrl,
      category: category,
      type: file.type,
      createdAt: new Date()
    })

    const media = { 
      id: docRef.id, 
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: dataUrl,
      category: category,
      type: file.type,
      createdAt: new Date()
    }

    console.log('Upload successful:', docRef.id)
    return NextResponse.json(media, { status: 200 })
  } catch (error) {
    console.error('Simple upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Upload processing failed'
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: errorMessage,
      message: errorMessage
    }, { status: 500 })
  }
}