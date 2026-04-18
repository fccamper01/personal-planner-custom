import { useMemo } from 'react';
import { cn } from '@/src/lib/utils';
import { Task, ThemeType } from '../types';

interface MonthlyViewProps {
  month: number;
  year?: number;
  onDateSelect: (date: string) => void;
  tasks: Task[];
  getTasksForDate: (date: Date) => Task[];
  data: { goals: string[]; focus: string };
  onUpdate: (fields: Partial<MonthlyViewProps['data']>) => void;
  theme: ThemeType;
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function MonthlyView({ 
  month, 
  year = 2026, 
  onDateSelect, 
  tasks, 
  getTasksForDate,
  data,
  onUpdate,
  theme
}: MonthlyViewProps) {
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding for start of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }
    return days;
  }, [month, year]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-baseline mb-10">
        <h2 className={cn(
          "text-5xl font-display font-black uppercase tracking-tight transition-all duration-500",
          theme === 'dark' ? "text-white" : "text-black"
        )}>
          {new Date(year, month).toLocaleString('default', { month: 'long' })}
        </h2>
        <span className={cn(
          "font-display font-black text-3xl transition-all",
          theme === 'dark' ? "text-[#5BC0F8]" : "text-[#b2d8e9]"
        )}>{year}</span>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-10">
        {DAYS.map(day => (
          <div key={day} className={cn(
            "text-center text-xs font-display font-black tracking-widest transition-all duration-500",
            theme === 'dark' ? "text-white/40" : "text-[#b2d8e9]"
          )}>
            {day}
          </div>
        ))}
        {calendarDays.map((day, idx) => {
          const date = day ? new Date(year, month, day) : null;
          const dayTasks = date ? getTasksForDate(date) : [];
          
          return (
            <div 
              key={idx} 
              className={cn(
                  "aspect-square p-2 rounded-2xl transition-all duration-500 flex flex-col items-center justify-center relative",
                  day 
                    ? (theme === 'dark' ? "bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 cursor-pointer shadow-sm" : "bg-[#b2d8e9]/10 hover:bg-[#b2d8e9]/30 cursor-pointer shadow-sm") 
                    : "bg-transparent"
              )}
              onClick={() => day && onDateSelect(date!.toISOString())}
              id={day ? `date-${year}-${month + 1}-${day}` : undefined}
            >
              {day && (
                <>
                  <span className={cn(
                    "text-lg font-display font-bold transition-all",
                    theme === 'dark' ? "text-white" : "text-[#b2d8e9]"
                  )}>{day}</span>
                  {dayTasks.length > 0 && (
                    <div className="absolute bottom-2 flex gap-0.5">
                      {dayTasks.slice(0, 3).map((t) => (
                        <div 
                          key={t.id} 
                          className={cn("w-1.5 h-1.5 rounded-full", theme === 'dark' ? "bg-[#FFCC00]" : "bg-[#f9bcd3]")}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Monthly Summary Section */}
      <div className="mt-auto grid grid-cols-2 gap-10">
        <div className={cn(
          "p-8 rounded-[2.5rem] shadow-lg transition-all duration-500 border-4",
          theme === 'light' && "bg-[#f9bcd3] border-white shadow-[#f9bcd3]/20",
          theme === 'dark' && "bg-white/5 border-white/10 shadow-none",
          theme === 'medium' && "bg-slate-100 border-slate-200 shadow-none"
        )}>
          <h3 className={cn(
            "text-2xl font-display font-black uppercase tracking-tight mb-4 transition-all duration-500",
            theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
          )}>
            Monthly Goals
          </h3>
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  className={cn(
                    "w-6 h-6 rounded-lg border-2 transition-all appearance-none cursor-pointer",
                    theme === 'light' && "border-white/50 bg-white/20 checked:bg-white checked:border-white",
                    theme === 'dark' && "border-white/10 bg-white/5 checked:bg-[#FFCC00] checked:border-[#FFCC00]",
                    theme === 'medium' && "border-slate-300 bg-white checked:bg-slate-500 checked:border-slate-500"
                  )}
                />
                <input
                  type="text"
                  value={data.goals?.[i] || ''}
                  onChange={(e) => {
                    const newGoals = [...(data.goals || ['', '', ''])];
                    newGoals[i] = e.target.value;
                    onUpdate({ goals: newGoals });
                  }}
                  className={cn(
                    "bg-transparent border-b-2 flex-1 font-sans font-bold transition-all duration-500 outline-none",
                    theme === 'light' && "border-white/30 text-white placeholder:text-white/50 focus:border-white",
                    theme === 'dark' && "border-white/10 text-white placeholder:text-white/10 focus:border-white/30",
                    theme === 'medium' && "border-slate-200 text-slate-600 placeholder:text-slate-300 focus:border-slate-400"
                  )}
                  placeholder={`Write goal ${i + 1}...`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={cn(
          "p-8 rounded-[2.5rem] shadow-lg flex flex-col transition-all duration-500 border-4",
          theme === 'light' && "bg-[#d1c1dc] border-white shadow-[#d1c1dc]/20",
          theme === 'dark' && "bg-white/5 border-white/10 shadow-none",
          theme === 'medium' && "bg-white border-slate-200 shadow-none"
        )}>
          <h3 className={cn(
            "text-2xl font-display font-black uppercase tracking-tight mb-4 transition-all duration-500",
            theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
          )}>
            Main Focus
          </h3>
          <textarea
            value={data.focus}
            onChange={(e) => onUpdate({ focus: e.target.value })}
            placeholder="What matters most?"
            className={cn(
              "w-full flex-1 rounded-2xl p-4 font-sans font-bold transition-all duration-500 outline-none resize-none",
              theme === 'light' && "bg-white/20 text-white placeholder:text-white/50 focus:bg-white/30",
              theme === 'dark' && "bg-white/5 text-white border border-white/10 placeholder:text-white/10 focus:bg-white/10",
              theme === 'medium' && "bg-slate-50 text-slate-500 border border-slate-100 placeholder:text-slate-300 shadow-inner"
            )}
          />
        </div>
      </div>
    </div>
  );
}
