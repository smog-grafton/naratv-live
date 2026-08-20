'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconSearch, IconClose } from '@/components/icons';
import { SearchResult } from '@/services/types';
import { useRouter } from 'next/navigation';
import { searchNaraTv } from '@/services/home';
import NaraImage from '@/components/media/NaraImage';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (query.trim().length <= 2) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const timer = window.setTimeout(() => {
      searchNaraTv(query)
        .then((payload) => {
          if (cancelled) return;
          setResults(payload.results);
        })
        .catch(() => {
          if (!cancelled) {
            setResults([]);
            setError('Search is temporarily unavailable.');
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, retryToken]);

  return (
    <div className="min-h-screen bg-[#050b12] pt-24 md:pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Mobile Header / Back */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 md:hidden"
        >
          <IconClose className="w-6 h-6" />
          <span>Close</span>
        </button>

        {/* Search Input Centered */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center gap-4 border-b border-white/20 focus-within:border-white transition-colors pb-2">
            <div className="relative flex-1 flex items-center">
              <IconSearch className="w-6 h-6 text-gray-500 absolute left-0" />
              <input 
                type="text" 
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fights, fighters, events"
                className="w-full bg-transparent text-xl sm:text-2xl md:text-4xl text-white outline-none pl-10 pr-10 font-black placeholder:text-gray-600 tracking-tight"
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="absolute right-0 p-2 text-gray-400 hover:text-white"
                >
                  <IconClose className="w-6 h-6" />
                </button>
              )}
            </div>
            <button 
              onClick={() => router.back()} 
              className="text-gray-400 hover:text-white font-bold tracking-wide uppercase text-sm px-2 animate-in fade-in"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Categories / Tabs */}
        {query.length > 2 && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-4 border-b border-white/10 pb-4 mb-8 overflow-x-auto hide-scrollbar">
              <button className="px-4 py-1.5 rounded-sm bg-white text-black font-black uppercase tracking-widest text-[10px] whitespace-nowrap">
                All ({loading ? '...' : results.length})
              </button>
              <button className="px-4 py-1.5 rounded-sm bg-[#0B1626] border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-[10px] whitespace-nowrap hover:bg-white/10 hover:text-white transition-colors">
                Fighters
              </button>
              <button className="px-4 py-1.5 rounded-sm bg-[#0B1626] border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-[10px] whitespace-nowrap hover:bg-white/10 hover:text-white transition-colors">
                Events
              </button>
              <button className="px-4 py-1.5 rounded-sm bg-[#0B1626] border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-[10px] whitespace-nowrap hover:bg-white/10 hover:text-white transition-colors">
                Replays
              </button>
              <button className="px-4 py-1.5 rounded-sm bg-[#0B1626] border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-[10px] whitespace-nowrap hover:bg-white/10 hover:text-white transition-colors">
                News
              </button>
            </div>

            {/* Results Grid */}
            {loading ? (
              <div className="text-center py-20 text-gray-500">
                <IconSearch className="w-12 h-12 text-gray-700 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Searching...</h3>
              </div>
            ) : error ? (
              <div className="py-20 text-center text-gray-500">
                <IconSearch className="mx-auto mb-4 h-12 w-12 text-gray-700" />
                <h3 className="mb-2 text-xl font-black uppercase tracking-tighter text-white">Search could not load.</h3>
                <p className="mb-6 text-sm font-bold tracking-wide">Check your connection and try again.</p>
                <button
                  type="button"
                  onClick={() => setRetryToken((value) => value + 1)}
                  className="rounded-sm bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-[#45E3FF]"
                >
                  Try again
                </button>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {results.map(item => (
                  <Link
                    key={item.id}
                    href={item.url}
                    className="group grid grid-cols-[112px_1fr] md:grid-cols-[148px_1fr] min-h-[116px] overflow-hidden rounded-sm border border-white/10 bg-[#0B1626] hover:border-[#45E3FF]/60 transition-colors"
                  >
                    <div className="relative bg-black">
                      <NaraImage src={item.image_url} alt={item.title} className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="min-w-0 p-4 flex flex-col justify-center">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-sm bg-[#45E3FF] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">
                          {item.type}
                        </span>
                        {item.label ? <span className="truncate text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.label}</span> : null}
                      </div>
                      <h2 className="line-clamp-2 text-base md:text-lg font-black uppercase tracking-tight text-white group-hover:text-[#45E3FF] transition-colors">
                        {item.title}
                      </h2>
                      {item.description ? (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-400">{item.description}</p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                <IconSearch className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">No results found.</h3>
                <p className="text-sm font-bold tracking-wide">Try searching for a fighter, event, or replay.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
