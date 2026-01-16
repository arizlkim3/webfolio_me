
import { PortfolioItem, UserProfile, LOCAL_STORAGE_KEY, LOCAL_STORAGE_PROFILE_KEY } from '../types';
import { STATIC_PORTFOLIO_DATA, STATIC_PROFILE_DATA } from '../data/portfolioData';

// Konfigurasi Database - Secara otomatis mengambil dari Vercel Environment Variables
const DB_CONFIG = {
  apiKey: process.env.MONGODB_DATA_API_KEY || '',
  endpoint: process.env.MONGODB_DATA_URL || '',
  cluster: process.env.MONGODB_CLUSTER || 'Cluster0',
  database: process.env.MONGODB_DB || 'webfolio_db',
  collection: 'portfolios',
  profileCollection: 'user_profile'
};

// Deteksi status koneksi database
export const isDatabaseConnected = () => !!DB_CONFIG.apiKey && !!DB_CONFIG.endpoint;

/**
 * Core function untuk komunikasi dengan MongoDB Atlas via HTTPS (Vercel Friendly)
 */
async function apiRequest(action: string, payload: any) {
  if (!isDatabaseConnected()) return null;

  try {
    const response = await fetch(`${DB_CONFIG.endpoint}/action/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': DB_CONFIG.apiKey,
      },
      body: JSON.stringify({
        dataSource: DB_CONFIG.cluster,
        database: DB_CONFIG.database,
        collection: DB_CONFIG.collection,
        ...payload
      }),
    });

    if (!response.ok) throw new Error('DB Connection Failed');
    return await response.json();
  } catch (error) {
    console.warn(`[Vercel DB Sync] ${action} failed:`, error);
    return null;
  }
}

// --- UTILITIES ---

export const compressImage = (file: File, maxWidth = 1000, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = img.width / img.height;
        canvas.width = maxWidth;
        canvas.height = maxWidth / ratio;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    };
    reader.onerror = reject;
  });
};

// --- PORTFOLIO DATA ---

export const getPortfolioData = async (): Promise<PortfolioItem[]> => {
  // 1. Load dari Cache Lokal dulu (Instan)
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  let items = cached ? JSON.parse(cached) : [...STATIC_PORTFOLIO_DATA];

  // 2. Fetch dari Cloud (Async)
  if (isDatabaseConnected()) {
    const result = await apiRequest('find', { filter: {} });
    if (result && result.documents) {
      const cloudItems = result.documents;
      // Merge Cloud & Local (Cloud selalu menang jika ID sama)
      const map = new Map();
      items.forEach((i: any) => map.set(i.id, i));
      cloudItems.forEach((i: any) => map.set(i.id, i));
      items = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
      
      // Update Cache
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    }
  }
  
  return items;
};

export const savePortfolioItem = async (item: PortfolioItem): Promise<boolean> => {
  try {
    // Save Local
    const current = await getPortfolioData();
    const index = current.findIndex(i => i.id === item.id);
    const updated = index >= 0 ? current.map((i, idx) => idx === index ? item : i) : [item, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    // Sync to Cloud
    if (isDatabaseConnected()) {
      await apiRequest('updateOne', {
        filter: { id: item.id },
        update: { $set: item },
        upsert: true
      });
    }
    return true;
  } catch {
    return false;
  }
};

export const deletePortfolioItem = async (id: string): Promise<void> => {
  const current = await getPortfolioData();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current.filter(i => i.id !== id)));
  
  if (isDatabaseConnected()) {
    await apiRequest('deleteOne', { filter: { id } });
  }
};

export const toggleFeaturedItem = async (id: string): Promise<boolean> => {
  const current = await getPortfolioData();
  const item = current.find(i => i.id === id);
  if (!item) return false;
  
  item.isFeatured = !item.isFeatured;
  return await savePortfolioItem(item);
};

// --- PROFILE ---

export const getUserProfile = (): UserProfile => {
  const cached = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
  return cached ? JSON.parse(cached) : (STATIC_PROFILE_DATA || {
    name: "User", role: "Kreator", bio: "", address: "", skills: [], education: [], experience: []
  });
};

export const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
  localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(profile));
  
  if (isDatabaseConnected()) {
    await apiRequest('updateOne', {
      collection: DB_CONFIG.profileCollection,
      filter: { type: 'main_profile' },
      update: { $set: { ...profile, type: 'main_profile' } },
      upsert: true
    });
  }
  return true;
};
