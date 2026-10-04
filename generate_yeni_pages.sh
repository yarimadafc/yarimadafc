#!/bin/bash

# mesqciler/yeni
cat << 'PAGE_EOF' > src/app/adminpanel/mesqciler/yeni/page.tsx
'use client';
export default function YeniMesqci() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Yeni Məşqçi Əlavə Et</h1>
      <p className="text-gray-500">Tezliklə: Forma aktiv ediləcək.</p>
    </div>
  );
}
PAGE_EOF

# oyunlar/yeni
cat << 'PAGE_EOF' > src/app/adminpanel/oyunlar/yeni/page.tsx
'use client';
export default function YeniOyun() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Yeni Oyun Əlavə Et</h1>
      <p className="text-gray-500">Tezliklə: Forma aktiv ediləcək.</p>
    </div>
  );
}
PAGE_EOF

# turnir/yeni
cat << 'PAGE_EOF' > src/app/adminpanel/turnir/yeni/page.tsx
'use client';
export default function YeniTurnir() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Yeni Komanda (Cədvələ) Əlavə Et</h1>
      <p className="text-gray-500">Tezliklə: Forma aktiv ediləcək.</p>
    </div>
  );
}
PAGE_EOF

# sponsorlar/yeni
cat << 'PAGE_EOF' > src/app/adminpanel/sponsorlar/yeni/page.tsx
'use client';
export default function YeniSponsor() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Yeni Sponsor Əlavə Et</h1>
      <p className="text-gray-500">Tezliklə: Forma aktiv ediləcək.</p>
    </div>
  );
}
PAGE_EOF

