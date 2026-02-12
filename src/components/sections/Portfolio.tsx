'use client'

import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Portfolio = () => {
  const [mounted, setMounted] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    // Add a small delay to prioritize above-the-fold content
    const timer = setTimeout(() => {
      const timestamp = Date.now()
      fetch(`/api/projects/public?t=${timestamp}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          setProjects(data.slice(0, 6)) // Limit to 6 projects for performance
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <section id="portfolio" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-dark-800 mb-4 sm:mb-6 px-4">
              Our <span className="gradient-text">Portfolio</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-dark-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Explore our latest projects and see how we've helped businesses transform 
              their digital presence.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-dark-600">Loading projects...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-dark-800 mb-4 sm:mb-6 px-4">
            Our <span className="gradient-text">Portfolio</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-dark-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Explore our latest projects and see how we've helped businesses transform 
            their digital presence.
          </p>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-48 sm:h-56 md:h-64"></div>
                <div className="p-4 sm:p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-600">No projects yet. Create one in Admin Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden"
              >
                {/* Project Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 h-48 sm:h-56 md:h-64">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-display font-bold text-primary-500 mb-2">
                          {project.title?.split(' ').map((word: string) => word[0]).join('') || 'P'}
                        </div>
                        <p className="text-xs text-dark-600">No image</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm font-medium text-primary-500 bg-primary-50 px-2 sm:px-3 py-1 rounded-full">
                      {project.category || 'Project'}
                    </span>
                    {project.isFeatured && (
                      <span className="text-xs font-medium text-accent-500 bg-accent-50 px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-semibold text-dark-800 mb-2 sm:mb-3">
                    {project.title || 'Untitled Project'}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-dark-600 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                    {project.description || 'No description available'}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                      {project.technologies.slice(0, 3).map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="text-xs font-medium text-dark-600 bg-gray-100 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs font-medium text-dark-600 bg-gray-100 px-2 py-1 rounded">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-white bg-primary-500 hover:bg-primary-600 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Live
                      </a>
                    )}
                    <Link
                      href={`/portfolio/${project.id}`}
                      className="flex items-center text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors duration-200 group"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center px-4"
        >
          <p className="text-base sm:text-lg text-dark-600 mb-6 sm:mb-8">
            Want to see more of our work or discuss your project?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/portfolio" className="btn-primary w-full sm:w-auto">
              View All Projects
            </Link>
            <Link href="/contact" className="btn-outline w-full sm:w-auto">
              Start Your Project
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Portfolio