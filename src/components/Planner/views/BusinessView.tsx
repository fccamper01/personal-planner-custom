import { Lightbulb, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ThemeType } from '../types';

interface BusinessViewProps {
  ideas: string[];
  onUpdate: (ideas: string[]) => void;
  theme: ThemeType;
}

export default function BusinessView({ ideas, onUpdate, theme }: BusinessViewProps) {
  const addIdea = () => {
    onUpdate([...ideas, '']);
  };

  const updateIdea = (idx: number, val: string) => {
    const newIdeas = [...ideas];
    newIdeas[idx] = val;
    onUpdate(newIdeas);
  };

  const removeIdea = (idx: number) => {
    onUpdate(ideas.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col h-full space-y-12">
      <div className="flex justify-between items-baseline">
        <h2 className={cn(
          "text-5xl font-display font-black uppercase tracking-tight transition-all duration-500",
          theme === 'dark' ? "text-white" : "text-black"
        )}>
          Business Ideas
        </h2>
        <span className={cn(
          "font-display font-black text-2xl uppercase transition-all",
          theme === 'dark' ? "text-[#FFCC00]" : "text-[#ffd9a1]"
        )}>Entrepreneur</span>
      </div>

      <div className={cn(
        "flex-1 p-10 rounded-[3rem] shadow-lg flex flex-col space-y-8 overflow-hidden transition-all duration-500 border-4",
        theme === 'light' && "bg-[#ffd9a1] border-white shadow-[#ffd9a1]/20",
        theme === 'dark' && "bg-white/5 border-white/10 shadow-none",
        theme === 'medium' && "bg-slate-50 border-slate-200 shadow-none"
      )}>
        <div className={cn(
          "flex items-center gap-4 transition-all duration-500",
          theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
        )}>
          <Lightbulb size={32} strokeWidth={3} />
          <p className="font-display font-black text-xl uppercase tracking-widest">The Next Big Thing...</p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pr-4 space-y-4">
          {ideas.length === 0 ? (
            <div className={cn(
              "h-64 flex flex-col items-center justify-center space-y-4 border-4 border-dashed rounded-[2rem] transition-all",
              theme === 'dark' ? "border-white/10 text-white/10" : "border-white/30 text-white/50"
            )}>
               <Lightbulb size={48} />
               <p className="font-display font-black text-lg uppercase">Start Brainstorming!</p>
            </div>
          ) : (
            ideas.map((idea, idx) => (
              <div key={idx} className={cn(
                "group flex gap-4 items-start p-6 rounded-[2rem] transition-all duration-500 border-2",
                theme === 'light' && "bg-white/20 border-white/20 hover:bg-white/30",
                theme === 'dark' && "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10",
                theme === 'medium' && "bg-white border-slate-200 shadow-sm"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-lg shrink-0 transition-all",
                  theme === 'dark' ? "bg-[#FFCC00] text-black" : "bg-white text-[#ffd9a1]"
                )}>
                  {idx + 1}
                </div>
                <textarea
                  value={idea}
                  onChange={(e) => updateIdea(idx, e.target.value)}
                  placeholder="Describe your brilliant idea..."
                  className={cn(
                    "flex-1 bg-transparent border-none outline-none font-sans font-bold text-lg resize-none pt-1 transition-all",
                    theme === 'dark' ? "text-white placeholder:text-white/10" : (theme === 'medium' ? "text-slate-600 placeholder:text-slate-300" : "text-white placeholder:text-white/40")
                  )}
                  rows={2}
                />
                <button 
                  onClick={() => removeIdea(idx)}
                  className={cn(
                    "p-2 transition-all opacity-0 group-hover:opacity-100",
                    theme === 'dark' ? "text-white/40 hover:text-white" : (theme === 'medium' ? "text-slate-300 hover:text-slate-600" : "text-white/40 hover:text-white")
                  )}
                >
                  <Trash2 size={24} />
                </button>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={addIdea}
          className={cn(
            "w-full py-6 rounded-[2rem] flex items-center justify-center gap-3 transition-all group shadow-xl",
            theme === 'light' && "bg-white text-[#ffd9a1] shadow-[#ffd9a1]/30 hover:scale-[1.02]",
            theme === 'dark' && "bg-[#FFCC00] text-black shadow-none hover:bg-[#FFCC00]/90",
            theme === 'medium' && "bg-slate-700 text-white shadow-none hover:bg-slate-800"
          )}
        >
          <Plus size={28} className="transition-transform group-hover:rotate-90" strokeWidth={3} />
          <span className="font-display font-black text-xl uppercase tracking-tighter">Add New Idea</span>
        </button>
      </div>

      <div className={cn(
        "p-6 rounded-[1.5rem] border-l-8 italic font-bold transition-all",
        theme === 'light' && "bg-[#ffd9a1]/10 border-[#ffd9a1] text-[#ffd9a1]",
        theme === 'dark' && "bg-white/5 border-[#FFCC00] text-white/60",
        theme === 'medium' && "bg-slate-50 border-slate-700 text-slate-500"
      )}>
        "Ideas are easy. Implementation is hard." — Guy Kawasaki
      </div>
    </div>
  );
}
