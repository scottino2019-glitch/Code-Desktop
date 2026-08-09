import React, { useState, useEffect } from 'react';
import { Shortcut } from '../types';
import { IconMapper } from './IconMapper';
import { soundFx } from '../utils/audio';

interface DesktopIconProps {
  shortcut: Shortcut;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (shortcut: Shortcut) => void;
  onEdit: (shortcut: Shortcut) => void;
  onDelete: (id: string) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  shortcut,
  isSelected,
  onSelect,
  onOpen,
  onEdit,
  onDelete,
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleOutsideClick = () => setContextMenu(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    onSelect(shortcut.id);
    onOpen(shortcut);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(shortcut.id);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative group select-none">
      <div
        onClick={handleClick}
        onDoubleClick={handleClick}
        onContextMenu={handleContextMenu}
        className="w-24 p-2 flex flex-col items-center justify-center cursor-pointer rounded-xs"
      >
        <div className="w-10 h-10 flex items-center justify-center text-amber-300 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.9)]">
          <IconMapper name={shortcut.icon} size={32} />
        </div>
        <span
          className={`mt-1 text-xs text-center leading-tight px-1 py-0.5 max-w-full truncate ${
            isSelected
              ? 'bg-[#000080] text-white font-bold border border-dotted border-white'
              : 'text-white font-medium drop-shadow-[1px_1px_1px_rgba(0,0,0,1)]'
          }`}
          title={shortcut.title}
        >
          {shortcut.title}
        </span>
      </div>

      {/* Right click Retro Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-[9999] w-40 win95-outset bg-[#c0c0c0] p-1 text-xs shadow-xl text-black font-sans"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu(null);
              onOpen(shortcut);
            }}
            className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2 font-bold"
          >
            📂 Apri
          </button>
          {!shortcut.isSystem && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setContextMenu(null);
                  onEdit(shortcut);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2"
              >
                ✏️ Modifica
              </button>
              <div className="my-1 border-t border-gray-400 border-b border-white"></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setContextMenu(null);
                  onDelete(shortcut.id);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2 text-red-900 hover:text-white"
              >
                🗑️ Elimina
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};


