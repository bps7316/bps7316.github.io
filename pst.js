// Memuat aplikasi PST di dalam halaman ini (layar penuh), sehingga yang tampil di bilah alamat
// adalah alamat halaman ini, bukan alamat panjang .../exec.
//
// KETAHANAN: PST mengirim sinyal "siap" (postMessage) begitu aplikasinya berjalan. Bila sinyal itu tidak
// datang (mis. Google menampilkan halaman galat sementara), halaman ini mencoba memuat ulang otomatis
// (maksimal 2 kali), lalu menampilkan pesan dengan tombol "Muat ulang" dan "Buka langsung".
// Untuk mematikan fitur ini (mis. PST belum diperbarui), tulis di pengaturan.js:  window.PST_SINYAL = false;
(function () {
  var skrip = document.currentScript;
  var halaman = (skrip && skrip.getAttribute('data-halaman')) || '';
  var pola = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
  var teks = document.getElementById('teksMuat');
  var bingkai = document.getElementById('app');
  var langsung = document.getElementById('langsung');
  var tidakAda = document.getElementById('tidakAda');
  var muatKotak = document.getElementById('muat');

  // Nama alamat -> halaman PST. Dipakai bila berkas ini dimuat dari 404.html (tanpa folder),
  // sehingga alamat seperti /bukutamu/ tetap bekerja walau foldernya tidak diunggah.
  var PETA = { 'bukutamu': 'bukutamu', 'permintaan-data': 'formpelayanan', 'konsultasi-desil': 'konsultasidesil', 'pengaduan': 'pengaduan', 'cek-status': 'cekstatus' };
  var segmen = location.pathname.replace(/\/+$/, '').split('/').pop().toLowerCase();

  function galat(pesan) { if (teks) teks.textContent = pesan; if (bingkai) bingkai.style.display = 'none'; }

  if (!halaman && PETA[segmen]) {
    halaman = PETA[segmen];
  } else if (!halaman && tidakAda && segmen !== '' && segmen !== 'index.html') {
    // alamat yang tidak dikenal (hanya terjadi di 404.html)
    if (muatKotak) muatKotak.style.display = 'none';
    if (bingkai) bingkai.style.display = 'none';
    tidakAda.style.display = 'flex';
    return;
  }

  if (!pola.test(window.PST_EXEC || '')) { galat('Alamat aplikasi belum diisi dengan benar di berkas pengaturan.js.'); return; }

  var param = [];
  if (halaman) {
    // halaman formulir tunggal: ...?page=NAMA&solo=1
    param.push('page=' + halaman, 'solo=1');
  } else {
    // halaman utama: boleh meneruskan ?page=NAMA (huruf kecil saja), mis. .../?page=galeri
    var q = new URLSearchParams(location.search);
    var p = String(q.get('page') || '').toLowerCase().replace(/[^a-z]/g, '');
    if (p) { param.push('page=' + p); if (q.get('solo') === '1') param.push('solo=1'); }
  }
  var url = window.PST_EXEC + (param.length ? '?' + param.join('&') : '');
  if (langsung) langsung.href = url;

  // ---------- pemuatan dengan sinyal "siap" ----------
  var SINYAL = window.PST_SINYAL !== false;
  var TUNGGU_SETELAH_MUAT = window.PST_TUNGGU_MUAT || 15000;   // setelah bingkai selesai dimuat, tunggu sinyal sekian ms
  var TUNGGU_MAKS = window.PST_TUNGGU_MAKS || 40000;           // batas total per percobaan (HP dengan sinyal lambat)
  var COBA_OTOMATIS = (window.PST_COBA_OTOMATIS != null) ? window.PST_COBA_OTOMATIS : 2;
  var percobaan = 0, siap = false, timerMuat = null, timerMaks = null, tombol = null;

  function hentikanPewaktu() { clearTimeout(timerMuat); clearTimeout(timerMaks); }
  function asalDipercaya(o) { return /^https:\/\/([a-z0-9-]+\.)*(googleusercontent\.com|google\.com)$/i.test(String(o || '')); }

  function tampilkanSiap() {
    siap = true; hentikanPewaktu();
    bingkai.style.visibility = 'visible';
    if (muatKotak) muatKotak.style.display = 'none';
  }

  function tampilkanKesalahan() {
    hentikanPewaktu();
    bingkai.style.visibility = 'hidden';
    if (muatKotak) { muatKotak.style.display = 'flex'; muatKotak.style.zIndex = '5'; }
    if (teks) teks.textContent = 'Aplikasi belum bisa dimuat. Biasanya karena gangguan sementara dari Google. Silakan coba lagi.';
    if (!tombol && muatKotak) {
      tombol = document.createElement('button');
      tombol.type = 'button';
      tombol.textContent = 'Muat ulang';
      tombol.style.cssText = 'margin-top:6px;padding:10px 22px;font:inherit;font-weight:600;border:0;border-radius:10px;background:#fff;color:#1F3864;cursor:pointer';
      tombol.addEventListener('click', function () {
        percobaan = 0;
        bingkai.style.visibility = 'visible';
        if (muatKotak) muatKotak.style.zIndex = '';
        if (teks) teks.textContent = 'Memuat ulang\u2026';
        tombol.style.display = 'none';
        mulai();
      });
      muatKotak.insertBefore(tombol, muatKotak.children[1] || null);
    }
    if (tombol) tombol.style.display = '';
  }

  function gagal() {
    if (siap) return;
    if (percobaan < COBA_OTOMATIS) { percobaan++; mulai(); return; }
    tampilkanKesalahan();
  }

  function mulai() {
    siap = false; hentikanPewaktu();
    var alamat = url + (percobaan ? (url.indexOf('?') === -1 ? '?' : '&') + '_r=' + percobaan : '');
    if (SINYAL) timerMaks = setTimeout(gagal, TUNGGU_MAKS);
    bingkai.src = alamat;
  }

  bingkai.addEventListener('load', function () {
    if (!SINYAL) { tampilkanSiap(); return; }          // perilaku lama: anggap siap saat bingkai selesai dimuat
    if (siap) return;
    clearTimeout(timerMuat);
    timerMuat = setTimeout(gagal, TUNGGU_SETELAH_MUAT);
  });

  window.addEventListener('message', function (e) {
    if (!asalDipercaya(e.origin)) return;               // hanya dari domain Google (tempat PST berjalan)
    if (!e.data || e.data.tipe !== 'pst-siap') return;
    tampilkanSiap();
  });

  mulai();
})();
