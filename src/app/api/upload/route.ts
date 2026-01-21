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
    console.log('Upload request received')
    
    // Check if Cloudinary is configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ 
        error: 'Upload service not configured',
        details: 'Missing Cloudinary environment variables'
      }, { status: 500 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string || 'general'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    console.log(`Processing ${files.length} files for category: ${category}`)

    const uploadPromises = files.map(async (file) => {
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

      return { 
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
    })

    const uploadedFiles = await Promise.all(uploadPromises)
    console.log(`Successfully uploaded ${uploadedFiles.length} files`)
    
    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      count: uploadedFiles.length 
    }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}