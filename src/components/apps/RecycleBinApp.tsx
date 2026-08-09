import React from 'react';
import { Shortcut } from '../../types';
import { IconMapper } from '../IconMapper';
import { Trash2, RotateCcw, Flame } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface RecycleBinAppProps {
  deletedShortcuts: Shortcut[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyBin: () => void;
}

export const RecycleBinApp: React.FC<RecycleBinAppProps> = ({
  deletedShortcuts,
  onRestore,
  onPermanentDelete,
  onEmptyBin,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs text-black">
      {/* Toolbar */}
      <div className="win95-outset p-1 flex items-center justify-between bg-[#c0c0c0]">
        <span className="font-bold text-gray-800 flex items-center gap-1.5 px-1">
          <Trash2 size={16} className="text-red-800" /> Cestino ({deletedShortcuts.length} elementi)
        </span>

        {deletedShortcuts.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Sei sicuro di voler svuotare il Cestino? Tutti gli elementi selezionati verranno eliminati definitivamente.')) {
                soundFx.playTrash();
                onEmptyBin();
              }
            }}
            className="win95-button px-3 py-1 font-bold bg-red-800 text-white hover:bg-red-900 flex items-center gap-1"
          >
            <Flame size={14} />
            <span>Svuota Cestino</span>
          </button>
        )}
      </div>

      {/* Deleted Items Container */}
      <div className="flex-1 win95-inset bg-white p-3 overflow-y-auto">
        {deletedShortcuts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
            <span className="text-3xl">🗑️</span>
            <p className="font-bold">Il Cestino è vuoto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {deletedShortcuts.map((item) => (
              <div
                key={item.id}
                className="win95-outset p-2 flex items-center justify-between bg-gray-100"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <IconMapper name={item.icon} size={24} />
                  <div className="truncate">
                    <h5 className="font-bold text-xs truncate">{item.title}</h5>
                    <span className="text-[10px] text-gray-500">{item.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onRestore(item.id);
                    }}
                    className="win95-button px-2 py-1 font-bold bg-emerald-800 text-white flex items-center gap-1"
                    title="Ripristina sul Desktop"
                  >
                    <RotateCcw size={12} />
                    <span>Ripristina</span>
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playTrash();
                      onPermanentDelete(item.id);
                    }}
                    className="win95-button p-1 hover:bg-red-200 text-red-900"
                    title="Elimina Definitivamente"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
