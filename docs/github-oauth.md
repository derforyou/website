# GitHub OAuth

Dokumen ini menjelaskan cara menghubungkan GitHub OAuth dengan autentikasi Better Auth di aplikasi.

## Buat GitHub OAuth App

Di GitHub, buka **Settings > Developer settings > OAuth Apps > New OAuth App**, lalu isi:

- **Application name**: nama aplikasi Anda.
- **Homepage URL**: URL publik aplikasi, misalnya `https://example.com`.
- **Authorization callback URL**: URL callback Better Auth, yaitu:

  ```text
  https://<domain-aplikasi>/api/auth/callback/github
  ```

Untuk pengembangan lokal, callback-nya:

```text
http://localhost:5173/api/auth/callback/github
```

Simpan nilai **Client ID** dan buat **Client secret**. GitHub OAuth App menggunakan satu callback URL terdaftar; untuk memisahkan lokal dan produksi, buat OAuth App terpisah untuk tiap lingkungan.

## Atur environment variables

Sediakan variabel berikut di environment aplikasi:

| Variable | Nilai |
| --- | --- |
| `GITHUB_CLIENT_ID` | Client ID dari GitHub OAuth App |
| `GITHUB_CLIENT_SECRET` | Client secret dari GitHub OAuth App |
| `APP_URL` | Origin aplikasi, seperti `https://example.com` tanpa path `/api/auth` |
| `BETTER_AUTH_SECRET` | Secret acak yang kuat untuk Better Auth |

> **Penting:** Simpan `GITHUB_CLIENT_SECRET` dan `BETTER_AUTH_SECRET` sebagai secrets di Cloudflare Pages/Workers. Jangan commit nilainya ke repositori atau menaruhnya di file yang dipublikasikan.

Di Cloudflare, atur environment variables dan secrets pada project Pages yang menjalankan aplikasi. Pastikan `APP_URL` memakai origin yang sama dengan domain publik dan **Homepage URL** GitHub OAuth App.

Untuk development lokal, gunakan `.dev.vars` yang tidak dilacak Git, atau mekanisme lokal setara:

```dotenv
APP_URL=http://localhost:5173
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
```

## Cara kerja pada aplikasi

GitHub OAuth diaktifkan jika `GITHUB_CLIENT_ID` dan `GITHUB_CLIENT_SECRET` tersedia. Better Auth menggunakan `APP_URL` sebagai base URL, dengan default `http://localhost:5173`, sedangkan handler aplikasi meneruskan request pada `/api/auth/*` ke Better Auth.

Dokumentasi ini mengikuti konfigurasi di `server/services/auth.ts` dan `functions/[[path]].ts`.