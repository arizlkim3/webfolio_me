
export type MediaType = 'image' | 'video' | 'audio' | 'web';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: MediaType;
  projectUrl: string;
  tags: string[];
  createdAt: number;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  year: string;
  description: string;
}

export interface UserProfile {
  name: string;
  role: string;
  address: string;
  bio: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  email?: string;
  avatarUrl?: string; // Optional
}

export type TabView = 'create' | 'view' | 'profile';
export type UserRole = 'creator' | 'guest';
export type Theme = 'light' | 'dark';

export const LOCAL_STORAGE_KEY = 'webfolio_data';
export const LOCAL_STORAGE_PROFILE_KEY = 'webfolio_profile';
