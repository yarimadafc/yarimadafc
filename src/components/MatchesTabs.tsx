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
        className="flex items-center bg-[var(--surface-2)] border border-[var(--border)] p-1.5 rounded-full mb-10 w-full max-w-sm" 
        role="tablist"
      >
        <button 
          className={`flex-1 text-center py-2.5 px-4 rounded-full font-bold text-sm transition-colors ${isNext ? 'bg-[var(--accent)] text-[var(--text)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--accent-ink)]'}`} 
          role="tab" 
          aria-selected={isNext}
          onClick={() => setActiveTab('next')}
        >
          Növbəti Oyun
        </button>
        <button 
          className={`flex-1 text-center py-2.5 px-4 rounded-full font-bold text-sm transition-colors ${!isNext ? 'bg-[var(--accent)] text-[var(--text)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--accent-ink)]'}`} 
          role="tab" 
          aria-selected={!isNext}
          onClick={() => setActiveTab('last')}
        >
          Son Nəticə
        </button>
      </div>

      {/* Match Card */}
      <div className={`w-full max-w-2xl bg-[var(--surface)] rounded-[2rem] p-5 sm:p-8  transition-all duration-500 ease-out `}>
        <div className="flex justify-between items-center mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] font-bold">
            {isNext ? 'Qarşıdakı Qarşılaşma' : 'Son Nəticə'}
          </p>
          {match && <span className="text-xs font-mono bg-[var(--bg)] text-[var(--text-muted)] px-3 py-1.5 rounded border border-[var(--border)]">{new Date(match.date).toLocaleDateString('az-AZ')}</span>}
        </div>
        
        {match ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 text-center sm:text-left">
              <div className="flex-1 flex flex-col items-center sm:items-start">
                <div className="w-16 h-16 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-4">
                  {match.home_team.includes('Yarımada') ? (
                    <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  )}
                </div>
                <span className="text-3xl sm:text-4xl font-black uppercase tracking-tight">{match.home_team}</span>
              </div>
              
              {!isNext && (
                <div className="px-6 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex gap-4 text-4xl font-black text-[var(--accent)]">
                  <span>{match.home_score}</span>
                  <span className="text-[var(--text-muted)]">-</span>
                  <span>{match.away_score}</span>
                </div>
              )}
              
              {isNext && (
                <div className="px-6 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex gap-4 text-xl font-bold text-[var(--text-muted)] uppercase tracking-widest">
                  VS
                </div>
              )}

              <div className="flex-1 flex flex-col items-center sm:items-end sm:text-right">
                <div className="w-16 h-16 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-4">
                  {match.away_team.includes('Yarımada') ? (
                    <img src="/Logo.JPG.jpeg" alt="Yarımada" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  )}
                </div>
                <span className="text-3xl sm:text-4xl font-black uppercase tracking-tight">{match.away_team}</span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-8 mt-4">
              <div>
                <p className="text-[var(--text-muted)] text-sm font-medium">{match.time || '18:00'} • {match.stadium}</p>
                <p className="text-[var(--text-muted)] text-xs font-mono uppercase mt-1">{match.tournament}</p>
              </div>
              <Link href={`/oyunlar/${match.id}`} className="btn btn-outline btn-sm">
                {isNext ? 'Detallar' : 'Hesabat'}
              </Link>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <h3 className="text-xl font-bold text-[var(--text-muted)]">Məlumat yoxdur</h3>
          </div>
        )}
      </div>
    </div>
  );
}
