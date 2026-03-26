import React, { useState } from 'react';
import { API_BASE, getHeaders } from '../api';

export default function Gallery({ token }) {
  const [data, setData]       = useState(null);
  const [page, setPage]       = useState(1);
  const [blockF, setBlockF]   = useState('');
  const [metersF, setMetersF] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [searched, setSearched] = useState(false);
  const LIMIT = 12;

  const load = async (pg, block, meters) => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ page: pg, limit: LIMIT });
    if (block) params.set('block', block);
    if (meters) params.set('meters', meters);
    try {
      const r = await fetch(`${API_BASE}/data/?${params}`, { headers: getHeaders(token) });
      const json = await r.json();
      if (!r.ok) throw new Error(json.message || 'Failed to fetch');
      // API returns { success: true, data: { page, results, total_pages, ... } }
      setData(json.data);
    } catch (e) {
      setError(e.message);
      setData(null);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    setSearched(true);
    setPage(1);
    load(1, blockF, metersF);
  };

  const clearFilters = () => {
    setBlockF('');
    setMetersF('');
    setPage(1);
    setData(null);
    setSearched(false);
  };

  const goToPage = (n) => {
    setPage(n);
    load(n, blockF, metersF);
  };

  const totalPages = data ? data.total_pages : 1;

  const pageNums = () => {
    const pages = [];
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);
    return pages;
  };

  return (
    <div>
      <div className="font-serif text-2xl text-forest mb-6">Image Gallery</div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-forest uppercase tracking-wide">Block</label>
          <input
            type="text"
            value={blockF}
            onChange={e => setBlockF(e.target.value)}
            placeholder="e.g. A1"
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-forest w-40"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-forest uppercase tracking-wide">Meters</label>
          <input
            type="number"
            value={metersF}
            onChange={e => setMetersF(e.target.value)}
            placeholder="e.g. 100"
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-forest w-40"
          />
        </div>
        <button
          onClick={applyFilters}
          className="px-5 py-2 bg-forest text-white rounded-lg text-sm cursor-pointer hover:bg-opacity-90 transition-colors"
        >
          Search
        </button>
        {searched && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm cursor-pointer hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Initial state — nothing searched yet */}
      {!searched && (
        <div className="text-center py-16 text-gray-400 text-sm">
          Enter a block or meters value and click Search
        </div>
      )}

      {/* Loading */}
      {searched && loading && (
        <div className="text-center py-12 text-green text-sm">Loading…</div>
      )}

      {/* Error */}
      {searched && !loading && error && (
        <div className="text-center py-12 text-red-400 text-sm">{error}</div>
      )}

      {/* No results */}
      {searched && !loading && !error && data?.results?.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">No images found.</div>
      )}

      {/* Results */}
      {searched && !loading && !error && data?.results?.length > 0 && (
        <>
          <div className="text-xs text-green mb-4">
            {data.total} result{data.total !== 1 ? 's' : ''}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.results.map(img => (
              <div key={img.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <img
                  src={img.image_url}
                  alt={img.original_name}
                  loading="lazy"
                  onError={e => e.target.src = 'https://placehold.co/400x300/edf6ea/4B6646?text=No+Image'}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-3">
                  <div className="text-sm font-medium text-dark truncate mb-1">{img.original_name}</div>
                  <div className="flex gap-2 items-center text-xs">
                    <span className="bg-green/20 text-forest px-2 py-0.5 rounded-full font-medium">{img.block}</span>
                    <span className="text-gray-400">{img.meters}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm cursor-pointer hover:bg-green/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ←
              </button>
              {pageNums().map(n => (
                <button
                  key={n}
                  onClick={() => goToPage(n)}
                  className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer border transition-colors
                    ${n === page ? 'bg-forest text-white border-forest' : 'bg-white border-gray-200 hover:bg-green/10'}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm cursor-pointer hover:bg-green/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                →
              </button>
              <span className="text-xs text-green ml-2">Page {page} / {totalPages}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}