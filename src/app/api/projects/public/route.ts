import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } }
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
