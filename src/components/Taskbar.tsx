import React, { useState, useEffect } from 'react';
import { WindowState, SystemSettings } from '../types';
import { IconMapper } from './IconMapper';
import { Volume2, VolumeX, Monitor, MonitorOff, LayoutGrid } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  isStartOpen: boolean;
  onToggleStart: () => void;
  onWindowClick: (id: string) => void;
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindowId,
  isStartOpen,
  onToggleStart,
  onWindowClick,
  settings,
  onUpdateSettings,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: !settings.clock24h,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.clock24h]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-9 bg-[#c0c0c0] win95-outset z-[9990] flex items-center px-1 select-none font-sans text-xs text-black">
      {/* Start Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          soundFx.playClick();
          onToggleStart();
        }}
        className={`win95-button px-2.5 py-1 flex items-center gap-1.5 font-bold cursor-pointer ${
          isStartOpen ? 'win95-button-pressed bg-gray-300' : 'hover:bg-gray-200'
        }`}
      >
        <LayoutGrid size={16} className="text-blue-800" />
        <span className="text-sm tracking-wide">Start</span>
      </button>

      <div className="mx-1 h-6 border-l border-gray-400 border-r border-white"></div>

      {/* Taskbar Window Buttons */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto h-full py-0.5 px-0.5">
        {windows.map((win) => {
          const isActive = activeWindowId === win.id && !win.isMinimized;
          return (
            <button
              key={win.id}
              onClick={() => {
                soundFx.playClick();
                onWindowClick(win.id);
              }}
              className={`h-7 max-w-44 min-w-28 px-2 flex items-center gap-1.5 truncate border transition-none text-left ${
                isActive
                  ? 'win95-button-pressed bg-[#e0e0e0] font-bold border-gray-600'
                  : 'win95-button bg-[#c0c0c0] font-normal hover:bg-gray-100'
              }`}
            >
              <IconMapper name={win.icon} size={14} className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate text-xs leading-none">{win.title}</span>
            </button>
          );
        })}
      </div>

      <div className="mx-1 h-6 border-l border-gray-400 border-r border-white"></div>

      {/* System Tray Area */}
      <div className="win95-inset px-2 py-0.5 flex items-center gap-2 bg-[#c0c0c0] text-black">
        {/* CRT Scanline Toggle */}
        <button
          onClick={() => {
            soundFx.playClick();
            onUpdateSettings({ enableCrtOverlay: !settings.enableCrtOverlay });
          }}
          className="p-0.5 hover:bg-gray-300 rounded-xs"
          title={settings.enableCrtOverlay ? 'Disattiva Effetto CRT Vintage' : 'Attiva Effetto CRT Vintage'}
        >
          {settings.enableCrtOverlay ? <Monitor size={14} className="text-green-800" /> : <MonitorOff size={14} className="text-gray-500" />}
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            const nextSound = !settings.enableSound;
            soundFx.setSoundEnabled(nextSound);
            if (nextSound) soundFx.playClick();
            onUpdateSettings({ enableSound: nextSound });
          }}
          className="p-0.5 hover:bg-gray-300 rounded-xs"
          title={settings.enableSound ? 'Muto Suoni Vintage' : 'Attiva Suoni Vintage'}
        >
          {settings.enableSound ? <Volume2 size={14} className="text-blue-900" /> : <VolumeX size={14} className="text-red-700" />}
        </button>

        {/* Digital Clock */}
        <button
          onClick={() => {
            soundFx.playClick();
            onUpdateSettings({ clock24h: !settings.clock24h });
          }}
          className="font-mono text-xs font-bold text-gray-900 tracking-wider hover:underline"
          title="Clicca per cambiare formato 12h/24h"
        >
          {timeStr}
        </button>
      </div>
    </div>
  );
};
