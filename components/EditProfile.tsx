
import React, { useState, useEffect } from 'react';
import { UserProfile, Education, Experience } from '../types';
import { getUserProfile, saveUserProfile } from '../services/storage';
import Button from './Button';

interface EditProfileProps {
  onSuccess: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onSuccess }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skillsInput, setSkillsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const data = getUserProfile();
    setProfile(data);
    setSkillsInput(data.skills.join(', '));
  }, []);

  const handleChange = (field: keyof UserProfile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
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
    setProfile({ ...profile, experience: profile.experience.filter(e => e.id !== id) });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    if (!profile) return;
    const updatedExp = profile.experience.map(e => e.id === id ? { ...e, [field]: value } : e);
    setProfile({ ...profile, experience: updatedExp });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    
    const updatedProfile: UserProfile = {
      ...profile,
      skills: skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
    };

    const success = saveUserProfile(updatedProfile);
    
    setTimeout(() => {
      setIsSaving(false);
      if (success) {
        setMessage({ type: 'success', text: 'Profil berhasil disimpan!' });
        setTimeout(() => onSuccess(), 1000);
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan profil.' });
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
          
          {/* Section: Info Dasar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Informasi Dasar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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
                <label className="label">Email</label>
                <input type="email" value={profile.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="label">Biografi Singkat</label>
                <textarea rows={3} value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="label">Keahlian (Skills) - Pisahkan dengan koma</label>
                <input type="text" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} className="input-field" placeholder="React, TypeScript, UI Design" />
              </div>
            </div>
          </div>

          {/* Section: Pengalaman */}
          <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Pengalaman Kerja</h3>
                <Button type="button" variant="secondary" onClick={addExperience} className="text-xs py-1 px-3">
                   + Tambah
                </Button>
             </div>
             {profile.experience.map((exp, index) => (
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
             {profile.education.map((edu, index) => (
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
            <Button type="button" variant="secondary" onClick={onSuccess} className="w-1/3">Batal</Button>
            <Button type="submit" isLoading={isSaving} className="w-2/3">Simpan Perubahan</Button>
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
