import React from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Play, ExternalLink } from 'lucide-react';
import { Project, Profile } from '../types';

interface HeroProps {
  profile: Profile;
  mainProject: Project | null;
  onProjectClick: (p: Project) => void;
}

const Hero: React.FC<HeroProps> = ({ profile, mainProject, onProjectClick }) => {
  return (
    <section className="relative min-h-[60vh] flex flex-col justify-center pt-16 pb-12 px-6 md:px-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-cocoa/5 -skew-x-12 origin-top-right -z-10" />
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-5 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cocoa/5 border border-cocoa/10 text-cocoa text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cocoa" />
            {profile.hero_label}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <h1 className="text-[2.5rem] md:text-[3rem] font-black tracking-tighter leading-[1.1] text-ink break-keep">
              {profile.hero_title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-[1.1] text-ink/40 break-keep">
              {profile.hero_subtitle}
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-ink/70 font-medium leading-relaxed break-keep"
          >
            {profile.hero_description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-6 pt-4 items-center"
          >
            <a 
              href="#work" 
              className="group flex items-center gap-3 text-lg font-black text-ink hover:text-cocoa transition-all"
            >
              View Works 
              <div className="w-8 h-8 rounded-full border border-ink/10 flex items-center justify-center group-hover:border-cocoa group-hover:bg-cocoa group-hover:text-sky transition-all">
                <ArrowDownRight size={16} className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </a>
            <div className="w-px h-8 bg-ink/10 hidden md:block" />
            <a 
              href="#contact" 
              className="text-lg font-black text-ink/30 hover:text-ink transition-colors"
            >
              Let's Talk
            </a>
          </motion.div>
        </div>

        {mainProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-7 relative group"
          >
            <div 
              onClick={() => onProjectClick(mainProject)}
              className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-xl shadow-cocoa/10"
            >
              <img 
                src={mainProject.thumbnail} 
                alt={mainProject.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-20 h-20 bg-paper rounded-full flex items-center justify-center text-ink shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                  <Play size={32} fill="currentColor" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-paper">
                <p className="text-xs font-black uppercase tracking-widest mb-2 text-sky/80">Featured Project</p>
                <h3 className="text-3xl font-black tracking-tighter mb-4">{mainProject.title}</h3>
                <div className="flex items-center gap-2 text-sm font-bold text-paper/60">
                  {mainProject.type} <ExternalLink size={14} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Hero;
