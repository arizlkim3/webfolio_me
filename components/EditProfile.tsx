
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Skill, SocialLinks } from '../types';
import { getUserProfile, saveUserProfile, compressImage, generatePortfolioCode, downloadPortfolioFile } from '../services/storage';
import Button from './Button';

interface EditProfileProps {
  onSuccess: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onSuccess }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const data = getUserProfile();
    if (!data.socials) {
      data.socials = {};
    }
    setProfile(data);
  }, []);

  const handleChange = (field: keyof UserProfile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      setIsOptimizing(true);
      setMessage(null);
      try {
        const optimizedAvatar = await compressImage(file, 400, 400, 0.8);
        setProfile({ ...profile, avatarUrl: optimizedAvatar });
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal memproses foto profil.' });
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  const handleCopySourceCode = () => {
    const code = generatePortfolioCode();
    navigator.clipboard.writeText(code).then(() => {
      setMessage({ type: 'success', text: 'Kode portfolioData.ts berhasil disalin!' });
      setTimeout(() => setMessage(null), 4000);
    }).catch(() => {
      setMessage({ type: 'error', text: 'Gagal menyalin kode.' });
    });
  };

  const addSkill = () => {
    if (!profile) return;
    const newSkill: Skill = { id: crypto.randomUUID(), name: '', level: 70 };
    setProfile({ ...profile, skills: [...profile.skills, newSkill] });
  };

  const removeSkill = (id: string) => {
    if (!profile) return;
    setProfile({ ...profile, skills: profile.skills.filter(s => s.id !== id) });
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    if (!profile) return;
    const updatedSkills = profile.skills.map(s => s.id === id ? { ...s, [field]: value } : s);
    setProfile({ ...profile, skills: updatedSkills });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    const updatedProfile: UserProfile = {
      ...profile,
      skills: profile.skills.filter(s => s.name.trim().length > 0)
    };
    const success = saveUserProfile(updatedProfile);
    setTimeout(() => {
      setIsSaving(false);
      if (success) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
        setTimeout(() => onSuccess(), 1000);
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan ke memori lokal.' });
      }
    }, 800);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-10 shadow-2xl">
        <h2 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-tight">
          PENGATURAN ADMIN
        </h2>

        {message && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[250] w-[90%] max-w-md p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl animate-fade-in-down ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
            <div className="flex items-center gap-3">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
               {message.text}
            </div>
          </div>
        )}

        <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section: SINKRONISASI DATA KE SOURCE CODE */}
          <div className="space-y-6 p-6 md:p-8 bg-slate-900 dark:bg-slate-950 rounded-3xl border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2zm0 4h16m-16 4h16" /></svg>
               </div>
               <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">SINKRONISASI DATA</h3>
            </div>
            
            <p className="text-[10px] md:text-xs text-slate-400 font-medium leading-relaxed">
              Permanenkan data Anda dengan mengunduh atau menyalin kode di bawah ini, lalu timpa file <code>src/data/portfolioData.ts</code> Anda.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={downloadPortfolioFile}
                className="flex items-center justify-center gap-3 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all border border-primary/30 shadow-lg shadow-primary/20 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Unduh portfolioData.ts
              </button>

              <button 
                type="button" 
                onClick={handleCopySourceCode}
                className="flex items-center justify-center gap-3 py-4 bg-slate-800 text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-700 hover:text-white transition-all border border-slate-700 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Salin Kode (Paste)
              </button>
            </div>
          </div>

          {/* Section: Foto Profil */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-2xl ring-4 ring-white dark:ring-slate-800 flex items-center justify-center">
              {isOptimizing ? (
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Foto Profil Utama</h3>
              <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-widest">Auto-compress aktif (JPG/PNG)</p>
              <label className="inline-block cursor-pointer bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">
                Pilih Foto
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isOptimizing} />
              </label>
            </div>
          </div>

          {/* Section: Info Dasar */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-200 dark:border-slate-700 pb-2">DATA IDENTITAS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="label">Nama Lengkap</label>
                <input type="text" value={profile.name} onChange={(e) => handleChange('name', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label">Role / Spesialisasi</label>
                <input type="text" value={profile.role} onChange={(e) => handleChange('role', e.target.value)} className="input-field" placeholder="Visual Designer" />
              </div>
              <div>
                <label className="label">Lokasi</label>
                <input type="text" value={profile.address} onChange={(e) => handleChange('address', e.target.value)} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="label">Bio Singkat</label>
                <textarea rows={3} value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">SKILLS & KEAHLIAN</h3>
                <button type="button" onClick={addSkill} className="text-[10px] font-black uppercase text-primary bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all">+ TAMBAH</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.skills.map((skill) => (
                  <div key={skill.id} className="p-5 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700 relative group">
                     <button type="button" onClick={() => removeSkill(skill.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors">✕</button>
                     <div className="mb-4 pr-8">
                        <label className="label-sm">NAMA SKILL</label>
                        <input type="text" value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} className="input-field text-sm" placeholder="Contoh: Figma" />
                     </div>
                     <div className="flex items-center gap-4">
                        <input type="range" min="0" max="100" value={skill.level} onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))} className="flex-1 accent-primary" />
                        <span className="text-xs font-black text-primary">{skill.level}%</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* NORMAL SAVE BAR (Inside Form Card) */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4">
             <Button type="button" variant="secondary" onClick={onSuccess} className="flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-2xl border-2">Batal</Button>
             <Button type="submit" isLoading={isSaving} className="flex-[2] py-4 text-xs md:text-sm font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-primary/20">Simpan Perubahan</Button>
          </div>
        </form>
      </div>

      <style>{`
        .label { display: block; font-size: 0.7rem; font-weight: 900; color: #64748b; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .label-sm { display: block; font-size: 0.6rem; font-weight: 900; color: #94a3b8; margin-bottom: 0.4rem; letter-spacing: 0.1em; }
        .input-field { width: 100%; background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 1rem; padding: 0.8rem 1.2rem; color: #0f172a; outline: none; transition: all 0.3s; font-weight: 700; font-size: 0.9rem; }
        .dark .input-field { background-color: #0f172a; border-color: #1e293b; color: #f1f5f9; }
        .input-field:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
      `}</style>
    </div>
  );
};

export default EditProfile;
