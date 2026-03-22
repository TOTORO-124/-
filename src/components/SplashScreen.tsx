import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SplashScreen: React.FC = () => {
  const words = ["Hello", "Creative", "Video Producer", "TEDIO"];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (index < words.length - 1) {
      const timer = setTimeout(() => setIndex(index + 1), 500);
      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <motion.div 
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[999] bg-ink flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={words[index]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-paper"
          >
            {words[index]}
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-8 w-32 h-[1px] bg-paper/10 relative overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 2, 
              ease: "linear" 
            }}
            className="absolute inset-0 bg-cocoa"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
