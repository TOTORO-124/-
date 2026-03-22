import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, ExternalLink, Info, CheckCircle2, Lightbulb, FileText } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/i;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return null;
  };

  const embedUrl = getEmbedUrl(project.link);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-paper/95 backdrop-blur-2xl overflow-y-auto text-ink"
      >
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
          <button 
            onClick={onClose}
            className="fixed top-8 right-8 z-[110] p-4 glass rounded-full text-ink hover:bg-cocoa/10 transition-colors"
          >
            <X size={32} />
          </button>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            <div className="lg:col-span-12 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-4"
              >
                <span className="px-4 py-2 bg-cocoa text-sky text-xs font-black uppercase tracking-widest rounded-full">
                  {project.type}
                </span>
                <span className="px-4 py-2 bg-ink/5 text-ink/40 text-xs font-black uppercase tracking-widest rounded-full">
                  {project.category}
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-7xl font-black tracking-tighter leading-tight text-ink break-keep"
              >
                {project.title}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-12 pt-8 border-t border-ink/10"
              >
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-cocoa">Main Role</p>
                  <p className="text-xl font-black tracking-tighter text-ink">{project.role}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-cocoa">Production Scope</p>
                  <p className="text-xl font-black tracking-tighter text-ink">{project.production_scope}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-cocoa">Tools Used</p>
                  <p className="text-xl font-black tracking-tighter text-ink">{project.tools}</p>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-12 relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl shadow-cocoa/20 bg-black"
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={project.title}
                />
              ) : (
                <>
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-24 h-24 bg-paper rounded-full flex items-center justify-center text-ink shadow-2xl hover:scale-110 transition-transform duration-500"
                    >
                      <Play size={40} fill="currentColor" />
                    </a>
                  </div>
                </>
              )}
            </motion.div>

            <div className="lg:col-span-7 space-y-16">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-cocoa">
                  <Info size={24} />
                  <h3 className="text-xs font-black uppercase tracking-widest">Project Description</h3>
                </div>
                <p className="text-2xl text-ink/60 font-medium leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6 p-10 glass rounded-[2.5rem] border-ink/5">
                  <div className="flex items-center gap-3 text-cocoa">
                    <CheckCircle2 size={24} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Problem & Goal</h3>
                  </div>
                  <p className="text-lg text-ink/60 font-medium leading-relaxed italic">
                    {project.problem_goal}
                  </p>
                </div>
                <div className="space-y-6 p-10 bg-cocoa rounded-[2.5rem] text-sky shadow-2xl shadow-cocoa/20">
                  <div className="flex items-center gap-3 opacity-60">
                    <Lightbulb size={24} />
                    <h3 className="text-xs font-black uppercase tracking-widest">Solution & Point</h3>
                  </div>
                  <p className="text-lg font-black tracking-tighter leading-relaxed">
                    {project.solution_point}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-12">
              <div className="p-12 glass rounded-[3rem] border-ink/5 space-y-8">
                <div className="flex items-center gap-3 text-cocoa">
                  <FileText size={24} />
                  <h3 className="text-xs font-black uppercase tracking-widest">Production Insight</h3>
                </div>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">Key Achievement</p>
                    <p className="text-xl font-black tracking-tighter text-ink">{project.work_point}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-ink/40">Notes</p>
                    <p className="text-lg font-medium text-ink/60 leading-relaxed">{project.notes}</p>
                  </div>
                </div>
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-6 bg-ink text-paper font-black rounded-2xl hover:bg-ink/90 transition-all shadow-xl shadow-ink/10"
                >
                  Watch Full Video <ExternalLink size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
