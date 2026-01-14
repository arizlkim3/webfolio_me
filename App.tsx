
import React, { useState, useEffect } from 'react';
import { TabView, UserRole, Theme } from './types';
import { getUserProfile } from './services/storage';
import CreatePage from './components/CreatePage';
import ViewPage from './components/ViewPage';
import LandingPage from './components/LandingPage';
import EditProfile from './components/EditProfile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('view');
  const [role, setRole] = useState<UserRole | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setActiveTab('view');
  };

  const handleLogout = () => {
    setRole(null);
    setActiveTab('view');
  };

  const waNumber = getUserProfile().socials?.whatsapp || '6281476655793';
  const waLink = `https://wa.me/${waNumber}`;

  if (!role) {
    return <LandingPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 relative ${isModalOpen ? 'overflow-hidden' : 'overflow-x-hidden'}`}>
      
      {/* --- ANIMATED BACKGROUND LAYER --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-60 animate-grid-flow"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 dark:bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/20 dark:bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/20 dark:bg-pink-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar - Hidden when modal is open */}
      <header className={`fixed top-0 left-0 w-full z-40 bg-white/20 dark:bg-slate-900/40 backdrop-blur-2xl border-b border-white/20 dark:border-slate-800/50 transition-all duration-300 shadow-sm ${isModalOpen ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 shrink-0">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${role === 'creator' ? 'from-secondary to-purple-600' : 'from-primary to-blue-600'} shadow-lg shadow-indigo-500/20`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 leading-none uppercase tracking-tight">4RISE</h1>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">{role === 'creator' ? 'ADMIN' : 'PENGUNJUNG'}</span>
              </div>
            </div>
            
            <nav className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex p-1 rounded-xl bg-slate-500/5 dark:bg-slate-400/5 border border-white/20 dark:border-slate-700/50 backdrop-blur-md">
                <button onClick={() => setActiveTab('view')} className={`px-3 py-1.5 md:px-5 md:py-2 rounded-lg text-xs md:text-sm font-black uppercase tracking-tight transition-all duration-200 ${activeTab === 'view' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'}`}>Galeri</button>
                {role === 'creator' && (
                  <>
                    <button onClick={() => setActiveTab('profile')} className={`px-3 py-1.5 md:px-5 md:py-2 rounded-lg text-xs md:text-sm font-black uppercase tracking-tight transition-all duration-200 ${activeTab === 'profile' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'}`}>Profil</button>
                    <button onClick={() => setActiveTab('create')} className={`px-3 py-1.5 md:px-5 md:py-2 rounded-lg text-xs md:text-sm font-black uppercase tracking-tight transition-all duration-200 ${activeTab === 'create' ? 'bg-secondary text-white shadow-md shadow-secondary/25' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'}`}>+ Karya</button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-green-500/10 hover:text-[#25D366] transition-all border border-transparent hover:border-green-500/20 active:scale-90"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></a>
                <button onClick={toggleTheme} className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 dark:hover:bg-slate-400/10 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-90">{theme === 'dark' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}</button>
                <div className="w-px h-6 bg-slate-200/50 dark:bg-slate-700/50 mx-1"></div>
                <button onClick={handleLogout} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 md:pb-8 relative w-full">
        {activeTab === 'create' && role === 'creator' ? (
          <CreatePage onSuccess={() => setActiveTab('view')} />
        ) : activeTab === 'profile' && role === 'creator' ? (
           <EditProfile onSuccess={() => setActiveTab('view')} />
        ) : (
          <ViewPage isCreator={role === 'creator'} onModalToggle={setIsModalOpen} />
        )}
      </main>

      {/* Footer - Hidden when modal is open */}
      <footer className={`border-t border-slate-200 dark:border-slate-800 bg-white/10 dark:bg-slate-950/10 backdrop-blur-md py-6 md:py-8 mt-auto transition-all duration-300 pb-24 md:pb-8 relative z-10 ${isModalOpen ? 'opacity-0 translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} 4RISE. Built with passion.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
