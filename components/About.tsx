
import React from 'react';

const About: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-10 animate-fade">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-10 sm:p-16 border shadow-2xl stagger-in hide-scrollbar ${isDark ? 'bg-zinc-950 border-white/5 text-white' : 'bg-white border-black/5 text-black'}`}>
        
        <button onClick={onClose} className="absolute top-10 right-10 text-3xl font-light hover:rotate-90 transition-transform">✕</button>

        <div className="space-y-16">
          <section className="text-center sm:text-left">
            <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Lead Architect Identified</span>
            </div>
            <h2 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.85] italic mb-6">PIYUSH <br/><span className="text-blue-600">PANDEY.</span></h2>
            <p className="text-lg sm:text-xl font-bold opacity-40 uppercase tracking-widest leading-none">Developer & Strategic Lead</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">The Mission</h4>
                <p className="text-sm font-bold leading-relaxed opacity-60 italic">
                  "MASTER ACCOUNTS. was forged to bridge the gap between academic theory and Big Four professional standards. We don't just solve papers; we build fiscal intuition."
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {['React 18', 'Gemini AI', 'TypeScript', 'Tailwind CSS', 'Web Audio Engine', 'Native Multimodal API'].map(t => (
                    <span key={t} className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-[10px] font-black uppercase tracking-tight">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Ecosystem Features</h4>
              <ul className="space-y-6">
                {[
                  { n: "Analytical Hub", d: "High-precision AI auditing for conceptual clarity." },
                  { n: "Live Audit Node", d: "Real-time multimodal observation & voice feedback." },
                  { n: "Fiscal Command Hub", d: "20+ specialized accounting calculators & tools." },
                  { n: "Focus Engine", d: "Synthesized neural audio for sensory isolation." }
                ].map(f => (
                  <li key={f.n} className="flex space-x-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">{f.n}</p>
                      <p className="text-[11px] font-bold opacity-40">{f.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-16 border-t border-black/5 dark:border-white/5 text-center flex flex-col items-center space-y-4">
             <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black italic shadow-2xl shadow-blue-600/30">M</div>
             <p className="text-[9px] font-black uppercase tracking-[0.8em] opacity-20">ESTABLISHED 2026 • PIYUSH PANDEY PROTOCOL</p>
             <p className="text-[8px] font-bold opacity-10 uppercase tracking-widest">MASTER ACCOUNTS. Intelligence Logic Reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
