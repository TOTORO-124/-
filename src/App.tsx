import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  db, 
  auth, 
  onAuthStateChanged, 
  collection, 
  doc,
  onSnapshot, 
  query, 
  orderBy,
  User,
  OperationType,
  handleFirestoreError
} from './firebase';
import { Project, Experience, Profile } from './types';
import { seedData } from './seedData';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedSection from './components/FeaturedSection';
import WorkGrid from './components/WorkGrid';
import About from './components/About';
import ExperienceSection from './components/Experience';
import { HowIWork, WorkflowAndTools } from './components/Process';
import Footer from './components/Footer';
import ProjectDetailModal from './components/ProjectDetailModal';
import AdminDashboard from './components/AdminDashboard';
import ScrollProgress from './components/ScrollProgress';
import Toast from './components/Toast';
import CustomCursor from './components/CustomCursor';

// --- Constants ---

const DEFAULT_PROFILE: Profile = {
  site_name: 'TEDIO',
  hero_label: 'Video Producer / PD',
  hero_title: '기획부터 납품까지,',
  hero_subtitle: '브랜드의 본질을 영상으로 구현합니다.',
  hero_description: '단순한 편집을 넘어, 메시지의 구조를 설계하고 시청자의 몰입을 연출합니다.\n기획 → 구성 → 연출 → 편집 → 납품 전 과정을 연결하는 비디오 프로듀서 TEDIO입니다.',
  about_subtitle: '브랜드의 메시지를 가장 또렷하게\n전달하는 비디오 프로듀서.',
  about_text: '영상 제작자로서 저는 단순한 컷 편집을 넘어, 브랜드의 가치를 시각적으로 극대화하는 작업을 지향합니다. 기획 단계부터 참여하여 최종 결과물의 톤앤매너를 일관되게 유지합니다.',
  strength1_title: '기획 및 구성',
  strength1_desc: '정보의 우선순위를 파악하여 흐름이 자연스러운 영상 설계',
  strength2_title: '브랜드 톤앤매너',
  strength2_desc: '브랜드 컬러와 아이덴티티를 유지하는 감각적인 편집',
  strength3_title: 'AI 워크플로우',
  strength3_desc: 'AI 툴을 활용한 제작 효율성 극대화 및 퀄리티 향상',
  featured_title: 'Featured Works',
  featured_subtitle: '주요 프로젝트',
  work_title: 'Works',
  work_subtitle: '포트폴리오',
  contact_title: 'Contact',
  contact_subtitle: "Let's collaborate.",
  email: 'gns8365@naver.com'
};

const DEFAULT_EXPERIENCE: Experience = {
  role: 'Video Producer / Director',
  period: '2021 - Present',
  field: '기업 홍보, 교육 콘텐츠, 브랜드 필름',
  scope: '기획, 구성, 연출, 편집, 납품 전 과정',
  strengths: '메시지 구조화, 브랜드 톤앤매너 유지, AI 워크플로우 효율화',
  brands: 'AIA생명, 현대글로비스, 닥터지, 삼성셀레나영어 등'
};

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    const q = query(collection(db, 'projects'), orderBy('order_index', 'asc'));
    const unsubscribeProjects = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(data.filter(p => !p.is_hidden));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects');
      addToast('프로젝트 데이터를 불러오는 중 오류가 발생했습니다.', 'error');
    });

    const unsubscribeExp = onSnapshot(doc(db, 'experience', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setExperience(docSnap.data() as Experience);
      } else {
        setExperience(DEFAULT_EXPERIENCE);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'experience/main');
      addToast('경력 데이터를 불러오는 중 오류가 발생했습니다.', 'error');
    });

    const unsubscribeProfile = onSnapshot(doc(db, 'profile', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as Profile);
      } else {
        setProfile(DEFAULT_PROFILE);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'profile/main');
      addToast('프로필 데이터를 불러오는 중 오류가 발생했습니다.', 'error');
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProjects();
      unsubscribeExp();
      unsubscribeProfile();
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const featuredProjects = projects.filter(p => p.is_featured).slice(0, 3);
  const mainProject = projects.find(p => p.is_main) || projects[0] || null;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-paper text-ink' : 'bg-paper text-ink'}`}>
      <CustomCursor />
      <ScrollProgress />
      
      <Navbar 
        siteName={profile?.site_name || 'TEDIO'} 
        isDark={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        onAdminClick={() => setShowAdmin(true)}
      />

      <main>
        <Hero 
          profile={profile || DEFAULT_PROFILE} 
          mainProject={mainProject}
          onProjectClick={setSelectedProject}
        />

        <FeaturedSection 
          projects={featuredProjects}
          profile={profile || DEFAULT_PROFILE}
          onProjectClick={setSelectedProject}
        />

        <HowIWork />

        <WorkGrid 
          projects={projects}
          profile={profile || DEFAULT_PROFILE}
          onProjectClick={setSelectedProject}
        />

        <WorkflowAndTools />

        <About profile={profile || DEFAULT_PROFILE} />

        <ExperienceSection experience={experience} />
      </main>

      <Footer profile={profile || DEFAULT_PROFILE} />

      {/* Modals & Overlays */}
      <ProjectDetailModal 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {showAdmin && (
        <AdminDashboard 
          projects={projects}
          experience={experience}
          profile={profile}
          user={user}
          onClose={() => setShowAdmin(false)}
          onSaveSuccess={(msg) => addToast(msg, 'success')}
          onSaveError={(msg) => addToast(msg, 'error')}
          seedData={seedData}
          DEFAULT_EXPERIENCE={DEFAULT_EXPERIENCE}
          DEFAULT_PROFILE={DEFAULT_PROFILE}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast 
              key={toast.id} 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
