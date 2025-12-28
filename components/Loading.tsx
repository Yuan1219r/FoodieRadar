import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';
import { Sparkles } from 'lucide-react';

interface LoadingProps {
  isVisible: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ isVisible }) => {
  const [currentMessage, setCurrentMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    if (isVisible) {
      setCurrentMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/60 backdrop-blur-3xl transition-all duration-500">
      <div className="liquid-glass p-16 rounded-[60px] flex flex-col items-center max-w-md w-full mx-4 relative overflow-hidden border-white/10">
        {/* Internal Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full animate-pulse"></div>

        <div className="mb-10 relative z-10">
          <div className="relative p-8 rounded-full border border-primary/20 bg-primary/5">
            <Sparkles size={60} className="text-primary animate-[spin_4s_linear_infinite]" />
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        <h3 className="text-2xl font-black text-white text-center relative z-10 tracking-tight leading-relaxed italic drop-shadow-lg">
          {currentMessage.text}
        </h3>

        {/* Refractive Loader Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full mt-10 overflow-hidden relative z-10 border border-white/10">
          <div className="h-full bg-gradient-to-r from-primary to-blue-400 animate-[liquid_2s_infinite_ease-in-out] w-1/2 rounded-full absolute shadow-[0_0_15px_rgba(38,222,129,0.5)]"></div>
        </div>

        <style>{`
          @keyframes liquid {
            0% { left: -50%; width: 20%; }
            50% { width: 50%; }
            100% { left: 100%; width: 20%; }
          }
        `}</style>
      </div>
    </div>
  );
};