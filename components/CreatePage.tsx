
import React, { useState, useRef, useMemo } from 'react';
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

const MEDIA_CONFIG: Record<MediaType, { titlePlaceholder: string, projectUrlLabel: string, projectUrlPlaceholder: string, tagsPlaceholder: string, descriptionPlaceholder: string }> = {
  image: {
    titlePlaceholder: 'Contoh: Fotografi Produk Kopi',
    projectUrlLabel: 'URL Publikasi (Opsional)',
    projectUrlPlaceholder: 'https://dribbble.com/shot/...',
    tagsPlaceholder: 'Fotografi, Produk, Branding',
    descriptionPlaceholder: 'Jelaskan konsep, teknik pencahayaan, dan tujuan dari sesi foto ini.'
  },
  video: {
    titlePlaceholder: 'Contoh: Video Sinematik Perjalanan',
    projectUrlLabel: 'URL Video (Opsional)',
    projectUrlPlaceholder: 'https://youtube.com/watch?v=...',
    tagsPlaceholder: 'Videografi, Travel, Premiere Pro',
    descriptionPlaceholder: 'Ceritakan tentang lokasi, peralatan yang digunakan, dan proses editing.'
  },
  movie: {
    titlePlaceholder: 'Contoh: Film Pendek "Senja"',
    projectUrlLabel: 'URL Trailer/Film (Opsional)',
    projectUrlPlaceholder: 'https://vimeo.com/12345678',
    tagsPlaceholder: 'Film, Drama, Sinematografi',
    descriptionPlaceholder: 'Tulis sinopsis singkat, peran Anda dalam produksi, dan penghargaan yang diraih.'
  },
  '3d': {
    titlePlaceholder: 'Contoh: Desain Karakter Robot',
    projectUrlLabel: 'URL Render/Proyek (Opsional)',
    projectUrlPlaceholder: 'https://www.artstation.com/artwork/...',
    tagsPlaceholder: '3D, Blender, Karakter',
    descriptionPlaceholder: 'Jelaskan software yang digunakan, proses modeling, texturing, dan rendering.'
  },
  audio: {
    titlePlaceholder: 'Contoh: Produksi Musik "Lofi Beats"',
    projectUrlLabel: 'URL Audio (Opsional)',
    projectUrlPlaceholder: 'https://soundcloud.com/user/track',
    tagsPlaceholder: 'Musik, Produksi, Ableton',
    descriptionPlaceholder: 'Deskripsikan genre, inspirasi, dan instrumen yang digunakan dalam karya ini.'
  },
  web: {
    titlePlaceholder: 'Contoh: Situs E-commerce Kopi',
    projectUrlLabel: 'URL Proyek/Situs',
    projectUrlPlaceholder: 'https://namasitus.com',
    tagsPlaceholder: 'Web Dev, React, TailwindCSS',
    descriptionPlaceholder: 'Jelaskan teknologi yang digunakan, fitur utama, dan peran Anda dalam pengembangan.'
  },
  certificate: {
    titlePlaceholder: 'Contoh: Sertifikasi Google Cloud',
    projectUrlLabel: 'URL Verifikasi (Opsional)',
    projectUrlPlaceholder: 'https://credential.net/verify/...',
    tagsPlaceholder: 'Cloud, GCP, Sertifikasi',
    descriptionPlaceholder: 'Jelaskan tentang sertifikasi ini, lembaga yang mengeluarkan, dan validitasnya.'
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

  const currentConfig = useMemo(() => MEDIA_CONFIG[mediaType], [mediaType]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const limit = 10 * 1024 * 1024; // 10MB limit
      
      if (file.size > limit) {
        setMessage({ type: 'error', text: 'File terlalu besar (Maks 10MB).' });
        return;
      }

      if (file.type.startsWith('image/')) {
        setIsOptimizing(true);
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
        reader.onloadend = () => setMediaUrl(reader.result as string);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setMessage({ type: 'error', text: 'Gagal menyimpan. Database lokal penuh.' });
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-20">
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-10 shadow-2xl">
        <h2 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-tight">
          BUAT KARYA BARU
        </h2>

        {message && (
          <div className={`mb-8 p-5 rounded-2xl text-sm font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form id="portfolio-create-form" onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="label">Judul Proyek *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder={currentConfig.titlePlaceholder}
            />
          </div>

          <div>
            <label className="label">Tipe Media</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
              {(['image', 'video', 'movie', '3d', 'audio', 'web', 'certificate'] as MediaType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setMediaType(type); setMediaUrl(''); }}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl transition-all ${
                    mediaType === type 
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-lg scale-[1.05] ring-1 ring-primary/20' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {MEDIA_ICONS[type].icon}
                  <span className="text-[6px] font-black uppercase mt-1 tracking-tighter">{MEDIA_ICONS[type].label.slice(0, 3)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="label">Konten Media</label>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="input-field text-xs"
                placeholder="Masukkan URL media atau upload file..."
              />
              <label className="flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 cursor-pointer transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                {isOptimizing ? 'MEMPROSES...' : 'UPLOAD FILE (MAX 10MB)'}
                <input type="file" ref={fileInputRef} className="hidden" disabled={isOptimizing} onChange={handleFileUpload} accept="image/*,video/*,audio/*" />
              </label>
            </div>
          </div>

          <div>
            <label className="label">{currentConfig.projectUrlLabel}</label>
            <input
              type="text"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              className="input-field"
              placeholder={currentConfig.projectUrlPlaceholder}
            />
          </div>

          <div>
            <label className="label">Tags (Pisahkan dengan koma)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="input-field"
              placeholder={currentConfig.tagsPlaceholder}
            />
          </div>

          <div>
            <label className="label">Deskripsi Proyek *</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="input-field"
              placeholder={currentConfig.descriptionPlaceholder}
            />
          </div>

          {/* NORMAL SAVE BUTTON (Inside Form Card) */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <Button 
              type="submit" 
              isLoading={isSubmitting || isOptimizing} 
              className="w-full py-5 text-sm md:text-base font-black uppercase tracking-[0.4em] rounded-2xl md:rounded-3xl shadow-2xl shadow-primary/20"
            >
              Simpan Portofolio
            </Button>
          </div>
        </form>
      </div>

      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 900; color: #64748b; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .input-field { width: 100%; background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 1.25rem; padding: 1rem 1.5rem; color: #0f172a; outline: none; transition: all 0.3s; font-weight: 700; }
        .dark .input-field { background-color: #0f172a; border-color: #1e293b; color: #f1f5f9; }
        .input-field:focus { border-color: #6366f1; box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.1); }
      `}</style>
    </div>
  );
};

export default CreatePage;
