import React, { useState } from 'react';
import { Note, ThemeType, CheckListItem } from '../types';
import { Plus, X, Palette, Trash2, CheckCircle2, Circle, MoreVertical, GripVertical, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface NotesViewProps {
  notes: Note[];
  onUpdate: (notes: Note[]) => void;
  theme: ThemeType;
}

const COLORS = [
  { name: 'Default', bg: 'bg-white', text: 'text-slate-800' },
  { name: 'Red', bg: 'bg-[#f28b82]', text: 'text-slate-900' },
  { name: 'Orange', bg: 'bg-[#fbbc04]', text: 'text-slate-900' },
  { name: 'Yellow', bg: 'bg-[#fff475]', text: 'text-slate-900' },
  { name: 'Green', bg: 'bg-[#ccff90]', text: 'text-slate-900' },
  { name: 'Teal', bg: 'bg-[#a7ffeb]', text: 'text-slate-900' },
  { name: 'Blue', bg: 'bg-[#cbf0f8]', text: 'text-slate-900' },
  { name: 'Dark Blue', bg: 'bg-[#aecbfa]', text: 'text-slate-900' },
  { name: 'Purple', bg: 'bg-[#d7aefb]', text: 'text-slate-900' },
  { name: 'Pink', bg: 'bg-[#fdcfe8]', text: 'text-slate-900' },
  { name: 'Brown', bg: 'bg-[#e6c9a8]', text: 'text-slate-900' },
  { name: 'Gray', bg: 'bg-[#e8eaed]', text: 'text-slate-900' },
];

export default function NotesView({ notes, onUpdate, theme }: NotesViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newIsChecklist, setNewIsChecklist] = useState(false);
  const [newColor, setNewColor] = useState('bg-white');

  const addNote = () => {
    if (!newTitle && !newContent) {
      setIsAdding(false);
      return;
    }
    const note: Note = {
      id: crypto.randomUUID(),
      title: newTitle,
      content: newContent,
      color: newColor,
      isChecklist: newIsChecklist,
      checklist: [],
      updatedAt: new Date().toISOString()
    };
    onUpdate([note, ...notes]);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
    setNewIsChecklist(false);
    setNewColor('bg-white');
  };

  const deleteNote = (id: string) => {
    onUpdate(notes.filter(n => n.id !== id));
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    onUpdate(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
  };

  const addChecklistItem = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    const newItem: CheckListItem = { id: crypto.randomUUID(), text: '', completed: false };
    updateNote(noteId, { checklist: [...note.checklist, newItem] });
  };

  const updateChecklistItem = (noteId: string, itemId: string, text: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    updateNote(noteId, {
      checklist: note.checklist.map(i => i.id === itemId ? { ...i, text } : i)
    });
  };

  const toggleChecklistItem = (noteId: string, itemId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    updateNote(noteId, {
      checklist: note.checklist.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i)
    });
  };

  const removeChecklistItem = (noteId: string, itemId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    updateNote(noteId, {
      checklist: note.checklist.filter(i => i.id !== itemId)
    });
  };

  const handleDragEnd = (result: DropResult, noteId: string) => {
    if (!result.destination) return;
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    const items = [...note.checklist];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateNote(noteId, { checklist: items });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className={cn(
          "text-6xl font-display font-black uppercase tracking-tighter",
          theme === 'dark' ? "text-white" : "text-slate-800"
        )}>Cosmic Notes</h1>
        <p className="text-slate-400 font-bold max-w-lg">Capture your stardust thoughts and infinite ideas in one place.</p>
      </div>

      {/* Add Note Bar */}
      <div className="flex justify-center px-4">
        {isAdding ? (
          <div className={cn(
            "w-full max-w-xl rounded-2xl p-4 shadow-2xl border-4 flex flex-col space-y-3 transition-all duration-300",
            newColor,
            theme === 'dark' && newColor === 'bg-white' ? "bg-white/10 border-white/20 text-white" : "border-white"
          )}>
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className={cn(
                "bg-transparent border-none outline-none font-bold text-lg placeholder:text-black/30",
                theme === 'dark' && newColor === 'bg-white' ? "placeholder:text-white/20" : ""
              )}
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Take a note..."
              className={cn(
                "bg-transparent border-none outline-none resize-none font-medium h-24 placeholder:text-black/30",
                theme === 'dark' && newColor === 'bg-white' ? "placeholder:text-white/20" : ""
              )}
            />
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setNewIsChecklist(!newIsChecklist)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    newIsChecklist ? "bg-black/10" : "hover:bg-black/5"
                  )}
                  title="Toggle Checklist"
                >
                  <CheckCircle2 size={18} />
                </button>
                
                <div className="group relative">
                  <button className="p-2 rounded-full hover:bg-black/5">
                    <Palette size={18} />
                  </button>
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border p-2 flex gap-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {COLORS.map(c => (
                      <button 
                        key={c.name}
                        onClick={() => setNewColor(c.bg)}
                        className={cn("w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-125", c.bg)}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={addNote}
                className="px-6 py-2 bg-black text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsAdding(true)}
            className={cn(
              "w-full max-w-xl rounded-2xl p-4 shadow-xl border-4 flex items-center justify-between cursor-text transition-all",
              theme === 'light' && "bg-white border-white",
              theme === 'dark' && "bg-white/5 border-white/5",
              theme === 'medium' && "bg-slate-100 border-white"
            )}
          >
            <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Take a note...</span>
            <div className="flex space-x-2 text-slate-400">
              <CheckCircle2 size={20} />
              <Palette size={20} />
            </div>
          </div>
        )}
      </div>

      {/* Grid of Notes */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 px-4 space-y-4">
        <AnimatePresence>
          {notes.map(note => (
            <motion.div
              layout
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                "break-inside-avoid rounded-3xl p-6 shadow-md border-4 group relative flex flex-col space-y-3 transition-all duration-500",
                note.color,
                theme === 'dark' && note.color === 'bg-white' ? "bg-white/5 border-white/10 text-white" : "border-white",
                note.color !== 'bg-white' ? "text-slate-900" : ""
              )}
            >
              {/* Note Content */}
              <div className="space-y-1">
                {note.title && (
                  <input
                    value={note.title}
                    onChange={(e) => updateNote(note.id, { title: e.target.value })}
                    className="w-full bg-transparent border-none outline-none font-display font-black text-xl uppercase tracking-tight"
                  />
                )}
                
                {!note.isChecklist && (
                  <textarea
                    value={note.content}
                    onChange={(e) => updateNote(note.id, { content: e.target.value })}
                    rows={note.content.split('\n').length || 1}
                    className="w-full bg-transparent border-none outline-none resize-none font-medium leading-relaxed"
                  />
                )}

                {note.isChecklist && (
                  <div className="space-y-1 pt-2">
                    <DragDropContext onDragEnd={(res) => handleDragEnd(res, note.id)}>
                      <Droppable droppableId={`checklist-${note.id}`}>
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                            {note.checklist.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                  <div 
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center space-x-2 group/item"
                                  >
                                    <div {...provided.dragHandleProps} className="opacity-0 group-hover/item:opacity-30 cursor-grab">
                                      <GripVertical size={14} />
                                    </div>
                                    <button 
                                      onClick={() => toggleChecklistItem(note.id, item.id)}
                                      className={cn(
                                        "p-0.5 rounded transition-transform active:scale-90",
                                        item.completed ? "text-black/40" : "text-black/60"
                                      )}
                                    >
                                      {item.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                    </button>
                                    <input
                                      value={item.text}
                                      onChange={(e) => updateChecklistItem(note.id, item.id, e.target.value)}
                                      className={cn(
                                        "flex-1 bg-transparent border-none outline-none text-sm font-bold",
                                        item.completed && "line-through opacity-40 text-black"
                                      )}
                                    />
                                    <button 
                                      onClick={() => removeChecklistItem(note.id, item.id)}
                                      className="opacity-0 group-hover/item:opacity-40 hover:!opacity-100"
                                    >
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
                      onClick={() => addChecklistItem(note.id)}
                      className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity pl-6 pt-2"
                    >
                      <Plus size={14} />
                      <span>Add Item</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Actions Overlay */}
              <div className="opacity-0 group-hover:opacity-100 flex items-center justify-between pt-4 transition-opacity">
                <div className="flex items-center space-x-2">
                  <div className="group/color relative">
                    <button className="p-2 rounded-full hover:bg-black/5">
                      <Palette size={16} />
                    </button>
                    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border p-2 flex gap-1 z-50 opacity-0 group-hover/color:opacity-100 transition-opacity">
                      {COLORS.map(c => (
                        <button 
                          key={c.name}
                          onClick={() => updateNote(note.id, { color: c.bg })}
                          className={cn("w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-125", c.bg)}
                        />
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => updateNote(note.id, { isChecklist: !note.isChecklist })}
                    className="p-2 rounded-full hover:bg-black/5"
                    title="Toggle Checklist"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => deleteNote(note.id)}
                  className="p-2 rounded-full hover:bg-black/5 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {notes.length === 0 && !isAdding && (
        <div className="flex flex-col items-center justify-center p-20 space-y-6 opacity-20">
          <div className="w-24 h-24 bg-slate-400 rounded-[2rem] flex items-center justify-center">
            <Sparkles size={48} className="text-white" />
          </div>
          <p className="font-display font-black text-xl uppercase tracking-widest text-center">Empty Cosmic Space</p>
        </div>
      )}
    </div>
  );
}
