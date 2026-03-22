import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Save, Plus, Edit2, Trash2, Eye, EyeOff, 
  ChevronUp, ChevronDown, LogOut, Settings, Upload,
  Briefcase, User as UserIcon, Layout
} from 'lucide-react';
import { User, signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, googleProvider, signInWithPopup, handleFirestoreError, OperationType } from '../firebase';
import { Project, Experience, Profile } from '../types';

interface AdminDashboardProps {
  projects: Project[];
  experience: Experience | null;
  profile: Profile | null;
  user: User | null;
  onClose: () => void;
  onSaveSuccess: (message: string) => void;
  onSaveError: (message: string) => void;
  seedData: () => Promise<void>;
  DEFAULT_EXPERIENCE: Experience;
  DEFAULT_PROFILE: Profile;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  projects, experience, profile, user, onClose, 
  onSaveSuccess, onSaveError, seedData,
  DEFAULT_EXPERIENCE, DEFAULT_PROFILE
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
      console.error('Login error:', err);
      onSaveError('로그인에 실패했습니다.');
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
        onSaveSuccess('프로젝트가 수정되었습니다.');
      } else {
        const newDocRef = doc(collection(db, 'projects'));
        await setDoc(newDocRef, { ...p, createdAt: new Date().toISOString() });
        onSaveSuccess('새 프로젝트가 추가되었습니다.');
      }
      setEditingProject(null);
    } catch (error) {
      handleFirestoreError(error, p.id ? OperationType.UPDATE : OperationType.CREATE, p.id ? `projects/${p.id}` : 'projects');
      onSaveError('프로젝트 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setIsSaving(true);
    try {
      await deleteDoc(doc(db, 'projects', id));
      onSaveSuccess('프로젝트가 삭제되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
      onSaveError('프로젝트 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveExperience = async () => {
    if (!isAdmin || !editingExp) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'experience', 'main'), editingExp);
      onSaveSuccess('경력 정보가 저장되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'experience/main');
      onSaveError('경력 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!isAdmin || !editingProfile) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'profile', 'main'), editingProfile);
      onSaveSuccess('프로필 정보가 저장되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'profile/main');
      onSaveError('프로필 정보 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const cleanupDuplicates = async () => {
    if (!isAdmin) return;
    if (!window.confirm('중복된 데이터를 정리하시겠습니까?')) return;
    setIsSaving(true);
    try {
      const seededIds = Array.from({ length: 12 }, (_, i) => `seed-project-${i + 1}`);
      const duplicates = projects.filter(p => !seededIds.includes(p.id));
      for (const p of duplicates) {
        await deleteDoc(doc(db, 'projects', p.id));
      }
      onSaveSuccess('중복 데이터가 정리되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'projects/cleanup');
      onSaveError('데이터 정리 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (!isAdmin) return;
    if (!window.confirm('기본 데이터로 복구하시겠습니까? 기존 데이터가 덮어씌워질 수 있습니다.')) return;
    setIsSaving(true);
    try {
      await seedData();
      onSaveSuccess('기본 데이터가 복구되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects/seed');
      onSaveError('데이터 복구 중 오류가 발생했습니다.');
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
      handleFirestoreError(error, OperationType.UPDATE, 'projects/reorder');
      onSaveError('순서 변경 중 오류가 발생했습니다.');
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
        <AnimatePresence>
          {editingProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-paper/90 flex items-center justify-center p-6 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl glass p-8 rounded-3xl max-h-[90vh] overflow-y-auto text-ink"
              >
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
                              const instaMediaUrl = `https://www.instagram.com/p/${id}/media/?size=l`;
                              const proxiedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(instaMediaUrl)}`;
                              setEditingProject(prev => ({...prev!, link: url, thumbnail: proxiedUrl}));
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
                              onSaveSuccess('이미지가 업로드되었습니다.');
                            } catch (err: any) { 
                              console.error('Upload error:', err);
                              onSaveError(`이미지 업로드 실패: ${err.message}`);
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
                                onSaveSuccess('이미지가 업로드되었습니다.');
                              } catch (err: any) { 
                                console.error('Upload error:', err);
                                onSaveError(`이미지 업로드 실패: ${err.message}`);
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    value={editingProfile.email || ''} 
                    onChange={e => setEditingProfile({...editingProfile, email: e.target.value})}
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

export default AdminDashboard;
