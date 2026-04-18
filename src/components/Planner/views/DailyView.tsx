import { cn } from '@/src/lib/utils';
import { Clock, ListTodo, Quote, CheckCircle2, Circle, Trash2, Repeat } from 'lucide-react';
import { Task, ThemeType } from '../types';
import { format } from 'date-fns';

interface DailyViewProps {
  date: string;
  tasks: Task[];
  onToggleTask: (id: string, date: string) => void;
  onDeleteTask: (id: string) => void;
  data: { reflection: string; notes: string; timeline: { [hour: number]: string } };
  onUpdate: (fields: Partial<DailyViewProps['data']>) => void;
  theme: ThemeType;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

export default function DailyView({ date, tasks, onToggleTask, onDeleteTask, data, onUpdate, theme }: DailyViewProps) {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('default', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  const dateKey = format(dateObj, 'yyyy-MM-dd');

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-2 no-scrollbar space-y-10">
      <div className="flex justify-between items-baseline">
        <h2 className={cn(
          "text-5xl font-display font-black uppercase tracking-tight transition-all duration-500",
          theme === 'dark' ? "text-white" : "text-black"
        )}>
          {formattedDate}
        </h2>
        <span className={cn(
          "font-display font-black text-3xl transition-all",
          theme === 'dark' ? "text-[#FFCC00]" : "text-[#ffd9a1]"
        )}>Daily</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Tasks & Timeline */}
        <div className="space-y-10">
          {/* Tasks Section (Pink Bubble) */}
          <section className={cn(
            "p-8 rounded-[2.5rem] shadow-lg transition-all duration-500 border-4",
            theme === 'light' && "bg-[#f9bcd3] border-white shadow-[#f9bcd3]/20",
            theme === 'dark' && "bg-white/5 border-white/10 shadow-none",
            theme === 'medium' && "bg-slate-100 border-slate-200 shadow-none"
          )}>
            <h3 className={cn(
              "text-2xl font-display font-black uppercase tracking-tight mb-6 flex items-center gap-2 transition-all duration-500",
              theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
            )}>
              <ListTodo size={24} strokeWidth={3} />
              To Do List
            </h3>
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className={cn(
                  "py-8 rounded-2xl flex flex-col items-center justify-center font-bold transition-all",
                  theme === 'dark' ? "bg-white/10 text-white/40" : "bg-white/20 text-white opacity-60"
                )}>
                   <span className="text-xs uppercase tracking-widest">Nothing planned!</span>
                </div>
              ) : (
                tasks.map(task => {
                  const isCompleted = task.completedDates.includes(dateKey);
                  return (
                    <div 
                      key={task.id} 
                      className={cn(
                        "group flex items-center gap-4 p-4 rounded-2xl transition-all duration-500",
                        theme === 'light' && (isCompleted && "bg-white/40 shadow-sm"),
                        theme === 'light' && (!isCompleted && "bg-white/20"),
                        theme === 'dark' && (isCompleted ? "bg-white/10" : "bg-white/5 border border-white/5"),
                        theme === 'medium' && (isCompleted ? "bg-slate-200" : "bg-white border border-slate-200")
                      )}
                    >
                      <button 
                        onClick={() => onToggleTask(task.id, date)}
                        className={cn(
                          "w-6 h-6 rounded-lg border-2 transition-all appearance-none cursor-pointer flex items-center justify-center",
                          theme === 'light' && (isCompleted ? "bg-white border-white text-[#f9bcd3]" : "bg-white/10 border-white/50 text-white"),
                          theme === 'dark' && (isCompleted ? "bg-[#FFCC00] border-[#FFCC00] text-black" : "bg-transparent border-white/20 text-white"),
                          theme === 'medium' && (isCompleted ? "bg-slate-400 border-slate-400 text-white" : "bg-white border-slate-200 text-slate-400")
                        )}
                      >
                        {isCompleted && <CheckCircle2 size={16} />}
                      </button>
                      
                      <div className="flex-1">
                        <div className={cn(
                          "font-sans font-bold transition-all duration-500",
                          theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-600" : "text-white"),
                          isCompleted && "line-through opacity-60 text-black/40"
                        )}>
                          {task.title}
                        </div>
                      </div>

                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className={cn(
                          "opacity-0 group-hover:opacity-100 p-2 transition-all",
                          theme === 'dark' ? "text-white/30 hover:text-white" : "text-white/50 hover:text-white"
                        )}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Timeline Section (Orange Bubble) */}
          <section className={cn(
            "p-8 rounded-[2.5rem] shadow-lg transition-all duration-500 border-4",
            theme === 'light' && "bg-[#ffd9a1] border-white shadow-[#ffd9a1]/20",
            theme === 'dark' && "bg-white/5 border-white/10 shadow-none",
            theme === 'medium' && "bg-slate-50 border-slate-200 shadow-none"
          )}>
            <h3 className={cn(
              "text-2xl font-display font-black uppercase tracking-tight mb-6 flex items-center gap-2 transition-all duration-500",
              theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
            )}>
              <Clock size={24} strokeWidth={3} />
              Schedule
            </h3>
            <div className="space-y-2">
              {HOURS.map(hour => (
                <div key={hour} className="flex gap-4 items-center group">
                  <div className={cn(
                    "w-16 text-[11px] font-display font-black uppercase tracking-wider transition-all duration-500",
                    theme === 'dark' ? "text-[#FFCC00]" : (theme === 'medium' ? "text-slate-400" : "text-white")
                  )}>
                    {hour > 12 ? `${hour - 12} PM` : `${hour} ${hour === 12 ? 'PM' : 'AM'}`}
                  </div>
                  <div className="flex-1">
                     <input
                      type="text"
                      className={cn(
                        "w-full rounded-xl px-4 py-2 border-b-2 font-sans font-bold transition-all duration-500 outline-none",
                        theme === 'light' && "bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white",
                        theme === 'dark' && "bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-white/30",
                        theme === 'medium' && "bg-white border-slate-200 text-slate-600 placeholder:text-slate-300 focus:bg-slate-50 focus:border-slate-400"
                      )}
                      placeholder="..."
                      value={data.timeline?.[hour] || ''}
                      onChange={(e) => {
                        onUpdate({
                          timeline: {
                            ...(data.timeline || {}),
                            [hour]: e.target.value
                          }
                        });
                      }}
                     />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Reflection & Notes */}
        <div className="space-y-10">
          {/* Reflection Section (Purple Bubble) */}
          <section className={cn(
            "p-8 rounded-[2.5rem] shadow-lg flex flex-col transition-all duration-500 border-4",
            theme === 'light' && "bg-[#d1c1dc] border-white shadow-[#d1c1dc]/20",
            theme === 'dark' && "bg-white/5 border-white/10 shadow-none",
            theme === 'medium' && "bg-slate-50 border-slate-200 shadow-none"
          )}>
            <h3 className={cn(
              "text-2xl font-display font-black uppercase tracking-tight mb-6 flex items-center gap-2 transition-all duration-500",
              theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
            )}>
              <Quote size={24} strokeWidth={3} />
              Daily Reflection
            </h3>
            <textarea
              value={data.reflection}
              onChange={(e) => onUpdate({ reflection: e.target.value })}
              placeholder="What made you happy today?"
              className={cn(
                "w-full h-32 rounded-2xl p-6 font-sans font-bold transition-all duration-500 outline-none resize-none text-center italic",
                theme === 'light' && "bg-white/20 text-white placeholder:text-white/50 focus:bg-white/30",
                theme === 'dark' && "bg-white/5 text-white border border-white/10 placeholder:text-white/10 focus:bg-white/10",
                theme === 'medium' && "bg-white text-slate-500 border border-slate-200 placeholder:text-slate-300 focus:bg-slate-50"
              )}
            />
          </section>

          {/* Notes Section (Blue Bubble) */}
          <section className={cn(
            "p-8 rounded-[2.5rem] shadow-lg flex flex-col flex-1 transition-all duration-500 border-4",
            theme === 'light' && "bg-[#b2d8e9] border-white shadow-[#b2d8e9]/20",
            theme === 'dark' && "bg-white/5 border-white/10 shadow-none",
            theme === 'medium' && "bg-white border-slate-200 shadow-none"
          )}>
            <h3 className={cn(
              "text-2xl font-display font-black uppercase tracking-tight mb-6 transition-all duration-500",
              theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
            )}>
              Notes & Thoughts
            </h3>
            <textarea
              value={data.notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Brain dump here..."
              className={cn(
                "w-full min-h-[400px] flex-1 rounded-2xl p-8 font-display text-lg outline-none resize-none leading-relaxed transition-all duration-500",
                theme === 'light' && "bg-white/20 text-white placeholder:text-white/50 focus:bg-white/30",
                theme === 'dark' && "bg-white/5 text-white border border-white/10 placeholder:text-white/10 focus:bg-white/10",
                theme === 'medium' && "bg-slate-50 text-slate-600 border border-slate-100 placeholder:text-slate-300 focus:bg-white shadow-inner"
              )}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
