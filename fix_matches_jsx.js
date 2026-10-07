const fs = require('fs');
let content = fs.readFileSync('src/app/matches/page.tsx', 'utf-8');

const oldStr = `{activeTab === 'past' ? (
                        {m.status === 'live' && (
                          <div className="mt-3 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse border border-red-500/30">
                            Canlı: {calculateLiveMinute(m.timer_status, m.timer_started_at, m.elapsed_seconds, m.half_1_duration, m.half_2_duration, m.extra_time_1, m.extra_time_2)}
                          </div>
                        )}
                        <div className="mt-3 bg-red-500/0 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          BİTDİ
                        </div>
                      ) : (
                        <span className="text-gray-500 font-bold text-[10px] mt-2">{m.match_time}</span>
                      )}`;

const newStr = `{activeTab === 'past' ? (
                        <div className="mt-3 bg-red-500/0 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          BİTDİ
                        </div>
                      ) : m.status === 'live' ? (
                        <div className="mt-3 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse border border-red-500/30">
                          Canlı: {calculateLiveMinute(m.timer_status, m.timer_started_at, m.elapsed_seconds, m.half_1_duration, m.half_2_duration, m.extra_time_1, m.extra_time_2)}
                        </div>
                      ) : (
                        <span className="text-gray-500 font-bold text-[10px] mt-2">{m.match_time}</span>
                      )}`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('src/app/matches/page.tsx', content);
