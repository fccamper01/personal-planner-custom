import React from 'react';
import { Plus, X, RotateCcw, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import { CurrentDayData, CheckItem, ThemeType } from '../types';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import TextareaAutosize from 'react-textarea-autosize';

interface CurrentViewProps {
  data: CurrentDayData;
  onUpdate: (data: CurrentDayData) => void;
  theme: ThemeType;
}

export default function CurrentView({ data, onUpdate, theme }: CurrentViewProps) {
  const updateTasks = (newTasks: CheckItem[]) => {
    onUpdate({ ...data, tasks: newTasks });
  };

  const addTask = () => {
    const newTask: CheckItem = {
      id: crypto.randomUUID(),
      text: '',
      count: 15,
      completed: false
    };
    updateTasks([...data.tasks, newTask]);
  };

  const removeTask = (id: string) => {
    updateTasks(data.tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    updateTasks(data.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const updateTaskText = (id: string, text: string) => {
    updateTasks(data.tasks.map(t => t.id === id ? { ...t, text } : t));
  };

  const updateTaskCount = (id: string, countStr: string) => {
    const count = parseInt(countStr) || 0;
    updateTasks(data.tasks.map(t => t.id === id ? { ...t, count } : t));
  };

  const onDragEndTasks = (result: DropResult) => {
    if (!result.destination) return;
    const items = [...data.tasks];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateTasks(items);
  };

  const onDragEndMini = (result: DropResult) => {
    if (!result.destination) return;
    const items = [...(data.miniChecklist || [])];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onUpdate({ ...data, miniChecklist: items });
  };

  const updateWeeklyProgress = (day: string, val: string) => {
    const num = parseInt(val) || 0;
    onUpdate({
      ...data,
      weeklyProgress: {
        ...(data.weeklyProgress || {}),
        [day]: num
      }
    });
  };

  const handleReset = () => {
    onUpdate({
      quote: 'EVERYTHING COMES TO YOU AT THE RIGHT TIME. BE PATIENT. TRUST THE PROCESS.',
      target: 'TARGET',
      status: 'IN PROGRESS',
      reward: 'REWARD',
      punishment: 'PUNISHMENT',
      tasks: [],
      weeklyProgress: { MON: 0, TUE: 0, WED: 0, THUR: 0, FRI: 0, SAT: 0, SUN: 0 },
      quickNotes: '',
      bottomChecklist: [],
      miniChecklist: [
        { id: '1', text: 'Drink Water', completed: false },
        { id: '2', text: 'Exercise', completed: false },
        { id: '3', text: 'Read', completed: false }
      ]
    });
  };

  const handleClearAll = () => {
    onUpdate({
      quote: '',
      target: '',
      status: '',
      reward: '',
      punishment: '',
      tasks: [],
      weeklyProgress: { MON: 0, TUE: 0, WED: 0, THUR: 0, FRI: 0, SAT: 0, SUN: 0 },
      quickNotes: '',
      bottomChecklist: [],
      miniChecklist: []
    });
  };

  const days = ['MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'];
  const totalCompleted = Object.values(data.weeklyProgress || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-full space-y-4 w-full pb-8">
      {/* Quote Header */}
      <div className={cn(
        "rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col items-center justify-center border-4 shadow-md transition-all duration-500",
        theme === 'light' && "bg-[#b2d8e9]/20 border-white",
        theme === 'dark' && "bg-white/5 border-white/10",
        theme === 'medium' && "bg-slate-200 border-white"
      )}>
        <div className="absolute top-4 left-6 flex space-x-2">
          <span className={cn("text-2xl", theme === 'dark' ? "text-[#FFCC00]" : "text-[#b2d8e9]")}>★</span>
          <span className={cn("text-xl opacity-60", theme === 'dark' ? "text-white" : "text-[#b2d8e9]")}>♥</span>
        </div>
        <div className="absolute top-4 right-6 flex space-x-2">
          <span className={cn("text-xl opacity-60", theme === 'dark' ? "text-white" : "text-[#b2d8e9]")}>♥</span>
          <span className={cn("text-2xl", theme === 'dark' ? "text-[#FFCC00]" : "text-[#b2d8e9]")}>★</span>
        </div>
        <input
          value={data.quote}
          onChange={(e) => onUpdate({ ...data, quote: e.target.value })}
          className={cn(
            "text-center bg-transparent border-none outline-none text-3xl font-display font-black uppercase tracking-tight w-full",
            theme === 'dark' ? "text-white" : "text-black"
          )}
        />
      </div>

      {/* Target Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* TARGET */}
        <div className={cn(
          "rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 shadow-sm border-2 transition-all duration-500 bg-white",
          theme === 'dark' && "bg-white/5 border-white/10 text-white",
          theme === 'medium' && "bg-white border-slate-200 text-slate-600"
        )}>
          <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] opacity-60", theme === 'dark' ? "text-white" : "text-slate-500")}>TARGET</span>
          <input
            value={data.target}
            onChange={(e) => onUpdate({ ...data, target: e.target.value })}
            className={cn(
              "text-center bg-transparent border-none outline-none text-[12px] font-black w-full",
              theme === 'dark' ? "text-white" : "text-slate-700"
            )}
          />
        </div>
        {/* STATUS */}
        <div className={cn(
          "rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 shadow-sm border-2 transition-all duration-500 bg-[#f9bcd3]/80",
          theme === 'dark' && "bg-white/5 border-white/10 text-white",
          theme === 'medium' && "bg-white border-slate-200 text-slate-600"
        )}>
          <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] opacity-60", theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-500" : "text-white/90 mix-blend-color-burn text-pink-900"))}>STATUS</span>
          <input
            value={data.status}
            onChange={(e) => onUpdate({ ...data, status: e.target.value })}
            className={cn(
              "text-center bg-transparent border-none outline-none text-[12px] font-black w-full",
              theme === 'dark' ? "text-white" : "text-slate-700"
            )}
          />
        </div>
        {/* REWARD */}
        <div className={cn(
          "rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 shadow-sm border-2 transition-all duration-500 bg-[#d1c1dc]/80",
          theme === 'dark' && "bg-white/5 border-white/10 text-white",
          theme === 'medium' && "bg-white border-slate-200 text-slate-600"
        )}>
          <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] opacity-60", theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-500" : "text-white/90 mix-blend-color-burn text-purple-900"))}>REWARD</span>
          <input
            value={data.reward}
            onChange={(e) => onUpdate({ ...data, reward: e.target.value })}
            className={cn(
              "text-center bg-transparent border-none outline-none text-[12px] font-black w-full",
              theme === 'dark' ? "text-white" : "text-slate-700"
            )}
          />
        </div>
        {/* PUNISHMENT */}
        <div className={cn(
          "rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 shadow-sm border-2 transition-all duration-500 bg-[#ffd9a1]/80",
          theme === 'dark' && "bg-white/5 border-white/10 text-white",
          theme === 'medium' && "bg-white border-slate-200 text-slate-600"
        )}>
          <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] opacity-60", theme === 'dark' ? "text-white" : (theme === 'medium' ? "text-slate-500" : "text-white/90 mix-blend-color-burn text-orange-900"))}>PUNISHMENT</span>
          <input
            value={data.punishment}
            onChange={(e) => onUpdate({ ...data, punishment: e.target.value })}
            className={cn(
              "text-center bg-transparent border-none outline-none text-[12px] font-black w-full",
              theme === 'dark' ? "text-white" : "text-slate-700"
            )}
          />
        </div>
      </div>

      {/* Main Tasks List */}
      <div className={cn(
        "rounded-[2.5rem] p-8 space-y-4 border-4 shadow-xl relative overflow-hidden transition-all duration-500",
        theme === 'light' && "bg-[#b2d8e9] border-white",
        theme === 'dark' && "bg-white/5 border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)]",
        theme === 'medium' && "bg-slate-100 border-white shadow-none"
      )}>
        <DragDropContext onDragEnd={onDragEndTasks}>
          <Droppable droppableId="tasks-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {data.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-3 animate-in slide-in-from-left duration-300 transition-all"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div {...provided.dragHandleProps} className="text-white/30 hover:text-white cursor-grab active:cursor-grabbing">
                            <GripVertical size={20} />
                          </div>
                          <input
                            type="number"
                            value={task.count}
                            onChange={(e) => updateTaskCount(task.id, e.target.value)}
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-center border-none outline-none appearance-none transition-all",
                              theme === 'light' && "bg-white/30 text-white",
                              theme === 'dark' && "bg-white/10 text-white border border-white/20",
                              theme === 'medium' && "bg-white text-slate-400 border border-slate-200 shadow-sm"
                            )}
                          />
                        </div>
                        <div className={cn(
                          "flex-1 rounded-xl px-4 py-2.5 shadow-sm border-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 transition-all",
                          theme === 'light' && "bg-white border-white",
                          theme === 'dark' && "bg-white/5 border-white/10",
                          theme === 'medium' && "bg-white border-slate-200"
                        )}>
                          <TextareaAutosize
                            value={task.text}
                            onChange={(e) => updateTaskText(task.id, e.target.value)}
                            placeholder="What to do...?"
                            className={cn(
                              "flex-1 w-full bg-transparent border-none outline-none font-display font-black text-lg placeholder:text-slate-300 transition-all resize-none overflow-hidden py-0",
                              theme === 'dark' ? "text-white" : "text-slate-700",
                              task.completed && "line-through opacity-50 transition-all"
                            )}
                            minRows={1}
                          />
                          <div className="flex items-center w-full justify-between sm:w-auto sm:justify-start">
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className={cn(
                                "w-10 h-5 rounded-full relative transition-colors duration-300 sm:ml-3 border-2 shrink-0",
                                theme === 'dark' ? "border-white/20" : "border-[#f0f0f0]",
                                task.completed 
                                  ? (theme === 'dark' ? "bg-[#FFCC00]" : "bg-[#b2d8e9]") 
                                  : "bg-slate-200"
                              )}
                            >
                              <div className={cn(
                                "absolute top-0.5 bottom-0.5 w-3.5 rounded-full bg-white shadow-sm transition-all duration-300",
                                task.completed ? "right-0.5" : "left-0.5"
                              )} />
                            </button>
                            <button onClick={() => removeTask(task.id)} className="ml-3 sm:ml-3 text-slate-300 hover:text-red-400 shrink-0">
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <button 
          onClick={addTask}
          className={cn(
            "w-full py-3 border-2 border-dashed rounded-xl font-display font-black uppercase tracking-widest transition-all text-xs",
            theme === 'light' && "border-white/50 text-white hover:bg-white/10",
            theme === 'dark' && "border-white/10 text-white/40 hover:bg-white/5",
            theme === 'medium' && "border-slate-300 text-slate-400 hover:bg-slate-50"
          )}
        >
          + Add Task Slot
        </button>

        {/* Weekly Progress Bar */}
        <div className={cn(
          "rounded-[1.5rem] p-4 mt-6 shadow-inner border-2 flex items-center justify-between transition-all duration-500",
          theme === 'light' && "bg-white border-[#FFF9F2]",
          theme === 'dark' && "bg-white/5 border-white/10",
          theme === 'medium' && "bg-white border-slate-200"
        )}>
          {days.map((day) => (
            <div key={day} className="flex flex-col items-center space-y-1">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-tight",
                theme === 'dark' ? "text-[#FFCC00]" : "text-[#f9bcd3]"
              )}>{day}</span>
              <input
                type="number"
                value={data.weeklyProgress?.[day] || 0}
                onChange={(e) => updateWeeklyProgress(day, e.target.value)}
                className={cn(
                  "w-8 bg-transparent text-center font-black text-sm border-none outline-none appearance-none transition-all",
                  theme === 'dark' ? "text-white/60" : "text-slate-400"
                )}
              />
            </div>
          ))}
          <div className={cn("w-px h-8", theme === 'dark' ? "bg-white/10" : "bg-[#FFF9F2]")} />
          <div className="flex flex-col items-center">
            <span className={cn(
              "text-[9px] font-black uppercase tracking-tight",
              theme === 'dark' ? "text-[#FFCC00]" : "text-[#f9bcd3]"
            )}>TOTAL</span>
            <span className={cn("text-xl font-black", theme === 'dark' ? "text-white" : "text-[#f9bcd3]")}>{totalCompleted}</span>
          </div>
        </div>
      </div>

      {/* Notes / Mini Checklist Section */}
      <div className={cn(
        "rounded-[2.5rem] p-8 border-4 shadow-xl transition-all duration-500",
        theme === 'light' && "bg-[#b2d8e9]/40 border-white",
        theme === 'dark' && "bg-white/5 border-white/10",
        theme === 'medium' && "bg-slate-100 border-white"
      )}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className={cn("w-1.5 h-7 rounded-full", theme === 'dark' ? "bg-[#FFCC00]" : "bg-black/20")} />
            <h3 className={cn("text-2xl font-display font-black uppercase tracking-tight", theme === 'dark' ? "text-white" : "text-black/60")}>Notes</h3>
          </div>
          <button 
            onClick={() => {
              const newItem = { id: crypto.randomUUID(), text: '', completed: false };
              onUpdate({ ...data, miniChecklist: [...(data.miniChecklist || []), newItem] });
            }}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
              theme === 'dark' ? "bg-white/10 text-white" : "bg-black text-white hover:scale-110"
            )}
          >
            <Plus size={24} />
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto no-scrollbar">
          <DragDropContext onDragEnd={onDragEndMini}>
            <Droppable droppableId="mini-checklist">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(data.miniChecklist || []).map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef} 
                          {...provided.draggableProps} 
                          className={cn(
                            "flex items-center space-x-4 p-4 rounded-2xl border-2 group transition-all",
                            theme === 'dark' ? "bg-white/5 border-white/5" : "bg-white border-white shadow-sm"
                          )}
                        >
                          <div {...provided.dragHandleProps} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={16} />
                          </div>
                          <button 
                            onClick={() => {
                              const newItems = data.miniChecklist.map(i => i.id === item.id ? { ...i, completed: !i.completed } : i);
                              onUpdate({ ...data, miniChecklist: newItems });
                            }}
                            className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all",
                              item.completed ? "bg-green-500 border-green-500 text-white" : (theme === 'dark' ? "border-white/20" : "border-slate-200")
                            )}
                          >
                            {item.completed && <CheckCircle2 size={16} className="stroke-[4]" />}
                          </button>
                          <TextareaAutosize
                            value={item.text}
                            placeholder="Add task..."
                            onChange={(e) => {
                              const newItems = data.miniChecklist.map(i => i.id === item.id ? { ...i, text: e.target.value } : i);
                              onUpdate({ ...data, miniChecklist: newItems });
                            }}
                            className={cn(
                              "flex-1 bg-transparent border-none outline-none font-bold text-base resize-none overflow-hidden py-0",
                              theme === 'dark' ? "text-white" : "text-slate-600",
                              item.completed && "opacity-40 line-through"
                            )}
                            minRows={1}
                          />
                          <button 
                            onClick={() => {
                              const newItems = data.miniChecklist.filter(i => i.id !== item.id);
                              onUpdate({ ...data, miniChecklist: newItems });
                            }}
                            className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-end space-x-2 pt-2">
        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
              handleClearAll();
            }
          }}
          className={cn(
            "flex items-center space-x-1 px-3 py-1.5 border rounded-lg font-display font-black text-[10px] transition-all shadow-sm",
            theme === 'dark' 
              ? "bg-red-950/20 border-red-900/40 text-red-400 hover:bg-red-950/40" 
              : "bg-white border-red-50 text-red-400 hover:bg-red-50"
          )}
        >
          <X size={12} />
          <span>CLEAR ALL</span>
        </button>
      </div>
    </div>
  );
}
