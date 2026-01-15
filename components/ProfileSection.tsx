
import React from 'react';
import { UserProfile } from '../types';

interface ProfileSectionProps {
  profile: UserProfile;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  const waNumber = profile.socials?.whatsapp || '6281476655793';
  const waLink = `https://wa.me/${waNumber}`;

  return (
    <div className="mb-12 animate-fade-in">
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none mb-8">
        
        {/* Banner Image */}
        <div className="h-40 md:h-60 bg-gradient-to-r from-primary via-purple-500 to-secondary relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="px-6 md:px-10 pb-8 relative">
          
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Avatar Section */}
            <div className="relative -mt-16 md:-mt-20 flex-shrink-0 flex justify-center md:justify-start">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-slate-800 p-1.5 shadow-xl ring-4 ring-white dark:ring-slate-800">
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

            {/* Info Section */}
            <div className="flex-1 pt-2 md:pt-4 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                    {profile.name}
                  </h1>
                  <p className="text-lg md:text-xl text-primary font-medium mb-4">{profile.role}</p>
                  
                  {/* Personal Details Row */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 text-sm text-slate-600 dark:text-slate-400 mb-6">
                    {profile.age && (
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {profile.age} Tahun
                      </span>
                    )}
                    {profile.gender && (
                       <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {profile.gender}
                      </span>
                    )}
                     {profile.address && (
                      <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {profile.address}
                      </span>
                    )}
                  </div>

                  {/* WhatsApp Pill & Contact Row */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    {/* WhatsApp Button */}
                    <a 
                      href={waLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-[#25D366] text-white rounded-full font-bold text-sm shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Hubungi WhatsApp
                    </a>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                      {profile.email && (
                        <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          </div>
                          {profile.email}
                        </a>
                      )}
                      {profile.phone && (
                        <a href={`tel:${profile.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          </div>
                          {profile.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                {profile.socials && (
                   <div className="flex gap-2 justify-center md:justify-end mt-4 md:mt-0">
                      {profile.socials.linkedin && (
                        <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-110 transition-all rounded-lg" title="LinkedIn">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                      )}
                      {profile.socials.github && (
                        <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-110 transition-all rounded-lg" title="GitHub">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                      )}
                      {profile.socials.instagram && (
                        <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:scale-110 transition-all rounded-lg" title="Instagram">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                      )}
                      {profile.socials.vercel && (
                        <a href={profile.socials.vercel} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-110 transition-all rounded-lg" title="Vercel">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512"><path d="M256 48l240 416H16z"/></svg>
                        </a>
                      )}
                       {profile.socials.twitter && (
                        <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-110 transition-all rounded-lg" title="Twitter / X">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                      )}
                   </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* About */}
             <div className="md:col-span-2 space-y-4">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 Tentang Saya
               </h3>
               <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">
                 {profile.bio || "Belum ada deskripsi."}
               </p>
             </div>

             {/* Skills with Progress Bars */}
             {profile.skills.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700 h-fit">
                   <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Keahlian</h3>
                   <div className="flex flex-col gap-4">
                      {profile.skills.map((skill, idx) => (
                        <div key={skill.id || idx}>
                           <div className="flex justify-between items-end mb-1">
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{skill.name}</span>
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{skill.level}%</span>
                           </div>
                           <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-primary to-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${skill.level}%` }}
                              ></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
         
         {/* Experience Column */}
         <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm h-full">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
               <span className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               </span>
               Pengalaman
            </h3>
            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
               {profile.experience.length > 0 ? profile.experience.map((exp) => (
                  <div key={exp.id} className="relative flex items-start group">
                     {/* Timeline Dot */}
                     <div className="absolute left-0 mt-1.5 w-7 h-7 flex items-center justify-center bg-white dark:bg-card z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-800"></div>
                     </div>
                     
                     <div className="ml-10 w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                           <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{exp.position}</h4>
                           <span className="inline-block mt-1 sm:mt-0 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/50 whitespace-nowrap">
                             {exp.year}
                           </span>
                        </div>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">{exp.company}</div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
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
         <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm h-full">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
               <span className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
               </span>
               Pendidikan
            </h3>
            
            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
               {profile.education.length > 0 ? profile.education.map((edu) => (
                  <div key={edu.id} className="relative flex items-start group">
                     {/* Timeline Dot */}
                     <div className="absolute left-0 mt-1.5 w-7 h-7 flex items-center justify-center bg-white dark:bg-card z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-white dark:ring-slate-800"></div>
                     </div>
                     
                     <div className="ml-10 w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-2">
                           <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-secondary transition-colors">
                             {edu.school}
                           </h4>
                           <span className="inline-block text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/50 whitespace-nowrap">
                             {edu.year}
                           </span>
                        </div>
                        <div className="text-base font-medium text-slate-600 dark:text-slate-300">
                           {edu.degree}
                        </div>
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
