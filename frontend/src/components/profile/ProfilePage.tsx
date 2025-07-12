import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Edit, 
  Plus, 
  Star, 
  MapPin, 
  Calendar,
  Save,
  X
} from 'lucide-react';
import { mockSkills, skillCategories } from '../../data/mockData';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  const [showAddSkill, setShowAddSkill] = useState<'offered' | 'wanted' | null>(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    level: 'Beginner' as const,
    description: '',
  });

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (!newSkill.name || !newSkill.category) return;

    const skill = {
      id: Date.now().toString(),
      ...newSkill,
    };

    const currentSkills = showAddSkill === 'offered' 
      ? user?.skillsOffered || []
      : user?.skillsWanted || [];

    const updatedSkills = [...currentSkills, skill];
    
    updateProfile({
      [showAddSkill === 'offered' ? 'skillsOffered' : 'skillsWanted']: updatedSkills
    });

    setNewSkill({ name: '', category: '', level: 'Beginner', description: '' });
    setShowAddSkill(null);
  };

  const handleRemoveSkill = (skillId: string, type: 'offered' | 'wanted') => {
    const currentSkills = type === 'offered' 
      ? user?.skillsOffered || []
      : user?.skillsWanted || [];

    const updatedSkills = currentSkills.filter(skill => skill.id !== skillId);
    
    updateProfile({
      [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: updatedSkills
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <Button
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
          icon={isEditing ? Save : Edit}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full"
          />
          
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Name"
                  value={editForm.name}
                  onChange={(value) => setEditForm(prev => ({ ...prev, name: value }))}
                />
                <Input
                  label="Location"
                  value={editForm.location}
                  onChange={(value) => setEditForm(prev => ({ ...prev, location: value }))}
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {new Date(user.joinedDate).toLocaleDateString()}
                  </div>
                </div>
                
                <p className="text-gray-700">{user.bio}</p>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{user.rating.toFixed(1)}</span>
                    <span className="text-gray-600 ml-1">rating</span>
                  </div>
                  <div>
                    <span className="font-medium">{user.totalSwaps}</span>
                    <span className="text-gray-600 ml-1">swaps completed</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Offered */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Skills I Offer</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSkill('offered')}
              icon={Plus}
            >
              Add Skill
            </Button>
          </div>

          {showAddSkill === 'offered' && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <Input
                label="Skill Name"
                value={newSkill.name}
                onChange={(value) => setNewSkill(prev => ({ ...prev, name: value }))}
                placeholder="e.g., React Development"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {skillCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAddSkill}>Add</Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddSkill(null)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {user.skillsOffered.length === 0 ? (
              <p className="text-gray-500 text-sm">No skills added yet</p>
            ) : (
              user.skillsOffered.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{skill.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="info" size="sm">{skill.category}</Badge>
                      <Badge variant="default" size="sm">{skill.level}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSkill(skill.id, 'offered')}
                    icon={X}
                  />
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Skills Wanted */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Skills I Want to Learn</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSkill('wanted')}
              icon={Plus}
            >
              Add Skill
            </Button>
          </div>

          {showAddSkill === 'wanted' && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <Input
                label="Skill Name"
                value={newSkill.name}
                onChange={(value) => setNewSkill(prev => ({ ...prev, name: value }))}
                placeholder="e.g., Guitar Playing"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {skillCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAddSkill}>Add</Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddSkill(null)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {user.skillsWanted.length === 0 ? (
              <p className="text-gray-500 text-sm">No skills added yet</p>
            ) : (
              user.skillsWanted.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{skill.name}</h4>
                    <div className="mt-1">
                      <Badge variant="default" size="sm">{skill.category}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSkill(skill.id, 'wanted')}
                    icon={X}
                  />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};