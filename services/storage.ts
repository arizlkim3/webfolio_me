
import { PortfolioItem, UserProfile, LOCAL_STORAGE_KEY, LOCAL_STORAGE_PROFILE_KEY } from '../types';
import { STATIC_PORTFOLIO_DATA, STATIC_PROFILE_DATA } from '../data/portfolioData';

// --- PORTFOLIO ITEMS ---

interface OldPortfolioItem extends Omit<PortfolioItem, 'mediaUrl' | 'mediaType'> {
  imageUrl?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'web';
}

export const getPortfolioData = (): PortfolioItem[] => {
  try {
    const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const localDataRaw = localDataString ? JSON.parse(localDataString) : [];
    const allItemsRaw = [...localDataRaw, ...STATIC_PORTFOLIO_DATA];
    
    const normalizedItems: PortfolioItem[] = allItemsRaw.map((item: OldPortfolioItem) => ({
      ...item,
      mediaUrl: item.mediaUrl || item.imageUrl || '',
      mediaType: item.mediaType || 'image',
      tags: item.tags || [],
      projectUrl: item.projectUrl || ''
    }));

    const uniqueItems = Array.from(new Map(normalizedItems.map(item => [item.id, item])).values());
    return uniqueItems.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Gagal memuat data:", error);
    return STATIC_PORTFOLIO_DATA as unknown as PortfolioItem[];
  }
};

export const savePortfolioItem = (item: PortfolioItem): boolean => {
  try {
    const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const currentData = localDataString ? JSON.parse(localDataString) as PortfolioItem[] : [];
    
    const newData = [item, ...currentData];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    return false;
  }
};

export const deletePortfolioItem = (id: string): void => {
  try {
    const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localDataString) {
      const currentData = JSON.parse(localDataString) as PortfolioItem[];
      const newData = currentData.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    }
    // @ts-ignore
    const isStatic = STATIC_PORTFOLIO_DATA.some(item => item.id === id);
    if (isStatic) {
      alert("Item ini berasal dari file statis dan tidak bisa dihapus permanen lewat browser.");
    }
  } catch (error) {
    console.error("Gagal menghapus data:", error);
  }
};

// --- USER PROFILE ---

const DEFAULT_PROFILE: UserProfile = {
  name: "Nama Lengkap Anda",
  role: "Profesi / Keahlian Utama",
  bio: "Tuliskan deskripsi singkat tentang diri Anda, minat profesional, dan tujuan karir Anda di sini.",
  address: "Kota, Negara",
  skills: ["Skill 1", "Skill 2", "Skill 3"],
  education: [],
  experience: [],
  email: "email@contoh.com"
};

export const getUserProfile = (): UserProfile => {
  try {
    // 1. Cek LocalStorage
    const localProfileString = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (localProfileString) {
      return JSON.parse(localProfileString);
    }

    // 2. Cek Static Data (File)
    if (STATIC_PROFILE_DATA) {
      return STATIC_PROFILE_DATA;
    }

    // 3. Return Default Placeholder
    return DEFAULT_PROFILE;
  } catch (error) {
    console.error("Gagal memuat profil:", error);
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile): boolean => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan profil:", error);
    return false;
  }
};
