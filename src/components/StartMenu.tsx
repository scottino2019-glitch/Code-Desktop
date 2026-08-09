import React, { useState, useEffect } from 'react';
import { PlusCircle, HardDrive, Code2, FileText, Settings, Info, Trash2, Power, Download } from 'lucide-react';
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    soundFx.playClick();
    action();
    onClose();
  };

  const handleInstallPWA = async () => {
    soundFx.playClick();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("📲 Istruzioni Installazione PWA App:\n\n• Su Chrome/Edge (Android / PC / Mac): Clicca i tre puntini in alto a destra nel browser e seleziona 'Installa App' o 'Aggiungi a Schermata Home'.\n• Su Safari (iPhone/iPad): Clicca l'icona 'Condividi' in basso e seleziona 'Aggiungi alla schermata Home'.");
    }
    onClose();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-10 left-1 z-[9999] w-68 win95-outset bg-[#c0c0c0] p-1 flex shadow-2xl font-sans text-black"
    >
      {/* 90s Vertical Banner */}
      <div className="w-8 bg-gradient-to-b from-[#000080] via-[#1084d0] to-[#000080] flex items-end justify-center py-3 select-none">
        <span className="text-white font-bold text-sm tracking-widest -rotate-90 whitespace-nowrap drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
          VINTAGE <span className="text-amber-300">OS '95</span>
        </span>
      </div>

      {/* Start Menu Options */}
      <div className="flex-1 py-1 flex flex-col gap-0.5 text-xs font-sans">
        <button
          onClick={() => handleAction(() => onOpenApp('add_shortcut'))}
          className="w-full text-left px-3 py-2 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 font-bold text-slate-900 hover:text-white"
        >
          <PlusCircle size={18} className="text-slate-800 hover:text-white" />
          <span>Aggiungi App / Link</span>
        </button>

        <button
          onClick={handleInstallPWA}
          className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 font-bold bg-amber-100/80 hover:bg-[#000080] hover:text-white text-blue-900 border border-amber-300"
        >
          <Download size={16} className="text-blue-800 hover:text-white" />
          <span>📲 Installa come App (PWA)</span>
        </button>

        <div className="my-1 border-t border-gray-400 border-b border-white"></div>

        <button
          onClick={() => handleAction(() => onOpenApp('my_computer'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5"
        >
          <HardDrive size={16} />
          <span>Risorse di Sistema</span>
        </button>

        <button
          onClick={() => handleAction(() => onOpenApp('html_runner'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5"
        >
          <Code2 size={16} />
          <span>Editor App HTML</span>
        </button>

        <button
          onClick={() => handleAction(() => onOpenApp('notepad'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5"
        >
          <FileText size={16} />
          <span>Blocco Note</span>
        </button>

        <button
          onClick={() => handleAction(() => onOpenApp('settings'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5"
        >
          <Settings size={16} />
          <span>Impostazioni Desktop</span>
        </button>

        <button
          onClick={() => handleAction(() => onOpenApp('system_info'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5"
        >
          <Info size={16} />
          <span>Guida & Info Sistema</span>
        </button>

        <button
          onClick={() => handleAction(() => onOpenApp('recycle_bin'))}
          className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5"
        >
          <Trash2 size={16} />
          <span>Cestino</span>
        </button>

        <div className="my-1 border-t border-gray-400 border-b border-white"></div>

        <button
          onClick={() => handleAction(onShutdown)}
          className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 text-red-900 hover:text-white font-semibold"
        >
          <Power size={16} />
          <span>Spegni Computer...</span>
        </button>
      </div>
    </div>
  );
};
