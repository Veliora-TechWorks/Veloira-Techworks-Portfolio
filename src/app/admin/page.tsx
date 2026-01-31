'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Users, 
  FileText, 
  FolderOpen, 
  MessageSquare,
  TrendingUp,
  Eye,
  Calendar,
  Activity,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  User,
  Mail,
  Linkedin,
  Github,
  Upload,
  Camera,
  Briefcase
} from 'lucide-react'

interface TeamMember {
  id?: string
  name: string
  role: string
  bio: string
  image?: string
  email: string
  linkedin?: string
  github?: string
  order: number
}

interface Job {
  id?: string
  title: string
  department: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  experience: string
  isActive: boolean
  order: number
}

export default function AdminDashboard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [editingJobId, setEditingJobId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    teamMembers: 0,
    contacts: 0,
    jobs: 0
  })
  const [recentContacts, setRecentContacts] = useState<any[]>([])
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [teamFormData, setTeamFormData] = useState<TeamMember>({
    name: '',
    role: '',
    bio: '',
    email: '',
    linkedin: '',
    github: '',
    order: 0
  })
  const [jobFormData, setJobFormData] = useState<Job>({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: [],
    experience: '',
    isActive: true,
    order: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch team members first
      const teamRes = await fetch('/api/team')
      const teamData = teamRes.ok ? await teamRes.json() : []
      setTeamMembers(teamData)

      // Fetch jobs
      const jobsRes = await fetch('/api/jobs')
      const jobsData = jobsRes.ok ? await jobsRes.json() : []
      setJobs(jobsData)

      // Fetch other data with fallbacks
      let projectsData = [], postsData = [], contactsData = []
      
      try {
        const projectsRes = await fetch('/api/projects')
        projectsData = projectsRes.ok ? await projectsRes.json() : []
      } catch (e) { console.log('Projects API not available') }
      
      try {
        const postsRes = await fetch('/api/posts')
        postsData = postsRes.ok ? await postsRes.json() : []
      } catch (e) { console.log('Posts API not available') }
      
      try {
        const contactsRes = await fetch('/api/contacts')
        contactsData = contactsRes.ok ? await contactsRes.json() : []
      } catch (e) { console.log('Contacts API not available') }

      // Update stats with real data
      setStats({
        projects: Array.isArray(projectsData) ? projectsData.length : 0,
        posts: Array.isArray(postsData) ? postsData.length : 0,
        teamMembers: Array.isArray(teamData) ? teamData.length : 0,
        contacts: Array.isArray(contactsData) ? contactsData.length : 0,
        jobs: Array.isArray(jobsData) ? jobsData.length : 0
      })

      // Set recent data with fallbacks
      setRecentContacts(Array.isArray(contactsData) ? contactsData.slice(0, 3) : [])
      setRecentPosts(Array.isArray(postsData) ? postsData.slice(0, 3) : [])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set fallback data
      setStats({ projects: 0, posts: 0, teamMembers: 0, contacts: 0, jobs: 0 })
      setRecentContacts([])
      setRecentPosts([])
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('files', file)
    formData.append('category', 'team')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`)
      }
      
      const data = await res.json()
      if (data.files && data.files[0]) {
        setTeamFormData({ ...teamFormData, image: data.files[0].url })
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingTeamId ? `/api/team/${editingTeamId}` : '/api/team'
      const method = editingTeamId ? 'PUT' : 'POST'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamFormData)
      })
      
      fetchDashboardData()
      resetTeamForm()
    } catch (error) {
      console.error('Error saving team member:', error)
    }
  }

  const handleTeamEdit = (member: TeamMember) => {
    setTeamFormData(member)
    setEditingTeamId(member.id || null)
    setShowTeamForm(true)
  }

  const handleTeamDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return
    
    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' })
      fetchDashboardData()
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }

  const resetTeamForm = () => {
    setTeamFormData({
      name: '',
      role: '',
      bio: '',
      email: '',
      linkedin: '',
      github: '',
      order: 0
    })
    setEditingTeamId(null)
    setShowTeamForm(false)
  }

  // Job Management Functions
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingJobId ? `/api/jobs/${editingJobId}` : '/api/jobs'
      const method = editingJobId ? 'PUT' : 'POST'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobFormData)
      })
      
      fetchDashboardData()
      resetJobForm()
    } catch (error) {
      console.error('Error saving job:', error)
    }
  }

  const handleJobEdit = (job: Job) => {
    setJobFormData(job)
    setEditingJobId(job.id || null)
    setShowJobForm(true)
  }

  const handleJobDelete = async (id: string) => {
    if (!confirm('Delete this job posting?')) return
    
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
      fetchDashboardData()
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }

  const resetJobForm = () => {
    setJobFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: [],
      experience: '',
      isActive: true,
      order: 0
    })
    setEditingJobId(null)
    setShowJobForm(false)
  }

  const statsData = [
    {
      name: 'Total Projects',
      value: stats.projects.toString(),
      change: '+2',
      changeType: 'increase',
      icon: FolderOpen,
      color: 'bg-blue-500'
    },
    {
      name: 'Blog Posts',
      value: stats.posts.toString(),
      change: '+5',
      changeType: 'increase',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      name: 'Team Members',
      value: stats.teamMembers.toString(),
      change: '+1',
      changeType: 'increase',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'Open Jobs',
      value: stats.jobs.toString(),
      change: '+2',
      changeType: 'increase',
      icon: Briefcase,
      color: 'bg-orange-500'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your site.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                <button
                  onClick={() => setShowTeamForm(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleTeamEdit(member)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleTeamDelete(member.id!)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Job Postings</h2>
                <button
                  onClick={() => setShowJobForm(true)}
                  className="bg-orange-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-orange-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Job</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No job postings yet</p>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleJobEdit(job)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleJobDelete(job.id!)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Contacts</h2>
                <a href="/admin/contacts" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                  View all
                </a>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentContacts.length > 0 ? recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(contact.createdAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      NEW
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-4 text-gray-500">
                    No contacts yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
              <a href="/admin/posts" className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                View all
              </a>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPosts.length > 0 ? recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        post.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
              )) : (
                <div className="text-center py-4 text-gray-500">
                  No posts yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/posts/new"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
            >
              <FileText className="w-8 h-8 text-primary-500" />
              <div>
                <h3 className="font-medium text-gray-900">Create New Post</h3>
                <p className="text-sm text-gray-600">Write a new blog post</p>
              </div>
            </a>
            <a
              href="/admin/projects/new"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
            >
              <FolderOpen className="w-8 h-8 text-primary-500" />
              <div>
                <h3 className="font-medium text-gray-900">Add New Project</h3>
                <p className="text-sm text-gray-600">Showcase your latest work</p>
              </div>
            </a>
            <a
              href="/admin/contacts"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
            >
              <MessageSquare className="w-8 h-8 text-primary-500" />
              <div>
                <h3 className="font-medium text-gray-900">Review Contacts</h3>
                <p className="text-sm text-gray-600">Respond to inquiries</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingJobId ? 'Edit Job Posting' : 'Add Job Posting'}
                </h2>
                <button onClick={resetJobForm} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleJobSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
                  <input
                    type="text"
                    value={jobFormData.department}
                    onChange={(e) => setJobFormData({...jobFormData, department: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type *</label>
                  <select
                    value={jobFormData.type}
                    onChange={(e) => setJobFormData({...jobFormData, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range</label>
                  <input
                    type="text"
                    value={jobFormData.salary}
                    onChange={(e) => setJobFormData({...jobFormData, salary: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g. ₹10-15 LPA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Required</label>
                  <input
                    type="text"
                    value={jobFormData.experience}
                    onChange={(e) => setJobFormData({...jobFormData, experience: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g. 3-5 years"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
                  <textarea
                    value={jobFormData.description}
                    onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24 resize-none"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements (comma-separated)</label>
                  <textarea
                    value={jobFormData.requirements.join(', ')}
                    onChange={(e) => setJobFormData({...jobFormData, requirements: e.target.value.split(',').map(r => r.trim()).filter(r => r)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-20 resize-none"
                    placeholder="React, Node.js, 3+ years experience, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={jobFormData.order}
                    onChange={(e) => setJobFormData({...jobFormData, order: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={jobFormData.isActive}
                      onChange={(e) => setJobFormData({...jobFormData, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Job Posting</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetJobForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingJobId ? 'Update Job' : 'Add Job'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Form Modal */}
      {showTeamForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTeamId ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
                <button 
                  onClick={resetTeamForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleTeamSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Image */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Image</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-200">
                      {teamFormData.image ? (
                        <Image
                          src={teamFormData.image}
                          alt="Preview"
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors ${
                          uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={teamFormData.name}
                    onChange={(e) => setTeamFormData({...teamFormData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={teamFormData.role}
                    onChange={(e) => setTeamFormData({...teamFormData, role: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g. Senior Developer"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio *</label>
                  <textarea
                    value={teamFormData.bio}
                    onChange={(e) => setTeamFormData({...teamFormData, bio: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none"
                    placeholder="Brief description about the team member..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={teamFormData.email}
                    onChange={(e) => setTeamFormData({...teamFormData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="email@company.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={teamFormData.order}
                    onChange={(e) => setTeamFormData({...teamFormData, order: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                {/* Social Links */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={teamFormData.linkedin}
                        onChange={(e) => setTeamFormData({...teamFormData, linkedin: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
                      <input
                        type="url"
                        value={teamFormData.github}
                        onChange={(e) => setTeamFormData({...teamFormData, github: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetTeamForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTeamId ? 'Update Member' : 'Add Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}