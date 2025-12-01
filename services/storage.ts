
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
  skills: ["Skill 1", "Skill 2", "Skill 3"],
  education: [],
  experience: [],
  email: "email@contoh.com"
};

export const getUserProfile = (): UserProfile => {
  try {
    // LOGIC BARU: Prioritaskan Data Statis (File)
    
    // 1. Cek Static Data (File) Terlebih Dahulu
    // Jika user sudah mengisi STATIC_PROFILE_DATA di file, gunakan itu.
    if (STATIC_PROFILE_DATA) {
      return STATIC_PROFILE_DATA;
    }

    // 2. Jika File Kosong (null), baru Cek LocalStorage
    const localProfileString = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (localProfileString) {
      return JSON.parse(localProfileString);
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
