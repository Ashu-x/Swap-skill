export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  rating: number;
  totalSwaps: number;
  joinedDate: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  toUser: User;
  offeredSkill: Skill;
  requestedSkill: Skill;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  message: string;
  createdAt: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  swapRequestId?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}