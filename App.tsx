
import React, { useState, useEffect, useRef } from 'react';
import { TabView, UserRole, Theme } from './types';
import { getUserProfile } from './services/storage';
import CreatePage from './components/CreatePage';
import ViewPage from './components/ViewPage';
import LandingPage from './components/LandingPage';
import EditProfile from './components/EditProfile';
import FloatingChat from './components/FloatingChat';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const TOTAL_DURATION = 2800;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 100);

    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }, TOTAL_DURATION); 

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[300] flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      <div className="relative flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/30 dark:bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
        
        <div className="relative z-10 animate-scale-up">
           <h1 className="text-8xl md:text-[10rem] font-black bg-clip-text text-transparent bg-gradient-to-br from-primary via-indigo-500 to-secondary leading-none tracking-tighter">
            4RISE
          </h1>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="w-48 md:w-64 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-indigo-400 to-secondary transition-all ease-linear"
              style={{ 
                width: `${progress}%`,
                transitionDuration: `${TOTAL_DURATION}ms`
              }}
            ></div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em] animate-pulse">
              System Initializing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavigationItem {
  id: TabView;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabView>('gallery');
  const [role, setRole] = useState<UserRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsConnectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setActiveTab('gallery');
  };

  const handleLogout = () => {
    setRole(null);
    setActiveTab('gallery');
    setIsConnectOpen(false);
  };

  const profile = getUserProfile();
  const socialLinks = [
    { name: 'WhatsApp', url: `https://wa.me/${profile.socials?.whatsapp || '6281476655793'}`, icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>, color: 'text-[#25D366]' },
    { name: 'Instagram', url: profile.socials?.instagram || 'https://www.instagram.com/arizkim3/', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>, color: 'text-pink-600' },
    { name: 'GitHub', url: profile.socials?.github || 'https://github.com/arizlkim3', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>, color: 'text-slate-800 dark:text-white' },
    { name: 'Vercel', url: profile.socials?.vercel || 'https://vercel.com/arizlkim3s-projects', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512"><path d="M256 48l240 416H16z"/></svg>, color: 'text-slate-900 dark:text-white' },
  ];

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!role) {
    return <LandingPage onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  const navItems: NavigationItem[] = [
    { id: 'gallery' as TabView, label: 'Galeri', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'about' as TabView, label: 'Profil', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ];

  const creatorNavItems: NavigationItem[] = role === 'creator' ? [
    { id: 'profile' as TabView, label: 'Edit', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, color: 'bg-secondary' },
    { id: 'create' as TabView, label: 'Plus', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>, color: 'bg-emerald-500' },
  ] : [];

  const allNavItems = [...navItems, ...creatorNavItems];

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 relative ${isModalOpen ? 'overflow-hidden' : 'overflow-x-hidden'}`}>
      
      {/* Background Layer */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 md:opacity-60 animate-grid-flow"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 dark:bg-primary/5 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/10 dark:bg-secondary/5 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      {/* Header - Adjusted for optimal viewing (neither too big nor too small) */}
      <header className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-[110] transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-0 -translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div className="flex justify-between items-center w-full px-5 md:px-8 py-3 md:py-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-white/40 dark:border-slate-700/50 shadow-xl transition-all">
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`p-2 md:p-2.5 rounded-lg md:rounded-xl bg-gradient-to-br ${role === 'creator' ? 'from-secondary to-purple-600' : 'from-primary to-blue-600'} shadow-md`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-5 md:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 leading-none uppercase tracking-tight">4RISE</h1>
              <span className="text-[9px] md:text-[9px] text-primary font-bold uppercase tracking-widest mt-1 md:mt-0.5">{role === 'creator' ? 'ADMIN' : 'GUEST'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3" ref={dropdownRef}>
            <button 
              onClick={toggleTheme}
              className="p-2.5 md:p-2.5 rounded-lg md:rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all active:scale-95"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <div className="w-px h-5 md:h-6 bg-slate-200 dark:bg-slate-700 mx-1 opacity-50"></div>
            <button 
              onClick={() => setIsConnectOpen(!isConnectOpen)}
              className={`p-2.5 md:p-2.5 rounded-lg md:rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all active:scale-95 ${isConnectOpen ? 'bg-primary/10 text-primary' : ''}`}
            >
              <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2.5 md:p-2.5 rounded-lg md:rounded-xl text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
            >
              <svg className="h-5 w-5 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>

        {/* Connect Popover - Adjusted position */}
        <div className={`absolute top-full right-0 mt-3 w-48 md:w-64 bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl rounded-xl md:rounded-2xl border border-white/20 dark:border-slate-800 shadow-2xl p-2 md:p-3 z-[120] transition-all duration-300 origin-top-right
          ${isConnectOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
          <div className="space-y-1">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-3 py-2 md:py-2.5 rounded-lg md:rounded-xl hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group">
                <span className={`${link.color} transition-transform group-hover:scale-110`}>{link.icon}</span>
                <span className="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* --- DESKTOP SIDEBAR NAVIGATION --- */}
      <aside className={`fixed left-8 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col items-center p-1.5 bg-white/70 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[1.8rem] border border-white/40 dark:border-slate-800 shadow-2xl transition-all duration-500 ${isModalOpen ? 'opacity-0 -translate-x-20' : 'opacity-100 translate-x-0'}`}>
        {allNavItems.map((item, idx) => (
          <React.Fragment key={item.id}>
            {idx === 2 && <div className="w-6 h-px bg-slate-200 dark:bg-slate-700 my-2 mx-auto"></div>}
            <button 
              onClick={() => setActiveTab(item.id)} 
              className={`w-12 h-12 flex items-center justify-center transition-all relative group rounded-2xl active:scale-90 my-1`}
              title={item.label}
            >
              <div className={`absolute inset-0 rounded-2xl transition-all duration-400 ${activeTab === item.id ? (item.color || 'bg-primary') + ' scale-100 opacity-100 shadow-lg' : 'bg-primary/10 scale-0 opacity-0 group-hover:scale-90 group-hover:opacity-100'}`}></div>
              <div className={`relative z-10 transition-colors duration-300 ${activeTab === item.id ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary'}`}>
                {item.icon}
              </div>
            </button>
          </React.Fragment>
        ))}
      </aside>

      {/* Main Content Area - Padding adjusted for Slimmer Header */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-36 pb-32 md:pb-12 md:pl-32 relative w-full transition-all">
        {activeTab === 'create' && role === 'creator' ? (
          <CreatePage onSuccess={() => setActiveTab('gallery')} />
        ) : activeTab === 'profile' && role === 'creator' ? (
           <EditProfile onSuccess={() => setActiveTab('gallery')} />
        ) : (
          <ViewPage 
            isCreator={role === 'creator'} 
            activeTab={activeTab === 'about' ? 'about' : 'gallery'}
            setActiveTab={(tab) => setActiveTab(tab)}
            onModalToggle={setIsModalOpen} 
          />
        )}
      </main>

      {/* --- MOBILE/TABLET BOTTOM NAVIGATION --- */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 md:hidden ${isModalOpen ? 'opacity-0 translate-y-20' : 'opacity-100 translate-y-0'}`}>
        <div className="flex items-center gap-1.5 p-1.5 bg-white/70 dark:bg-slate-800/80 backdrop-blur-2xl rounded-full border border-white/40 dark:border-slate-700/50 shadow-2xl">
          {allNavItems.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx === 2 && <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1 opacity-40"></div>}
              <button 
                onClick={() => setActiveTab(item.id)} 
                className={`w-11 h-11 flex items-center justify-center transition-all relative group rounded-full active:scale-90`}
                title={item.label}
              >
                <div className={`absolute inset-0 rounded-full transition-all duration-400 ${activeTab === item.id ? (item.color || 'bg-primary') + ' scale-100 opacity-100 shadow-lg' : 'bg-primary/10 scale-0 opacity-0 group-hover:scale-90 group-hover:opacity-100'}`}></div>
                <div className={`relative z-10 transition-colors duration-300 ${activeTab === item.id ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-primary'}`}>
                  {item.icon}
                </div>
              </button>
            </React.Fragment>
          ))}
          {/* Live Chat Toggle for Mobile */}
          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1 opacity-40"></div>
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)} 
            className={`w-11 h-11 flex items-center justify-center transition-all relative group rounded-full active:scale-90 ${isChatOpen ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}
            title="Live Chat"
          >
             <div className={`absolute inset-0 rounded-full transition-all duration-400 ${isChatOpen ? 'bg-primary/10 scale-100 opacity-100 shadow-sm' : 'bg-primary/10 scale-0 opacity-0 group-hover:scale-90 group-hover:opacity-100'}`}></div>
             <div className="relative z-10">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             </div>
          </button>
        </div>
      </div>

      {!isModalOpen && (
        <FloatingChat 
          isOpen={isChatOpen} 
          onToggle={() => setIsChatOpen(!isChatOpen)}
          onClose={() => setIsChatOpen(false)} 
        />
      )}

      <footer className={`bg-transparent py-6 mt-auto transition-all duration-300 pb-20 md:pb-8 relative z-10 ${isModalOpen ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 dark:text-slate-600 text-[8px] font-black uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} 4RISE. Built with passion.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
