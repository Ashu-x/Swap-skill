import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Star,
  Plus,
  ArrowRight,
  BookOpen,
  Target,
  Award,
  Calendar,
  Activity
} from 'lucide-react';
import { mockSwapRequests } from '../../data/mockData';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const stats = [
    { 
      label: 'Skills Offered', 
      value: user?.skillsOffered.length || 0, 
      icon: BookOpen, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Skills Wanted', 
      value: user?.skillsWanted.length || 0, 
      icon: Target, 
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      label: 'Active Swaps', 
      value: 2, 
      icon: Activity, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      label: 'Rating', 
      value: user?.rating || 0, 
      icon: Star, 
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
  ];

  const recentRequests = mockSwapRequests.filter(req => 
    req.toUserId === user?.id || req.fromUserId === user?.id
  ).slice(0, 3);

  const quickActions = [
    {
      title: 'Update Profile',
      description: 'Add or edit your skills and bio',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      action: () => onNavigate('profile')
    },
    {
      title: 'Explore Skills',
      description: 'Find people to swap skills with',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      action: () => onNavigate('explore')
    },
    {
      title: 'Check Messages',
      description: 'View your conversations',
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-500',
      action: () => onNavigate('messages')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
            <p className="text-blue-100 text-lg">Ready to learn something new today?</p>
          </div>
          <Button 
            onClick={() => onNavigate('explore')} 
            className="bg-white text-blue-600 hover:bg-gray-100 mt-4 md:mt-0"
            icon={Plus}
          >
            Find Skills
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Swap Requests */}
        <div className="lg:col-span-2">
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('messages')}>
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-gray-500 mb-4">Start exploring skills to connect with others!</p>
                  <Button onClick={() => onNavigate('explore')} icon={Plus}>
                    Explore Skills
                  </Button>
                </div>
              ) : (
                recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img
                        src={request.fromUser.avatar}
                        alt={request.fromUser.name}
                        className="w-12 h-12 rounded-full ring-2 ring-white"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{request.fromUser.name}</p>
                        <p className="text-sm text-gray-600">
                          {request.offeredSkill.name} ↔ {request.requestedSkill.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={request.status === 'pending' ? 'warning' : request.status === 'accepted' ? 'success' : 'default'}
                    >
                      {request.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full group"
                  >
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group-hover:shadow-md">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900 group-hover:text-gray-700">
                          {action.title}
                        </p>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Achievement Section */}
            <div className="mt-8 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Achievement</h3>
                  <p className="text-sm text-gray-600">Keep up the great work!</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                  <span className="text-sm font-bold text-amber-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};