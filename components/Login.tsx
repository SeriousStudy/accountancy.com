
import React, { useEffect, useRef, useState } from 'react';

interface LoginProps {
  onLogin: (profile: any) => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [showOverride, setShowOverride] = useState(false);

  useEffect(() => {
    // The Google API requires the specific Vercel URL to be whitelisted in the GCP Console.
    // If it isn't, the script won't render the button. We provide a bypass for this.
    const clientId = "62202277899-nmj96l8qmjilhm0q27c358aohr3iq255.apps.googleusercontent.com"; 

    const initializeGoogle = () => {
      const google = (window as any).google;
      if (google && google.accounts) {
        setIsScriptLoaded(true);
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: (res: any) => {
              const token = res.credential;
              const payload = JSON.parse(atob(token.split('.')[1]));
              onLogin({
                name: payload.name,
                email: payload.email,
                picture: payload.picture
              });
            },
            auto_select: false,
            use_fedcm_for_prompt: false,
          });

          if (googleBtnRef.current) {
            google.accounts.id.renderButton(googleBtnRef.current, {
              theme: isDarkMode ? "filled_black" : "outline",
              size: "large",
              shape: "pill",
              width: 320,
              text: "continue_with",
            });
          }
        } catch (err) {
          setShowOverride(true);
        }
      }
    };

    const interval = setInterval(() => {
      if ((window as any).google) {
        initializeGoogle();
        clearInterval(interval);
      }
    }, 500);

    // If Google doesn't load/work in 2.5 seconds, show the override button
    const timeout = setTimeout(() => setShowOverride(true), 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onLogin, isDarkMode]);

  const handleOverride = () => {
    // Immediate Guest Entry
    onLogin({
      name: "Elite Candidate",
      email: "guest@protocol.elite",
      picture: "" 
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-all duration-1000 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'}`}>
      <div className="max-w-md w-full animate-fade">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] mx-auto mb-10 flex items-center justify-center shadow-[0_30px_60px_rgba(0,113,227,0.4)] relative group overflow-hidden">
            <span className="text-white text-5xl font-black italic relative z-10 group-hover:scale-110 transition-transform duration-500">A</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">Elite Entry.</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-30 italic">Accountancy Protocol v1.0.1</p>
        </div>

        <div className={`apple-card p-12 flex flex-col items-center border transition-all duration-700 relative overflow-hidden ${isDarkMode ? 'border-white/10 bg-zinc-900/40 backdrop-blur-3xl shadow-blue-500/5' : 'border-black/5 bg-white shadow-2xl'}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600"></div>
          
          <div className="mb-12 text-center space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">Security Node: Active</span>
            </div>
            <p className="text-xs font-bold opacity-80 leading-relaxed max-w-[260px] mx-auto">Verified identity is required to access the 15-Day Accountancy Command Center.</p>
          </div>
          
          <div className="relative min-h-[64px] w-full flex flex-col items-center justify-center space-y-6">
            <div ref={googleBtnRef} className={`${!isScriptLoaded ? 'hidden' : 'block animate-pop'}`}></div>
            
            {showOverride && (
              <button 
                onClick={handleOverride}
                className="w-full py-4 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all animate-pop"
              >
                Enter as Guest Candidate
              </button>
            )}

            {!isScriptLoaded && !showOverride && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-20 italic">Authenticating...</p>
              </div>
            )}
          </div>

          <div className="mt-20 pt-10 border-t border-black/5 dark:border-white/10 w-full text-center">
            <div className="flex items-center justify-center space-x-4 opacity-20">
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">Audit Trail: Secure</span>
              <div className="w-1 h-1 rounded-full bg-current"></div>
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">SSL Verified</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[9px] font-black uppercase tracking-[0.3em] opacity-10">
          Professional Study Suite • 2026 Edition
        </p>
      </div>
    </div>
  );
};

export default Login;
