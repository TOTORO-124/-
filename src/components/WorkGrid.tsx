import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Play } from 'lucide-react';
import { Project, Profile } from '../types';

interface WorkGridProps {
  projects: Project[];
  profile: Profile | null;
  onProjectClick: (p: Project) => void;
}

const WorkGrid: React.FC<WorkGridProps> = ({ projects, profile, onProjectClick }) => {
  const [filter, setFilter] = useState('All');
  const [displayCount, setDisplayCount] = useState(6);
  const categories = [
    {v: 'All', l: '전체'},
    {v: 'Corporate', l: '기업 영상'},
    {v: 'Education', l: '교육/강의'},
    {v: 'Interview', l: '인터뷰'},
    {v: 'Sketch/Event', l: '스케치/행사'},
    {v: 'Shorts', l: '숏폼/SNS'}
  ];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const displayedProjects = filteredProjects.slice(0, displayCount);
  const hasMore = filteredProjects.length > displayCount;

  return (
    <section id="work" className="py-16 md:py-20 bg-paper">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8"
        >
          <div>
            <h2 className="text-xs font-black tracking-[0.4em] uppercase text-muted mb-3">{profile?.work_title || 'Work Archive'}</h2>
            <p className="text-[2rem] font-black text-ink tracking-tighter leading-tight">{profile?.work_subtitle || '전체 작업 모음'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.v}
                onClick={() => {
                  setFilter(cat.v);
                  setDisplayCount(6);
                }}
                className={`px-5 py-2 rounded-full text-xs font-black tracking-wider transition-all border ${
                  filter === cat.v 
                    ? 'bg-cocoa text-sky border-cocoa' 
                    : 'bg-surface border-border text-muted hover:border-cocoa/30'
                }`}
              >
                {cat.l}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedProjects.length > 0 ? displayedProjects.map((project, index) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: (index % 3) * 0.1 }}
                onClick={() => onProjectClick(project)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-beige shadow-sm group-hover:shadow-md transition-all">
                  <img 
                    src={project.thumbnail || "https://picsum.photos/seed/work/800/450"} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-ink shadow-lg">
                      <Play size={20} className="text-ink" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8rem] font-black uppercase tracking-widest text-cocoa">{project.type}</span>
                  </div>
                  <h3 className="text-[1.25rem] font-black tracking-tighter text-ink leading-tight group-hover:text-cocoa transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-ink/50 font-medium line-clamp-1">{project.description}</p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-20 text-center bg-beige rounded-3xl flex items-center justify-center border border-border/50">
                <p className="text-muted text-xl font-bold">해당 카테고리의 영상이 없습니다.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setDisplayCount(prev => prev + 6)}
              className="px-8 py-3 bg-ink text-sky rounded-full text-sm font-black tracking-widest hover:bg-cocoa transition-all shadow-lg shadow-ink/10"
            >
              더 많은 프로젝트 보기
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkGrid;
