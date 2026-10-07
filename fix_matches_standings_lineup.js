const fs = require('fs');
let content = fs.readFileSync('src/components/home/MatchesAndStandings.tsx', 'utf-8');

const targetStr = `                  <div className="text-center relative z-10 bg-[#0a1423]/50 py-4 rounded-xl border border-gray-800/50 mt-auto">
                    <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center">
                      {nextMatch.status === 'live' ? <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span> : <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>}
                      Stadion: {nextMatch.stadium || 'Məlumat Yoxdur'}
                    </span>
                  </div>`;

const newStr = `                  <div className="text-center relative z-10 bg-[#0a1423]/50 py-4 rounded-xl border border-gray-800/50 mt-auto">
                    <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center">
                      {nextMatch.status === 'live' ? <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span> : <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>}
                      Stadion: {nextMatch.stadium || 'Məlumat Yoxdur'}
                    </span>
                  </div>
                  
                  {nextMatch.yarimada_lineup && nextMatch.yarimada_lineup.length > 0 && (
                    <div className="mt-4 relative z-10 bg-[#0a1423]/80 rounded-xl border border-gray-800/50 p-3 max-h-32 overflow-y-auto custom-scrollbar">
                      <h4 className="text-[#d7bf7b] font-bold uppercase tracking-widest text-[9px] text-center mb-2 border-b border-gray-800 pb-1">Heyət və Hadisələr</h4>
                      <div className="flex flex-col space-y-1.5">
                        {nextMatch.yarimada_lineup.map((p: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500 font-black w-3">{p.number}</span>
                              <span className="text-white font-medium truncate max-w-[100px]">{p.name}</span>
                              {!p.is_starting && <span className="text-[7px] bg-gray-800 text-gray-400 px-1 rounded uppercase">Ehtiyat</span>}
                            </div>
                            <div className="flex space-x-1">
                              {p.events?.includes('goal') && <span title="Qol">⚽</span>}
                              {p.events?.includes('yellow_card') && <span title="Sarı Vərəqə">🟨</span>}
                              {p.events?.includes('red_card') && <span title="Qırmızı Vərəqə">🟥</span>}
                              {p.events?.includes('injury') && <span title="Zədə">🩹</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}`;

content = content.replace(targetStr, newStr);
fs.writeFileSync('src/components/home/MatchesAndStandings.tsx', content);
