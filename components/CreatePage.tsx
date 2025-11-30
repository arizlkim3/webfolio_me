import React, { useState, useRef } from 'react';
import { PortfolioItem, MediaType } from '../types';
import { savePortfolioItem } from '../services/storage';
import Button from './Button';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limit size: Image/Audio 3MB, Video highly discouraged for LocalStorage but set strictly
      const limit = 3 * 1024 * 1024; // 3MB
      
      if (file.size > limit) {
        setMessage({ type: 'error', text: 'Ukuran file terlalu besar (Maks 3MB). Untuk Video/Audio disarankan menggunakan URL eksternal (YouTube/SoundCloud) agar browser tidak berat.' });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
        setMessage(null);
      };
      
      if (mediaType === 'image') reader.readAsDataURL(file);
      else if (mediaType === 'video' || mediaType === 'audio') reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Basic Validation
    if (!title || !description) {
      setMessage({ type: 'error', text: 'Judul dan Deskripsi wajib diisi.' });
      setIsSubmitting(false);
      return;
    }

    // Default image if empty
    let finalMediaUrl = mediaUrl;
    if (!finalMediaUrl && mediaType === 'image') {
       finalMediaUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
    }

    // For web, if mediaUrl is empty but projectUrl is filled, copy it
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
      createdAt: Date.now()
    };

    setTimeout(() => {
      const success = savePortfolioItem(newItem);
      
      if (success) {
        // Reset Form
        setTitle('');
        setDescription('');
        setProjectUrl('');
        setTagsInput('');
        setMediaUrl('');
        setMediaType('image');
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        setMessage({ type: 'success', text: 'Portofolio berhasil disimpan ke penyimpanan lokal!' });
        setTimeout(() => onSuccess(), 1500); 
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan. LocalStorage penuh. Gunakan URL untuk media besar.' });
      }
      setIsSubmitting(false);
    }, 800);
  };

  const renderMediaPreview = () => {
    if (!mediaUrl) return null;

    return (
      <div className="mt-4 relative group w-full bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
        {mediaType === 'image' && (
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
              <div className="ml-2 bg-white text-[10px] text-slate-500 px-2 py-0.5 rounded flex-1 truncate">{mediaUrl}</div>
            </div>
            <iframe 
              src={mediaUrl} 
              className="w-full flex-1 border-0" 
              title="Web Preview"
              sandbox="allow-scripts allow-same-origin"
            />
            <div className="absolute inset-0 bg-transparent" /> {/* Overlay to prevent iframe interaction during preview if needed */}
          </div>
        )}
        
        <button
          type="button"
          onClick={() => {
            setMediaUrl('');
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors z-20"
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
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Buat Portofolio Baru
        </h2>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20' : 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Judul Proyek *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-400 text-base"
              placeholder="Contoh: Website Toko Online"
            />
          </div>

          {/* Media Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tipe Media</label>
            <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {(['image', 'video', 'audio', 'web'] as MediaType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setMediaType(type);
                    setMediaUrl(''); // Reset url when changing type
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className={`py-2 px-2 md:px-4 rounded-md text-xs md:text-sm font-medium transition-all ${
                    mediaType === type 
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  } capitalize`}
                >
                  {type === 'web' ? 'Website' : type === 'image' ? 'Gambar' : type === 'video' ? 'Video' : 'Suara'}
                </button>
              ))}
            </div>
          </div>

          {/* Media Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {mediaType === 'image' ? 'Upload Gambar / URL' 
               : mediaType === 'video' ? 'Upload Video / URL MP4' 
               : mediaType === 'audio' ? 'Upload Audio / URL MP3' 
               : 'URL Website'}
            </label>
            
            {/* URL Input option */}
            <input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 mb-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              placeholder={mediaType === 'web' ? "https://www.example.com" : mediaType === 'image' ? "https://..." : "Paste URL"}
            />

            {/* File Upload (Hidden for Web) */}
            {mediaType !== 'web' && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="w-full sm:w-auto text-center cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 px-4 py-3 rounded-lg transition-colors font-medium">
                  <span>Pilih File Local</span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept={mediaType === 'image' ? "image/*" : mediaType === 'video' ? "video/*" : "audio/*"}
                    onChange={handleFileUpload} 
                  />
                </label>
                <span className="text-xs text-slate-500">Maks. 3MB (LocalStorage)</span>
              </div>
            )}

            {mediaType === 'web' && (
              <p className="text-xs text-slate-500">
                Masukkan URL lengkap (termasuk https://). Beberapa website mungkin memblokir pratinjau (X-Frame-Options).
              </p>
            )}
            
            {renderMediaPreview()}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Deskripsi *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-400 text-base"
              placeholder="Jelaskan detail karya Anda..."
            />
          </div>

          {/* Project URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Link Proyek Eksternal (Opsional)</label>
            <input
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-400 text-base"
              placeholder="https://..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-slate-400 text-base"
              placeholder="Cinematic, Podcast, Design"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" isLoading={isSubmitting} className="w-full py-3.5 text-lg shadow-lg shadow-indigo-500/20">
              Simpan Portofolio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;