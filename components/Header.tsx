
import React, { useState, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';

interface HeaderProps {
  points: number;
  rank: string;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  resetProgress: () => void;
  quote: string;
  userProfile?: { name: string; picture: string } | null;
  onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ points, rank, isDarkMode, setIsDarkMode, resetProgress, quote, userProfile, onSearchClick }) => {
  const [liveUsers, setLiveUsers] = useState(742);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => {
        const change = Math.floor(Math.random() * 11) - 5;
        return Math.min(1000, Math.max(1, prev + change));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`sticky top-0 z-[100] w-full border-b transition-all duration-700 ${isDarkMode ? 'bg-black/80 border-white/5' : 'bg-white/80 border-black/5'} backdrop-blur-3xl`}>
      <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:rotate-12 transition-transform">
             <span className="text-white font-black italic text-xl">A</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none uppercase">Elite Protocol</h1>
            <div className="flex items-center space-x-2 mt-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">{liveUsers} Candidates Live</span>
            </div>
          </div>
        </div>

        <div className="hidden xl:flex items-center space-x-12 px-12 border-x border-black/5 dark:border-white/5 h-full">
           <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Analytical XP</p>
              <p className="text-xl font-black tabular-nums text-blue-600">{points}</p>
           </div>
           <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Current Rank</p>
              <p className="text-xl font-black uppercase tracking-tight">{rank}</p>
           </div>
           <p className="text-[10px] font-bold uppercase tracking-widest italic opacity-20 max-w-xs text-center leading-relaxed">"{quote}"</p>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-6">
          <MusicPlayer />
          <div className="flex items-center space-x-2">
            <button onClick={onSearchClick} className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-black'}`}>🔍</button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white shadow-xl'}`}>
              {isDarkMode ? '☼' : '☾'}
            </button>
            <button onClick={resetProgress} className="text-[10px] font-black uppercase tracking-widest px-6 h-11 rounded-full border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all">Reset</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
