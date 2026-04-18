import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Transformer, Image as KonvaImage, Star, RegularPolygon, Path } from 'react-konva';
import useImage from 'use-image';
import { Type, Square, Circle as CircleIcon, Image as ImageIcon, Trash2, RotateCcw, MousePointer2, Sticker, Star as StarIcon, Triangle as TriangleIcon, Heart as HeartIcon, Hexagon } from 'lucide-react';
import { VisionBoardItem, ThemeType } from '../types';
import { cn } from '@/src/lib/utils';

interface VisionViewProps {
  month: number;
  year: number;
  items: VisionBoardItem[];
  onUpdate: (items: VisionBoardItem[]) => void;
  theme: ThemeType;
}

const STICKERS = ['✨', '🌸', '💫', '🌈', '💖', '🍀', '🌟', '🦄', '🎀', '🍭', '🦋', '🎈', '🔥', '👑', '💎', '🚀'];

const URLImage = ({ item, isSelected, onSelect, onChange }: { 
  item: VisionBoardItem; 
  isSelected: boolean; 
  onSelect: () => void;
  onChange: (newAttrs: VisionBoardItem) => void;
}) => {
  const [img] = useImage(item.src || '');
  const shapeRef = useRef<any>(null);

  return (
    <KonvaImage
      image={img}
      id={item.id}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      rotation={item.rotation}
      scaleX={item.scaleX}
      scaleY={item.scaleY}
      onClick={onSelect}
      onTap={onSelect}
      ref={shapeRef}
      draggable
      onDragEnd={(e) => {
        onChange({
          ...item,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        onChange({
          ...item,
          x: node.x(),
          y: node.y(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
          rotation: node.rotation()
        });
      }}
    />
  );
};

export default function VisionView({ month, year, items, onUpdate, theme }: VisionViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempText, setTempText] = useState('');
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({ 
        width: containerRef.current.clientWidth, 
        height: containerRef.current.clientHeight 
      });
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddField = (type: string, src?: string, text?: string) => {
    const defaultFill = {
      text: theme === 'dark' ? '#FFFFFF' : '#000000',
      circle: '#b2d8e9',
      rect: '#f9bcd3',
      star: '#ffd9a1',
      triangle: '#d1c1dc',
      hexagon: '#b2d8e9',
      heart: '#f9bcd3'
    }[type] || '#f9bcd3';

    const newItem: VisionBoardItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: type as any,
      x: containerSize.width / 2 - 50,
      y: containerSize.height / 2 - 50,
      width: 100,
      height: 100,
      fill: defaultFill,
      text: text || (type === 'text' ? 'New Text' : undefined),
      fontSize: type === 'text' || text ? 30 : undefined,
      src,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    onUpdate([...items, newItem]);
    setSelectedId(newItem.id);

    if (type === 'text' && !text) {
      setTimeout(() => startEditing(newItem.id, 'New Text'), 100);
    }
  };

  const startEditing = (id: string, currentText: string) => {
    setEditingId(id);
    setTempText(currentText);
    setSelectedId(null);
  };

  const finishEditing = () => {
    if (editingId) {
      onUpdate(items.map(item => item.id === editingId ? { ...item, text: tempText } : item));
      setEditingId(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleAddField('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemChange = (newItem: VisionBoardItem) => {
    onUpdate(items.map(item => item.id === newItem.id ? newItem : item));
  };

  const handleDelete = () => {
    if (selectedId) {
      onUpdate(items.filter(item => item.id !== selectedId));
      setSelectedId(null);
    }
  };

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const stage = transformerRef.current.getStage();
      const selectedNode = stage.findOne('#' + selectedId);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId]);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-baseline">
        <h2 className={cn(
          "text-5xl font-display font-black uppercase tracking-tight transition-all duration-500",
          theme === 'dark' ? "text-white" : "text-black"
        )}>
          Vision Board
        </h2>
        <span className={cn(
          "font-display font-black text-2xl uppercase transition-all duration-500",
          theme === 'dark' ? "text-[#D1C1DC]" : "text-[#d1c1dc]"
        )}>
          {new Date(year, month).toLocaleString('default', { month: 'long' })} {year}
        </span>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Toolbar */}
        <div className={cn(
          "w-20 rounded-[2rem] shadow-xl border-4 flex flex-col items-center py-6 space-y-4 transition-all duration-500",
          theme === 'light' && "bg-white border-[#FFF9F2]",
          theme === 'dark' && "bg-white/5 border-white/10",
          theme === 'medium' && "bg-white border-slate-200"
        )}>
          <button 
            onClick={() => setSelectedId(null)}
            className={cn(
              "p-3 rounded-2xl transition-all", 
              !selectedId 
                ? (theme === 'dark' ? "bg-[#5BC0F8] text-black" : "bg-[#b2d8e9] text-white") 
                : (theme === 'dark' ? "text-white/40 hover:bg-white/10" : "text-[#b2d8e9] hover:bg-[#b2d8e9]/10")
            )}
            title="Select"
          >
            <MousePointer2 size={24} />
          </button>
          
          <div className={cn("w-8 h-1 rounded-full", theme === 'dark' ? "bg-white/10" : "bg-[#FFF9F2]")} />
          
          <button 
            onClick={() => handleAddField('text')}
            className={cn("p-3 rounded-2xl transition-all", theme === 'dark' ? "text-[#D1C1DC] hover:bg-white/10" : "text-[#d1c1dc] hover:bg-[#d1c1dc]/10")}
            title="Add Text"
          >
            <Type size={24} />
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={cn("p-3 rounded-2xl transition-all", theme === 'dark' ? "text-[#f9bcd3] hover:bg-white/10" : "text-[#f9bcd3] hover:bg-[#f9bcd3]/10")}
            title="Add Image"
          >
            <ImageIcon size={24} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
          
          <button 
            onClick={() => handleAddField('rect')}
            className={cn("p-3 rounded-2xl transition-all", theme === 'dark' ? "text-[#ffd9a1] hover:bg-white/10" : "text-[#ffd9a1] hover:bg-[#ffd9a1]/10")}
            title="Add Shape"
          >
            <Square size={24} />
          </button>
          
          <button 
            onClick={() => handleAddField('circle')}
            className={cn("p-3 rounded-2xl transition-all", theme === 'dark' ? "text-[#b2d8e9] hover:bg-white/10" : "text-[#b2d8e9] hover:bg-[#b2d8e9]/10")}
            title="Add Circle"
          >
            <CircleIcon size={24} />
          </button>

          <button 
            onClick={() => handleAddField('star')}
            className={cn("p-3 rounded-2xl transition-all", theme === 'dark' ? "text-[#ffd9a1] hover:bg-white/10" : "text-[#ffd9a1] hover:bg-[#ffd9a1]/10")}
            title="Add Star"
          >
            <StarIcon size={24} />
          </button>

          <button 
            onClick={() => handleAddField('triangle')}
            className={cn("p-3 rounded-2xl transition-all", theme === 'dark' ? "text-[#d1c1dc] hover:bg-white/10" : "text-[#d1c1dc] hover:bg-[#d1c1dc]/10")}
            title="Add Triangle"
          >
            <TriangleIcon size={24} />
          </button>

          <button 
            onClick={() => handleAddField('hexagon')}
            className={cn("p-3 rounded-2xl transition-all", theme === 'dark' ? "text-[#b2d8e9] hover:bg-white/10" : "text-[#b2d8e9] hover:bg-[#b2d8e9]/10")}
            title="Add Hexagon"
          >
            <Hexagon size={24} />
          </button>

          <button 
            onClick={() => handleAddField('heart')}
            className={cn("p-3 rounded-2xl transition-all", theme === 'dark' ? "text-[#f9bcd3] hover:bg-white/10" : "text-[#f9bcd3] hover:bg-[#f9bcd3]/10")}
            title="Add Heart"
          >
            <HeartIcon size={24} />
          </button>

          <div className="group relative">
            <button 
              className={cn("p-3 rounded-2xl transition-all", theme === 'dark' ? "text-[#f9bcd3] hover:bg-white/10" : "text-[#f9bcd3] hover:bg-[#f9bcd3]/10")}
              title="Add Sticker"
            >
              <Sticker size={24} />
            </button>
            <div className={cn(
              "absolute left-full ml-4 top-0 shadow-2xl rounded-2xl p-4 grid grid-cols-4 gap-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50 w-48 border-4",
              theme === 'light' && "bg-white border-[#FFF9F2]",
              theme === 'dark' && "bg-slate-900 border-white/10",
              theme === 'medium' && "bg-white border-slate-200"
            )}>
              {STICKERS.map(s => (
                <button 
                  key={s} 
                  onClick={() => handleAddField('text', undefined, s)}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-auto space-y-4 flex flex-col items-center">
            {selectedId && (
              <button 
                onClick={handleDelete}
                className={cn(
                  "p-3 rounded-2xl transition-all",
                  theme === 'dark' ? "text-red-400/60 hover:text-red-400 hover:bg-white/10" : "text-red-400 hover:bg-red-50"
                )}
                title="Delete Selected"
              >
                <Trash2 size={24} />
              </button>
            )}
            <button 
              onClick={() => onUpdate([])}
              className={cn(
                "p-3 rounded-2xl transition-all",
                theme === 'dark' ? "text-white/20 hover:text-white/60 hover:bg-white/5" : "text-slate-300 hover:text-slate-600"
              )}
              title="Clear Canvas"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          ref={containerRef}
          className={cn(
            "flex-1 rounded-[3rem] shadow-inner border-8 overflow-hidden relative transition-all duration-500",
            theme === 'light' && "bg-white border-white",
            theme === 'dark' && "bg-white border-white/5",
            theme === 'medium' && "bg-white border-slate-200"
          )}
          style={{ backgroundImage: `radial-gradient(${theme === 'dark' ? '#333' : '#f0f0f0'} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}
        >
          <Stage
            ref={stageRef}
            width={containerSize.width}
            height={containerSize.height}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            onDblClick={(e) => {
              if (e.target === e.target.getStage()) return;
              const node = e.target;
              if (node.className === 'Text') {
                const id = node.id();
                const item = items.find(i => i.id === id);
                if (item) startEditing(id, item.text || '');
              }
            }}
          >
            <Layer>
              {items.map((item) => {
                const shapeProps = {
                  id: item.id,
                  x: item.x,
                  y: item.y,
                  rotation: item.rotation,
                  scaleX: item.scaleX,
                  scaleY: item.scaleY,
                  draggable: true,
                  onClick: () => setSelectedId(item.id),
                  onTap: () => setSelectedId(item.id),
                  onDragEnd: (e: any) => {
                    handleItemChange({
                      ...item,
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  },
                  onTransformEnd: (e: any) => {
                    const node = e.target;
                    handleItemChange({
                      ...item,
                      x: node.x(),
                      y: node.y(),
                      scaleX: node.scaleX(),
                      scaleY: node.scaleY(),
                      rotation: node.rotation(),
                    });
                  },
                };

                switch (item.type) {
                  case 'rect':
                    return <Rect key={item.id} {...shapeProps} width={item.width} height={item.height} fill={item.fill} />;
                  case 'circle':
                    return <Circle key={item.id} {...shapeProps} radius={(item.width || 100) / 2} fill={item.fill} />;
                  case 'star':
                    return <Star key={item.id} {...shapeProps} innerRadius={25} outerRadius={50} numPoints={5} fill={item.fill} />;
                  case 'triangle':
                    return <RegularPolygon key={item.id} {...shapeProps} sides={3} radius={50} fill={item.fill} />;
                  case 'hexagon':
                    return <RegularPolygon key={item.id} {...shapeProps} sides={6} radius={50} fill={item.fill} />;
                  case 'heart':
                    return (
                      <Path 
                        key={item.id} 
                        {...shapeProps} 
                        data="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                        fill={item.fill}
                        scaleX={item.scaleX * 4}
                        scaleY={item.scaleY * 4}
                        offsetX={12}
                        offsetY={12}
                      />
                    );
                  case 'text':
                    return (
                      <Text 
                        key={item.id} 
                        {...shapeProps} 
                        text={item.text} 
                        fontSize={item.fontSize} 
                        fontFamily="Quicksand" 
                        fontStyle="bold"
                        fill={item.fill} 
                        onDblClick={() => startEditing(item.id, item.text || '')}
                        onDblTap={() => startEditing(item.id, item.text || '')}
                      />
                    );
                  case 'image':
                    return (
                      <URLImage 
                        key={item.id} 
                        item={item} 
                        isSelected={item.id === selectedId}
                        onSelect={() => setSelectedId(item.id)}
                        onChange={handleItemChange}
                      />
                    );
                  default:
                    return null;
                }
              })}
              <Transformer 
                ref={transformerRef} 
                boundBoxFunc={(oldBox, newBox) => {
                  if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
                anchorSize={8}
                anchorCornerRadius={4}
                anchorFill={theme === 'dark' ? '#5BC0F8' : "#b2d8e9"}
                anchorStroke="#ffffff"
                borderStroke={theme === 'dark' ? '#5BC0F8' : "#b2d8e9"}
              />
            </Layer>
          </Stage>
          
          <div className={cn(
            "absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full font-display font-black text-xs uppercase tracking-widest shadow-xl transition-all",
            theme === 'dark' ? "bg-[#5BC0F8] text-black shadow-[#5BC0F8]/20" : "bg-[#b2d8e9] text-white shadow-[#b2d8e9]/30"
          )}>
             Double-click text to edit • Drag & Resize
          </div>

          {editingId && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className={cn(
                "p-8 rounded-[3rem] shadow-2xl space-y-6 w-full max-w-md border-8 animate-in zoom-in duration-200 transition-all",
                theme === 'light' && "bg-white border-[#FFF9F2]",
                theme === 'dark' && "bg-slate-900 border-white/10",
                theme === 'medium' && "bg-white border-slate-200"
              )}>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-[#f9bcd3] tracking-[0.2em]">Live Edit</p>
                  <h3 className={cn("text-2xl font-display font-black", theme === 'dark' ? "text-white" : "text-slate-800")}>Update Content</h3>
                </div>
                <textarea
                  autoFocus
                  className={cn(
                    "w-full h-32 p-6 rounded-[2rem] border-4 outline-none font-display font-black text-xl transition-all resize-none shadow-inner",
                    theme === 'light' && "bg-[#FFF9F2] border-transparent focus:border-[#b2d8e9] text-slate-700 placeholder:text-slate-300",
                    theme === 'dark' && "bg-white/5 border-white/10 focus:border-[#FFCC00] text-white placeholder:text-white/10",
                    theme === 'medium' && "bg-slate-50 border-slate-100 focus:border-slate-300 text-slate-700 placeholder:text-slate-300"
                  )}
                  value={tempText}
                  placeholder="Type something magical..."
                  onChange={(e) => setTempText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      finishEditing();
                    }
                    if (e.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                />
                <div className="flex gap-3">
                  <button 
                    onClick={() => setEditingId(null)}
                    className={cn(
                      "flex-1 py-4 rounded-2xl font-display font-black uppercase tracking-widest transition-all",
                      theme === 'dark' ? "bg-white/5 text-white/40 hover:bg-white/10" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    )}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={finishEditing}
                    className={cn(
                      "flex-[1.5] py-4 rounded-2xl font-display font-black uppercase tracking-widest shadow-lg transition-all",
                      theme === 'light' && "bg-[#b2d8e9] text-white shadow-[#b2d8e9]/30 hover:scale-105 active:scale-95",
                      theme === 'dark' && "bg-[#5BC0F8] text-black shadow-[#5BC0F8]/20 hover:scale-105 active:scale-95",
                      theme === 'medium' && "bg-slate-700 text-white shadow-none hover:bg-slate-800"
                    )}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
