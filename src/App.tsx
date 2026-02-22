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
  Upload
} from 'lucide-react';
import { Project, Experience, Profile } from './types';

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
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
      onClick={onClose}
    >
      <button className="absolute top-8 right-8 text-white/80 hover:text-white transition-colors">
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold tracking-tighter font-serif italic text-black">{profile?.site_name || 'TEDIO'}</a>
        
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a key={item.name} href={item.href} className="text-sm font-medium text-black/80 hover:text-black transition-colors">
              {item.name}
            </a>
          ))}
          <button 
            onClick={() => window.location.href = '#contact'}
            className="px-5 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-black/80 transition-colors"
          >
            협업/채용 문의
          </button>
          <button onClick={onAdminClick} className="p-2 text-black/60 hover:text-black transition-colors">
            <Settings size={18} />
          </button>
        </div>

        <button className="md:hidden text-black" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
            <button 
              onClick={() => {
                window.location.href = '#contact';
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold"
            >
              협업/채용 문의
            </button>
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 py-1 rounded-full border border-black/20 text-xs font-bold text-black/80 mb-6">
            Video Editor & Motion Designer
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-black">
            {profile?.hero_title || '브랜드 톤은 지키고,'}<br />
            <span className="text-black/60">{profile?.hero_subtitle || '메시지는 더 또렷하게.'}</span>
          </h1>
          <p className="text-lg md:text-xl text-black/90 mb-10 max-w-xl leading-relaxed whitespace-pre-line">
            {profile?.hero_description || '기업·교육·인터뷰 중심의 영상 편집/모션 작업을 합니다.\n목적에 맞는 구조, 자막 가독성, 리듬감 있는 편집에 강합니다.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#featured" className="px-8 py-4 rounded-full bg-black text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform">
              대표작 보기 <ChevronRight size={18} />
            </a>
            <a href="#contact" className="px-8 py-4 rounded-full border border-black/20 text-black font-bold hover:bg-black/5 transition-colors">
              협업/채용 문의
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          onClick={() => mainProject && onProjectClick(mainProject)}
          className="relative aspect-video rounded-2xl overflow-hidden border border-black/5 shadow-2xl group cursor-pointer"
        >
          <img 
            src={mainProject?.thumbnail || "https://picsum.photos/seed/showreel/1280/720"} 
            alt="Showreel Thumbnail" 
            className="w-full h-full object-cover grayscale blur-[2px] group-hover:grayscale-0 group-hover:blur-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play fill="white" size={32} className="text-white" />
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
    <section id="featured" className="py-32 bg-black/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black/70 mb-4">{profile?.featured_title || 'Featured Projects'}</h2>
            <p className="text-4xl font-serif italic text-black">{profile?.featured_subtitle || '대표작 3선'}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
              onClick={() => onProjectClick(project)}
            >
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-black/5">
                <img 
                  src={project.thumbnail || "https://picsum.photos/seed/project/800/450"} 
                  alt={project.title} 
                  className="w-full h-full object-cover blur-[2px] group-hover:blur-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
                    <Play fill="black" size={24} />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-black">{project.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-black/10 text-black/80">{project.type}</span>
                </div>
                <p className="text-black/80 text-sm leading-relaxed">{project.description}</p>
                {project.notes && (
                  <div className="p-3 rounded-xl bg-black/5 border border-black/5 italic text-[13px] text-black/80">
                    " {project.notes} "
                  </div>
                )}
                <div className="pt-2 border-t border-black/10">
                  <p className="text-[10px] uppercase tracking-wider text-black/70 font-bold mb-1">My Role</p>
                  <p className="text-xs text-black font-medium">{project.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkGrid = ({ projects, profile, onProjectClick }: { projects: Project[], profile: Profile | null, onProjectClick: (p: Project) => void }) => {
  const [filter, setFilter] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);
  const categories = ['All', 'Corporate', 'Education', 'Interview', 'Sketch/Event', 'Shorts'];

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
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black/80 mb-4">{profile?.work_title || 'Work Archive'}</h2>
            <p className="text-4xl font-serif italic text-black">{profile?.work_subtitle || '전체 작업 모음'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  filter === cat ? 'bg-black text-white' : 'border border-black/30 text-black hover:border-black/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group/scroll">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-black/10"
          >
            <ChevronLeft size={24} className="text-black" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-black/10"
          >
            <ChevronRight size={24} className="text-black" />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => onProjectClick(project)}
                  className="group relative aspect-video h-[200px] md:h-[240px] shrink-0 rounded-xl overflow-hidden border border-black/10 cursor-pointer snap-start"
                >
                  <img 
                    src={project.thumbnail || "https://picsum.photos/seed/work/800/450"} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale blur-[2px] group-hover:grayscale-0 group-hover:blur-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end backdrop-blur-sm">
                    <p className="text-xs font-bold text-black/80 mb-1">{project.type}</p>
                    <h4 className="text-sm font-bold mb-2 text-black">{project.title}</h4>
                    <p className="text-[10px] text-black/90 line-clamp-1">{project.role}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Scroll Indicators */}
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-black/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-black/40 rounded-full"
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
    <section id="about" className="py-32 bg-black/5">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black/70 mb-8">{profile?.about_strengths_title || 'About & Strengths'}</h2>
          <div className="space-y-8">
            <p className="text-2xl font-light leading-relaxed text-black/90 whitespace-pre-line">
              {profile?.about_subtitle || '영상의 목적과 톤을 먼저 이해하고, \n구조와 리듬으로 전달력을 높이는 편집을 지향합니다.'}
            </p>
            <p className="text-black/80 leading-relaxed whitespace-pre-line">
              {profile?.about_text || '기업/교육/인터뷰 기반 작업을 중심으로, 깔끔하고 안정적인 결과물을 만듭니다. \n단순한 컷 편집을 넘어 시청자가 끝까지 몰입할 수 있는 흐름을 설계합니다.'}
            </p>
            
            <div className="grid grid-cols-1 gap-6 pt-8">
              {[
                { title: '구조 설계', desc: '흐름이 자연스럽고 이해가 쉬운 편집' },
                { title: '자막 가독성', desc: '화면을 해치지 않는 자막 배치와 리듬' },
                { title: '마감 퀄리티', desc: '사운드 정리, 템포, 전체 톤 통일' }
              ].map((strength, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1 h-full bg-black/30 rounded-full" />
                  <div>
                    <h4 className="font-bold mb-1 text-black">{strength.title}</h4>
                    <p className="text-sm text-black/70">{strength.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div id="experience" className="glass p-8 rounded-3xl border-black/10">
            <h3 className="text-xs font-bold tracking-widest uppercase text-black/60 mb-6">{profile?.exp_title || 'Experience Snapshot'}</h3>
            {experience ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xl font-bold mb-1 text-black">{experience.role}</p>
                  <p className="text-sm text-black/80">{experience.period}</p>
                </div>
                <div className="grid gap-4">
                  <div className="flex justify-between text-sm py-3 border-b border-black/10">
                    <span className="text-black/80">{profile?.exp_label_field || '주 작업 분야'}</span>
                    <span className="text-black font-medium">{experience.field}</span>
                  </div>
                  <div className="flex justify-between text-sm py-3 border-b border-black/10">
                    <span className="text-black/80">{profile?.exp_label_scope || '협업 범위'}</span>
                    <span className="text-black font-medium">{experience.scope}</span>
                  </div>
                  <div className="flex justify-between text-sm py-3 border-b border-black/10">
                    <span className="text-black/80">{profile?.exp_label_strengths || '강점'}</span>
                    <span className="text-black font-medium">{experience.strengths}</span>
                  </div>
                  <div className="flex flex-col gap-2 py-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-black/60">{profile?.exp_label_brands || '협력 브랜드'}</span>
                    <p className="text-sm text-black font-medium leading-relaxed">{experience.brands}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-black/60 italic">Loading experience data...</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {['Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator'].map(tool => (
              <span key={tool} className="px-4 py-2 rounded-lg bg-black/5 border border-black/20 text-xs font-medium text-black/80">
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
    <section id="contact" className="py-32 bg-white/30 text-black">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black/80 mb-8">{profile?.contact_title || 'Contact'}</h2>
        <h3 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-tighter">{profile?.contact_subtitle || "Let's collaborate."}</h3>
        <p className="text-lg text-black/90 mb-12 leading-relaxed">
          프로젝트 협업, 외주, 채용 제안 모두 편하게 연락 주세요.<br />
          확인 후 가능한 빠르게 답변드립니다.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <a 
            href={`mailto:${profile?.contact_email || 'gns8365@naver.com'}`} 
            className="w-full md:w-auto px-10 py-5 rounded-2xl bg-black text-white hover:bg-black/80 transition-all flex items-center justify-center gap-3 font-bold shadow-xl shadow-black/10"
          >
            <Mail size={20} /> {profile?.contact_email || 'gns8365@naver.com'}
          </a>
          <a 
            href={profile?.contact_kakao || "https://open.kakao.com/o/sribRuxh"} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-10 py-5 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 transition-all flex items-center justify-center gap-3 font-bold shadow-xl shadow-yellow-400/20"
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
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || '로그인에 실패했습니다.');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        setToken(data.token);
      } else {
        alert('비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  const saveProject = async (p: Partial<Project>) => {
    try {
      const method = p.id ? 'PUT' : 'POST';
      const url = p.id ? `/api/projects/${p.id}` : '/api/projects';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, token })
      });
      
      if (res.ok) {
        alert('프로젝트가 성공적으로 저장되었습니다.');
        setEditingProject(null);
        onUpdate();
      } else {
        const errData = await res.text();
        alert(`저장 실패: ${errData}`);
      }
    } catch (error) {
      console.error(error);
      alert('서버 통신 중 오류가 발생했습니다.');
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (res.ok) {
        alert('삭제되었습니다.');
        onUpdate();
      } else {
        alert('삭제 실패');
      }
    } catch (error) {
      alert('오류 발생');
    }
  };

  const saveExperience = async () => {
    await fetch('/api/experience', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editingExp, token })
    });
    alert('경력이 업데이트되었습니다.');
    onUpdate();
  };

  const saveProfile = async () => {
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editingProfile, token })
    });
    alert('프로필 정보가 업데이트되었습니다.');
    onUpdate();
  };

  const moveProject = async (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;
    
    // Swap
    [newProjects[index], newProjects[targetIndex]] = [newProjects[targetIndex], newProjects[index]];
    
    // Prepare orders for API
    const orders = newProjects.map((p, i) => ({ id: p.id, order_index: i }));
    
    try {
      const res = await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders, token })
      });
      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#F5F2ED]/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-black">관리자 로그인</h2>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호"
            className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-black/40 text-black font-medium"
          />
          <div className="flex gap-4">
            <button onClick={handleLogin} className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-black/80 transition-colors">로그인</button>
            <button onClick={onClose} className="flex-1 py-3 border border-black/20 rounded-xl text-black font-bold hover:bg-black/5 transition-colors">취소</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#F5F2ED] overflow-y-auto text-black">
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">대시보드</h2>
          <div className="flex gap-4">
            <button onClick={() => setIsLoggedIn(false)} className="p-3 glass rounded-xl text-black"><LogOut size={20} /></button>
            <button onClick={onClose} className="p-3 glass rounded-xl text-black"><X size={20} /></button>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'projects' ? 'bg-black text-white shadow-lg shadow-black/20' : 'glass text-black/60 hover:text-black'}`}
          >
            프로젝트 관리
          </button>
          <button 
            onClick={() => setActiveTab('experience')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'experience' ? 'bg-black text-white shadow-lg shadow-black/20' : 'glass text-black/60 hover:text-black'}`}
          >
            경력 관리
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-black text-white shadow-lg shadow-black/20' : 'glass text-black/60 hover:text-black'}`}
          >
            프로필 관리
          </button>
        </div>

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <button 
              onClick={() => setEditingProject({ title: '', type: '', description: '', role: '', link: '', thumbnail: '', is_featured: false, is_main: false, order_index: projects.length, category: 'Corporate' })}
              className="w-full py-4 border-2 border-dashed border-black/10 rounded-2xl flex items-center justify-center gap-2 text-black/20 hover:text-black hover:border-black/30 transition-all"
            >
              <Plus size={20} /> 새 프로젝트 추가
            </button>

            <div className="grid gap-4">
              {projects.map((p, idx) => (
                <div key={p.id} className="glass p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {p.thumbnail && <img src={p.thumbnail} className="w-20 h-12 object-cover rounded-lg" />}
                    <div>
                      <h4 className="font-bold text-black">{p.title}</h4>
                      <p className="text-xs text-black/40">
                        {p.category} | {p.is_main ? '메인' : p.is_featured ? '대표작' : '일반'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 mr-4">
                      <button 
                        disabled={idx === 0}
                        onClick={() => moveProject(idx, 'up')}
                        className="p-1 hover:bg-black/5 rounded disabled:opacity-20 text-black"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        disabled={idx === projects.length - 1}
                        onClick={() => moveProject(idx, 'down')}
                        className="p-1 hover:bg-black/5 rounded disabled:opacity-20 text-black"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <button onClick={() => setEditingProject(p)} className="p-2 hover:bg-black/5 rounded-lg text-black"><Edit2 size={18} /></button>
                    <button onClick={() => deleteProject(p.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && editingExp && (
          <div className="glass p-8 rounded-3xl space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-black/80 mb-2 uppercase">역할/직무</label>
                <input 
                  value={editingExp.role || ''} 
                  onChange={e => setEditingExp({...editingExp, role: e.target.value})}
                  className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black/80 mb-2 uppercase">기간</label>
                <input 
                  value={editingExp.period || ''} 
                  onChange={e => setEditingExp({...editingExp, period: e.target.value})}
                  className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-black/80 mb-2 uppercase">주요 분야</label>
              <input 
                value={editingExp.field || ''} 
                onChange={e => setEditingExp({...editingExp, field: e.target.value})}
                className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black/80 mb-2 uppercase">협업 범위</label>
              <input 
                value={editingExp.scope || ''} 
                onChange={e => setEditingExp({...editingExp, scope: e.target.value})}
                className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black/80 mb-2 uppercase">강점/특징</label>
              <input 
                value={editingExp.strengths || ''} 
                onChange={e => setEditingExp({...editingExp, strengths: e.target.value})}
                className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black/80 mb-2 uppercase">협력 브랜드 (쉼표로 구분)</label>
              <textarea 
                value={editingExp.brands || ''} 
                onChange={e => setEditingExp({...editingExp, brands: e.target.value})}
                className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium h-20"
                placeholder="예: 삼성전자, 현대자동차, LG유플러스"
              />
            </div>
            <button onClick={saveExperience} className="w-full py-4 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black/80 transition-colors">
              <Save size={20} /> 경력 정보 저장
            </button>
          </div>
        )}

        {/* Project Edit Modal */}
        {editingProject && (
          <div className="fixed inset-0 z-[110] bg-[#F5F2ED]/95 flex items-center justify-center p-6 backdrop-blur-xl">
            <div className="w-full max-w-2xl glass p-8 rounded-3xl max-h-[90vh] overflow-y-auto text-black">
              <h3 className="text-2xl font-bold mb-8">{editingProject.id ? '프로젝트 수정' : '새 프로젝트 등록'}</h3>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-black/80 mb-2 uppercase">제목</label>
                    <input value={editingProject.title || ''} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black/80 mb-2 uppercase">카테고리</label>
                    <select value={editingProject.category || 'Corporate'} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium">
                      {['Corporate', 'Education', 'Interview', 'Sketch/Event', 'Shorts'].map(c => <option key={c} value={c} className="bg-white">{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-black/80 mb-2 uppercase">유형 (라벨)</label>
                    <input value={editingProject.type || ''} onChange={e => setEditingProject({...editingProject, type: e.target.value})} className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium" placeholder="예: 기업 홍보" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black/80 mb-2 uppercase">역할</label>
                    <input value={editingProject.role || ''} onChange={e => setEditingProject({...editingProject, role: e.target.value})} className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium" placeholder="예: 편집 100%" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">영상 링크 (YouTube/Vimeo/Instagram)</label>
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
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium" 
                    placeholder="링크를 입력하면 썸네일이 자동으로 추출됩니다."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">썸네일 이미지</label>
                  <div className="grid gap-4">
                    <div className="flex gap-2">
                      <input 
                        value={editingProject.thumbnail || ''} 
                        onChange={e => setEditingProject({...editingProject, thumbnail: e.target.value})} 
                        className="flex-1 bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium" 
                        placeholder="이미지 URL을 입력하거나 파일을 업로드하세요."
                      />
                      {editingProject.thumbnail && (
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-black/20 shrink-0">
                          <img src={editingProject.thumbnail} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className="relative border-2 border-dashed border-black/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-black/40 transition-all cursor-pointer group"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData
                            });
                            const data = await res.json();
                            if (data.url) {
                              setEditingProject(prev => ({...prev!, thumbnail: data.url}));
                            }
                          } catch (err) { console.error(err); }
                        }
                      }}
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            try {
                              const res = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData
                              });
                              const data = await res.json();
                              if (data.url) {
                                setEditingProject(prev => ({...prev!, thumbnail: data.url}));
                              }
                            } catch (err) { console.error(err); }
                          }
                        };
                        input.click();
                      }}
                    >
                      <Upload size={24} className="text-black/40 group-hover:text-black transition-colors" />
                      <p className="text-sm text-black/60 group-hover:text-black font-bold">클릭하거나 이미지 업로드</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">설명</label>
                  <textarea value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 h-24 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">작업 노트 (인사이트)</label>
                  <textarea value={editingProject.notes || ''} onChange={e => setEditingProject({...editingProject, notes: e.target.value})} className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 h-20 font-medium" placeholder="이 영상에서 가장 신경 쓴 부분이나 해결한 문제를 적어주세요." />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={editingProject.is_main || false} onChange={e => setEditingProject({...editingProject, is_main: e.target.checked})} className="w-5 h-5 rounded bg-black/5 border-black/10" />
                    <label className="text-sm font-bold">메인 영상 설정 (Hero 섹션 노출)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={editingProject.is_featured || false} onChange={e => setEditingProject({...editingProject, is_featured: e.target.checked})} className="w-5 h-5 rounded bg-black/5 border-black/10" />
                    <label className="text-sm font-bold">대표작 설정 (상단 3선에 노출)</label>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => saveProject(editingProject)} className="flex-1 py-4 bg-black text-white font-bold rounded-xl">프로젝트 저장</button>
                  <button onClick={() => setEditingProject(null)} className="flex-1 py-4 glass rounded-xl">취소</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'profile' && editingProfile && (
          <div className="glass p-8 rounded-3xl space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-black/10 pb-2">General Settings</h3>
              <div>
                <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Site Name / Logo Text</label>
                <input 
                  value={editingProfile.site_name || ''} 
                  onChange={e => setEditingProfile({...editingProfile, site_name: e.target.value})}
                  className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-black/10 pb-2">Hero Section</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Hero Title</label>
                  <input 
                    value={editingProfile.hero_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, hero_title: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Hero Subtitle</label>
                  <input 
                    value={editingProfile.hero_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, hero_subtitle: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Hero Description</label>
                <textarea 
                  value={editingProfile.hero_description || ''} 
                  onChange={e => setEditingProfile({...editingProfile, hero_description: e.target.value})}
                  className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium h-24"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-black/10 pb-2">About Section</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">About Strengths Title</label>
                  <input 
                    value={editingProfile.about_strengths_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, about_strengths_title: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">About Subtitle (Large Text)</label>
                  <textarea 
                    value={editingProfile.about_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, about_subtitle: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium h-20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-black/80 mb-2 uppercase">About Description (Small Text)</label>
                <textarea 
                  value={editingProfile.about_text || ''} 
                  onChange={e => setEditingProfile({...editingProfile, about_text: e.target.value})}
                  className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium h-32"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-black/10 pb-2">Featured & Work Titles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Featured Title (EN)</label>
                  <input 
                    value={editingProfile.featured_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, featured_title: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Featured Subtitle (KR)</label>
                  <input 
                    value={editingProfile.featured_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, featured_subtitle: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Work Title (EN)</label>
                  <input 
                    value={editingProfile.work_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, work_title: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Work Subtitle (KR)</label>
                  <input 
                    value={editingProfile.work_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, work_subtitle: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-black/10 pb-2">Contact Section</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Contact Title (EN)</label>
                  <input 
                    value={editingProfile.contact_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_title: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Contact Subtitle (KR/EN)</label>
                  <input 
                    value={editingProfile.contact_subtitle || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_subtitle: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Email</label>
                  <input 
                    value={editingProfile.contact_email || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_email: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Kakao Link</label>
                  <input 
                    value={editingProfile.contact_kakao || ''} 
                    onChange={e => setEditingProfile({...editingProfile, contact_kakao: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-black/10 pb-2">Experience Section Labels</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Experience Title</label>
                  <input 
                    value={editingProfile.exp_title || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_title: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Field Label</label>
                  <input 
                    value={editingProfile.exp_label_field || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_field: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Scope Label</label>
                  <input 
                    value={editingProfile.exp_label_scope || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_scope: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Strengths Label</label>
                  <input 
                    value={editingProfile.exp_label_strengths || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_strengths: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black/80 mb-2 uppercase">Brands Label</label>
                  <input 
                    value={editingProfile.exp_label_brands || ''} 
                    onChange={e => setEditingProfile({...editingProfile, exp_label_brands: e.target.value})}
                    className="w-full bg-black/5 border border-black/20 rounded-xl px-4 py-3 font-medium"
                  />
                </div>
              </div>
            </div>

            <button onClick={saveProfile} className="w-full py-4 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-black/80 transition-colors">
              <Save size={20} /> 프로필 정보 저장
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
    const [pRes, eRes, prRes] = await Promise.all([
      fetch('/api/projects'),
      fetch('/api/experience'),
      fetch('/api/profile')
    ]);
    setProjects(await pRes.json());
    setExperience(await eRes.json());
    setProfile(await prRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="selection:bg-black selection:text-white">
      <Navbar profile={profile} onAdminClick={() => setIsAdminOpen(true)} />
      
      <main>
        <Hero 
          mainProject={projects.find(p => p.is_main) || null} 
          profile={profile}
          onProjectClick={(p) => setSelectedVideoUrl(p.link)} 
        />
        <FeaturedSection 
          projects={projects.filter(p => p.is_featured)} 
          profile={profile}
          onProjectClick={(p) => setSelectedVideoUrl(p.link)} 
        />
        <WorkGrid 
          projects={projects} 
          profile={profile}
          onProjectClick={(p) => setSelectedVideoUrl(p.link)} 
        />
        <AboutSection experience={experience} profile={profile} />
        <ContactSection profile={profile} />
      </main>

      <footer className="py-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-2xl font-bold tracking-tighter font-serif italic text-black">{profile?.site_name || 'TEDIO'}</p>
          <p className="text-sm text-black/60">© 2024 {profile?.site_name || 'TEDIO'}. All rights reserved.</p>
          <div className="flex gap-6 text-black/80">
            <a href="#" className="hover:text-black transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-black transition-colors"><Youtube size={20} /></a>
            <a href="#" className="hover:text-black transition-colors"><Github size={20} /></a>
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
