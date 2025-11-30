
import React, { useState, useEffect } from 'react';
import { TabView, UserRole, Theme } from './types';
import CreatePage from './components/CreatePage';
import ViewPage from './components/ViewPage';
import LandingPage from './components/LandingPage';
import EditProfile from './components/EditProfile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('view');
  const [role, setRole] = useState<UserRole | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  if (!role) {
    return <LandingPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <div className="flex items-center gap-3 shrink-0">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${role === 'creator' ? 'from-secondary to-purple-600' : 'from-primary to-blue-600'} shadow-lg shadow-indigo-500/20`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 leading-none">
                  Webfolio
                </h1>
                <span className="hidden md:block text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Mode: {role === 'creator' ? 'Pemilik (Admin)' : 'Pengunjung'}
                </span>
              </div>
            </div>
            
            <nav className="flex items-center gap-2 md:gap-4">
              {/* DESKTOP MENU - HIDDEN ON MOBILE */}
              <div className="hidden md:flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                <button
                  onClick={() => setActiveTab('view')}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                    activeTab === 'view'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  Galeri
                </button>
                
                {role === 'creator' && (
                  <>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                        activeTab === 'profile'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      Profil
                    </button>
                    <button
                      onClick={() => setActiveTab('create')}
                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                        activeTab === 'create'
                          ? 'bg-secondary text-white shadow-md shadow-secondary/25'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      + Karya
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 md:p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <div className="hidden md:block w-px h-5 md:h-6 bg-slate-200 dark:bg-slate-700 mx-0 md:mx-1"></div>

              <button
                onClick={handleLogout}
                className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                title="Keluar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full pb-24 md:pb-8">
        {activeTab === 'create' && role === 'creator' ? (
          <CreatePage onSuccess={() => setActiveTab('view')} />
        ) : activeTab === 'profile' && role === 'creator' ? (
           <EditProfile onSuccess={() => setActiveTab('view')} />
        ) : (
          <ViewPage isCreator={role === 'creator'} />
        )}
      </main>

      {/* MOBILE BOTTOM TASKBAR (CREATOR ONLY) */}
      {role === 'creator' && (
        <>
          {/* Popup Menu Opsi Tambahan */}
          {isMobileMenuOpen && (
            <div 
              className="md:hidden fixed bottom-24 right-6 z-50 flex flex-col gap-3 animate-fade-in-up"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <button 
                onClick={() => setActiveTab('create')}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 backdrop-blur-md transition-all ${activeTab === 'create' ? 'bg-secondary text-white' : 'bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200'}`}
              >
                <span className="font-medium">+ Buat Karya</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
              
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 backdrop-blur-md transition-all ${activeTab === 'profile' ? 'bg-secondary text-white' : 'bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200'}`}
              >
                <span className="font-medium">Edit Profil</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </button>
            </div>
          )}
          
          {/* Main Taskbar */}
          <nav className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 flex justify-between px-2 py-2">
            
            <button
              onClick={() => { setActiveTab('view'); setIsMobileMenuOpen(false); }}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${
                activeTab === 'view'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-[10px] font-bold">Galeri</span>
            </button>

            <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 self-center mx-1"></div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${
                isMobileMenuOpen || activeTab === 'create' || activeTab === 'profile'
                  ? 'bg-secondary/10 text-secondary'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mb-0.5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileMenuOpen ? (
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    )}
                  </svg>
                  {/* Indicator dot if on sub-page but menu closed */}
                  {!isMobileMenuOpen && (activeTab === 'create' || activeTab === 'profile') && (
                     <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white dark:border-slate-900"></div>
                  )}
              </div>
              <span className="text-[10px] font-bold">Opsi Lain</span>
            </button>
          </nav>

          {/* Overlay to close menu when clicking outside */}
          {isMobileMenuOpen && (
             <div className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          )}
        </>
      )}

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6 md:py-8 mt-auto transition-colors duration-300 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-500 text-xs md:text-sm">
            &copy; {new Date().getFullYear()} Webfolio Builder.
          </p>
        </div>
      </footer>
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
