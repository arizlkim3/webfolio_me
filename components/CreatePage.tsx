
import React, { useState, useRef } from 'react';
import { PortfolioItem, MediaType } from '../types';
import { savePortfolioItem, compressImage } from '../services/storage';
import Button from './Button';

interface CreatePageProps {
  onSuccess: () => void;
}

const MEDIA_ICONS: Record<MediaType, { icon: React.ReactNode, label: string }> = {
  image: {
    label: 'Gambar',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  video: {
    label: 'Video',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
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
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
  }
};

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
      const limit = 10 * 1024 * 1024; // 10MB limit untuk input (akan dikompres)
      
      if (file.size > limit) {
        setMessage({ type: 'error', text: 'Ukuran file terlalu besar (Maks 10MB sebelum optimasi).' });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Optimasi hanya untuk tipe visual
      if (file.type.startsWith('image/') && (mediaType === 'image' || mediaType === 'certificate' || mediaType === 'web')) {
        setIsOptimizing(true);
        setMessage(null);
        try {
          // Kompres ke maks 1200px dengan kualitas 0.7
          const optimizedBase64 = await compressImage(file, 1200, 1200, 0.7);
          setMediaUrl(optimizedBase64);
        } catch (err) {
          setMessage({ type: 'error', text: 'Gagal mengoptimalkan gambar.' });
        } finally {
          setIsOptimizing(false);
        }
      } else {
        // Untuk video/audio gunakan pembacaan standar (dan beri peringatan limit 3MB agar tidak memenuhi localstorage)
        if (file.size > 3 * 1024 * 1024) {
          setMessage({ type: 'error', text: 'Untuk file non-gambar, batas maksimal adalah 3MB.' });
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

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

    let finalMediaUrl = mediaUrl;
    if (!finalMediaUrl && (mediaType === 'image' || mediaType === 'certificate')) {
       finalMediaUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
    }

    if (mediaType === 'web' && !finalMediaUrl && projectUrl) {
      finalMediaUrl = projectUrl;
    }

    const newItem: PortfolioItem = {
      id: crypto.randomUUID(),
      title,
      description,
      projectUrl,
      mediaType,
      mediaUrl: finalMediaUrl, 
      tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      createdAt: Date.now(),
      isFeatured: false 
    };

    setTimeout(() => {
      const success = savePortfolioItem(newItem);
      
      if (success) {
        setTitle('');
        setDescription('');
        setProjectUrl('');
        setTagsInput('');
        setMediaUrl('');
        setMediaType('image');
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        setMessage({ type: 'success', text: 'Portofolio berhasil disimpan & dioptimalkan!' });
        setTimeout(() => onSuccess(), 1500); 
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan. Memori lokal penuh.' });
      }
      setIsSubmitting(false);
    }, 800);
  };

  const isDataUrlImage = (url: string) => url.startsWith('data:image/');

  const renderMediaPreview = () => {
    if (isOptimizing) {
      return (
        <div className="mt-4 w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center gap-3 animate-pulse">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Mengoptimalkan Gambar...</p>
        </div>
      );
    }
    
    if (!mediaUrl) return null;

    return (
      <div className="mt-4 relative group w-full bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        {(mediaType === 'image' || mediaType === 'certificate') && (
           <img src={mediaUrl} alt="Preview" className="w-full h-48 md:h-64 object-cover" />
        )}
        {mediaType === 'video' && (
           <video src={mediaUrl} controls className="w-full h-48 md:h-64 object-cover bg-black" />
        )}
        {mediaType === 'audio' && (
           <div className="w-full h-24 flex items-center justify-center bg-slate-200 dark:bg-slate-800 p-4">
             <audio src={mediaUrl} controls className="w-full" />
           </div>
        )}
        {mediaType === 'web' && (
          <div className="w-full h-64 bg-white flex flex-col">
            <div className="bg-slate-200 border-b border-slate-300 px-3 py-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <div className="ml-2 bg-white text-[10px] text-slate-500 px-2 py-0.5 rounded flex-1 truncate">{mediaUrl.length > 100 ? 'Optimized Screenshot' : mediaUrl}</div>
            </div>
            {isDataUrlImage(mediaUrl) ? (
              <div className="flex-1 overflow-hidden">
                <img src={mediaUrl} alt="Web Screenshot" className="w-full h-full object-cover object-top" />
              </div>
            ) : (
              <iframe src={mediaUrl} className="w-full flex-1 border-0" title="Web Preview" />
            )}
          </div>
        )}
        
        <button
          type="button"
          onClick={() => {
            setMediaUrl('');
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-8 shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Buat Portofolio Baru
        </h2>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {mediaType === 'certificate' ? 'Nama Sertifikat / Lisensi *' : 'Judul Proyek *'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none"
              placeholder={mediaType === 'certificate' ? "Contoh: Google Data Analytics Professional" : "Contoh: Website Toko Online"}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tipe Media</label>
            <div className="grid grid-cols-5 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
              {(['image', 'video', 'audio', 'web', 'certificate'] as MediaType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  title={MEDIA_ICONS[type].label}
                  onClick={() => {
                    setMediaType(type);
                    setMediaUrl('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all duration-300 ${
                    mediaType === type 
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-md scale-[1.05] z-10' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {MEDIA_ICONS[type].icon}
                  <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest mt-1 opacity-60">
                    {MEDIA_ICONS[type].label.slice(0, 3)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {mediaType === 'certificate' ? 'Upload Gambar Sertifikat / URL' : mediaType === 'web' ? 'URL Website / Screenshot' : 'Media URL / File'}
            </label>
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 mb-3 text-slate-900 dark:text-white text-sm"
              placeholder={mediaType === 'web' ? "Paste URL (iframe) atau pilih screenshot di bawah" : "Paste URL atau pilih file di bawah"}
            />

            <label className="inline-block cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg text-sm font-medium">
              {isOptimizing ? 'Memproses...' : 'Pilih File Local'}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                disabled={isOptimizing}
                onChange={handleFileUpload} 
                accept={mediaType === 'image' || mediaType === 'certificate' || mediaType === 'web' ? "image/*" : mediaType === 'video' ? "video/*" : "audio/*"} 
              />
            </label>
            {renderMediaPreview()}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Deskripsi *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none"
              placeholder={mediaType === 'certificate' ? "Jelaskan kompetensi yang didapatkan..." : "Jelaskan detail karya..."}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {mediaType === 'certificate' ? 'Link Verifikasi Kredensial' : 'Link Proyek Eksternal'}
            </label>
            <input
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white outline-none"
              placeholder="Design, Analytics, Marketing"
            />
          </div>

          <Button type="submit" isLoading={isSubmitting || isOptimizing} className="w-full py-4 text-lg">
            Simpan Portofolio
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
