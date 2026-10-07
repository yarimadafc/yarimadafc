const fs = require('fs');
let content = fs.readFileSync('src/app/admin/components/ClubAdmin.tsx', 'utf-8');

const targetStr = `        </div>

        </div>
      </div>
    </div>
  );
}`;

const replaceStr = `        </div>
      </div>
    </div>
  );
}`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
} else {
    // maybe different whitespace
    const splitContent = content.split('{/* Missiya, Vizyon, Dəyərlər */}');
    content = splitContent[0] + `{/* Missiya, Vizyon, Dəyərlər */}
        <div className="bg-[#152741] p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-[#d7bf7b] font-bold tracking-widest text-sm uppercase mb-4">Missiya, Vizyon, Dəyərlər</h3>
          
          {['mission', 'vision', 'values'].map((key) => (
            <div key={key}>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{key === 'mission' ? 'Missiya' : key === 'vision' ? 'Vizyon' : 'Dəyərlər'}</label>
              <div className="flex space-x-4 items-start">
                <textarea value={texts[\`club_\${key}\`]} onChange={e => handleChange(\`club_\${key}\`, e.target.value)} className="flex-1 bg-[#0d1a2d] border border-gray-700 rounded-lg p-3 text-white h-20" />
                <button onClick={() => handleSave(\`club_\${key}\`)} disabled={saving} className="bg-[#d7bf7b] text-[#152741] px-4 py-3 rounded-lg font-bold uppercase text-xs">Yadda Saxla</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
}

fs.writeFileSync('src/app/admin/components/ClubAdmin.tsx', content);
