'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Users, Award } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const About = () => {
  const [aboutImage, setAboutImage] = useState<string | null>(null)
  const [stats, setStats] = useState({ projects: 0, articles: 0 })

  useEffect(() => {
    fetch('/api/media/category/about')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) setAboutImage(data[0].url)
      })
      .catch(() => {})
    
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats({ projects: data.projects, articles: data.articles }))
      .catch(() => {})
  }, [])
  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To empower businesses with intelligent, scalable digital solutions that drive growth and innovation.'
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'To be the leading technology partner for businesses seeking to transform and thrive in the digital age.'
    },
    {
      icon: Users,
      title: 'Values',
      description: 'Excellence, innovation, integrity, and customer success are at the core of everything we do.'
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'We deliver premium solutions with meticulous attention to detail and industry best practices.'
    }
  ]

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-800 mb-6">
            About <span className="gradient-text">Veliora TechWorks</span>
          </h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto">
            Founded in 2026, we are a premium technology startup dedicated to building 
            the future of digital solutions.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-display font-semibold text-dark-800 mb-6">
              Building Tomorrow's Technology Today
            </h3>
            <p className="text-lg text-dark-600 mb-6 leading-relaxed">
              At Veliora TechWorks, we believe that technology should be a catalyst for growth, 
              not a barrier. Our team of expert developers, designers, and strategists work 
              together to create solutions that are not just functional, but transformational.
            </p>
            <p className="text-lg text-dark-600 mb-8 leading-relaxed">
              Since our launch in 2026, we've been at the forefront of technological innovation, 
              helping businesses across industries leverage the power of modern technology to 
              achieve their goals and exceed their expectations.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary-500 mb-2">{stats.projects}+</div>
                <div className="text-dark-600">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-500 mb-2">{stats.articles}+</div>
                <div className="text-dark-600">Articles Published</div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-100 to-accent-100">
              {aboutImage ? (
                <Image
                  src={aboutImage}
                  alt="Veliora TechWorks Team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-display font-bold text-primary-500 mb-4">VTW</div>
                    <p className="text-dark-600">Upload image in Admin → Media</p>
                    <p className="text-sm text-dark-500 mt-2">Category: about</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-display font-semibold text-dark-800 mb-4">
                {value.title}
              </h4>
              <p className="text-dark-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CEO Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12 mt-20"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-display font-semibold text-dark-800 mb-6">
              A Message from Our CEO
            </h3>
            <blockquote className="text-lg md:text-xl text-dark-700 italic leading-relaxed mb-8">
              "At Veliora TechWorks, we don't just build software – we craft digital experiences 
              that transform businesses and empower growth. Our commitment to excellence and 
              innovation drives us to deliver solutions that exceed expectations and create 
              lasting value for our clients."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">CEO</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-dark-800">Chief Executive Officer</div>
                <div className="text-dark-600">Veliora TechWorks</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About