
export type MediaType = 'image' | 'video' | 'audio' | 'web' | 'certificate' | 'movie';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: MediaType;
  projectUrl: string;
  tags: string[];
  createdAt: number;
  isFeatured?: boolean; // Properti baru untuk karya terbaik/unggulan
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

export interface Skill {
  id: string;
  name: string;
  level: number; // 0 - 100
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
  whatsapp?: string; // Properti baru untuk WhatsApp
  vercel?: string; // Properti baru untuk Vercel
}

export interface UserProfile {
  name: string;
  role: string;
  address: string;
  bio: string;
  email?: string;
  phone?: string;
  age?: string;
  gender?: 'Pria' | 'Wanita' | 'Lainnya';
  avatarUrl?: string;
  socials?: SocialLinks;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
}

export type TabView = 'create' | 'gallery' | 'about' | 'profile';
export type UserRole = 'creator' | 'guest';
export type Theme = 'light' | 'dark';

export const LOCAL_STORAGE_KEY = 'webfolio_data';
export const LOCAL_STORAGE_PROFILE_KEY = 'webfolio_profile';
