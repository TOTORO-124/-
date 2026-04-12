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
import FloatingContact from './components/FloatingContact';
import SplashScreen from './components/SplashScreen';
import Proposal from './components/Proposal';

// --- Constants ---

const DEFAULT_PROFILE: Profile = {
  site_name: 'TEDIO',
  hero_label: 'Video Producer / PD',
  hero_title: '기획부터 납품까지,',
  hero_subtitle: '브랜드의 본질을 영상으로 구현합니다.',
  hero_description: '단순한 편집을 넘어 메시지의 구조를 설계하고 시청자의 몰입을 연출합니다. 기획의 의도가 최종 결과물까지 선명하게 이어지도록 전 과정을 책임지는 비디오 프로듀서 TEDIO입니다.',
  about_subtitle: '본질에 집중할 때 비로소\n선명해지는 브랜드의 가치.',
  about_text: '좋은 영상은 화려한 효과보다 탄탄한 기획에서 시작된다고 믿습니다. 저는 브랜드가 전달하고자 하는 핵심 메시지를 파악하고, 이를 시각적으로 가장 매력적인 톤앤매너로 구현하는 데 집중합니다. 기획 단계부터 참여하여 최종 마스터링까지, 일관된 톤앤매너로 브랜드의 신뢰도를 높이는 파트너가 되겠습니다.',
  strength1_title: '전략적 스토리텔링',
  strength1_desc: '정보의 우선순위를 파악하여 시청자가 자연스럽게 몰입할 수 있는 영상 구조 설계',
  strength2_title: '감각적인 비주얼 디렉팅',
  strength2_desc: '브랜드 아이덴티티를 관통하는 컬러와 리듬감 있는 편집으로 완성도 높은 영상미 구현',
  strength3_title: '효율적인 AI 워크플로우',
  strength3_desc: '최신 AI 기술을 제작 공정에 도입하여 퀄리티는 높이고 제작 기간은 단축하는 스마트한 작업 방식',
  featured_title: 'Featured Works',
  featured_subtitle: '주요 프로젝트',
  work_title: 'Works',
  work_subtitle: '포트폴리오',
  contact_title: 'Contact',
  contact_subtitle: "Let's collaborate.",
  email: 'gns8365@naver.com',
  contact_kakao: 'https://open.kakao.com/o/sribRuxh',
  og_image: 'https://img.youtube.com/vi/hv67efNVXlU/maxresdefault.jpg'
};

const DEFAULT_EXPERIENCE: Experience = {
  role: 'Video Producer / Director',
  period: '2021 - Present',
  field: '브랜드 필름, 기업 브랜딩 영상, 교육 및 인터뷰 콘텐츠',
  scope: '기획안 작성부터 촬영 연출, 후반 작업 및 최종 마스터링까지',
  strengths: '메시지의 시각적 구조화, 일관된 톤앤매너 유지, AI 기반 제작 효율 극대화',
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
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState({ projects: false, exp: false, profile: false });
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

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
      setProjects(data);
      setDataLoaded(prev => ({ ...prev, projects: true }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects');
      addToast('프로젝트 데이터를 불러오는 중 오류가 발생했습니다.', 'error');
      setDataLoaded(prev => ({ ...prev, projects: true })); // Still mark as loaded to avoid infinite loading
    });

    const unsubscribeExp = onSnapshot(doc(db, 'experience', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setExperience(docSnap.data() as Experience);
      } else {
        setExperience(DEFAULT_EXPERIENCE);
      }
      setDataLoaded(prev => ({ ...prev, exp: true }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'experience/main');
      addToast('경력 데이터를 불러오는 중 오류가 발생했습니다.', 'error');
      setDataLoaded(prev => ({ ...prev, exp: true }));
    });

    const unsubscribeProfile = onSnapshot(doc(db, 'profile', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as Profile);
      } else {
        setProfile(DEFAULT_PROFILE);
      }
      setDataLoaded(prev => ({ ...prev, profile: true }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'profile/main');
      addToast('프로필 데이터를 불러오는 중 오류가 발생했습니다.', 'error');
      setDataLoaded(prev => ({ ...prev, profile: true }));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProjects();
      unsubscribeExp();
      unsubscribeProfile();
    };
  }, []);

  useEffect(() => {
    if (dataLoaded.projects && dataLoaded.exp && dataLoaded.profile) {
      // Minimum loading time for smooth transition (matches intro sequence)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [dataLoaded]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const visibleProjects = projects.filter(p => !p.is_hidden);
  const featuredProjects = visibleProjects.filter(p => p.is_featured).slice(0, 3);
  const mainProject = visibleProjects.find(p => p.is_main) || visibleProjects[0] || null;

  if (currentPath === '/proposal') {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-paper text-ink' : 'bg-paper text-ink'}`}>
        <AnimatePresence mode="wait">
          {isLoading && <SplashScreen key="splash" />}
        </AnimatePresence>
        <CustomCursor />
        <Navbar 
          siteName={profile?.site_name || 'TEDIO'} 
          isDark={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
          onAdminClick={() => setShowAdmin(true)}
        />
        <Proposal />
        <Footer profile={profile || DEFAULT_PROFILE} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-paper text-ink' : 'bg-paper text-ink'}`}>
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen key="splash" />}
      </AnimatePresence>

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
          projects={visibleProjects}
          profile={profile || DEFAULT_PROFILE}
          onProjectClick={setSelectedProject}
        />

        <WorkflowAndTools />

        <About profile={profile || DEFAULT_PROFILE} />

        <ExperienceSection experience={experience} />
      </main>

      <Footer profile={profile || DEFAULT_PROFILE} />

      <FloatingContact kakaoUrl={profile?.contact_kakao || DEFAULT_PROFILE.contact_kakao} />

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
      <div className="fixed bottom-24 right-8 z-[200] flex flex-col gap-4">
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
