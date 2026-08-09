import React from 'react';
import { PlusCircle, HardDrive, Code2, FileText, Settings, Info, Trash2, Power } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appType: string) => void;
  onShutdown: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  onShutdown,
}) => {
  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    soundFx.playClick();
    action();
    onClose();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-10 left-1 z-[9999] w-64 win95-outset bg-[#c0c0c0] p-1 flex shadow-2xl font-sans text-black"
    >
      {/* 90s Vertical Banner */}
      <div className="w-8 bg-gradient-to-b from-[#1e293b] via-[#334155] to-[#1e293b] flex items-end justify-center py-3 select-none">
        <span className="text-white font-bold text-sm tracking-widest -rotate-90 whitespace-nowrap drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
          VINTAGE <span className="text-slate-300">OS '95</span>
        </span>
      </div>

      {/* Start Menu Options */}
      <div className="flex-1 py-1 flex flex-col gap-0.5 text-xs font-sans">
        <button
          onClick={() => handleAction(() => onOpenApp('add_shortcut'))}
          className="w-full text-left px-3 py-2 hover:bg-[#1e293b] hover:text-white flex items-center gap-2.5 font-bold text-slate-800 hover:text-white"
        >
          <PlusCircle size={18} className="text-slate-700 hover:text-white" />
          <span>Aggiungi App / Link</span>
        </button>

        <div className="my-1 border-t border-gray-400 border-b border-white"></div>

        <button
          onClick={() => handleAction(() => onOpenApp('my_computer'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#1e293b] hover:text-white flex items-center gap-2.5"
        >
          <HardDrive size={16} />
          <span>Risorse di Sistema</span>
        </button>

        <button
          onClick={() => handleAction(() => onOpenApp('html_runner'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#1e293b] hover:text-white flex items-center gap-2.5"
        >
          <Code2 size={16} />
          <span>Editor App HTML</span>
        </button>

        <button
          onClick={() => handleAction(() => onOpenApp('notepad'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#1e293b] hover:text-white flex items-center gap-2.5"
        >
          <FileText size={16} />
          <span>Blocco Note</span>
        </button>

        <button
          onClick={() => handleAction(() => onOpenApp('settings'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#1e293b] hover:text-white flex items-center gap-2.5"
        >
          <Settings size={16} />
          <span>Impostazioni Desktop</span>
        </button>

        <button
          onClick={() => handleAction(() => onOpenApp('system_info'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#1e293b] hover:text-white flex items-center gap-2.5"
        >
          <Info size={16} />
          <span>Guida & Info Sistema</span>
        </button>

        <button
          onClick={() => handleAction(() => onOpenApp('recycle_bin'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#1e293b] hover:text-white flex items-center gap-2.5"
        >
          <Trash2 size={16} />
          <span>Cestino</span>
        </button>

        <div className="my-1 border-t border-gray-400 border-b border-white"></div>

        <button
          onClick={() => handleAction(onShutdown)}
          className="w-full text-left px-3 py-1.5 hover:bg-[#1e293b] hover:text-white flex items-center gap-2.5 text-red-900 hover:text-white font-semibold"
        >
          <Power size={16} />
          <span>Spegni Computer...</span>
        </button>
      </div>
    </div>
  );
};
