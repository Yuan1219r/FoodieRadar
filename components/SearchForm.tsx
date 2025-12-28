import React, { useState, useRef } from 'react';
import { Search, MapPin, Mic, Square, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { SearchParams } from '../types';
import { BUDGET_OPTIONS, QUICK_CATEGORIES } from '../constants';
import { transcribeAudio } from '../services/geminiService';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [params, setParams] = useState<SearchParams>({
    location: '',
    query: '',
    budget: '',
    filters: '',
    voiceInstruction: ''
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const getLocation = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({ code: 0, message: "Browser not supported" });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(`${position.coords.latitude}, ${position.coords.longitude}`),
        (error) => reject(error),
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
      );
    });
  };

  const handleLocate = async () => {
    setIsLocating(true);
    try {
      const loc = await getLocation();
      setParams(prev => ({ ...prev, location: loc }));
      return loc;
    } catch (error) {
      alert("無法取得目前位置，請手動輸入。");
      return null;
    } finally {
      setIsLocating(false);
    }
  };

  const toggleVoice = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setIsProcessingAudio(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];
            const text = await transcribeAudio(base64, mimeType);
            if (text) {
              const locationToUse = params.location || await getLocation().catch(() => '');
              const newParams = { ...params, voiceInstruction: text, location: locationToUse };
              setParams(newParams);
              if (locationToUse) onSearch(newParams);
            }
          };
        } finally {
          setIsProcessingAudio(false);
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("請允許麥克風權限以使用語音搜尋。");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  const handleChange = (field: keyof SearchParams, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryClick = async (categoryValue: string) => {
    let loc = params.location || await getLocation().catch(() => '');
    if (!loc) { alert("請先開啟定位或輸入地址。"); return; }
    const newParams = { ...params, location: loc, query: categoryValue, budget: '', filters: '', voiceInstruction: '' };
    setParams(newParams);
    onSearch(newParams);
  };

  return (
    <div className="liquid-glass rounded-[40px] p-8 md:p-10 w-full relative group">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[42px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

      {/* Logo Section */}
      <div className="flex justify-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4 text-white drop-shadow-lg">
          <span className="text-primary brightness-110">Ψ</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">(￣▽￣)</span>
          <span className="text-primary brightness-110">Ψ</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* Address Input */}
        <div className="relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/70">
            <MapPin size={22} />
          </div>
          <input
            ref={locationInputRef}
            type="text"
            value={params.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="在哪個地段找吃的？"
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-14 pr-14 text-white placeholder-white/30 focus:bg-white/10 focus:border-primary/50 outline-none transition-all"
            required
          />
          <button
            type="button"
            onClick={handleLocate}
            disabled={isLocating}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-2xl hover:bg-primary/20 text-white/50 hover:text-primary transition-all"
          >
            {isLocating ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40">
               <Search size={20} />
             </div>
             <input
              type="text"
              value={params.query}
              onChange={(e) => handleChange('query', e.target.value)}
              placeholder="關鍵字 (拉麵、居酒屋...)"
              className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-14 pr-4 text-white placeholder-white/30 focus:bg-white/10 focus:border-primary/50 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={params.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 px-6 text-white appearance-none focus:bg-white/10 focus:border-primary/50 outline-none transition-all cursor-pointer"
            >
              {BUDGET_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-secondary">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30" />
          </div>
        </div>

        {/* Voice Feature */}
        <div className="relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary animate-pulse">
            <Sparkles size={18} />
          </div>
          <input
            type="text"
            value={params.voiceInstruction}
            onChange={(e) => handleChange('voiceInstruction', e.target.value)}
            placeholder="語音許願池...點擊右側說『要好停車的燒肉』"
            className="w-full bg-primary/5 border border-primary/20 rounded-3xl py-5 pl-14 pr-16 text-primary placeholder-primary/40 focus:bg-primary/10 outline-none transition-all"
          />
          <button
            type="button"
            onClick={toggleVoice}
            disabled={isProcessingAudio}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all ${
              isRecording ? 'bg-red-500 scale-110 shadow-lg' : 'bg-primary/20 text-primary hover:scale-105'
            }`}
          >
            {isProcessingAudio ? <Loader2 size={20} className="animate-spin" /> : isRecording ? <Square size={16} fill="white" /> : <Mic size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || isRecording}
          className="w-full h-16 rounded-3xl bg-gradient-to-r from-primary to-primary-dark text-white font-black text-xl shadow-lg hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <><Search size={24} /> 啟動探索</>}
        </button>
      </form>

      {/* Quick Access */}
      <div className="mt-10 pt-8 border-t border-white/10">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => handleCategoryClick(cat.value)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-2 group"
            >
              <span className="text-3xl filter drop-shadow-md group-hover:scale-125 transition-transform duration-300">{cat.icon}</span>
              <span className="text-[10px] text-white/40 group-hover:text-primary font-bold tracking-wider">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};