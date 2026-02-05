# Panduan Pembuatan APK untuk VidMood

## Langkah 1: Persiapan Ikon Aplikasi

Karena kita tidak bisa membuat file PNG otomatis di lingkungan Anda, silakan ikuti langkah-langkah berikut untuk membuat ikon:

1. Gunakan file SVG yang sudah dibuat:
   - `icon-192x192.svg`
   - `icon-512x512.svg`

2. Konversi file SVG ke PNG dengan salah satu cara berikut:
   - Gunakan situs online seperti [convertio.co](https://convertio.co/svg-png/)
   - Gunakan software seperti GIMP atau Photoshop
   - Gunakan alat command-line seperti ImageMagick: `magick convert icon-192x192.svg icon-192x192.png`

3. Simpan hasil konversi ke folder `/public/` dengan nama yang sama:
   - `/public/icon-192x192.png`
   - `/public/icon-512x512.png`

## Langkah 2: Uji PWA di Localhost

Sebelum ke PWABuilder, pastikan aplikasi berjalan dengan baik secara lokal:

```bash
npm run dev
```

Pastikan aplikasi dapat diakses di `http://localhost:3000`

## Langkah 3: Uji di PWABuilder

1. Buka https://www.pwabuilder.com
2. Masukkan URL aplikasi Anda (lokal atau deployed):
   - Jika lokal: `http://localhost:3000`
   - Jika deployed: `https://vid-mood.vercel.app`
3. Klik "Start"
4. Periksa skor dan rekomendasi

## Langkah 4: Generate APK

1. Setelah analisis selesai, klik tab "Android"
2. Klik "Download Package" atau "Generate"
3. Tunggu hingga proses selesai
4. Download file APK yang dihasilkan

## Langkah 5: Install di Android

1. Transfer file APK ke perangkat Android Anda
2. Aktifkan "Sumber Tidak Dikenal" di pengaturan keamanan
3. Buka file APK dan instal

## Konfigurasi PWA yang Sudah Dioptimalkan

Konfigurasi berikut sudah disiapkan untuk mendukung pembuatan APK:

- File `manifest.json` telah diperbarui dengan:
  - Properti `scope`, `purpose`, `categories`, `lang`, dan `dir`
  - Warna tema yang konsisten
  - Deskripsi dan metadata yang lengkap

- File `sw.js` (service worker) telah ditingkatkan dengan:
  - Manajemen cache yang lebih baik
  - Strategi offline-first
  - Pembaruan cache otomatis

- File `layout.tsx` telah ditambahi dengan:
  - Meta tag tambahan untuk PWA
  - Kompatibilitas Android dan iOS
  - Tag untuk Microsoft dan Apple

## Catatan Penting

- Pastikan ikon PNG sudah benar-benar diganti sebelum menguji di PWABuilder
- File ikon harus memiliki ukuran tepat: 192x192px dan 512x512px
- Aplikasi harus dapat diakses dari jaringan (tidak hanya localhost) untuk PWABuilder