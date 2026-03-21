import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
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
  EyeOff,
  Sun,
  Moon,
  CheckCircle,
  Zap,
  Cpu,
  MessageSquare,
  Layers,
  Target
} from 'lucide-react';
import { Project, Experience, Profile } from './types';
import { 
  db, 
  auth, 
  storage,
  googleProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  OperationType,
  handleFirestoreError,
  User
} from './firebase';
import { seedData } from './seedData';

// --- Constants ---

const DEFAULT_PROFILE: Partial<Profile> = {
  site_name: 'TEDIO',
  hero_label: 'Video Producer / PD',
  hero_title: '기획부터 납품까지,',
  hero_subtitle: '브랜드의 본질을 영상으로 구현합니다.',
  hero_description: '단순한 편집을 넘어, 메시지의 구조를 설계하고 시청자의 몰입을 연출합니다.\n기획 → 구성 → 연출 → 편집 → 납품 전 과정을 연결하는 비디오 프로듀서 TEDIO입니다.',
  about_strengths_title: 'About & Strengths',
  about_subtitle: '브랜드의 메시지를 가장 또렷하게\n전달하는 비디오 프로듀서.',
  about_text: '영상 제작자로서 저는 단순한 컷 편집을 넘어, 브랜드의 가치를 시각적으로 극대화하는 작업을 지향합니다. 기획 단계부터 참여하여 최종 결과물의 톤앤매너를 일관되게 유지합니다.',
  strength1_title: '기획 및 구성',
  strength1_desc: '정보의 우선순위를 파악하여 흐름이 자연스러운 영상 설계',
  strength2_title: '연출 및 편집',
  strength2_desc: '브랜드 톤을 유지하며 몰입감을 극대화하는 시각적 연출',
  strength3_title: 'AI 워크플로우',
  strength3_desc: 'AI 도구를 활용한 효율적인 제작 및 기획의 정확도 향상',
  featured_title: 'Featured Projects',
  featured_subtitle: '엄선된 대표작',
  work_title: 'Work Archive',
  work_subtitle: '전체 작업 모음',
  contact_title: 'Contact',
  contact_subtitle: "Let's create something great.",
  contact_email: 'gns8365@naver.com',
  contact_kakao: 'https://open.kakao.com/o/sribRuxh',
  exp_title: 'Experience Snapshot',
  exp_label_field: '주 제작 분야',
  exp_label_scope: '제작 범위',
  exp_label_strengths: '핵심 역량',
  exp_label_brands: '협력 브랜드'
};

const DEFAULT_EXPERIENCE: Partial<Experience> = {
  role: 'Video Producer / Director',
  period: '2021 - Present',
  field: '기업 홍보, 교육 콘텐츠, 브랜드 필름',
  scope: '기획, 구성, 연출, 편집, 납품 전 과정',
  strengths: '메시지 구조화, 브랜드 톤앤매너 유지, AI 워크플로우 효율화',
  brands: '다양한 기업 및 교육 기관과 협업 중'
};

// --- Components ---

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-cocoa origin-left z-[100]"
      style={{ scaleX }}
    />
  );
};

const ProjectDetailModal = ({ isOpen, project, onClose }: { isOpen: boolean, project: Project | null, onClose: () => void }) => {
  if (!isOpen || !project) return null;

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
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-paper/95 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto"
          onClick={onClose}
        >
          <button 
            className="fixed top-6 right-6 text-ink/60 hover:text-cocoa transition-colors z-[110] glass p-2 rounded-full"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-5xl bg-paper rounded-3xl md:rounded-[40px] overflow-hidden shadow-2xl relative border border-border"
            onClick={e => e.stopPropagation()}
          >
            <div className="aspect-video w-full bg-black">
              <iframe 
                src={getEmbedUrl(project.link)}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="p-8 md:p-12 space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-cocoa/10 text-cocoa text-[10px] font-black uppercase tracking-widest border border-cocoa/20">
                      {project.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-ink/5 text-ink/40 text-[10px] font-black uppercase tracking-widest border border-ink/10">
                      {project.type}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-ink tracking-tighter">{project.title}</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-black mb-1">Production Scope</p>
                  <p className="text-lg text-ink font-black">{project.production_scope || project.role}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  {project.problem_goal && (
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cocoa mb-4">
                        <Target size={14} /> Problem & Goal
                      </h4>
                      <p className="text-muted leading-relaxed font-medium whitespace-pre-line">
                        {project.problem_goal}
                      </p>
                    </div>
                  )}
                  {project.solution_point && (
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cocoa mb-4">
                        <Zap size={14} /> Solution & Point
                      </h4>
                      <p className="text-muted leading-relaxed font-medium whitespace-pre-line">
                        {project.solution_point}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cocoa mb-4">
                      <Layers size={14} /> Description
                    </h4>
                    <p className="text-muted leading-relaxed font-medium">
                      {project.description}
                    </p>
                  </div>
                  {project.tools && (
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-cocoa mb-4">
                        <Cpu size={14} /> Tools Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tools.split(',').map(tool => (
                          <span key={tool} className="px-3 py-1.5 rounded-lg bg-ink/5 border border-ink/10 text-[10px] font-bold text-ink/60">
                            {tool.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {project.notes && (
                <div className="p-8 rounded-3xl bg-beige border border-cocoa/10">
                  <p className="text-sm font-bold text-cocoa mb-2 uppercase tracking-widest">Producer's Note</p>
                  <p className="text-ink/80 leading-relaxed font-medium italic">
                    "{project.notes}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ profile, onAdminClick, isDarkMode, onThemeToggle }: { 
  profile: Profile | null, 
  onAdminClick: () => void,
  isDarkMode: boolean,
  onThemeToggle: () => void
}) => {
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
    { name: 'Process', href: '#process' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold tracking-tighter text-ink">{profile?.site_name || 'TEDIO'}</a>
        
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a key={item.name} href={item.href} className="text-sm font-medium text-ink/60 hover:text-ink transition-colors">
              {item.name}
            </a>
          ))}
          <button 
            onClick={() => window.location.href = '#contact'}
            className="px-5 py-2 rounded-full bg-cocoa text-sky text-sm font-semibold hover:bg-cocoa-hover transition-all shadow-md shadow-cocoa/10"
          >
            협업/채용 문의
          </button>
          <div className="flex items-center gap-2 border-l border-ink/10 pl-6 ml-2">
            <button 
              onClick={onThemeToggle}
              className="p-2 text-ink/40 hover:text-ink transition-colors"
              title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={onAdminClick} className="p-2 text-ink/40 hover:text-ink transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>

        <button className="md:hidden text-ink" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t border-ink/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {menuItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-ink"
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
                className="flex-1 py-3 rounded-xl bg-cocoa text-sky font-semibold shadow-lg shadow-cocoa/10"
              >
                협업/채용 문의
              </button>
              <button 
                onClick={onThemeToggle}
                className="p-3 rounded-xl bg-ink/10 text-ink"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => {
                  onAdminClick();
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-ink/10 text-ink"
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
    <section className="relative min-h-[90vh] flex items-center justify-center pt-12 pb-20 overflow-hidden bg-paper">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cocoa/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-cocoa/30 bg-cocoa/5 text-[10px] font-black text-cocoa mb-8 uppercase tracking-[0.2em]">
            {profile?.hero_label || 'Video Editor & Motion Designer'}
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1] text-ink">
            {profile?.hero_title || '브랜드 톤은 지키고,'}<br />
            <span className="text-cocoa">{profile?.hero_subtitle || '메시지는 더 또렷하게.'}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-12 max-w-xl leading-relaxed whitespace-pre-line font-medium tracking-tight">
            {profile?.hero_description || '기업·교육·인터뷰 중심의 영상 편집/모션 작업을 합니다.\n목적에 맞는 구조, 자막 가독성, 리듬감 있는 편집에 강합니다.'}
          </p>
          <div className="flex flex-wrap gap-5">
            <a href="#featured" className="px-10 py-5 rounded-full bg-cocoa text-sky font-black flex items-center gap-2 hover:bg-cocoa-hover transition-all hover:scale-105 shadow-xl shadow-cocoa/20 text-lg">
              대표작 보기 <ChevronRight size={20} />
            </a>
            <a href="#contact" className="px-10 py-5 rounded-full border-2 border-cocoa text-cocoa font-black hover:bg-cocoa/5 transition-all text-lg">
              협업/채용 문의
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          onClick={() => mainProject && onProjectClick(mainProject)}
          className="relative aspect-video rounded-3xl overflow-hidden border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] group cursor-pointer perspective-1000"
        >
          <img 
            src={mainProject?.thumbnail || "https://picsum.photos/seed/showreel/1280/720"} 
            alt="Showreel Thumbnail" 
            className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-paper/40 flex items-center justify-center group-hover:bg-paper/10 transition-colors">
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
              <Play fill="currentColor" size={40} className="text-ink ml-1" />
            </div>
          </div>
          <div className="absolute bottom-8 left-8 text-ink">
            <p className="text-xs font-black tracking-[0.3em] uppercase opacity-60 mb-2">
              {mainProject ? mainProject.title : "2024 Showreel"}
            </p>
            <p className="text-2xl font-bold">Watch the reel</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturedSection = ({ projects, profile, onProjectClick }: { projects: Project[], profile: Profile | null, onProjectClick: (p: Project) => void }) => {
  return (
    <section id="featured" className="py-40 bg-beige">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8"
        >
          <div>
            <h2 className="text-xs font-black tracking-[0.5em] uppercase text-cocoa mb-6">{profile?.featured_title || 'Featured Projects'}</h2>
            <p className="text-4xl md:text-5xl font-black text-ink tracking-tighter">{profile?.featured_subtitle || '대표작 3선'}</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {projects.length > 0 ? projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="group cursor-pointer"
              onClick={() => onProjectClick(project)}
            >
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-8 border border-border shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <img 
                  src={project.thumbnail || "https://picsum.photos/seed/project/800/450"} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-paper/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-20 h-20 rounded-full glass flex items-center justify-center shadow-2xl">
                    <Play fill="currentColor" size={32} className="text-ink ml-1" />
                  </div>
                </div>
              </div>
              <div className="space-y-5 px-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-black text-ink leading-tight group-hover:text-cocoa transition-colors">{project.title}</h3>
                  <span className="shrink-0 text-[10px] font-black px-3 py-1 rounded-full bg-cocoa/10 text-cocoa border border-cocoa/20 uppercase tracking-widest">{project.type}</span>
                </div>
                <p className="text-muted text-base leading-relaxed font-medium line-clamp-2">{project.description}</p>
                
                {project.work_point && (
                  <div className="flex gap-3 items-start">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cocoa shrink-0" />
                    <p className="text-sm font-bold text-ink leading-relaxed">
                      {project.work_point}
                    </p>
                  </div>
                )}

                {project.notes && (
                  <div className="p-5 rounded-2xl bg-surface border border-border text-sm text-muted/80 leading-relaxed shadow-inner">
                    {project.notes}
                  </div>
                )}
                <div className="pt-5 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-black mb-1">Main Role</p>
                    <p className="text-sm text-ink font-black">{project.role}</p>
                  </div>
                  <ChevronRight size={20} className="text-cocoa opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-32 text-center glass rounded-[40px] border-border">
              <p className="text-muted text-2xl">표시할 대표작이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const WorkGrid = ({ projects, profile, onProjectClick }: { projects: Project[], profile: Profile | null, onProjectClick: (p: Project) => void }) => {
  const [filter, setFilter] = useState('All');
  const [displayCount, setDisplayCount] = useState(6);
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

  const displayedProjects = filteredProjects.slice(0, displayCount);
  const hasMore = filteredProjects.length > displayCount;

  return (
    <section id="work" className="py-40 bg-paper">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12"
        >
          <div>
            <h2 className="text-xs font-black tracking-[0.5em] uppercase text-muted mb-6">{profile?.work_title || 'Work Archive'}</h2>
            <p className="text-4xl md:text-5xl font-black text-ink tracking-tighter">{profile?.work_subtitle || '전체 작업 모음'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat.v}
                onClick={() => {
                  setFilter(cat.v);
                  setDisplayCount(6);
                }}
                className={`px-6 py-3 rounded-full text-xs font-black transition-all tracking-tight ${
                  filter === cat.v 
                    ? 'bg-cocoa text-sky shadow-xl shadow-cocoa/20 scale-105' 
                    : 'bg-surface border border-border text-muted hover:border-cocoa hover:text-cocoa'
                }`}
              >
                {cat.l}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedProjects.length > 0 ? displayedProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onProjectClick(project)}
                className="group relative aspect-video rounded-2xl overflow-hidden border border-border cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img 
                  src={project.thumbnail || "https://picsum.photos/seed/work/800/450"} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end backdrop-blur-[2px]">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[10px] font-black text-cocoa mb-2 uppercase tracking-[0.3em]">{project.type}</p>
                    <h4 className="text-xl font-black mb-3 text-ink leading-tight">{project.title}</h4>
                    <div className="flex items-center gap-2 text-muted">
                      <p className="text-xs font-bold">{project.role}</p>
                      <div className="w-1 h-1 rounded-full bg-cocoa" />
                      <p className="text-[10px] font-black uppercase tracking-widest">{project.category}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-32 text-center glass rounded-[40px] flex items-center justify-center border-border">
                <p className="text-muted text-2xl">해당 카테고리의 영상이 없습니다.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {hasMore && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 text-center"
          >
            <button 
              onClick={() => setDisplayCount(prev => prev + 6)}
              className="group inline-flex items-center gap-4 px-10 py-5 rounded-full bg-ink text-paper font-black text-sm hover:bg-cocoa transition-all shadow-xl shadow-ink/10"
            >
              더 많은 작업물 보기
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
            </button>
          </motion.div>
        )}
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
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-ink/40 mb-8">{profile?.about_strengths_title || 'About & Experience'}</h2>
          <div className="space-y-10">
            <p className="text-2xl md:text-3xl font-bold leading-tight text-ink whitespace-pre-line">
              {profile?.about_subtitle || '영상의 목적과 톤을 먼저 이해하고, \n구조와 리듬으로 전달력을 높이는 편집을 지향합니다.'}
            </p>
            <p className="text-base md:text-lg text-ink/60 leading-relaxed whitespace-pre-line font-medium border-l-4 border-ink/20 pl-6 max-w-2xl">
              {profile?.about_text || '기업/교육/인터뷰 기반 작업을 중심으로, 깔끔하고 안정적인 결과물을 만듭니다. \n단순한 컷 편집을 넘어 시청자가 끝까지 몰입할 수 있는 흐름을 설계합니다.'}
            </p>
          </div>
        </motion.div>

        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            id="experience" 
            className="bg-ink/5 p-10 rounded-3xl border border-ink/10 shadow-2xl"
          >
            <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink/40 mb-8">{profile?.exp_title || 'Experience Snapshot'}</h3>
            {experience ? (
              <div className="space-y-8">
                <div>
                  <p className="text-2xl font-bold mb-2 text-ink">{experience.role}</p>
                  <p className="text-sm text-ink/40 font-bold tracking-wider">{experience.period}</p>
                </div>
                <div className="grid gap-4">
                  {[
                    { l: profile?.exp_label_field || '주 작업 분야', v: experience.field },
                    { l: profile?.exp_label_scope || '협업 범위', v: experience.scope },
                    { l: profile?.exp_label_strengths || '강점', v: experience.strengths }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1 py-4 border-b border-ink/5 last:border-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{item.l}</span>
                      <span className="text-ink font-bold text-base">{item.v}</span>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 pt-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40">{profile?.exp_label_brands || '협력 브랜드'}</span>
                    <p className="text-sm text-ink/60 font-bold leading-relaxed">{experience.brands}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-ink/20">Loading experience data...</p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HowIWork = () => {
  const steps = [
    {
      title: '기획 및 구성',
      desc: '영상 제작의 목적을 파악하고, 메시지의 우선순위에 따라 전체적인 구조와 흐름을 설계합니다.',
      icon: <Layers className="text-cocoa" size={24} />
    },
    {
      title: '연출 및 편집',
      desc: '브랜드 톤앤매너를 유지하며 시청자의 몰입을 극대화하는 시각적 연출과 정교한 편집을 진행합니다.',
      icon: <Zap className="text-cocoa" size={24} />
    },
    {
      title: '검수 및 납품',
      desc: '최종 퀄리티를 위해 프레임 단위로 완성도를 확인하고, 목적에 맞는 최적의 결과물을 도출합니다.',
      icon: <CheckCircle className="text-cocoa" size={24} />
    }
  ];

  return (
    <section id="process" className="py-32 bg-beige">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-xs font-black tracking-[0.5em] uppercase text-cocoa mb-6">How I Work</h2>
          <p className="text-4xl md:text-5xl font-black text-ink tracking-tighter">신뢰를 만드는 작업 프로세스</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-10 rounded-[32px] border-border hover:border-cocoa/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-cocoa/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-2xl font-black text-ink mb-4">{step.title}</h3>
              <p className="text-muted leading-relaxed font-medium">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkflowAndTools = () => {
  return (
    <section className="py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xs font-black tracking-[0.5em] uppercase text-cocoa mb-6">Workflow & Tools</h2>
          <p className="text-4xl md:text-5xl font-black text-ink tracking-tighter mb-8 leading-tight">
            최적의 결과물을 위해<br />도구를 유연하게 활용합니다.
          </p>
          <div className="space-y-6 text-muted font-medium leading-relaxed">
            <p>
              기획의 의도를 가장 정확하게 구현하기 위해 최신 기술과 도구를 적극적으로 활용합니다. 
              단순한 도구의 숙련도를 넘어, 프로젝트의 성격에 맞는 최적의 워크플로우를 설계합니다.
            </p>
            <p>
              특히 AI 기반 도구들을 제작 공정 전반에 도입하여, 반복적인 작업 시간을 단축하고 
              기획의 디테일과 창의적인 연출에 더 많은 에너지를 집중합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-10">
            {['Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator', 'AI Workflow'].map(tool => (
              <span key={tool} className="px-5 py-2.5 rounded-xl bg-cocoa/5 border border-cocoa/10 text-xs font-black text-cocoa">
                {tool}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="glass p-10 rounded-[40px] border-border relative z-10">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-cocoa/10 flex items-center justify-center shrink-0">
                  <Cpu className="text-cocoa" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-ink mb-2">AI Assisted Workflow</h4>
                  <p className="text-sm text-muted leading-relaxed">AI를 활용한 빠른 시안 작업 및 레퍼런스 분석으로 기획의 정확도를 높입니다.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-cocoa/10 flex items-center justify-center shrink-0">
                  <Target className="text-cocoa" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-ink mb-2">Focus on Essence</h4>
                  <p className="text-sm text-muted leading-relaxed">단순 반복 업무를 자동화하고, 영상의 메시지와 리듬감 등 본질적인 퀄리티에 집중합니다.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cocoa/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cocoa/10 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      content: "복잡한 기획안을 드려도 영상의 핵심을 정확히 짚어 구조화해주시는 분입니다. 마감 기한 준수는 물론이고 브랜드 톤을 유지하는 감각이 탁월합니다.",
      author: "브랜드 마케팅 팀장",
      company: "A사"
    },
    {
      content: "자막 가독성과 편집 리듬이 정말 좋습니다. 교육 콘텐츠 특성상 정보 전달이 중요한데, 시청자들이 끝까지 몰입할 수 있는 흐름을 만들어주셨어요.",
      author: "콘텐츠 PD",
      company: "B 교육 플랫폼"
    }
  ];

  return (
    <section className="py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-xs font-black tracking-[0.5em] uppercase text-cocoa mb-6">Testimonials</h2>
          <p className="text-4xl md:text-5xl font-black text-ink tracking-tighter">함께한 파트너들의 신뢰</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-12 rounded-[40px] border-border relative"
            >
              <MessageSquare className="text-cocoa/20 absolute top-10 right-10" size={48} />
              <p className="text-xl font-medium text-ink leading-relaxed mb-10 relative z-10">
                "{review.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cocoa/10 flex items-center justify-center text-cocoa font-black">
                  {review.company[0]}
                </div>
                <div>
                  <p className="font-black text-ink">{review.author}</p>
                  <p className="text-xs text-muted font-bold uppercase tracking-widest">{review.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = ({ profile }: { profile: Profile | null }) => {
  return (
    <section id="contact" className="py-48 bg-beige text-ink relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-cocoa/50 to-transparent" />
      
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xs font-black tracking-[0.6em] uppercase text-cocoa mb-12">{profile?.contact_title || 'Contact'}</h2>
          <h3 className="text-5xl md:text-7xl mb-12 tracking-tighter text-ink leading-none">
            {profile?.contact_subtitle || "Let's collaborate."}
          </h3>
          <p className="text-xl md:text-2xl text-muted mb-20 leading-relaxed font-medium max-w-2xl mx-auto tracking-tight">
            프로젝트 협업, 외주, 채용 제안 모두 편하게 연락 주세요.<br />
            확인 후 가능한 빠르게 답변드립니다.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${profile?.contact_email || 'gns8365@naver.com'}`} 
              className="w-full md:w-auto px-12 py-6 rounded-full bg-cocoa text-sky hover:bg-cocoa-hover transition-all flex items-center justify-center gap-4 font-black text-xl shadow-[0_20px_40px_-10px_rgba(210,161,132,0.4)]"
            >
              <Mail size={24} /> {profile?.contact_email || 'gns8365@naver.com'}
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={profile?.contact_kakao || "https://open.kakao.com/o/sribRuxh"} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-12 py-6 rounded-full border-2 border-cocoa text-cocoa hover:bg-cocoa/5 transition-all flex items-center justify-center gap-4 font-black text-xl"
            >
              카카오 1:1 문의
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Admin Panel ---

const AdminPanel = ({ projects, experience, profile, user, onClose }: { 
  projects: Project[], 
  experience: Experience | null,
  profile: Profile | null,
  user: User | null,
  onClose: () => void 
}) => {
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
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error(err);
      alert(`로그인 오류: ${err.message || '알 수 없는 오류가 발생했습니다.'}\n코드: ${err.code || 'N/A'}`);
    }
  };

  const isAdmin = user?.email === 'gns12047@gmail.com';

  const saveProject = async (p: Partial<Project>) => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      if (p.id) {
        const { id, ...rest } = p;
        await updateDoc(doc(db, 'projects', id), { ...rest });
      } else {
        const newDocRef = doc(collection(db, 'projects'));
        await setDoc(newDocRef, { ...p, createdAt: new Date().toISOString() });
      }
      setEditingProject(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveExperience = async () => {
    if (!isAdmin || !editingExp) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'experience', 'main'), editingExp);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!isAdmin || !editingProfile) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'profile', 'main'), editingProfile);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const cleanupDuplicates = async () => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      const seededIds = Array.from({ length: 12 }, (_, i) => `seed-project-${i + 1}`);
      const duplicates = projects.filter(p => !seededIds.includes(p.id));
      for (const p of duplicates) {
        await deleteDoc(doc(db, 'projects', p.id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      await seedData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    if (!isAdmin) return;
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;
    
    const p1 = newProjects[index];
    const p2 = newProjects[targetIndex];
    
    setIsSaving(true);
    try {
      await Promise.all([
        updateDoc(doc(db, 'projects', p1.id), { order_index: targetIndex }),
        updateDoc(doc(db, 'projects', p2.id), { order_index: index })
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] bg-paper/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl border-ink/10 text-center">
          <h2 className="text-2xl font-bold mb-2 text-ink">관리자 로그인</h2>
          <p className="text-sm text-ink/60 mb-8">
            포트폴리오 관리를 위해 구글 계정으로 로그인하세요.
          </p>
          <button 
            onClick={handleLogin} 
            className="w-full py-4 bg-cocoa text-sky font-bold rounded-xl hover:bg-cocoa-hover transition-all shadow-lg shadow-cocoa/10 flex items-center justify-center gap-3"
          >
            <Settings size={20} /> Google 계정으로 로그인
          </button>
          <button onClick={onClose} className="mt-4 w-full py-3 text-ink/40 hover:text-ink transition-colors text-sm">취소</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[100] bg-paper/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl border-ink/10 text-center">
          <h2 className="text-2xl font-bold mb-2 text-ink">권한 없음</h2>
          <p className="text-sm text-ink/60 mb-8">
            관리자 계정({user.email})이 아닙니다.
          </p>
          <button 
            onClick={() => signOut(auth)} 
            className="w-full py-4 bg-ink text-paper font-bold rounded-xl hover:bg-ink/90 transition-all"
          >
            다른 계정으로 로그인
          </button>
          <button onClick={onClose} className="mt-4 w-full py-3 text-ink/40 hover:text-ink transition-colors text-sm">닫기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-paper overflow-y-auto text-ink">
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">대시보드</h2>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                signOut(auth);
              }} 
              className="p-3 glass rounded-xl text-ink hover:bg-cocoa/10 transition-colors"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
            <button onClick={onClose} className="p-3 glass rounded-xl text-ink hover:bg-cocoa/10 transition-colors" title="닫기"><X size={20} /></button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all text-sm md:text-base ${activeTab === 'projects' ? 'bg-cocoa text-sky shadow-lg shadow-cocoa/20' : 'glass text-ink/60 hover:text-ink'}`}
          >
            프로젝트 관리
          </button>
          <button 
            onClick={() => setActiveTab('experience')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all text-sm md:text-base ${activeTab === 'experience' ? 'bg-cocoa text-sky shadow-lg shadow-cocoa/20' : 'glass text-ink/60 hover:text-ink'}`}
          >
            경력 관리
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all text-sm md:text-base ${activeTab === 'profile' ? 'bg-cocoa text-sky shadow-lg shadow-cocoa/20' : 'glass text-ink/60 hover:text-ink'}`}
          >
            프로필 관리
          </button>
          {isAdmin && (
            <div className="flex gap-2">
              <button 
                onClick={cleanupDuplicates}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all text-sm md:text-base glass text-red-500 hover:bg-red-500/10"
              >
                중복 데이터 정리
              </button>
              <button 
                onClick={handleRestoreDefaults}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold transition-all text-sm md:text-base glass text-emerald-500 hover:bg-emerald-500/10"
              >
                기본 데이터 복구
              </button>
            </div>
          )}
        </div>

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <button 
              onClick={() => setEditingProject({ title: '', type: '', description: '', role: '', link: '', thumbnail: '', is_featured: false, is_main: false, order_index: projects.length, category: 'Corporate' })}
              className="w-full py-4 border-2 border-dashed border-ink/10 rounded-2xl flex items-center justify-center gap-2 text-ink/20 hover:text-ink hover:border-ink/30 transition-all"
            >
              <Plus size={20} /> 새 프로젝트 추가
            </button>

            <div className="grid gap-4">
              {projects.map((p, idx) => (
                <div key={p.id} className={`glass p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-opacity ${p.is_hidden ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      {p.thumbnail && <img src={p.thumbnail} className="w-20 h-12 object-cover rounded-lg" />}
                      {p.is_hidden && (
                        <div className="absolute inset-0 bg-paper/60 flex items-center justify-center rounded-lg">
                          <EyeOff size={16} className="text-ink" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-ink truncate">{p.title}</h4>
                        {p.is_hidden && <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-ink/10 text-ink/60 rounded font-bold">숨김</span>}
                      </div>
                      <p className="text-xs text-ink/40 truncate">
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
                  <div className="flex items-center justify-between md:justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="flex items-center gap-1 mr-2">
                      <button 
                        disabled={idx === 0}
                        onClick={() => moveProject(idx, 'up')}
                        className="p-2 hover:bg-ink/10 rounded disabled:opacity-20 text-ink"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        disabled={idx === projects.length - 1}
                        onClick={() => moveProject(idx, 'down')}
                        className="p-2 hover:bg-ink/10 rounded disabled:opacity-20 text-ink"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <button onClick={() => setEditingProject(p)} className="p-2 hover:bg-ink/10 rounded-lg text-ink"><Edit2 size={18} /></button>
                    <button 
                      onClick={() => saveProject({ ...p, is_hidden: !p.is_hidden })} 
                      className={`p-2 rounded-lg transition-colors ${p.is_hidden ? 'bg-ink/10 text-ink/40' : 'hover:bg-ink/10 text-ink'}`}
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
          <div className="glass p-8 rounded-3xl space-y-8 border-ink/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">경력 정보 설정</h3>
              <button 
                onClick={() => setEditingExp({ ...editingExp, ...DEFAULT_EXPERIENCE })}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-ink/10 text-ink hover:bg-ink/20 transition-colors"
              >
                기본 내용 불러오기
              </button>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-ink/10 pb-2">기본 정보</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">역할/직무</label>
                  <input 
                    value={editingExp.role || ''} 
                    onChange={e => setEditingExp({...editingExp, role: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">기간</label>
                  <input 
                    value={editingExp.period || ''} 
                    onChange={e => setEditingExp({...editingExp, period: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-border pb-2">상세 내용</h3>
              <div className="grid gap-6">
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">주요 분야</label>
                  <input 
                    value={editingExp.field || ''} 
                    onChange={e => setEditingExp({...editingExp, field: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">협업 범위</label>
                  <input 
                    value={editingExp.scope || ''} 
                    onChange={e => setEditingExp({...editingExp, scope: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">강점/특징</label>
                  <input 
                    value={editingExp.strengths || ''} 
                    onChange={e => setEditingExp({...editingExp, strengths: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">협력 브랜드 (쉼표로 구분)</label>
                  <textarea 
                    value={editingExp.brands || ''} 
                    onChange={e => setEditingExp({...editingExp, brands: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium h-20 text-ink"
                    placeholder="예: 삼성전자, 현대자동차, LG유플러스"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={isSaving}
              onClick={saveExperience} 
              className="w-full py-4 bg-cocoa text-sky font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-cocoa-hover transition-all disabled:opacity-50 shadow-lg shadow-cocoa/10"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-sky/30 border-t-sky rounded-full animate-spin" /> : <Save size={20} />}
              경력 정보 저장
            </button>
          </div>
        )}

        {/* Project Edit Modal */}
        {editingProject && (
          <div className="fixed inset-0 z-[110] bg-paper/90 flex items-center justify-center p-6 backdrop-blur-xl">
            <div className="w-full max-w-2xl glass p-8 rounded-3xl max-h-[90vh] overflow-y-auto text-ink">
              <h3 className="text-2xl font-bold mb-8">{editingProject.id ? '프로젝트 수정' : '새 프로젝트 등록'}</h3>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">제목</label>
                    <input value={editingProject.title || ''} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">카테고리</label>
                    <select value={editingProject.category || 'Corporate'} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink">
                      {[
                        {v: 'Corporate', l: '기업 영상'},
                        {v: 'Education', l: '교육/강의'},
                        {v: 'Interview', l: '인터뷰'},
                        {v: 'Sketch/Event', l: '스케치/행사'},
                        {v: 'Shorts', l: '숏폼/SNS'}
                      ].map(c => <option key={c.v} value={c.v} className="bg-paper text-ink">{c.l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">유형 (라벨)</label>
                    <input value={editingProject.type || ''} onChange={e => setEditingProject({...editingProject, type: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink" placeholder="예: 기업 홍보" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">역할 (Main Role)</label>
                    <input value={editingProject.role || ''} onChange={e => setEditingProject({...editingProject, role: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink" placeholder="예: Video Producer" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">제작 범위 (Production Scope)</label>
                    <input value={editingProject.production_scope || ''} onChange={e => setEditingProject({...editingProject, production_scope: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink" placeholder="예: 기획, 연출, 편집" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">영상 링크 (YouTube/Vimeo/Instagram)</label>
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
                              if (!res.ok) throw new Error('Vimeo API error');
                              const contentType = res.headers.get("content-type");
                              if (!contentType || !contentType.includes("application/json")) {
                                throw new Error('Vimeo API returned non-JSON response');
                              }
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
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink" 
                    placeholder="링크를 입력하면 썸네일이 자동으로 추출됩니다."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">썸네일 이미지</label>
                  <div className="grid gap-4">
                    <div className="flex gap-2">
                      <input 
                        value={editingProject.thumbnail || ''} 
                        onChange={e => setEditingProject({...editingProject, thumbnail: e.target.value})} 
                        className="flex-1 bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink" 
                        placeholder="이미지 URL을 입력하거나 파일을 업로드하세요."
                      />
                      {editingProject.thumbnail && (
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-ink/10 shrink-0">
                          <img src={editingProject.thumbnail} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className="relative border-2 border-dashed border-ink/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-ink/30 transition-all cursor-pointer group"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          try {
                            setIsSaving(true);
                            const storageRef = ref(storage, `thumbnails/${Date.now()}-${file.name}`);
                            const snapshot = await uploadBytes(storageRef, file);
                            const downloadURL = await getDownloadURL(snapshot.ref);
                            
                            setEditingProject(prev => ({...prev!, thumbnail: downloadURL}));
                          } catch (err) { 
                            console.error(err);
                          } finally {
                            setIsSaving(false);
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
                              setIsSaving(true);
                              const storageRef = ref(storage, `thumbnails/${Date.now()}-${file.name}`);
                              const snapshot = await uploadBytes(storageRef, file);
                              const downloadURL = await getDownloadURL(snapshot.ref);
                              
                              setEditingProject(prev => ({...prev!, thumbnail: downloadURL}));
                            } catch (err) { 
                              console.error(err);
                            } finally {
                              setIsSaving(false);
                            }
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload size={24} className="text-ink/40 group-hover:text-ink transition-colors" />
                      <p className="text-sm text-ink/60 group-hover:text-ink font-bold">클릭하거나 이미지 업로드</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">설명</label>
                  <textarea value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 h-24 font-medium text-ink" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">작업 포인트 (한 줄 해결 포인트)</label>
                    <textarea value={editingProject.work_point || ''} onChange={e => setEditingProject({...editingProject, work_point: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 h-20 font-medium text-ink" placeholder="예: 자막 구조화와 리듬 조절로 가독성을 80% 개선했습니다." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">사용 도구 (AI 포함)</label>
                    <input value={editingProject.tools || ''} onChange={e => setEditingProject({...editingProject, tools: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink" placeholder="예: Premiere, After Effects, AI Voice" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">문제 및 목표 (Problem/Goal)</label>
                    <textarea value={editingProject.problem_goal || ''} onChange={e => setEditingProject({...editingProject, problem_goal: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 h-24 font-medium text-ink" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">해결 방법 (Solution/Point)</label>
                    <textarea value={editingProject.solution_point || ''} onChange={e => setEditingProject({...editingProject, solution_point: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 h-24 font-medium text-ink" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">작업 노트 (기타 인사이트)</label>
                  <textarea value={editingProject.notes || ''} onChange={e => setEditingProject({...editingProject, notes: e.target.value})} className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 h-20 font-medium text-ink" placeholder="이 영상에서 추가적으로 신경 쓴 부분이나 해결한 문제를 적어주세요." />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={editingProject.is_main || false} onChange={e => setEditingProject({...editingProject, is_main: e.target.checked})} className="w-5 h-5 rounded bg-ink/10 border-ink/20" />
                    <label className="text-sm font-bold text-ink">메인 영상 설정 (Hero 섹션 노출)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={editingProject.is_featured || false} onChange={e => setEditingProject({...editingProject, is_featured: e.target.checked})} className="w-5 h-5 rounded bg-ink/10 border-ink/20" />
                    <label className="text-sm font-bold text-ink">대표작 설정 (상단 3선에 노출)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={editingProject.is_hidden || false} onChange={e => setEditingProject({...editingProject, is_hidden: e.target.checked})} className="w-5 h-5 rounded bg-ink/10 border-ink/20" />
                    <label className="text-sm font-bold text-ink">영상 숨기기 (홈페이지에서 숨김)</label>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    disabled={isSaving}
                    onClick={() => saveProject(editingProject)} 
                    className="flex-1 py-4 bg-cocoa text-sky font-bold rounded-xl hover:bg-cocoa-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cocoa/10"
                  >
                    {isSaving ? <div className="w-5 h-5 border-2 border-sky/30 border-t-sky rounded-full animate-spin" /> : <Save size={20} />}
                    프로젝트 저장
                  </button>
                  <button onClick={() => setEditingProject(null)} className="flex-1 py-4 glass rounded-xl text-ink">취소</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'profile' && editingProfile && (
          <div className="glass p-8 rounded-3xl space-y-8 border-ink/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">전체 사이트 문구 설정</h3>
              <button 
                onClick={() => setEditingProfile({ ...editingProfile, ...DEFAULT_PROFILE })}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-ink/10 text-ink hover:bg-ink/20 transition-colors"
              >
                기본 내용 불러오기
              </button>
            </div>
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-border pb-2">기본 설정</h3>
              <div>
                <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">사이트 이름 / 로고 텍스트</label>
                <input 
                  value={editingProfile.site_name || ''} 
                  onChange={e => setEditingProfile({...editingProfile, site_name: e.target.value})}
                  className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">관리자 비밀번호</label>
                <input 
                  type="password"
                  value={editingProfile.admin_password || ''} 
                  onChange={e => setEditingProfile({...editingProfile, admin_password: e.target.value})}
                  className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  placeholder="관리자 페이지 접속 시 사용할 비밀번호"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-border pb-2">히어로 섹션 (첫 화면)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">상단 라벨 (배지)</label>
                  <input 
                    value={editingProfile.hero_label || ''} 
                    onChange={e => setEditingProfile({...editingProfile, hero_label: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                    placeholder="예: Video Editor & Motion Designer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">메인 타이틀</label>
                  <input 
                    value={editingProfile.hero_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, hero_title: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">서브 타이틀 (강조)</label>
                  <input 
                    value={editingProfile.hero_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, hero_subtitle: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">설명 문구</label>
                <textarea 
                  value={editingProfile.hero_description || ''} 
                  onChange={e => setEditingProfile({...editingProfile, hero_description: e.target.value})}
                  className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium h-24 text-ink"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-border pb-2">소개 섹션 (About)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">소개 섹션 제목</label>
                  <input 
                    value={editingProfile.about_strengths_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, about_strengths_title: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">소개 서브타이틀 (큰 글씨)</label>
                  <textarea 
                    value={editingProfile.about_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, about_subtitle: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium h-20 text-ink"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">소개 상세 설명 (작은 글씨)</label>
                <textarea 
                  value={editingProfile.about_text || ''} 
                  onChange={e => setEditingProfile({...editingProfile, about_text: e.target.value})}
                  className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium h-32 text-ink"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">강점 1 제목</label>
                  <input 
                    value={editingProfile.strength1_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength1_title: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium mb-2 text-ink"
                  />
                  <input 
                    value={editingProfile.strength1_desc || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength1_desc: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-sm text-ink"
                    placeholder="설명"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">강점 2 제목</label>
                  <input 
                    value={editingProfile.strength2_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength2_title: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium mb-2 text-ink"
                  />
                  <input 
                    value={editingProfile.strength2_desc || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength2_desc: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-sm text-ink"
                    placeholder="설명"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">강점 3 제목</label>
                  <input 
                    value={editingProfile.strength3_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength3_title: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium mb-2 text-ink"
                  />
                  <input 
                    value={editingProfile.strength3_desc || ''} 
                    onChange={e => setEditingProfile({...editingProfile, strength3_desc: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-sm text-ink"
                    placeholder="설명"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-border pb-2">프로젝트 섹션 제목 설정</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">대표작 섹션 제목 (영문)</label>
                  <input 
                    value={editingProfile.featured_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, featured_title: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">대표작 섹션 제목 (국문)</label>
                  <input 
                    value={editingProfile.featured_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, featured_subtitle: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">전체작업 섹션 제목 (영문)</label>
                  <input 
                    value={editingProfile.work_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, work_title: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">전체작업 섹션 제목 (국문)</label>
                  <input 
                    value={editingProfile.work_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, work_subtitle: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-border pb-2">연락처 섹션 (Contact)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">연락처 섹션 제목 (영문)</label>
                  <input 
                    value={editingProfile.contact_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_title: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">연락처 메인 문구</label>
                  <input 
                    value={editingProfile.contact_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_subtitle: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">이메일 주소</label>
                  <input 
                    value={editingProfile.contact_email || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_email: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">카카오톡 오픈채팅 링크</label>
                  <input 
                    value={editingProfile.contact_kakao || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_kakao: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-border pb-2">경력 섹션 라벨 설정</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">경력 섹션 제목</label>
                  <input 
                    value={editingProfile.exp_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_title: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">분야 라벨명</label>
                  <input 
                    value={editingProfile.exp_label_field || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_field: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">범위 라벨명</label>
                  <input 
                    value={editingProfile.exp_label_scope || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_scope: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">강점 라벨명</label>
                  <input 
                    value={editingProfile.exp_label_strengths || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_strengths: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink/60 mb-2 uppercase">브랜드 라벨명</label>
                  <input 
                    value={editingProfile.exp_label_brands || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_brands: e.target.value})}
                    className="w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 font-medium text-ink"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={isSaving}
              onClick={saveProfile} 
              className="w-full py-4 bg-cocoa text-sky font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-cocoa-hover transition-all disabled:opacity-50 shadow-lg shadow-cocoa/10"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-sky/30 border-t-sky rounded-full animate-spin" /> : <Save size={20} />}
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });

    const unsubscribeProjects = onSnapshot(
      query(collection(db, 'projects'), orderBy('order_index', 'asc')),
      (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(projectsData);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'projects');
      }
    );

    const unsubscribeExperience = onSnapshot(
      doc(db, 'experience', 'main'), 
      (doc) => {
        if (doc.exists()) {
          setExperience(doc.data() as Experience);
        } else {
          setExperience(DEFAULT_EXPERIENCE as Experience);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'experience/main');
      }
    );

    const unsubscribeProfile = onSnapshot(
      doc(db, 'profile', 'main'), 
      (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as Profile);
        } else {
          setProfile(DEFAULT_PROFILE as Profile);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'profile/main');
      }
    );

    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = (isDark: boolean) => {
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
      }
    };

    // Initial apply
    const initialDark = savedTheme ? savedTheme === 'dark' : mediaQuery.matches;
    applyTheme(initialDark);

    // Listen for system changes
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      unsubscribeAuth();
      unsubscribeProjects();
      unsubscribeExperience();
      unsubscribeProfile();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    if (profile?.site_name) {
      document.title = `${profile.site_name} | 비디오 에디터 포트폴리오`;
    }
  }, [profile]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'dark' : ''} bg-paper text-ink selection:bg-cocoa selection:text-sky`}>
      <ScrollProgress />
      <Navbar 
        profile={profile} 
        onAdminClick={() => setIsAdminOpen(true)} 
        isDarkMode={isDarkMode}
        onThemeToggle={toggleTheme}
      />
      
      <main>
        <Hero 
          mainProject={projects.find(p => p.is_main && !p.is_hidden) || null} 
          profile={profile}
          onProjectClick={(p) => setSelectedProject(p)} 
        />
        <FeaturedSection 
          projects={projects.filter(p => p.is_featured && !p.is_hidden)} 
          profile={profile}
          onProjectClick={(p) => setSelectedProject(p)} 
        />
        <WorkGrid 
          projects={projects.filter(p => !p.is_hidden)} 
          profile={profile}
          onProjectClick={(p) => setSelectedProject(p)} 
        />
        <HowIWork />
        <WorkflowAndTools />
        <AboutSection experience={experience} profile={profile} />
        <Testimonials />
        <ContactSection profile={profile} />
      </main>

      <footer className="py-12 border-t border-border bg-paper">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-2xl font-bold tracking-tighter text-ink">{profile?.site_name || 'TEDIO'}</p>
          <p className="text-sm text-ink/40">© 2024 {profile?.site_name || 'TEDIO'}. All rights reserved.</p>
          <div className="flex gap-6 text-ink/60">
            <a href="#" className="hover:text-ink transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-ink transition-colors"><Youtube size={20} /></a>
            <a href="#" className="hover:text-ink transition-colors"><Github size={20} /></a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            projects={projects} 
            experience={experience} 
            profile={profile}
            user={user}
            onClose={() => setIsAdminOpen(false)} 
          />
        )}
        {selectedProject && (
          <ProjectDetailModal 
            isOpen={!!selectedProject} 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
