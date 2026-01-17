'use client'

import { motion } from 'framer-motion'
import { 
  Code, 
  Globe, 
  Smartphone, 
  Cloud, 
  Database, 
  Shield,
  ArrowRight 
} from 'lucide-react'
import { useEffect, useState } from 'react'

const iconMap: any = {
  Code, Globe, Smartphone, Cloud, Database, Shield
}

const Services = () => {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.filter((s: any) => s.isActive))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="services" className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-dark-800 mb-4 sm:mb-6 px-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-dark-600 max-w-3xl mx-auto px-4">
            Comprehensive technology solutions tailored to your business needs.
          </p>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-600">No services available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 px-4">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Code
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-5 sm:p-6 lg:p-8 group hover:scale-105 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-display font-semibold text-dark-800 mb-3 sm:mb-4">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-dark-600 mb-4 sm:mb-5 lg:mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-4 sm:mb-5 lg:mb-6">
                      {service.features.slice(0, 3).map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-start text-xs sm:text-sm text-dark-600">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-500 rounded-full mr-2 sm:mr-3 flex-shrink-0 mt-1.5"></div>
                          <span className="line-clamp-2">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Price */}
                  {service.price && (
                    <p className="text-base sm:text-lg font-semibold text-primary-500 mb-3 sm:mb-4">{service.price}</p>
                  )}

                  {/* CTA */}
                  <button className="flex items-center text-sm sm:text-base text-primary-500 font-medium hover:text-primary-600 transition-colors duration-200 group">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-10 sm:mt-12 lg:mt-16 px-4"
        >
          <p className="text-base sm:text-lg text-dark-600 mb-5 sm:mb-6 lg:mb-8">
            Ready to transform your business with our technology solutions?
          </p>
          <button className="btn-primary text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
            Get Free Consultation
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Services