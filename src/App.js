import React, { useState } from 'react';
import Login   from './components/Login';
import Upload  from './components/Upload';
import Gallery from './components/Gallery';
import Toast   from './components/Toast';
import './App.css';

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('vc_token'));
  const [tab, setTab]     = useState('gallery');
  const [toast, setToast] = useState('');

  const logout = () => { sessionStorage.removeItem('vc_token'); setToken(null); };

  if (!token) return <Login onLogin={(t) => { setToken(t); setTab('gallery'); }} />;

  return (
    <>
      <header className="bg-dark text-white flex items-center justify-between px-8 h-14">
        <div className="font-serif text-xl text-green">🌿 VineCare</div>
        <nav className="flex gap-1">
          <button onClick={() => setTab('gallery')}
            className={`px-4 py-1.5 rounded-lg text-sm cursor-pointer border-none transition-colors
              ${tab === 'gallery' ? 'bg-green/20 text-green' : 'bg-transparent text-green/60 hover:text-green hover:bg-green/10'}`}>
            Gallery
          </button>
          <button onClick={() => setTab('upload')}
            className={`px-4 py-1.5 rounded-lg text-sm cursor-pointer border-none transition-colors
              ${tab === 'upload' ? 'bg-green/20 text-green' : 'bg-transparent text-green/60 hover:text-green hover:bg-green/10'}`}>
            Upload
          </button>
          <button onClick={logout}
            className="px-4 py-1.5 rounded-lg text-sm cursor-pointer border-none bg-transparent text-orange-300 hover:bg-orange-400/10 transition-colors">
            Sign out
          </button>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {tab === 'upload'  && <Upload  token={token} onToast={setToast} />}
        {tab === 'gallery' && <Gallery token={token} />}
      </main>

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </>
  );
}