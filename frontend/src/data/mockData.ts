import { User, Skill, SwapRequest } from '../types';

export const skillCategories = [
  'Technology',
  'Design',
  'Languages',
  'Music',
  'Cooking',
  'Sports',
  'Art',
  'Business',
  'Writing',
  'Photography',
];

export const mockSkills: Skill[] = [
  { id: '1', name: 'React Development', category: 'Technology', level: 'Advanced', description: 'Modern React with hooks and TypeScript' },
  { id: '2', name: 'UI/UX Design', category: 'Design', level: 'Expert', description: 'User interface and experience design' },
  { id: '3', name: 'Spanish', category: 'Languages', level: 'Intermediate', description: 'Conversational Spanish speaking' },
  { id: '4', name: 'Guitar Playing', category: 'Music', level: 'Advanced', description: 'Acoustic and electric guitar' },
  { id: '5', name: 'Italian Cooking', category: 'Cooking', level: 'Expert', description: 'Traditional Italian cuisine' },
  { id: '6', name: 'Photography', category: 'Photography', level: 'Intermediate', description: 'Portrait and landscape photography' },
  { id: '7', name: 'Python Programming', category: 'Technology', level: 'Advanced', description: 'Backend development with Python' },
  { id: '8', name: 'French', category: 'Languages', level: 'Beginner', description: 'Basic French conversation' },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    avatar: '',
    bio: 'Full-stack developer passionate about teaching and learning new skills.',
    location: 'San Francisco, CA',
    skillsOffered: [mockSkills[0], mockSkills[6]],
    skillsWanted: [mockSkills[1], mockSkills[2]],
    rating: 4.8,
    totalSwaps: 23,
    joinedDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Bob',
    email: 'Bob@example.com',
    avatar: '',
    bio: 'Designer and chef who loves sharing knowledge about creativity and cuisine.',
    location: 'New York, NY',
    skillsOffered: [mockSkills[1], mockSkills[4]],
    skillsWanted: [mockSkills[3], mockSkills[5]],
    rating: 4.9,
    totalSwaps: 31,
    joinedDate: '2022-11-08',
  },
  {
    id: '3',
    name: 'Emma',
    email: 'emma@example.com',
    avatar: '',
    bio: 'Musician and photographer looking to expand my technical skills.',
    location: 'Los Angeles, CA',
    skillsOffered: [mockSkills[3], mockSkills[5]],
    skillsWanted: [mockSkills[0], mockSkills[7]],
    rating: 4.7,
    totalSwaps: 18,
    joinedDate: '2023-03-22',
  },
];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    fromUserId: '2',
    toUserId: '1',
    fromUser: mockUsers[1],
    toUser: mockUsers[0],
    offeredSkill: mockSkills[1],
    requestedSkill: mockSkills[0],
    status: 'pending',
    message: 'Hi Alice! I\'d love to learn React from you in exchange for UI/UX design lessons.',
    createdAt: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    fromUserId: '3',
    toUserId: '1',
    fromUser: mockUsers[2],
    toUser: mockUsers[0],
    offeredSkill: mockSkills[5],
    requestedSkill: mockSkills[6],
    status: 'accepted',
    message: 'I can teach you photography basics in exchange for Python programming help!',
    createdAt: '2024-01-19T14:15:00Z',
  },
];