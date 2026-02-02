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
    console.log('Environment check:', {
      cloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: !!process.env.CLOUDINARY_API_KEY,
      apiSecret: !!process.env.CLOUDINARY_API_SECRET
    })
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string || 'general'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    console.log(`Processing ${files.length} files for category: ${category}`)

    // Check Cloudinary configuration
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    console.log('Cloudinary config values:', {
      cloudName: cloudName?.substring(0, 5) + '...',
      apiKey: apiKey?.substring(0, 5) + '...',
      apiSecret: apiSecret ? 'present' : 'missing'
    })
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Cloudinary configuration missing:', {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret
      })
      return NextResponse.json({ 
        error: 'Upload service not configured',
        details: 'Missing Cloudinary credentials',
        config: {
          cloudName: !!cloudName,
          apiKey: !!apiKey,
          apiSecret: !!apiSecret
        }
      }, { status: 500 })
    }
    
    const uploadPromises = files.map(async (file, index) => {
      try {
        console.log(`Processing file ${index + 1}/${files.length}: ${file.name}`)
        
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result: any = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: 'veliora-techworks',
              resource_type: 'auto',
              quality: 'auto:good',
              timeout: 60000 // 60 second timeout
            },
            (error, result) => {
              if (error) {
                console.error(`Cloudinary upload error for ${file.name}:`, error)
                reject(new Error(`Cloudinary error: ${error.message}`))
              } else {
                console.log(`Cloudinary upload success for ${file.name}:`, result?.public_id)
                resolve(result)
              }
            }
          )
          uploadStream.end(buffer)
        })

        // Save to Firestore
        const docRef = await adminDb.collection('media').add({
          filename: result.public_id,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url: result.secure_url,
          category: category,
          type: file.type,
          uploadMethod: 'cloudinary',
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
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError)
        throw new Error(`Failed to upload ${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`)
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)
    console.log(`Successfully uploaded ${uploadedFiles.length} files via Cloudinary`)
    
    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      count: uploadedFiles.length,
      method: 'cloudinary'
    }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}