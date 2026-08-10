import React, { useState, useEffect } from 'react';
import { Shortcut, SystemSettings, WindowState, AppType } from './types';
import { loadShortcuts, saveShortcuts, loadSettings, saveSettings } from './utils/storage';
import { DEFAULT_SHORTCUTS } from './data/defaultShortcuts';
import { DesktopCanvas } from './components/DesktopCanvas';
import { Taskbar } from './components/Taskbar';
import { StartMenu } from './components/StartMenu';
import { AddShortcutModal } from './components/apps/AddShortcutModal';
import { soundFx } from './utils/audio';

export default function App() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(loadSettings());
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
  const [isShutdown, setIsShutdown] = useState(false);
  const [topZ, setTopZ] = useState(100);

  // Initialize shortcuts and settings on mount
  useEffect(() => {
    const loadedSc = loadShortcuts();
    setShortcuts(loadedSc);
    soundFx.setSoundEnabled(settings.enableSound);
  }, []);

  // Save shortcuts when updated
  const updateShortcutsState = (newShortcuts: Shortcut[]) => {
    setShortcuts(newShortcuts);
    saveShortcuts(newShortcuts);
  };

  // Save settings when updated
  const handleUpdateSettings = (newSettingsPartial: Partial<SystemSettings>) => {
    const updated = { ...settings, ...newSettingsPartial };
    setSettings(updated);
    saveSettings(updated);
  };

  // Window Focus Handler
  const bringToFocus = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex || 100), 100) + 1;
      setTopZ(maxZ + 1);
      return prev.map((win) =>
        win.id === id ? { ...win, zIndex: maxZ, isMinimized: false } : win
      );
    });
    setActiveWindowId(id);
  };

  // Open a Shortcut / App
  const handleOpenShortcut = (shortcut: Shortcut) => {
    if (!shortcut) return;

    // Special handling for HTML runner (Editor) when passing custom code
    if (shortcut.appType === 'html_runner') {
      const existingRunner = windows.find((w) => w.appType === 'html_runner');
      if (existingRunner) {
        if (shortcut.htmlContent !== undefined) {
          setWindows((prev) =>
            prev.map((w) =>
              w.id === existingRunner.id
                ? {
                    ...w,
                    htmlCode: shortcut.htmlContent,
                    title: shortcut.title !== 'Editor App HTML' ? shortcut.title : w.title,
                    shortcutId: shortcut.id.startsWith('html_edit_') ? undefined : shortcut.id,
                  }
                : w
            )
          );
        }
        bringToFocus(existingRunner.id);
        return;
      }
    }

    // Check if window already exists for this exact shortcut ID
    const existingWindow = windows.find(
      (w) => w.shortcutId === shortcut.id || (shortcut.appType && w.appType === shortcut.appType)
    );

    if (existingWindow) {
      // If opening an existing HTML viewer, ensure its code is fresh from the shortcut
      if (existingWindow.appType === 'html_viewer' && shortcut.htmlContent !== undefined) {
        setWindows((prev) =>
          prev.map((w) =>
            w.id === existingWindow.id
              ? { ...w, htmlCode: shortcut.htmlContent, title: shortcut.title }
              : w
          )
        );
      }
      bringToFocus(existingWindow.id);
      return;
    }

    soundFx.playWindowOpen();
    const nextZ = Math.max(topZ, ...windows.map((w) => w.zIndex || 100)) + 1;
    setTopZ(nextZ + 1);

    let appType: AppType | 'external_viewer' | 'html_viewer' = shortcut.appType || 'my_computer';
    if (shortcut.type === 'external_link') appType = 'browser';
    if (shortcut.type === 'html_content') appType = 'html_viewer';

    const newWin: WindowState = {
      id: `win_${shortcut.id}_${Date.now()}`,
      shortcutId: shortcut.id.startsWith('html_edit_') ? undefined : shortcut.id,
      title: shortcut.title,
      icon: shortcut.icon,
      appType,
      contentUrl: shortcut.url,
      htmlCode: shortcut.htmlContent,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
      position: { x: 50 + (windows.length % 5) * 30, y: 40 + (windows.length % 5) * 25 },
      size: { width: 680, height: 480 },
    };

    setWindows((prev) => [...prev, newWin]);
    setActiveWindowId(newWin.id);
  };

  // Open App from Start Menu or System Action
  const handleOpenSystemApp = (appTypeStr: string) => {
    soundFx.playWindowOpen();
    const appType = appTypeStr as AppType;
    const existingWin = windows.find((w) => w.appType === appType);
    if (existingWin) {
      bringToFocus(existingWin.id);
      return;
    }

    const newZ = topZ + 1;
    setTopZ(newZ);

    let title = 'Applicazione';
    let icon = 'HardDrive';

    switch (appType) {
      case 'add_shortcut': title = 'Aggiungi Nuova App / Link'; icon = 'PlusCircle'; break;
      case 'my_computer': title = 'Risorse di Sistema'; icon = 'HardDrive'; break;
      case 'html_runner': title = 'Editor App HTML'; icon = 'Code2'; break;
      case 'notepad': title = 'Blocco Note'; icon = 'FileText'; break;
      case 'settings': title = 'Impostazioni Desktop'; icon = 'Settings'; break;
      case 'recycle_bin': title = 'Cestino'; icon = 'Trash2'; break;
      case 'system_info': title = 'Guida & Info Sistema'; icon = 'Info'; break;
    }

    const newWin: WindowState = {
      id: `sys_${appType}_${Date.now()}`,
      title,
      icon,
      appType,
      isMinimized: false,
      isMaximized: false,
      zIndex: newZ,
      position: { x: 60 + (windows.length % 4) * 35, y: 45 + (windows.length % 4) * 30 },
      size: { width: 680, height: 480 },
    };

    setWindows((prev) => [...prev, newWin]);
    setActiveWindowId(newWin.id);
  };

  // Close Window
  const handleCloseWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id);
      if (remaining.length > 0) {
        // Find window with highest zIndex
        const highest = remaining.reduce((max, w) => (w.zIndex > max.zIndex ? w : max), remaining[0]);
        setActiveWindowId(highest.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  // Minimize Window
  const handleMinimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  // Toggle Maximize Window
  const handleToggleMaximizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)));
  };

  // Taskbar Item Click Handler
  const handleTaskbarWindowClick = (id: string) => {
    const targetWin = windows.find((w) => w.id === id);
    if (!targetWin) return;

    if (activeWindowId === id && !targetWin.isMinimized) {
      // Minimize if clicked while active
      handleMinimizeWindow(id);
    } else {
      bringToFocus(id);
    }
  };

  // Create or Update Shortcut
  const handleSaveShortcutData = (data: Partial<Shortcut>) => {
    const targetId = data.id || editingShortcut?.id;

    if (targetId) {
      const exists = shortcuts.some((s) => s.id === targetId);
      if (exists) {
        const updated = shortcuts.map((s) => (s.id === targetId ? { ...s, ...data } : s));
        updateShortcutsState(updated);
        setEditingShortcut(null);

        // Update all open windows that correspond to this shortcut
        setWindows((prev) =>
          prev.map((w) => {
            if (w.shortcutId === targetId) {
              return {
                ...w,
                title: data.title || w.title,
                htmlCode: data.htmlContent !== undefined ? data.htmlContent : w.htmlCode,
                contentUrl: data.url !== undefined ? data.url : w.contentUrl,
              };
            }
            return w;
          })
        );

        soundFx.playStartup();
        return;
      }
    }

    // Create new
    const newId = data.id || `sc_${Date.now()}`;
    const newShortcut: Shortcut = {
      id: newId,
      title: data.title || 'Nuova App',
      description: data.description || '',
      icon: data.icon || 'Code2',
      type: data.type || (data.htmlContent !== undefined ? 'html_content' : 'external_link'),
      url: data.url,
      htmlContent: data.htmlContent,
      target: data.target || 'new_tab',
      category: data.category || 'Miei Programmi',
      createdAt: Date.now(),
    };

    updateShortcutsState([...shortcuts, newShortcut]);

    // Update active html_runner window to bind to this newly created shortcut
    if (data.htmlContent !== undefined) {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.appType === 'html_runner') {
            return {
              ...w,
              shortcutId: newId,
              title: data.title || w.title,
              htmlCode: data.htmlContent,
            };
          }
          return w;
        })
      );
    }

    soundFx.playStartup();
  };

  // Move Shortcut to Recycle Bin
  const handleDeleteShortcut = (id: string) => {
    soundFx.playTrash();
    const updated = shortcuts.map((s) => (s.id === id ? { ...s, isDeleted: true } : s));
    updateShortcutsState(updated);
  };

  // Restore Shortcut from Bin
  const handleRestoreFromBin = (id: string) => {
    const updated = shortcuts.map((s) => (s.id === id ? { ...s, isDeleted: false } : s));
    updateShortcutsState(updated);
  };

  // Permanent Delete
  const handlePermanentDeleteFromBin = (id: string) => {
    const updated = shortcuts.filter((s) => s.id !== id);
    updateShortcutsState(updated);
  };

  // Empty Bin
  const handleEmptyBin = () => {
    const updated = shortcuts.filter((s) => !s.isDeleted);
    updateShortcutsState(updated);
  };

  // Restore Factory Shortcuts
  const handleRestoreDefaultShortcuts = () => {
    updateShortcutsState(DEFAULT_SHORTCUTS);
  };

  // Import Backup
  const handleImportBackup = (importedShortcuts: Shortcut[], importedSettings: SystemSettings) => {
    updateShortcutsState(importedShortcuts);
    setSettings(importedSettings);
  };

  // Shutdown Simulation
  if (isShutdown) {
    return (
      <div className="fixed inset-0 bg-black text-amber-500 font-mono flex flex-col items-center justify-center p-6 text-center select-none z-[99999]">
        <div className="border-4 border-amber-600 p-8 max-w-md bg-stone-950 win95-outset">
          <p className="text-xl font-bold mb-4 tracking-wider">È ORA POSSIBILE SPEGNERE IL COMPUTER.</p>
          <p className="text-sm text-amber-300/80 mb-6">Vintage OS '95 sessione terminata con successo.</p>
          <button
            onClick={() => {
              soundFx.playStartup();
              setIsShutdown(false);
            }}
            className="win95-button px-6 py-2 bg-amber-600 text-black font-bold hover:bg-amber-500 text-sm"
          >
            🔌 Riavvia Sessione
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsStartOpen(false)}
      className="relative w-screen h-screen overflow-hidden bg-[#008080] font-sans"
    >
      {/* Desktop Canvas */}
      <DesktopCanvas
        shortcuts={shortcuts}
        settings={settings}
        windows={windows}
        activeWindowId={activeWindowId}
        selectedIconId={selectedIconId}
        onSelectIcon={setSelectedIconId}
        onOpenShortcut={handleOpenShortcut}
        onEditShortcut={(sc) => {
          setEditingShortcut(sc);
          handleOpenSystemApp('add_shortcut');
        }}
        onDeleteShortcut={handleDeleteShortcut}
        onFocusWindow={bringToFocus}
        onCloseWindow={handleCloseWindow}
        onMinimizeWindow={handleMinimizeWindow}
        onToggleMaximizeWindow={handleToggleMaximizeWindow}
        onSaveShortcut={handleSaveShortcutData}
        onUpdateSettings={handleUpdateSettings}
        onRestoreDefaultShortcuts={handleRestoreDefaultShortcuts}
        onImportBackup={handleImportBackup}
        onRestoreFromBin={handleRestoreFromBin}
        onPermanentDeleteFromBin={handlePermanentDeleteFromBin}
        onEmptyBin={handleEmptyBin}
      />

      {/* Edit Shortcut Modal overlay if active */}
      {editingShortcut && (
        <div className="fixed inset-0 bg-black/50 z-[9995] flex items-center justify-center p-4">
          <div className="w-[500px] max-w-full h-[520px] max-h-full win95-outset bg-[#c0c0c0] shadow-2xl flex flex-col">
            <div className="win95-titlebar px-2 py-1 flex justify-between items-center font-bold text-xs">
              <span>Modifica Collegamento</span>
              <button
                onClick={() => setEditingShortcut(null)}
                className="win95-button px-1.5 py-0.5 text-black hover:bg-red-200"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AddShortcutModal
                initialShortcut={editingShortcut}
                onSave={(data) => {
                  handleSaveShortcutData(data);
                  setEditingShortcut(null);
                }}
                onClose={() => setEditingShortcut(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartOpen}
        onClose={() => setIsStartOpen(false)}
        onOpenApp={handleOpenSystemApp}
        onShutdown={() => setIsShutdown(true)}
      />

      {/* Bottom Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        isStartOpen={isStartOpen}
        onToggleStart={() => setIsStartOpen(!isStartOpen)}
        onWindowClick={handleTaskbarWindowClick}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
