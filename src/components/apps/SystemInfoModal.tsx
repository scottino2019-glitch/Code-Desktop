import React from 'react';
import { Monitor, Globe, Code2, Save, Sparkles } from 'lucide-react';

export const SystemInfoModal: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs text-black p-3 overflow-y-auto gap-3">
      <div className="win95-outset p-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center gap-3">
        <div className="w-12 h-12 bg-amber-400 text-black flex items-center justify-center font-bold text-2xl win95-outset">
          💻
        </div>
        <div>
          <h2 className="text-base font-bold tracking-wide">Vintage OS '95 Homepage</h2>
          <p className="text-xs text-blue-200">La tua dashboard personale stile computer anni '90</p>
        </div>
      </div>

      <div className="win95-outset p-3 bg-gray-100 flex flex-col gap-2">
        <h3 className="font-bold text-sm text-[#000080] border-b pb-1 flex items-center gap-1.5">
          <Sparkles size={16} /> Guida Rapida all'Uso
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
          <div className="win95-inset p-2 bg-white flex flex-col gap-1">
            <h4 className="font-bold text-blue-900 flex items-center gap-1">
              <Globe size={14} /> 1. Aggiungere Link Esterni / Web App
            </h4>
            <p className="text-gray-700 leading-relaxed text-[11px]">
              Clicca su <strong>"Aggiungi App / Link"</strong> sul desktop o dal menu Start. Inserisci il nome e l'URL (es: <code>https://tuosito.com</code>). Puoi scegliere se aprirlo in una scheda del browser o in una finestra retro.
            </p>
          </div>

          <div className="win95-inset p-2 bg-white flex flex-col gap-1">
            <h4 className="font-bold text-amber-900 flex items-center gap-1">
              <Code2 size={14} /> 2. Eseguire App HTML Locali
            </h4>
            <p className="text-gray-700 leading-relaxed text-[11px]">
              Usa l'<strong>"Editor HTML"</strong> integrato o la finestra di creazione per incollare snippet HTML, CSS e JavaScript. Verranno salvati e riprodotti al volo direttamente sul desktop.
            </p>
          </div>

          <div className="win95-inset p-2 bg-white flex flex-col gap-1">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1">
              <Monitor size={14} /> 3. Personalizzazione Vintage
            </h4>
            <p className="text-gray-700 leading-relaxed text-[11px]">
              Vai nelle <strong>"Impostazioni"</strong> per cambiare lo sfondo (Verde Teal classic, Campo Stellare, Matrix, Vaporwave) e attivare l'effetto CRT o i suoni vintage Web Audio.
            </p>
          </div>

          <div className="win95-inset p-2 bg-white flex flex-col gap-1">
            <h4 className="font-bold text-purple-900 flex items-center gap-1">
              <Save size={14} /> 4. Backup & Sicurezza Dati
            </h4>
            <p className="text-gray-700 leading-relaxed text-[11px]">
              I tuoi collegamenti sono salvati nel tuo browser (localStorage). Puoi scaricare in qualsiasi momento un file di <strong>Backup JSON</strong> dalle impostazioni per non perdere mai nulla.
            </p>
          </div>
        </div>
      </div>

      <div className="win95-inset p-2 bg-[#c0c0c0] text-[11px] text-gray-700 flex justify-between font-mono">
        <span>Sistema Operativo: Vintage OS '95 Web Edition</span>
        <span>Stato: Attivo e Funzionante</span>
      </div>
    </div>
  );
};
