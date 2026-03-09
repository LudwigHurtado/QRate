import React, { useEffect } from 'react';
import { CheckIcon, XIcon } from './icons/Icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-dismiss after 4 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckIcon : XIcon;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className={`flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor} animate-fade-in-up`}>
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button onClick={onClose} className="inline-flex rounded-md p-1.5 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
            <span className="sr-only">Dismiss</span>
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
       <style>{`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default Toast;
