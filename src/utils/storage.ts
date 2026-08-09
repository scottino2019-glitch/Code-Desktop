import { Shortcut, SystemSettings } from '../types';
import { DEFAULT_SHORTCUTS } from '../data/defaultShortcuts';

const STORAGE_SHORTCUTS_KEY = 'retro_os95_shortcuts_v1';
const STORAGE_SETTINGS_KEY = 'retro_os95_settings_v1';

export const DEFAULT_SETTINGS: SystemSettings = {
  wallpaper: 'teal',
  enableCrtOverlay: false,
  enableSound: true,
  clock24h: true,
  autoAlignIcons: true
};

export function loadShortcuts(): Shortcut[] {
  try {
    const raw = localStorage.getItem(STORAGE_SHORTCUTS_KEY);
    if (!raw) {
      saveShortcuts(DEFAULT_SHORTCUTS);
      return DEFAULT_SHORTCUTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Filter out removed dummy icons
      const filtered = parsed.filter(
        (s: Shortcut) =>
          s.id !== 'sample_calculator_html' &&
          s.id !== 'sample_external_google' &&
          s.id !== 'sample_external_wikipedia'
      );
      let result = filtered;
      const hasAddLink = result.some((s: Shortcut) => s.appType === 'add_shortcut' || s.id === 'add_new_link');
      if (!hasAddLink) {
        result = [DEFAULT_SHORTCUTS[0], ...result];
      }
      saveShortcuts(result);
      return result;
    }
  } catch (err) {
    console.error('Failed to load shortcuts from localStorage:', err);
  }
  return DEFAULT_SHORTCUTS;
}

export function saveShortcuts(shortcuts: Shortcut[]): void {
  try {
    localStorage.setItem(STORAGE_SHORTCUTS_KEY, JSON.stringify(shortcuts));
  } catch (err) {
    console.error('Failed to save shortcuts to localStorage:', err);
  }
}

export function loadSettings(): SystemSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed, enableCrtOverlay: false };
    }
  } catch (err) {
    console.error('Failed to load settings from localStorage:', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: SystemSettings): void {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
}

export function exportBackup(shortcuts: Shortcut[], settings: SystemSettings): string {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    settings,
    shortcuts
  };
  return JSON.stringify(data, null, 2);
}

export function importBackup(jsonString: string): { shortcuts: Shortcut[]; settings: SystemSettings } | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && Array.isArray(parsed.shortcuts)) {
      const settings = parsed.settings ? { ...DEFAULT_SETTINGS, ...parsed.settings } : DEFAULT_SETTINGS;
      saveShortcuts(parsed.shortcuts);
      saveSettings(settings);
      return { shortcuts: parsed.shortcuts, settings };
    }
  } catch (err) {
    console.error('Failed to parse backup JSON:', err);
  }
  return null;
}
