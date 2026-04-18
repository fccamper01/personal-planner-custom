import { ViewType, ThemeType } from '../types';
import { LogOut, Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface IndexViewProps {
  onViewChange: (view: ViewType) => void;
  user: any;
  ownerName: string;
  onUpdateOwnerName: (name: string) => void;
  onLogout: () => void;
  theme: ThemeType;
  onUpdateTheme: (theme: ThemeType) => void;
}

export default function IndexView({ onViewChange, user, ownerName, onUpdateOwnerName, onLogout, theme, onUpdateTheme }: IndexViewProps) {
  const mainLinks = [
    { label: 'Current Checklist', target: 'current', color: '#b2d8e9' },
    { label: 'Cleaning Chores', target: 'chores', color: '#FFCC00' },
    { label: 'Yearly Planner', target: 'yearly', color: '#f9bcd3' },
    { label: 'Monthly Planners', target: 'monthly', color: '#d1c1dc' },
    { label: 'Weekly Planners', target: 'weekly', color: '#ffd9a1' },
    { label: 'Daily Planners', target: 'daily', color: '#b2d8e9' },
  ] as const;

  const secondaryLinks = [
    { label: 'Vision Boards', target: 'vision', color: '#b2d8e9' },
    { label: 'Study Plan', target: 'study', color: '#f9bcd3' },
    { label: 'Business Ideas', target: 'business', color: '#ffd9a1' },
    { label: 'Books', target: 'books', color: '#d1c1dc' },
    { label: 'TV', target: 'tv', color: '#b2d8e9' },
    { label: 'Notes', target: 'notes', color: '#f9bcd3' },
  ] as const;

  return (
    <div className="flex flex-col h-full space-y-12">
      <h1 className={cn(
        "text-6xl font-display font-black uppercase tracking-tighter transition-all duration-500",
        theme === 'dark' ? "text-white" : "text-black"
      )}>
        Home
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className={cn(
            "text-xl font-display font-black uppercase tracking-widest pl-4 transition-all duration-500",
            theme === 'dark' ? "text-[#FFCC00]" : "text-[#b2d8e9]"
          )}>Core Planning</h2>
          <nav className="flex flex-col gap-3">
            {mainLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onViewChange(link.target)}
                className={cn(
                  "group relative flex items-center p-6 border-4 rounded-[2rem] shadow-sm hover:translate-x-4 transition-all duration-300",
                  theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-[#FFF9F2]",
                  theme === 'medium' && "bg-white border-slate-200"
                )}
                id={`index-link-${link.target}`}
              >
                <div 
                  className={cn("absolute left-0 top-0 bottom-0 w-3 rounded-l-2xl transition-all group-hover:w-6", theme === 'dark' && "opacity-50")} 
                  style={{ backgroundColor: link.color }}
                />
                <span className={cn(
                  "text-2xl font-display font-black tracking-tight ml-4",
                  theme === 'dark' ? "text-white" : "text-slate-800"
                )}>
                  {link.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          <h2 className={cn(
            "text-xl font-display font-black uppercase tracking-widest pl-4 transition-all duration-500",
            theme === 'dark' ? "text-white/40" : "text-[#d1c1dc]"
          )}>Personal & Goals</h2>
          <nav className="flex flex-col gap-3">
            {secondaryLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => onViewChange(link.target)}
                className={cn(
                  "group relative flex items-center p-4 rounded-2xl border-2 transition-all duration-300",
                  theme === 'dark' ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-[#FFF9F2] border-white hover:bg-white hover:shadow-md",
                  theme === 'medium' && "bg-slate-50 border-slate-200 hover:bg-white"
                )}
                id={`index-link-${link.target}`}
              >
                <span className={cn(
                  "text-lg font-display font-bold tracking-tight ml-2",
                  theme === 'dark' ? "text-white/60 group-hover:text-white" : "text-slate-600"
                )}>
                  {link.label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer Controls / Logged In info */}
      <div className={cn(
        "rounded-[1.5rem] p-4 border-2 shadow-lg flex items-center justify-between mt-auto transition-all duration-500",
        theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white/80 backdrop-blur-md border-[#FFF9F2]",
        theme === 'medium' && "bg-white border-slate-200"
      )}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#ffd9a1] overflow-hidden border-2 border-white shadow-sm">
             <img src={user?.photoURL || "https://picsum.photos/seed/planner/100/100"} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col">
            <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0">LOGGED IN AS</span>
            <input
              value={ownerName}
              onChange={(e) => onUpdateOwnerName(e.target.value)}
              className={cn(
                "text-md font-display font-black leading-none bg-transparent border-none outline-none w-32",
                theme === 'dark' ? "text-white" : "text-black"
              )}
            />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center bg-slate-100 rounded-2xl p-1 border-2 border-white shadow-inner">
            {[
              { id: 'light', icon: Sun, label: 'LIGHT' },
              { id: 'medium', icon: Sparkles, label: 'MEDIUM' },
              { id: 'dark', icon: Moon, label: 'DARK' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdateTheme(t.id as ThemeType)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-1.5 rounded-xl transition-all font-display font-black text-[9px] uppercase tracking-wider",
                  theme === t.id 
                    ? "bg-white text-black shadow-sm scale-110" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <t.icon size={14} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-xl font-display font-black text-xs shadow-md shadow-black/20 hover:scale-105 active:scale-95 transition-all"
          >
            <LogOut size={16} />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
