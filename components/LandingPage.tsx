import React, { useState } from 'react';
import Button from './Button';
import { UserRole, Theme } from '../types';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, theme, toggleTheme }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      
      {/* Theme Toggle Absolute */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
         <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all"
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/20 blur-[80px] md:blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 dark:bg-secondary/20 blur-[80px] md:blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-6 md:space-y-8 animate-fade-in px-2">
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary pb-2 leading-tight">
            Webfolio Builder
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            Platform sederhana untuk mengelola dan menampilkan portofolio terbaik Anda dalam sekejap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12 max-w-2xl mx-auto">
          {/* Card Pengunjung */}
          <button 
            onClick={() => onLogin('guest')}
            className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 md:p-8 rounded-2xl hover:border-primary/50 dark:hover:border-primary/50 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 dark:hover:shadow-primary/10 transition-all duration-300 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 md:h-24 md:w-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="bg-primary/10 dark:bg-slate-700 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 relative z-10">Lihat Portofolio</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm relative z-10">Masuk sebagai pengunjung untuk melihat galeri karya.</p>
          </button>

          {/* Card Creator */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 md:h-24 md:w-24 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
            </div>
            {!showPassword ? (
              <div 
                onClick={() => setShowPassword(true)}
                className="cursor-pointer group h-full text-left relative z-10"
              >
                <div className="bg-secondary/10 dark:bg-slate-700 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2">Kelola Portofolio</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">Masuk sebagai pemilik untuk menambah/edit data.</p>
              </div>
            ) : (
              <form onSubmit={handleCreatorLogin} className="space-y-4 animate-fade-in relative z-10">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-white">Login Pemilik</h3>
                  <button type="button" onClick={() => {setShowPassword(false); setError('');}} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    ✕
                  </button>
                </div>
                
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (ketik: admin)"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-sm"
                    autoFocus
                  />
                  {error && <p className="text-red-500 dark:text-red-400 text-xs mt-2 font-medium">{error}</p>}
                </div>
                
                <Button type="submit" variant="primary" className="w-full !from-secondary !to-purple-600 shadow-lg shadow-purple-500/20 text-sm py-2.5">
                  Masuk Dashboard
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;