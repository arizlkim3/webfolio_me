
import { PortfolioItem, UserProfile, LOCAL_STORAGE_KEY, LOCAL_STORAGE_PROFILE_KEY, Skill } from '../types';
import { STATIC_PORTFOLIO_DATA, STATIC_PROFILE_DATA } from '../data/portfolioData';

// --- PORTFOLIO ITEMS ---

export const getPortfolioData = (): PortfolioItem[] => {
  try {
    const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const localItems = localDataString ? (JSON.parse(localDataString) as PortfolioItem[]) : [];
    
    // Gunakan Map untuk menggabungkan data. ID yang sama di local akan menimpa data statis.
    const itemsMap = new Map<string, PortfolioItem>();
    
    // 1. Masukkan data statis terlebih dahulu
    (STATIC_PORTFOLIO_DATA as any[]).forEach(item => {
      itemsMap.set(item.id, {
        ...item,
        mediaUrl: item.mediaUrl || item.imageUrl || '',
        mediaType: item.mediaType || 'image',
        tags: item.tags || [],
        projectUrl: item.projectUrl || '',
        isFeatured: !!item.isFeatured,
        createdAt: item.createdAt || 0
      });
    });

    // 2. Timpa atau tambahkan dengan data dari LocalStorage
    localItems.forEach(item => {
      itemsMap.set(item.id, {
        ...item,
        isFeatured: !!item.isFeatured // Pastikan tipe boolean
      });
    });

    // Konversi Map kembali ke Array dan urutkan berdasarkan waktu pembuatan terbaru
    return Array.from(itemsMap.values()).sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Gagal memuat data:", error);
    return STATIC_PORTFOLIO_DATA as unknown as PortfolioItem[];
  }
};

export const savePortfolioItem = (item: PortfolioItem): boolean => {
  try {
    const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const currentData = localDataString ? JSON.parse(localDataString) as PortfolioItem[] : [];
    
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

export const toggleFeaturedItem = (id: string): boolean => {
  try {
    const allItems = getPortfolioData();
    const itemToToggle = allItems.find(i => i.id === id);
    
    if (!itemToToggle) return false;

    // Toggle status
    const updatedItem = { 
      ...itemToToggle, 
      isFeatured: !itemToToggle.isFeatured 
    };

    // Simpan ke LocalStorage sebagai override
    const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    let localData = localDataString ? JSON.parse(localDataString) as PortfolioItem[] : [];
    
    const localIndex = localData.findIndex(i => i.id === id);
    if (localIndex >= 0) {
      localData[localIndex] = updatedItem;
    } else {
      localData.push(updatedItem);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localData));
    return true;
  } catch (error) {
    console.error("Gagal toggle status unggulan:", error);
    return false;
  }
};

export const deletePortfolioItem = (id: string): void => {
  try {
    // Cek apakah ini data statis
    const isStatic = (STATIC_PORTFOLIO_DATA as any[]).some(item => item.id === id);
    
    if (isStatic) {
      alert("Karya bawaan sistem tidak bisa dihapus dari UI. Silakan hapus ID tersebut di portfolioData.ts");
      return; 
    }

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
  bio: "Tuliskan deskripsi singkat tentang diri Anda.",
  address: "Kota, Negara",
  skills: [],
  education: [],
  experience: [],
};

export const getUserProfile = (): UserProfile => {
  try {
    if (STATIC_PROFILE_DATA) return STATIC_PROFILE_DATA;
    const localProfileString = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    return localProfileString ? JSON.parse(localProfileString) : DEFAULT_PROFILE;
  } catch (error) {
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile): boolean => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    return false;
  }
};
