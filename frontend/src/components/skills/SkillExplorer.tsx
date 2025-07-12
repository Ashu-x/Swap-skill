import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star,
  MessageCircle,
  Users,
  Heart,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';
import { mockUsers, skillCategories } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

interface SkillExplorerProps {
  onNavigate: (page: string) => void;
}

export const SkillExplorer: React.FC<SkillExplorerProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter users excluding current user
  const availableUsers = mockUsers.filter(u => u.id !== user?.id);

  const filteredUsers = availableUsers.filter(person => {
    const matchesSearch = searchTerm === '' || 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.skillsOffered.some(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === '' ||
      person.skillsOffered.some(skill => skill.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const handleRequestSwap = (targetUser: typeof mockUsers[0], skill: typeof mockUsers[0]['skillsOffered'][0]) => {
    // This would open a swap request modal in a real app
    alert(`Swap request sent to ${targetUser.name} for ${skill.name}!`);
  };

  const featuredSkills = [
    { name: 'React Development', category: 'Technology', users: 15, color: 'from-blue-500 to-cyan-500' },
    { name: 'UI/UX Design', category: 'Design', users: 12, color: 'from-purple-500 to-pink-500' },
    { name: 'Spanish Language', category: 'Languages', users: 8, color: 'from-emerald-500 to-teal-500' },
    { name: 'Guitar Playing', category: 'Music', users: 6, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Explore Skills</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing people in your community and start your skill exchange journey
        </p>
      </div>

      {/* Featured Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredSkills.map((skill, index) => (
          <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <div className={`w-12 h-12 bg-gradient-to-br ${skill.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{skill.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{skill.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{skill.users} teachers</span>
              <Badge variant="info" size="sm">Popular</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skills, people, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={Filter}
            className="border-2"
          >
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
                >
                  <option value="">All Categories</option>
                  {skillCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Level
                </label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors">
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors">
                  <option value="">All Locations</option>
                  <option value="local">Within 10 miles</option>
                  <option value="city">Same city</option>
                  <option value="remote">Remote friendly</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((person) => (
          <Card key={person.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
            {/* Profile Header */}
            <div className="relative p-6 pb-4">
              <div className="absolute top-4 right-4">
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow group">
                  <Heart className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-16 h-16 rounded-2xl ring-4 ring-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {person.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 mr-1 text-amber-500" />
                    <span className="font-medium text-gray-900">{person.rating.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1">• {person.totalSwaps} swaps</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 line-clamp-2">{person.bio}</p>
            </div>

            {/* Skills */}
            <div className="px-6 space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Teaches</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {person.skillsOffered.slice(0, 3).map((skill) => (
                    <Badge key={skill.id} variant="success" size="sm">
                      {skill.name}
                    </Badge>
                  ))}
                  {person.skillsOffered.length > 3 && (
                    <Badge variant="default" size="sm">
                      +{person.skillsOffered.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Wants to Learn</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {person.skillsWanted.slice(0, 3).map((skill) => (
                    <Badge key={skill.id} variant="info" size="sm">
                      {skill.name}
                    </Badge>
                  ))}
                  {person.skillsWanted.length > 3 && (
                    <Badge variant="default" size="sm">
                      +{person.skillsWanted.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-4 bg-gray-50 mt-4">
              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => handleRequestSwap(person, person.skillsOffered[0])}
                  icon={Users}
                >
                  Request Swap
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={MessageCircle}
                  onClick={() => onNavigate('messages')}
                  className="border-2"
                >
                  Message
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="p-12 text-center border-0 shadow-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No skills found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters to find more people.
          </p>
          <Button onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}>
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};