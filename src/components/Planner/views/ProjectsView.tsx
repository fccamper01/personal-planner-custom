import React, { useState } from 'react';
import { ProjectItem, ThemeType } from '../types';
import { Plus, ArrowLeft, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onUpdate: (projects: ProjectItem[]) => void;
  theme: ThemeType;
}

const PROJECT_COLORS = [
  '#b2d8e9',
  '#f9bcd3',
  '#d1c1dc',
  '#ffd9a1',
  '#a8e6cf',
  '#ffb3ba',
  '#b19cd9',
  '#ffdfba',
];

export default function ProjectsView({ projects, onUpdate, theme }: ProjectsViewProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const addProject = () => {
    const newProject: ProjectItem = {
      id: crypto.randomUUID(),
      title: 'New Project',
      content: '',
      color: PROJECT_COLORS[projects.length % PROJECT_COLORS.length],
      updatedAt: new Date().toISOString()
    };
    onUpdate([...projects, newProject]);
    setActiveProjectId(newProject.id); // Open immediately
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(projects.filter(p => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  };

  const updateActiveProject = (fields: Partial<ProjectItem>) => {
    if (!activeProjectId) return;
    const newProjects = projects.map(p => 
      p.id === activeProjectId 
        ? { ...p, ...fields, updatedAt: new Date().toISOString() } 
        : p
    );
    onUpdate(newProjects);
  };

  // Render Subpage (Individual Project)
  if (activeProjectId && activeProject) {
    return (
      <div className="w-full flex flex-col h-full overflow-hidden space-y-6">
        {/* Subpage Header */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 space-x-0 sm:space-x-4">
          <button 
            onClick={() => setActiveProjectId(null)}
            className={cn(
              "p-3 rounded-2xl flex items-center justify-center transition-all shadow-sm border-2 self-start",
              theme === 'dark' ? "bg-white/10 text-white border-white/20 hover:bg-white/20" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 w-full relative group">
            <input 
              value={activeProject.title}
              onChange={(e) => updateActiveProject({ title: e.target.value })}
              className={cn(
                "bg-transparent border-none outline-none font-display font-black text-3xl sm:text-4xl w-full pr-12 sm:pr-0",
                theme === 'dark' ? "text-white" : "text-black"
              )}
              placeholder="Project Title"
            />
            <div className="flex items-center space-x-2 mt-1">
              <Calendar size={12} className={theme === 'dark' ? "text-white/40" : "text-slate-400"} />
              <span className={cn("text-[10px] font-black uppercase tracking-widest", theme === 'dark' ? "text-white/40" : "text-slate-400")}>
                Updated {format(new Date(activeProject.updatedAt), 'MMM dd, yyyy')}
              </span>
            </div>
            
            <button 
              onClick={(e) => deleteProject(activeProject.id, e)}
              className="absolute right-0 top-0 sm:relative sm:top-auto sm:ml-4 p-3 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all border-2 border-transparent hover:border-red-100 hidden sm:block"
            >
              <Trash2 size={24} />
            </button>
          </div>
          <button 
            onClick={(e) => deleteProject(activeProject.id, e)}
            className="p-3 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all border-2 border-transparent hover:border-red-100 block sm:hidden self-end"
          >
            <Trash2 size={24} />
          </button>
        </div>

        {/* Subpage Content */}
        <textarea
          value={activeProject.content}
          onChange={(e) => updateActiveProject({ content: e.target.value })}
          placeholder="Start writing project notes..."
          className={cn(
            "flex-1 w-full rounded-[2rem] p-8 border-4 shadow-xl resize-none outline-none font-bold transition-all duration-300",
            theme === 'light' && "bg-white border-[#FFF9F2] text-slate-700 placeholder:text-slate-300",
            theme === 'dark' && "bg-white/5 border-white/10 text-white placeholder:text-white/20",
            theme === 'medium' && "bg-white border-slate-200 text-slate-700 placeholder:text-slate-300"
          )}
        />
      </div>
    );
  }

  // Render Grid / Dashboard
  return (
    <div className="w-full space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className={cn(
          "text-5xl md:text-7xl font-display font-black uppercase tracking-tighter transition-all duration-500",
          theme === 'dark' ? "text-white" : "text-slate-800"
        )}>
          Projects
        </h1>
        <p className={cn("font-bold max-w-lg", theme === 'dark' ? "text-white/50" : "text-slate-400")}>
          Master your initiatives. Break down large goals into focused workspaces.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              onClick={() => setActiveProjectId(project.id)}
              style={{ backgroundColor: theme === 'dark' ? undefined : (project.color + '40') }}
              className={cn(
                "group relative w-full aspect-square rounded-[2.5rem] p-6 shadow-sm border-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col",
                theme === 'dark' ? "bg-white/5 border-white/10" : "border-white"
              )}
            >
              <div className="flex-1">
                <h3 className={cn(
                  "font-display font-black text-2xl uppercase tracking-tight leading-none mb-3",
                  theme === 'dark' ? "text-white" : "text-black"
                )}>
                  {project.title}
                </h3>
                <p className={cn(
                  "text-sm font-bold line-clamp-4",
                  theme === 'dark' ? "text-white/50" : "text-slate-700/60"
                )}>
                  {project.content || "Empty project..."}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  theme === 'dark' ? "text-white/30" : "text-slate-500/50"
                )}>
                  {format(new Date(project.updatedAt), 'MMM dd')}
                </span>
                <button 
                  onClick={(e) => deleteProject(project.id, e)}
                  className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/50 hover:bg-red-400 hover:text-white text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Button */}
        <button
          onClick={addProject}
          className={cn(
            "w-full aspect-square rounded-[2.5rem] p-6 shadow-sm border-4 border-dashed flex flex-col items-center justify-center space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer",
            theme === 'light' && "border-[#b2d8e9]/50 bg-white/50 text-[#b2d8e9] hover:bg-white hover:border-[#b2d8e9]",
            theme === 'dark' && "border-white/20 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white",
            theme === 'medium' && "border-slate-300 bg-white/50 text-slate-400 hover:bg-white hover:border-slate-400",
            projects.length === 0 && "col-span-full md:col-span-1"
          )}
        >
          <div className="w-16 h-16 rounded-full bg-current opacity-10 flex items-center justify-center absolute z-0" />
          <Plus size={32} className="relative z-10" />
          <span className="font-display font-black text-sm uppercase tracking-widest relative z-10">New Project</span>
        </button>
      </div>
    </div>
  );
}
