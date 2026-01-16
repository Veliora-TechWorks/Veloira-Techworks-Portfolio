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
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-800 mb-6">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-dark-600 max-w-3xl mx-auto">
            We offer comprehensive technology solutions tailored to your business needs, 
            from concept to deployment and beyond.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Code
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-8 group hover:scale-105 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-display font-semibold text-dark-800 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-dark-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center text-sm text-dark-600">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Price */}
                  {service.price && (
                    <p className="text-lg font-semibold text-primary-500 mb-4">{service.price}</p>
                  )}

                  {/* CTA */}
                  <button className="flex items-center text-primary-500 font-medium hover:text-primary-600 transition-colors duration-200 group">
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
          className="text-center mt-16"
        >
          <p className="text-lg text-dark-600 mb-8">
            Ready to transform your business with our technology solutions?
          </p>
          <button className="btn-primary text-lg px-8 py-4">
            Get Free Consultation
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Services