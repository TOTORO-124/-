import React from 'react';
import { motion } from 'motion/react';
import { Profile } from '../types';

interface AboutProps {
  profile: Profile;
}

const About: React.FC<AboutProps> = ({ profile }) => {
  return (
    <section id="about" className="py-16 md:py-20 px-6 md:px-12 bg-paper relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-12 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-12"
          >
            <h2 className="absolute -top-10 left-0 text-7xl md:text-9xl font-black tracking-tighter leading-none text-ink/5 select-none -z-10">
              ABOUT
            </h2>
            <div className="space-y-4 max-w-2xl pt-10 md:pt-0">
              <h3 className="text-[2rem] font-black tracking-tighter leading-tight text-ink break-keep">
                {profile.about_subtitle}
              </h3>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12 items-center pt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 space-y-6"
            >
              <p className="text-base md:text-lg text-ink/70 font-medium leading-relaxed whitespace-pre-line break-keep">
                {profile.about_text}
              </p>
              <div className="w-16 h-1 bg-cocoa/20 rounded-full" />
            </motion.div>

            <div className="lg:col-span-6 grid gap-6">
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
                  className="card-clean flex gap-6 items-start group"
                >
                  <span className="text-3xl font-black text-cocoa/10 group-hover:text-cocoa/30 transition-colors shrink-0">0{i + 1}</span>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black tracking-tighter text-ink">{strength.title}</h4>
                    <p className="text-sm text-ink/60 font-medium leading-relaxed break-keep">{strength.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
