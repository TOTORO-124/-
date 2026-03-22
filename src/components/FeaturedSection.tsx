import React from 'react';
import { motion } from 'motion/react';
import { Play, ChevronRight } from 'lucide-react';
import { Project, Profile } from '../types';

interface FeaturedSectionProps {
  projects: Project[];
  profile: Profile | null;
  onProjectClick: (p: Project) => void;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ projects, profile, onProjectClick }) => {
  return (
    <section id="featured" className="py-16 md:py-20 bg-beige">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8"
        >
          <div>
            <h2 className="text-xs font-black tracking-[0.4em] uppercase text-cocoa mb-3">{profile?.featured_title || 'Featured Projects'}</h2>
            <p className="text-[2rem] font-black text-ink tracking-tighter leading-tight">{profile?.featured_subtitle || '대표작 3선'}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onProjectClick(project)}
              className="card-clean group cursor-pointer flex flex-col h-full"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-paper shadow-sm group-hover:shadow-md transition-all">
                <img 
                  src={project.thumbnail || "https://picsum.photos/seed/project/800/450"} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-ink shadow-lg">
                    <Play size={20} className="text-ink" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col flex-grow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-cocoa/10 text-cocoa text-[0.8rem] font-black uppercase tracking-widest">
                    {project.type}
                  </span>
                </div>
                
                <h3 className="text-[1.25rem] font-black tracking-tighter text-ink leading-tight group-hover:text-cocoa transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-sm text-ink/60 font-medium leading-relaxed line-clamp-2 flex-grow">
                  {project.description}
                </p>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">Main Role</p>
                    <p className="text-xs font-black text-ink">{project.role}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-cocoa/5 flex items-center justify-center text-cocoa group-hover:bg-cocoa group-hover:text-sky transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center bg-paper rounded-3xl flex items-center justify-center border border-border/50">
              <p className="text-muted text-xl font-bold">표시할 대표작이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
