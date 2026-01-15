
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

      {/* Floating Navbar - Orchestrated fly-in entrance */}
      <header className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-[60] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-0 -translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div className="flex justify-between items-center w-full">
          
          {/* Logo Section - Fly in from Left */}
          <div className="flex items-center gap-3 p-1.5 pr-4 md:pr-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-800/60 shadow-xl opacity-0 animate-fly-in-left animation-delay-200">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${role === 'creator' ? 'from-secondary to-purple-600' : 'from-primary to-blue-600'} shadow-lg ring-1 ring-white/30`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base md:text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 leading-none uppercase tracking-tighter">4RISE</h1>
              <span className="text-[7px] md:text-[8px] text-primary font-bold uppercase tracking-widest mt-0.5">{role === 'creator' ? 'ADMIN' : 'GUEST'}</span>
            </div>
          </div>

          {/* Nav Tabs - Fly in from Top */}
          <nav className="flex items-center p-1.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-800/60 shadow-xl opacity-0 animate-fly-in-top animation-delay-100">
            <button 
              onClick={() => setActiveTab('view')} 
              className={`px-4 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-tight transition-all duration-300 ${activeTab === 'view' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}
            >
              Galeri
            </button>
            {role === 'creator' && (
              <>
                <button 
                  onClick={() => setActiveTab('profile')} 
                  className={`hidden sm:block px-4 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-tight transition-all duration-300 ${activeTab === 'profile' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-primary'}`}
                >
                  Profil
                </button>
                <button 
                  onClick={() => setActiveTab('create')} 
                  className={`ml-1 px-4 md:px-8 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-tight transition-all duration-300 ${activeTab === 'create' ? 'bg-secondary text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-secondary'}`}
                >
                  + Karya
                </button>
              </>
            )}
          </nav>

          {/* Utility - Fly in from Right */}
          <div className="flex items-center p-1.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-800/60 shadow-xl opacity-0 animate-fly-in-right animation-delay-300">
             <button onClick={toggleTheme} className="p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary transition-all active:scale-90">
                {theme === 'dark' ? 
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : 
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                }
             </button>
             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
             <button onClick={handleLogout} className="p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 transition-all active:scale-90" title="Keluar">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
             </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-32 md:pb-8 relative w-full">
        {activeTab === 'create' && role === 'creator' ? (
          <CreatePage onSuccess={() => setActiveTab('view')} />
        ) : activeTab === 'profile' && role === 'creator' ? (
           <EditProfile onSuccess={() => setActiveTab('view')} />
        ) : (
          <ViewPage 
            isCreator={role === 'creator'} 
            onModalToggle={setIsModalOpen} 
          />
        )}
      </main>

      <footer className={`bg-transparent py-8 mt-auto transition-all duration-300 pb-32 md:pb-8 relative z-10 ${isModalOpen ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} 4RISE. Built with passion.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
