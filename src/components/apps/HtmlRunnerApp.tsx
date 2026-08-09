import React, { useState } from 'react';
import { Play, Save, Code, Eye, RefreshCw, FileCode } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface HtmlRunnerAppProps {
  initialCode?: string;
  onSaveAsApp?: (title: string, code: string) => void;
}

const SAMPLE_TEMPLATES = [
  {
    name: 'Orologio Digitale Vintage',
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #008080; color: #00ff00; font-family: 'Courier New', monospace; text-align: center; padding-top: 40px; margin: 0; }
  .box { background: #000; border: 4px ridge #c0c0c0; display: inline-block; padding: 20px 40px; box-shadow: 4px 4px 0 #000; }
  h1 { font-size: 40px; margin: 0; letter-spacing: 4px; text-shadow: 0 0 8px #00ff00; }
  p { color: #808080; margin-top: 10px; font-size: 14px; }
</style>
</head>
<body>
  <div class="box">
    <h1 id="clock">00:00:00</h1>
    <p>RETRO OS DIGITAL TIME</p>
  </div>
  <script>
    function update() {
      const now = new Date();
      document.getElementById('clock').innerText = now.toLocaleTimeString();
    }
    setInterval(update, 1000);
    update();
  </script>
</body>
</html>`
  },
  {
    name: 'Lista Note HTML',
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; background: #ffffd0; padding: 20px; color: #333; }
  h2 { border-bottom: 2px solid #888; padding-bottom: 5px; color: #000080; }
  input { padding: 6px; width: 60%; font-size: 14px; border: 2px inset #999; }
  button { padding: 6px 12px; font-weight: bold; background: #c0c0c0; border: 2px outset #fff; cursor: pointer; }
  ul { font-size: 16px; line-height: 1.8; }
  li { margin-bottom: 5px; }
</style>
</head>
<body>
  <h2>📝 App Note Personali</h2>
  <input id="note" placeholder="Scrivi una nota...">
  <button onclick="add()">Aggiungi</button>
  <ul id="list">
    <li>Organizzare le icone sul desktop vintage</li>
    <li>Provare le app HTML esterne</li>
  </ul>
  <script>
    function add() {
      const inp = document.getElementById('note');
      if(!inp.value.trim()) return;
      const li = document.createElement('li');
      li.innerText = inp.value;
      document.getElementById('list').appendChild(li);
      inp.value = '';
    }
  </script>
</body>
</html>`
  },
  {
    name: 'Gioco Reazione Vintage',
    code: `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: monospace; background: #c0c0c0; text-align: center; padding: 20px; }
  #btn { width: 180px; height: 180px; background: #ff4444; color: white; font-size: 20px; font-weight: bold; border: 4px outset #fff; cursor: pointer; margin: 20px auto; display: flex; align-items: center; justify-content: center; }
  #score { font-size: 18px; font-weight: bold; color: #000080; }
</style>
</head>
<body>
  <h2>⚡ Test di Reazione '90</h2>
  <p>Clicca appena il pulsante diventa VERDE!</p>
  <div id="btn" onclick="handleClick()">Inizia Test</div>
  <div id="score">Riflessi: -- ms</div>
  <script>
    let state = 'idle';
    let startTime = 0;
    let timer = null;

    function handleClick() {
      const btn = document.getElementById('btn');
      const score = document.getElementById('score');

      if (state === 'idle') {
        state = 'waiting';
        btn.style.background = '#ff4444';
        btn.innerText = 'ATTENDI...';
        score.innerText = 'Pronto...';
        timer = setTimeout(() => {
          state = 'ready';
          btn.style.background = '#00cc00';
          btn.innerText = 'CLICCA ORA!';
          startTime = Date.now();
        }, 1000 + Math.random() * 3000);
      } else if (state === 'waiting') {
        clearTimeout(timer);
        state = 'idle';
        btn.style.background = '#ff4444';
        btn.innerText = 'Troppo presto! Riprova';
        score.innerText = 'Falsa partenza!';
      } else if (state === 'ready') {
        const diff = Date.now() - startTime;
        state = 'idle';
        btn.style.background = '#000080';
        btn.innerText = 'Ricomincia';
        score.innerText = 'Tempo: ' + diff + ' ms!';
      }
    }
  </script>
</body>
</html>`
  }
];

export const HtmlRunnerApp: React.FC<HtmlRunnerAppProps> = ({
  initialCode,
  onSaveAsApp,
}) => {
  const [code, setCode] = useState(initialCode || SAMPLE_TEMPLATES[0].code);
  const [activeTab, setActiveTab] = useState<'split' | 'code' | 'preview'>('split');
  const [appTitle, setAppTitle] = useState('Nuova App HTML');
  const [isSaving, setIsSaving] = useState(false);

  const handleRun = () => {
    soundFx.playClick();
    // Force iframe re-render by trigger state if needed
  };

  const handleSaveApp = () => {
    soundFx.playClick();
    if (onSaveAsApp) {
      onSaveAsApp(appTitle, code);
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs text-black">
      {/* Toolbar */}
      <div className="win95-outset p-1 flex flex-wrap items-center justify-between gap-2 bg-[#c0c0c0] border-b border-gray-400">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('split')}
            className={`win95-button px-2 py-1 flex items-center gap-1 ${
              activeTab === 'split' ? 'win95-button-pressed font-bold' : ''
            }`}
          >
            <FileCode size={14} />
            <span>Divisione</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`win95-button px-2 py-1 flex items-center gap-1 ${
              activeTab === 'code' ? 'win95-button-pressed font-bold' : ''
            }`}
          >
            <Code size={14} />
            <span>Solo Codice</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`win95-button px-2 py-1 flex items-center gap-1 ${
              activeTab === 'preview' ? 'win95-button-pressed font-bold' : ''
            }`}
          >
            <Eye size={14} />
            <span>Anteprima Live</span>
          </button>
        </div>

        {/* Templates Selector */}
        <div className="flex items-center gap-1">
          <span className="font-bold">Modelli:</span>
          <select
            onChange={(e) => {
              const selected = SAMPLE_TEMPLATES.find((t) => t.name === e.target.value);
              if (selected) {
                setCode(selected.code);
                setAppTitle(selected.name);
                soundFx.playClick();
              }
            }}
            className="win95-inset p-1 bg-white font-sans text-xs focus:outline-none"
          >
            {SAMPLE_TEMPLATES.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          {onSaveAsApp && (
            <button
              onClick={() => {
                soundFx.playClick();
                setIsSaving(true);
              }}
              className="win95-button px-3 py-1 flex items-center gap-1 font-bold bg-[#000080] text-white hover:bg-blue-900"
            >
              <Save size={14} />
              <span>Salva come Shortcut</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Modal dialog overlay */}
      {isSaving && (
        <div className="absolute inset-0 bg-black/40 z-[99] flex items-center justify-center p-4">
          <div className="win95-outset bg-[#c0c0c0] p-3 w-80 flex flex-col gap-3 shadow-2xl">
            <h3 className="font-bold text-sm border-b pb-1 text-[#000080]">Salva App sul Desktop</h3>
            <div>
              <label className="block font-bold mb-1">Nome dell'App:</label>
              <input
                type="text"
                value={appTitle}
                onChange={(e) => setAppTitle(e.target.value)}
                className="win95-inset w-full p-1.5 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSaving(false)}
                className="win95-button px-3 py-1"
              >
                Annulla
              </button>
              <button
                onClick={handleSaveApp}
                className="win95-button px-4 py-1 font-bold bg-[#000080] text-white"
              >
                Crea Icona
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden p-1 gap-1">
        {/* Code Input */}
        {(activeTab === 'split' || activeTab === 'code') && (
          <div className={`flex flex-col ${activeTab === 'split' ? 'w-1/2' : 'w-full'} h-full`}>
            <div className="win95-titlebar px-2 py-0.5 font-bold text-[11px] flex items-center justify-between">
              <span>SORGENTE HTML / CSS / JS</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="win95-inset flex-1 w-full p-2 font-mono text-xs focus:outline-none bg-white resize-none"
            />
          </div>
        )}

        {/* Live Preview Frame */}
        {(activeTab === 'split' || activeTab === 'preview') && (
          <div className={`flex flex-col ${activeTab === 'split' ? 'w-1/2' : 'w-full'} h-full`}>
            <div className="win95-titlebar px-2 py-0.5 font-bold text-[11px] flex items-center justify-between bg-gradient-to-r from-emerald-800 to-teal-700">
              <span>ANTEPRIMA ESECUZIONE</span>
              <button
                onClick={handleRun}
                className="hover:text-amber-200 flex items-center gap-1 font-mono"
                title="Ricarica Anteprima"
              >
                <RefreshCw size={11} /> Aggiorna
              </button>
            </div>
            <div className="win95-inset flex-1 w-full bg-white relative">
              <iframe
                title="HTML Preview"
                srcDoc={code}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-modals allow-forms"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
