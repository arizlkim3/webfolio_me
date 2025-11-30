
import React from 'react';
import { UserProfile } from '../types';

interface ProfileSectionProps {
  profile: UserProfile;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  return (
    <div className="mb-12 animate-fade-in">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none mb-8">
        
        {/* Banner Image - Taller for better look */}
        <div className="h-40 md:h-60 bg-gradient-to-r from-primary via-purple-500 to-secondary relative">
          <div className="absolute inset-0 bg-black/10"></div> {/* Overlay halus */}
        </div>

        <div className="px-6 md:px-10 pb-8 relative">
          
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Avatar Section - Pull up with negative margin, strictly isolated */}
            <div className="relative -mt-16 md:-mt-20 flex-shrink-0 flex justify-center md:justify-start">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-slate-800 p-1.5 shadow-xl ring-4 ring-white dark:ring-slate-800">
                 {/* Avatar Content */}
                 <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl md:text-5xl font-bold text-slate-400 dark:text-slate-500 select-none">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                 </div>
              </div>
            </div>

            {/* Info Section - Padded top to align with bottom of avatar */}
            <div className="flex-1 pt-2 md:pt-4 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                    {profile.name}
                  </h1>
                  <p className="text-lg md:text-xl text-primary font-medium mb-3">{profile.role}</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400">
                    {profile.address && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {profile.address}
                      </span>
                    )}
                    {profile.email && (
                      <span className="flex items-center gap-1.5">
                         <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                         {profile.email}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Social Actions / Placeholders */}
                <div className="flex gap-2 justify-center md:justify-end">
                   {/* Bisa ditambahkan tombol sosmed di sini nanti */}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* About - Takes 2 cols */}
             <div className="md:col-span-2 space-y-4">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 Tentang Saya
               </h3>
               <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">
                 {profile.bio || "Belum ada deskripsi."}
               </p>
             </div>

             {/* Skills - Takes 1 col */}
             {profile.skills.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
                   <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Keahlian</h3>
                   <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium border border-slate-200 dark:border-slate-600 shadow-sm">
                          {skill}
                        </span>
                      ))}
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
         {/* Experience Column */}
         <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
               <span className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </span>
               Pengalaman
            </h3>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent dark:before:from-slate-700 dark:before:via-slate-700">
               {profile.experience.length > 0 ? profile.experience.map((exp) => (
                  <div key={exp.id} className="relative flex items-start group">
                     <div className="absolute left-0 mt-1.5 w-2 h-2 rounded-full ring-4 ring-white dark:ring-card bg-blue-500 ml-2.5"></div>
                     <div className="ml-10 w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                           <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{exp.position}</h4>
                           <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded whitespace-nowrap">{exp.year}</span>
                        </div>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{exp.company}</div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
                           {exp.description}
                        </p>
                     </div>
                  </div>
               )) : (
                 <p className="text-slate-500 text-sm italic pl-10">Belum ada data pengalaman.</p>
               )}
            </div>
         </div>

         {/* Education Column */}
         <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
               <span className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
               </span>
               Pendidikan
            </h3>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent dark:before:from-slate-700 dark:before:via-slate-700">
               {profile.education.length > 0 ? profile.education.map((edu) => (
                  <div key={edu.id} className="relative flex items-start group">
                     <div className="absolute left-0 mt-1.5 w-2 h-2 rounded-full ring-4 ring-white dark:ring-card bg-purple-500 ml-2.5"></div>
                     <div className="ml-10 w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                           <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-secondary transition-colors">{edu.school}</h4>
                           <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded whitespace-nowrap">{edu.year}</span>
                        </div>
                        <div className="text-base font-medium text-slate-700 dark:text-slate-300">{edu.degree}</div>
                     </div>
                  </div>
               )) : (
                 <p className="text-slate-500 text-sm italic pl-10">Belum ada data pendidikan.</p>
               )}
            </div>
         </div>
      </div>
      
      <div className="my-10 border-t border-slate-200 dark:border-slate-800"></div>
    </div>
  );
};

export default ProfileSection;
