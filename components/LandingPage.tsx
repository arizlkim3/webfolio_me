
import React, { useState } from 'react';
import { UserRole, Theme } from '../types';
import Button from './Button';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, theme, toggleTheme }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const waLink = "https://wa.me/6281476655793";

  const handleCreatorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      onLogin('creator');
    } else {
      setError('Password salah. Coba: admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      
      {/* Header Actions: Account & Theme */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-3">
         {/* Account Icon (Kelola Portofolio) */}
         <button
            onClick={() => setShowLoginModal(true)}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-slate-500 dark:text-slate-400 hover:text-secondary dark:hover:text-secondary hover:scale-110 transition-all border border-slate-100 dark:border-slate-700"
            title="Kelola Portofolio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

         {/* Theme Toggle */}
         <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:scale-110 transition-all border border-slate-100 dark:border-slate-700"
            title="Ganti Tema"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 dark:bg-secondary/20 blur-[120px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl w-full text-center space-y-12 animate-fade-in px-4">
        <div className="space-y-6 flex flex-col items-center">
          <div className="inline-flex flex-col items-center group">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary via-indigo-500 to-secondary leading-none tracking-tight">
              4RISE
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.45em] md:tracking-[0.6em] mt-3 md:mt-4 w-full text-center transition-all group-hover:text-primary">
              Arizki Maulana Fajar
            </p>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
            Selamat datang di portofolio digital saya. Wadah eksklusif untuk menampilkan setiap karya, proyek, dan pencapaian profesional saya dengan estetika modern.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-8">
           {/* Primary Action */}
           <button 
             onClick={() => onLogin('guest')}
             className="relative group overflow-hidden px-12 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
           >
             <span className="relative z-10 flex items-center gap-3">
               Mulai Eksplorasi
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
               </svg>
             </span>
             <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-150"></div>
           </button>

           {/* WhatsApp Tag Button (Small & At the Bottom) */}
           <a 
             href={waLink}
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#25D366]/10 dark:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest group shadow-sm active:scale-95"
           >
             <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
             </svg>
             Chat WhatsApp
           </a>
        </div>
      </div>

      {/* Login Modal (Overlay) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
           <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative">
              <button 
                onClick={() => {setShowLoginModal(false); setPassword(''); setError('');}} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="flex flex-col items-center mb-8">
                 <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Akses Pemilik</h2>
                 <p className="text-slate-500 text-sm mt-1">Masukkan kata sandi untuk masuk ke dashboard.</p>
              </div>

              <form onSubmit={handleCreatorLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contoh: admin"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all"
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-xs mt-2 font-semibold text-center">{error}</p>}
                </div>

                <Button type="submit" className="w-full py-4 text-base font-bold !rounded-xl">
                  Buka Dashboard
                </Button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
