
import React, { useEffect, useState, useMemo } from 'react';
import { PortfolioItem, UserProfile, MediaType } from '../types';
import { getPortfolioData, deletePortfolioItem, getUserProfile, toggleFeaturedItem, isDatabaseConnected } from '../services/storage';
import ProfileSection from './ProfileSection';

interface ViewPageProps {
  isCreator: boolean;
  activeTab: 'gallery' | 'about';
  setActiveTab: (tab: 'gallery' | 'about') => void;
  onModalToggle?: (isOpen: boolean) => void;
  isChatOpen?: boolean;
  onChatToggle?: () => void;
}

const SECTIONS: { type: MediaType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'certificate', label: 'Sertifikat', color: 'from-blue-500 to-indigo-600', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
  { type: 'web', label: 'Website', color: 'from-emerald-500 to-teal-600', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> },
  { type: 'image', label: 'Karya Visual', color: 'from-purple-500 to-pink-600', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
];

const ViewPage: React.FC<ViewPageProps> = ({ isCreator, activeTab, onModalToggle }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getPortfolioData();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const profile = useMemo(() => getUserProfile(), []);
  const isCloudOn = isDatabaseConnected();

  const handleToggleFav = async (id: string) => {
    await toggleFeaturedItem(id);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus selamanya?')) {
      await deletePortfolioItem(id);
      loadData();
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Menghubungkan Database...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {activeTab === 'about' ? (
        <ProfileSection profile={profile} />
      ) : (
        <div className="space-y-12">
          {/* Status Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/10 dark:bg-slate-900/40 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/20">
            <div>
              <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary uppercase tracking-tighter">Eksplorasi Karya</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isCloudOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{isCloudOn ? 'Vercel + MongoDB Connected' : 'Local Storage Mode'}</span>
              </div>
            </div>
          </div>

          {/* Gallery Sections */}
          {SECTIONS.map(section => {
            const sectionItems = items.filter(i => (i.mediaType === section.type) || (section.type === 'image' && !['certificate', 'web'].includes(i.mediaType)));
            if (sectionItems.length === 0) return null;

            return (
              <div key={section.type} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">{section.icon}</div>
                  <h3 className="text-lg font-black uppercase tracking-tight">{section.label}</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sectionItems.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => { setSelectedItem(item); onModalToggle?.(true); }}
                      className="group relative aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 shadow-xl"
                    >
                      <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Admin Tools */}
                      {isCreator && (
                        <div className="absolute top-3 right-3 flex gap-2 z-20">
                          <button onClick={(e) => { e.stopPropagation(); handleToggleFav(item.id); }} className={`p-2 rounded-full backdrop-blur-md border ${item.isFeatured ? 'bg-rose-500 border-rose-400 text-white' : 'bg-white/20 border-white/30 text-white'}`}>
                            <svg className="h-3.5 w-3.5" fill={item.isFeatured ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                          </button>
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="font-black text-xs md:text-sm uppercase tracking-tight truncate mb-1">{item.title}</h4>
                        <div className="flex gap-1">
                          {item.tags.slice(0, 2).map(t => <span key={t} className="text-[7px] font-bold bg-white/10 px-1.5 py-0.5 rounded uppercase">#{t}</span>)}
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

      {/* Modal Detail (Simplified) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-fade-in" onClick={() => {setSelectedItem(null); onModalToggle?.(false);}}>
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"></div>
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center overflow-hidden">
                <img src={selectedItem.mediaUrl} alt={selectedItem.title} className="w-full h-full object-contain" />
              </div>
              <div className="w-full md:w-2/5 p-8 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary/20 text-primary text-[9px] font-black uppercase rounded-lg">{selectedItem.mediaType}</span>
                    {selectedItem.isFeatured && <span className="px-3 py-1 bg-rose-500/20 text-rose-500 text-[9px] font-black uppercase rounded-lg">Featured</span>}
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-white mb-4 uppercase tracking-tighter">{selectedItem.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{selectedItem.description}</p>
                </div>
                
                <div className="space-y-4">
                  {selectedItem.projectUrl && (
                    <a href={selectedItem.projectUrl} target="_blank" className="block w-full py-4 bg-primary text-white text-center font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all">Buka Project →</a>
                  )}
                  {isCreator && (
                    <button onClick={() => handleDelete(selectedItem.id)} className="block w-full py-4 bg-red-500/10 text-red-500 text-center font-black text-xs uppercase tracking-[0.2em] rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">Hapus Item</button>
                  )}
                  <button onClick={() => {setSelectedItem(null); onModalToggle?.(false);}} className="block w-full py-2 text-slate-500 font-bold text-[10px] uppercase">Tutup Preview</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPage;
