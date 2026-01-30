
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
}

const Dashboard: React.FC<DashboardProps> = ({ progress, unlockedDay, onSelectDay, onOpenSupport, onUpdateVitals }) => {
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
    <div className="space-y-16 animate-slide-up max-w-[1600px] mx-auto pb-48 px-6">
      
      {/* 1. Hero Command Station (12-Col Grid) */}
      <div className="grid grid-cols-12 gap-8 pt-10">
        
        <div className={`col-span-12 xl:col-span-8 p-12 sm:p-20 rounded-[3rem] border apple-card relative overflow-hidden flex flex-col justify-between ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-12">
               <span className="px-5 py-2 rounded-full bg-blue-600 text-[11px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">System Integrity 100%</span>
               <span className="text-[11px] font-black uppercase tracking-widest opacity-20">Production Env</span>
            </div>
            
            <h2 className={`text-6xl sm:text-[10rem] font-black tracking-tighter leading-[0.8] mb-12 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
               MASTER <br/> 
               <span className="text-blue-600 italic">ACCOUNTS.</span>
            </h2>

            <div className="max-w-2xl space-y-8 mt-16">
               <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-40">
                    <span>Rank Evolution: {currentRankInfo.name}</span>
                    <span>Next: {currentRankInfo.nextName} ({Math.round(currentRankInfo.progressToNext)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-[2s] glow-active" style={{ width: `${currentRankInfo.progressToNext}%` }} />
                  </div>
               </div>

               <div className="flex flex-wrap gap-6 pt-6">
                  <button onClick={() => onSelectDay(Math.max(1, unlockedDay))} className="px-14 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all">
                    Initiate Day {unlockedDay || 1}
                  </button>
                  <button onClick={onOpenSupport} className={`px-12 py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] border transition-all ${isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800 shadow-xl'}`}>
                    AI Consultant
                  </button>
               </div>
            </div>
          </div>
          <div className="absolute right-[-5%] bottom-[-10%] text-[40rem] font-black opacity-[0.02] pointer-events-none tracking-tighter select-none">
            {unlockedDay || 'A'}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 grid grid-cols-1 gap-8">
           <VitalityMonitor vitals={progress.vitals} onUpdate={onUpdateVitals} />
           <div className={`p-10 rounded-[3rem] border apple-card ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white'}`}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30 mb-8">Exam Analysis</h3>
              <div className="space-y-6">
                 {[
                   { n: 'Partnership', w: 36, c: 'bg-blue-600' },
                   { n: 'Shares', w: 24, c: 'bg-indigo-600' },
                   { n: 'Analysis', w: 20, c: 'bg-emerald-600' }
                 ].map(x => (
                   <div key={x.n} className="space-y-2">
                      <div className="flex justify-between text-[11px] font-black opacity-60"><span>{x.n}</span><span>{x.w}%</span></div>
                      <div className="h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden"><div className={`h-full ${x.c}`} style={{ width: `${x.w}%` }} /></div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 2. Fiscal Command Suite (The 10 Tools) */}
      <section className="space-y-12">
        <div className="flex items-center space-x-8">
           <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
           <h3 className="text-3xl font-black tracking-tighter uppercase italic opacity-20">Fiscal Command Suite</h3>
           <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
        </div>
        <ProductivitySuite onOpenAI={onOpenSupport} />
      </section>

      {/* 3. Performance & Timeline */}
      <section className="grid grid-cols-12 gap-8">
         <div className="col-span-12 xl:col-span-4">
            <Timer />
         </div>
         <div className={`col-span-12 xl:col-span-8 p-12 rounded-[3rem] border apple-card ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-30 mb-10">Historical XP Velocity</h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progress.days.map((d, i) => ({ day: i+1, xp: d.sessions.filter(s => s.completed).length * 150 }))}>
                     <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0071e3" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Area type="monotone" dataKey="xp" stroke="#0071e3" strokeWidth={6} fill="url(#chartGradient)" />
                     <XAxis dataKey="day" hide />
                     <YAxis hide />
                     <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', background: '#000', color: '#fff', fontWeight: '900' }} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </section>

      {/* 4. The 15-Day Grid */}
      <section className="space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {progress.days.map((day) => {
            const isLocked = day.dayNumber > unlockedDay;
            const completedCount = day.sessions.filter(s => s.completed).length;
            const isToday = day.dayNumber === unlockedDay;
            return (
              <button key={day.dayNumber} disabled={isLocked} onClick={() => onSelectDay(day.dayNumber)}
                className={`p-10 rounded-[2.5rem] text-left border transition-all duration-700 relative overflow-hidden ${
                  isLocked ? 'bg-zinc-100 dark:bg-zinc-950 opacity-20 border-transparent grayscale' : 
                  isToday ? 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-600/40 scale-105 z-20' : 
                  'bg-white dark:bg-zinc-950 border-black/5 dark:border-white/5 hover:border-blue-500'
                }`}>
                 <span className={`text-[11px] font-black tracking-widest uppercase mb-6 block ${isToday ? 'text-white/60' : 'opacity-30'}`}>Day {day.dayNumber}</span>
                 <p className="text-3xl font-black tracking-tighter mb-4">{new Date(day.dateString).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</p>
                 <div className="flex space-x-1.5 mt-8">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < completedCount ? 'bg-current' : 'bg-black/10 dark:bg-white/10'}`}></div>
                    ))}
                 </div>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="text-center py-32 opacity-20 text-[11px] font-black uppercase tracking-[1em]">
         Ecosystem Secure • No Entry Unbalanced
      </footer>
    </div>
  );
};

export default Dashboard;
