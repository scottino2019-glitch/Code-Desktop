import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, ExternalLink, Globe, Home } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface WebBrowserAppProps {
  initialUrl?: string;
  appName?: string;
  onCloseAppWindow?: () => void;
}

const GOOGLE_HOME_URL = 'https://www.google.com/search?igu=1';

export const WebBrowserApp: React.FC<WebBrowserAppProps> = ({
  initialUrl = GOOGLE_HOME_URL,
  appName = 'App Web',
  onCloseAppWindow,
}) => {
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

  const handleGoGoogle = () => {
    soundFx.playClick();
    setCurrentUrl(GOOGLE_HOME_URL);
    setUrl(GOOGLE_HOME_URL);
    setKey((prev) => prev + 1);
  };

  const handleReturnToInitialApp = () => {
    soundFx.playClick();
    setCurrentUrl(initialUrl);
    setUrl(initialUrl);
    setKey((prev) => prev + 1);
  };

  const handleRefresh = () => {
    soundFx.playClick();
    setKey((prev) => prev + 1);
  };

  const isAwayFromApp = currentUrl !== initialUrl;

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs text-black">
      {/* 90s Browser Toolbar */}
      <div className="win95-outset p-1 flex flex-col gap-1 bg-[#c0c0c0]">
        <div className="flex items-center gap-1 flex-wrap">
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

          {/* Home Google Button */}
          <button
            type="button"
            onClick={handleGoGoogle}
            className="win95-button px-2 py-1 flex items-center gap-1 font-bold bg-gray-100 hover:bg-gray-200"
            title="Apri Google Search"
          >
            <Home size={14} />
            <span>Google</span>
          </button>

          {/* Return to Initial Opened App Button */}
          <button
            type="button"
            onClick={handleReturnToInitialApp}
            className={`win95-button px-2.5 py-1 flex items-center gap-1.5 font-bold transition-all ${
              isAwayFromApp
                ? 'bg-[#000080] text-white hover:bg-blue-900 border border-blue-400'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
            title={`Ritorna alla pagina principale dell'app aperta: ${appName}`}
          >
            <span>📱 Torna all'App</span>
          </button>

          <form onSubmit={handleNavigate} className="flex-1 flex items-center gap-1 ml-1 min-w-[180px]">
            <span className="font-bold flex items-center gap-1 whitespace-nowrap">
              <Globe size={14} className="text-blue-800" /> Indirizzo:
            </span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="win95-inset flex-1 p-1 font-mono focus:outline-none bg-white min-w-[110px]"
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

      {/* Navigation Info Bar */}
      <div className="bg-amber-50 border-y border-amber-300 px-2 py-1 text-[11px] text-amber-900 flex justify-between items-center gap-2">
        <span>🔍 Clicca su <b>"Google"</b> per cercare o su <b>"📱 Torna all'App"</b> per rientrare subito all'app aperta ({appName}).</span>
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
