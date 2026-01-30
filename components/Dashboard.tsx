
import React, { useMemo } from 'react';
import { UserProgress, VitalityStats } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RANKS } from '../constants';
import Timer from './Timer';
import ProductivitySuite from './ProductivitySuite';
import VitalityMonitor from './VitalityMonitor';

interface DashboardProps {
  progress: UserProgress;
  unlockedDay: number;
  onSelectDay: (day: number) => void;
  onOpenSupport: () => void;
  onUpdateVitals: (v: Partial<VitalityStats>) => void;
  onAboutClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ progress, unlockedDay, onSelectDay, onOpenSupport, onUpdateVitals, onAboutClick }) => {
  const isDark = document.documentElement.classList.contains('dark');
  
  const currentRankInfo = useMemo(() => {
    const totalPoints = progress.points;
    const rank = RANKS.find(r => r.name === progress.rank) || RANKS[0];
    const rankIndex = RANKS.indexOf(rank);
    const nextRank = RANKS[rankIndex + 1] || rank;
    const diff = nextRank.threshold - rank.threshold;
    const progressToNext = diff > 0 ? ((totalPoints - rank.threshold) / diff) * 100 : 100;
    return { ...rank, progressToNext: Math.min(progressToNext, 100), nextName: nextRank.name };
  }, [progress]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 pb-48 space-y-20 pt-10">
      
      {/* 1. HERO & STRATEGIC HUD */}
      <div className="grid grid-cols-12 gap-8 stagger-in">
        
        {/* Main Hero Panel */}
        <div className={`col-span-12 xl:col-span-9 p-10 sm:p-20 rounded-[3rem] border apple-card relative overflow-hidden flex flex-col justify-between ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-12 sm:mb-16">
               <span className="px-5 py-2 rounded-full bg-blue-600 text-[9px] font-black text-white uppercase tracking-[0.3em] shadow-xl shadow-blue-600/30">Protocol v3.0</span>
               <div className="h-px w-8 sm:w-12 bg-black/10 dark:bg-white/10"></div>
               <span className="text-[9px] font-black uppercase tracking-widest opacity-20 hidden sm:block">Accounting Mastery Suite</span>
            </div>
            
            <h2 className={`text-5xl sm:text-[10rem] font-black tracking-tighter leading-[0.75] mb-12 sm:mb-16 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
               FISCAL <br/> 
               <span className="text-blue-600 italic">DOMINANCE.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 mt-16 sm:mt-20">
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
                    <span>{currentRankInfo.name}</span>
                    <span>{Math.round(currentRankInfo.progressToNext)}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-[2.5s] relative" style={{ width: `${currentRankInfo.progressToNext}%` }}>
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Next Target: {currentRankInfo.nextName}</p>
               </div>

               <div className="flex items-center space-x-12">
                  <div>
                    <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mb-1 text-current">Efficiency</p>
                    <p className="text-4xl sm:text-5xl font-black tabular-nums text-blue-600">{(progress.points/70).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mb-1 text-current">Total XP</p>
                    <p className={`text-4xl sm:text-5xl font-black tabular-nums ${isDark ? 'text-white' : 'text-zinc-950'}`}>{progress.points}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-16 sm:mt-20 flex flex-wrap gap-4 sm:gap-6 relative z-10">
             <button onClick={() => onSelectDay(Math.max(1, unlockedDay))} className="flex-1 sm:flex-none px-12 sm:px-16 py-6 sm:py-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all">
               Day {unlockedDay || 1}
             </button>
             <button onClick={onOpenSupport} className={`flex-1 sm:flex-none px-10 sm:px-12 py-6 sm:py-7 rounded-full font-black text-xs uppercase tracking-[0.4em] border transition-all ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800 shadow-xl'}`}>
               Consult
             </button>
          </div>

          <div className="absolute right-[-8%] bottom-[-12%] text-[30rem] sm:text-[45rem] font-black opacity-[0.015] pointer-events-none tracking-tighter select-none leading-none">
            {unlockedDay || 'A'}
          </div>
        </div>

        {/* Vitality Sidebar */}
        <div className="col-span-12 xl:col-span-3 space-y-6 flex flex-col">
           <VitalityMonitor vitals={progress.vitals} onUpdate={onUpdateVitals} />
           <div className={`flex-1 p-8 sm:p-10 rounded-[3rem] border apple-card ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-8 text-current">Chapter Weights</h3>
              <div className="space-y-6">
                 {[
                   { n: 'Partnership', w: 36, c: 'bg-blue-600' },
                   { n: 'Share Capital', w: 24, c: 'bg-indigo-600' },
                   { n: 'Financials', w: 20, c: 'bg-emerald-600' },
                   { n: 'Cash Flow', w: 8, c: 'bg-rose-600' },
                   { n: 'Ratios', w: 12, c: 'bg-amber-600' }
                 ].map(x => (
                   <div key={x.n} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                         <span className="opacity-60 uppercase tracking-tight text-current">{x.n}</span>
                         <span className="text-blue-600">{x.w}%</span>
                      </div>
                      <div className="h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full ${x.c}`} style={{ width: `${x.w}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 2. COMMAND SUITE */}
      <section className="space-y-12">
        <div className="flex items-center space-x-8 sm:space-x-12">
           <h3 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase italic opacity-20">Fiscal Command Hub</h3>
           <div className="h-px flex-1 bg-black/10 dark:bg-white/10"></div>
        </div>
        <ProductivitySuite onOpenAI={onOpenSupport} />
      </section>

      {/* 3. PERFORMANCE ANALYTICS */}
      <div className="grid grid-cols-12 gap-8 items-stretch stagger-in">
         <div className="col-span-12 xl:col-span-4">
            <Timer />
         </div>
         <div className={`col-span-12 xl:col-span-8 p-10 sm:p-12 rounded-[3.5rem] border apple-card ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-10 text-current">XP Momentum Velocity</h3>
            <div className="h-[300px] sm:h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progress.days.map((d, i) => ({ day: i+1, xp: d.sessions.filter(s => s.completed).length * 150 }))}>
                     <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0071e3" stopOpacity={0.4}/>
                           <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Area type="monotone" dataKey="xp" stroke="#0071e3" strokeWidth={5} fill="url(#chartGlow)" animationDuration={1500} />
                     <XAxis dataKey="day" hide />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', background: '#000', color: '#fff', fontWeight: '900', padding: '12px 20px', fontSize: '12px' }}
                        itemStyle={{ color: '#0071e3' }}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* 4. PROTOCOL TIMELINE */}
      <section className="space-y-12">
        <div className="flex items-center space-x-12">
           <div className="h-px flex-1 bg-black/10 dark:bg-white/10"></div>
           <h3 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase italic opacity-10">Study Timeline</h3>
           <div className="h-px flex-1 bg-black/10 dark:bg-white/10"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4 sm:gap-6">
          {progress.days.map((day) => {
            const isLocked = day.dayNumber > unlockedDay;
            const completedCount = day.sessions.filter(s => s.completed).length;
            const isToday = day.dayNumber === unlockedDay;
            return (
              <button key={day.dayNumber} disabled={isLocked} onClick={() => onSelectDay(day.dayNumber)}
                className={`p-8 sm:p-10 rounded-[2.5rem] text-left border transition-all duration-700 relative group overflow-hidden ${
                  isLocked ? 'bg-zinc-100 dark:bg-zinc-950 opacity-10 border-transparent grayscale' : 
                  isToday ? 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-600/40 scale-105 z-20' : 
                  'bg-white dark:bg-zinc-950 border-black/5 dark:border-white/5 hover:border-blue-500 hover:-translate-y-2'
                }`}>
                 <span className={`text-[9px] font-black tracking-widest uppercase mb-4 block ${isToday ? 'text-white/60' : 'opacity-20 text-current'}`}>Day {day.dayNumber}</span>
                 <p className="text-2xl sm:text-3xl font-black tracking-tighter mb-4 leading-none">{new Date(day.dateString).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</p>
                 <div className="flex space-x-1 mt-6 sm:mt-8">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < completedCount ? 'bg-current shadow-sm' : 'bg-black/10 dark:bg-white/10'}`}></div>
                    ))}
                 </div>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="text-center py-32 border-t border-black/5 dark:border-white/5">
         <div className="flex flex-col sm:flex-row items-center justify-center space-y-8 sm:space-y-0 sm:space-x-12 mb-12">
            <button onClick={onAboutClick} className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 hover:opacity-100 hover:text-blue-600 transition-all">ABOUT PROTOCOL</button>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-current opacity-20"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">PIYUSH PANDEY PROTOCOL</span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-current opacity-20"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">EY ECOSYSTEM</span>
         </div>
         <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 opacity-10">
            <span className="text-[9px] font-black uppercase tracking-[1em]">KPMG COMPLIANT</span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-current"></div>
            <span className="text-[9px] font-black uppercase tracking-[1em]">DELOITTE GRADE</span>
         </div>
      </footer>
    </div>
  );
};

export default Dashboard;
