
import React, { useState, useEffect } from 'react';
import { UserRole, Theme } from '../types';
import { getUserProfile } from '../services/storage';
import Button from './Button';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const TypewriterEffect: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStartTyping(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 35); // Kecepatan mengetik
      return () => clearTimeout(timeout);
    }
  }, [displayedText, text, startTyping]);

  return (
    <span className="relative">
      {displayedText}
      <span className={`inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle ${displayedText.length === text.length ? 'animate-pulse' : 'opacity-100'}`}></span>
    </span>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, theme, toggleTheme }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const profile = getUserProfile();
  const waLink = `https://wa.me/${profile.socials?.whatsapp || '6281476655793'}`;
  const githubLink = profile.socials?.github || "https://github.com/arizlkim3";
  const vercelLink = profile.socials?.vercel || "https://vercel.com/arizlkim3s-projects";
  const instagramLink = profile.socials?.instagram || "https://www.instagram.com/arizkim3/";
  const linkedinLink = profile.socials?.linkedin || "https://www.linkedin.com/in/arizkim3/";

  const handleCreatorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      onLogin('creator');
    } else {
      setError('Sandi Salah');
    }
  };

  const welcomeText = "Selamat datang di portofolio digital saya. Wadah eksklusif untuk menampilkan setiap karya, proyek, dan pencapaian profesional saya dengan estetika modern.";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      
      {/* Floating Header Card - Utility Section */}
      <div className="absolute top-4 md:top-8 right-4 md:right-8 z-50 animate-fade-in-down">
         <div className="flex items-center p-1.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all">
            <button
              onClick={() => setShowLoginModal(true)}
              className="p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-secondary hover:bg-secondary/5 transition-all"
              title="Kelola Portofolio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
              title="Ganti Tema"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
         </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 dark:bg-secondary/20 blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl w-full text-center space-y-12 px-4">
        <div className="space-y-6 flex flex-col items-center">
          <div className="inline-flex flex-col items-center group">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary via-indigo-500 to-secondary leading-none tracking-tight opacity-0 animate-fade-in-down">
              4RISE
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.45em] md:tracking-[0.6em] mt-3 md:mt-4 w-full text-center transition-all group-hover:text-primary opacity-0 animate-fade-in-up animation-delay-200">
              Arizki Maulana Fajar
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                <a href={waLink} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#25D366]/10 dark:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest group shadow-sm opacity-0 animate-reveal-right animation-delay-400">
                  WhatsApp
                </a>
                <a href={githubLink} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/10 dark:bg-white/10 border border-slate-900/30 dark:border-white/30 text-slate-900 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all duration-300 text-[10px] font-black uppercase tracking-widest group shadow-sm opacity-0 animate-reveal-right animation-delay-600">
                  GitHub
                </a>
                <a href={vercelLink} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/10 dark:bg-white/10 border border-slate-900/30 dark:border-white/30 text-slate-900 dark:text-white hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all duration-300 text-[10px] font-black uppercase tracking-widest group shadow-sm opacity-0 animate-reveal-right animation-delay-800">
                  Vercel
                </a>
                <a href={linkedinLink} target="_blank" rel="noopener noreferrer" 
                   className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0077B5]/10 dark:bg-[#0077B5]/20 border border-[#0077B5]/30 text-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest group shadow-sm opacity-0 animate-reveal-right animation-delay-1000">
                  LinkedIn
                </a>
            </div>
          </div>
          
          <div className="min-h-[100px] md:min-h-[120px] flex items-center justify-center">
            <p className="font-plus font-normal text-slate-600 dark:text-slate-300 text-lg md:text-2xl max-w-2xl mx-auto leading-[1.6] md:leading-[1.7] tracking-tight antialiased">
              <TypewriterEffect text={welcomeText} delay={1200} />
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 pt-4">
           <button 
             onClick={() => onLogin('guest')}
             className="relative group overflow-hidden px-14 py-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 opacity-0 animate-scale-up animation-delay-800"
           >
             <span className="relative z-10 flex items-center gap-3 uppercase tracking-tighter">
               Mulai Eksplorasi
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
               </svg>
             </span>
             <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-150"></div>
           </button>
        </div>
      </div>

      {/* ANDROID SYSTEM STYLE MODAL - FOCUS ON SYMMETRY & MATERIAL YOU */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/20 backdrop-blur-md animate-fade-in" onClick={() => setShowLoginModal(false)}>
           <div 
             className="w-full max-w-[340px] bg-slate-50 dark:bg-[#1C1B1F] rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-8 relative animate-scale-up border border-white/10" 
             onClick={(e) => e.stopPropagation()}
           >
              {/* Material Close Button */}
              <button 
                onClick={() => {setShowLoginModal(false); setPassword(''); setError('');}} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="flex flex-col items-center mb-8">
                 {/* Security Icon - Android Style */}
                 <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 dark:text-[#E6E1E5] tracking-tight mb-1">Akses Pemilik</h2>
                 <p className="text-[10px] font-bold text-primary dark:text-primary/70 uppercase tracking-[0.2em]">Verifikasi Keamanan</p>
              </div>

              <form onSubmit={handleCreatorLogin} className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="relative group">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Sandi Sistem</label>
                    
                    {/* Symmetrical Form Container */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-14 bg-slate-100 dark:bg-[#2B2930] border-2 border-transparent focus:border-primary rounded-2xl px-6 text-slate-900 dark:text-white text-lg font-bold outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
                          autoFocus
                        />
                      </div>
                      
                      {/* Fixed Symmetrical Action Button */}
                      <button 
                        type="submit" 
                        className="flex-shrink-0 w-14 h-14 aspect-square bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
                      >
                        <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20 animate-shake">
                       <p className="text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide">{error}</p>
                    </div>
                  )}
                </div>
              </form>
              
              <div className="mt-12 text-center opacity-30">
                 <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em]">PROTECTED BY 4RISE</p>
              </div>
           </div>
        </div>
      )}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default LandingPage;
