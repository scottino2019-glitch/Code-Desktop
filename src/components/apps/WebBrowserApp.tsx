import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, ExternalLink, Globe, Home } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface WebBrowserAppProps {
  initialUrl?: string;
}

export const WebBrowserApp: React.FC<WebBrowserAppProps> = ({ initialUrl = 'https://www.wikipedia.org' }) => {
  const [url, setUrl] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [key, setKey] = useState(0);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }
    soundFx.playClick();
    setCurrentUrl(targetUrl);
    setUrl(targetUrl);
    setKey((prev) => prev + 1);
  };

  const handleRefresh = () => {
    soundFx.playClick();
    setKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs text-black">
      {/* 90s Browser Toolbar */}
      <div className="win95-outset p-1 flex flex-col gap-1 bg-[#c0c0c0]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => soundFx.playClick()}
            className="win95-button p-1 flex items-center gap-1 hover:bg-gray-200"
            title="Indietro"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={() => soundFx.playClick()}
            className="win95-button p-1 flex items-center gap-1 hover:bg-gray-200"
            title="Avanti"
          >
            <ArrowRight size={14} />
          </button>
          <button
            onClick={handleRefresh}
            className="win95-button p-1 flex items-center gap-1 hover:bg-gray-200"
            title="Ricarica Pagina"
          >
            <RotateCw size={14} />
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setCurrentUrl('https://it.wikipedia.org');
              setUrl('https://it.wikipedia.org');
            }}
            className="win95-button p-1 flex items-center gap-1 hover:bg-gray-200"
            title="Pagina Iniziale"
          >
            <Home size={14} />
          </button>

          <form onSubmit={handleNavigate} className="flex-1 flex items-center gap-1 ml-2">
            <span className="font-bold flex items-center gap-1">
              <Globe size={14} className="text-blue-800" /> Indirizzo:
            </span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="win95-inset flex-1 p-1 font-mono focus:outline-none bg-white"
            />
            <button
              type="submit"
              className="win95-button px-3 py-1 font-bold bg-blue-900 text-white"
            >
              Vai
            </button>
          </form>

          {/* External Tab Fallback */}
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFx.playClick()}
            className="win95-button px-2 py-1 flex items-center gap-1 bg-amber-100 hover:bg-amber-200 font-bold ml-1 text-black text-xs"
            title="Apri in nuova scheda browser se il sito blocca gli iFrame"
          >
            <ExternalLink size={13} />
            <span>Nuova Scheda</span>
          </a>
        </div>
      </div>

      {/* Warning Bar for X-Frame-Options */}
      <div className="bg-amber-50 border-y border-amber-300 px-2 py-1 text-[11px] text-amber-900 flex justify-between items-center">
        <span>💡 Nota: Se il sito esterno blocca l'incorporamento, clicca su "Nuova Scheda".</span>
      </div>

      {/* Browser iFrame Container */}
      <div className="flex-1 win95-inset bg-white relative">
        <iframe
          key={key}
          title="Retro Navigator"
          src={currentUrl}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      {/* Status bar */}
      <div className="win95-inset mt-0.5 px-2 py-0.5 text-[11px] text-gray-700 flex justify-between bg-[#c0c0c0]">
        <span>Connessione a {currentUrl}...</span>
        <span>Netscape Navigator 4.0 / IE '95</span>
      </div>
    </div>
  );
};
