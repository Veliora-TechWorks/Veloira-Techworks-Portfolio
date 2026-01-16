import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } }
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
