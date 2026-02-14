import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

function getDirectorySize(dirPath: string): number {
  let size = 0
  try {
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath)
      for (const file of files) {
        const filePath = path.join(dirPath, file)
        const stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
          size += getDirectorySize(filePath)
        } else {
          size += stats.size
        }
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error)
  }
  return size
}

export async function GET() {
  try {
    const nextCachePath = path.join(process.cwd(), '.next', 'cache')
    const cacheSize = getDirectorySize(nextCachePath)
    const cacheSizeMB = (cacheSize / (1024 * 1024)).toFixed(2)
    
    return NextResponse.json({ 
      size: cacheSize,
      sizeMB: cacheSizeMB,
      warning: parseFloat(cacheSizeMB) > 100
    })
  } catch (error) {
    return NextResponse.json({ 
      size: 0,
      sizeMB: '0',
      warning: false
    })
  }
}

export async function POST() {
  try {
    revalidatePath('/', 'layout')
    revalidatePath('/blog')
    revalidatePath('/portfolio')
    revalidatePath('/services')
    revalidatePath('/about')
    revalidatePath('/contact')
    revalidatePath('/api/posts/public')
    revalidatePath('/api/projects/public')
    revalidatePath('/api/services')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully'
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to clear cache' 
    }, { status: 500 })
  }
}
