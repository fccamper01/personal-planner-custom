/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import PlannerLayout from './components/Planner/PlannerLayout';
import IndexView from './components/Planner/views/IndexView';
import CurrentView from './components/Planner/views/CurrentView';
import YearlyView from './components/Planner/views/YearlyView';
import MonthlyView from './components/Planner/views/MonthlyView';
import WeeklyView from './components/Planner/views/WeeklyView';
import DailyView from './components/Planner/views/DailyView';
import StudyView from './components/Planner/views/StudyView';
import BusinessView from './components/Planner/views/BusinessView';
import VisionView from './components/Planner/views/VisionView';
import ChoresView from './components/Planner/views/ChoresView';
import NotesView from './components/Planner/views/NotesView';
import ProjectsView from './components/Planner/views/ProjectsView';
import { ViewType } from './components/Planner/types';
import { useTasks } from './components/Planner/useTasks';
import { usePlannerData, INITIAL_DATA } from './components/Planner/usePlannerData';
import TaskDialog from './components/Planner/TaskDialog';
import { Plus, Sparkles, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import { loginWithGoogle, logout } from './lib/firebase';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('index');
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [activeDate, setActiveDate] = useState(new Date().toISOString());
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const { data, loading, user, updateOwnerName, updateYearly, updateMonthly, updateWeekly, updateDaily, updateCurrent, updateStudy, updateBusinessIdeas, updateVisionBoard, addTask, deleteTask, toggleTaskCompletion, updateChores, updateTheme, updateNotes, updateProjects } = usePlannerData();
  const { getTasksForDate } = useTasks(data.tasks);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-8 border-[#b2d8e9] border-t-transparent rounded-full animate-spin" />
          <p className="font-display font-black text-slate-400 uppercase tracking-widest text-sm">Opening your universe...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl border-8 border-white text-center space-y-10 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-[#b2d8e9] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-[#b2d8e9]/30">
            <Sparkles className="text-white" size={64} />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-black text-black uppercase tracking-tight">Cosmic Planner</h1>
            <p className="text-slate-400 font-bold leading-relaxed px-4">
              Step into your sanctuary of productivity. Synced across all your stars.
            </p>
          </div>
          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center space-x-4 py-6 bg-black text-white rounded-[2rem] font-display font-black text-xl shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all group"
          >
            <LogIn size={24} className="group-hover:translate-x-1 transition-transform" />
            <span>ENTER PLANNER</span>
          </button>
          <p className="text-[10px] font-black uppercase text-[#f9bcd3] tracking-[0.2em]">Secure Cloud Sync Enabled</p>
        </div>
      </div>
    );
  }

  const handleDateSelect = (date: string) => {
    setActiveDate(date);
    setActiveView('daily');
  };

  const currentTasks = getTasksForDate(new Date(activeDate));
  const dateKey = format(new Date(activeDate), 'yyyy-MM-dd');
  const yearMonthKey = format(new Date(activeDate), 'yyyy-MM');
  const weekId = `${format(new Date(activeDate), 'yyyy')}-W${Math.ceil(new Date(activeDate).getDate() / 7)}`;

  const renderView = () => {
    switch (activeView) {
      case 'index':
        return (
          <IndexView 
            onViewChange={setActiveView} 
            user={user}
            ownerName={data.ownerName}
            onUpdateOwnerName={updateOwnerName}
            onLogout={logout}
            theme={data.theme}
            onUpdateTheme={updateTheme}
          />
        );
      case 'chores':
        return (
          <ChoresView 
            data={data.chores || INITIAL_DATA.chores} 
            onUpdate={updateChores} 
            theme={data.theme || 'light'}
          />
        );
      case 'current':
        return (
          <CurrentView 
            data={data.current || INITIAL_DATA.current} 
            onUpdate={updateCurrent} 
            theme={data.theme || 'light'}
          />
        );
      case 'vision':
        const vKey = `${2026}-${String(activeMonth + 1).padStart(2, '0')}`;
        return (
          <VisionView 
            month={activeMonth}
            year={2026}
            items={data.visionBoards[vKey] || []}
            onUpdate={(items) => updateVisionBoard(vKey, items)}
            theme={data.theme || 'light'}
          />
        );
      case 'yearly':
        return (
          <YearlyView 
            year={2026} 
            data={data.yearly[2026]} 
            onUpdate={updateYearly} 
            onMonthSelect={(m) => { setActiveMonth(m); setActiveView('monthly'); }} 
            theme={data.theme || 'light'}
          />
        );
      case 'monthly':
        const mKey = `${2026}-${String(activeMonth + 1).padStart(2, '0')}`;
        return (
          <MonthlyView 
            month={activeMonth} 
            onDateSelect={handleDateSelect} 
            tasks={data.tasks} 
            getTasksForDate={getTasksForDate}
            data={data.monthly[mKey] || { goals: ['', '', ''], focus: '' }}
            onUpdate={(fields) => updateMonthly(mKey, fields)}
            theme={data.theme || 'light'}
          />
        );
      case 'weekly':
        return (
          <WeeklyView 
            date={activeDate} 
            data={data.weekly[weekId] || { focus: '', goals: ['', '', ''], review: '', habits: [] }}
            onUpdate={(fields) => updateWeekly(weekId, fields)}
            theme={data.theme || 'light'}
          />
        );
      case 'daily':
        return (
          <DailyView 
            date={activeDate} 
            tasks={currentTasks} 
            onToggleTask={(id) => toggleTaskCompletion(id, activeDate)} 
            onDeleteTask={deleteTask}
            data={data.daily[dateKey] || { reflection: '', notes: '', timeline: {} }}
            onUpdate={(fields) => updateDaily(dateKey, fields)}
            theme={data.theme || 'light'}
          />
        );
      case 'study':
        return (
          <StudyView 
            data={data.study}
            onUpdate={updateStudy}
            theme={data.theme || 'light'}
          />
        );
      case 'business':
        return (
          <BusinessView 
            ideas={data.businessIdeas}
            onUpdate={updateBusinessIdeas}
            theme={data.theme || 'light'}
          />
        );
      case 'notes':
        return (
          <NotesView 
            notes={data.notes || []}
            onUpdate={updateNotes}
            theme={data.theme || 'light'}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            projects={data.projects || []}
            onUpdate={updateProjects}
            theme={data.theme || 'light'}
          />
        );
      default:
        return (
          <div className="flex flex-col h-full items-center justify-center text-[#B8A9D1] opacity-60">
            <h2 className="text-2xl font-bold uppercase tracking-widest">{activeView} Page</h2>
            <p className="mt-2 italic">Coming soon to your planner...</p>
          </div>
        );
    }
  };

  return (
    <>
      <PlannerLayout 
        activeView={activeView} 
        onViewChange={setActiveView}
        activeMonth={activeMonth}
        onMonthChange={setActiveMonth}
        ownerName={data.ownerName}
        onUpdateOwnerName={updateOwnerName}
        theme={data.theme}
      >
        {renderView()}

        {/* Floating Add Button */}
        {(activeView === 'daily' || activeView === 'monthly') && (
          <button
            onClick={() => setIsTaskDialogOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-[#5B4B8A] text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
          >
            <Plus size={32} />
            <span className="absolute right-full mr-4 bg-[#5B4B8A] text-white text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              Add Task
            </span>
          </button>
        )}
      </PlannerLayout>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onAdd={addTask}
        defaultDate={activeDate.split('T')[0]}
      />
    </>
  );
}
