import { db, collection, doc, setDoc, getDocs, query, limit, handleFirestoreError, OperationType } from './firebase';
import { Project, Experience, Profile } from './types';

const SEED_PROJECTS: Partial<Project>[] = [
  {
    title: "AIA생명 바이탈리티 - 건강한 습관 A",
    type: "Brand Content",
    description: "사용자의 건강한 습관 형성을 돕는 바이탈리티 프로그램 홍보 영상",
    role: "Video Producer",
    link: "https://youtu.be/hv67efNVXlU",
    thumbnail: "https://img.youtube.com/vi/hv67efNVXlU/maxresdefault.jpg",
    is_featured: true,
    is_main: true,
    category: "Corporate",
    production_scope: "기획, 연출, 편집",
    work_point: "브랜드 컬러와 톤을 유지하며 정보 전달력을 극대화한 모션 그래픽 및 편집",
    tools: "Premiere, After Effects",
    order_index: 1,
    is_hidden: false
  },
  {
    title: "AIA생명 바이탈리티 - 리워드 안내",
    type: "Brand Content",
    description: "바이탈리티 멤버십의 다양한 혜택과 리워드 시스템 소개",
    role: "Video Producer",
    link: "https://youtu.be/QRfrphexPUU",
    thumbnail: "https://img.youtube.com/vi/QRfrphexPUU/maxresdefault.jpg",
    is_featured: true,
    is_main: false,
    category: "Corporate",
    production_scope: "연출, 편집",
    work_point: "복잡한 혜택 구조를 시각적으로 단순화하여 직관적인 이해 도모",
    tools: "Premiere, After Effects",
    order_index: 2,
    is_hidden: false
  },
  {
    title: "AIA생명 바이탈리티 - 챌린지 가이드",
    type: "Brand Content",
    description: "주간 챌린지 참여 방법 및 목표 달성 가이드",
    role: "Video Producer",
    link: "https://youtu.be/BL408Rw1H3A",
    thumbnail: "https://img.youtube.com/vi/BL408Rw1H3A/maxresdefault.jpg",
    is_featured: false,
    is_main: false,
    category: "Corporate",
    production_scope: "편집, 자막 디자인",
    work_point: "빠른 템포의 편집으로 도전 욕구를 자극하는 리듬감 구현",
    tools: "Premiere, After Effects",
    order_index: 3,
    is_hidden: false
  },
  {
    title: "AIA생명 바이탈리티 - 파트너십 소개",
    type: "Brand Content",
    description: "다양한 브랜드와의 파트너십 및 연계 혜택 홍보",
    role: "Video Producer",
    link: "https://youtu.be/WTxwZyFoH2A",
    thumbnail: "https://img.youtube.com/vi/WTxwZyFoH2A/maxresdefault.jpg",
    is_featured: false,
    is_main: false,
    category: "Corporate",
    production_scope: "편집",
    work_point: "깔끔한 레이아웃과 자막 디자인으로 브랜드 신뢰도 강조",
    tools: "Premiere, After Effects",
    order_index: 4,
    is_hidden: false
  },
  {
    title: "AIA생명 바이탈리티 - 사용자 인터뷰",
    type: "Brand Content",
    description: "실제 사용자의 경험담을 통한 프로그램 신뢰도 제고",
    role: "Video Producer",
    link: "https://youtu.be/G62DHDg633M",
    thumbnail: "https://img.youtube.com/vi/G62DHDg633M/maxresdefault.jpg",
    is_featured: false,
    is_main: false,
    category: "Interview",
    production_scope: "인터뷰 연출, 편집",
    work_point: "인물의 진정성이 느껴지는 호흡 조절과 감성적인 톤 보정",
    tools: "Premiere, After Effects",
    order_index: 5,
    is_hidden: false
  },
  {
    title: "한국로봇산업진흥원 기업 홍보",
    type: "Corporate",
    description: "로봇 산업의 미래와 진흥원의 역할을 담은 공식 홍보 영상",
    role: "Director / PD",
    link: "https://youtu.be/SJ6D0q8lX2I",
    thumbnail: "https://img.youtube.com/vi/SJ6D0q8lX2I/maxresdefault.jpg",
    is_featured: true,
    is_main: false,
    category: "Corporate",
    production_scope: "기획, 연출, 편집",
    work_point: "기술적인 전문성과 미래 지향적인 이미지를 결합한 세련된 영상미",
    tools: "Premiere, After Effects",
    order_index: 6,
    is_hidden: false
  },
  {
    title: "휴노 온라인 교육 강의",
    type: "Education",
    description: "전문 지식을 체계적으로 전달하는 온라인 교육 콘텐츠",
    role: "Video Producer",
    link: "https://youtu.be/unKl30tKt2I",
    thumbnail: "https://img.youtube.com/vi/unKl30tKt2I/maxresdefault.jpg",
    is_featured: false,
    is_main: false,
    category: "Education",
    production_scope: "구성, 편집",
    work_point: "학습 몰입도를 높이는 자막 구조화와 시각 자료 배치",
    tools: "Premiere, After Effects",
    order_index: 7,
    is_hidden: false
  },
  {
    title: "대구콘텐츠페어 현장 스케치",
    type: "Event Sketch",
    description: "행사의 열기와 주요 장면을 감각적으로 담아낸 스케치 영상",
    role: "Video Producer",
    link: "https://youtu.be/UKy_SlYDnAE",
    thumbnail: "https://img.youtube.com/vi/UKy_SlYDnAE/maxresdefault.jpg",
    is_featured: false,
    is_main: false,
    category: "Sketch/Event",
    production_scope: "현장 연출, 편집",
    work_point: "행사의 역동성을 살린 빠른 컷 전환과 현장감 있는 사운드 디자인",
    tools: "Premiere, After Effects",
    order_index: 8,
    is_hidden: false
  },
  {
    title: "결혼식 식전 영상 - Our Story",
    type: "Wedding",
    description: "두 사람의 소중한 기록을 담은 감성적인 식전 영상",
    role: "Director",
    link: "https://youtu.be/97DRbrsP8Gc",
    thumbnail: "https://img.youtube.com/vi/97DRbrsP8Gc/maxresdefault.jpg",
    is_featured: false,
    is_main: false,
    category: "Sketch/Event",
    production_scope: "기획, 편집",
    work_point: "따뜻한 색감과 서정적인 편집으로 감동적인 분위기 연출",
    tools: "Premiere",
    order_index: 9,
    is_hidden: false
  },
  {
    title: "멜리아트 아티스트 인터뷰",
    type: "Interview",
    description: "아티스트의 철학과 작업 과정을 담은 릴스 인터뷰",
    role: "Video Producer",
    link: "https://www.instagram.com/reel/ClQIVq4IQUC/",
    thumbnail: "https://images.weserv.nl/?url=https://www.instagram.com/p/ClQIVq4IQUC/media/?size=l",
    is_featured: false,
    is_main: false,
    category: "Interview",
    production_scope: "연출, 편집",
    work_point: "모바일 환경에 최적화된 세로형 레이아웃과 가독성 높은 자막",
    tools: "Premiere, After Effects",
    order_index: 10,
    is_hidden: false
  },
  {
    title: "스컬판다 피규어 리뷰",
    type: "Shorts",
    description: "제품의 디테일과 매력을 짧고 강렬하게 전달하는 리뷰",
    role: "Video Producer",
    link: "https://youtube.com/shorts/bax7JZJk-64",
    thumbnail: "https://img.youtube.com/vi/bax7JZJk-64/maxresdefault.jpg",
    is_featured: false,
    is_main: false,
    category: "Shorts",
    production_scope: "편집",
    work_point: "시선을 사로잡는 빠른 템포와 효과적인 사운드 활용",
    tools: "Premiere",
    order_index: 11,
    is_hidden: false
  },
  {
    title: "귀필러 시술 리뷰",
    type: "Shorts",
    description: "시술 과정과 결과를 직관적으로 보여주는 뷰티 콘텐츠",
    role: "Video Producer",
    link: "https://youtube.com/shorts/yNnhV7FPeMA",
    thumbnail: "https://img.youtube.com/vi/yNnhV7FPeMA/maxresdefault.jpg",
    is_featured: false,
    is_main: false,
    category: "Shorts",
    production_scope: "편집",
    work_point: "비포/애프터의 확실한 대비와 정보 전달 중심의 편집",
    tools: "Premiere",
    order_index: 12,
    is_hidden: false
  }
];

const SEED_EXPERIENCE: Partial<Experience> = {
  role: 'Video Producer / Director',
  period: '2021 - Present',
  field: '기업 홍보, 교육 콘텐츠, 브랜드 필름',
  scope: '기획, 구성, 연출, 편집, 납품 전 과정',
  strengths: '메시지 구조화, 브랜드 톤앤매너 유지, AI 워크플로우 효율화',
  brands: 'AIA생명, 현대글로비스, 닥터지, 삼성셀레나영어 등'
};

const SEED_PROFILE: Partial<Profile> = {
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
  contact_email: 'gns8365@naver.com',
  contact_kakao: 'https://open.kakao.com/o/sribRuxh',
  exp_title: 'Experience',
  exp_label_field: 'Field',
  exp_label_scope: 'Scope',
  exp_label_strengths: 'Strengths',
  exp_label_brands: 'Brands',
  about_title: 'About'
};

export const seedData = async () => {
  try {
    console.log('Checking for seed data...');
    
    // Seed projects with fixed IDs
    for (let i = 0; i < SEED_PROJECTS.length; i++) {
      const p = SEED_PROJECTS[i];
      const projectDocId = `seed-project-${i + 1}`;
      try {
        await setDoc(doc(db, 'projects', projectDocId), { 
          ...p, 
          createdAt: new Date().toISOString() 
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `projects/${projectDocId}`);
      }
    }

    // Seed experience
    try {
      await setDoc(doc(db, 'experience', 'main'), SEED_EXPERIENCE, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'experience/main');
    }

    // Seed profile
    try {
      await setDoc(doc(db, 'profile', 'main'), SEED_PROFILE, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'profile/main');
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed error:', error);
  }
};
