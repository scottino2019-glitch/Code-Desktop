import React, { useState } from 'react';
import { Shortcut } from '../../types';
import { IconMapper } from '../IconMapper';
import { Search, Plus, ExternalLink, Code2, Trash2, Edit, LayoutGrid, List } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface MyComputerAppProps {
  shortcuts: Shortcut[];
  onOpenShortcut: (shortcut: Shortcut) => void;
  onEditShortcut: (shortcut: Shortcut) => void;
  onDeleteShortcut: (id: string) => void;
  onAddNewShortcut: () => void;
}

export const MyComputerApp: React.FC<MyComputerAppProps> = ({
  shortcuts,
  onOpenShortcut,
  onEditShortcut,
  onDeleteShortcut,
  onAddNewShortcut,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['Tutti', ...Array.from(new Set(shortcuts.map((s) => s.category || 'Generale')))];

  const filtered = shortcuts.filter((s) => {
    if (s.isDeleted) return false;
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                          (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'Tutti' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs text-black">
      {/* Top Toolbar */}
      <div className="win95-outset p-1 flex flex-wrap items-center justify-between gap-2 bg-[#c0c0c0]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFx.playClick();
              onAddNewShortcut();
            }}
            className="win95-button px-3 py-1 flex items-center gap-1.5 font-bold bg-[#000080] text-white"
          >
            <Plus size={14} />
            <span>Nuova App / Link</span>
          </button>

          <div className="flex items-center gap-1 border-l border-gray-400 pl-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`win95-button p-1 ${viewMode === 'grid' ? 'win95-button-pressed' : ''}`}
              title="Vista Griglia Icone"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`win95-button p-1 ${viewMode === 'list' ? 'win95-button-pressed' : ''}`}
              title="Vista Elenco Dettagliato"
            >
              <List size={14} />
            </button>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="font-bold">Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="win95-inset p-1 bg-white font-sans text-xs focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Search size={14} className="text-gray-700" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca tra le tue app..."
              className="win95-inset p-1 bg-white focus:outline-none w-36"
            />
          </div>
        </div>
      </div>

      {/* Main Apps View */}
      <div className="flex-1 win95-inset bg-white p-3 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
            <span className="text-2xl">📁</span>
            <p className="font-bold">Nessun collegamento o app trovata.</p>
            <button
              onClick={onAddNewShortcut}
              className="win95-button px-3 py-1 bg-[#000080] text-white font-bold"
            >
              Aggiungi la prima App
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="win95-outset p-2 flex flex-col items-center text-center justify-between bg-gray-100 hover:bg-blue-50 group transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center text-amber-500 my-1">
                  <IconMapper name={item.icon} size={32} />
                </div>
                <h4 className="font-bold text-xs truncate max-w-full text-blue-900">{item.title}</h4>
                <p className="text-[10px] text-gray-600 truncate max-w-full my-0.5">
                  {item.description || item.type}
                </p>

                <div className="flex items-center gap-1 mt-2 pt-1 border-t border-gray-300 w-full justify-center">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onOpenShortcut(item);
                    }}
                    className="win95-button px-2 py-0.5 font-bold text-[11px] bg-blue-900 text-white hover:bg-blue-800"
                  >
                    Apri
                  </button>
                  {item.type === 'html_content' && (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onOpenShortcut({
                          ...item,
                          appType: 'html_runner',
                        });
                      }}
                      className="win95-button p-1 hover:bg-amber-100 text-amber-900 border border-amber-300"
                      title="Modifica Codice HTML"
                    >
                      <Code2 size={12} />
                    </button>
                  )}
                  {!item.isSystem && (
                    <>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          onEditShortcut(item);
                        }}
                        className="win95-button p-1 hover:bg-gray-200 text-gray-800"
                        title="Modifica"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          onDeleteShortcut(item.id);
                        }}
                        className="win95-button p-1 hover:bg-red-200 text-red-900"
                        title="Sposta nel Cestino"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 border-b border-gray-400 font-bold text-[11px]">
                <th className="p-1.5">Icona</th>
                <th className="p-1.5">Nome</th>
                <th className="p-1.5">Tipo</th>
                <th className="p-1.5">Categoria</th>
                <th className="p-1.5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-blue-50 text-xs">
                  <td className="p-1.5 w-8 text-center">
                    <IconMapper name={item.icon} size={18} />
                  </td>
                  <td className="p-1.5 font-bold text-blue-900">{item.title}</td>
                  <td className="p-1.5 text-gray-600">
                    {item.type === 'external_link' ? 'Link Esterno' : item.type === 'html_content' ? 'App HTML' : 'Sistema'}
                  </td>
                  <td className="p-1.5 text-gray-700">{item.category || 'Generale'}</td>
                  <td className="p-1.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          onOpenShortcut(item);
                        }}
                        className="win95-button px-2 py-0.5 font-bold text-[11px] bg-blue-900 text-white"
                      >
                        Apri
                      </button>
                      {item.type === 'html_content' && (
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            onOpenShortcut({
                              ...item,
                              appType: 'html_runner',
                            });
                          }}
                          className="win95-button p-1 hover:bg-amber-100 text-amber-900 border border-amber-300"
                          title="Modifica Codice HTML"
                        >
                          <Code2 size={12} />
                        </button>
                      )}
                      {!item.isSystem && (
                        <>
                          <button
                            onClick={() => {
                              soundFx.playClick();
                              onEditShortcut(item);
                            }}
                            className="win95-button p-1 hover:bg-gray-200"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => {
                              soundFx.playClick();
                              onDeleteShortcut(item.id);
                            }}
                            className="win95-button p-1 hover:bg-red-200 text-red-900"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer info bar */}
      <div className="win95-inset px-2 py-0.5 text-[11px] text-gray-700 flex justify-between bg-[#c0c0c0]">
        <span>{filtered.length} elementi totali salvati</span>
        <span>Memoria locale browser ok</span>
      </div>
    </div>
  );
};
