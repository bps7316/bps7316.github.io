// Memuat aplikasi PST di dalam halaman ini (layar penuh), sehingga yang tampil di bilah alamat
// adalah alamat halaman ini, bukan alamat panjang .../exec.
(function () {
  var skrip = document.currentScript;
  var halaman = (skrip && skrip.getAttribute('data-halaman')) || '';
  var pola = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
  var teks = document.getElementById('teksMuat');
  var bingkai = document.getElementById('app');
  var langsung = document.getElementById('langsung');

  function galat(pesan) { if (teks) teks.textContent = pesan; if (bingkai) bingkai.style.display = 'none'; }
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
  var selesai = false;
  bingkai.addEventListener('load', function () {
    selesai = true;
    var m = document.getElementById('muat'); if (m) m.style.display = 'none';
  });
  setTimeout(function () {
    if (!selesai && teks) teks.textContent = 'Memuat lebih lama dari biasanya. Periksa koneksi internet Anda.';
  }, 12000);
  bingkai.src = url;
})();
