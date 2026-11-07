// Poptávka z mobilu: fotky, video do 60 s, hlasová zpráva (MediaRecorder) nebo text, kontakt.
// ZATÍM SE NIC NEODESÍLÁ – odeslání (úložiště, upozornění stolaři, AI rozbor) je fáze 2 projektu T26-08-1.
(function () {
  var f = document.getElementById('poptavka');
  if (!f) return;
  var soubory = [], videoDelka = 0, hlas = null;
  function $(id) { return document.getElementById(id); }
  function chyba(id, t) { $(id).textContent = t; }
  function v(id) { return $(id).value.trim(); }

  [].forEach.call(document.querySelectorAll('#typ button'), function (b) {
    b.onclick = function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); };
  });

  function pridej(file, typ) {
    var url = URL.createObjectURL(file), fig = document.createElement('figure'), el;
    if (typ === 'video') {
      el = document.createElement('video'); el.src = url; el.muted = true; el.playsInline = true;
      el.onloadedmetadata = function () {
        videoDelka = el.duration;
        chyba('e-media', el.duration > 60 ? 'Video má ' + Math.round(el.duration) + ' s – nejvýš 60 s. Zkraťte ho, prosím.' : '');
      };
    } else { el = document.createElement('img'); el.src = url; el.alt = file.name; }
    var x = document.createElement('button'); x.type = 'button'; x.textContent = '×'; x.setAttribute('aria-label', 'Odebrat');
    var z = { file: file, typ: typ }; soubory.push(z);
    x.onclick = function () { soubory.splice(soubory.indexOf(z), 1); fig.remove(); if (typ === 'video') { videoDelka = 0; chyba('e-media', ''); } };
    fig.appendChild(el); fig.appendChild(x); $('nahledy').appendChild(fig);
  }
  $('foto').onchange = function (e) { [].forEach.call(e.target.files, function (x) { pridej(x, 'foto'); }); e.target.value = ''; chyba('e-media', ''); };
  $('video').onchange = function (e) {
    if (soubory.some(function (s) { return s.typ === 'video'; })) chyba('e-media', 'Video může být jen jedno.');
    else if (e.target.files[0]) pridej(e.target.files[0], 'video');
    e.target.value = '';
  };

  var rec = null, kusy = [], start = 0, tik = null;
  $('mic').onclick = function () {
    var b = this;
    if (rec && rec.state === 'recording') { rec.stop(); return; }
    if (!navigator.mediaDevices || !window.MediaRecorder) { chyba('e-zprava', 'Tento prohlížeč neumí nahrávat – napište zprávu, prosím.'); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      kusy = []; rec = new MediaRecorder(s);
      rec.ondataavailable = function (e) { kusy.push(e.data); };
      rec.onstop = function () {
        s.getTracks().forEach(function (t) { t.stop(); }); clearInterval(tik); b.classList.remove('nahrava');
        hlas = new Blob(kusy, { type: rec.mimeType }); var p = $('prehravac'); p.src = URL.createObjectURL(hlas); p.hidden = false;
        $('mic-text').textContent = 'Nahráno – klepněte pro novou nahrávku';
      };
      rec.start(); start = Date.now(); b.classList.add('nahrava'); $('mic-text').textContent = 'Nahrávám… klepněte pro konec';
      tik = setInterval(function () { var s2 = Math.floor((Date.now() - start) / 1000); $('cas').textContent = Math.floor(s2 / 60) + ':' + ('0' + s2 % 60).slice(-2); if (s2 >= 180) rec.stop(); }, 250);
      chyba('e-zprava', '');
    }).catch(function () { chyba('e-zprava', 'Mikrofon není povolený. Povolte ho v prohlížeči, nebo zprávu napište.'); });
  };

  f.onsubmit = function (e) {
    e.preventDefault(); var ok = true;
    var typy = [].map.call(document.querySelectorAll('#typ [aria-pressed="true"]'), function (b) { return b.textContent; });
    chyba('e-typ', typy.length ? '' : 'Vyberte aspoň jednu možnost.'); ok = ok && typy.length > 0;
    if (!soubory.length) { chyba('e-media', 'Přidejte aspoň jednu fotku nebo video.'); ok = false; } else if (videoDelka > 60) ok = false;
    if (!hlas && !v('text')) { chyba('e-zprava', 'Nahrajte hlasovou zprávu nebo napište pár slov.'); ok = false; } else chyba('e-zprava', '');
    var k = []; if (!v('jmeno')) k.push('jméno');
    if (!v('tel') && !v('mail')) k.push('telefon nebo e-mail');
    if (v('mail') && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('mail'))) k.push('platný e-mail');
    if (!$('souhlas').checked) k.push('souhlas');
    chyba('e-kontakt', k.length ? 'Doplňte: ' + k.join(', ') + '.' : ''); ok = ok && !k.length;
    if (!ok) { var p = [].find.call(document.querySelectorAll('.chyba'), function (x) { return x.textContent; }); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    var fot = soubory.filter(function (s) { return s.typ === 'foto'; }).length, vid = soubory.length - fot;
    var r = ['Co: ' + typy.join(', '), 'Fotky: ' + fot + (vid ? ', video: ' + Math.round(videoDelka) + ' s' : ''),
      'Zpráva: ' + (hlas ? 'hlasová nahrávka' + (v('text') ? ' + text' : '') : 'text'),
      'Cena: ' + (v('rozpocet') || 'neuvedeno') + ' · termín: ' + (v('termin') || 'nespěchá'),
      'Kontakt: ' + v('jmeno') + (v('obec') ? ', ' + v('obec') : '')];
    $('souhrn').innerHTML = '';
    r.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; $('souhrn').appendChild(li); });
    f.hidden = true; $('hotovo').hidden = false; $('hotovo').scrollIntoView({ behavior: 'smooth' });
  };
})();
