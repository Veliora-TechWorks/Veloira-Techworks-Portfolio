import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { adminDb } from '@/lib/firebase-admin'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary configuration missing')
      return NextResponse.json({ error: 'Upload service not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: 'veliora-techworks',
          resource_type: 'auto',
          quality: 'auto:good'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(error)
          } else {
            resolve(result)
          }
        }
      ).end(buffer)
    })

    const docRef = await adminDb.collection('media').add({
      filename: result.public_id,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: result.secure_url,
      category: category,
      type: file.type,
      createdAt: new Date()
    })

    const media = { 
      id: docRef.id, 
      filename: result.public_id, 
      originalName: file.name, 
      mimeType: file.type, 
      size: file.size, 
      url: result.secure_url, 
      category: category,
      type: file.type,
      createdAt: new Date()
    }

    return NextResponse.json(media, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}