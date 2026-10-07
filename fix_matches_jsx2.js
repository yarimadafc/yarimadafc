const fs = require('fs');
let content = fs.readFileSync('src/app/matches/page.tsx', 'utf-8');

const regex = /\{activeTab === 'past' \? \([\s\S]*?BİTDİ\n\s*<\/div>\n\s*\) : \(/m;
const replacement = `{activeTab === 'past' ? (
                        <div className="mt-3 bg-red-500/0 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          BİTDİ
                        </div>
                     ) : m.status === 'live' ? (
                        <div className="mt-3 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse border border-red-500/30">
                          Canlı: {calculateLiveMinute(m.timer_status, m.timer_started_at, m.elapsed_seconds, m.half_1_duration, m.half_2_duration, m.extra_time_1, m.extra_time_2)}
                        </div>
                     ) : (`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/app/matches/page.tsx', content);
