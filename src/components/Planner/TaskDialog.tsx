import React, { useState } from 'react';
import { RecurrenceType } from './types';
import { X, Calendar, Repeat, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: { 
    title: string; 
    startDate: string; 
    recurrence?: { type: RecurrenceType; interval: number; endDate?: string } 
  }) => void;
  defaultDate?: string;
}

export default function TaskDialog({ isOpen, onClose, onAdd, defaultDate }: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [type, setType] = useState<RecurrenceType>('daily');
  const [interval, setInterval] = useState(1);
  const [startDate, setStartDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>('');
  const [hasEndDate, setHasEndDate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onAdd({
      title,
      startDate,
      recurrence: isRecurring ? {
        type,
        interval,
        endDate: hasEndDate ? endDate : undefined
      } : undefined
    });
    
    // Reset
    setTitle('');
    setIsRecurring(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-t-8 border-[#5B4B8A]"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#5B4B8A] uppercase tracking-widest">New Task</h3>
                <button onClick={onClose} className="text-[#B8A9D1] hover:text-[#5B4B8A] transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-[#8E7AB5]">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest block opacity-70">Task Description</label>
                  <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="E.g., Morning Yoga"
                    className="w-full bg-[#F9F7FC] border-2 border-[#F0EBF5] rounded-xl px-4 py-3 outline-none focus:border-[#B8A9D1] transition-colors font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest block opacity-70">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8A9D1]" size={16} />
                      <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full bg-[#F9F7FC] border-2 border-[#F0EBF5] rounded-xl pl-10 pr-4 py-2 outline-none focus:border-[#B8A9D1] text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={e => setIsRecurring(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                        isRecurring ? "bg-[#5B4B8A] border-[#5B4B8A]" : "bg-white border-[#D8CFE5]"
                      )}>
                        {isRecurring && <Repeat size={12} className="text-white" />}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Recurring task</span>
                    </label>
                  </div>
                </div>

                <AnimatePresence>
                  {isRecurring && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="p-4 bg-[#F9F7FC] rounded-xl border border-[#F0EBF5] space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <span>Repeats every</span>
                          <input
                            type="number"
                            min="1"
                            value={interval}
                            onChange={e => setInterval(parseInt(e.target.value) || 1)}
                            className="w-12 bg-white border border-[#D8CFE5] rounded px-2 py-1 outline-none text-center"
                          />
                          <select
                            value={type}
                            onChange={e => setType(e.target.value as RecurrenceType)}
                            className="bg-white border border-[#D8CFE5] rounded px-2 py-1 outline-none"
                          >
                            <option value="daily">days</option>
                            <option value="weekly">weeks</option>
                            <option value="monthly">months</option>
                            <option value="yearly">years</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hasEndDate}
                              onChange={e => setHasEndDate(e.target.checked)}
                              className="sr-only"
                            />
                            <div className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                              hasEndDate ? "bg-[#8E7AB5] border-[#8E7AB5]" : "bg-white border-[#D8CFE5]"
                            )}>
                              {hasEndDate && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-inner" />}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">End date</span>
                          </label>

                          {hasEndDate && (
                            <motion.div
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="relative pl-6"
                            >
                              <input
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full bg-white border-2 border-[#F0EBF5] rounded-xl px-4 py-2 outline-none focus:border-[#B8A9D1] text-sm"
                              />
                            </motion.div>
                          )}
                          {!hasEndDate && (
                            <div className="pl-6 text-[10px] italic opacity-50 uppercase tracking-[0.2em]">Repeats indefinitely</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="w-full bg-[#5B4B8A] hover:bg-[#483B6D] text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#5B4B8A]/20 transition-all flex items-center justify-center gap-2 group"
                >
                  Create Task
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
