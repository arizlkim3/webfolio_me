
import React, { useEffect, useState } from 'react';
import { PortfolioItem, UserProfile, MediaType } from '../types';
import { getPortfolioData, deletePortfolioItem, getUserProfile } from '../services/storage';
import Button from './Button';
import ProfileSection from './ProfileSection';

interface ViewPageProps {
  isCreator: boolean;
}

type ViewTab = 'gallery' | 'about';

// Konfigurasi Section Kategori
const SECTIONS: { type: MediaType; label: string; description: string; icon: React.ReactNode }[] = [
  { 
    type: 'web', 
    label: 'Proyek Website', 
    description: 'Aplikasi web dan situs responsif.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  { 
    type: 'video', 
    label: 'Video & Sinematik', 
    description: 'Karya visual bergerak dan editing video.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    type: 'audio', 
    label: 'Audio & Musik', 
    description: 'Produksi suara, podcast, dan musik.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )
  },
  { 
    type: 'image', 
    label: 'Galeri Gambar', 
    description: 'Fotografi, desain grafis, dan ilustrasi.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }
];

const ViewPage: React.FC<ViewPageProps> = ({ isCreator }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ViewTab>('gallery');
  const [showSubMenu, setShowSubMenu] = useState(false);

  // Load data automatically
  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = getPortfolioData();
      const userProfile = getUserProfile();
      setItems(data);
      setProfile(userProfile);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus portofolio ini?')) {
      deletePortfolioItem(id);
      // Reload items only
      setTimeout(() => {
         const data = getPortfolioData();
         setItems(data);
      }, 200);
    }
  };

  const scrollToItem = (itemId: string) => {
    const element = document.getElementById(`item-${itemId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setShowSubMenu(false);
    }
  };

  const handleDownloadJson = () => {
    const fullData = {
       profile: profile,
       portfolio: items
    };
    
    const fileContent = `
/**
 * Salin isi file ini ke 'data/portfolioData.ts'
 */

export const STATIC_PORTFOLIO_DATA = ${JSON.stringify(items, null, 2)};

export const STATIC_PROFILE_DATA = ${JSON.stringify(profile, null, 2)};
    `;

    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = "portfolioData.ts.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to render media based on type
  const renderMedia = (item: PortfolioItem) => {
    const type = item.mediaType || 'image'; 
    const url = item.mediaUrl || '';

    if (!url && type === 'image') {
      return <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>;
    }

    if (type === 'web') {
      return (
        <div className="w-full h-full bg-slate-50 dark:bg-slate-900 flex flex-col relative group">
           <div className="bg-slate-200 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 px-3 py-1.5 flex items-center gap-1.5">
             <div className="w-2 h-2 rounded-full bg-red-400"></div>
             <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
             <div className="w-2 h-2 rounded-full bg-green-400"></div>
             <div className="ml-2 bg-white dark:bg-slate-900 text-[10px] text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded flex-1 truncate font-mono">
               {url.replace(/(^\w+:|^)\/\//, '')}
             </div>
           </div>
           
           <div className="flex-1 relative bg-white overflow-hidden">
             <iframe 
               src={url} 
               className="w-[200%] h-[200%] transform scale-50 origin-top-left border-0 pointer-events-none select-none"
               title={`Preview of ${item.title}`}
               sandbox="allow-scripts allow-same-origin"
             />
             <div className="absolute inset-0 bg-transparent z-10"></div>
           </div>
           
           <div className="absolute top-2 right-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none z-20">
             Website
           </div>
        </div>
      );
    }

    if (type === 'video') {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center relative group">
           <video 
             src={url} 
             controls 
             className="w-full h-full object-cover" 
             preload="metadata"
           />
           <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
             Video
           </div>
        </div>
      );
    }

    if (type === 'audio') {
      return (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-6 relative">
           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-purple-600 flex items-center justify-center mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
           </div>
           <audio src={url} controls className="w-full z-10 relative" />
           <div className="absolute top-2 right-2 bg-purple-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
             Audio
           </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full relative">
        <img 
          src={url} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Memuat portofolio...</p>
      </div>
    );
  }

  // Icons
  const GalleryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <div className="relative min-h-[80vh] animate-fade-in pb-24 md:pb-0">
      
      {/* FLOATING NAVIGATION WIDGET (CENTER LEFT) - DESKTOP ONLY */}
      <nav className="hidden md:flex flex-col gap-6 fixed left-6 top-1/2 -translate-y-1/2 z-50">
        
        {/* Gallery Button Container */}
        <div 
          className="relative group"
          onMouseEnter={() => setShowSubMenu(true)}
          onMouseLeave={() => setShowSubMenu(false)}
        >
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 shadow-xl ${
              activeTab === 'gallery'
                ? 'bg-primary text-white scale-110 shadow-primary/30'
                : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary hover:scale-105'
            }`}
          >
            <GalleryIcon />
            {activeTab === 'gallery' && (
              <span className="font-bold whitespace-nowrap pr-2 animate-fade-in">Galeri Karya</span>
            )}
          </button>

          {/* FLYOUT SUBMENU (Right Side) */}
          <div className={`absolute left-full top-0 ml-4 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 transition-all duration-300 origin-left ${
            showSubMenu ? 'opacity-100 scale-100 translate-x-0 visible' : 'opacity-0 scale-95 -translate-x-4 invisible pointer-events-none'
          }`}>
             
             <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                Daftar Portofolio
             </div>
             <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.length > 0 ? items.map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToItem(item.id);
                      setActiveTab('gallery');
                    }}
                    className="text-left text-sm text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 truncate transition-all duration-200"
                  >
                    {item.title}
                  </button>
                )) : (
                   <div className="text-sm text-slate-400 italic px-2">Belum ada karya ditambahkan.</div>
                )}
             </div>
          </div>
        </div>

        {/* Profile Button */}
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 shadow-xl w-fit ${
            activeTab === 'about'
              ? 'bg-primary text-white scale-110 shadow-primary/30'
              : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary hover:scale-105'
          }`}
        >
          <ProfileIcon />
          {activeTab === 'about' && (
              <span className="font-bold whitespace-nowrap pr-2 animate-fade-in">Profil</span>
          )}
        </button>

      </nav>

      {/* CONTENT AREA - Full Width */}
      <div className="w-full min-w-0 transition-all duration-300">
        {activeTab === 'about' ? (
          <div className="animate-fade-in max-w-5xl mx-auto">
             {profile ? (
               <ProfileSection profile={profile} />
             ) : (
               <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                 Profil belum diatur.
               </div>
             )}
          </div>
        ) : (
          <div className="animate-fade-in md:pl-20">
            {/* Header Gallery */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <div className=""> 
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Galeri Portofolio</span>
                  <span className="text-xs md:text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-3 rounded-full font-normal border border-slate-200 dark:border-slate-700">
                    {items.length}
                  </span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-lg">
                  Kumpulan proyek terbaik dan karya kreatif terbaru.
                </p>
              </div>

              {/* Export Button for Creator */}
              {isCreator && (
                <Button 
                  variant="secondary" 
                  onClick={handleDownloadJson}
                  className="flex items-center justify-center gap-2 w-full md:w-auto text-sm py-2.5"
                  title="Download JSON untuk dimasukkan ke folder proyek"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Data
                </Button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm mx-auto">
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Belum ada Portofolio</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md px-4">
                  {isCreator ? "Mulai tambahkan karya Anda di halaman Buat." : "Pemilik belum menambahkan portofolio."}
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {SECTIONS.map((section) => {
                  const sectionItems = items
                    .filter(item => (item.mediaType || 'image') === section.type)
                    .sort((a, b) => a.title.localeCompare(b.title));

                  if (sectionItems.length === 0) return null;

                  return (
                    <div key={section.type} className="animate-fade-in">
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary">
                          {section.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {section.label}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{section.description}</p>
                        </div>
                        <span className="ml-auto bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {sectionItems.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {sectionItems.map((item) => (
                          <div id={`item-${item.id}`} key={item.id} className="group bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 shadow-md shadow-slate-200/50 dark:shadow-none scroll-mt-32">
                            
                            <div className="h-48 md:h-56 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                              {renderMedia(item)}
                            </div>

                            <div className="p-5 md:p-6 flex flex-col flex-grow">
                              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{item.title}</h3>
                              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">{item.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-6">
                                {item.tags.map((tag, idx) => (
                                  <span key={idx} className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-primary px-2 py-1 rounded-md">
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                                {item.projectUrl ? (
                                  <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 px-4 rounded-lg bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 text-sm font-medium transition-colors">
                                    Lihat Proyek
                                  </a>
                                ) : (
                                  <span className="flex-1 text-center py-2.5 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm cursor-not-allowed">
                                    No Link
                                  </span>
                                )}
                                
                                {isCreator && (
                                  <button onClick={() => handleDelete(item.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
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

      {/* MOBILE BOTTOM FLOATING DOCK (ONLY FOR GUEST, HIDDEN IF CREATOR) */}
      {!isCreator && (
        <nav className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl z-50 p-2 flex justify-between items-center px-6">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
              activeTab === 'gallery'
                ? 'text-primary bg-primary/10'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <GalleryIcon />
            <span className="text-[10px] font-semibold mt-1">Galeri</span>
          </button>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2"></div>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
              activeTab === 'about'
                ? 'text-primary bg-primary/10'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <ProfileIcon />
            <span className="text-[10px] font-semibold mt-1">Profil</span>
          </button>
        </nav>
      )}
      
      {/* Scrollbar Custom Style for Flyout */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default ViewPage;
