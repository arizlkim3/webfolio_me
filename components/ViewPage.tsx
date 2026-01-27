
import React, { useEffect, useState, useMemo } from 'react';
import { PortfolioItem, UserProfile, MediaType } from '../types';
import { getPortfolioData, deletePortfolioItem, getUserProfile, toggleFeaturedItem } from '../services/storage';
import ProfileSection from './ProfileSection';

interface ViewPageProps {
  isCreator: boolean;
  activeTab: 'gallery' | 'about';
  setActiveTab: (tab: 'gallery' | 'about') => void;
  onModalToggle?: (isOpen: boolean) => void;
  isChatOpen?: boolean;
  onChatToggle?: () => void;
}

type GalleryViewMode = 'all' | 'categories';
type ItemDisplayMode = 'grid' | 'list';
type GridColumnCount = 1 | 2 | 3;

const SECTIONS: { type: MediaType; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  { type: 'certificate', label: 'Sertifikat', description: 'Pencapaian profesional.', color: 'from-indigo-500 to-blue-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 00.806 1.946 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438z" /></svg> },
  { type: 'web', label: 'Website', description: 'Aplikasi & situs.', color: 'from-emerald-500 to-teal-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> },
  { type: '3d', label: '3D Design', description: 'Karya tiga dimensi.', color: 'from-orange-500 to-amber-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg> },
  { type: 'movie', label: 'Movie', description: 'Karya sinematik.', color: 'from-slate-900 to-indigo-900', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V20M17 4V20M3 8H7M17 8H21M3 12H21M3 16H7M17 16H21M4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20Z" /></svg> },
  { type: 'video', label: 'Video', description: 'Visual bergerak.', color: 'from-rose-500 to-pink-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { type: 'audio', label: 'Audio', description: 'Produksi suara.', color: 'from-amber-500 to-orange-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg> },
  { type: 'image', label: 'Gambar', description: 'Fotografi & desain.', color: 'from-violet-500 to-purple-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
];

const truncateByWords = (str: string, maxWords: number) => {
  if (!str) return '';
  const words = str.trim().split(/\s+/);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return str;
};

const MediaItem: React.FC<{ item: PortfolioItem; isMinimal?: boolean; useZoomLoop?: boolean; isModal?: boolean }> = ({ item, isMinimal, useZoomLoop, isModal }) => {
  const [isLoading, setIsLoading] = useState(true);
  const type = item.mediaType || 'image';
  const url = item.mediaUrl || '';
  const handleLoad = () => setIsLoading(false);

  const isUrlImage = (u: string) => u.startsWith('data:image/') || /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(u);

  // Kategori 3D sekarang dirender sebagai gambar Render agar aplikasi tetap ringan
  if (type === '3d' || type === 'certificate' || type === 'image' || type === 'movie' || (type === 'web' && isUrlImage(url))) {
    return (
      <div className={`w-full h-full relative bg-slate-200 dark:bg-slate-800 overflow-hidden`}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center shimmer-gradient animate-shimmer">
             <div className="flex flex-col items-center opacity-40 animate-pulse">
                <div className="w-8 h-8 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-400 dark:bg-slate-600 mb-2 flex items-center justify-center shadow-inner">
                   <svg className="w-4 h-4 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                </div>
             </div>
          </div>
        )}
        <img 
          src={url} 
          alt={item.title} 
          onLoad={handleLoad} 
          className={`w-full h-full transition-all duration-1000 ease-out ${useZoomLoop ? 'animate-slow-zoom' : 'group-hover:scale-110'} ${isLoading ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'} object-cover`} 
          loading="lazy" 
        />
        {type === '3d' && (
          <div className="absolute top-2 right-2 p-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/20">
             <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
          </div>
        )}
      </div>
    );
  }

  if (type === 'web' && isModal) return <iframe src={url} className="w-full h-full border-0 bg-white" title={item.title} />;
  if (type === 'video' && isModal) return <video src={url} controls autoPlay className="w-full h-full object-contain bg-black" />;
  if (type === 'audio' && isModal) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-slate-900">
         <div className="w-20 h-20 mb-6 rounded-3xl bg-primary/20 flex items-center justify-center animate-pulse border border-primary/30 shadow-2xl">
           <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 3V15.035A3.987 3.987 0 004 15a4 4 0 100 8 3.987 3.987 0 002.167-.651A3.996 3.996 0 0010 19V5.14l8-1.6V12.035A3.987 3.987 0 0016 12a4 4 0 100 8 3.987 3.987 0 002.167-.651A3.996 3.996 0 0022 16V4a1 1 0 00-.4-.8z"/></svg>
         </div>
         <audio src={url} controls autoPlay className="w-full max-w-md shadow-2xl" />
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
       <div className={`p-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-transform duration-[3000ms] group-hover:scale-110`}><svg className={`${isMinimal ? 'w-3 h-3' : 'w-6 h-6'} text-white/80`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg></div>
    </div>
  );
};

const FeaturedBanner: React.FC<{ items: PortfolioItem[] }> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % items.length), 6000);
    return () => clearInterval(timer);
  }, [items.length]);
  if (items.length === 0) return null;
  const activeItem = items[currentIndex];

  const titleText = truncateByWords(activeItem.title, 4);
  const bannerTitleSize = titleText.length > 20 ? 'text-xl md:text-3xl' : 'text-2xl md:text-5xl';

  return (
    <div className="relative w-full h-[220px] md:h-[400px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-8 md:mb-12 shadow-2xl animate-scale-up group">
       <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800"><div key={activeItem.id} className="w-full h-full"><MediaItem item={activeItem} useZoomLoop={true} /></div><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div></div>
       <div className="absolute bottom-0 left-0 p-5 md:p-10 w-full max-w-2xl z-10">
         <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest mb-2 md:mb-3">
           <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-red-500 animate-pulse"></span>Karya Unggulan
         </div>
         <h2 className={`font-black text-white leading-none mb-2 md:mb-3 drop-shadow-md transition-all duration-500 ${bannerTitleSize}`}>
           {titleText}
         </h2>
         <p className="hidden md:block text-white/70 text-xs md:text-sm mb-5 max-w-xl">
           {truncateByWords(activeItem.description, 5)}
         </p>
         <div className="flex items-center gap-4">
           <a href={activeItem.projectUrl || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-primary text-white font-black text-[8px] md:text-[10px] hover:bg-white hover:text-primary transition-all shadow-xl active:scale-95">BUKA KARYA</a>
         </div>
       </div>
       {items.length > 1 && <div className="absolute bottom-4 right-6 flex gap-1 z-20">{items.map((_, idx) => <button key={idx} onClick={() => setCurrentIndex(idx)} className={`transition-all duration-500 rounded-full h-0.5 md:h-1 ${idx === currentIndex ? 'w-4 md:w-6 bg-primary' : 'w-1 bg-white/30'}`} />)}</div>}
    </div>
  );
};

const ViewPage: React.FC<ViewPageProps> = ({ isCreator, activeTab, setActiveTab, onModalToggle, isChatOpen, onChatToggle }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<GalleryViewMode>('all');
  const [displayMode, setDisplayMode] = useState<ItemDisplayMode>('grid');
  const [gridCols, setGridCols] = useState<GridColumnCount>(3);
  const [selectedCategory, setSelectedCategory] = useState<MediaType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleSelectItem = (item: PortfolioItem | null) => {
    setSelectedItem(item);
    if (onModalToggle) onModalToggle(!!item);
  };

  const loadData = () => {
    setLoading(true);
    setTimeout(() => { 
      setItems(getPortfolioData()); 
      setProfile(getUserProfile()); 
      setLoading(false); 
    }, 500);
  };

  useEffect(() => { loadData(); }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach(item => item.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (!isCreator && (item.mediaType || 'image') === 'movie') return false;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
      const matchesCategory = selectedCategory ? (item.mediaType || 'image') === selectedCategory : true;
      return matchesSearch && matchesTag && matchesCategory;
    });
  }, [items, searchQuery, selectedTag, selectedCategory, isCreator]);

  const availableSections = useMemo(() => {
    return SECTIONS.filter(section => isCreator || section.type !== 'movie');
  }, [isCreator]);

  const handleDelete = (id: string) => { if (window.confirm('Hapus portofolio ini secara permanen?')) { deletePortfolioItem(id); setTimeout(() => setItems(getPortfolioData()), 200); } };
  const handleToggleFeatured = (id: string) => { if (toggleFeaturedItem(id)) setItems(getPortfolioData()); };
  const getCount = (type: MediaType) => items.filter(i => (i.mediaType || 'image') === type).length;

  if (loading) return <div className="flex items-center justify-center py-40"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>;

  const getGridClass = () => {
    if (displayMode === 'list') return "flex flex-wrap gap-2";
    switch (gridCols) {
      case 1: return "grid grid-cols-1 gap-4 md:gap-8";
      case 2: return "grid grid-cols-2 gap-2 md:gap-6";
      case 3: return "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6";
      default: return "grid grid-cols-2 lg:grid-cols-3 gap-2";
    }
  };

  return (
    <div className="relative min-h-[80vh] pb-10">
      <div className="w-full">
        {activeTab === 'about' ? (
          <div className="animate-fade-in-up max-w-5xl mx-auto pt-6 md:pt-0">
            {profile ? <ProfileSection profile={profile} /> : <div>Profil belum diatur.</div>}
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-4 mb-6 md:mb-10 bg-white/10 dark:bg-slate-900/40 backdrop-blur-3xl p-4 md:p-6 rounded-[1.2rem] md:rounded-[2rem] border border-white/20 dark:border-slate-800/50 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="shrink-0 p-1.5 md:p-2 rounded-lg md:rounded-xl bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <h2 className="text-lg md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary leading-none uppercase tracking-tight">Eksplorasi</h2>
                </div>

                <div className="flex flex-row items-center justify-between md:justify-end gap-2 md:gap-3">
                  <div className="flex bg-slate-500/10 dark:bg-slate-400/10 p-0.5 md:p-1 rounded-lg md:rounded-xl border border-white/10 dark:border-slate-700/50 backdrop-blur-md">
                    <button onClick={() => { setViewMode('all'); setSelectedCategory(null); }} className={`px-2.5 py-1.5 md:px-4 md:py-2 rounded-md md:rounded-lg text-[8px] md:text-[9px] font-black transition-all ${viewMode === 'all' && !selectedCategory ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-500'}`}>SEMUA</button>
                    <button onClick={() => setViewMode('categories')} className={`px-2.5 py-1.5 md:px-4 md:py-2 rounded-md md:rounded-lg text-[8px] md:text-[9px] font-black transition-all ${viewMode === 'categories' || selectedCategory ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-500'}`}>KATEGORI</button>
                  </div>

                  <div className="flex bg-slate-500/10 dark:bg-slate-400/10 p-0.5 md:p-1 rounded-lg md:rounded-xl border border-white/10 dark:border-slate-700/50 backdrop-blur-md">
                    <button 
                      onClick={() => { setDisplayMode('grid'); setGridCols(1); }} 
                      className={`p-1.5 md:p-2 rounded-md md:rounded-lg transition-all ${displayMode === 'grid' && gridCols === 1 ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-400'}`}
                      title="1 Kolom"
                    >
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
                    </button>
                    <button 
                      onClick={() => { setDisplayMode('grid'); setGridCols(2); }} 
                      className={`p-1.5 md:p-2 rounded-md md:rounded-lg transition-all ${displayMode === 'grid' && gridCols === 2 ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-400'}`}
                      title="2 Kolom"
                    >
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="16" rx="1" /><rect x="13" y="4" width="7" height="16" rx="1" /></svg>
                    </button>
                    <button 
                      onClick={() => { setDisplayMode('grid'); setGridCols(3); }} 
                      className={`hidden md:flex p-1.5 md:p-2 rounded-md md:rounded-lg transition-all ${displayMode === 'grid' && gridCols === 3 ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-400'}`}
                      title="3 Kolom"
                    >
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1 self-center opacity-30"></div>
                    <button 
                      onClick={() => setDisplayMode('list')} 
                      className={`p-1.5 md:p-2 rounded-md md:rounded-lg transition-all ${displayMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-400'}`}
                      title="Mode List"
                    >
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2.5 border-t border-white/10 dark:border-slate-800/50 pt-4">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-64 px-4 py-2 bg-white/20 dark:bg-slate-800 border border-white/20 dark:border-slate-700 rounded-xl text-[10px] md:text-[11px] outline-none focus:ring-1 focus:ring-primary/40 backdrop-blur-md" placeholder="Cari karya..." />
                <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button onClick={() => setSelectedTag(null)} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[8px] md:text-[9px] font-black border transition-all ${selectedTag === null ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white/30 dark:bg-slate-800 border-white/20 dark:border-slate-700 text-slate-500'}`}>SEMUA</button>
                  {allTags.map(tag => <button key={tag} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[8px] md:text-[9px] font-black border transition-all whitespace-nowrap ${selectedTag === tag ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white/30 dark:bg-slate-800 border-white/20 dark:border-slate-700 text-slate-500'}`}>#{tag.toUpperCase()}</button>)}
                </div>
              </div>
            </div>

            {viewMode === 'categories' && !selectedCategory ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                {availableSections.map((section, idx) => (
                  <button 
                    key={section.type} 
                    onClick={() => setSelectedCategory(section.type)} 
                    className={`group relative aspect-square rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden shadow-lg border border-white/20 dark:border-slate-800 transition-all hover:scale-[1.02] active:scale-95 opacity-0 animate-scale-up animation-delay-${Math.min(1000, 500 + (idx * 100))}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                    <div className="relative h-full p-3 md:p-5 flex flex-col justify-between text-white text-left">
                      <div className="flex justify-between items-start">
                        <div className="p-1.5 md:p-2 bg-white/20 backdrop-blur-md rounded-lg md:rounded-xl shadow-inner">{section.icon}</div>
                        <span className="text-base md:text-xl font-black opacity-30">{getCount(section.type)}</span>
                      </div>
                      <div>
                        <h3 className="text-[10px] md:text-sm font-black mb-0.5 leading-none">{section.label}</h3>
                        <p className="hidden md:block text-[8px] text-white/70 font-bold uppercase tracking-widest leading-none">{section.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white/10 dark:bg-slate-800/10 rounded-[1.5rem] border-2 border-dashed border-white/20 dark:border-slate-700 opacity-0 animate-scale-up animation-delay-800">
                <p className="text-slate-400 font-black italic uppercase tracking-widest text-[10px]">Data Kosong</p>
              </div>
            ) : (
              <div className="space-y-8 md:space-y-12">
                {selectedCategory && (
                  <div className="flex items-center gap-3 mb-4 opacity-0 animate-fade-in-up animation-delay-200">
                    <button onClick={() => { setSelectedCategory(null); setViewMode('categories'); }} className="p-2 md:p-3 rounded-full bg-white/20 dark:bg-slate-800 border border-white/20 dark:border-slate-700 text-slate-500 hover:text-primary transition-all shadow-sm backdrop-blur-md">
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <h3 className="text-lg md:text-xl font-black tracking-tight">{SECTIONS.find(s => s.type === selectedCategory)?.label}</h3>
                  </div>
                )}
                {availableSections.map((section) => {
                  if (selectedCategory && selectedCategory !== section.type) return null;
                  const sectionItems = filteredItems.filter(item => (item.mediaType || 'image') === section.type);
                  if (sectionItems.length === 0) return null;
                  const sectionFeaturedItems = sectionItems.filter(i => i.isFeatured);
                  return (
                    <div key={section.type}>
                      {!selectedCategory && (
                        <div className="flex items-center gap-2 mb-4 md:mb-6 border-b border-white/10 dark:border-slate-800 pb-3 md:pb-4 opacity-0 animate-fly-in-left animation-delay-700">
                          <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg md:rounded-xl text-primary backdrop-blur-md">{section.icon}</div>
                          <h3 className="text-sm md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{section.label}</h3>
                        </div>
                      )}
                      {(!selectedTag && !searchQuery) && sectionFeaturedItems.length > 0 && <FeaturedBanner items={sectionFeaturedItems} />}
                      <div className={getGridClass()}>
                        {sectionItems.map((item, idx) => {
                          const displayTitle = truncateByWords(item.title, 4);
                          const displayDesc = truncateByWords(item.description, 5);
                          
                          const titleSizeClass = gridCols === 1 
                            ? (displayTitle.length > 20 ? 'text-2xl md:text-4xl' : 'text-3xl md:text-6xl')
                            : (displayTitle.length > 15 ? 'text-[11px] md:text-lg lg:text-xl' : 'text-[13px] md:text-2xl lg:text-3xl');
                          
                          const descSizeClass = gridCols === 1
                            ? (displayDesc.length > 30 ? 'text-xs md:text-lg' : 'text-sm md:text-xl')
                            : (displayDesc.length > 25 ? 'text-[8px] md:text-[10px] lg:text-[11px]' : 'text-[9px] md:text-xs lg:text-sm');

                          return displayMode === 'grid' ? (
                            <div key={item.id} onClick={() => handleSelectItem(item)} className={`group relative aspect-[3/4] rounded-[1.2rem] md:rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 opacity-0 animate-scale-up animation-delay-${Math.min(1000, 300 + (idx * 50))}`}>
                               <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900 overflow-hidden">
                                 <MediaItem item={item} />
                               </div>
                               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                               <div className={`absolute z-20 flex justify-between items-start w-full ${gridCols === 1 ? 'p-8' : 'p-4 md:p-6'}`}>
                                 <div className="flex flex-wrap gap-1">
                                   <span className={`px-2 py-0.5 md:px-2.5 md:py-0.8 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black uppercase tracking-tighter rounded-md md:rounded-lg shadow-sm ${gridCols === 1 ? 'text-[10px]' : 'text-[7px] md:text-[8px]'}`}>
                                     {/* Fixed: Use (section.type as string) to avoid narrowing issues with item.mediaType inside the filtered map. */}
                                     {(section.type as string) === '3d' ? '3D DESIGN' : item.mediaType?.toUpperCase()}
                                   </span>
                                   {item.isFeatured && (
                                     <span className={`px-1.5 py-0.5 md:px-2 md:py-0.8 bg-rose-500 text-white font-black uppercase tracking-tighter rounded-md md:rounded-lg shadow-sm animate-pulse ${gridCols === 1 ? 'text-[8px] md:text-[10px]' : 'text-[6px] md:text-[8px]'}`}>
                                       FAV
                                     </span>
                                   )}
                                 </div>
                                 {isCreator && (
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); handleToggleFeatured(item.id); }}
                                      className={`rounded-full backdrop-blur-2xl border transition-all duration-500 active:scale-75 ${item.isFeatured ? 'bg-rose-500/30 border-rose-500/50 text-rose-500 shadow-xl' : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/30 hover:text-white'} ${gridCols === 1 ? 'p-3 md:p-4' : 'p-2 md:p-3'}`}
                                   >
                                      <svg xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-500 ${item.isFeatured ? 'scale-110' : 'scale-100'} ${gridCols === 1 ? 'h-5 w-5 md:h-6 md:w-6' : 'h-4 w-4 md:h-5 md:w-5'}`} fill={item.isFeatured ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                      </svg>
                                   </button>
                                 )}
                               </div>
                               <div className={`absolute bottom-0 left-0 w-full text-white z-10 ${gridCols === 1 ? 'p-8 md:p-14' : 'p-5 md:p-8'}`}>
                                 <div className={`flex flex-wrap gap-1.5 mb-2 opacity-80 ${gridCols !== 1 ? 'hidden md:flex' : 'flex'}`}>
                                   {item.tags.slice(0, 3).map(tag => (
                                     <span key={tag} className={`bg-white/10 backdrop-blur-md rounded-md font-black text-white uppercase tracking-widest ${gridCols === 1 ? 'px-4 py-1.5 text-[10px]' : 'px-2 py-1 text-[8px]'}`}>#{tag}</span>
                                   ))}
                                 </div>
                                 <h3 className={`font-black leading-[1.1] tracking-tighter group-hover:text-primary transition-all duration-300 drop-shadow-2xl mb-1.5 md:mb-3 line-clamp-2 ${titleSizeClass}`}>
                                   {displayTitle}
                                 </h3>
                                 <p className={`text-white/80 leading-relaxed font-medium transition-all duration-500 opacity-70 group-hover:opacity-100 ${gridCols === 1 ? 'block max-w-3xl mb-8' : 'hidden md:block mb-6'} ${descSizeClass}`}>
                                   {displayDesc}
                                 </p>
                                 <div className={`items-center ${gridCols === 1 ? 'flex' : 'hidden md:flex'}`}>
                                   <span className={`font-black text-white bg-primary/95 border border-white/20 rounded-xl shadow-2xl transition-all uppercase tracking-widest hover:bg-white hover:text-primary active:scale-95 ${gridCols === 1 ? 'px-10 py-4 text-[10px] md:text-sm' : 'px-6 py-2.5 text-[9px] md:text-[10px]'}`}>
                                     {/* Fixed: Use (section.type as string) to avoid narrowing issues with item.mediaType inside the filtered map. */}
                                     {(section.type as string) === 'certificate' ? 'LIHAT SERTIFIKAT' : 'LIHAT KARYA'}
                                   </span>
                                 </div>
                               </div>
                            </div>
                          ) : (
                            <div key={item.id} onClick={() => handleSelectItem(item)} className={`group relative flex items-center gap-2.5 bg-white/30 dark:bg-slate-800/50 backdrop-blur-md pl-1 pr-3 py-1 border border-white/20 dark:border-slate-700 rounded-full hover:border-primary transition-all cursor-pointer active:scale-95 shadow-sm opacity-0 animate-fly-in-right animation-delay-${Math.min(1000, 300 + (idx * 40))}`}><div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-white/20 shadow-inner"><MediaItem item={item} isMinimal={true} /></div><span className="text-[9px] font-black text-slate-900 dark:text-white truncate max-w-[100px] uppercase tracking-tight leading-none">{displayTitle}</span></div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedItem && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-10 animate-fade-in"
          onClick={() => handleSelectItem(null)}
        >
           <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl"></div>
           <div 
             className="relative w-full max-w-7xl h-full md:h-[90vh] bg-slate-900 md:rounded-[3rem] overflow-hidden shadow-[0_0_200px_rgba(0,0,0,0.9)] border-0 md:border border-white/10 animate-scale-up"
             onClick={(e) => e.stopPropagation()}
           >
              {selectedItem.mediaType === 'certificate' ? (
                /* Layout Khusus Sertifikat di Lihat Detail - Horizontal Side by Side */
                <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
                  {/* Left: Image Viewer */}
                  <div className="w-full md:w-[55%] h-[40%] md:h-full relative overflow-hidden bg-slate-800 border-b md:border-b-0 md:border-r border-white/10">
                    <MediaItem item={selectedItem} isModal={true} useZoomLoop={true} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/40 pointer-events-none"></div>
                  </div>
                  
                  {/* Right: Info Content */}
                  <div className="flex-1 h-[60%] md:h-full bg-slate-900/40 backdrop-blur-3xl p-6 md:p-16 flex flex-col justify-center overflow-y-auto no-scrollbar">
                    <div className="flex gap-2.5 mb-6 md:mb-10">
                       <span className="px-4 py-1.5 bg-primary/20 text-primary text-[9px] md:text-xs font-black uppercase tracking-[0.2em] rounded-lg border border-primary/30">
                          {selectedItem.mediaType}
                       </span>
                       {selectedItem.isFeatured && (
                          <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-500/20 text-rose-500 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] rounded-lg border border-rose-500/30">
                             UNGGULAN
                          </div>
                       )}
                    </div>
                    
                    <h2 className={`font-black text-white mb-4 md:mb-8 leading-[1.1] tracking-tighter drop-shadow-2xl ${selectedItem.title.length > 25 ? 'text-3xl md:text-6xl' : 'text-4xl md:text-7xl'}`}>
                       {selectedItem.title}
                    </h2>
                    
                    <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-10">
                       {selectedItem.tags.map(tag => (
                         <span key={tag} className="px-4 py-1.5 bg-white/5 backdrop-blur-xl rounded-xl text-[8px] md:text-xs font-bold text-white/60 uppercase tracking-widest border border-white/10">#{tag}</span>
                       ))}
                    </div>

                    <p className="text-white/70 md:text-white/80 leading-relaxed max-w-2xl mb-8 md:mb-14 whitespace-pre-line font-medium text-xs md:text-lg">
                       {selectedItem.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                       {selectedItem.projectUrl && (
                          <a 
                            href={selectedItem.projectUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 py-5 md:px-14 md:py-6 bg-primary text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(99,102,241,0.4)] hover:bg-white hover:text-primary transition-all active:scale-95"
                          >
                             LIHAT SERTIFIKAT
                             <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                       )}
                       {isCreator && (
                         <div className="flex gap-2.5 w-full sm:w-auto">
                            <button 
                               onClick={() => { handleToggleFeatured(selectedItem.id); handleSelectItem(getPortfolioData().find(i => i.id === selectedItem.id) || null); }}
                               className={`p-5 md:p-6 rounded-2xl md:rounded-3xl border transition-all ${selectedItem.isFeatured ? 'bg-rose-500/30 border-rose-500/50 text-rose-500' : 'bg-white/10 border-white/20 text-white hover:bg-white/10'}`}
                            >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-7 md:w-7" fill={selectedItem.isFeatured ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                               </svg>
                            </button>
                            <button 
                               onClick={() => { handleDelete(selectedItem.id); handleSelectItem(null); }}
                               className="p-5 md:p-6 bg-red-500/20 border border-red-500/30 text-red-500 rounded-2xl md:rounded-3xl hover:bg-red-500 hover:text-white transition-all"
                            >
                               <svg className="w-5 h-5 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Layout Default untuk Tipe Lainnya di Lihat Detail */
                <>
                  <div className="absolute inset-0 z-0">
                    <MediaItem item={selectedItem} isModal={true} useZoomLoop={true} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/10 z-10 pointer-events-none"></div>
                  <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 z-30 flex justify-between items-center">
                    <div className="flex gap-2.5">
                        <span className="px-4 py-1.5 md:px-5 md:py-2 bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-[9px] md:text-xs font-black uppercase tracking-widest rounded-full">
                          {selectedItem.mediaType === '3d' ? '3D DESIGN' : selectedItem.mediaType}
                        </span>
                        {selectedItem.isFeatured && (
                          <div className="flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 bg-rose-500/20 backdrop-blur-2xl border border-rose-500/50 text-rose-500 text-[9px] md:text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_30px_rgba(244,63,94,0.4)]">
                              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                              UNGGULAN
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-5 pb-8 md:p-20 z-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10 animate-fade-in-up animation-delay-300 pointer-events-none">
                    <div className="max-w-4xl pointer-events-auto">
                        <div className="flex flex-wrap gap-2 md:gap-2.5 mb-3 md:mb-6">
                          {selectedItem.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 md:px-4 md:py-1.5 bg-white/5 backdrop-blur-xl rounded-lg md:rounded-xl text-[8px] md:text-xs font-black text-white/60 uppercase tracking-widest border border-white/10">#{tag}</span>
                          ))}
                        </div>
                        <h2 className={`font-black text-white mb-2 md:mb-6 leading-none tracking-tighter drop-shadow-2xl ${selectedItem.title.length > 25 ? 'text-3xl md:text-6xl' : 'text-4xl md:text-8xl'}`}>
                          {selectedItem.title}
                        </h2>
                        <p className={`text-white/70 md:text-white/80 leading-relaxed max-w-3xl mb-6 md:mb-12 whitespace-pre-line font-medium drop-shadow-lg ${selectedItem.description.length > 100 ? 'text-[11px] md:text-lg' : 'text-xs md:text-xl'}`}>
                          {selectedItem.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-5">
                          {selectedItem.projectUrl && (
                              <a 
                                href={selectedItem.projectUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-full sm:w-auto flex items-center justify-center gap-3 md:gap-4 px-10 py-3.5 md:px-12 md:py-6 bg-primary text-white font-black text-xs md:text-base uppercase tracking-[0.3em] rounded-xl md:rounded-3xl shadow-[0_20px_50px_rgba(99,102,241,0.5)] hover:bg-white hover:text-primary transition-all active:scale-95"
                              >
                                {selectedItem.mediaType === 'movie' ? 'TONTON FILM' : selectedItem.mediaType === 'certificate' ? 'LIHAT SERTIFIKAT' : 'BUKA KARYA'}
                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </a>
                          )}
                          {isCreator && (
                              <div className="flex gap-2.5 w-full sm:w-auto">
                                <button 
                                  onClick={() => { handleToggleFeatured(selectedItem.id); handleSelectItem(getPortfolioData().find(i => i.id === selectedItem.id) || null); }}
                                  className={`flex-1 sm:flex-none p-3.5 md:p-6 rounded-xl md:rounded-3xl border transition-all shadow-xl ${selectedItem.isFeatured ? 'bg-rose-500/30 border-rose-500/50 text-rose-500' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-8 md:w-8" fill={selectedItem.isFeatured ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => { handleDelete(selectedItem.id); handleSelectItem(null); }}
                                  className="flex-1 sm:flex-none p-3.5 md:p-6 bg-red-500/30 border border-red-500/50 text-red-500 rounded-xl md:rounded-3xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                >
                                  <svg className="w-5 h-5 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                          )}
                        </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Global Modal Close Button */}
              <div className="absolute top-6 right-6 md:top-8 md:right-8 z-[100]">
                <button 
                  onClick={() => handleSelectItem(null)} 
                  className="p-3 md:p-4 bg-white/10 backdrop-blur-2xl border border-white/20 text-white hover:bg-white/30 rounded-full transition-all group active:scale-90 shadow-2xl"
                >
                    <svg className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ViewPage;
