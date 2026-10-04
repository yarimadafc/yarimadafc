#!/bin/bash
sed -i '' 's/{heroBanner?.title || '"'"'BU YARIMADA FK.'"'"'} /{heroBanner?.title || '"'"'MEYDANDA GÜC, QƏLBDƏ FUTBOL!'"'"'} /g' src/app/page.tsx
sed -i '' 's/{heroBanner?.subtitle || '"'"'Bakının ən gənc və dinamik futbol akademiyası. Hər oyunu, hər komandanı və hər anı yaxından izlə.'"'"'}/{heroBanner?.subtitle || '"'"'Futbol sadəcə oyun deyil, bir həyat tərzidir. Əsl futbol ruhunu hiss et, zəfərlərə bizimlə addımla və gələcəyin çempionu ol!'"'"'}/g' src/app/page.tsx

# Make buttons rounded-full and w-full on mobile
sed -i '' 's/<div className="flex flex-wrap gap-4">/<div className="flex flex-col sm:flex-row w-full gap-4">/g' src/app/page.tsx
sed -i '' 's/className="ks-button ks-button-primary !bg-\[var(--ks-kinpaku)\] !text-\[var(--ks-ink)\] !border-none hover:!bg-\[var(--ks-kinpaku-vivid)\] !px-8 !py-4 text-lg font-bold"/className="ks-button ks-button-primary !bg-[var(--ks-kinpaku)] !text-[var(--ks-ink)] !border-none hover:!bg-[var(--ks-kinpaku-vivid)] !px-8 !py-4 text-lg font-bold !rounded-full w-full sm:w-auto text-center flex justify-center"/g' src/app/page.tsx
sed -i '' 's/className="ks-button ks-button-secondary !bg-white\/10 !text-white !border-white\/20 hover:!bg-white hover:!text-\[var(--ks-ink)\] backdrop-blur-sm !px-8 !py-4 text-lg font-bold"/className="ks-button ks-button-secondary !bg-white\/10 !text-white !border-white\/20 hover:!bg-white hover:!text-[var(--ks-ink)] backdrop-blur-sm !px-8 !py-4 text-lg font-bold !rounded-full w-full sm:w-auto text-center flex justify-center"/g' src/app/page.tsx

