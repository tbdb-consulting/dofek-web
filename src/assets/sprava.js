// Správa poptávek – UKÁZKA bez databáze. Data v sprava-data.js, změny jen v paměti prohlížeče.
// Ve skutečném provozu: rozbor a návrh položek z AI (multimodální model), vizualizace z modelu pro
// úpravu obrázků nad fotkou zákazníka, odeslání e-mailem z adresy stolařství.
(function () {
  var P = window.POPTAVKY, C = window.CENIK.polozky;
  var STAVY = { nova: "Nová", navrh: "Návrh připraven", odeslano: "Nabídka odeslána" };
  var filtr = "";
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function kc(n) { return Math.round(n).toLocaleString("cs-CZ").replace(/\s/g, " ") + " Kč"; }
  function zaokr(n) { return Math.round(n / 1000) * 1000; }
  function polozka(kod) { return C.filter(function (c) { return c.kod === kod; })[0]; }
  function ted() { var d = new Date(); return d.getDate() + ". " + (d.getMonth() + 1) + ". " + d.getFullYear() + " " + d.getHours() + ":" + ("0" + d.getMinutes()).slice(-2); }

  // ---------- seznam ----------
  function seznam() {
    var f = $("#filtr-stav");
    f.innerHTML = [["", "Vše"], ["nova", "Nové"], ["navrh", "Návrh připraven"], ["odeslano", "Odeslané"]].map(function (x) {
      var n = P.filter(function (p) { return !x[0] || p.stav === x[0]; }).length;
      return '<button type="button" data-f="' + x[0] + '" aria-pressed="' + (filtr === x[0]) + '">' + x[1] + " (" + n + ")</button>";
    }).join("");
    [].forEach.call(f.querySelectorAll("button"), function (b) { b.onclick = function () { filtr = b.dataset.f; seznam(); }; });
    $("#karty").innerHTML = P.filter(function (p) { return !filtr || p.stav === filtr; }).map(function (p) {
      var c = cena(p);
      return '<a class="pkarta" href="#' + p.id + '"><span class="stav stav-' + p.stav + '">' + STAVY[p.stav] + "</span>" +
        "<b>" + esc(p.typ.join(", ")) + "</b><span>" + esc(p.zakaznik.jmeno) + " · " + esc(p.zakaznik.obec) + "</span>" +
        '<span class="pozn">' + p.id + " · " + p.prijato + " · " + p.media.fotky + " fotky" + (p.media.video ? ", video" : "") + (p.media.hlas ? ", hlas " + p.media.hlas : "") + "</span>" +
        (c ? '<span class="pcena">' + kc(c.od) + " – " + kc(c.do) + "</span>" : "") + "</a>";
    }).join("") || '<p class="pozn">Žádné poptávky v tomto stavu.</p>';
  }

  function cena(p) {
    if (!p.kalkulace || !p.kalkulace.length) return null;
    var od = 0, d = 0;
    p.kalkulace.forEach(function (r) { var c = polozka(r.kod); od += c.od * r.mnozstvi; d += c.do * r.mnozstvi; });
    return { od: zaokr(od), do: zaokr(d) };
  }

  // ---------- vizualizace (v ukázce kresba, ne AI) ----------
  function svgKuchyne(v) {
    var dv = v === "A" ? "#f7f7f5" : "#eceae6", deska = v === "A" ? "#c39a6b" : "#8a7a6a";
    var s = '<svg viewBox="0 0 320 220" role="img" aria-label="Ilustrační kuchyň varianta ' + v + '"><rect width="320" height="220" fill="#ece4d8"/><rect y="190" width="320" height="30" fill="#c9bba6"/>';
    for (var i = 0; i < 6; i++) s += '<rect x="' + (20 + i * 40) + '" y="12" width="38" height="70" fill="' + dv + '" stroke="#bbb"/>';
    s += '<rect x="20" y="118" width="240" height="8" fill="' + deska + '"/>';
    for (i = 0; i < 6; i++) s += '<rect x="' + (20 + i * 40) + '" y="126" width="38" height="64" fill="' + dv + '" stroke="#bbb"/>';
    s += '<rect x="260" y="12" width="44" height="178" fill="' + dv + '" stroke="#bbb"/><rect x="266" y="60" width="32" height="26" fill="#333"/><rect x="266" y="92" width="32" height="26" fill="#333"/>';
    if (v === "A") s += '<rect x="20" y="82" width="240" height="3" fill="#fff6c8"/>';
    return s + "</svg>";
  }
  function svgSkrin(v) {
    var s = '<svg viewBox="0 0 320 220" role="img" aria-label="Ilustrační skříň varianta ' + v + '"><rect width="320" height="220" fill="#ece4d8"/><rect y="196" width="320" height="24" fill="#c9bba6"/><rect x="60" y="10" width="200" height="186" fill="#f7f7f5" stroke="#b9b1a5"/>';
    var n = v === "A" ? 3 : 2, w = 196 / n;
    for (var i = 0; i < n; i++) {
      var zr = (v === "A" && i === 1) || (v === "B" && i === 1);
      s += '<rect x="' + (62 + i * w) + '" y="14" width="' + (w - 2) + '" height="180" fill="' + (zr ? "#cfdde3" : "#fbfbfa") + '" stroke="#c8c1b6"/>';
      if (zr) s += '<path d="M' + (72 + i * w) + ' 40l22-16M' + (72 + i * w) + ' 70l40-28" stroke="#fff" stroke-width="3" opacity=".7"/>';
    }
    if (v === "B") s += '<rect x="62" y="80" width="96" height="8" fill="#c39a6b"/><rect x="62" y="140" width="96" height="8" fill="#c39a6b"/>';
    return s + "</svg>";
  }
  function svgPolice() {
    var s = '<svg viewBox="0 0 320 220" role="img" aria-label="Ilustrační knihovna"><rect width="320" height="220" fill="#ece4d8"/><rect y="196" width="320" height="24" fill="#c9bba6"/><rect x="20" y="14" width="280" height="182" fill="#f7f7f5" stroke="#b9b1a5"/>';
    for (var r = 1; r < 5; r++) s += '<rect x="22" y="' + (14 + r * 36) + '" width="276" height="5" fill="#c39a6b"/>';
    for (var c = 1; c < 4; c++) s += '<rect x="' + (20 + c * 70) + '" y="14" width="4" height="182" fill="#ddd"/>';
    return s + "</svg>";
  }
  function vizu(p, v) {
    var t = p.typ.join(" ").toLowerCase();
    return t.indexOf("kuch") >= 0 ? svgKuchyne(v) : t.indexOf("skří") >= 0 ? svgSkrin(v) : svgPolice();
  }
  var POPIS_VARIANT = { A: "A – podle přání zákazníka", B: "B – alternativa (jiné dveře / materiál)" };

  // ---------- ukázkové „AI“ výsledky pro novou poptávku ----------
  var AI = {
    "P-0003": {
      rozbor: { typ: "Rohová kuchyňská linka (tvar L), horní skříňky ke stropu", rozmery: "stěny cca 3,00 m a 1,80 m (z hlasu, neměřeno); výšku stropu ověřit",
        material: "Bílá matná dvířka bez úchytek, pracovní deska dub", vnitrek: "Vestavná trouba a myčka zákazníka",
        overit: ["Přesné rozměry, výška stropu a rovinnost stěn", "Rozvody vody, odpadu a elektřiny", "Rozměry vlastní trouby a myčky", "Lakovaná, nebo laminová dvířka (cena)"] },
      kalkulace: [{ kod: "korpus-lamino", mnozstvi: 4.8 }, { kod: "korpus-horni", mnozstvi: 4.8 }, { kod: "pracovni-deska", mnozstvi: 4.8 },
        { kod: "dvirka-lamino", mnozstvi: 8.5 }, { kod: "kovani-tiche", mnozstvi: 14 }, { kod: "led", mnozstvi: 4.2 }, { kod: "montaz", mnozstvi: 1 }]
    }
  };

  // ---------- detail ----------
  function detail(id) {
    var p = P.filter(function (x) { return x.id === id; })[0];
    if (!p) { $("#seznam").hidden = false; $("#detail").hidden = true; seznam(); return; }
    $("#seznam").hidden = true; var d = $("#detail"); d.hidden = false;
    var z = p.zakaznik, c = cena(p);
    var h = '<p><a href="#" class="zpet">← všechny poptávky</a></p>' +
      '<div class="dhlava"><div><h1>' + esc(p.typ.join(", ")) + ' <span class="stav stav-' + p.stav + '">' + STAVY[p.stav] + "</span></h1>" +
      '<p class="pozn">' + p.id + " · přijato " + p.prijato + (p.odeslano ? " · nabídka odeslána " + p.odeslano : "") + "</p></div>" +
      '<div class="kontakt"><b>' + esc(z.jmeno) + "</b> · " + esc(z.obec) + '<br><a href="tel:' + esc(z.tel.replace(/\s/g, "")) + '">' + esc(z.tel) + '</a> · <a href="mailto:' + esc(z.email) + '">' + esc(z.email) + "</a><br>Rozpočet: " + esc(p.rozpocet) + " · termín: " + esc(p.termin) + "</div></div>";

    // 1. Co poslal
    h += '<section class="dkarta"><h2>1. Co poslal zákazník</h2><div class="media">';
    for (var i = 1; i <= p.media.fotky; i++) h += '<div class="mfoto">📷<span>Fotka ' + i + "</span></div>";
    if (p.media.video) h += '<div class="mfoto">🎬<span>Video</span></div>';
    h += "</div>" + (p.media.hlas ? '<p><b>Hlasová zpráva ' + p.media.hlas + '</b> <span class="pozn">(v ukázce bez zvuku)</span></p>' : "") +
      '<p><b>Přepis' + (p.media.hlas ? " (automaticky)" : "") + ':</b></p><blockquote>' + esc(p.prepis) + "</blockquote></section>";

    // 2. Rozbor
    h += '<section class="dkarta"><h2>2. Rozbor poptávky <small>připraví AI, vy upravíte</small></h2>';
    if (!p.rozbor) h += '<button class="tlacitko" data-akce="rozbor">Připravit rozbor a návrh nacenění</button> <span class="pozn">V ostrém provozu se spustí sám hned po přijetí poptávky.</span>';
    else {
      var r = p.rozbor;
      h += '<div class="rozbor">' + [["typ", "Co"], ["rozmery", "Rozměry"], ["material", "Materiál"], ["vnitrek", "Vybavení"]].map(function (x) {
        return '<label>' + x[1] + '<input data-r="' + x[0] + '" value="' + esc(r[x[0]]) + '"></label>';
      }).join("") + '<label>Ověřit při zaměření<textarea data-r="overit">' + esc(r.overit.join("\n")) + "</textarea></label></div>";
    }
    h += "</section>";

    // 3. Vizualizace
    h += '<section class="dkarta"><h2>3. Vizualizace <small>ilustrační obrázek, ne výkres</small></h2>';
    if (!p.vizualizace) h += p.rozbor ? '<button class="tlacitko" data-akce="vizu">Vytvořit 2 varianty z fotky zákazníka</button>' : '<p class="pozn">Nejdřív rozbor.</p>';
    else h += '<div class="vizu">' + ["A", "B"].map(function (v) {
      return "<figure>" + vizu(p, v) + '<figcaption><label><input type="checkbox" data-v="' + v + '"' + (p.vizualizace.indexOf(v) >= 0 ? " checked" : "") + "> Přiložit k nabídce</label> " + POPIS_VARIANT[v] + "</figcaption></figure>";
    }).join("") + '</div><p class="pozn">V ukázce jednoduchá kresba. V ostrém provozu obrázek z AI nad fotkou zákazníka; tlačítko „Jinak“ vytvoří další variantu podle vašeho pokynu.</p>';
    h += "</section>";

    // 4. Nacenění
    h += '<section class="dkarta"><h2>4. Nacenění <small>položky navrhne AI, ceny z vašeho ceníku</small></h2>' +
      '<p class="varovani">Ceník je vymyšlený jen pro ukázku – nejsou to ceny Stolařství DOFEK.</p>';
    if (!p.kalkulace) h += '<p class="pozn">Nejdřív rozbor.</p>';
    else {
      h += '<div class="tabulka"><table><thead><tr><th>Položka</th><th>Množství</th><th class="c">Od</th><th class="c">Do</th><th></th></tr></thead><tbody>' +
        p.kalkulace.map(function (r, i) {
          var cc = polozka(r.kod);
          return "<tr><td><select data-k=\"" + i + "\">" + C.map(function (x) { return '<option value="' + x.kod + '"' + (x.kod === r.kod ? " selected" : "") + ">" + esc(x.nazev) + "</option>"; }).join("") + "</select></td>" +
            '<td class="mn"><input type="number" step="0.1" min="0" data-m="' + i + '" value="' + r.mnozstvi + '"> ' + cc.jednotka + "</td>" +
            '<td class="c">' + kc(cc.od * r.mnozstvi) + '</td><td class="c">' + kc(cc.do * r.mnozstvi) + '</td><td><button class="x" data-x="' + i + '" aria-label="Odebrat položku">×</button></td></tr>';
        }).join("") + '</tbody><tfoot><tr><td colspan="2"><button class="tlacitko tlacitko-druhe maly" data-akce="pridat">+ položka</button></td><td class="c" colspan="2"><b>' + kc(c.od) + " – " + kc(c.do) + '</b></td><td></td></tr></tfoot></table></div><p class="pozn">Rozpětí zaokrouhlené na tisíce. Přesná cena až po zaměření.</p>';
    }
    h += "</section>";

    // 5. Předběžná nabídka
    h += '<section class="dkarta"><h2>5. Předběžná hrubá nabídka</h2>';
    if (!p.kalkulace || !p.rozbor) h += '<p class="pozn">Připraví se po rozboru a nacenění.</p>';
    else {
      h += '<label class="pole">Komu</label><input value="' + esc(z.email) + '" readonly>' +
        '<label class="pole">Předmět</label><input id="predmet" value="Stolařství DOFEK – předběžná nabídka: ' + esc(p.typ.join(", ").toLowerCase()) + '">' +
        '<label class="pole">Text e-mailu</label><textarea id="text-nabidky" rows="14">' + esc(text(p)) + "</textarea>" +
        '<p class="pozn">Přílohy: ' + (p.vizualizace ? p.vizualizace.map(function (v) { return "vizualizace " + v + ".jpg"; }).join(", ") : "žádné") + "</p>" +
        '<p class="dl"><button class="tlacitko tlacitko-druhe" data-akce="pretext">Přepsat text podle úprav výše</button> ' +
        (p.stav === "odeslano" ? '<span class="stav stav-odeslano">Odesláno ' + p.odeslano + "</span>" : '<button class="tlacitko" data-akce="odeslat">Odeslat předběžnou nabídku</button>') + "</p>";
    }
    h += "</section>";
    d.innerHTML = h;
    napoj(p);
    window.scrollTo(0, 0);
  }

  function text(p) {
    var c = cena(p), r = p.rozbor;
    return "Dobrý den,\n\nděkuji za poptávku. Podle fotek a Vaší zprávy posílám předběžnou hrubou nabídku.\n\n" +
      "Co navrhujeme: " + r.typ + "\nRozměry: " + r.rozmery + "\nMateriál: " + r.material + "\nVybavení: " + r.vnitrek + "\n\n" +
      "Orientační cena: " + kc(c.od) + " – " + kc(c.do) + " včetně dopravy a montáže.\n" +
      "Přesnou cenu řeknu po zaměření, kde ověříme:\n- " + r.overit.join("\n- ") + "\n\n" +
      (p.vizualizace && p.vizualizace.length ? "V příloze je ilustrační obrázek pro představu, nejde o výkres.\n\n" : "") +
      "Pokud Vám to cenově vyhovuje, domluvíme termín zaměření.\n\nS pozdravem\nVáclav Dofek\nStolařství DOFEK\ntel. 603 164 240";
  }

  function napoj(p) {
    var d = $("#detail");
    $(".zpet", d).onclick = function (e) { e.preventDefault(); location.hash = ""; };
    [].forEach.call(d.querySelectorAll("[data-r]"), function (el) {
      el.onchange = function () { p.rozbor[el.dataset.r] = el.dataset.r === "overit" ? el.value.split("\n").filter(Boolean) : el.value; };
    });
    [].forEach.call(d.querySelectorAll("[data-v]"), function (el) {
      el.onchange = function () { p.vizualizace = ["A", "B"].filter(function (v) { return $('[data-v="' + v + '"]', d).checked; }); detail(p.id); };
    });
    [].forEach.call(d.querySelectorAll("[data-k]"), function (el) { el.onchange = function () { p.kalkulace[+el.dataset.k].kod = el.value; detail(p.id); }; });
    [].forEach.call(d.querySelectorAll("[data-m]"), function (el) { el.onchange = function () { p.kalkulace[+el.dataset.m].mnozstvi = Math.max(0, parseFloat(el.value.replace(",", ".")) || 0); detail(p.id); }; });
    [].forEach.call(d.querySelectorAll("[data-x]"), function (el) { el.onclick = function () { p.kalkulace.splice(+el.dataset.x, 1); detail(p.id); }; });
    [].forEach.call(d.querySelectorAll("[data-akce]"), function (el) {
      el.onclick = function () {
        var a = el.dataset.akce;
        if (a === "rozbor") {
          el.disabled = true; el.textContent = "Připravuji rozbor…";
          setTimeout(function () { var ai = AI[p.id]; p.rozbor = JSON.parse(JSON.stringify(ai.rozbor)); p.kalkulace = JSON.parse(JSON.stringify(ai.kalkulace)); p.stav = "navrh"; detail(p.id); }, 900);
        } else if (a === "vizu") {
          el.disabled = true; el.textContent = "Vytvářím vizualizace…";
          setTimeout(function () { p.vizualizace = ["A", "B"]; detail(p.id); }, 900);
        } else if (a === "pridat") { p.kalkulace.push({ kod: "montaz", mnozstvi: 1 }); detail(p.id); }
        else if (a === "pretext") { $("#text-nabidky").value = text(p); }
        else if (a === "odeslat") {
          var dlg = $("#odeslat");
          $("#odeslat-komu").textContent = "Komu: " + p.zakaznik.email + " · cena " + kc(cena(p).od) + " – " + kc(cena(p).do) + " · přílohy: " + (p.vizualizace || []).length;
          dlg.onclose = function () { if (dlg.returnValue === "ano") { p.stav = "odeslano"; p.odeslano = ted(); detail(p.id); } };
          dlg.showModal();
        }
      };
    });
  }

  function trasa() { var id = location.hash.slice(1); if (id) detail(id); else { $("#detail").hidden = true; $("#seznam").hidden = false; seznam(); } }
  window.addEventListener("hashchange", trasa);
  trasa();
})();
