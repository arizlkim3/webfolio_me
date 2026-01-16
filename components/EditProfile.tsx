
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Education, Experience, Skill, SocialLinks } from '../types';
import { getUserProfile, saveUserProfile, compressImage } from '../services/storage';
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

  const handleSocialChange = (platform: keyof SocialLinks, value: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      socials: {
        ...profile.socials,
        [platform]: value
      }
    });
  };

  // --- Avatar Handlers ---
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      setIsOptimizing(true);
      setMessage(null);
      try {
        // Kompres avatar ke ukuran kecil (maks 400px) karena hanya avatar
        // Fixed: compressImage only expects (file, maxWidth, quality)
        const optimizedAvatar = await compressImage(file, 400, 0.8);
        setProfile({ ...profile, avatarUrl: optimizedAvatar });
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal memproses foto profil.' });
      } finally {
        setIsOptimizing(false);
      }
    }
  };

  const handleRemoveAvatar = () => {
    if (profile) {
      setProfile({ ...profile, avatarUrl: undefined });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- Education Handlers ---
  const addEducation = () => {
    if (!profile) return;
    const newEdu: Education = { id: crypto.randomUUID(), school: '', degree: '', year: '' };
    setProfile({ ...profile, education: [...profile.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    if (!profile) return;
    setProfile({ ...profile, education: profile.education.filter(e => e.id !== id) });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    if (!profile) return;
    const updatedEdu = profile.education.map(e => e.id === id ? { ...e, [field]: value } : e);
    setProfile({ ...profile, education: updatedEdu });
  };

  // --- Experience Handlers ---
  const addExperience = () => {
    if (!profile) return;
    const newExp: Experience = { id: crypto.randomUUID(), company: '', position: '', year: '', description: '' };
    setProfile({ ...profile, experience: [...profile.experience, newExp] });
  };

  const removeExperience = (id: string) => {
    if (!profile) return;
    setProfile({ ...profile, experience: profile.experience.filter(exp => exp.id !== id) });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    if (!profile) return;
    const updatedExp = profile.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp);
    setProfile({ ...profile, experience: updatedExp });
  };

  // --- Skills Handlers ---
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
        setMessage({ type: 'success', text: 'Profil berhasil disimpan!' });
        setTimeout(() => onSuccess(), 1000);
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan profil. Memori penyimpanan penuh.' });
      }
    }, 800);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-10">
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Edit Profil
        </h2>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section: Foto Profil */}
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-md ring-4 ring-white dark:ring-slate-800 flex items-center justify-center">
                {isOptimizing ? (
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 text-center md:text-left">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Foto Profil</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Optimasi otomatis aktif. Hasil akan dikompres.</p>
              </div>
              <div className="flex gap-3 justify-center md:justify-start">
                <label className={`cursor-pointer bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${isOptimizing ? 'opacity-50 pointer-events-none' : ''}`}>
                  {isOptimizing ? 'Memproses...' : 'Ubah Foto'}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isOptimizing}
                  />
                </label>
                {profile.avatarUrl && !isOptimizing && (
                  <button 
                    type="button" 
                    onClick={handleRemoveAvatar}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section: Info Dasar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Nama Lengkap</label>
                <input type="text" value={profile.name} onChange={(e) => handleChange('name', e.target.value)} className="input-field" />
              </div>
              
              <div>
                <label className="label">Role / Pekerjaan</label>
                <input type="text" value={profile.role} onChange={(e) => handleChange('role', e.target.value)} className="input-field" placeholder="Full Stack Developer" />
              </div>
              
              <div>
                <label className="label">Alamat / Lokasi</label>
                <input type="text" value={profile.address} onChange={(e) => handleChange('address', e.target.value)} className="input-field" />
              </div>

              <div>
                <label className="label">Umur (Tahun)</label>
                <input type="number" value={profile.age || ''} onChange={(e) => handleChange('age', e.target.value)} className="input-field" placeholder="25" />
              </div>

              <div>
                <label className="label">Jenis Kelamin</label>
                <select 
                  value={profile.gender || 'Pria'} 
                  onChange={(e) => handleChange('gender', e.target.value)} 
                  className="input-field appearance-none cursor-pointer"
                >
                  <option value="Pria">Pria</option>
                  <option value="Wanita">Wanita</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label">Biografi Singkat</label>
                <textarea rows={3} value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          {/* Section: Kontak & Sosmed */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Kontak & Media Sosial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="label">Email</label>
                <input type="email" value={profile.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="input-field" />
              </div>
              
              <div>
                <label className="label">Nomor Telepon</label>
                <input type="tel" value={profile.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="input-field" placeholder="0812-xxxx-xxxx" />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <span className="text-green-500 font-bold">WhatsApp</span> Nomor (Tanpa '+')
                </label>
                <input 
                  type="text" 
                  value={profile.socials?.whatsapp || ''} 
                  onChange={(e) => handleSocialChange('whatsapp', e.target.value)} 
                  className="input-field" 
                  placeholder="Contoh: 6281476655793" 
                />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <span className="text-blue-600">LinkedIn</span> URL
                </label>
                <input 
                  type="url" 
                  value={profile.socials?.linkedin || ''} 
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)} 
                  className="input-field" 
                  placeholder="https://linkedin.com/in/username" 
                />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <span className="text-gray-800 dark:text-white">GitHub</span> URL
                </label>
                <input 
                  type="url" 
                  value={profile.socials?.github || ''} 
                  onChange={(e) => handleSocialChange('github', e.target.value)} 
                  className="input-field" 
                  placeholder="https://github.com/username" 
                />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <span className="text-pink-600">Instagram</span> URL
                </label>
                <input 
                  type="url" 
                  value={profile.socials?.instagram || ''} 
                  onChange={(e) => handleSocialChange('instagram', e.target.value)} 
                  className="input-field" 
                  placeholder="https://instagram.com/username" 
                />
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white">Vercel</span> URL
                </label>
                <input 
                  type="url" 
                  value={profile.socials?.vercel || ''} 
                  onChange={(e) => handleSocialChange('vercel', e.target.value)} 
                  className="input-field" 
                  placeholder="https://vercel.com/username" 
                />
              </div>
            </div>
          </div>

          {/* Section: Keahlian (Skills) */}
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Keahlian & Kemahiran</h3>
                <Button type="button" variant="secondary" onClick={addSkill} className="text-xs py-1 px-3">
                   + Tambah Skill
                </Button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.skills.map((skill) => (
                  <div key={skill.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 relative">
                     <button type="button" onClick={() => removeSkill(skill.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors">✕</button>
                     
                     <div className="mb-3 pr-6">
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nama Skill</label>
                        <input 
                          type="text" 
                          value={skill.name} 
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} 
                          className="input-field text-sm" 
                          placeholder="Contoh: Photoshop, React" 
                        />
                     </div>
                     
                     <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Tingkat Kemahiran</label>
                          <span className="text-xs font-bold text-primary">{skill.level}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={skill.level} 
                          onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))} 
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                     </div>
                  </div>
                ))}
             </div>
             {profile.skills.length === 0 && <p className="text-slate-500 text-sm italic">Belum ada skill yang ditambahkan.</p>}
          </div>

          {/* Section: Pengalaman */}
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Pengalaman Kerja</h3>
                <Button type="button" variant="secondary" onClick={addExperience} className="text-xs py-1 px-3">
                   + Tambah
                </Button>
             </div>
             {profile.experience.map((exp) => (
               <div key={exp.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 relative group">
                  <button type="button" onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">✕</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="input-field text-sm" placeholder="Nama Perusahaan" />
                    <input type="text" value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className="input-field text-sm" placeholder="Posisi / Jabatan" />
                    <input type="text" value={exp.year} onChange={(e) => updateExperience(exp.id, 'year', e.target.value)} className="input-field text-sm md:col-span-2" placeholder="Tahun (misal: 2020 - 2022)" />
                  </div>
                  <textarea rows={2} value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className="input-field text-sm" placeholder="Deskripsi pekerjaan..." />
               </div>
             ))}
             {profile.experience.length === 0 && <p className="text-slate-500 text-sm italic">Belum ada data pengalaman.</p>}
          </div>

          {/* Section: Pendidikan */}
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Pendidikan</h3>
                <Button type="button" variant="secondary" onClick={addEducation} className="text-xs py-1 px-3">
                   + Tambah
                </Button>
             </div>
             {profile.education.map((edu) => (
               <div key={edu.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 relative group">
                  <button type="button" onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">✕</button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className="input-field text-sm" placeholder="Nama Sekolah/Univ" />
                    <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="input-field text-sm" placeholder="Gelar / Jurusan" />
                    <input type="text" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} className="input-field text-sm" placeholder="Tahun" />
                  </div>
               </div>
             ))}
             {profile.education.length === 0 && <p className="text-slate-500 text-sm italic">Belum ada data pendidikan.</p>}
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="secondary" onClick={onSuccess} className="w-1/3" disabled={isOptimizing}>Batal</Button>
            <Button type="submit" isLoading={isSaving} className="w-2/3" disabled={isOptimizing}>Simpan Perubahan</Button>
          </div>
        </form>
      </div>
      <style>{`
        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.5rem;
        }
        .dark .label {
          color: #cbd5e1;
        }
        .input-field {
          width: 100%;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
        }
        .dark .input-field {
          background-color: #0f172a;
          border-color: #334155;
          color: #fff;
        }
        .input-field:focus {
          ring: 2px;
          ring-color: #6366f1;
          border-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
