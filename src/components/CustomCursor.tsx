import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverAttr = target.closest('[data-cursor]') as HTMLElement;
      if (hoverAttr) {
        setIsHovering(true);
        setCursorText(hoverAttr.getAttribute('data-cursor') || '');
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999]">
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-cocoa rounded-full mix-blend-difference"
        animate={{
          x: mousePos.x - 8,
          y: mousePos.y - 8,
          scale: isHovering ? 5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.5 }}
      />
      <AnimatePresence>
        {isHovering && cursorText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-0 left-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-sky"
            style={{
              x: mousePos.x - 40,
              y: mousePos.y - 40,
              width: 80,
              height: 80,
            }}
          >
            {cursorText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomCursor;
