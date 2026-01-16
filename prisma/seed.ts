import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123')
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@veliora-techworks.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@veliora-techworks.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log(`👤 Admin user: ${admin.email}`)

  // Create services
  const services = [
    {
      title: 'Application Development',
      description: 'Custom software applications built with cutting-edge technologies and best practices.',
      icon: 'Code',
      features: ['Custom Software', 'Enterprise Apps', 'API Development', 'System Integration'],
      price: 'Starting at $5,000',
      order: 1,
    },
    {
      title: 'Web Development',
      description: 'Modern, responsive websites and web applications that deliver exceptional user experiences.',
      icon: 'Globe',
      features: ['React/Next.js', 'E-commerce', 'CMS Solutions', 'Progressive Web Apps'],
      price: 'Starting at $3,000',
      order: 2,
    },
    {
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
      icon: 'Smartphone',
      features: ['iOS Development', 'Android Development', 'React Native', 'Flutter'],
      price: 'Starting at $8,000',
      order: 3,
    },
    {
      title: 'SaaS Solutions',
      description: 'Scalable Software-as-a-Service platforms designed for growth and efficiency.',
      icon: 'Cloud',
      features: ['Multi-tenant Architecture', 'Subscription Management', 'Analytics Dashboard', 'API Integration'],
      price: 'Starting at $15,000',
      order: 4,
    },
    {
      title: 'Database Solutions',
      description: 'Robust database design, optimization, and management for your critical data.',
      icon: 'Database',
      features: ['Database Design', 'Performance Optimization', 'Data Migration', 'Backup Solutions'],
      price: 'Starting at $2,500',
      order: 5,
    },
    {
      title: 'Software Testing',
      description: 'Comprehensive testing services to ensure your software is reliable and secure.',
      icon: 'Shield',
      features: ['Automated Testing', 'Performance Testing', 'Security Testing', 'Quality Assurance'],
      price: 'Starting at $1,500',
      order: 6,
    },
  ]

  for (const service of services) {
    await prisma.service.create({
      data: service,
    })
  }

  // Create sample projects
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A modern, scalable e-commerce platform built with Next.js and Stripe integration.',
      content: 'Full-featured e-commerce solution with advanced product management, secure payments, and analytics.',
      category: 'Web Development',
      tags: ['E-commerce', 'Next.js', 'Stripe', 'React'],
      client: 'TechStore Inc.',
      duration: '4 months',
      technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
      isFeatured: true,
      authorId: admin.id,
      order: 1,
    },
    {
      title: 'Healthcare Management System',
      description: 'Comprehensive healthcare management solution with patient tracking and analytics.',
      content: 'Complete healthcare management platform with patient records, appointment scheduling, and reporting.',
      category: 'SaaS',
      tags: ['Healthcare', 'SaaS', 'React', 'Node.js'],
      client: 'MedCare Solutions',
      duration: '6 months',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      isFeatured: true,
      authorId: admin.id,
      order: 2,
    },
    {
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication.',
      content: 'Full-featured mobile banking app with advanced security features and real-time transactions.',
      category: 'Mobile Development',
      tags: ['Banking', 'Mobile', 'Security', 'React Native'],
      client: 'SecureBank',
      duration: '8 months',
      technologies: ['React Native', 'Firebase', 'Biometrics', 'Redux'],
      isFeatured: false,
      authorId: admin.id,
      order: 3,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    })
  }

  // Create sample blog posts
  const posts = [
    {
      title: 'The Future of Web Development: Trends to Watch in 2026',
      slug: 'future-web-development-trends-2026',
      excerpt: 'Explore the latest trends shaping the future of web development, from AI integration to advanced frameworks.',
      content: 'Web development is evolving rapidly, with new technologies and methodologies emerging constantly...',
      category: 'Web Development',
      tags: ['React', 'Next.js', 'AI', 'Trends'],
      isPublished: true,
      isFeatured: true,
      views: 245,
      readTime: 8,
      authorId: admin.id,
      seoTitle: 'Future Web Development Trends 2026 | Veliora TechWorks',
      seoDescription: 'Discover the latest web development trends for 2026 including AI integration, advanced frameworks, and emerging technologies.',
      seoKeywords: ['web development', 'trends', '2026', 'AI', 'React', 'Next.js'],
    },
    {
      title: 'Building Scalable SaaS Applications: A Complete Guide',
      slug: 'building-scalable-saas-applications-guide',
      excerpt: 'Learn how to build robust, scalable SaaS applications that can grow with your business needs.',
      content: 'Building a successful SaaS application requires careful planning and the right architectural decisions...',
      category: 'SaaS',
      tags: ['SaaS', 'Scalability', 'Architecture', 'Cloud'],
      isPublished: true,
      isFeatured: false,
      views: 189,
      readTime: 12,
      authorId: admin.id,
      seoTitle: 'How to Build Scalable SaaS Applications | Complete Guide',
      seoDescription: 'Complete guide to building scalable SaaS applications with best practices, architecture patterns, and technologies.',
      seoKeywords: ['SaaS', 'scalable applications', 'software architecture', 'cloud computing'],
    },
  ]

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    })
  }

  // Create sample settings
  const settings = [
    {
      key: 'site_title',
      value: 'Veliora TechWorks',
      type: 'string',
    },
    {
      key: 'site_description',
      value: 'Building intelligent, scalable digital solutions that empower businesses to grow and lead with confidence.',
      type: 'string',
    },
    {
      key: 'contact_email',
      value: 'hello@veliora-techworks.com',
      type: 'string',
    },
    {
      key: 'contact_phone',
      value: '+1 (555) 123-4567',
      type: 'string',
    },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user created: admin@veliora-techworks.com / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })