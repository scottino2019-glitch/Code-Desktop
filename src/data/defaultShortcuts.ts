import { Shortcut } from '../types';

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  {
    id: 'add_new_link',
    title: 'Aggiungi App / Link',
    description: 'Crea un nuovo collegamento o una nuova app HTML',
    icon: 'PlusCircle',
    type: 'app',
    appType: 'add_shortcut',
    isSystem: true,
    category: 'Strumenti',
    position: { x: 20, y: 20 },
    createdAt: Date.now() - 100000
  },
  {
    id: 'my_computer',
    title: 'Risorse di Sistema',
    description: 'Tutte le app, i link e i file salvati',
    icon: 'HardDrive',
    type: 'app',
    appType: 'my_computer',
    isSystem: true,
    category: 'Sistema',
    position: { x: 20, y: 110 },
    createdAt: Date.now() - 90000
  },
  {
    id: 'html_editor',
    title: 'Editor HTML',
    description: 'Crea e prova al volo app con codice HTML/CSS/JS',
    icon: 'Code2',
    type: 'app',
    appType: 'html_runner',
    isSystem: true,
    category: 'Sviluppo',
    position: { x: 20, y: 200 },
    createdAt: Date.now() - 80000
  },
  {
    id: 'notepad',
    title: 'Blocco Note',
    description: 'Prendi appunti rapidi in stile retro',
    icon: 'FileText',
    type: 'app',
    appType: 'notepad',
    isSystem: true,
    category: 'Accessori',
    position: { x: 20, y: 290 },
    createdAt: Date.now() - 50000
  },
  {
    id: 'settings',
    title: 'Impostazioni',
    description: 'Sfondi riposanti, suoni, effetto CRT e Backup',
    icon: 'Settings',
    type: 'app',
    appType: 'settings',
    isSystem: true,
    category: 'Sistema',
    position: { x: 20, y: 380 },
    createdAt: Date.now() - 40000
  },
  {
    id: 'recycle_bin',
    title: 'Cestino',
    description: 'Ripristina o elimina definitivamente le app',
    icon: 'Trash2',
    type: 'app',
    appType: 'recycle_bin',
    isSystem: true,
    category: 'Sistema',
    position: { x: 20, y: 470 },
    createdAt: Date.now() - 30000
  }
];

