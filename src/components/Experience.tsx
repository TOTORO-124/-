import React from 'react';
import { motion } from 'motion/react';
import { Experience as ExperienceType } from '../types';

interface ExperienceProps {
  experience: ExperienceType | null;
}

const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  if (!experience) return null;

  return (
    <section id="experience" className="py-16 md:py-20 px-6 md:px-12 bg-paper relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-12 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-12"
          >
            <h2 className="absolute -top-10 left-0 text-7xl md:text-9xl font-black tracking-tighter leading-none text-ink/5 select-none -z-10">
              EXPERIENCE
            </h2>
            <div className="space-y-4 max-w-2xl pt-10 md:pt-0">
              <h3 className="text-[2rem] font-black tracking-tighter leading-tight text-ink break-keep">
                {experience.role}
              </h3>
              <p className="text-lg md:text-xl text-ink/40 font-black tracking-tighter uppercase">
                {experience.period}
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12 items-center pt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <div className="grid gap-12">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-cocoa">Field of Expertise</h4>
                  <p className="text-xl md:text-2xl font-black tracking-tighter text-ink leading-tight break-keep">
                    {experience.field}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-cocoa">Production Scope</h4>
                  <p className="text-xl md:text-2xl font-black tracking-tighter text-ink leading-tight break-keep">
                    {experience.scope}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-cocoa">Key Strengths</h4>
                  <p className="text-xl md:text-2xl font-black tracking-tighter text-ink leading-tight break-keep">
                    {experience.strengths}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="p-12 bg-cocoa rounded-[3rem] text-sky shadow-2xl shadow-cocoa/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 opacity-60">Collaborated Brands</h4>
                <div className="flex flex-wrap gap-x-8 gap-y-6">
                  {experience.brands.split(',').map((brand, i) => (
                    <span key={brand} className="text-xl md:text-2xl font-black tracking-tighter hover:scale-110 transition-transform cursor-default">
                      {brand.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
