
import React, { useState } from 'react';
import { getUserProfile } from '../services/storage';

interface FloatingChatProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const FloatingChat: React.FC<FloatingChatProps> = ({ isOpen, onToggle, onClose }) => {
  const [message, setMessage] = useState('');
  
  const profile = getUserProfile();
  const waNumber = profile.socials?.whatsapp || '6281476655793';
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${waNumber}?text=${encodedMessage}`;
    window.open(waLink, '_blank');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed bottom-24 md:bottom-10 right-6 z-[200] flex flex-col items-end gap-4 pointer-events-none">
      {/* Chat Window */}
      <div className={`w-72 md:w-80 max-w-[calc(100vw-3rem)] transition-all duration-500 transform origin-bottom-right pointer-events-auto ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}`}>
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] border border-white/40 dark:border-slate-800/60 shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-5 text-white relative">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
              </div>
              <div className="pr-8">
                <h4 className="font-black text-xs uppercase tracking-widest leading-none mb-1">Live Chat</h4>
                <p className="text-[9px] font-bold opacity-80 uppercase tracking-tighter">Respon Cepat</p>
              </div>
            </div>
            <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700/50 shadow-sm">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                Halo! Saya Arizki. Ada yang bisa dibantu?
              </p>
            </div>
            
            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan..."
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-primary/40 transition-all resize-none shadow-inner"
              />
              <button 
                type="submit"
                className="w-full py-3.5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Kirim WA
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Trigger Button - Hidden on Mobile because it's in the Bottom Nav */}
      <button 
        onClick={onToggle} 
        className={`hidden md:flex pointer-events-auto relative group w-16 h-16 rounded-full items-center justify-center transition-all duration-500 shadow-2xl opacity-0 animate-scale-up animation-delay-800 ${isOpen ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-[135deg] scale-90' : 'bg-primary text-white hover:scale-110 active:scale-95'}`}
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping pointer-events-none"></div>
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>
    </div>
  );
};

export default FloatingChat;
