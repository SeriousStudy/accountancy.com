
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, GenerateContentResponse } from '@google/genai';

// Professional API Wrapper
async function callGenAI(prompt: string, retries = 3, delay = 1000): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { 
        systemInstruction: "You are the Elite Accountancy Consultant. Clinical, expert, and precise. You provide high-density analytical support using IAS/GAAP standards. No fluff. Strictly professional.",
        temperature: 0.5,
      },
    });
    return response.text || "No analytical output generated.";
  } catch (error: any) {
    if (retries > 0 && (error.status === 429 || error.status >= 500)) {
      await new Promise(res => setTimeout(res, delay));
      return callGenAI(prompt, retries - 1, delay * 2);
    }
    return "Protocol failure: Analytical core unresponsive. Re-engage session.";
  }
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const SupportChat: React.FC<{ onBack: () => void; initialMessage?: string }> = ({ onBack, initialMessage }) => {
  const isDark = document.documentElement.classList.contains('dark');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { type: 'bot', text: "Elite Consultant initialized. Analytical core active. State your requirement." }
  ]);
  
  const [isLiveMode, setIsLiveMode] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioCtxRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping || isLiveMode) return;
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInput('');
    setIsTyping(true);
    try {
      const result = await callGenAI(text);
      setMessages(prev => [...prev, { type: 'bot', text: result }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: "Consultant Offline." }]);
    } finally { setIsTyping(false); }
  }, [isTyping, isLiveMode]);

  useEffect(() => {
    if (initialMessage && messages.length === 1) handleSendMessage(initialMessage);
  }, [initialMessage, handleSendMessage]);

  const startLiveSession = async () => {
    if (isLiveMode) {
      sessionRef.current?.close();
      setIsLiveMode(false);
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioCtxRef.current = { input: inputCtx, output: outputCtx };
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLiveMode(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob: Blob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const data = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (data && audioCtxRef.current) {
              const out = audioCtxRef.current.output;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, out.currentTime);
              const buffer = await decodeAudioData(decode(data), out, 24000, 1);
              const source = out.createBufferSource();
              source.buffer = buffer;
              source.connect(out.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => setIsLiveMode(false),
          onerror: () => setIsLiveMode(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { setIsLiveMode(false); }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className={`fixed inset-0 z-[150] flex flex-col animate-pop ${isDark ? 'bg-black text-white' : 'bg-[#f5f5f7] text-black'}`}>
      <div className="h-24 border-b border-white/5 flex items-center justify-between px-10 backdrop-blur-3xl sticky top-0 bg-inherit/90">
        <div className="flex items-center space-x-5">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-xl shadow-blue-500/20">PP</div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Analytical Core</h2>
            <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Professional Consultant v1.0</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={startLiveSession} className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest border-2 transition-all ${isLiveMode ? 'bg-red-600/10 text-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-blue-600 text-white border-transparent'}`}>
            {isLiveMode ? 'DISCONNECT ENGINE' : 'VOICE ENGINE'}
          </button>
          <button onClick={onBack} className="px-6 py-3 rounded-full font-black text-[10px] uppercase border border-white/10 hover:bg-white/5 transition-all">EXIT PROTOCOL</button>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-10 space-y-8 hide-scrollbar pb-44">
          {isLiveMode ? (
            <div className="h-full flex flex-col items-center justify-center space-y-16 animate-fade">
               <div className="relative">
                  <div className="w-56 h-56 rounded-full bg-blue-600/5 flex items-center justify-center">
                     <div className="w-40 h-40 rounded-full bg-blue-600 flex items-center justify-center animate-pulse shadow-[0_0_60px_rgba(37,99,235,0.6)] relative">
                        <span className="text-5xl">💎</span>
                        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
                     </div>
                  </div>
               </div>
               <div className="text-center space-y-3">
                  <h3 className="text-4xl font-black">Syncing...</h3>
                  <p className="text-xs font-bold opacity-30 uppercase tracking-[0.6em]">Consultant Voice Layer Active</p>
               </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-7 rounded-[2.5rem] text-[13px] font-bold leading-relaxed border ${
                    m.type === 'user' ? 'bg-blue-600 text-white border-blue-500 rounded-br-none shadow-xl' : 'bg-white/5 border-white/10 rounded-bl-none shadow-2xl backdrop-blur-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="animate-pulse flex space-x-2.5 p-5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div><div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div><div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div></div>}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!isLiveMode && (
          <div className="absolute bottom-0 left-0 right-0 p-10 backdrop-blur-3xl bg-black/40 border-t border-white/5">
            <form onSubmit={e => { e.preventDefault(); handleSendMessage(input); }} className="relative max-w-4xl mx-auto">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Engage Analytical Core..." className="w-full py-6 px-10 rounded-full bg-white/5 border border-white/10 outline-none font-black focus:border-blue-500/50 text-base shadow-2xl" />
              <button type="submit" className="absolute right-4 top-3 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">↑</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChat;
