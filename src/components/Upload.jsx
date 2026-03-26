import React, { useState, useRef } from 'react';
import { API_BASE, getHeaders } from '../api';

export default function Upload({ token, onToast }) {
  const [block, setBlock]     = useState('');
  const [meters, setMeters]   = useState('');
  const [files, setFiles]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [over, setOver]       = useState(false);
  const inputRef              = useRef();

  const addFiles = (newFiles) => {
    const all = [...files, ...Array.from(newFiles)];
    if (all.length > 100) { onToast('Max 100 images allowed'); return; }
    setFiles(all);
  };

  const remove = (i) => setFiles(f => f.filter((_, idx) => idx !== i));

  const submit = async () => {
    if (!block || !meters || files.length === 0) { onToast('Fill block, meters and select images'); return; }
    setLoading(true); setProgress(10);
    const fd = new FormData();
    fd.append('block', block);
    fd.append('meters', meters);
    files.forEach(f => fd.append('images', f));
    try {
      setProgress(40);
      const r = await fetch(`${API_BASE}/upload_multiple_image`, {
        method: 'POST',
        headers: getHeaders(token),
        body: fd,
      });
      setProgress(90);
      if (!r.ok) throw new Error('Upload failed');
      setProgress(100);
      onToast(`✓ ${files.length} image${files.length > 1 ? 's' : ''} uploaded`);
      setFiles([]); setBlock(''); setMeters('');
      setTimeout(() => setProgress(0), 800);
    } catch (e) {
      onToast('Upload failed: ' + e.message);
      setProgress(0);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="font-serif text-2xl text-forest mb-6">Upload Images</div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100">

        {/* Block + Meters */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-forest uppercase tracking-wide mb-1.5">Block</label>
            <input
              type="text"
              value={block}
              onChange={e => setBlock(e.target.value)}
              placeholder="e.g. A1"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest uppercase tracking-wide mb-1.5">Meters</label>
            <input
              type="number"
              value={meters}
              onChange={e => setMeters(e.target.value)}
              placeholder="e.g. 150"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-forest"
            />
          </div>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={e => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
            ${over ? 'border-green bg-green/10' : 'border-gray-200 bg-gray-50 hover:border-green hover:bg-green/5'}`}
        >
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => addFiles(e.target.files)} />
          <div className="text-3xl mb-2">🖼️</div>
          <div className="text-sm text-gray-500">Drag & drop images or click to browse</div>
          <div className="text-xs text-gray-400 mt-1">JPG, PNG, JPEG · Max 100 images</div>
        </div>

        {/* Previews */}
        {files.length > 0 && (
          <>
            <div className="text-xs text-green mt-3">{files.length} / 100 images selected</div>
            <div className="grid grid-cols-6 gap-2.5 mt-3">
              {files.map((f, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => remove(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white border-none rounded-full w-5 h-5 text-xs cursor-pointer flex items-center justify-center"
                  >×</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-2.5 bg-forest text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Uploading…' : 'Upload'}
          </button>

          {files.length > 0 && (
            <button
              onClick={() => setFiles([])}
              className="px-5 py-2.5 border border-forest text-forest bg-transparent rounded-lg text-sm cursor-pointer hover:bg-green/10 transition-colors"
            >
              Clear all
            </button>
          )}

          {progress > 0 && progress < 100 && (
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div className="bg-green h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          {progress === 100 && <span className="text-forest text-sm font-medium">✓ Done</span>}
        </div>
      </div>
    </div>
  );
}