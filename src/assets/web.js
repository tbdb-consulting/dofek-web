// Menu na mobilu, prohlížeč fotek a filtr referencí. Bez knihoven.
(function () {
  var t = document.querySelector('.menu-tlacitko'), m = document.getElementById('menu');
  if (t && m) {
    t.addEventListener('click', function () {
      var o = m.classList.toggle('menu-otevrene');
      t.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    m.addEventListener('click', function (e) { if (e.target.tagName === 'A') { m.classList.remove('menu-otevrene'); t.setAttribute('aria-expanded', 'false'); } });
  }

  // Prohlížeč: klepnutí na fotku v galerii ji otevře ve velkém; šipky, klávesy a přejetí prstem.
  var d = document.getElementById('prohlizec');
  if (d && d.showModal) {
    var img = d.querySelector('img'), popis = d.querySelector('.prohlizec-popis'), sada = [], i = 0;
    function ukaz() { var a = sada[i]; img.src = a.href; img.alt = a.querySelector('img').alt; popis.textContent = a.dataset.popis + ' · ' + (i + 1) + ' z ' + sada.length; }
    function posun(k) { i = (i + k + sada.length) % sada.length; ukaz(); }
    document.querySelectorAll('[data-galerie]').forEach(function (g) {
      g.addEventListener('click', function (e) {
        var a = e.target.closest('a'); if (!a) return;
        e.preventDefault();
        sada = [].slice.call(g.querySelectorAll('a')); i = sada.indexOf(a); ukaz(); d.showModal();
      });
    });
    d.querySelector('.prohlizec-zavrit').onclick = function () { d.close(); };
    d.querySelector('.vlevo').onclick = function () { posun(-1); };
    d.querySelector('.vpravo').onclick = function () { posun(1); };
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') posun(-1); if (e.key === 'ArrowRight') posun(1); });
    var x0 = null;
    d.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    d.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) posun(dx < 0 ? 1 : -1); x0 = null; });
  }

  // Filtr referencí podle druhu nábytku; adresa #kuchyne otevře rovnou kuchyně.
  var f = document.querySelector('.filtr');
  if (f) {
    var tl = [].slice.call(f.querySelectorAll('button')), sekce = [].slice.call(document.querySelectorAll('.ref-kategorie'));
    function filtruj(kod) {
      tl.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.filtr === kod ? 'true' : 'false'); });
      sekce.forEach(function (s) { s.hidden = !!kod && s.dataset.kategorie !== kod; });
    }
    tl.forEach(function (b) { b.onclick = function () { filtruj(b.dataset.filtr); history.replaceState(null, '', b.dataset.filtr ? '#' + b.dataset.filtr : location.pathname); }; });
    var h = location.hash.slice(1);
    if (h && sekce.some(function (s) { return s.dataset.kategorie === h; })) filtruj(h);
  }
})();
