
import { PortfolioItem, UserProfile, LOCAL_STORAGE_KEY, LOCAL_STORAGE_PROFILE_KEY } from '../types';
import { STATIC_PORTFOLIO_DATA, STATIC_PROFILE_DATA } from '../data/portfolioData';

// --- IMAGE OPTIMIZATION UTILITY ---

export const compressImage = (
  file: File, 
  maxWidth: number = 1200, 
  maxHeight: number = 1200, 
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not available'));
        
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// --- PORTFOLIO ITEMS ---

export const getPortfolioData = (): PortfolioItem[] => {
  try {
    const localDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
    const localItems = localDataString ? (JSON.parse(localDataString) as PortfolioItem[]) : [];
    
    const itemsMap = new Map<string, PortfolioItem>();
    
    // Load static data first
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

    // Overwrite with local data if exists
    localItems.forEach(item => {
      itemsMap.set(item.id, {
        ...item,
        isFeatured: !!item.isFeatured
      });
    });

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
    const updatedItem = { ...itemToToggle, isFeatured: !itemToToggle.isFeatured };
    
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
    const localProfileString = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (localProfileString) return JSON.parse(localProfileString);
    if (STATIC_PROFILE_DATA) return STATIC_PROFILE_DATA;
    return DEFAULT_PROFILE;
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

// --- DATA SINKRONISASI (FOR portfolioData.ts) ---

/**
 * Menghasilkan teks kode TypeScript untuk disalin ke file portfolioData.ts
 */
export const generatePortfolioCode = (): string => {
  const portfolio = getPortfolioData();
  const profile = getUserProfile();
  
  return `import { PortfolioItem, UserProfile } from '../types';

/**
 * DATA PORTOFOLIO PERMANEN
 * Salin dan tempel konten ini ke src/data/portfolioData.ts
 */

export const STATIC_PORTFOLIO_DATA: PortfolioItem[] = ${JSON.stringify(portfolio, null, 2)};

export const STATIC_PROFILE_DATA: UserProfile | null = ${JSON.stringify(profile, null, 2)};
`;
};

/**
 * Mendownload data dalam format file .ts
 */
export const downloadPortfolioFile = () => {
  const code = generatePortfolioCode();
  const blob = new Blob([code], { type: 'text/typescript' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'portfolioData.ts';
  link.click();
  URL.revokeObjectURL(url);
};
