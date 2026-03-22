import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Settings, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  siteName: string;
  isDark: boolean;
  toggleTheme: () => void;
  onAdminClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ siteName, isDark, toggleTheme, onAdminClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Works', href: '#works' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2 bg-paper/80 backdrop-blur-xl border-b border-ink/5' : 'py-4 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <motion.a 
          href="#"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg md:text-xl font-black tracking-tighter text-ink flex items-center gap-2"
        >
          <span className="w-6 h-6 bg-cocoa rounded flex items-center justify-center text-sky text-[10px]">P</span>
          {siteName}
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-[0.8rem] font-black uppercase tracking-widest text-ink/40 hover:text-ink transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cocoa transition-all group-hover:w-full" />
              </motion.a>
            ))}
          </div>
          
          <div className="flex items-center gap-3 pl-6 border-l border-ink/10">
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-ink/5 transition-colors text-ink"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button 
              onClick={onAdminClick}
              className="p-1.5 rounded-full hover:bg-ink/5 transition-colors text-ink"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-ink/5 transition-colors text-ink"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-ink"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-paper border-b border-ink/5 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-bold text-ink"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  onAdminClick();
                }}
                className="flex items-center gap-2 text-xl font-bold text-cocoa"
              >
                <Settings size={20} /> Admin Settings
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
