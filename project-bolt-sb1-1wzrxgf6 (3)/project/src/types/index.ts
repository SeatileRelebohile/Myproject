export interface Nominee {
  id: string;
  name: string;
  email: string;
  password?: string;
  platform: string;
  profileLink: string;
  profileImage: string;
  bio: string;
  category: string;
  votes: number;
  socialLinks: SocialLink[];
  isVisible: boolean;
  shareableLink: string;
  paymentRequests: PaymentRequest[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface PaymentRequest {
  id: string;
  nomineeId: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Vote {
  id: string;
  nomineeId: string;
  category: string;
  timestamp: number;
  voterIdentifier: string;
  ipAddress: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'nominee' | 'admin' | 'voter';
  nomineeId?: string;
}

export type Page = 'home' | 'categories' | 'register' | 'vote' | 'how-it-works' | 'results' | 'login' | 'profile' | 'nominee-profile';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}