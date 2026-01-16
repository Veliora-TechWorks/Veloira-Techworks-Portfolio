import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [projectsCount, articlesCount, servicesCount] = await Promise.all([
      prisma.project.count({ where: { isActive: true } }),
      prisma.post.count({ where: { isPublished: true } }),
      prisma.service.count({ where: { isActive: true } })
    ])

    return NextResponse.json({
      projects: projectsCount,
      articles: articlesCount,
      services: servicesCount
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
