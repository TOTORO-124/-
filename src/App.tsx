import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Mail, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Menu, 
  X, 
  Github, 
  Instagram, 
  Youtube,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  LogOut,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { Project, Experience, Profile } from './types';
import { supabase } from './lib/supabase';

// --- Constants ---

const DEFAULT_PROFILE: Partial<Profile> = {
  site_name: 'TEDIO',
  hero_label: 'Video Editor & Motion Designer',
  hero_title: '브랜드 톤은 지키고,',
  hero_subtitle: '메시지는 더 또렷하게.',
  hero_description: '기업·교육·인터뷰 중심의 영상 편집/모션 작업을 합니다.\n목적에 맞는 구조, 자막 가독성, 리듬감 있는 편집에 강합니다.',
  about_strengths_title: 'About & Strengths',
  about_subtitle: '영상의 목적과 톤을 먼저 이해하고, \n구조와 리듬으로 전달력을 높이는 편집을 지향합니다.',
  about_text: '기업/교육/인터뷰 기반 작업을 중심으로, 깔끔하고 안정적인 결과물을 만듭니다. \n단순한 컷 편집을 넘어 시청자가 끝까지 몰입할 수 있는 흐름을 설계합니다.',
  strength1_title: '구조 설계',
  strength1_desc: '흐름이 자연스럽고 이해가 쉬운 편집',
  strength2_title: '자막 가독성',
  strength2_desc: '화면을 해치지 않는 자막 배치와 리듬',
  strength3_title: '마감 퀄리티',
  strength3_desc: '사운드 정리, 템포, 전체 톤 통일',
  featured_title: 'Featured Projects',
  featured_subtitle: '대표작 3선',
  work_title: 'Work Archive',
  work_subtitle: '전체 작업 모음',
  contact_title: 'Contact',
  contact_subtitle: "Let's collaborate.",
  contact_email: 'gns8365@naver.com',
  contact_kakao: 'https://open.kakao.com/o/sribRuxh',
  exp_title: 'Experience Snapshot',
  exp_label_field: '주 작업 분야',
  exp_label_scope: '협업 범위',
  exp_label_strengths: '강점',
  exp_label_brands: '협력 브랜드'
};

const DEFAULT_EXPERIENCE: Partial<Experience> = {
  role: 'Freelance Video Editor',
  period: '2021 - Present',
  field: '기업 홍보, 교육 콘텐츠, 인터뷰',
  scope: '컷 편집, 모션 그래픽, 자막 디자인, 색보정',
  strengths: '스토리텔링 중심의 편집, 가독성 높은 자막 리듬',
  brands: '기업 홍보 영상, 유튜브 채널, 온라인 강의 플랫폼 등 다수'
};

// --- Components ---

const VideoModal = ({ isOpen, videoUrl, onClose }: { isOpen: boolean, videoUrl: string, onClose: () => void }) => {
  if (!isOpen) return null;

  // Simple YouTube/Vimeo/Instagram ID extractor
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop()?.split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    if (url.includes('instagram.com')) {
      const match = url.match(/(?:p|reel|reels|tv)\/([^\/?#&]+)/);
      const id = match ? match[1] : null;
      return id ? `https://www.instagram.com/p/${id}/embed` : url;
    }
    return url;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-cocoa/95 flex items-center justify-center p-4 md:p-12"
      onClick={onClose}
    >
      <button className="absolute top-8 right-8 text-sky hover:text-sky-hover transition-colors">
        <X size={32} />
      </button>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-6xl aspect-video glass rounded-3xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <iframe 
          src={getEmbedUrl(videoUrl)}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </motion.div>
  );
};

const Navbar = ({ profile, onAdminClick }: { profile: Profile | null, onAdminClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Featured', href: '#featured' },
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-4 shadow-lg' : 'bg-white/80 backdrop-blur-md py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold tracking-tighter font-serif italic text-cocoa">{profile?.site_name || 'TEDIO'}</a>
        
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a key={item.name} href={item.href} className="text-sm font-medium text-cocoa/80 hover:text-sky-hover transition-colors">
              {item.name}
            </a>
          ))}
          <button 
            onClick={() => window.location.href = '#contact'}
            className="px-5 py-2 rounded-full bg-cocoa text-white text-sm font-semibold hover:bg-sky-hover transition-colors"
          >
            협업/채용 문의
          </button>
          <button onClick={onAdminClick} className="p-2 text-cocoa/60 hover:text-sky-hover transition-colors">
            <Settings size={18} />
          </button>
        </div>

        <button className="md:hidden text-cocoa" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {menuItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium"
              >
                {item.name}
              </a>
            ))}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  window.location.href = '#contact';
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-cocoa text-white font-semibold"
              >
                협업/채용 문의
              </button>
              <button 
                onClick={() => {
                  onAdminClick();
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-sky/20 text-cocoa"
              >
                <Settings size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ mainProject, profile, onProjectClick }: { mainProject: Project | null, profile: Profile | null, onProjectClick: (p: Project) => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cocoa/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 rounded-full border border-cocoa/20 bg-beige text-xs font-bold text-cocoa mb-6 uppercase tracking-wider">
            {profile?.hero_label || 'Video Editor & Motion Designer'}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-ink">
            {profile?.hero_title || '브랜드 톤은 지키고,'}<br />
            <span className="text-cocoa">{profile?.hero_subtitle || '메시지는 더 또렷하게.'}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted mb-10 max-w-xl leading-relaxed whitespace-pre-line font-medium">
            {profile?.hero_description || '기업·교육·인터뷰 중심의 영상 편집/모션 작업을 합니다.\n목적에 맞는 구조, 자막 가독성, 리듬감 있는 편집에 강합니다.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#featured" className="px-8 py-4 rounded-full bg-cocoa text-paper font-bold flex items-center gap-2 hover:bg-cocoa-hover transition-all hover:scale-105 shadow-lg shadow-cocoa/20">
              대표작 보기 <ChevronRight size={18} />
            </a>
            <a href="#contact" className="px-8 py-4 rounded-full border-2 border-cocoa text-cocoa font-bold hover:bg-cocoa/5 transition-colors">
              협업/채용 문의
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          onClick={() => mainProject && onProjectClick(mainProject)}
          className="relative aspect-video rounded-2xl overflow-hidden border border-cocoa/5 shadow-2xl group cursor-pointer"
        >
          <img 
            src={mainProject?.thumbnail || "https://picsum.photos/seed/showreel/1280/720"} 
            alt="Showreel Thumbnail" 
            className="w-full h-full object-cover grayscale blur-[2px] group-hover:grayscale-0 group-hover:blur-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-cocoa/20 flex items-center justify-center group-hover:bg-cocoa/10 transition-colors">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play fill="#5D9CEC" size={32} className="text-sky" />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-sm font-bold tracking-widest uppercase opacity-80 mb-1">
              {mainProject ? mainProject.title : "2024 Showreel"}
            </p>
            <p className="text-xl font-serif italic">Watch the reel</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturedSection = ({ projects, profile, onProjectClick }: { projects: Project[], profile: Profile | null, onProjectClick: (p: Project) => void }) => {
  return (
    <section id="featured" className="py-32 bg-beige">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-4">{profile?.featured_title || 'Featured Projects'}</h2>
            <p className="text-4xl font-bold text-ink">{profile?.featured_subtitle || '대표작 3선'}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.length > 0 ? projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
              onClick={() => onProjectClick(project)}
            >
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-border shadow-sm">
                <img 
                  src={project.thumbnail || "https://picsum.photos/seed/project/800/450"} 
                  alt={project.title} 
                  className="w-full h-full object-cover blur-[2px] group-hover:blur-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-cocoa/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
                    <Play fill="#F8F6F2" size={24} className="text-paper" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-ink">{project.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-cocoa/10 text-cocoa border border-cocoa/20 uppercase tracking-wider">{project.type}</span>
                </div>
                <p className="text-muted text-sm leading-relaxed font-medium">{project.description}</p>
                {project.notes && (
                  <div className="p-4 rounded-2xl bg-paper border border-border italic text-xs text-muted leading-relaxed">
                    " {project.notes} "
                  </div>
                )}
                <div className="pt-3 border-t border-border">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold mb-1">My Role</p>
                  <p className="text-xs text-ink font-bold">{project.role}</p>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center glass rounded-3xl border-border">
              <p className="text-muted font-serif italic text-xl">표시할 대표작이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const WorkGrid = ({ projects, profile, onProjectClick }: { projects: Project[], profile: Profile | null, onProjectClick: (p: Project) => void }) => {
  const [filter, setFilter] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="work" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-4">{profile?.work_title || 'Work Archive'}</h2>
            <p className="text-4xl font-bold text-ink">{profile?.work_subtitle || '전체 작업 모음'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.v}
                onClick={() => setFilter(cat.v)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  filter === cat.v ? 'bg-cocoa text-paper shadow-md' : 'border border-border text-muted hover:border-cocoa/50 hover:text-cocoa'
                }`}
              >
                {cat.l}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group/scroll">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-cocoa/10"
          >
            <ChevronLeft size={24} className="text-cocoa" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-cocoa/10"
          >
            <ChevronRight size={24} className="text-cocoa" />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => onProjectClick(project)}
                  className="group relative aspect-video h-[200px] md:h-[240px] shrink-0 rounded-xl overflow-hidden border border-cocoa/10 cursor-pointer snap-start"
                >
                  <img 
                    src={project.thumbnail || "https://picsum.photos/seed/work/800/450"} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale blur-[2px] group-hover:grayscale-0 group-hover:blur-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end backdrop-blur-sm">
                    <p className="text-[10px] font-bold text-paper/80 mb-1 uppercase tracking-widest">{project.type}</p>
                    <h4 className="text-base font-bold mb-2 text-paper">{project.title}</h4>
                    <p className="text-[10px] text-paper/60 line-clamp-1 font-medium">{project.role}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="w-full py-20 text-center glass rounded-3xl flex-1 flex items-center justify-center">
                  <p className="text-cocoa/40 font-serif italic text-xl">해당 카테고리의 영상이 없습니다.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Scroll Indicators */}
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-border rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-sky-hover rounded-full"
              initial={{ width: "0%" }}
              whileInView={{ width: "30%" }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = ({ experience, profile }: { experience: Experience | null, profile: Profile | null }) => {
  return (
    <section id="about" className="py-32 bg-beige">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-8">{profile?.about_strengths_title || 'About & Strengths'}</h2>
          <div className="space-y-10">
            <p className="text-2xl md:text-3xl font-bold leading-tight text-ink whitespace-pre-line">
              {profile?.about_subtitle || '영상의 목적과 톤을 먼저 이해하고, \n구조와 리듬으로 전달력을 높이는 편집을 지향합니다.'}
            </p>
            <p className="text-base md:text-lg text-muted leading-relaxed whitespace-pre-line font-medium border-l-4 border-cocoa pl-6 max-w-2xl">
              {profile?.about_text || '기업/교육/인터뷰 기반 작업을 중심으로, 깔끔하고 안정적인 결과물을 만듭니다. \n단순한 컷 편집을 넘어 시청자가 끝까지 몰입할 수 있는 흐름을 설계합니다.'}
            </p>
            
            <div className="grid grid-cols-1 gap-8 pt-6">
              {[
                { title: profile?.strength1_title || '구조 설계', desc: profile?.strength1_desc || '흐름이 자연스럽고 이해가 쉬운 편집' },
                { title: profile?.strength2_title || '자막 가독성', desc: profile?.strength2_desc || '화면을 해치지 않는 자막 배치와 리듬' },
                { title: profile?.strength3_title || '마감 퀄리티', desc: profile?.strength3_desc || '사운드 정리, 템포, 전체 톤 통일' }
              ].map((strength, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-paper border border-border flex items-center justify-center text-cocoa font-bold text-xl group-hover:bg-cocoa group-hover:text-paper transition-all duration-500 shadow-sm">
                    0{i + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-ink mb-1 group-hover:text-cocoa transition-colors">{strength.title}</h4>
                    <p className="text-muted font-medium leading-relaxed">{strength.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            id="experience" 
            className="bg-paper p-10 rounded-3xl border border-border shadow-xl shadow-cocoa/5"
          >
            <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted mb-8">{profile?.exp_title || 'Experience Snapshot'}</h3>
            {experience ? (
              <div className="space-y-8">
                <div>
                  <p className="text-2xl font-bold mb-2 text-ink">{experience.role}</p>
                  <p className="text-sm text-muted font-bold tracking-wider">{experience.period}</p>
                </div>
                <div className="grid gap-4">
                  {[
                    { l: profile?.exp_label_field || '주 작업 분야', v: experience.field },
                    { l: profile?.exp_label_scope || '협업 범위', v: experience.scope },
                    { l: profile?.exp_label_strengths || '강점', v: experience.strengths }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1 py-4 border-b border-border last:border-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{item.l}</span>
                      <span className="text-ink font-bold text-base">{item.v}</span>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{profile?.exp_label_brands || '협력 브랜드'}</span>
                    <p className="text-sm text-ink font-bold leading-relaxed">{experience.brands}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted italic">Loading experience data...</p>
            )}
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {['Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator'].map(tool => (
              <span key={tool} className="px-5 py-2.5 rounded-xl bg-paper border border-border text-xs font-bold text-muted hover:border-cocoa hover:text-cocoa transition-all cursor-default shadow-sm">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = ({ profile }: { profile: Profile | null }) => {
  return (
    <section id="contact" className="py-32 bg-paper text-ink">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-8">{profile?.contact_title || 'Contact'}</h2>
        <h3 className="text-5xl md:text-7xl font-serif italic mb-10 tracking-tighter text-cocoa">{profile?.contact_subtitle || "Let's collaborate."}</h3>
        <p className="text-lg md:text-xl text-muted mb-16 leading-relaxed font-medium">
          프로젝트 협업, 외주, 채용 제안 모두 편하게 연락 주세요.<br />
          확인 후 가능한 빠르게 답변드립니다.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <a 
            href={`mailto:${profile?.contact_email || 'gns8365@naver.com'}`} 
            className="w-full md:w-auto px-10 py-5 rounded-2xl bg-cocoa text-paper hover:bg-cocoa-hover transition-all flex items-center justify-center gap-3 font-bold shadow-xl shadow-cocoa/20"
          >
            <Mail size={20} /> {profile?.contact_email || 'gns8365@naver.com'}
          </a>
          <a 
            href={profile?.contact_kakao || "https://open.kakao.com/o/sribRuxh"} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-10 py-5 rounded-2xl border-2 border-cocoa text-cocoa hover:bg-cocoa/5 transition-all flex items-center justify-center gap-3 font-bold"
          >
            카카오 1:1 문의
          </a>
        </div>
      </div>
    </section>
  );
};

// --- Admin Panel ---

const AdminPanel = ({ projects, experience, profile, onUpdate, onClose }: { 
  projects: Project[], 
  experience: Experience | null,
  profile: Profile | null,
  onUpdate: () => void,
  onClose: () => void 
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'experience' | 'profile'>('projects');
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(experience);
  const [editingProfile, setEditingProfile] = useState<Partial<Profile> | null>(profile);

  useEffect(() => {
    if (experience) setEditingExp(experience);
  }, [experience]);

  useEffect(() => {
    if (profile) setEditingProfile(profile);
  }, [profile]);

  const handleLogin = async () => {
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const dbPassword = profile?.admin_password;
    const adminPassword = dbPassword || envPassword || 'admin';
    
    if (password === adminPassword) {
      setIsLoggedIn(true);
      setToken('admin-session');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const saveProject = async (p: Partial<Project>) => {
    if (!supabase) {
      alert('Supabase 설정이 필요합니다.');
      return;
    }
    
    setIsSaving(true);
    try {
      if (!p) return;
      
      const projectToSave = { ...p };
      if (!projectToSave.id || projectToSave.id === 0) {
        delete projectToSave.id;
        // 새 프로젝트인 경우 마지막 순서로 지정
        if (projectToSave.order_index === undefined) {
          projectToSave.order_index = projects.length;
        }
      }

      if (projectToSave.is_main) {
        await supabase.from('projects').update({ is_main: false }).neq('id', projectToSave.id || -1);
      }

      const { error } = await supabase.from('projects').upsert(projectToSave);
      
      if (!error) {
        alert('성공적으로 저장되었습니다.');
        setEditingProject(null);
        onUpdate();
      } else {
        alert(`저장 실패: ${error.message}`);
      }
    } catch (error) {
      console.error('Save Error:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async (id: any) => {
    if (id === undefined || id === null) {
      alert('삭제할 프로젝트의 ID를 찾을 수 없습니다.');
      return;
    }

    if (!window.confirm('정말 이 프로젝트를 삭제하시겠습니까?')) return;
    
    if (!supabase) {
      alert('Supabase 설정이 필요합니다.');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', Number(id));
      
      if (!error) {
        alert('삭제되었습니다.');
        onUpdate();
      } else {
        alert(`삭제 실패: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveExperience = async () => {
    if (!supabase || !editingExp) {
      alert('데이터가 없거나 Supabase 설정이 필요합니다.');
      return;
    }
    setIsSaving(true);
    try {
      const { id, ...updateData } = editingExp;
      const { error } = await supabase.from('experience').update(updateData).eq('id', id || 1);
      if (!error) {
        alert('경력이 업데이트되었습니다.');
        onUpdate();
      } else {
        alert(`업데이트 실패: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!supabase || !editingProfile) {
      alert('데이터가 없거나 Supabase 설정이 필요합니다.');
      return;
    }
    setIsSaving(true);
    try {
      const { id, ...updateData } = editingProfile;
      const { error } = await supabase.from('profile').update(updateData).eq('id', id || 1);
      if (!error) {
        alert('프로필이 업데이트되었습니다.');
        onUpdate();
      } else {
        alert(`업데이트 실패: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;
    
    const p1 = newProjects[index];
    const p2 = newProjects[targetIndex];
    
    if (!supabase) return;

    setIsSaving(true);
    try {
      const { error: e1 } = await supabase.from('projects').update({ order_index: targetIndex }).eq('id', p1.id);
      const { error: e2 } = await supabase.from('projects').update({ order_index: index }).eq('id', p2.id);
      
      if (!e1 && !e2) {
        onUpdate();
      } else {
        console.error('Move Error:', e1 || e2);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[100] bg-paper/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl border-cocoa/10">
          <h2 className="text-2xl font-bold mb-2 text-cocoa">관리자 로그인</h2>
          <p className="text-sm text-cocoa/60 mb-6">
            {profile?.admin_password || import.meta.env.VITE_ADMIN_PASSWORD ? '설정하신 비밀번호를 입력하세요.' : '비밀번호가 설정되지 않았습니다. 기본값 "admin"을 사용하세요.'}
          </p>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호"
            className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-sky-hover text-cocoa font-medium"
          />
          <div className="flex gap-4">
            <button onClick={handleLogin} className="flex-1 py-3 bg-cocoa text-white font-bold rounded-xl hover:bg-sky-hover transition-colors">로그인</button>
            <button onClick={onClose} className="flex-1 py-3 border border-border rounded-xl text-cocoa font-bold hover:bg-paper transition-colors">취소</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-paper overflow-y-auto text-cocoa">
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">대시보드</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                if (window.confirm('로그아웃 하시겠습니까?')) {
                  setIsLoggedIn(false);
                }
              }} 
              className="p-3 glass rounded-xl text-cocoa hover:bg-sky/20 transition-colors"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
            <button onClick={onClose} className="p-3 glass rounded-xl text-cocoa hover:bg-sky/20 transition-colors" title="닫기"><X size={20} /></button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'projects' ? 'bg-cocoa text-white shadow-lg shadow-cocoa/20' : 'glass text-cocoa/60 hover:text-cocoa'}`}
          >
            프로젝트 관리
          </button>
          <button 
            onClick={() => setActiveTab('experience')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'experience' ? 'bg-cocoa text-white shadow-lg shadow-cocoa/20' : 'glass text-cocoa/60 hover:text-cocoa'}`}
          >
            경력 관리
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-cocoa text-white shadow-lg shadow-cocoa/20' : 'glass text-cocoa/60 hover:text-cocoa'}`}
          >
            프로필 관리
          </button>
        </div>

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <button 
              onClick={() => setEditingProject({ title: '', type: '', description: '', role: '', link: '', thumbnail: '', is_featured: false, is_main: false, order_index: projects.length, category: 'Corporate' })}
              className="w-full py-4 border-2 border-dashed border-cocoa/10 rounded-2xl flex items-center justify-center gap-2 text-cocoa/20 hover:text-cocoa hover:border-cocoa/30 transition-all"
            >
              <Plus size={20} /> 새 프로젝트 추가
            </button>

            <div className="grid gap-4">
              {projects.map((p, idx) => (
                <div key={p.id} className={`glass p-6 rounded-2xl flex items-center justify-between transition-opacity ${p.is_hidden ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {p.thumbnail && <img src={p.thumbnail} className="w-20 h-12 object-cover rounded-lg" />}
                      {p.is_hidden && (
                        <div className="absolute inset-0 bg-cocoa/40 flex items-center justify-center rounded-lg">
                          <EyeOff size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-cocoa">{p.title}</h4>
                        {p.is_hidden && <span className="text-[10px] px-1.5 py-0.5 bg-cocoa/10 text-cocoa/60 rounded font-bold">숨김</span>}
                      </div>
                      <p className="text-xs text-cocoa/40">
                        {{
                          'Corporate': '기업 영상',
                          'Education': '교육/강의',
                          'Interview': '인터뷰',
                          'Sketch/Event': '스케치/행사',
                          'Shorts': '숏폼/SNS'
                        }[p.category] || p.category} | {p.is_main ? '메인' : p.is_featured ? '대표작' : '일반'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 mr-4">
                      <button 
                        disabled={idx === 0}
                        onClick={() => moveProject(idx, 'up')}
                        className="p-1 hover:bg-cocoa/5 rounded disabled:opacity-20 text-cocoa"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        disabled={idx === projects.length - 1}
                        onClick={() => moveProject(idx, 'down')}
                        className="p-1 hover:bg-cocoa/5 rounded disabled:opacity-20 text-cocoa"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <button onClick={() => setEditingProject(p)} className="p-2 hover:bg-cocoa/5 rounded-lg text-cocoa"><Edit2 size={18} /></button>
                    <button 
                      onClick={() => saveProject({ ...p, is_hidden: !p.is_hidden })} 
                      className={`p-2 rounded-lg transition-colors ${p.is_hidden ? 'bg-cocoa/10 text-cocoa/40' : 'hover:bg-cocoa/5 text-cocoa'}`}
                      title={p.is_hidden ? '숨김 해제' : '숨기기'}
                    >
                      {p.is_hidden ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button onClick={() => deleteProject(p.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && editingExp && (
          <div className="glass p-8 rounded-3xl space-y-8 border-cocoa/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">경력 정보 설정</h3>
              <button 
                onClick={() => setEditingExp({ ...editingExp, ...DEFAULT_EXPERIENCE })}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-sky/10 text-sky hover:bg-sky/20 transition-colors"
              >
                기본 내용 불러오기
              </button>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-cocoa/10 pb-2">기본 정보</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">역할/직무</label>
                  <input 
                    value={editingExp.role || ''} 
                    onChange={e => setEditingExp({...editingExp, role: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">기간</label>
                  <input 
                    value={editingExp.period || ''} 
                    onChange={e => setEditingExp({...editingExp, period: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-cocoa/10 pb-2">상세 내용</h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">주요 분야</label>
                  <input 
                    value={editingExp.field || ''} 
                    onChange={e => setEditingExp({...editingExp, field: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">협업 범위</label>
                  <input 
                    value={editingExp.scope || ''} 
                    onChange={e => setEditingExp({...editingExp, scope: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">강점/특징</label>
                  <input 
                    value={editingExp.strengths || ''} 
                    onChange={e => setEditingExp({...editingExp, strengths: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">협력 브랜드 (쉼표로 구분)</label>
                  <textarea 
                    value={editingExp.brands || ''} 
                    onChange={e => setEditingExp({...editingExp, brands: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium h-20"
                    placeholder="예: 삼성전자, 현대자동차, LG유플러스"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={isSaving}
              onClick={saveExperience} 
              className="w-full py-4 bg-cocoa text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-sky-hover transition-colors disabled:opacity-50"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
              경력 정보 저장
            </button>
          </div>
        )}

        {/* Project Edit Modal */}
        {editingProject && (
          <div className="fixed inset-0 z-[110] bg-cocoa/90 flex items-center justify-center p-6 backdrop-blur-xl">
            <div className="w-full max-w-2xl glass p-8 rounded-3xl max-h-[90vh] overflow-y-auto text-cocoa">
              <h3 className="text-2xl font-bold mb-8">{editingProject.id ? '프로젝트 수정' : '새 프로젝트 등록'}</h3>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">제목</label>
                    <input value={editingProject.title || ''} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">카테고리</label>
                    <select value={editingProject.category || 'Corporate'} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium">
                      {[
                        {v: 'Corporate', l: '기업 영상'},
                        {v: 'Education', l: '교육/강의'},
                        {v: 'Interview', l: '인터뷰'},
                        {v: 'Sketch/Event', l: '스케치/행사'},
                        {v: 'Shorts', l: '숏폼/SNS'}
                      ].map(c => <option key={c.v} value={c.v} className="bg-white">{c.l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">유형 (라벨)</label>
                    <input value={editingProject.type || ''} onChange={e => setEditingProject({...editingProject, type: e.target.value})} className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium" placeholder="예: 기업 홍보" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">역할</label>
                    <input value={editingProject.role || ''} onChange={e => setEditingProject({...editingProject, role: e.target.value})} className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium" placeholder="예: 편집 100%" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">영상 링크 (YouTube/Vimeo/Instagram)</label>
                  <input 
                    value={editingProject.link || ''} 
                    onChange={async (e) => {
                      const url = e.target.value;
                      setEditingProject(prev => ({...prev!, link: url}));
                      
                      // Auto-generate thumbnail
                      if (url) {
                        if (url.includes('youtube.com') || url.includes('youtu.be')) {
                          const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()?.split('?')[0];
                          if (id) {
                            setEditingProject(prev => ({...prev!, link: url, thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`}));
                          }
                        } else if (url.includes('vimeo.com')) {
                          const id = url.split('/').pop()?.split('?')[0];
                          if (id) {
                            try {
                              const res = await fetch(`https://vimeo.com/api/v2/video/${id}.json`);
                              const data = await res.json();
                              if (data[0]?.thumbnail_large) {
                                setEditingProject(prev => ({...prev!, link: url, thumbnail: data[0].thumbnail_large}));
                              }
                            } catch (err) { console.error(err); }
                          }
                        } else if (url.includes('instagram.com')) {
                          const match = url.match(/(?:p|reel|reels|tv)\/([^\/?#&]+)/);
                          const id = match ? match[1] : null;
                          if (id) {
                            // Using weserv.nl as a proxy to bypass Instagram's hotlinking protection
                            const instaMediaUrl = `https://www.instagram.com/p/${id}/media/?size=l`;
                            const proxiedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(instaMediaUrl)}`;
                            
                            setEditingProject(prev => ({
                              ...prev!, 
                              link: url, 
                              thumbnail: proxiedUrl
                            }));
                          }
                        }
                      }
                    }} 
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium" 
                    placeholder="링크를 입력하면 썸네일이 자동으로 추출됩니다."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">썸네일 이미지</label>
                  <div className="grid gap-4">
                    <div className="flex gap-2">
                      <input 
                        value={editingProject.thumbnail || ''} 
                        onChange={e => setEditingProject({...editingProject, thumbnail: e.target.value})} 
                        className="flex-1 bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium" 
                        placeholder="이미지 URL을 입력하거나 파일을 업로드하세요."
                      />
                      {editingProject.thumbnail && (
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-cocoa/20 shrink-0">
                          <img src={editingProject.thumbnail} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className="relative border-2 border-dashed border-cocoa/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-sky-hover transition-all cursor-pointer group"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          try {
                            const fileExt = file.name.split('.').pop();
                            const fileName = `${Math.random()}.${fileExt}`;
                            const filePath = `uploads/${fileName}`;

                            const { error: uploadError } = await supabase.storage
                              .from('portfolio')
                              .upload(filePath, file);

                            if (uploadError) throw uploadError;

                            const { data } = supabase.storage
                              .from('portfolio')
                              .getPublicUrl(filePath);

                            if (data.publicUrl) {
                              setEditingProject(prev => ({...prev!, thumbnail: data.publicUrl}));
                            }
                          } catch (err) { 
                            console.error(err);
                            alert('이미지 업로드에 실패했습니다. Supabase Storage 설정을 확인해주세요.');
                          }
                        }
                      }}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              const fileExt = file.name.split('.').pop();
                              const fileName = `${Math.random()}.${fileExt}`;
                              const filePath = `uploads/${fileName}`;

                              const { error: uploadError } = await supabase.storage
                                .from('portfolio')
                                .upload(filePath, file);

                              if (uploadError) throw uploadError;

                              const { data } = supabase.storage
                                .from('portfolio')
                                .getPublicUrl(filePath);

                              if (data.publicUrl) {
                                setEditingProject(prev => ({...prev!, thumbnail: data.publicUrl}));
                              }
                            } catch (err) { 
                              console.error(err);
                              alert('이미지 업로드에 실패했습니다. Supabase Storage 설정을 확인해주세요.');
                            }
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload size={24} className="text-cocoa/40 group-hover:text-sky-hover transition-colors" />
                      <p className="text-sm text-cocoa/60 group-hover:text-sky-hover font-bold">클릭하거나 이미지 업로드</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">설명</label>
                  <textarea value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 h-24 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">작업 노트 (인사이트)</label>
                  <textarea value={editingProject.notes || ''} onChange={e => setEditingProject({...editingProject, notes: e.target.value})} className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 h-20 font-medium" placeholder="이 영상에서 가장 신경 쓴 부분이나 해결한 문제를 적어주세요." />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={editingProject.is_main || false} onChange={e => setEditingProject({...editingProject, is_main: e.target.checked})} className="w-5 h-5 rounded bg-cocoa/5 border-cocoa/10" />
                    <label className="text-sm font-bold">메인 영상 설정 (Hero 섹션 노출)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={editingProject.is_featured || false} onChange={e => setEditingProject({...editingProject, is_featured: e.target.checked})} className="w-5 h-5 rounded bg-cocoa/5 border-cocoa/10" />
                    <label className="text-sm font-bold">대표작 설정 (상단 3선에 노출)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={editingProject.is_hidden || false} onChange={e => setEditingProject({...editingProject, is_hidden: e.target.checked})} className="w-5 h-5 rounded bg-cocoa/5 border-cocoa/10" />
                    <label className="text-sm font-bold">영상 숨기기 (홈페이지에서 숨김)</label>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    disabled={isSaving}
                    onClick={() => saveProject(editingProject)} 
                    className="flex-1 py-4 bg-cocoa text-white font-bold rounded-xl hover:bg-sky-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                    프로젝트 저장
                  </button>
                  <button onClick={() => setEditingProject(null)} className="flex-1 py-4 glass rounded-xl text-cocoa">취소</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'profile' && editingProfile && (
          <div className="glass p-8 rounded-3xl space-y-8 border-cocoa/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">전체 사이트 문구 설정</h3>
              <button 
                onClick={() => setEditingProfile({ ...editingProfile, ...DEFAULT_PROFILE })}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-sky/10 text-sky hover:bg-sky/20 transition-colors"
              >
                기본 내용 불러오기
              </button>
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-cocoa/10 pb-2">기본 설정</h3>
              <div>
                <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">사이트 이름 / 로고 텍스트</label>
                <input 
                  value={editingProfile.site_name || ''} 
                  onChange={e => setEditingProfile({...editingProfile, site_name: e.target.value})}
                  className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">관리자 비밀번호</label>
                <input 
                  type="password"
                  value={editingProfile.admin_password || ''} 
                  onChange={e => setEditingProfile({...editingProfile, admin_password: e.target.value})}
                  className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  placeholder="관리자 페이지 접속 시 사용할 비밀번호"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-cocoa/10 pb-2">히어로 섹션 (첫 화면)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">상단 라벨 (배지)</label>
                  <input 
                    value={editingProfile.hero_label || ''} 
                    onChange={e => setEditingProfile({...editingProfile, hero_label: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                    placeholder="예: Video Editor & Motion Designer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">메인 타이틀</label>
                  <input 
                    value={editingProfile.hero_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, hero_title: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">서브 타이틀 (강조)</label>
                  <input 
                    value={editingProfile.hero_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, hero_subtitle: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">설명 문구</label>
                <textarea 
                  value={editingProfile.hero_description || ''} 
                  onChange={e => setEditingProfile({...editingProfile, hero_description: e.target.value})}
                  className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium h-24"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-cocoa/10 pb-2">소개 섹션 (About)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">소개 섹션 제목</label>
                  <input 
                    value={editingProfile.about_strengths_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, about_strengths_title: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">소개 서브타이틀 (큰 글씨)</label>
                  <textarea 
                    value={editingProfile.about_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, about_subtitle: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium h-20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">소개 상세 설명 (작은 글씨)</label>
                <textarea 
                  value={editingProfile.about_text || ''} 
                  onChange={e => setEditingProfile({...editingProfile, about_text: e.target.value})}
                  className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium h-32"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">강점 1 제목</label>
                  <input 
                    value={editingProfile.strength1_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength1_title: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium mb-2"
                  />
                  <input 
                    value={editingProfile.strength1_desc || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength1_desc: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium text-sm"
                    placeholder="설명"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">강점 2 제목</label>
                  <input 
                    value={editingProfile.strength2_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength2_title: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium mb-2"
                  />
                  <input 
                    value={editingProfile.strength2_desc || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength2_desc: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium text-sm"
                    placeholder="설명"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">강점 3 제목</label>
                  <input 
                    value={editingProfile.strength3_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength3_title: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium mb-2"
                  />
                  <input 
                    value={editingProfile.strength3_desc || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength3_desc: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium text-sm"
                    placeholder="설명"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-cocoa/10 pb-2">프로젝트 섹션 제목 설정</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">대표작 섹션 제목 (영문)</label>
                  <input 
                    value={editingProfile.featured_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, featured_title: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">대표작 섹션 제목 (국문)</label>
                  <input 
                    value={editingProfile.featured_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, featured_subtitle: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">전체작업 섹션 제목 (영문)</label>
                  <input 
                    value={editingProfile.work_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, work_title: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">전체작업 섹션 제목 (국문)</label>
                  <input 
                    value={editingProfile.work_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, work_subtitle: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-cocoa/10 pb-2">연락처 섹션 (Contact)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">연락처 섹션 제목 (영문)</label>
                  <input 
                    value={editingProfile.contact_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_title: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">연락처 메인 문구</label>
                  <input 
                    value={editingProfile.contact_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_subtitle: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">이메일 주소</label>
                  <input 
                    value={editingProfile.contact_email || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_email: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">카카오톡 오픈채팅 링크</label>
                  <input 
                    value={editingProfile.contact_kakao || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_kakao: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-cocoa/10 pb-2">경력 섹션 라벨 설정</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">경력 섹션 제목</label>
                  <input 
                    value={editingProfile.exp_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_title: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">분야 라벨명</label>
                  <input 
                    value={editingProfile.exp_label_field || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_field: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">범위 라벨명</label>
                  <input 
                    value={editingProfile.exp_label_scope || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_scope: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">강점 라벨명</label>
                  <input 
                    value={editingProfile.exp_label_strengths || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_strengths: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-cocoa/80 mb-2 uppercase">브랜드 라벨명</label>
                  <input 
                    value={editingProfile.exp_label_brands || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_brands: e.target.value})}
                    className="w-full bg-cocoa/5 border border-cocoa/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={isSaving}
              onClick={saveProfile} 
              className="w-full py-4 bg-cocoa text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-sky-hover transition-colors disabled:opacity-50"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
              프로필 정보 저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  const fetchData = async () => {
    if (!supabase) return;
    
    try {
      const [pRes, eRes, prRes] = await Promise.all([
        supabase.from('projects').select('*').order('order_index', { ascending: true }),
        supabase.from('experience').select('*').single(),
        supabase.from('profile').select('*').single()
      ]);
      
      if (pRes.data) setProjects(pRes.data);
      if (eRes.data) setExperience(eRes.data);
      if (prRes.data) setProfile(prRes.data);
    } catch (err) {
      console.error('Fetch Data Error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (profile?.site_name) {
      document.title = `${profile.site_name} | 비디오 에디터 포트폴리오`;
    }
  }, [profile]);

  return (
    <div className="selection:bg-sky selection:text-cocoa">
      <Navbar profile={profile} onAdminClick={() => setIsAdminOpen(true)} />
      
      <main>
        <Hero 
          mainProject={projects.find(p => p.is_main && !p.is_hidden) || null} 
          profile={profile}
          onProjectClick={(p) => setSelectedVideoUrl(p.link)} 
        />
        <FeaturedSection 
          projects={projects.filter(p => p.is_featured && !p.is_hidden)} 
          profile={profile}
          onProjectClick={(p) => setSelectedVideoUrl(p.link)} 
        />
        <WorkGrid 
          projects={projects.filter(p => !p.is_hidden)} 
          profile={profile}
          onProjectClick={(p) => setSelectedVideoUrl(p.link)} 
        />
        <AboutSection experience={experience} profile={profile} />
        <ContactSection profile={profile} />
      </main>

      <footer className="py-12 border-t border-cocoa/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-2xl font-bold tracking-tighter font-serif italic text-cocoa">{profile?.site_name || 'TEDIO'}</p>
          <p className="text-sm text-cocoa/60">© 2024 {profile?.site_name || 'TEDIO'}. All rights reserved.</p>
          <div className="flex gap-6 text-cocoa/80">
            <a href="#" className="hover:text-sky-hover transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-sky-hover transition-colors"><Youtube size={20} /></a>
            <a href="#" className="hover:text-sky-hover transition-colors"><Github size={20} /></a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            projects={projects} 
            experience={experience} 
            profile={profile}
            onUpdate={fetchData} 
            onClose={() => setIsAdminOpen(false)} 
          />
        )}
        {selectedVideoUrl && (
          <VideoModal 
            isOpen={!!selectedVideoUrl} 
            videoUrl={selectedVideoUrl} 
            onClose={() => setSelectedVideoUrl(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
