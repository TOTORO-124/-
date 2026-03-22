import React from 'react';
import { motion } from 'motion/react';
import { Layers, Zap, CheckCircle, Cpu, Target } from 'lucide-react';

export const HowIWork: React.FC = () => {
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
    <section id="process" className="py-16 md:py-20 bg-beige">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs font-black tracking-[0.4em] uppercase text-cocoa mb-3">How I Work</h2>
          <p className="text-[2rem] font-black text-ink tracking-tighter leading-tight">신뢰를 만드는 작업 프로세스</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card-clean p-8 flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-cocoa/5 flex items-center justify-center text-cocoa mb-4 group-hover:bg-cocoa group-hover:text-sky transition-all">
                {step.icon}
              </div>
              <h3 className="text-[1.25rem] font-black tracking-tighter text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-ink/60 font-medium leading-relaxed break-keep">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const WorkflowAndTools: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-paper">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7"
        >
          <h2 className="text-[10px] font-black tracking-[0.5em] uppercase text-cocoa mb-4">Workflow & Tools</h2>
          <p className="text-4xl md:text-5xl font-black text-ink tracking-tighter mb-6 leading-tight break-keep">
            최적의 결과물을 위해<br />도구를 유연하게 활용합니다.
          </p>
          <div className="space-y-6 text-ink/60 font-medium leading-relaxed text-lg break-keep">
            <p>
              기획의 의도를 가장 정확하게 구현하기 위해 최신 기술과 도구를 적극적으로 활용합니다. 
              단순한 도구의 숙련도를 넘어, 프로젝트의 성격에 맞는 최적의 워크플로우를 설계합니다.
            </p>
            <p>
              특히 AI 기반 도구들을 제작 공정 전반에 도입하여, 반복적인 작업 시간을 단축하고 
              기획의 디테일과 창의적인 연출에 더 많은 에너지를 집중합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-12">
            {['Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator', 'AI Workflow'].map(tool => (
              <span key={tool} className="px-5 py-2.5 rounded-xl bg-cocoa/5 border border-cocoa/10 text-[10px] font-black text-cocoa uppercase tracking-widest">
                {tool}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-5 relative"
        >
          <div className="card-clean relative z-10">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-cocoa/10 flex items-center justify-center shrink-0">
                  <Cpu className="text-cocoa" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-ink mb-2">AI Assisted Workflow</h4>
                  <p className="text-sm text-ink/60 leading-relaxed break-keep">AI를 활용한 빠른 시안 작업 및 레퍼런스 분석으로 기획의 정확도를 높입니다.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-cocoa/10 flex items-center justify-center shrink-0">
                  <Target className="text-cocoa" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-ink mb-2">Focus on Essence</h4>
                  <p className="text-sm text-ink/60 leading-relaxed break-keep">단순 반복 업무를 자동화하고, 영상의 메시지와 리듬감 등 본질적인 퀄리티에 집중합니다.</p>
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
