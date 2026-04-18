import React from 'react';
import { ChoresData, ChoreItem, ThemeType, DailyChore } from '../types';
import { Plus, X, Trophy, Check, GripVertical } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface ChoresViewProps {
  data: ChoresData;
  onUpdate: (fields: Partial<ChoresData>) => void;
  theme: ThemeType;
}

const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function ChoresView({ data, onUpdate, theme }: ChoresViewProps) {
  const addDailyChore = () => {
    const newChore: DailyChore = {
      id: crypto.randomUUID(),
      text: 'New Daily Chore',
      points: 1,
      days: Array(7).fill(false)
    };
    onUpdate({ dailyChores: [...(data.dailyChores || []), newChore] });
  };

  const addChore = (section: keyof ChoresData) => {
    const newChore: ChoreItem = {
      id: crypto.randomUUID(),
      text: 'New Task',
      points: 5,
      completed: false
    };
    const list = data[section] as ChoreItem[];
    onUpdate({ [section]: [...list, newChore] });
  };

  const removeChore = (section: keyof ChoresData, id: string) => {
    const list = data[section] as any[];
    if (!Array.isArray(list)) return;
    onUpdate({ [section]: list.filter(c => c.id !== id) });
  };

  const toggleDailyDay = (choreId: string, dayIndex: number) => {
    const newDaily = data.dailyChores.map(c => {
      if (c.id === choreId) {
        const newDays = [...c.days];
        newDays[dayIndex] = !newDays[dayIndex];
        return { ...c, days: newDays };
      }
      return c;
    });
    onUpdate({ dailyChores: newDaily });
  };

  const toggleChore = (section: keyof ChoresData, id: string) => {
    const list = data[section] as ChoreItem[];
    onUpdate({
      [section]: list.map(c => c.id === id ? { ...c, completed: !c.completed } : c)
    });
  };

  const updateChoreText = (section: keyof ChoresData, id: string, text: string) => {
    const list = data[section] as any[];
    onUpdate({
      [section]: list.map(c => c.id === id ? { ...c, text } : c)
    });
  };

  const updateChorePoints = (section: keyof ChoresData, id: string, pts: string) => {
    const points = parseInt(pts) || 0;
    const list = data[section] as any[];
    onUpdate({
      [section]: list.map(c => c.id === id ? { ...c, points } : c)
    });
  };

  const handleOnDragEnd = (result: DropResult, section: keyof ChoresData) => {
    if (!result.destination) return;
    const list = [...(data[section] as any[])];
    const [reorderedItem] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, reorderedItem);
    onUpdate({ [section]: list });
  };

  return (
    <div className="flex flex-col h-full space-y-8 w-full pb-12">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className={cn(
            "text-5xl font-display font-black uppercase tracking-tighter transition-all duration-500",
            theme === 'dark' ? "text-white" : "text-black"
          )}>Chores</h1>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">NAME:</span>
              <input 
                value={data.name} 
                onChange={(e) => onUpdate({ name: e.target.value })}
                className={cn(
                  "font-display font-black italic bg-transparent border-b-2 outline-none w-24 transition-all",
                  theme === 'dark' ? "text-[#FFCC00] border-white/10" : "text-[#FFD93D] border-slate-100"
                )}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">PERIOD:</span>
              <input 
                type="number"
                value={data.week} 
                onChange={(e) => onUpdate({ week: parseInt(e.target.value) || 1 })}
                className={cn(
                  "font-display font-black italic bg-transparent border-b-2 outline-none w-12 transition-all",
                  theme === 'dark' ? "text-[#5BC0F8] border-white/10" : "text-[#5BC0F8] border-slate-100"
                )}
              />
            </div>
          </div>
        </div>

        <div className={cn(
          "rounded-[2rem] p-4 border-4 shadow-xl flex items-center space-x-4 transition-all duration-500",
          theme === 'dark' ? "bg-white/5 border-white/10" : "bg-[#1A1A1A] border-white"
        )}>
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-[8px] font-black uppercase tracking-widest leading-none",
              theme === 'dark' ? "text-white/40" : "text-white/40"
            )}>CURRENT PTS</span>
            <span className="text-3xl font-display font-black text-[#FFCC00] leading-none">{data.currentPoints}</span>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
            theme === 'dark' ? "bg-white/10 border-white/20" : "bg-white/10 border-white/20"
          )}>
            <Trophy className="text-[#FFCC00]" size={24} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className={cn(
          "flex items-center space-x-3 p-2 transition-all",
          theme === 'dark' ? "text-white/40" : "text-slate-400"
        )}>
          <div className="w-4 ml-1" /> {/* Spacer for Grip icon */}
          <h2 className="flex-1 text-xs font-black uppercase tracking-[0.2em]">Daily Chores</h2>
          <div className="flex space-x-2">
            {DAYS_SHORT.map((d, i) => (
              <span key={i} className="w-8 h-8 flex items-center justify-center text-[10px] font-black tracking-tighter">{d}</span>
            ))}
            <span className="w-8 h-8 flex items-center justify-center text-[10px] font-black tracking-tighter">PTS</span>
          </div>
          <div className="w-8" /> {/* Spacer for X button */}
        </div>

        <div className="space-y-2">
          <DragDropContext onDragEnd={(res) => handleOnDragEnd(res, 'dailyChores')}>
            <Droppable droppableId="daily-chores">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {(data.dailyChores || []).map((chore, index) => (
                    <Draggable key={chore.id} draggableId={chore.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef} 
                          {...provided.draggableProps}
                          className={cn(
                            "group flex items-center space-x-3 border-2 rounded-[1.5rem] p-2 hover:shadow-md transition-all duration-500",
                            theme === 'light' && "bg-white border-[#FFF9F2]",
                            theme === 'dark' && "bg-white/5 border-white/10",
                            theme === 'medium' && "bg-white border-slate-200"
                          )}
                        >
                          <div {...provided.dragHandleProps} className="text-slate-200 hover:text-slate-400">
                            <GripVertical size={16} />
                          </div>
                          <input 
                            value={chore.text}
                            onChange={(e) => updateChoreText('dailyChores', chore.id, e.target.value)}
                            className={cn(
                              "flex-1 bg-transparent font-display font-black text-lg outline-none italic placeholder:text-slate-200",
                              theme === 'dark' ? "text-white" : "text-slate-700"
                            )}
                          />
                          <div className="flex space-x-2">
                            {chore.days.map((checked, i) => (
                              <button
                                key={i}
                                onClick={() => toggleDailyDay(chore.id, i)}
                                className={cn(
                                  "w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center",
                                  checked 
                                    ? (theme === 'dark' ? "bg-[#FFCC00] border-[#FFCC00] text-black shadow-md scale-105" : "bg-[#FFCC00] border-[#FFCC00] text-white shadow-md scale-105") 
                                    : (theme === 'dark' ? "bg-white/5 border-white/10 hover:border-white/20" : "bg-slate-50 border-slate-100 hover:border-slate-200")
                                )}
                              >
                                {checked && <Check size={16} strokeWidth={4} />}
                              </button>
                            ))}
                            <input 
                              type="number"
                              value={chore.points}
                              onChange={(e) => updateChorePoints('dailyChores', chore.id, e.target.value)}
                              className={cn(
                                "w-8 h-8 rounded-lg font-display font-black text-[10px] text-center outline-none transition-all",
                                theme === 'dark' ? "bg-white/10 text-white" : "bg-slate-100 text-slate-500"
                              )}
                            />
                          </div>
                          <button 
                            onClick={() => removeChore('dailyChores', chore.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-400 transition-opacity"
                          >
                            <X size={16} />
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
          <button 
            onClick={addDailyChore}
            className={cn(
              "w-full py-4 border-4 border-dashed rounded-[1.5rem] font-display font-black uppercase text-xs transition-all",
              theme === 'light' && "border-[#FFCC00]/30 text-[#FFCC00] hover:bg-[#FFCC00]/5",
              theme === 'dark' && "border-white/10 text-white/40 hover:bg-white/5",
              theme === 'medium' && "border-slate-300 text-slate-400 hover:bg-slate-50"
            )}
          >
            + Add Daily Chore
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Monthly Chores */}
        <div className="space-y-3">
          <h2 className={cn(
            "text-xs font-black uppercase tracking-[0.2em] px-4",
            theme === 'dark' ? "text-white/60" : "text-slate-500"
          )}>monthly chores (+5 pts)</h2>
          <div className="space-y-2">
            <DragDropContext onDragEnd={(res) => handleOnDragEnd(res, 'monthlyChores')}>
              <Droppable droppableId="monthly-chores">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {data.monthlyChores.map((chore, index) => (
                      <Draggable key={chore.id} draggableId={chore.id} index={index}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "group flex items-center border-2 rounded-[1.2rem] p-3 hover:shadow-sm transition-all duration-500",
                              theme === 'light' && "bg-[#f9bcd3]/10 border-white hover:bg-white",
                              theme === 'dark' && "bg-white/5 border-white/10 hover:bg-white/10 shadow-lg",
                              theme === 'medium' && "bg-white border-slate-200"
                            )}
                          >
                            <div {...provided.dragHandleProps} className="text-slate-300 mr-2 hover:text-slate-500">
                              <GripVertical size={14} />
                            </div>
                            <button 
                              onClick={() => toggleChore('monthlyChores', chore.id)}
                              className={cn(
                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                chore.completed 
                                  ? (theme === 'dark' ? "bg-[#FFCC00] border-[#FFCC00] text-black" : "bg-[#f9bcd3] border-[#f9bcd3] text-white") 
                                  : (theme === 'dark' ? "border-white/10" : "border-[#f9bcd3]/30 bg-white")
                              )}
                            >
                              {chore.completed && <Check size={12} strokeWidth={4} />}
                            </button>
                            <input 
                              value={chore.text}
                              onChange={(e) => updateChoreText('monthlyChores', chore.id, e.target.value)}
                              className={cn(
                                "flex-1 bg-transparent ml-3 font-display font-bold outline-none transition-all",
                                theme === 'dark' ? "text-white" : "text-[#f9bcd3]",
                                chore.completed && "line-through opacity-50"
                              )}
                            />
                            <button onClick={() => removeChore('monthlyChores', chore.id)} className="opacity-0 group-hover:opacity-100 text-slate-300">
                              <X size={14} />
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
            <button 
              onClick={() => addChore('monthlyChores')} 
              className={cn(
                "w-full py-3 border-4 border-dashed rounded-[1.2rem] font-black text-xs uppercase transition-all",
                theme === 'light' && "border-[#f9bcd3]/30 text-[#f9bcd3] hover:bg-[#f9bcd3]/5",
                theme === 'dark' && "border-white/10 text-white/40 hover:bg-white/5",
                theme === 'medium' && "border-slate-300 text-slate-400 hover:bg-slate-50"
              )}
            >
              + Add Monthly Task
            </button>
          </div>
        </div>

        {/* Quarterly Chores */}
        <div className="space-y-3">
          <h2 className={cn(
            "text-xs font-black uppercase tracking-[0.2em] px-4",
            theme === 'dark' ? "text-white/60" : "text-slate-500"
          )}>quarterly chores (+15 pts)</h2>
          <div className="space-y-2">
            <DragDropContext onDragEnd={(res) => handleOnDragEnd(res, 'quarterlyChores')}>
              <Droppable droppableId="quarterly-chores">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {data.quarterlyChores.map((chore, index) => (
                      <Draggable key={chore.id} draggableId={chore.id} index={index}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "group flex items-center border-2 rounded-[1.2rem] p-3 hover:shadow-sm transition-all duration-500",
                              theme === 'light' && "bg-[#ffd9a1]/10 border-white hover:bg-white",
                              theme === 'dark' && "bg-white/5 border-white/10 hover:bg-white/10 shadow-lg",
                              theme === 'medium' && "bg-white border-slate-200"
                            )}
                          >
                            <div {...provided.dragHandleProps} className="text-slate-300 mr-2 hover:text-slate-500">
                              <GripVertical size={14} />
                            </div>
                            <button 
                              onClick={() => toggleChore('quarterlyChores', chore.id)}
                              className={cn(
                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                chore.completed 
                                  ? (theme === 'dark' ? "bg-[#FFCC00] border-[#FFCC00] text-black" : "bg-[#ffd9a1] border-[#ffd9a1] text-white") 
                                  : (theme === 'dark' ? "border-white/10" : "border-[#ffd9a1]/30 bg-white")
                              )}
                            >
                              {chore.completed && <Check size={12} strokeWidth={4} />}
                            </button>
                            <input 
                              value={chore.text}
                              onChange={(e) => updateChoreText('quarterlyChores', chore.id, e.target.value)}
                              className={cn(
                                "flex-1 bg-transparent ml-3 font-display font-bold outline-none underline decoration-2 transition-all",
                                theme === 'dark' ? "text-white decoration-white/20" : "text-[#ffd9a1] decoration-[#ffd9a1]/20",
                                chore.completed && "line-through opacity-50"
                              )}
                            />
                            <button onClick={() => removeChore('quarterlyChores', chore.id)} className="opacity-0 group-hover:opacity-100 text-slate-300">
                              <X size={14} />
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
            <button 
              onClick={() => addChore('quarterlyChores')} 
              className={cn(
                "w-full py-3 border-4 border-dashed rounded-[1.2rem] font-black text-xs uppercase transition-all",
                theme === 'light' && "border-[#ffd9a1]/40 text-[#ffd9a1] hover:bg-[#ffd9a1]/5",
                theme === 'dark' && "border-white/10 text-white/40 hover:bg-white/5",
                theme === 'medium' && "border-slate-300 text-slate-400 hover:bg-slate-50"
              )}
            >
              + Add Quarterly Task
            </button>
          </div>
        </div>
      </div>

      {/* Semi-Annual */}
      <div className="space-y-3">
        <h2 className={cn(
          "text-xs font-black uppercase tracking-[0.2em] px-4",
          theme === 'dark' ? "text-white/60" : "text-slate-500"
        )}>Semi-Annual Chores (+50 PTS)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DragDropContext onDragEnd={(res) => handleOnDragEnd(res, 'semiAnnualChores')}>
            <Droppable droppableId="semi-annual-chores">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {data.semiAnnualChores.map((chore, index) => (
                    <Draggable key={chore.id} draggableId={chore.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "group flex items-center border-2 rounded-[1.2rem] p-3 hover:shadow-sm transition-all duration-500 w-full",
                            theme === 'light' && "bg-[#d1c1dc]/10 border-white hover:bg-white",
                            theme === 'dark' && "bg-white/5 border-white/10 hover:bg-white/10 shadow-lg",
                            theme === 'medium' && "bg-white border-slate-200"
                          )}
                        >
                           <div {...provided.dragHandleProps} className="text-slate-300 mr-2 hover:text-slate-500">
                              <GripVertical size={16} />
                            </div>
                           <button 
                              onClick={() => toggleChore('semiAnnualChores', chore.id)}
                              className={cn(
                                "w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all",
                                chore.completed 
                                  ? (theme === 'dark' ? "bg-[#FFCC00] border-[#FFCC00] shadow-lg text-black" : "bg-[#d1c1dc] border-[#d1c1dc] shadow-lg text-white") 
                                  : (theme === 'dark' ? "border-white/10" : "border-[#d1c1dc]/30 bg-white")
                              )}
                            >
                              {chore.completed && <Check size={20} strokeWidth={4} />}
                            </button>
                            <input 
                              value={chore.text}
                              onChange={(e) => updateChoreText('semiAnnualChores', chore.id, e.target.value)}
                              className={cn(
                                "flex-1 bg-transparent ml-4 font-display font-black text-xl outline-none transition-all",
                                theme === 'dark' ? "text-white" : "text-[#d1c1dc]",
                                chore.completed && "line-through opacity-50"
                              )}
                            />
                            <button onClick={() => removeChore('semiAnnualChores', chore.id)} className="opacity-0 group-hover:opacity-100 text-slate-300">
                              <X size={14} />
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
        <button 
          onClick={() => addChore('semiAnnualChores')} 
          className={cn(
            "w-full py-4 border-4 border-dashed rounded-[1.5rem] font-black text-xs uppercase transition-all",
            theme === 'light' && "border-[#d1c1dc]/40 text-[#d1c1dc] hover:bg-[#d1c1dc]/5",
            theme === 'dark' && "border-white/10 text-white/40 hover:bg-white/5",
            theme === 'medium' && "border-slate-300 text-slate-400 hover:bg-slate-50"
          )}
        >
          + Add Semi-Annual Task
        </button>
      </div>

      {/* Bottom Stats */}
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t-2 transition-all",
        theme === 'dark' ? "border-white/10" : "border-slate-100"
      )}>
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WEEKLY GOAL:</span>
          <div className="flex items-center space-x-2">
            <input 
              type="number"
              value={data.weeklyGoal}
              onChange={(e) => onUpdate({ weeklyGoal: parseInt(e.target.value) || 0 })}
              className={cn(
                "text-4xl font-display font-black bg-transparent outline-none w-24 border-b-4 transition-all",
                theme === 'dark' ? "text-[#FFCC00] border-white/10 focus:border-[#FFCC00]" : "text-[#FFCC00] border-slate-100 focus:border-[#FFCC00]"
              )}
            />
            <span className="text-xl font-display font-black text-slate-300 italic">pts</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REWARD:</span>
          <input 
            value={data.reward}
            onChange={(e) => onUpdate({ reward: e.target.value })}
            className={cn(
              "w-full text-4xl font-display font-black bg-transparent outline-none border-b-4 transition-all italic",
              theme === 'dark' ? "text-[#5BC0F8] border-white/10 focus:border-[#5BC0F8]" : "text-[#5BC0F8] border-slate-100 focus:border-[#5BC0F8]"
            )}
          />
        </div>
      </div>
    </div>
  );
}
