import React, { useState, useEffect } from 'react';
import { Save, FileText, Trash } from 'lucide-react';
import { soundFx } from '../../utils/audio';

const STORAGE_NOTEPAD_KEY = 'retro_os95_notepad_notes';

export const NotepadApp: React.FC = () => {
  const [text, setText] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_NOTEPAD_KEY);
    if (saved) {
      setText(saved);
    }
  }, []);

  const handleSave = () => {
    soundFx.playClick();
    localStorage.setItem(STORAGE_NOTEPAD_KEY, text);
    setSavedMsg('Nota salvata nel browser!');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const handleClear = () => {
    if (window.confirm('Cancellare tutto il testo della nota?')) {
      soundFx.playTrash();
      setText('');
      localStorage.removeItem(STORAGE_NOTEPAD_KEY);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs text-black">
      {/* Menu Bar */}
      <div className="win95-outset px-2 py-1 flex items-center justify-between bg-[#c0c0c0]">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="win95-button px-3 py-1 flex items-center gap-1 font-bold bg-[#000080] text-white"
          >
            <Save size={13} />
            <span>Salva Nota</span>
          </button>
          <button
            onClick={handleClear}
            className="win95-button px-2 py-1 flex items-center gap-1 hover:bg-gray-300 text-red-900"
          >
            <Trash size={13} />
            <span>Pulisci</span>
          </button>
          {savedMsg && <span className="text-emerald-800 font-bold ml-2">{savedMsg}</span>}
        </div>
        <span className="text-gray-600 font-mono text-[11px]">{text.length} caratteri</span>
      </div>

      {/* Editor Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Scrivi qui le tue note o promemoria..."
        className="win95-inset flex-1 w-full p-2 font-mono text-xs focus:outline-none bg-white resize-none"
      />
    </div>
  );
};
