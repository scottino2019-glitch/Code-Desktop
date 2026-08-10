import React, { useState, useEffect, useRef } from 'react';
import { Shortcut, SystemSettings, WindowState } from '../types';
import { DesktopIcon } from './DesktopIcon';
import { WindowFrame } from './WindowFrame';
import { AddShortcutModal } from './apps/AddShortcutModal';
import { HtmlRunnerApp } from './apps/HtmlRunnerApp';
import { WebBrowserApp } from './apps/WebBrowserApp';
import { SettingsApp } from './apps/SettingsApp';
import { MyComputerApp } from './apps/MyComputerApp';
import { NotepadApp } from './apps/NotepadApp';
import { RecycleBinApp } from './apps/RecycleBinApp';
import { SystemInfoModal } from './apps/SystemInfoModal';
import { soundFx } from '../utils/audio';

interface DesktopCanvasProps {
  shortcuts: Shortcut[];
  settings: SystemSettings;
  windows: WindowState[];
  activeWindowId: string | null;
  selectedIconId: string | null;
  onSelectIcon: (id: string | null) => void;
  onOpenShortcut: (shortcut: Shortcut) => void;
  onEditShortcut: (shortcut: Shortcut) => void;
  onDeleteShortcut: (id: string) => void;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onToggleMaximizeWindow: (id: string) => void;
  onSaveShortcut: (shortcutData: Partial<Shortcut>) => void;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onRestoreDefaultShortcuts: () => void;
  onImportBackup: (shortcuts: Shortcut[], settings: SystemSettings) => void;
  onRestoreFromBin: (id: string) => void;
  onPermanentDeleteFromBin: (id: string) => void;
  onEmptyBin: () => void;
}

export const DesktopCanvas: React.FC<DesktopCanvasProps> = ({
  shortcuts,
  settings,
  windows,
  activeWindowId,
  selectedIconId,
  onSelectIcon,
  onOpenShortcut,
  onEditShortcut,
  onDeleteShortcut,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
  onToggleMaximizeWindow,
  onSaveShortcut,
  onUpdateSettings,
  onRestoreDefaultShortcuts,
  onImportBackup,
  onRestoreFromBin,
  onPermanentDeleteFromBin,
  onEmptyBin,
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background style computation
  let bgStyle: React.CSSProperties = { backgroundColor: '#008080' };
  let bgClass = '';

  if (settings.wallpaper === 'teal') {
    bgStyle = { backgroundColor: '#008080' };
  } else if (settings.wallpaper === 'dark_slate') {
    bgStyle = { backgroundColor: '#2e3b4e' };
  } else if (settings.wallpaper === 'stars') {
    bgClass = 'bg-slate-950';
  } else if (settings.wallpaper === 'grid') {
    bgClass = 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900';
  } else if (settings.wallpaper === 'matrix') {
    bgClass = 'bg-black';
  } else if (settings.wallpaper === 'blue_clouds') {
    bgClass = 'bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950';
  } else if (settings.wallpaper === 'custom' && settings.customWallpaperUrl) {
    bgStyle = {
      backgroundImage: `url(${settings.customWallpaperUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  // Matrix Rain effect canvas when selected
  useEffect(() => {
    if (settings.wallpaper !== 'matrix') return;
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const cols = Math.floor(width / 20) + 1;
    const ypos = Array(cols).fill(0);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0f0';
      ctx.font = '15pt monospace';

      ypos.forEach((y, index) => {
        const text = String.fromCharCode(Math.floor(Math.random() * 128));
        const x = index * 20;
        ctx.fillText(text, x, y);

        if (y > 100 + Math.random() * 10000) {
          ypos[index] = 0;
        } else {
          ypos[index] = y + 20;
        }
      });
    }, 50);

    return () => {
      clearInterval(matrixInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, [settings.wallpaper]);

  // Handle Desktop Right Click Context Menu
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    // Only open context menu if clicking directly on background
    if ((e.target as HTMLElement).id === 'desktop-canvas') {
      e.preventDefault();
      onSelectIcon(null);
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const activeShortcuts = shortcuts.filter((s) => !s.isDeleted);
  const deletedShortcuts = shortcuts.filter((s) => s.isDeleted);

  return (
    <div
      id="desktop-canvas"
      style={bgStyle}
      onClick={() => onSelectIcon(null)}
      onContextMenu={handleDesktopContextMenu}
      className={`fixed inset-0 bottom-9 overflow-hidden select-none ${bgClass}`}
    >
      {/* Optional Matrix Canvas */}
      {settings.wallpaper === 'matrix' && (
        <canvas ref={matrixCanvasRef} className="absolute inset-0 pointer-events-none" />
      )}

      {/* Optional Starfield 90s background effect */}
      {settings.wallpaper === 'stars' && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-black pointer-events-none">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>
      )}

      {/* Optional Vaporwave Grid */}
      {settings.wallpaper === 'grid' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
          <div className="w-full h-1/2 bg-[linear-gradient(to_right,#ff007f_1px,transparent_1px),linear-gradient(to_bottom,#ff007f_1px,transparent_1px)] bg-[size:40px_40px] opacity-25 [perspective:1000px] [transform:rotateX(60deg)]"></div>
        </div>
      )}

      {/* CRT Scanlines Overlay */}
      {settings.enableCrtOverlay && (
        <div className="absolute inset-0 crt-overlay z-[9980]"></div>
      )}

      {/* Desktop Icons Grid */}
      <div className="relative z-10 p-4 h-full flex flex-col flex-wrap items-start content-start gap-4">
        {activeShortcuts.map((shortcut) => (
          <DesktopIcon
            key={shortcut.id}
            shortcut={shortcut}
            isSelected={selectedIconId === shortcut.id}
            onSelect={(id) => onSelectIcon(id)}
            onOpen={(sc) => onOpenShortcut(sc)}
            onEdit={(sc) => onEditShortcut(sc)}
            onDelete={(id) => onDeleteShortcut(id)}
          />
        ))}
      </div>

      {/* Open Application Windows */}
      {windows.map((win) => {
        const isActive = activeWindowId === win.id;
        return (
          <WindowFrame
            key={win.id}
            window={win}
            isActive={isActive}
            onFocus={() => onFocusWindow(win.id)}
            onClose={() => onCloseWindow(win.id)}
            onMinimize={() => onMinimizeWindow(win.id)}
            onToggleMaximize={() => onToggleMaximizeWindow(win.id)}
          >
            {/* Render App Content Based on Window AppType */}
            {win.appType === 'add_shortcut' && (
              <AddShortcutModal
                onSave={(data) => {
                  onSaveShortcut(data);
                  onCloseWindow(win.id);
                }}
                onClose={() => onCloseWindow(win.id)}
              />
            )}

            {win.appType === 'html_runner' && (
              <HtmlRunnerApp
                initialCode={win.htmlCode}
                initialTitle={win.title !== 'Editor App HTML' ? win.title : undefined}
                shortcutId={win.shortcutId}
                onSaveAsApp={(title, code, existingId) => {
                  onSaveShortcut({
                    id: existingId,
                    title,
                    type: 'html_content',
                    htmlContent: code,
                    icon: 'Code2',
                    category: 'Miei Programmi',
                  });
                }}
              />
            )}

            {win.appType === 'browser' && (
              <WebBrowserApp
                initialUrl={win.contentUrl || 'https://www.google.com/search?igu=1'}
                appName={win.title}
                onCloseAppWindow={() => onCloseWindow(win.id)}
              />
            )}

            {win.appType === 'my_computer' && (
              <MyComputerApp
                shortcuts={shortcuts}
                onOpenShortcut={(sc) => onOpenShortcut(sc)}
                onEditShortcut={(sc) => onEditShortcut(sc)}
                onDeleteShortcut={(id) => onDeleteShortcut(id)}
                onAddNewShortcut={() => {
                  onOpenShortcut({
                    id: 'add_new_link',
                    title: 'Aggiungi App',
                    icon: 'PlusCircle',
                    type: 'app',
                    appType: 'add_shortcut',
                    createdAt: Date.now(),
                  });
                }}
              />
            )}

            {win.appType === 'settings' && (
              <SettingsApp
                settings={settings}
                shortcuts={shortcuts}
                onUpdateSettings={onUpdateSettings}
                onRestoreDefaultShortcuts={onRestoreDefaultShortcuts}
                onImportBackup={onImportBackup}
              />
            )}

            {win.appType === 'notepad' && <NotepadApp />}

            {win.appType === 'recycle_bin' && (
              <RecycleBinApp
                deletedShortcuts={deletedShortcuts}
                onRestore={onRestoreFromBin}
                onPermanentDelete={onPermanentDeleteFromBin}
                onEmptyBin={onEmptyBin}
              />
            )}

            {win.appType === 'system_info' && <SystemInfoModal />}

            {win.appType === 'html_viewer' && (
              <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs text-black">
                {/* HTML App Action Bar */}
                <div className="win95-outset p-1 flex items-center justify-between gap-2 bg-[#c0c0c0] border-b border-gray-400">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="font-bold flex items-center gap-1 text-[#000080] truncate">
                      📱 {win.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        onOpenShortcut({
                          id: win.shortcutId || `html_edit_${Date.now()}`,
                          title: win.title,
                          icon: 'Code2',
                          type: 'app',
                          appType: 'html_runner',
                          htmlContent: win.htmlCode,
                          createdAt: Date.now(),
                        });
                      }}
                      className="win95-button px-2 py-1 flex items-center gap-1 font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-400"
                      title="Apri il codice di questa app nell'Editor HTML per modificarlo e salvarlo"
                    >
                      <span>✏️ Modifica Codice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        try {
                          const blob = new Blob([win.htmlCode || ''], { type: 'text/html;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          const safeFilename = win.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'app';
                          link.href = url;
                          link.download = `${safeFilename}.html`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                        } catch (e) {
                          alert('Errore nel download del file.');
                        }
                      }}
                      className="win95-button px-2 py-1 flex items-center gap-1 hover:bg-gray-200"
                      title="Scarica il file .html nel tuo computer"
                    >
                      <span>💾 Scarica .html</span>
                    </button>
                  </div>
                </div>

                <div className="win95-inset flex-1 w-full bg-white relative overflow-hidden">
                  <iframe
                    title={win.title}
                    srcDoc={win.htmlCode || '<h1>Senza contenuto</h1>'}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-modals allow-forms"
                  />
                </div>
              </div>
            )}
          </WindowFrame>
        );
      })}

      {/* Desktop Background Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-[9999] w-48 win95-outset bg-[#c0c0c0] p-1 text-xs shadow-xl text-black font-sans"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu(null);
              onOpenShortcut({
                id: 'add_new_link',
                title: 'Aggiungi App / Link',
                icon: 'PlusCircle',
                type: 'app',
                appType: 'add_shortcut',
                createdAt: Date.now(),
              });
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 font-bold text-blue-900 hover:text-white"
          >
            ➕ Nuovo Collegamento / App
          </button>
          <div className="my-1 border-t border-gray-400 border-b border-white"></div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu(null);
              onOpenShortcut({
                id: 'settings',
                title: 'Impostazioni',
                icon: 'Settings',
                type: 'app',
                appType: 'settings',
                createdAt: Date.now(),
              });
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
          >
            🖼️ Cambia Sfondo Desktop
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu(null);
              onOpenShortcut({
                id: 'system_info',
                title: 'Info Sistema',
                icon: 'Info',
                type: 'app',
                appType: 'system_info',
                createdAt: Date.now(),
              });
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
          >
            ❓ Guida Homepage
          </button>
        </div>
      )}
    </div>
  );
};
