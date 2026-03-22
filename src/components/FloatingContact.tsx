import React from 'react';
import { motion } from 'motion/react';

interface FloatingContactProps {
  kakaoUrl?: string;
}

const FloatingContact: React.FC<FloatingContactProps> = ({ 
  kakaoUrl = 'https://open.kakao.com/o/sribRuxh' 
}) => {
  return (
    <motion.a
      href={kakaoUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[150] w-14 h-14 bg-[#FEE500] text-[#3C1E1E] rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
      title="카카오톡 문의하기"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.712 4.8 4.346 6.09-.204.765-.737 2.754-.844 3.185-.13.522.188.517.397.378.165-.11.2.14 2.643-1.793.792.22 1.633.34 2.5.34 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
      </svg>
    </motion.a>
  );
};

export default FloatingContact;
