import React from 'react';
import { motion } from 'motion/react';
import { Play, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: (p: Project) => void;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onClick(project)}
      className="group relative aspect-video rounded-3xl overflow-hidden cursor-pointer shadow-xl shadow-cocoa/5 hover:shadow-2xl hover:shadow-cocoa/10 transition-all duration-700"
    >
      <img 
        src={project.thumbnail} 
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-16 h-16 bg-paper rounded-full flex items-center justify-center text-ink shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
          <Play size={24} fill="currentColor" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 text-paper">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-cocoa text-sky rounded-full">
            {project.type}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-paper/10 text-paper/60 rounded-full">
            {project.category}
          </span>
        </div>
        <h3 className="text-2xl font-black tracking-tighter mb-2">{project.title}</h3>
        <div className="flex items-center gap-2 text-xs font-bold text-paper/40 group-hover:text-paper/60 transition-colors">
          View Project <ExternalLink size={12} />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
