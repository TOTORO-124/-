import React from 'react';
import { motion } from 'motion/react';
import { Profile } from '../types';

interface AboutProps {
  profile: Profile;
}

const About: React.FC<AboutProps> = ({ profile }) => {
  return (
    <section id="about" className="py-20 px-6 md:px-12 bg-paper relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Side: Title & Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative"
          >
            <h2 className="absolute -top-16 -left-8 text-8xl md:text-[10rem] font-black tracking-tighter leading-none text-ink/5 select-none -z-10">
              ABOUT
            </h2>
            <div className="space-y-8 pt-4">
              <h3 className="text-[2.5rem] md:text-[3rem] font-black tracking-tighter leading-[1.1] text-ink break-keep">
                {profile.about_subtitle}
              </h3>
              <div className="space-y-6">
                <p className="text-lg text-ink/70 font-medium leading-relaxed break-keep">
                  {profile.about_text}
                </p>
                <div className="w-16 h-1 bg-cocoa/20 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Right Side: Strengths Cards */}
          <div className="lg:col-span-7 grid gap-4">
            {[
              { title: profile.strength1_title, desc: profile.strength1_desc },
              { title: profile.strength2_title, desc: profile.strength2_desc },
              { title: profile.strength3_title, desc: profile.strength3_desc },
            ].map((strength, i) => (
              <motion.div
                key={strength.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-clean p-8 flex gap-8 items-center group hover:bg-cocoa/5 transition-all"
              >
                <span className="text-4xl font-black text-cocoa/10 group-hover:text-cocoa/30 transition-colors shrink-0">0{i + 1}</span>
                <div className="space-y-1">
                  <h4 className="text-xl font-black tracking-tighter text-ink">{strength.title}</h4>
                  <p className="text-sm text-ink/60 font-medium leading-relaxed break-keep">{strength.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
