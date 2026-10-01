# Prompt: Lanjutkan Perbaikan Registrasi Domain

Lanjutkan pekerjaan registrasi subdomain di repository ini. Baca prompt ini bersama instruksi repo terbaru, verifikasi kode saat mulai, lalu implementasikan dan uji perubahan sampai selesai. Jangan menganggap pekerjaan sebelumnya telah mengubah kode.

## Tujuan

Bangun alur registrasi subdomain yang memerlukan approval admin, melindungi nama/hostname yang dicadangkan oleh layanan, dan meminta pemohon memilih DNS yang dikelola layanan atau nameserver kustom.

## Kondisi awal yang sudah ditemukan

- `app/routes/dashboard/domains/register.tsx` saat ini hanya UI placeholder. Tombol pendaftaran disabled dan halaman menyebut registrasi serta pengecekan availability belum terhubung.
- `app/routes/api/v1/domains.ts` hanya menangani GET daftar domain. Belum ada endpoint untuk mengirim registrasi.
- `app/routes/api/v1/domains.availability.ts` hanya memeriksa format nama dan duplikasi di database. Zone yang digunakan adalah `der.my.id`.
- `server/database/schema.ts` memiliki tabel `domain` dengan `status` hanya `active` atau `suspended`. Belum ada status approval atau preferensi DNS/nameserver.
- `server/services/cloudflare.ts` memiliki fungsi membaca dan membuat record DNS. Jangan berasumsi semua subdomain akan ter-proxy hanya karena zone ada di Cloudflare.
- `.env.example` menunjukkan `CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ZONE_ID`; nilai produksi disimpan di Cloudflare Pages secrets. Jangan pernah mencetak atau menyimpan nilai secret.
- Pemeriksaan API zone menggunakan `.env` telah dicoba, tetapi dibatalkan sebelum berjalan. Data record zone belum diperiksa.
- Build terakhir yang terlihat di konteks sebelumnya sukses (`npm run build`), tetapi itu bukan validasi atas perubahan baru.

## Langkah kerja

1. Periksa status git dan instruksi repository terkini. Jangan membuang perubahan pengguna yang sudah ada.
2. Periksa record DNS zone Cloudflare secara manual menggunakan autentikasi lokal yang sama dari `.env` (`CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ZONE_ID`). Lakukan read-only. Cetak hanya informasi record yang diperlukan (nama, tipe, dan bila relevan isi/status proxy); jangan cetak token, seluruh environment, atau header autentikasi. Jika akses gagal, catat kegagalannya dan lanjutkan dengan daftar reservasi awal yang jelas ditandai perlu konfirmasi.
3. Buat daftar nama/keyword/hostname terlarang yang mudah dirawat dalam modul TypeScript dan/atau JSON, terkelompok dalam kategori yang masuk akal untuk layanan subdomain developer (misalnya nama sistem/infrastruktur, keamanan/auth, API, abuse/phishing, dan nama merek/organisasi). Masukkan nama yang benar-benar terlihat pada record sistem zone setelah pemeriksaan. Normalisasi input dan cegah kecocokan yang mengelak aturan sederhana; hindari memblokir substring umum secara berlebihan. Gunakan daftar yang sama untuk availability dan submission supaya pemeriksaan tidak dapat dilewati.
4. Implementasikan pengiriman registrasi dengan status `pending` dan approval/rejection admin. Kredensial/identitas admin harus dapat dikonfigurasi dari environment variable atau Pages secret, bukan dengan mengharuskan akun admin khusus tersimpan di database. Jangan menambahkan credential atau secret ke repository. Batasi aksi approval/rejection hanya untuk admin yang dikonfigurasi, dan berikan respons yang tidak membocorkan data akun.
5. Rancang skema persistensi dan migration yang kompatibel dengan D1 untuk status approval, tujuan/catatan registrasi yang diperlukan, serta pilihan DNS. Cek dan hormati migration yang sudah ada sebelum menambahkan migration baru.
6. Pada formulir registrasi, minta pemohon memilih salah satu: DNS dikelola layanan (`our DNS`) atau custom nameservers. Validasi jumlah/format nameserver dan simpan pilihannya. Jelaskan secara akurat bahwa DNS yang dikelola layanan tidak menjamin Cloudflare proxy pada setiap subdomain/record; set `proxied` secara eksplisit hanya jika record dan tipe record mendukungnya. Jangan mengklaim nameserver kustom sudah aktif bila belum ada mekanisme delegasi/konfigurasi terkait.
7. Tambahkan atau sesuaikan UI/workflow yang dibutuhkan untuk melihat status permintaan dan admin memutuskan approval/rejection. Ikuti pola routing/auth/UI yang sudah ada dan kebijakan legal yang relevan.
8. Tambahkan tes fokus untuk validasi nama terlarang, availability/submission, otorisasi admin, dan pemilihan DNS sesuai test setup repo. Jalankan typecheck/lint/build atau pemeriksaan yang relevan; laporkan semua yang tidak dapat dijalankan.

## Batasan penting

- Jangan pernah menaruh akun/secret admin di database, source code, output terminal, atau berkas tracked.
- Jangan melakukan perubahan DNS live saat pengiriman registrasi; hanya setelah keputusan approval dan dengan aturan yang jelas.
- Jangan menghapus atau mengganti record zone yang sudah ada. Hasil pemeriksaan zone bersifat sumber untuk daftar larangan, bukan izin untuk memodifikasi DNS.
- Approval dan DNS harus aman saat dipanggil berulang kali, dan availability check tidak boleh dianggap sebagai reservasi atomik.
- Pertahankan scope pada registrasi subdomain; hindari refactor yang tidak diperlukan.

## Hasil yang diharapkan

- Permintaan registrasi tersimpan sebagai menunggu review; pemohon dapat melihat statusnya.
- Admin terkonfigurasi melalui Pages secret/environment dapat menyetujui atau menolak tanpa akun admin khusus di database.
- Nama yang dilarang dan hostname/record sistem tidak dapat didaftarkan, dengan daftar kebijakan yang terkelompok serta mudah dirawat.
- Pilihan DNS layanan atau custom nameservers diminta dan tersimpan, dengan batasan proxy/delegasi dijelaskan secara jujur.
- Migration dan pemeriksaan terfokus berhasil, atau blocker dan perintah lanjutan dijelaskan dengan jelas.
