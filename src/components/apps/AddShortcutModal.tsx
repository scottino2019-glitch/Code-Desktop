import React, { useState, useEffect } from 'react';
import { Shortcut, ShortcutType } from '../../types';
import { IconMapper } from '../IconMapper';
import { soundFx } from '../../utils/audio';

interface AddShortcutModalProps {
  initialShortcut?: Shortcut | null;
  onSave: (shortcutData: Partial<Shortcut>) => void;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  'Globe', 'HardDrive', 'Code2', 'Calculator', 'FileText', 'Settings',
  'Trash2', 'Folder', 'Terminal', 'Sparkles', 'ExternalLink', 'Gamepad2',
  'Music', 'Image', 'Mail', 'Info', '🌐', '💻', '⚡', '🎮', '📁', '📝', '🚀', '🔥'
];

const CATEGORIES = ['Generale', 'Strumenti', 'Lavoro', 'Giochi', 'Personale', 'Esempi'];

export const AddShortcutModal: React.FC<AddShortcutModalProps> = ({
  initialShortcut,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialShortcut?.title || '');
  const [description, setDescription] = useState(initialShortcut?.description || '');
  const [type, setType] = useState<ShortcutType>(initialShortcut?.type || 'external_link');
  const [url, setUrl] = useState(initialShortcut?.url || '');
  const [htmlContent, setHtmlContent] = useState(initialShortcut?.htmlContent || '');
  const [target, setTarget] = useState<'iframe' | 'new_tab'>(initialShortcut?.target || 'new_tab');
  const [icon, setIcon] = useState(initialShortcut?.icon || 'Globe');
  const [category, setCategory] = useState(initialShortcut?.category || 'Generale');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialShortcut) {
      setTitle(initialShortcut.title);
      setDescription(initialShortcut.description || '');
      setType(initialShortcut.type);
      setUrl(initialShortcut.url || '');
      setHtmlContent(initialShortcut.htmlContent || '');
      setTarget(initialShortcut.target || 'new_tab');
      setIcon(initialShortcut.icon || 'Globe');
      setCategory(initialShortcut.category || 'Generale');
    }
  }, [initialShortcut]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Inserisci un titolo per l\'app.');
      soundFx.playError();
      return;
    }

    if (type === 'external_link') {
      if (!url.trim()) {
        setError('Inserisci l\'URL del collegamento (es: https://google.com).');
        soundFx.playError();
        return;
      }
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      onSave({
        title: title.trim(),
        description: description.trim(),
        type: 'external_link',
        url: formattedUrl,
        target,
        icon,
        category,
      });
    } else if (type === 'html_content') {
      if (!htmlContent.trim()) {
        setError('Inserisci il codice HTML dell\'app.');
        soundFx.playError();
        return;
      }
      onSave({
        title: title.trim(),
        description: description.trim(),
        type: 'html_content',
        htmlContent,
        icon,
        category,
      });
    } else {
      onSave({
        title: title.trim(),
        description: description.trim(),
        type: 'app',
        icon,
        category,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-2 text-xs font-sans text-black">
      <form onSubmit={handleSubmit} className="flex flex-col h-full gap-3">
        {error && (
          <div className="win95-inset bg-red-100 border-red-500 text-red-900 p-2 font-bold flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Title & Category */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="block font-bold mb-1">Nome App / Collegamento *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="es: Il mio Portfolio, App Meteo..."
              className="win95-inset w-full p-1.5 font-sans focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="win95-inset w-full p-1.5 font-sans focus:outline-none bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-bold mb-1">Descrizione opzionale</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve nota descrittiva..."
            className="win95-inset w-full p-1.5 focus:outline-none"
          />
        </div>

        {/* Shortcut Type Switcher */}
        <div>
          <label className="block font-bold mb-1">Tipo di App / Collegamento</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setType('external_link');
              }}
              className={`win95-button p-2 text-left flex items-center gap-2 ${
                type === 'external_link' ? 'win95-button-pressed font-bold bg-blue-100 border-blue-900' : ''
              }`}
            >
              🌐 <span>Link Esterno / Web App</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setType('html_content');
              }}
              className={`win95-button p-2 text-left flex items-center gap-2 ${
                type === 'html_content' ? 'win95-button-pressed font-bold bg-amber-100 border-amber-900' : ''
              }`}
            >
              📄 <span>Codice HTML / App locale</span>
            </button>
          </div>
        </div>

        {/* Type Details */}
        {type === 'external_link' && (
          <div className="win95-outset p-2 flex flex-col gap-2 bg-gray-100">
            <div>
              <label className="block font-bold mb-1">URL Web (Link Esterno) *</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="win95-inset w-full p-1.5 font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Apertura del Link</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="target"
                    checked={target === 'new_tab'}
                    onChange={() => setTarget('new_tab')}
                  />
                  <span>Apri in nuova scheda browser (Consigliato)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="target"
                    checked={target === 'iframe'}
                    onChange={() => setTarget('iframe')}
                  />
                  <span>Apri in finestra Retro OS (iFrame)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {type === 'html_content' && (
          <div className="win95-outset p-2 flex flex-col gap-1 flex-1 min-h-36 bg-gray-100">
            <label className="block font-bold">Incolla Codice HTML / CSS / JS *</label>
            <p className="text-[11px] text-gray-700">Puoi incollare un'intera pagina o widget HTML standalone.</p>
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="<!DOCTYPE html><html><body><h1>La mia App!</h1></body></html>"
              className="win95-inset w-full flex-1 p-2 font-mono text-xs focus:outline-none bg-white min-h-28"
            />
          </div>
        )}

        {/* Icon Picker */}
        <div>
          <label className="block font-bold mb-1">Scegli Icona Retro</label>
          <div className="win95-inset bg-white p-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {AVAILABLE_ICONS.map((ic) => (
              <button
                type="button"
                key={ic}
                onClick={() => {
                  soundFx.playClick();
                  setIcon(ic);
                }}
                className={`p-1.5 border flex items-center justify-center hover:bg-blue-100 ${
                  icon === ic ? 'bg-blue-200 border-blue-800 font-bold' : 'border-gray-300'
                }`}
              >
                <IconMapper name={ic} size={20} />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-gray-400">
          <button
            type="button"
            onClick={onClose}
            className="win95-button px-4 py-1.5 hover:bg-gray-300"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="win95-button px-5 py-1.5 font-bold bg-[#000080] text-white hover:bg-blue-900"
          >
            💾 Salva Collegamento
          </button>
        </div>
      </form>
    </div>
  );
};
