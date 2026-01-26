import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { adminDb } from '@/lib/firebase-admin'
import { getStorage } from 'firebase-admin/storage'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received')
    
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = formData.get('category') as string || 'general'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    console.log(`Processing ${files.length} files for category: ${category}`)

    // Check if Cloudinary is configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    console.log('Environment check:', {
      cloudName: !!cloudName,
      apiKey: !!apiKey,
      apiSecret: !!apiSecret,
      nodeEnv: process.env.NODE_ENV
    })
    
    // Try Cloudinary first, fallback to Firebase if it fails
    if (cloudName && apiKey && apiSecret) {
      try {
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
                  reject(new Error(`Cloudinary error: ${error.message}`))
                } else {
                  console.log('Cloudinary upload success:', result?.public_id)
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
        })

        const uploadedFiles = await Promise.all(uploadPromises)
        console.log(`Successfully uploaded ${uploadedFiles.length} files via Cloudinary`)
        
        return NextResponse.json({ 
          success: true, 
          files: uploadedFiles,
          count: uploadedFiles.length,
          method: 'cloudinary'
        }, { status: 200 })
      } catch (cloudinaryError) {
        console.error('Cloudinary failed, trying Firebase:', cloudinaryError)
        // Fall through to Firebase upload
      }
    }

    // Firebase Storage fallback
    console.log('Using Firebase Storage for upload')
    const bucket = getStorage().bucket()
    
    const uploadPromises = files.map(async (file) => {
      try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Generate unique filename
        const timestamp = Date.now()
        const filename = `${category}/${timestamp}-${file.name}`
        
        // Upload to Firebase Storage
        const fileRef = bucket.file(filename)
        await fileRef.save(buffer, {
          metadata: {
            contentType: file.type,
          },
        })
        
        // Make file publicly accessible
        await fileRef.makePublic()
        
        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

        // Save to Firestore
        const docRef = await adminDb.collection('media').add({
          filename: filename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url: publicUrl,
          category: category,
          type: file.type,
          uploadMethod: 'firebase',
          createdAt: new Date()
        })

        return { 
          id: docRef.id, 
          filename: filename, 
          originalName: file.name, 
          mimeType: file.type, 
          size: file.size, 
          url: publicUrl, 
          category: category,
          type: file.type,
          createdAt: new Date()
        }
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError)
        throw fileError
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)
    console.log(`Successfully uploaded ${uploadedFiles.length} files via Firebase`)
    
    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      count: uploadedFiles.length,
      method: 'firebase'
    }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}