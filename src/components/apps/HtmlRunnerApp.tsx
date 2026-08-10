import React, { useState, useRef } from 'react';
import { Save, Code, Eye, RefreshCw, FileCode, Download, FolderOpen, CheckCircle, Smartphone } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface HtmlRunnerAppProps {
  initialCode?: string;
  initialTitle?: string;
  shortcutId?: string;
  onSaveAsApp?: (title: string, code: string, shortcutId?: string) => void;
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
  initialTitle,
  shortcutId,
  onSaveAsApp,
}) => {
  const [code, setCode] = useState(initialCode || SAMPLE_TEMPLATES[0].code);
  const [activeTab, setActiveTab] = useState<'split' | 'code' | 'preview'>('split');
  const [appTitle, setAppTitle] = useState(initialTitle || 'Nuova App HTML');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if initialCode or initialTitle changes (e.g., when switching apps to edit)
  React.useEffect(() => {
    if (initialCode !== undefined && initialCode !== '') {
      setCode(initialCode);
    }
  }, [initialCode]);

  React.useEffect(() => {
    if (initialTitle) {
      setAppTitle(initialTitle);
    }
  }, [initialTitle]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleRun = () => {
    soundFx.playClick();
  };

  // Check if current shortcutId is a system app launcher
  const isSystemShortcut =
    shortcutId === 'html_editor' ||
    shortcutId === 'html_runner' ||
    shortcutId === 'add_new_link' ||
    shortcutId?.startsWith('sys_');

  const targetAppId = isSystemShortcut ? undefined : shortcutId;

  const handleSaveApp = () => {
    soundFx.playClick();
    if (onSaveAsApp) {
      onSaveAsApp(appTitle, code, targetAppId);
      setIsSaving(false);
      showToast(
        targetAppId
          ? `✅ Modifiche salvate con successo per "${appTitle}"!`
          : `✅ Nuova app "${appTitle}" creata e salvata sul Desktop!`
      );
    }
  };

  // Download HTML file to local disk
  const handleDownloadFile = () => {
    soundFx.playClick();
    try {
      const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeFilename = appTitle.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'mia_app';
      link.href = url;
      link.download = `${safeFilename}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`💾 File "${safeFilename}.html" scaricato nel tuo computer!`);
    } catch (e) {
      alert('Errore durante il download del file HTML.');
    }
  };

  // Open file from local disk
  const handleOpenFileClick = () => {
    soundFx.playClick();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCode(content);
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setAppTitle(fileNameWithoutExt);
        showToast(`📂 Caricato file "${file.name}" nell'editor!`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs text-black relative">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".html,.htm,.txt"
        className="hidden"
      />

      {/* Primary Action Header Toolbar */}
      <div className="win95-outset p-1.5 flex flex-wrap items-center justify-between gap-2 bg-[#c0c0c0] border-b border-gray-400">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`win95-button px-2 py-1 flex items-center gap-1 ${
              activeTab === 'split' ? 'win95-button-pressed font-bold' : ''
            }`}
          >
            <FileCode size={14} />
            <span>Divisione</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`win95-button px-2 py-1 flex items-center gap-1 ${
              activeTab === 'code' ? 'win95-button-pressed font-bold' : ''
            }`}
          >
            <Code size={14} />
            <span>Solo Codice</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`win95-button px-2 py-1 flex items-center gap-1 ${
              activeTab === 'preview' ? 'win95-button-pressed font-bold' : ''
            }`}
          >
            <Eye size={14} />
            <span>Anteprima Live</span>
          </button>
        </div>

        {/* Action Buttons & Templates */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={handleOpenFileClick}
            className="win95-button px-2 py-1 flex items-center gap-1 font-semibold hover:bg-gray-200"
            title="Apri un file HTML dal tuo computer"
          >
            <FolderOpen size={14} className="text-amber-800" />
            <span>Apri File...</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFile}
            className="win95-button px-2 py-1 flex items-center gap-1 font-semibold hover:bg-gray-200"
            title="Scarica il file .html sul tuo PC"
          >
            <Download size={14} className="text-emerald-800" />
            <span>Scarica .html</span>
          </button>

          <span className="font-bold text-gray-700 ml-1">Modelli:</span>
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
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsSaving(true);
              }}
              className="win95-button px-3 py-1 flex items-center gap-1.5 font-bold bg-[#000080] text-white hover:bg-blue-900 border border-blue-400"
              title="Salva l'app sul Desktop come icona o aggiorna l'app esistente"
            >
              <Save size={14} />
              <span>{shortcutId ? 'Salva Modifiche App' : 'Salva sul Desktop'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast Alert Bar */}
      {notification && (
        <div className="bg-emerald-100 border-b border-emerald-400 text-emerald-900 px-3 py-1.5 font-bold flex items-center gap-2 animate-fadeIn text-xs">
          <CheckCircle size={16} className="text-emerald-700" />
          <span>{notification}</span>
        </div>
      )}

      {/* Save Modal dialog overlay */}
      {isSaving && (
        <div className="absolute inset-0 bg-black/40 z-[99] flex items-center justify-center p-4">
          <div className="win95-outset bg-[#c0c0c0] p-4 w-88 flex flex-col gap-3 shadow-2xl">
            <h3 className="font-bold text-sm border-b pb-1 text-[#000080] flex items-center gap-1.5">
              <Smartphone size={16} />
              <span>{shortcutId ? 'Aggiorna App sul Desktop' : 'Salva Nuova App sul Desktop'}</span>
            </h3>
            <p className="text-gray-700 text-[11px]">
              {shortcutId
                ? 'Stai aggiornando il codice HTML dell\'app aperta. Le modifiche verranno salvate nell\'icona sul Desktop.'
                : 'Crea una nuova icona sul Desktop per aprire questa app con un doppio-click in qualsiasi momento.'}
            </p>
            <div>
              <label className="block font-bold mb-1">Nome dell'App:</label>
              <input
                type="text"
                value={appTitle}
                onChange={(e) => setAppTitle(e.target.value)}
                className="win95-inset w-full p-1.5 focus:outline-none bg-white font-semibold"
                placeholder="Es. Mia Calcolatrice, Mio Gioco..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsSaving(false)}
                className="win95-button px-3 py-1"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleSaveApp}
                className="win95-button px-4 py-1 font-bold bg-[#000080] text-white hover:bg-blue-900"
              >
                {shortcutId ? 'Conferma e Salva' : 'Crea Icona Desktop'}
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
              <span className="font-mono text-[10px] text-slate-200">
                {code.split('\n').length} linee
              </span>
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
                type="button"
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

