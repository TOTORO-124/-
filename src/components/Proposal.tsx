import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, FileText, CheckCircle2, AlertCircle, Clock, MessageSquare, CreditCard } from 'lucide-react';

const Proposal: React.FC = () => {
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Disable common shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 's' || e.key === 'u' || e.key === 'p')
      ) {
        e.preventDefault();
      }
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-transparent select-none relative overflow-hidden">
      {/* Watermark Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] flex flex-wrap gap-20 p-10 rotate-[-25deg] scale-150">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="text-4xl font-black whitespace-nowrap">TEDIO PROPOSAL</span>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-20"
        >
          <div className="flex items-center gap-3 text-cocoa">
            <Shield size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Confidential Proposal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            Tedio — 영상 제작 서비스<br />
            <span className="text-cocoa">제안서 2026</span>
          </h1>
          <blockquote className="border-l-4 border-cocoa/30 pl-6 py-2 italic text-xl text-ink/60 font-medium break-keep">
            "Tedio(테디오)는 고성능 인프라와 생성형 AI 기술을 체계적으로 결합하여, 단순히 편집을 넘어 브랜드의 메시지를 정확하고 감각적으로 시각화하는 프리미엄 영상 제작 스튜디오입니다."
          </blockquote>
          <div className="flex items-center gap-2 text-sm font-bold text-ink/40">
            <FileText size={16} />
            <span>tedio.vercel.app</span>
          </div>
        </motion.div>

        {/* Section 01 */}
        <section className="mb-20 space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-cocoa/20">01</span>
            <h2 className="text-2xl font-black tracking-tighter">제작 워크플로우 및 핵심 경쟁력</h2>
          </div>
          <p className="text-ink/60 font-medium">불필요한 공정은 줄이고, 정확도와 속도를 극대화한 최적화 시스템으로 운영됩니다.</p>
          
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ink/5">
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-ink/40 w-1/3">단계</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-ink/40">내용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {[
                  { step: "상담 및 기획", content: "프로젝트 목적 · 핵심 타겟 · 톤앤매너 확정" },
                  { step: "소스 분석 및 본 편집", content: "컷 편집 · BGM/SFX 삽입 · 가독성 최적화 자막 스크립트 적용" },
                  { step: "그래픽 및 효과", content: "(옵션) 인트로/아웃트로 · 맞춤형 트랜지션 제작" },
                  { step: "AI 에셋 활용", content: "(옵션) AI 영상·이미지 소스 생성 / TTS 보이스 더빙" },
                  { step: "피드백 및 납품", content: "고성능 인프라 기반 고속 렌더링 · 실시간 수정 반영" },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-ink/[0.02] transition-colors">
                    <td className="p-4 font-black text-ink">{item.step}</td>
                    <td className="p-4 text-ink/70 font-medium text-sm">{item.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 rounded-2xl bg-cocoa/5 border border-cocoa/10 space-y-3">
            <div className="flex items-center gap-2 text-cocoa">
              <CheckCircle2 size={18} />
              <span className="font-black text-sm uppercase tracking-widest">Key Strength</span>
            </div>
            <p className="text-ink/80 font-medium leading-relaxed break-keep">
              클라이언트의 정규 업무 종료 후에도 작업이 중단되지 않는 <strong className="text-ink">야간·주말 집중 작업 체제</strong>를 운영합니다. 이를 통해 타이트한 일정에서도 신속하고 완성도 높은 결과물을 보장합니다.
            </p>
          </div>
        </section>

        {/* Section 02 */}
        <section className="mb-20 space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-cocoa/20">02</span>
            <h2 className="text-2xl font-black tracking-tighter">기본 제작 서비스 단가</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest w-fit">
            <AlertCircle size={12} />
            <span>실제 견적은 작업 난이도에 따라 조정될 수 있습니다</span>
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ink/5">
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-ink/40">유형</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-ink/40">기준 단가</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-ink/40">기준 분량</th>
                  <th className="p-4 text-xs font-black uppercase tracking-widest text-ink/40">포함 사항</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {[
                  { type: "숏폼", price: "50,000원 ~", duration: "1분 내외", includes: "기본 컷 · 자막 · BGM" },
                  { type: "롱폼 브이로그", price: "150,000원 ~", duration: "10분 내외", includes: "정보 전달 및 일상 구성" },
                  { type: "스케치 / 인터뷰", price: "150,000원 ~", duration: "3~5분 내외", includes: "현장감 중심 구성" },
                  { type: "광고 / 홍보 영상", price: "300,000원 ~", duration: "협의", includes: "SNS 광고 · 기업 홍보" },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-ink/[0.02] transition-colors">
                    <td className="p-4 font-black text-ink">{item.type}</td>
                    <td className="p-4 font-black text-cocoa">{item.price}</td>
                    <td className="p-4 text-ink/60 text-sm font-medium">{item.duration}</td>
                    <td className="p-4 text-ink/60 text-sm font-medium">{item.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 03 */}
        <section className="mb-20 space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-cocoa/20">03</span>
            <h2 className="text-2xl font-black tracking-tighter">추가 옵션 (Add-ons)</h2>
          </div>

          <div className="space-y-8">
            <h3 className="text-lg font-black text-ink/40 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cocoa" /> 영상 연출 강화
            </h3>
            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface/50">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-ink/5">
                  {[
                    { name: "인트로 & 아웃트로 제작", price: "+30,000원 ~", desc: "브랜드 로고 애니메이션 · 맞춤형 오프닝/클로징" },
                    { name: "맞춤형 트랜지션 & 특수 효과", price: "+20,000원 ~", desc: "영상 흐름을 매끄럽게 하는 고급 전환 효과" },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-ink/[0.02] transition-colors">
                      <td className="p-4 font-black text-ink w-1/3">{item.name}</td>
                      <td className="p-4 font-black text-cocoa w-1/4">{item.price}</td>
                      <td className="p-4 text-ink/60 text-sm font-medium">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-lg font-black text-ink/40 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cocoa" /> AI 특화 옵션
            </h3>
            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface/50">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-ink/5">
                  {[
                    { name: "AI 이미지 / 영상 소스 생성", price: "+50,000원 ~", desc: "ComfyUI 기반 브랜드 전용 독점 에셋 생성" },
                    { name: "TTS (AI 보이스) 더빙", price: "+10,000원 ~", desc: "전문 성우급 AI 음성 삽입 + 자막 싱크 작업" },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-ink/[0.02] transition-colors">
                      <td className="p-4 font-black text-ink w-1/3">{item.name}</td>
                      <td className="p-4 font-black text-cocoa w-1/4">{item.price}</td>
                      <td className="p-4 text-ink/60 text-sm font-medium">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-lg font-black text-ink/40 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cocoa" /> 긴급 납품 (Express)
            </h3>
            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface/50">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-ink/5">
                  <tr>
                    <td className="p-4 font-black text-ink w-1/3">Express 납품</td>
                    <td className="p-4 font-black text-cocoa w-1/4">총 견적의 +50%</td>
                    <td className="p-4 text-ink/60 text-sm font-medium">지정 작업 시간 외 초고속 납품이 필요한 경우</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 04 */}
        <section className="mb-20 space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-cocoa/20">04</span>
            <h2 className="text-2xl font-black tracking-tighter">작업 및 커뮤니케이션 안내</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-clean p-8 space-y-4">
              <div className="flex items-center gap-3 text-cocoa">
                <Clock size={20} />
                <h3 className="font-black tracking-tight">작업 시간</h3>
              </div>
              <ul className="space-y-3 text-sm font-medium text-ink/70 break-keep">
                <li>• <strong className="text-ink">집중 작업 시간</strong> : 평일 19:00 이후 ~ 심야 / 주말 및 공휴일 전 시간대</li>
                <li>• 해당 시간대에 가장 밀도 있는 작업 진행 및 빠른 피드백 반영이 가능합니다.</li>
                <li>• <strong className="text-ink">표준 납품 기한</strong> : 기획안 및 소스 전달 완료 후 영업일 기준 3~5일 이내 초안 납품</li>
              </ul>
            </div>

            <div className="card-clean p-8 space-y-4">
              <div className="flex items-center gap-3 text-cocoa">
                <MessageSquare size={20} />
                <h3 className="font-black tracking-tight">커뮤니케이션 원칙</h3>
              </div>
              <ul className="space-y-3 text-sm font-medium text-ink/70 break-keep">
                <li>• 원활한 진행과 중복 방지를 위해, 수정 요청은 반드시 <strong className="text-ink">담당자 한 분을 통해 통합하여 전달</strong>해 주시기 바랍니다.</li>
                <li>• 복수의 경로로 전달된 수정 사항은 처리 순서가 지연될 수 있습니다.</li>
              </ul>
            </div>
          </div>

          <div className="card-clean p-8 space-y-4">
            <div className="flex items-center gap-3 text-cocoa">
              <Lock size={20} />
              <h3 className="font-black tracking-tight">저작권 및 원본 파일</h3>
            </div>
            <ul className="space-y-3 text-sm font-medium text-ink/70 break-keep">
              <li>• <strong className="text-ink">결과물 저작권</strong> : 최종 납품 영상의 저작권은 클라이언트에게 귀속됩니다. 단, Tedio 포트폴리오 활용이 가능하며, 비공개를 원하실 경우 사전 협의를 통해 조율합니다.</li>
              <li>• <strong className="text-ink">편집 원본 파일</strong> : AEP, PRPROJ 등 편집 원본 파일은 기본 제공 범위에 포함되지 않으며, 필요 시 별도 비용으로 제공 가능합니다.</li>
            </ul>
          </div>
        </section>

        {/* Section 05 */}
        <section className="mb-20 space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-cocoa/20">05</span>
            <h2 className="text-2xl font-black tracking-tighter">수정 및 결제 정책</h2>
          </div>

          <div className="space-y-8">
            <h3 className="text-lg font-black text-ink/40 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cocoa" /> 수정 규정 (Revision Policy)
            </h3>
            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-ink/5">
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-ink/40">구분</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-ink/40">횟수</th>
                    <th className="p-4 text-xs font-black uppercase tracking-widest text-ink/40">기준</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {[
                    { cat: "기본 수정", count: "2회 무료", ref: "컷 타이밍 · 레이아웃 등 일반적인 편집 수정" },
                    { cat: "경미한 수정", count: "무제한 무료", ref: "오타 정정 등 단순 텍스트 수정" },
                    { cat: "전면 재작업", count: "유료", ref: "확정된 기획안의 방향 자체가 변경되는 경우 → 총 견적의 50% 수준 별도 청구" },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-ink/[0.02] transition-colors">
                      <td className="p-4 font-black text-ink">{item.cat}</td>
                      <td className="p-4 font-black text-cocoa">{item.count}</td>
                      <td className="p-4 text-ink/60 text-sm font-medium break-keep">{item.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-lg font-black text-ink/40 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cocoa" /> 결제 방식 및 세무 처리
            </h3>
            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface/50">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-ink/5">
                  {[
                    { cat: "소액 / 숏폼", content: "선입금 100%" },
                    { cat: "일반 작업", content: "선입금 50% 착수 → 잔금 50% (최종 검수 후)" },
                    { cat: "세금계산서", content: "개인 프리랜서 신분으로 발행 불가" },
                    { cat: "기업 클라이언트", content: "사업소득(3.3%) 원천징수 신고를 통한 비용 처리 가능" },
                  ].map((item, i) => (
                    <tr key={i} className="hover:bg-ink/[0.02] transition-colors">
                      <td className="p-4 font-black text-ink w-1/3">{item.cat}</td>
                      <td className="p-4 text-ink/70 font-medium text-sm">{item.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-20 border-t border-ink/10 text-center space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-ink text-sky text-sm font-black tracking-widest">
            <CreditCard size={18} /> 정기 계약 시 전용 패키지 할인 제공
          </div>
          <p className="text-ink/40 font-medium italic">
            "브랜드의 가치를 가장 선명하게 전달하는 파트너가 되겠습니다."
          </p>
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-ink/20">
            © 2026 TEDIO STUDIO. ALL RIGHTS RESERVED.
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Proposal;
