import AdminLayout from '@/components/layout/AdminLayout'
import { 
  Users, 
  FileText, 
  FolderOpen, 
  MessageSquare,
  TrendingUp,
  Eye,
  Calendar,
  Activity
} from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    {
      name: 'Total Projects',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: FolderOpen,
      color: 'bg-blue-500'
    },
    {
      name: 'Blog Posts',
      value: '24',
      change: '+5',
      changeType: 'increase',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      name: 'New Contacts',
      value: '8',
      change: '+3',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'bg-yellow-500'
    },
    {
      name: 'Site Views',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: Eye,
      color: 'bg-purple-500'
    }
  ]

  const recentContacts = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Web Development Inquiry',
      createdAt: '2024-01-15T10:30:00Z',
      status: 'NEW'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@company.com',
      subject: 'Mobile App Development',
      createdAt: '2024-01-14T15:45:00Z',
      status: 'IN_PROGRESS'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@startup.io',
      subject: 'SaaS Solution',
      createdAt: '2024-01-13T09:20:00Z',
      status: 'COMPLETED'
    }
  ]

  const recentPosts = [
    {
      id: '1',
      title: 'The Future of Web Development',
      status: 'Published',
      views: 245,
      createdAt: '2024-01-12T14:30:00Z'
    },
    {
      id: '2',
      title: 'Building Scalable SaaS Applications',
      status: 'Draft',
      views: 0,
      createdAt: '2024-01-11T11:15:00Z'
    },
    {
      id: '3',
      title: 'Mobile App Security Best Practices',
      status: 'Published',
      views: 189,
      createdAt: '2024-01-10T16:45:00Z'
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
          {stats.map((stat) => (
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
          {/* Recent Contacts */}
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
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      contact.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                      contact.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {contact.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
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
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{post.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-xs text-gray-500">{post.views} views</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
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
    </AdminLayout>
  )
}