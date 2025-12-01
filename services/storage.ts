
import { PortfolioItem, UserProfile, LOCAL_STORAGE_KEY, LOCAL_STORAGE_PROFILE_KEY, Skill } from '../types';
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
    
    // LOGIC BARU: Prioritaskan Data Statis (File)
    // 1. Ambil semua ID dari data statis
    // @ts-ignore
    const staticIds = new Set(STATIC_PORTFOLIO_DATA.map((item: any) => item.id));

    // 2. Filter data lokal: Hanya ambil item yang BELUM ADA di data statis (item baru yang belum didownload/disave ke file)
    // Ini mencegah data lokal menimpa data file yang sudah diupdate.
    const uniqueLocalItems = localDataRaw.filter((item: any) => !staticIds.has(item.id));

    // 3. Gabungkan: Data File (Utama) + Data Lokal (Baru/Draft)
    const allItemsRaw = [...STATIC_PORTFOLIO_DATA, ...uniqueLocalItems];
    
    const normalizedItems: PortfolioItem[] = allItemsRaw.map((item: OldPortfolioItem) => ({
      ...item,
      mediaUrl: item.mediaUrl || item.imageUrl || '',
      mediaType: item.mediaType || 'image',
      tags: item.tags || [],
      projectUrl: item.projectUrl || ''
    }));

    // Deduplikasi final berdasarkan ID (untuk keamanan ganda)
    const uniqueItemsMap = new Map();
    normalizedItems.forEach(item => {
        uniqueItemsMap.set(item.id, item);
    });
    
    const uniqueItems = Array.from(uniqueItemsMap.values()) as PortfolioItem[];

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
    
    // Cek apakah item sudah ada di local storage, jika ya update, jika tidak tambah
    const existingIndex = currentData.findIndex(d => d.id === item.id);
    let newData;
    
    if (existingIndex >= 0) {
        newData = [...currentData];
        newData[existingIndex] = item;
    } else {
        newData = [item, ...currentData];
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    return false;
  }
};

export const deletePortfolioItem = (id: string): void => {
  try {
    // 1. Cek apakah ini item statis (dari file)
    // @ts-ignore
    const isStatic = STATIC_PORTFOLIO_DATA.some((item: any) => item.id === id);
    
    if (isStatic) {
      alert("Item ini berasal dari file 'portfolioData.ts'. Untuk menghapusnya secara permanen, Anda harus menghapus kode item tersebut dari file 'portfolioData.ts' secara manual.");
      return; 
    }

    // 2. Hapus dari Local Storage
    const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localDataString) {
      const currentData = JSON.parse(localDataString) as PortfolioItem[];
      const newData = currentData.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
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
  email: "email@contoh.com",
  phone: "0812-3456-7890",
  age: "25",
  gender: "Pria",
  socials: {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    instagram: "https://instagram.com"
  },
  skills: [
    { id: '1', name: "Skill 1", level: 90 },
    { id: '2', name: "Skill 2", level: 75 },
    { id: '3', name: "Skill 3", level: 60 }
  ],
  education: [],
  experience: [],
};

// Helper untuk migrasi data skill lama (string[]) ke baru (Skill[])
const migrateSkills = (profile: any): UserProfile => {
  if (profile && Array.isArray(profile.skills)) {
    // Cek jika elemen pertama adalah string (format lama)
    if (profile.skills.length > 0 && typeof profile.skills[0] === 'string') {
      const newSkills: Skill[] = profile.skills.map((s: string) => ({
        id: crypto.randomUUID(),
        name: s,
        level: 80 // Default level
      }));
      return { ...profile, skills: newSkills };
    }
  }
  return profile;
};

export const getUserProfile = (): UserProfile => {
  try {
    let profileData: UserProfile;

    // 1. Cek Static Data (File) Terlebih Dahulu
    if (STATIC_PROFILE_DATA) {
      profileData = STATIC_PROFILE_DATA;
    } else {
       // 2. Jika File Kosong (null), baru Cek LocalStorage
       const localProfileString = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
       if (localProfileString) {
         profileData = JSON.parse(localProfileString);
       } else {
         // 3. Return Default Placeholder
         profileData = DEFAULT_PROFILE;
       }
    }

    // Jalankan migrasi jika perlu
    return migrateSkills(profileData);

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
