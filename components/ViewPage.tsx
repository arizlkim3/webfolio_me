
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

const SECTIONS: { type: MediaType; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  { type: 'certificate', label: 'Sertifikat', description: 'Pencapaian profesional.', color: 'from-indigo-500 to-blue-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
  { type: 'web', label: 'Website', description: 'Aplikasi & situs.', color: 'from-emerald-500 to-teal-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> },
  { type: 'video', label: 'Video', description: 'Visual bergerak.', color: 'from-rose-500 to-pink-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { type: 'audio', label: 'Audio', description: 'Produksi suara.', color: 'from-amber-500 to-orange-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg> },
  { type: 'image', label: 'Gambar', description: 'Fotografi & desain.', color: 'from-violet-500 to-purple-600', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
];

const MediaItem: React.FC<{ item: PortfolioItem; isMinimal?: boolean; useZoomLoop?: boolean; isModal?: boolean }> = ({ item, isMinimal, useZoomLoop, isModal }) => {
  const [isLoading, setIsLoading] = useState(true);
  const type = item.mediaType || 'image';
  const url = item.mediaUrl || '';
  const handleLoad = () => setIsLoading(false);

  const isUrlImage = (u: string) => u.startsWith('data:image/') || /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(u);

  if (type === 'certificate' || type === 'image' || (type === 'web' && isUrlImage(url))) {
    return (
      <div className={`w-full h-full relative bg-slate-200 dark:bg-slate-800 overflow-hidden`}>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center shimmer-gradient animate-shimmer">
             <div className="flex flex-col items-center opacity-40 animate-pulse">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-400 dark:bg-slate-600 mb-2 flex items-center justify-center shadow-inner">
                   <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                   </svg>
                </div>
                <span className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">4RISE Loading</span>
             </div>
          </div>
        )}
        <img src={url} alt={item.title} onLoad={handleLoad} className={`w-full h-full transition-all duration-700 ease-out ${useZoomLoop ? 'animate-slow-zoom' : 'group-hover:scale-110'} ${isLoading ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'} object-cover`} loading="lazy" />
      </div>
    );
  }

  if (type === 'web' && isModal) return <iframe src={url} className="w-full h-full border-0 bg-white" title={item.title} />;
  if (type === 'video' && isModal) return <video src={url} controls className="w-full h-full object-cover bg-black" />;
  if (type === 'audio' && isModal) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-900">
         <div className="w-12 h-12 mb-3 rounded-full bg-primary/20 flex items-center justify-center animate-pulse"><svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 3V15.035A3.987 3.987 0 004 15a4 4 0 100 8 3.987 3.987 0 002.167-.651A3.996 3.996 0 0010 19V5.14l8-1.6V12.035A3.987 3.987 0 0016 12a4 4 0 100 8 3.987 3.987 0 002.167-.651A3.996 3.996 0 0022 16V4a1 1 0 00-.4-.8z"/></svg></div>
         <audio src={url} controls className="w-full max-w-[200px]" />
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
       <div className={`p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-transform duration-[3000ms] group-hover:scale-110`}><svg className={`${isMinimal ? 'w-4 h-4' : 'w-8 h-8'} text-white/80`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg></div>
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
  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden mb-12 shadow-2xl animate-scale-up group border-4 border-white dark:border-slate-800">
       <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800"><div key={activeItem.id} className="w-full h-full"><MediaItem item={activeItem} useZoomLoop={true} /></div><div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div></div>
       <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full max-w-2xl z-10"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest mb-3"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>Karya Unggulan</div><h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3 drop-shadow-md">{activeItem.title}</h2><p className="text-white/70 text-xs md:text-sm line-clamp-2 mb-5 max-w-xl">{activeItem.description}</p><div className="flex items-center gap-4"><a href={activeItem.projectUrl || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-black text-[10px] hover:bg-white hover:text-primary transition-all shadow-xl active:scale-95">BUKA KARYA<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a></div></div>
       {items.length > 1 && <div className="absolute bottom-6 right-8 flex gap-1.5 z-20">{items.map((_, idx) => <button key={idx} onClick={() => setCurrentIndex(idx)} className={`transition-all duration-500 rounded-full h-1 ${idx === currentIndex ? 'w-6 bg-primary shadow-sm' : 'w-1 bg-white/30'}`} />)}</div>}
    </div>
  );
};

const ViewPage: React.FC<ViewPageProps> = ({ isCreator, activeTab, setActiveTab, onModalToggle, isChatOpen, onChatToggle }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<GalleryViewMode>('all');
  const [displayMode, setDisplayMode] = useState<ItemDisplayMode>('grid');
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
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
      const matchesCategory = selectedCategory ? (item.mediaType || 'image') === selectedCategory : true;
      return matchesSearch && matchesTag && matchesCategory;
    });
  }, [items, searchQuery, selectedTag, selectedCategory]);

  const handleDelete = (id: string) => { if (window.confirm('Hapus portofolio ini secara permanen?')) { deletePortfolioItem(id); setTimeout(() => setItems(getPortfolioData()), 200); } };
  const handleToggleFeatured = (id: string) => { if (toggleFeaturedItem(id)) setItems(getPortfolioData()); };
  const getCount = (type: MediaType) => items.filter(i => (i.mediaType || 'image') === type).length;

  if (loading) return <div className="flex items-center justify-center py-40"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>;

  return (
    <div className="relative min-h-[80vh] pb-10">
      <div className="w-full">
        {activeTab === 'about' ? (
          <div className="animate-fade-in-up max-w-5xl mx-auto pt-6 md:pt-0">
            {profile ? <ProfileSection profile={profile} /> : <div>Profil belum diatur.</div>}
          </div>
        ) : (
          <div>
            {/* Header Control Panel - Delay disesuaikan agar tidak tabrakan dengan Header Utama */}
            <div className="flex flex-col gap-4 mb-10 bg-white/10 dark:bg-slate-900/40 backdrop-blur-3xl p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/20 dark:border-slate-800/50 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 opacity-0 animate-fly-in-left animation-delay-500">
                  <div className="shrink-0 p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary leading-none uppercase tracking-tight">Eksplorasi</h2>
                </div>

                <div className="flex flex-row items-center justify-between md:justify-end gap-3 opacity-0 animate-fly-in-right animation-delay-500">
                  <div className="flex bg-slate-500/10 dark:bg-slate-400/10 p-1 rounded-xl border border-white/10 dark:border-slate-700/50 backdrop-blur-md flex-1 md:flex-none">
                    <button onClick={() => { setViewMode('all'); setSelectedCategory(null); }} className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${viewMode === 'all' && !selectedCategory ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-500'}`}>SEMUA</button>
                    <button onClick={() => setViewMode('categories')} className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${viewMode === 'categories' || selectedCategory ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-500'}`}>KATEGORI</button>
                  </div>
                  <div className="flex bg-slate-500/10 dark:bg-slate-400/10 p-1 rounded-xl border border-white/10 dark:border-slate-700/50 backdrop-blur-md">
                    <button onClick={() => setDisplayMode('grid')} className={`p-2 rounded-lg transition-all ${displayMode === 'grid' ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-400'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></button>
                    <button onClick={() => setDisplayMode('list')} className={`p-2 rounded-lg transition-all ${displayMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary shadow-md' : 'text-slate-400'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 border-t border-white/10 dark:border-slate-800/50 pt-4 opacity-0 animate-fly-in-bottom animation-delay-600">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-64 pl-5 pr-4 py-2.5 bg-white/20 dark:bg-slate-800 border border-white/20 dark:border-slate-700 rounded-xl text-[11px] outline-none focus:ring-1 focus:ring-primary/40 backdrop-blur-md" placeholder="Cari karya..." />
                <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button onClick={() => setSelectedTag(null)} className={`px-4 py-2 rounded-full text-[9px] font-black border transition-all ${selectedTag === null ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white/30 dark:bg-slate-800 border-white/20 dark:border-slate-700 text-slate-500'}`}>SEMUA</button>
                  {allTags.map(tag => <button key={tag} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)} className={`px-4 py-2 rounded-full text-[9px] font-black border transition-all whitespace-nowrap ${selectedTag === tag ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white/30 dark:bg-slate-800 border-white/20 dark:border-slate-700 text-slate-500'}`}>#{tag.toUpperCase()}</button>)}
                </div>
              </div>
            </div>

            {viewMode === 'categories' && !selectedCategory ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {SECTIONS.map((section, idx) => (
                  <button 
                    key={section.type} 
                    onClick={() => setSelectedCategory(section.type)} 
                    className={`group relative aspect-square rounded-[1.5rem] overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 transition-all hover:scale-[1.02] active:scale-95 opacity-0 animate-scale-up animation-delay-${Math.min(1000, 700 + (idx * 100))}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                    <div className="relative h-full p-5 flex flex-col justify-between text-white text-left">
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl shadow-inner">{section.icon}</div>
                        <span className="text-xl font-black opacity-30">{getCount(section.type)}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-black mb-0.5 leading-none">{section.label}</h3>
                        <p className="text-[8px] text-white/70 font-bold uppercase tracking-widest leading-none">{section.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white/10 dark:bg-slate-800/10 rounded-[2rem] border-2 border-dashed border-white/20 dark:border-slate-700 opacity-0 animate-scale-up animation-delay-800">
                <p className="text-slate-400 font-black italic uppercase tracking-widest text-xs">Data Kosong</p>
              </div>
            ) : (
              <div className="space-y-12">
                {selectedCategory && (
                  <div className="flex items-center gap-4 mb-6 opacity-0 animate-fade-in-up animation-delay-200">
                    <button onClick={() => { setSelectedCategory(null); setViewMode('categories'); }} className="p-3 rounded-full bg-white/20 dark:bg-slate-800 border border-white/20 dark:border-slate-700 text-slate-500 hover:text-primary transition-all shadow-sm backdrop-blur-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <h3 className="text-xl font-black tracking-tight">{SECTIONS.find(s => s.type === selectedCategory)?.label}</h3>
                  </div>
                )}
                {SECTIONS.map((section) => {
                  if (selectedCategory && selectedCategory !== section.type) return null;
                  const sectionItems = filteredItems.filter(item => (item.mediaType || 'image') === section.type);
                  if (sectionItems.length === 0) return null;
                  const sectionFeaturedItems = sectionItems.filter(i => i.isFeatured);
                  return (
                    <div key={section.type}>
                      {!selectedCategory && (
                        <div className="flex items-center gap-3 mb-6 border-b-2 border-white/20 dark:border-slate-800 pb-4 opacity-0 animate-fly-in-left animation-delay-700">
                          <div className="p-2 bg-primary/10 rounded-xl text-primary backdrop-blur-md">{section.icon}</div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{section.label}</h3>
                        </div>
                      )}
                      {(!selectedTag && !searchQuery) && sectionFeaturedItems.length > 0 && <FeaturedBanner items={sectionFeaturedItems} />}
                      <div className={displayMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" : "flex flex-wrap gap-3"}>
                        {sectionItems.map((item, idx) => (
                          displayMode === 'grid' ? (
                            <div key={item.id} onClick={() => handleSelectItem(item)} className={`group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl transition-all duration-300 border-4 border-white dark:border-slate-800 cursor-pointer hover:shadow-primary/20 hover:-translate-y-1 opacity-0 animate-scale-up animation-delay-${Math.min(1200, 800 + (idx * 100))}`}>
                               <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 overflow-hidden"><MediaItem item={item} /></div>
                               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent transition-opacity group-hover:opacity-80"></div>
                               <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 pr-8"><span className="px-2 py-0.5 bg-primary text-white text-[7px] font-black uppercase tracking-tighter rounded shadow-sm">{item.mediaType?.toUpperCase()}</span>{item.isFeatured && <span className="px-2 py-0.5 bg-red-500 text-white text-[7px] font-black uppercase tracking-tighter rounded shadow-sm animate-pulse">UNGGULAN</span>}</div>
                               <div className="absolute bottom-0 left-0 p-5 md:p-6 w-full text-white z-10"><div className="flex flex-wrap gap-1 mb-2">{item.tags.slice(0, 2).map(tag => <span key={tag} className="px-1.5 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[7px] font-black text-white/70 uppercase tracking-widest border border-white/10">#{tag}</span>)}</div><h3 className="text-base md:text-xl font-black leading-tight mb-2 group-hover:text-primary transition-colors truncate drop-shadow-md">{item.title}</h3><p className="text-white/60 text-[9px] md:text-xs line-clamp-2 mb-4 leading-relaxed font-medium">{item.description}</p><div className="flex items-center"><span className="text-[8px] font-black text-white bg-primary px-4 py-2 rounded-full shadow-lg group-hover:bg-white group-hover:text-primary transition-all uppercase tracking-widest">DETAIL →</span></div></div>
                            </div>
                          ) : (
                            <div key={item.id} onClick={() => handleSelectItem(item)} className={`group relative flex items-center gap-3 bg-white/30 dark:bg-slate-800/50 backdrop-blur-md pl-1.5 pr-4 py-1.5 border border-white/20 dark:border-slate-700 rounded-full hover:border-primary transition-all cursor-pointer active:scale-95 shadow-sm opacity-0 animate-fly-in-right animation-delay-${Math.min(1200, 800 + (idx * 50))}`}><div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/20 dark:border-slate-700 shadow-inner"><MediaItem item={item} isMinimal={true} /></div><div className="flex flex-col min-w-0"><span className="text-[10px] font-black text-slate-900 dark:text-white truncate max-w-[120px] uppercase tracking-tight leading-none">{item.title}</span><span className="text-[7px] font-bold text-primary">Detail Karya →</span></div></div>
                          )
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPage;
