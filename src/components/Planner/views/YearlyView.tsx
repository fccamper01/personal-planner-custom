import { cn } from '@/src/lib/utils';
import { ThemeType } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface YearlyViewProps {
  year: number;
  onMonthSelect: (month: number) => void;
  data?: { 
    months: { [monthIndex: number]: string[] }; 
    bucketList: string[]; 
    priorities: ({ text: string; completed: boolean } | string)[]; 
  };
  onUpdate: (year: string, updates: any) => void;
  theme: ThemeType;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function YearlyView({ year, onMonthSelect, data, onUpdate, theme }: YearlyViewProps) {
  const yearStr = year.toString();
  const months = data?.months || {};
  const bucketList = data?.bucketList || Array(5).fill('');
  const rawPriorities = data?.priorities || Array(5).fill({ text: '', completed: false });
  const priorities = rawPriorities.map(p => {
    if (typeof p === 'string') return { text: p, completed: false };
    return p;
  });
  
  return (
    <div className="flex flex-col h-full space-y-12">
      <div className="flex justify-between items-center">
        <h2 className={cn(
          "text-6xl font-display font-black tracking-tighter uppercase transition-all duration-500",
          theme === 'dark' ? "text-white" : "text-black"
        )}>
          Yearly Plan
        </h2>
        <span className={cn(
          "font-display font-black text-4xl transition-all",
          theme === 'dark' ? "text-[#5BC0F8]" : "text-[#b2d8e9]"
        )}>{year}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {MONTH_NAMES.map((month, mIdx) => {
          const lines = months[mIdx] || Array(6).fill('');
          const bgColor = ['#b2d8e9', '#f9bcd3', '#d1c1dc', '#ffd9a1'][mIdx % 4];
          
          return (
            <div key={month} className={cn(
              "flex flex-col rounded-[2rem] overflow-hidden border-4 transition-all duration-500 shadow-sm",
              theme === 'light' && "bg-[#FFF9F2] border-white",
              theme === 'dark' && "bg-white/5 border-white/10",
              theme === 'medium' && "bg-slate-50 border-slate-200"
            )}>
              <button 
                onClick={() => onMonthSelect(mIdx)}
                className="py-3 text-xs font-display font-black text-white uppercase tracking-wider text-center transition-all border-b-4 border-white"
                style={{ backgroundColor: theme === 'dark' ? '#1e1e1e' : bgColor, borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white' }}
              >
                {month}
              </button>
              <div className="flex-1 flex flex-col p-2 space-y-1">
                {Array.from({ length: 6 }).map((_, lIdx) => (
                   <input
                    key={lIdx}
                    type="text"
                    value={lines[lIdx] || ''}
                    onChange={(e) => onUpdate(yearStr, { monthIndex: mIdx, lineIndex: lIdx, value: e.target.value })}
                    className={cn(
                      "w-full px-3 py-1 text-xs font-sans font-bold transition-all duration-500 rounded-lg outline-none",
                      theme === 'light' && "text-[#5B4B8A] bg-white/50 focus:bg-white",
                      theme === 'dark' && "text-white/60 bg-white/5 focus:bg-white/20 focus:text-white",
                      theme === 'medium' && "text-slate-500 bg-white border border-slate-100 focus:border-slate-300",
                      "placeholder:opacity-0"
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Sections: Bucket List & Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <div className={cn(
          "p-8 rounded-[2.5rem] shadow-lg transition-all duration-500 border-4",
          theme === 'light' && "bg-[#f9bcd3] border-white shadow-[#f9bcd3]/20",
          theme === 'dark' && "bg-white/5 border-white/10",
          theme === 'medium' && "bg-slate-100 border-slate-200 shadow-none"
        )}>
          <h3 className={cn(
            "text-2xl font-display font-black uppercase tracking-tight mb-4 transition-all duration-500",
            theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
          )}>
            {year} Dreams
          </h3>
          <div className="space-y-2">
            {bucketList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className={cn(
                  "text-lg font-display font-black transition-all",
                  theme === 'dark' ? "text-white/20" : "text-white/50"
                )}>{idx + 1}</span>
                <input 
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newList = [...bucketList];
                    newList[idx] = e.target.value;
                    onUpdate(yearStr, { bucketList: newList });
                  }}
                  placeholder="Dream big..."
                  className={cn(
                    "flex-1 border-b-2 rounded-xl px-4 py-2 font-sans font-bold transition-all duration-500 outline-none",
                    theme === 'light' && "bg-white/20 border-white/30 text-white placeholder:text-white/40 focus:bg-white/30 focus:border-white",
                    theme === 'dark' && "bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-white/30",
                    theme === 'medium' && "bg-white border-slate-200 text-slate-600 placeholder:text-slate-300 focus:border-slate-400"
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={cn(
          "p-8 rounded-[2.5rem] shadow-lg flex flex-col transition-all duration-500 border-4",
          theme === 'light' && "bg-[#d1c1dc] border-white shadow-[#d1c1dc]/20",
          theme === 'dark' && "bg-white/5 border-white/10",
          theme === 'medium' && "bg-white border-slate-200 shadow-none"
        )}>
           <h3 className={cn(
            "text-2xl font-display font-black uppercase tracking-tight mb-4 transition-all duration-500",
            theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
          )}>
            Yearly Priorities
          </h3>
          <div className="space-y-2">
            {priorities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    const newList = [...priorities];
                    newList[idx] = { ...item, completed: !item.completed };
                    onUpdate(yearStr, { priorities: newList });
                  }}
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all",
                    item.completed ? "bg-green-500 border-green-500 text-white" : (theme === 'dark' ? "border-white/20 bg-white/5" : "border-white/50 bg-white/30")
                  )}
                >
                  {item.completed && <CheckCircle2 size={16} className="stroke-[4]" />}
                </button>
                <input 
                  type="text"
                  value={item.text}
                  onChange={(e) => {
                    const newList = [...priorities];
                    newList[idx] = { ...item, text: e.target.value };
                    onUpdate(yearStr, { priorities: newList });
                  }}
                  placeholder="Focus area..."
                  className={cn(
                    "flex-1 border-b-2 rounded-xl px-4 py-2 font-sans font-bold transition-all duration-500 outline-none",
                    theme === 'light' && "bg-white/20 border-white/30 text-white placeholder:text-white/40 focus:bg-white/30 focus:border-white",
                    theme === 'dark' && "bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-white/30",
                    theme === 'medium' && "bg-slate-50 border-slate-100 text-slate-600 placeholder:text-slate-300 focus:bg-white",
                    item.completed && "opacity-50 line-through"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
