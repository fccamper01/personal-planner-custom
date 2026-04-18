import { ReactNode } from 'react';
import { 
  Home, 
  Target, 
  GraduationCap, 
  Lightbulb,
  Zap, 
  Bookmark, 
  Tv, 
  FileText,
  Sparkles,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType, ThemeType } from './types';
import { cn } from '@/src/lib/utils';

interface PlannerLayoutProps {
  children: ReactNode;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  activeMonth?: number;
  onMonthChange?: (month: number) => void;
  ownerName?: string;
  onUpdateOwnerName?: (name: string) => void;
  theme?: ThemeType;
}

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

const TAB_COLORS = [
  '#b2d8e9', // JAN
  '#f9bcd3', // FEB
  '#d1c1dc', // MAR
  '#ffd9a1', // APR
  '#b2d8e9', // MAY
  '#f9bcd3', // JUN
  '#d1c1dc', // JUL
  '#ffd9a1', // AUG
  '#b2d8e9', // SEP
  '#f9bcd3', // OCT
  '#d1c1dc', // NOV
  '#ffd9a1'  // DEC
];

const ICONS = [
  { id: 'index', icon: Home },
  { id: 'current', icon: Zap },
  { id: 'chores', icon: Sparkles },
  { id: 'projects', icon: FolderOpen },
  { id: 'vision', icon: Target },
  { id: 'study', icon: GraduationCap },
  { id: 'business', icon: Lightbulb },
  { id: 'books', icon: Bookmark },
  { id: 'tv', icon: Tv },
  { id: 'notes', icon: FileText },
];

export default function PlannerLayout({ 
  children, 
  activeView, 
  onViewChange,
  activeMonth = 0,
  onMonthChange,
  ownerName = '',
  onUpdateOwnerName,
  theme = 'light'
}: PlannerLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans transition-colors duration-500 theme-transition",
      theme === 'light' && "bg-[#FFF9F2]",
      theme === 'dark' && "bg-[#0A0A0A]",
      theme === 'medium' && "bg-[#E2E8F0]"
    )}>
      {/* Immersive Main UI Container */}
      <div className={cn(
        "relative w-full flex-1 flex flex-col overflow-hidden transition-all duration-500",
        theme === 'light' && "bg-white",
        theme === 'dark' && "bg-[#1A1A1A]",
        theme === 'medium' && "bg-[#F8FAFC]"
      )}>
        
        {/* Content Page (Full Width) */}
        <div className={cn(
          "flex-1 relative p-6 md:p-12 lg:p-16 flex flex-col overflow-auto custom-scrollbar transition-colors duration-500",
          theme === 'light' && "text-slate-800",
          theme === 'dark' && "text-white",
          theme === 'medium' && "text-slate-700"
        )}>
          {/* Top Navigation Icons */}
          <div className="flex justify-center md:justify-end space-x-4 md:space-x-6 mb-8 md:mb-12">
            {ICONS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id as ViewType)}
                className={cn(
                  "p-3 md:p-4 transition-all duration-300 rounded-[1.5rem]",
                  activeView === id 
                    ? (theme === 'dark' ? 'text-black bg-[#FFCC00] scale-110 shadow-lg' : 'text-white bg-[#b2d8e9] scale-110 shadow-lg')
                    : (theme === 'dark' ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-[#d1c1dc] hover:text-[#b2d8e9] hover:bg-[#b2d8e9]/10')
                )}
              >
                <Icon size={28} className="md:w-8 md:h-8" strokeWidth={2.5} />
              </button>
            ))}
          </div>

          {/* Actual Content Area */}
          <div className="flex-1 relative overflow-visible font-sans w-full max-w-6xl mx-auto h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView + (activeMonth ?? '')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full w-full flex-1"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className={cn(
        "fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full filter blur-[120px] pointer-events-none transition-colors duration-500",
        theme === 'light' && "bg-[#f9bcd3]/20",
        theme === 'dark' && "bg-[#FFCC00]/10",
        theme === 'medium' && "bg-slate-300/20"
      )} />
      <div className={cn(
        "fixed bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full filter blur-[100px] pointer-events-none transition-colors duration-500",
        theme === 'light' && "bg-[#b2d8e9]/20",
        theme === 'dark' && "bg-white/5",
        theme === 'medium' && "bg-slate-400/20"
      )} />
    </div>
  );
}
