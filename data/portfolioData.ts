
import { PortfolioItem, UserProfile } from '../types';

/**
 * DATA PORTOFOLIO STATIS
 * ----------------------
 * Gunakan file ini untuk menyimpan data permanen yang tidak ingin hilang saat clear cache.
 * Jika Anda ingin sebuah karya muncul di banner "Karya Unggulan", tambahkan properti: 
 * isFeatured: true
 */

export const STATIC_PORTFOLIO_DATA: PortfolioItem[] = [
  /* Contoh format data:
  {
    id: "p1",
    title: "Project Sample",
    description: "Ini adalah deskripsi project",
    mediaUrl: "https://picsum.photos/800/600",
    mediaType: "image",
    projectUrl: "https://google.com",
    tags: ["Design", "Web"],
    createdAt: Date.now(),
    isFeatured: true // Muncul di banner kategori
  }
  */
];

export const STATIC_PROFILE_DATA: UserProfile | null = null;
