import React, { useState } from 'react';
import { SystemSettings, WallpaperType, Shortcut } from '../../types';
import { Monitor, Volume2, Clock, Download, Upload, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { exportBackup, importBackup } from '../../utils/storage';
import { soundFx } from '../../utils/audio';

interface SettingsAppProps {
  settings: SystemSettings;
  shortcuts: Shortcut[];
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onRestoreDefaultShortcuts: () => void;
  onImportBackup: (shortcuts: Shortcut[], settings: SystemSettings) => void;
}

const WALLPAPER_OPTIONS: { id: WallpaperType; label: string; preview: string }[] = [
  { id: 'teal', label: 'Verde Acqua Classico Windows 95 (#008080)', preview: 'bg-[#008080] border border-teal-300' },
  { id: 'dark_slate', label: 'Blu Scuro Riposante (#2e3b4e)', preview: 'bg-[#2e3b4e] border border-slate-600' },
  { id: 'stars', label: 'Campo Stellare 3D Notturno', preview: 'bg-slate-950 border border-slate-600' },
  { id: 'grid', label: 'Griglia Scura Minimal', preview: 'bg-slate-900' },
  { id: 'matrix', label: 'Matrix Code Verde', preview: 'bg-black border border-green-500' },
  { id: 'blue_clouds', label: 'Nuvole Notturne', preview: 'bg-slate-800' },
  { id: 'custom', label: 'Sfondo Immagine Personalizzata', preview: 'bg-gray-700' },
];

export const SettingsApp: React.FC<SettingsAppProps> = ({
  settings,
  shortcuts,
  onUpdateSettings,
  onRestoreDefaultShortcuts,
  onImportBackup,
}) => {
  const [customUrl, setCustomUrl] = useState(settings.customWallpaperUrl || '');
  const [importStatus, setImportStatus] = useState('');

  const handleExport = () => {
    soundFx.playClick();
    const jsonStr = exportBackup(shortcuts, settings);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vintage_desktop_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackup(content);
      if (res) {
        soundFx.playStartup();
        onImportBackup(res.shortcuts, res.settings);
        setImportStatus('✅ Configurazione e icone ripristinate con successo!');
      } else {
        soundFx.playError();
        setImportStatus('❌ Errore nel formato del file JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs text-black p-2 overflow-y-auto gap-3">
      {/* Wallpapers Section */}
      <div className="win95-outset p-2 bg-gray-100 flex flex-col gap-2">
        <h3 className="font-bold text-sm text-[#000080] flex items-center gap-1.5 border-b pb-1">
          <ImageIcon size={16} /> Sfondo del Desktop
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {WALLPAPER_OPTIONS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => {
                soundFx.playClick();
                onUpdateSettings({ wallpaper: wp.id });
              }}
              className={`p-2 win95-button flex flex-col items-center gap-1.5 text-left ${
                settings.wallpaper === wp.id ? 'win95-button-pressed font-bold bg-blue-100' : ''
              }`}
            >
              <div className={`w-full h-10 ${wp.preview} rounded-xs shadow-inner`}></div>
              <span className="text-[11px] truncate w-full text-center">{wp.label}</span>
            </button>
          ))}
        </div>

        {settings.wallpaper === 'custom' && (
          <div className="mt-2 flex flex-col gap-1">
            <label className="font-bold">URL Immagine di Sfondo:</label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => {
                setCustomUrl(e.target.value);
                onUpdateSettings({ customWallpaperUrl: e.target.value });
              }}
              placeholder="https://images.unsplash.com/..."
              className="win95-inset p-1.5 w-full bg-white font-mono"
            />
          </div>
        )}
      </div>

      {/* Audio & Display Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="win95-outset p-2 bg-gray-100 flex flex-col gap-2">
          <h3 className="font-bold text-sm text-[#000080] flex items-center gap-1.5 border-b pb-1">
            <Monitor size={16} /> Monitor & Effetti
          </h3>
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={settings.enableCrtOverlay}
              onChange={(e) => {
                soundFx.playClick();
                onUpdateSettings({ enableCrtOverlay: e.target.checked });
              }}
            />
            <span>Attiva effetto righe CRT Monitor '90</span>
          </label>
        </div>

        <div className="win95-outset p-2 bg-gray-100 flex flex-col gap-2">
          <h3 className="font-bold text-sm text-[#000080] flex items-center gap-1.5 border-b pb-1">
            <Volume2 size={16} /> Suoni Vintage
          </h3>
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={settings.enableSound}
              onChange={(e) => {
                const checked = e.target.checked;
                soundFx.setSoundEnabled(checked);
                if (checked) soundFx.playClick();
                onUpdateSettings({ enableSound: checked });
              }}
            />
            <span>Effetti sonori Web Audio (Click/Beep)</span>
          </label>
        </div>
      </div>

      {/* Backup & Restore JSON */}
      <div className="win95-outset p-2 bg-gray-100 flex flex-col gap-2">
        <h3 className="font-bold text-sm text-[#000080] flex items-center gap-1.5 border-b pb-1">
          <Download size={16} /> Backup & Ripristino Icone e App
        </h3>
        <p className="text-[11px] text-gray-700">
          Esporta la tua configurazione personalizzata delle app per salvarla sul tuo computer o trasferirla su un altro browser.
        </p>

        {importStatus && (
          <div className="win95-inset bg-white p-2 font-bold text-xs">{importStatus}</div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handleExport}
            className="win95-button px-3 py-1.5 font-bold flex items-center gap-1.5 bg-[#000080] text-white"
          >
            <Download size={14} />
            <span>Esporta Backup (JSON)</span>
          </button>

          <label className="win95-button px-3 py-1.5 font-bold flex items-center gap-1.5 cursor-pointer bg-emerald-800 text-white">
            <Upload size={14} />
            <span>Importa Backup (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Ripristinare la configurazione e le icone predefinite di fabbrica?')) {
                soundFx.playTrash();
                onRestoreDefaultShortcuts();
              }
            }}
            className="win95-button px-3 py-1.5 font-bold flex items-center gap-1.5 text-red-900 bg-red-100 border-red-800 ml-auto"
          >
            <RotateCcw size={14} />
            <span>Ripristina Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};
