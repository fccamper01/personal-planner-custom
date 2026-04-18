import { cn } from '@/src/lib/utils';
import { PlannerData, ThemeType } from '../types';

interface StudyViewProps {
  data: PlannerData['study'];
  onUpdate: (fields: Partial<PlannerData['study']>) => void;
  theme: ThemeType;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STATUS_COLORS = {
  'To Start': 'bg-[#FFF9F2] text-[#d1c1dc]',
  'Ongoing': 'bg-[#b2d8e9] text-white',
  'Completed': 'bg-[#f9bcd3] text-white'
};

const STATUS_COLORS_DARK = {
  'To Start': 'bg-white/10 text-white/40',
  'Ongoing': 'bg-[#5BC0F8] text-black',
  'Completed': 'bg-[#FFCC00] text-black'
};

export default function StudyView({ data, onUpdate, theme }: StudyViewProps) {
  const toggleStatus = (idx: number) => {
    const newSubjects = [...data.subjects];
    const current = newSubjects[idx].status;
    const next: PlannerData['study']['subjects'][0]['status'] = 
      current === 'To Start' ? 'Ongoing' : 
      current === 'Ongoing' ? 'Completed' : 'To Start';
    newSubjects[idx].status = next;
    onUpdate({ subjects: newSubjects });
  };

  return (
    <div className="flex flex-col h-full space-y-12">
      <div className="flex justify-between items-baseline">
        <h2 className={cn(
          "text-5xl font-display font-black uppercase tracking-tight transition-all duration-500",
          theme === 'dark' ? "text-white" : "text-black"
        )}>
          Study Plan
        </h2>
        <span className={cn(
          "font-display font-black text-2xl uppercase transition-all",
          theme === 'dark' ? "text-[#5BC0F8]" : "text-[#b2d8e9]"
        )}>Focus</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Subject Tracker (Purple Bubble) */}
        <div className={cn(
          "p-8 rounded-[2.5rem] shadow-lg transition-all duration-500 border-4",
          theme === 'light' && "bg-[#d1c1dc] border-white shadow-[#d1c1dc]/20",
          theme === 'dark' && "bg-white/5 border-white/10",
          theme === 'medium' && "bg-white border-slate-200 shadow-none"
        )}>
          <h3 className={cn(
            "text-2xl font-display font-black uppercase tracking-tight mb-4 transition-all duration-500",
            theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
          )}>
            Subject Tracker
          </h3>
          <div className={cn(
            "rounded-[1.5rem] overflow-hidden transition-all duration-500",
            theme === 'light' && "bg-white/20",
            theme === 'dark' && "bg-white/5 border border-white/5",
            theme === 'medium' && "bg-slate-50 border border-slate-200"
          )}>
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className={cn(
                  "text-xs font-display font-black uppercase transition-all duration-500",
                  theme === 'light' && "bg-white/30 text-white",
                  theme === 'dark' && "bg-white/10 text-white/60",
                  theme === 'medium' && "bg-slate-200 text-slate-500"
                )}>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Topic</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className={cn(
                "divide-y transition-all duration-500",
                theme === 'light' && "divide-white/10",
                theme === 'dark' && "divide-white/5",
                theme === 'medium' && "divide-slate-200"
              )}>
                {data.subjects.map((subject, idx) => (
                  <tr key={idx} className={cn(
                    "group transition-colors",
                    theme === 'light' && "hover:bg-white/10",
                    theme === 'dark' && "hover:bg-white/5",
                    theme === 'medium' && "hover:bg-white"
                  )}>
                    <td className="px-6 py-4">
                      <input 
                        type="text"
                        value={subject.name}
                        onChange={(e) => {
                          const newSubs = [...data.subjects];
                          newSubs[idx].name = e.target.value;
                          onUpdate({ subjects: newSubs });
                        }}
                        className={cn(
                          "bg-transparent border-none outline-none text-sm font-sans font-bold w-full transition-all",
                          theme === 'dark' ? "text-white placeholder:text-white/10" : (theme === 'medium' ? "text-slate-600 placeholder:text-slate-300" : "text-white placeholder:text-white/40")
                        )}
                        placeholder="Name..."
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text"
                        value={subject.topic}
                        onChange={(e) => {
                          const newSubs = [...data.subjects];
                          newSubs[idx].topic = e.target.value;
                          onUpdate({ subjects: newSubs });
                        }}
                        className={cn(
                          "bg-transparent border-none outline-none text-xs w-full transition-all",
                          theme === 'dark' ? "text-white/40 placeholder:text-white/10" : (theme === 'medium' ? "text-slate-400 placeholder:text-slate-300" : "text-white/70 placeholder:text-white/30")
                        )}
                        placeholder="..."
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(idx)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-display font-black uppercase tracking-wider transition-all shadow-sm",
                          theme === 'dark' ? STATUS_COLORS_DARK[subject.status] : STATUS_COLORS[subject.status]
                        )}
                      >
                        {subject.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              onClick={() => onUpdate({ subjects: [...data.subjects, { name: '', status: 'To Start', topic: '' }] })}
              className={cn(
                "w-full py-4 text-xs font-display font-black uppercase tracking-widest transition-all",
                theme === 'dark' ? "text-white/40 hover:bg-white/5 hover:text-white" : (theme === 'medium' ? "text-slate-400 hover:bg-slate-200 text-slate-500" : "text-white/60 hover:bg-white/10 hover:text-white")
              )}
            >
              + New Subject
            </button>
          </div>
        </div>

        {/* Weekly Study Schedule (Orange Bubble) */}
        <div className={cn(
          "p-8 rounded-[2.5rem] shadow-lg transition-all duration-500 border-4",
          theme === 'light' && "bg-[#ffd9a1] border-white shadow-[#ffd9a1]/20",
          theme === 'dark' && "bg-white/5 border-white/10",
          theme === 'medium' && "bg-slate-100 border-slate-200 shadow-none"
        )}>
          <h3 className={cn(
            "text-2xl font-display font-black uppercase tracking-tight mb-4 transition-all duration-500",
            theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-700" : "text-white")
          )}>
            Weekly Schedule
          </h3>
          <div className="space-y-3">
            {DAYS.map(day => (
              <div key={day} className="flex gap-4 items-center">
                <div className={cn(
                  "w-24 text-[11px] font-display font-black uppercase tracking-wider transition-all",
                  theme === 'dark' ? "text-[#5BC0F8]" : (theme === 'medium' ? "text-slate-400" : "text-white")
                )}>
                  {day}
                </div>
                <input 
                  type="text"
                  value={data.schedule?.[day] || ''}
                  onChange={(e) => {
                    const newSched = { ...(data.schedule || {}) };
                    newSched[day] = e.target.value;
                    onUpdate({ schedule: newSched });
                  }}
                  className={cn(
                    "flex-1 border-b-2 rounded-xl px-4 py-2 font-sans font-bold transition-all duration-500 outline-none",
                    theme === 'light' && "bg-white/20 border-white/30 text-white placeholder:text-white/40 focus:bg-white/30 focus:border-white",
                    theme === 'dark' && "bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:bg-white/10 focus:border-white/30",
                    theme === 'medium' && "bg-white border-slate-200 text-slate-600 placeholder:text-slate-300 focus:border-slate-400 shadow-sm"
                  )}
                  placeholder="Study topic..."
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className={cn(
        "p-6 rounded-[1.5rem] border-l-8 italic font-bold transition-all",
        theme === 'light' && "bg-[#b2d8e9]/10 border-[#b2d8e9] text-[#b2d8e9]",
        theme === 'dark' && "bg-white/5 border-[#5BC0F8] text-white/60",
        theme === 'medium' && "bg-slate-50 border-slate-700 text-slate-500"
      )}>
         "Success is the sum of small efforts, repeated day in and day out."
      </div>
    </div>
  );
}
