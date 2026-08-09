export type ShortcutType = 'external_link' | 'html_content' | 'app';

export type AppType = 
  | 'add_shortcut' 
  | 'my_computer' 
  | 'html_runner' 
  | 'browser' 
  | 'notepad' 
  | 'settings' 
  | 'recycle_bin' 
  | 'system_info';

export interface Shortcut {
  id: string;
  title: string;
  description?: string;
  icon: string; // Lucide icon name or emoji or image URL
  type: ShortcutType;
  url?: string;
  htmlContent?: string;
  target?: 'iframe' | 'new_tab';
  appType?: AppType;
  category?: string;
  position?: { x: number; y: number };
  createdAt: number;
  isSystem?: boolean;
  isDeleted?: boolean;
}

export interface WindowState {
  id: string;
  shortcutId?: string;
  title: string;
  icon: string;
  appType: AppType | 'external_viewer' | 'html_viewer';
  contentUrl?: string;
  htmlCode?: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export type WallpaperType = 'dark_slate' | 'teal' | 'stars' | 'grid' | 'vaporwave' | 'matrix' | 'blue_clouds' | 'custom';

export interface SystemSettings {
  wallpaper: WallpaperType;
  customWallpaperUrl?: string;
  enableCrtOverlay: boolean;
  enableSound: boolean;
  clock24h: boolean;
  autoAlignIcons: boolean;
}
