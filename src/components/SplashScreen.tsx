import React from 'react';
import { motion } from 'motion/react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[999] bg-paper flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="text-4xl font-black tracking-tighter mb-4 text-ink">TEDIO</div>
        <div className="w-48 h-[2px] bg-ink/5 relative overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-cocoa"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
