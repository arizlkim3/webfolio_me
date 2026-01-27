
import React, { useState, useRef } from 'react';
import { PortfolioItem, MediaType } from '../types';
import { savePortfolioItem, compressImage } from '../services/storage';
import Button from './Button';

const MEDIA_ICONS: Record<MediaType, { icon: React.ReactNode, label: string }> = {
  image: {
    label: 'Gambar',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  video: {
    label: 'Video',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  movie: {
    label: 'Movie',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V20M17 4V20M3 8H7M17 8H21M3 12H21M3 16H7M17 16H21M4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20Z" /></svg>
  },
  '3d': {
    label: '3D Design',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
  },
  audio: {
    label: 'Audio',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
  },
  web: {
    label: 'Web',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
  },
  certificate: {
    label: 'Sertifikat',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 00.806 1.946 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
  }
};

interface CreatePageProps {
  onSuccess: () => void;
}

const CreatePage: React.FC<CreatePageProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const limit = 10 * 1024 * 1024; // 10MB limit
      
      if (file.size > limit) {
        setMessage({ type: 'error', text: 'Ukuran file terlalu besar (Maks 10MB).' });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Gunakan kompresi gambar untuk 3D (karena sekarang berupa render gambar statis)
      if (file.type.startsWith('image/') && (mediaType === 'image' || mediaType === 'certificate' || mediaType === 'web' || mediaType === 'movie' || mediaType === '3d')) {
        setIsOptimizing(true);
        setMessage(null);
        try {
          const optimizedBase64 = await compressImage(file, 1200, 1200, 0.7);
          setMediaUrl(optimizedBase64);
        } catch (err) {
          setMessage({ type: 'error', text: 'Gagal mengoptimalkan gambar.' });
        } finally {
          setIsOptimizing(false);
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaUrl(reader.result as string);
          setMessage(null);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (!title || !description) {
      setMessage({ type: 'error', text: 'Judul dan Deskripsi wajib diisi.' });
      setIsSubmitting(false);
      return;
    }

    const newItem: PortfolioItem = {
      id: crypto.randomUUID(),
      title,
      description,
      projectUrl,
      mediaType,
      mediaUrl: mediaUrl || `https://picsum.photos/seed/${Date.now()}/800/600`, 
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      createdAt: Date.now(),
      isFeatured: false 
    };

    setTimeout(() => {
      const success = savePortfolioItem(newItem);
      if (success) {
        onSuccess();
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan. Memori lokal penuh.' });
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-8 shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Buat Portofolio Baru
        </h2>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Judul Proyek *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Contoh: Render 3D Karakter"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tipe Media</label>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
              {(['image', 'video', 'movie', '3d', 'audio', 'web', 'certificate'] as MediaType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  title={MEDIA_ICONS[type].label}
                  onClick={() => { setMediaType(type); setMediaUrl(''); }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all duration-300 ${
                    mediaType === type 
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-md scale-[1.05] z-10' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                  }`}
                >
                  {MEDIA_ICONS[type].icon}
                  <span className="text-[7px] md:text-[8px] font-black uppercase mt-1 opacity-60">{MEDIA_ICONS[type].label.slice(0, 4)}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {mediaType === '3d' ? 'Upload Gambar Hasil Render 3D' : 'Media URL / File'}
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Paste URL gambar atau pilih file lokal di bawah"
              />
              <label className="inline-block cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-sm text-center">
                {isOptimizing ? 'Memproses...' : 'Pilih File Lokal (Maks 10MB)'}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  disabled={isOptimizing}
                  onChange={handleFileUpload} 
                  accept="image/*,video/*,audio/*"
                />
              </label>
            </div>
            
            {mediaUrl && !isOptimizing && (
               <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative aspect-video bg-slate-900 flex items-center justify-center">
                  {(mediaType === 'image' || mediaType === 'certificate' || mediaType === 'movie' || mediaType === '3d') ? (
                    <img src={mediaUrl} className="w-full h-full object-contain" alt="Preview" />
                  ) : mediaType === 'video' ? (
                    <video src={mediaUrl} className="w-full h-full object-contain" controls />
                  ) : <div className="text-white text-xs font-black">PREVIEW READY</div>}
               </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Deskripsi *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Jelaskan detail karya..."
            />
          </div>

          <Button type="submit" isLoading={isSubmitting || isOptimizing} className="w-full py-4 text-lg font-black uppercase tracking-widest">
            Simpan Portofolio
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
