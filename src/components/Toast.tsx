import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    info: <Info className="text-sky-500" size={20} />,
  };

  const bgColors = {
    success: 'bg-emerald-500/10 border-emerald-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    info: 'bg-sky-500/10 border-sky-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${bgColors[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-bold text-ink">{message}</span>
      <button 
        onClick={onClose}
        className="ml-4 p-1 hover:bg-ink/5 rounded-full transition-colors text-ink/40 hover:text-ink"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Toast;
