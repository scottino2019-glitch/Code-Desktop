import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types';
import { IconMapper } from './IconMapper';
import { Minus, Square, X, Copy } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface WindowFrameProps {
  window: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  children,
}) => {
  const [pos, setPos] = useState(win.position);
  const [size, setSize] = useState(win.size);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; posX: number; posY: number }>({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStartRef = useRef<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });

  // Handle Dragging
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    onFocus();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: pos.x,
      posY: pos.y,
    };
  };

  // Handle Resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (win.isMaximized) return;
    onFocus();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        setPos({
          x: Math.max(0, dragStartRef.current.posX + dx),
          y: Math.max(0, dragStartRef.current.posY + dy),
        });
      } else if (isResizing) {
        const dx = e.clientX - resizeStartRef.current.x;
        const dy = e.clientY - resizeStartRef.current.y;
        setSize({
          width: Math.max(280, resizeStartRef.current.w + dx),
          height: Math.max(200, resizeStartRef.current.h + dy),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  if (win.isMinimized) {
    return null;
  }

  const windowStyle: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 38px)', // taskbar height
        zIndex: win.zIndex,
      }
    : {
        position: 'absolute',
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      onClick={onFocus}
      style={windowStyle}
      className={`win95-outset p-1 flex flex-col shadow-2xl text-black font-sans ${
        isActive ? 'ring-1 ring-black/50' : 'opacity-95'
      }`}
    >
      {/* 90s Titlebar */}
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={onToggleMaximize}
        className={`flex items-center justify-between px-2 py-1 select-none cursor-move ${
          isActive ? 'win95-titlebar font-bold' : 'win95-titlebar-inactive font-medium'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0 pr-2">
          <IconMapper name={win.icon} size={16} className="w-4 h-4 text-slate-200 flex-shrink-0" />
          <span className="text-xs truncate tracking-wide leading-none">{win.title}</span>
        </div>

        {/* Window Controls: Minimize, Maximize, Close */}
        <div className="flex items-center gap-1 flex-shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              soundFx.playClick();
              onMinimize();
            }}
            className="win95-button w-5 h-4 flex items-center justify-center text-black text-xs font-bold hover:bg-gray-300"
            title="Riduci a icona"
          >
            <Minus size={11} />
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onToggleMaximize();
            }}
            className="win95-button w-5 h-4 flex items-center justify-center text-black text-xs font-bold hover:bg-gray-300"
            title={win.isMaximized ? 'Ripristina' : 'Ingrandisci'}
          >
            {win.isMaximized ? <Copy size={10} /> : <Square size={10} />}
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="win95-button w-5 h-4 flex items-center justify-center text-black text-xs font-bold hover:bg-red-200 hover:text-red-900 ml-1"
            title="Chiudi"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Main Window Body */}
      <div className="flex-1 bg-[#c0c0c0] p-1 flex flex-col min-h-0 relative overflow-hidden">
        {children}
      </div>

      {/* Bottom right resize handle (if not maximized) */}
      {!win.isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 select-none opacity-60 hover:opacity-100"
          title="Ridimensiona"
        >
          <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-gray-600"></div>
        </div>
      )}
    </div>
  );
};
