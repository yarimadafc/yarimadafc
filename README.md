# Yarımada FK — rəsmi sayt

Next.js 16 (App Router) + Supabase. Vercel-də `main` branch-ə hər push avtomatik deploy olunur.

## Lokal işə salmaq

```bash
npm ci
vercel env pull .env.local   # və ya .env.local faylını əl ilə yaradın
npm run dev
```

## Mühit dəyişənləri (Vercel → Settings → Environment Variables)

| Ad | Nə üçün |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase (brauzerdə açıq olur, gizli deyil) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin yazıları, üzvlər, statistika (gizli) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin panelə giriş (gizli) |
| `ADMIN_SESSION_SECRET` | Admin sessiya cookie-sinin imzası (gizli, təsadüfi uzun dəyər) |
| `PASSWORD_RESET_SECRET`, `RESEND_API_KEY`, `RESEND_FROM` | Üzvlərin parol bərpası e-poçtu |
| `IMGBB_API_KEY` | Şəkil yükləmə üçün ehtiyat xidmət (istəyə bağlı) |

## Şəkillər

Admin paneldə hər şəkil yüklənəndə redaktor açılır: şəkli kəsmək və «vacib hissəni» (üz, top) seçmək olar.
Vacib hissə şəklin ünvanına `#f=x,y` kimi yazılır (bazada əlavə sütun lazım deyil) və saytdakı bütün
kəsilmiş görüntülər həmin hissəni göstərir (`src/lib/imageFocus.ts`).
