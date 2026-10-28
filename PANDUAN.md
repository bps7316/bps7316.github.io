# Kit Halaman Pembungkus PST (GitHub Pages)

Tujuan: pengunjung membuka alamat pendek seperti `https://bps7316.github.io/bukutamu/`, dan yang tampil di bilah
alamat tetap alamat pendek itu, bukan `.../exec` yang panjang. Aplikasi PST tampil layar penuh di dalam halaman ini,
dan datanya tetap masuk ke Spreadsheet PST yang sama.

## Alamat yang dihasilkan (akun `bps7316`, repository `bps7316.github.io`)
| Halaman | Alamat |
|---|---|
| Aplikasi lengkap | https://bps7316.github.io/ |
| Buku Tamu | https://bps7316.github.io/bukutamu/ |
| Permintaan Data | https://bps7316.github.io/permintaan-data/ |
| Konsultasi DTSEN (Desil) | https://bps7316.github.io/konsultasi-desil/ |
| Pengaduan | https://bps7316.github.io/pengaduan/ |
| Cek Status Permintaan | https://bps7316.github.io/cek-status/ |

Halaman utama juga meneruskan menu tertentu: `https://bps7316.github.io/?page=galeri`.

## Isi kit
    index.html                      halaman utama (aplikasi lengkap)
    bukutamu/index.html             Buku Tamu saja
    permintaan-data/index.html      Permintaan Data saja
    konsultasi-desil/index.html     Konsultasi DTSEN saja
    pengaduan/index.html            Pengaduan saja
    cek-status/index.html           Cek Status saja
    pengaturan.js                   <-- SATU-SATUNYA berkas berisi alamat /exec PST
    pst.js                          pemuat aplikasi (tidak perlu diubah)
    404.html                        halaman bila alamat salah
    favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, icon-512.png
                                    ikon PST (tab browser, layar utama HP, dan pratinjau tautan)

## Prasyarat
Paket PST terbaru (yang memuat *mode formulir tunggal* dan isian **Alamat Halaman Pembungkus**) sudah dipasang dan
di-deploy sebagai New version. Tanpa itu, halaman formulir mandiri tetap menampilkan aplikasi lengkap.

## Langkah pemasangan
1. Masuk ke GitHub dengan akun `bps7316`. Buat repository baru bernama **persis** `bps7316.github.io`, pilih **Public**.
2. Ekstrak zip ini. Di repository, klik **Add file > Upload files**, lalu seret **isi** folder hasil ekstrak
   (berkas dan subfolder `bukutamu`, `permintaan-data`, dst.), bukan folder induknya. Klik **Commit changes**.
3. Buka **Settings > Pages**. Pada *Build and deployment*, pilih **Deploy from a branch**, Branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu satu sampai dua menit, lalu buka `https://bps7316.github.io/bukutamu/`.
5. Hubungkan ke PST: **Pengaturan > Alamat Halaman Pembungkus**, isi `https://bps7316.github.io/`, klik
   **Uji buka link ini**, lalu **Simpan Pengaturan Instansi**. Bagian **Tautan Formulir Mandiri** di bawahnya, termasuk
   QR dan **Cetak Kartu**, kini memakai alamat pendek.

Bila nama `bps7316.github.io` tidak dipakai (misalnya memakai repository bernama `pst`), alamatnya menjadi
`https://bps7316.github.io/pst/bukutamu/` dan isian di Pengaturan menjadi `https://bps7316.github.io/pst/`.

## Bila folder tidak bisa diunggah (cara cadangan, tanpa folder)
Unggah folder lewat browser kadang gagal. Kit ini tetap bekerja tanpa kelima subfolder:
1. Unggah hanya berkas biasa di akar repository: `index.html`, `404.html`, `pengaturan.js`, `pst.js`.
2. Alamat `/bukutamu/`, `/permintaan-data/`, `/konsultasi-desil/`, `/pengaduan/`, dan `/cek-status/` otomatis dilayani
   oleh `404.html`, yang membaca nama alamat lalu memuat formulir yang sesuai. Alamat yang tidak dikenal menampilkan
   "Halaman tidak ditemukan".
3. Catatan teknis: GitHub Pages menandai alamat-alamat itu sebagai "404" di balik layar. Halaman tetap tampil normal di
   browser dan di QR. Yang mungkin tidak muncul hanya pratinjau tautan (gambar/judul) saat dibagikan di beberapa aplikasi
   chat. Kalau pratinjau itu penting, unggah kelima subfolder juga (folder yang ada didahulukan dari 404.html).
4. Cara cadangan ini berlaku untuk repository bernama `NAMA.github.io`. Untuk repository proyek (misalnya `pst`),
   gunakan subfolder.

## Ikon (favicon) PST
Ikon dibuat dari logo PST (garisnya ditebalkan pada ukuran kecil agar terbaca di tab). Unggah kelima berkas ikon ke akar repository bersama halaman yang diperbarui. `favicon-32x32.png` juga dipakai oleh aplikasi PST
(alamatnya tertulis di `Code.js` sebagai `FAVICON_URL`), sehingga **ikon di tab aplikasi baru muncul setelah berkas itu ada di GitHub**.
Berkas `icon-512.png` dipakai sebagai gambar pratinjau saat tautan dibagikan di WhatsApp. Peramban menyimpan ikon lama cukup lama:
bila ikon belum berubah, tutup tab, atau buka dengan Ctrl+F5.

## Ketahanan terhadap galat sementara Google
Mulai versi ini, PST mengirim sinyal "siap" ke halaman pembungkus. Bila sinyal tidak datang (misalnya Google
menampilkan halaman *error pada server ... INTERNAL*), halaman pembungkus **mencoba memuat ulang otomatis sampai 2 kali**,
lalu menampilkan pesan "Aplikasi belum bisa dimuat" dengan tombol **Muat ulang** dan tautan **buka langsung**.

**Urutan pemasangan (penting):**
1. Pasang pembaruan PST yang memuat sinyal "siap" (berkas `Shell.html` terbaru), lalu *Deploy New version*.
2. **Baru** unggah `pst.js` yang baru ke repository GitHub (menimpa berkas lama).
Bila `pst.js` baru dipasang sebelum PST diperbarui, pembungkus menganggap aplikasi gagal dan memuat ulang terus. Untuk
mematikan fitur ini sementara, tambahkan satu baris di `pengaturan.js`: `window.PST_SINYAL = false;`

Waktu tunggu bawaan: 15 detik setelah bingkai selesai dimuat dan 40 detik per percobaan. Dapat diubah di `pengaturan.js`
dengan `window.PST_TUNGGU_MUAT = 20000;` dan `window.PST_TUNGGU_MAKS = 50000;`.

## Bila alamat /exec PST berubah
Edit **hanya** `pengaturan.js` (ikon pensil di GitHub), ganti nilai `PST_EXEC`, lalu Commit. Alamat harus berbentuk
`https://script.google.com/macros/s/XXXXXXXX/exec`. Jika bentuknya salah, halaman menampilkan pesan, bukan layar kosong.
Untuk menghindarinya, selalu perbarui PST lewat Deploy > Manage deployments > pensil > **New version** pada deployment yang sama.

## Hal yang perlu diketahui
- **TV, kios, dan petugas** sebaiknya tetap memakai alamat `/exec` langsung (suara otomatis, layar penuh, dan login
  petugas lebih tepat tanpa lapisan tambahan). Alamat pendek untuk pengunjung.
- Di dalam halaman pembungkus, perpindahan menu di aplikasi tidak mengubah alamat di bilah alamat. Itu wajar.
- Repository ini **publik**. Isinya hanya alamat `/exec` yang memang publik. Jangan mengunggah `Code.js`,
  password aplikasi, atau data Spreadsheet.
- Halaman lain di akun yang sama tetap jalan, misalnya pencarian SLS atau Kegiatan sebagai repository terpisah:
  `https://bps7316.github.io/NAMA-REPOSITORY/`.
- Dugaan bahwa halaman pembungkus mengurangi masalah "tidak dapat membuka file" untuk HP yang login ke beberapa akun
  Google **belum teruji**. Uji dari HP sungguhan sebelum dibagikan ke umum.
- Tulisan "Jika tidak tampil, buka langsung" di halaman muat adalah jalan keluar bila bingkai gagal dimuat.
