import { cn } from '@/src/lib/utils';
import { ThemeType } from '../types';

interface WeeklyViewProps {
  date: string; // Any date within that week
  data: { 
    focus: string; 
    goals: string[]; 
    review: string; 
    habits: { name: string; checked: boolean[] }[] 
  };
  onUpdate: (fields: Partial<WeeklyViewProps['data']>) => void;
  theme: ThemeType;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklyView({ date, data, onUpdate, theme }: WeeklyViewProps) {
  const toggleHabit = (habitIdx: number, dayIdx: number) => {
    const newHabits = [...data.habits];
    const newChecked = [...newHabits[habitIdx].checked];
    newChecked[dayIdx] = !newChecked[dayIdx];
    newHabits[habitIdx] = { ...newHabits[habitIdx], checked: newChecked };
    onUpdate({ habits: newHabits });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 mr-8">
           <input 
            type="text"
            value={data.focus}
            onChange={(e) => onUpdate({ focus: e.target.value })}
            placeholder="Weekly Focus..."
            className={cn(
              "text-3xl font-black uppercase tracking-tighter bg-transparent border-none outline-none w-full transition-all duration-500",
              theme === 'dark' ? "text-white placeholder:text-white/10" : "text-[#8E7AB5] placeholder:text-[#8E7AB5]/20"
            )}
          />
          <div className={cn(
            "text-[10px] font-bold uppercase tracking-[0.3em] mt-1 transition-all",
            theme === 'dark' ? "text-white/40" : "text-[#B8A9D1]"
          )}>
            Week 16 • April 2026
          </div>
        </div>
        <div className="text-right w-48">
           <div className={cn(
             "text-xs font-black uppercase tracking-widest mb-3 transition-all",
             theme === 'dark' ? "text-[#FFCC00]" : "text-[#8E7AB5]"
           )}>Top 3 Goals</div>
           <div className="space-y-1">
             {[0, 1, 2].map(i => (
               <input 
                key={i}
                type="text"
                value={data.goals[i] || ''}
                onChange={(e) => {
                  const newGoals = [...data.goals];
                  newGoals[i] = e.target.value;
                  onUpdate({ goals: newGoals });
                }}
                className={cn(
                  "w-full bg-transparent border-b text-[10px] text-right outline-none transition-all duration-500",
                  theme === 'dark' ? "border-white/10 text-white placeholder:text-white/20" : "border-[#F0EBF5] text-[#5B4B8A] placeholder:text-[#B8A9D1]/30"
                )}
                placeholder={`Goal ${i + 1}`}
               />
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        {WEEKDAYS.map((day, idx) => (
          <div key={day} className={cn(
            "border-2 rounded-xl p-4 flex flex-col transition-all duration-500 group",
            theme === 'light' && "bg-white border-[#F9F7FC] hover:border-[#D8CFE5]",
            theme === 'dark' && "bg-white/5 border-white/10 hover:border-white/20",
            theme === 'medium' && "bg-white border-slate-200"
          )}>
            <div className="flex justify-between items-center mb-3">
              <span className={cn(
                "text-xs font-black uppercase transition-all",
                theme === 'dark' ? "text-[#5BC0F8]" : "text-[#8E7AB5]"
              )}>{day}</span>
              <span className={cn(
                "text-lg font-black transition-colors",
                theme === 'dark' ? "text-white/20 group-hover:text-white" : "text-[#B8A9D1]/30 group-hover:text-[#B8A9D1]"
              )}>
                {13 + idx}
              </span>
            </div>
            <div className="flex-1 space-y-2 opacity-30 select-none pointer-events-none">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-2">
                   <div className={cn("w-3 h-3 rounded-sm border flex-shrink-0", theme === 'dark' ? "border-white/10" : "border-[#F0EBF5]")} />
                   <div className={cn("h-[1px] flex-1", theme === 'dark' ? "bg-white/10" : "bg-[#F0EBF5]")} />
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Habit Tracker Section */}
        <div className={cn(
          "border-2 border-dashed rounded-xl p-4 flex flex-col transition-all duration-500",
          theme === 'light' && "bg-[#D8CFE5]/20 border-[#D8CFE5]",
          theme === 'dark' && "bg-white/5 border-white/10",
          theme === 'medium' && "bg-slate-50 border-slate-200"
        )}>
          <span className={cn(
            "text-xs font-black uppercase mb-4 transition-all",
            theme === 'dark' ? "text-[#FFCC00]" : "text-[#8E7AB5]"
          )}>Habit Tracker</span>
          <div className="space-y-4">
            {(data.habits || []).map((habit, hIdx) => (
              <div key={hIdx} className="space-y-1">
                <input
                  value={habit.name}
                  onChange={(e) => {
                    const newHabits = [...(data.habits || [])];
                    newHabits[hIdx].name = e.target.value;
                    onUpdate({ habits: newHabits });
                  }}
                  className={cn(
                    "text-[10px] font-bold bg-transparent border-none outline-none w-full transition-all",
                    theme === 'dark' ? "text-white" : "text-[#8E7AB5]"
                  )}
                />
                <div className="flex gap-1.5">
                  {(habit.checked || []).map((isDone, dIdx) => (
                    <button 
                      key={dIdx} 
                      onClick={() => toggleHabit(hIdx, dIdx)}
                      className={cn(
                        "w-4 h-4 rounded-full border-2 transition-all shadow-sm",
                        isDone 
                          ? (theme === 'dark' ? "bg-[#FFCC00] border-[#FFCC00]" : "bg-[#5B4B8A] border-[#5B4B8A]") 
                          : (theme === 'dark' ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-white border-[#D8CFE5] hover:border-[#B8A9D1]")
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={cn(
        "p-4 rounded-xl border transition-all duration-500",
        theme === 'light' && "bg-[#F9F7FC] border-[#EBE4F3]",
        theme === 'dark' && "bg-white/5 border-white/10",
        theme === 'medium' && "bg-slate-100 border-slate-200"
      )}>
         <h4 className={cn(
           "text-[10px] font-black uppercase mb-2 transition-all",
           theme === 'dark' ? "text-[#FFCC00]" : "text-[#8E7AB5]"
         )}>Weekly Review / Notes</h4>
         <textarea
            value={data.review}
            onChange={(e) => onUpdate({ review: e.target.value })}
            className={cn(
              "w-full h-16 bg-transparent border-none outline-none text-xs resize-none placeholder:text-[#B8A9D1]/30 font-display leading-relaxed transition-all",
              theme === 'dark' ? "text-white" : "text-[#5B4B8A]"
            )}
            placeholder="Focus on the wins this week..."
         />
      </div>
    </div>
  );
}
