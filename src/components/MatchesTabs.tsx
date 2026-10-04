'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MatchesTabs({ nextMatch, lastMatch }: { nextMatch: any, lastMatch: any }) {
  const [activeTab, setActiveTab] = useState<'next' | 'last'>('next');

  const match = activeTab === 'next' ? nextMatch : lastMatch;
  const isNext = activeTab === 'next';

  return (
    <div className="flex flex-col items-center">
      {/* Instrument Strip (Thumb Slider) from Impeccable */}
      <div 
        className="ks-instrument-strip is-paper mb-10" 
        role="tablist"
      >
        <button 
          className="ks-instrument-key" 
          role="tab" 
          aria-selected={isNext}
          onClick={() => setActiveTab('next')}
        >
          Növbəti Oyun
        </button>
        <button 
          className="ks-instrument-key" 
          role="tab" 
          aria-selected={!isNext}
          onClick={() => setActiveTab('last')}
        >
          Son Nəticə
        </button>
      </div>

      {/* Match Card */}
      <div className={`w-full max-w-2xl bg-white rounded-[2rem] p-10 border shadow-2xl shadow-[var(--ks-ink)]/5 transition-all duration-500 ease-out ${isNext ? 'border-[var(--ks-kinpaku)]/30' : 'border-gray-100'}`}>
        <div className="flex justify-between items-center mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--ks-kinpaku)] font-bold">
            {isNext ? 'Qarşıdakı Qarşılaşma' : 'Son Nəticə'}
          </p>
          {match && <span className="text-xs font-mono bg-gray-50 text-gray-500 px-3 py-1.5 rounded border border-gray-200">{new Date(match.date).toLocaleDateString('az-AZ')}</span>}
        </div>
        
        {match ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 text-center sm:text-left">
              <div className="flex-1">
                <span className="text-3xl sm:text-4xl font-black uppercase tracking-tight">{match.home_team}</span>
              </div>
              
              {!isNext && (
                <div className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-2xl flex gap-4 text-4xl font-black text-[var(--ks-kinpaku)]">
                  <span>{match.home_score}</span>
                  <span className="text-gray-300">-</span>
                  <span>{match.away_score}</span>
                </div>
              )}
              
              {isNext && (
                <div className="px-6 py-2 bg-gray-50 border border-gray-200 rounded-2xl flex gap-4 text-xl font-bold text-gray-400 uppercase tracking-widest">
                  VS
                </div>
              )}

              <div className="flex-1 sm:text-right">
                <span className="text-3xl sm:text-4xl font-black uppercase tracking-tight">{match.away_team}</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-gray-100 pt-8 mt-4">
              <div>
                <p className="text-gray-500 text-sm font-medium">{match.time || '18:00'} • {match.stadium}</p>
                <p className="text-gray-400 text-xs font-mono uppercase mt-1">{match.tournament}</p>
              </div>
              <Link href={`/oyunlar/${match.id}`} className="ks-button ks-button-secondary !min-h-[36px] !px-5 !text-[11px] !rounded-full !uppercase !tracking-wider">
                {isNext ? 'Detallar' : 'Hesabat'}
              </Link>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <h3 className="text-xl font-bold text-gray-400">Məlumat yoxdur</h3>
          </div>
        )}
      </div>
    </div>
  );
}
