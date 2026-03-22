import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Mail, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { Profile } from '../types';

interface FooterProps {
  profile: Profile;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  return (
    <footer id="contact" className="bg-[#1A1A1A] text-[#F2EDED] py-16 px-6 md:px-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-12">
          <div className="lg:col-span-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8"
            >
              Let's<br />collaborate.
            </motion.h2>
            <a 
              href={profile.contact_kakao || `mailto:${profile.email}`}
              target={profile.contact_kakao ? "_blank" : undefined}
              rel={profile.contact_kakao ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-4 text-xl md:text-2xl font-black hover:text-cocoa transition-colors group"
            >
              {profile.contact_kakao ? "KakaoTalk Chat" : profile.email}
              <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Social</h4>
              <ul className="space-y-2">
                {profile.contact_kakao && (
                  <li><a href={profile.contact_kakao} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold hover:text-cocoa transition-colors"><ExternalLink size={14} /> KakaoTalk</a></li>
                )}
                <li><a href="#" className="flex items-center gap-2 text-sm font-bold hover:text-cocoa transition-colors"><Instagram size={14} /> Instagram</a></li>
                <li><a href="#" className="flex items-center gap-2 text-sm font-bold hover:text-cocoa transition-colors"><Youtube size={14} /> YouTube</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Contact</h4>
              <ul className="space-y-2">
                <li><a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm font-bold hover:text-cocoa transition-colors"><Mail size={14} /> Email</a></li>
                <li><p className="text-sm font-bold opacity-60">Seoul, Korea</p></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">
            © {new Date().getFullYear()} {profile.site_name}. All rights reserved.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-cocoa transition-colors"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
