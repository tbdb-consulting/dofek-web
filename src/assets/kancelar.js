// NÁVRH kanceláře stolařství – moduly nad vymyšlenými daty (kancelar-data.js). Bez databáze.
(function () {
  var K = window.K, Z = window.ZAKLAD || "";
  var STAV = { poptavka: "Poptávka", zamereni: "Zaměření", vyroba: "Výroba", montaz: "Montáž", fakturace: "K fakturaci", hotovo: "Hotovo" };
  var PRUMER_SAZBA = 250; // vymyšlená průměrná hodinová cena práce pro výpočet nákladů zakázky
  function kc(n) { return Math.round(n).toLocaleString("cs-CZ").replace(/\s/g, " ") + " Kč"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function tab(hlava, radky) {
    return '<div class="k-tab"><table><thead><tr>' + hlava.map(function (h) { return "<th" + (h[1] ? ' class="c"' : "") + ">" + h[0] + "</th>"; }).join("") +
      "</tr></thead><tbody>" + radky.map(function (r) { return "<tr>" + r.map(function (b, i) { return "<td" + (hlava[i][1] ? ' class="c"' : "") + ">" + b + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
  }
  function info(text) { return '<p class="k-info">' + text + "</p>"; }
  function stitek(s) { return '<span class="k-stav k-' + s + '">' + STAV[s] + "</span>"; }
  function naklady(z) {
    var prace = z.hodiny * PRUMER_SAZBA, rezie = prace * K.rezie, celkem = z.material + prace + rezie;
    return { prace: prace, rezie: rezie, celkem: celkem, zisk: z.cena - celkem };
  }
  function hodinyZ(r) { var a = r.od.split(":"), b = r.do.split(":"); return ((+b[0] * 60 + +b[1]) - (+a[0] * 60 + +a[1]) - r.pauza) / 60; }

  var M = [
    { kod: "nastenka", nazev: "Nástěnka", fn: function () {
      var aktivni = K.zakazky.filter(function (z) { return z.stav !== "hotovo"; });
      var dosklad = K.sklad.filter(function (s) { return s.stav < s.min; });
      var prekroceni = K.zakazky.filter(function (z) { return z.hodiny > z.hodinyPlan; });
      return "<h1>Dobrý den, dnes je " + K.dnes + "</h1>" +
        '<div class="k-dlazdice">' +
        '<a href="' + Z + '/sprava/" class="k-dl"><b>2</b><span>nové poptávky</span></a>' +
        '<a href="#zakazky" class="k-dl"><b>' + aktivni.length + "</b><span>rozpracované zakázky</span></a>" +
        '<a href="#kalendar" class="k-dl"><b>' + K.kalendar.length + "</b><span>akce tento týden</span></a>" +
        '<a href="#sklad" class="k-dl k-pozor"><b>' + dosklad.length + "</b><span>materiály pod minimem</span></a></div>" +
        '<div class="k-2"><section class="k-karta"><h2>Tento týden</h2>' + tab([["Den"], ["Co"], ["Zakázka"], ["Kdo"]], K.kalendar.map(function (k) { return [k.den, k.co, k.zakazka, k.kdo]; })) + "</section>" +
        '<section class="k-karta"><h2>Hlídá za vás</h2><ul class="k-hlida">' +
        dosklad.map(function (s) { return "<li>⚠️ Dochází <b>" + esc(s.material) + "</b> – " + s.stav + " " + s.jednotka + ", minimum " + s.min + (s.objednano ? " (objednáno " + s.objednano + ")" : " – <b>neobjednáno</b>") + "</li>"; }).join("") +
        prekroceni.map(function (z) { return "<li>⏱️ <b>" + z.id + " " + esc(z.nazev) + "</b> – odpracováno " + z.hodiny + " h z plánovaných " + z.hodinyPlan + " h</li>"; }).join("") +
        "<li>🧾 <b>Z-2607</b> je hotová – vystavit fakturu</li></ul></section></div>";
    } },
    { kod: "poptavky", nazev: "Poptávky", pocet: 2, odkaz: "/sprava/" },
    { kod: "zakazky", nazev: "Zakázky", fn: function () {
      return "<h1>Zakázky</h1>" + info("Každá zakázka od poptávky po fakturu na jednom místě: stav, termín, cena z nabídky a co zatím stála. Náklady se skládají samy z materiálu, docházky a jízd.") +
        tab([["Číslo"], ["Zakázka"], ["Stav"], ["Termín"], ["Cena", 1], ["Náklady zatím", 1], ["Zbývá", 1], ["Hodiny", 1]], K.zakazky.map(function (z) {
          var n = naklady(z);
          return [z.id, esc(z.nazev) + '<br><small>' + esc(z.zakaznik) + "</small>", stitek(z.stav), z.termin, kc(z.cena), kc(n.celkem), '<b class="' + (n.zisk < 0 ? "k-minus" : "") + '">' + kc(n.zisk) + "</b>", z.hodiny + " / " + z.hodinyPlan + " h"];
        }));
    } },
    { kod: "kalendar", nazev: "Kalendář", fn: function () {
      return "<h1>Kalendář</h1>" + info("Zaměření, výroba, montáže a dovozy materiálu. Kdo kde je a s jakým autem. Ze zaměření se rovnou zapisují rozměry k poptávce.") +
        tab([["Den"], ["Čas"], ["Co"], ["Zakázka"], ["Kdo"], ["Kde"]], K.kalendar.map(function (k) { return [k.den, k.cas, k.co, k.zakazka, k.kdo, k.misto]; }));
    } },
    { kod: "sklad", nazev: "Materiál a sklad", fn: function () {
      return "<h1>Materiál a sklad</h1>" + info("Desky, hrany a kování. Při výrobě se odepisují na zakázku, pod minimem se nabídne objednávka u dodavatele. Spotřeba na zakázku jde do nákladů.") +
        tab([["Materiál"], ["Na skladě", 1], ["Minimum", 1], ["Objednáno", 1], ["Stav"]], K.sklad.map(function (s) {
          return [esc(s.material), s.stav + " " + s.jednotka, s.min, s.objednano || "–", s.stav < s.min ? (s.objednano ? '<span class="k-stav k-vyroba">objednáno</span>' : '<span class="k-stav k-pozorstav">objednat</span>') : '<span class="k-stav k-hotovo">v pořádku</span>'];
        }));
    } },
    { kod: "naklady", nazev: "Náklady zakázek", fn: function () {
      var r = K.zakazky.map(function (z) { var n = naklady(z); return [z.id, esc(z.nazev), kc(z.material), kc(n.prace), kc(n.rezie), z.km + " km", kc(n.celkem), '<b class="' + (n.zisk < 0 ? "k-minus" : "") + '">' + kc(n.zisk) + "</b>"]; });
      return "<h1>Náklady zakázek</h1>" + info("Vydělala zakázka? Materiál ze skladu, práce z docházky (hodiny × sazba), režie dílny a ujeté kilometry. Hned je vidět, kde se plán rozešel se skutečností – a příště se podle toho lépe nacení.") +
        tab([["Číslo"], ["Zakázka"], ["Materiál", 1], ["Práce", 1], ["Režie", 1], ["Jízdy", 1], ["Celkem", 1], ["Zůstane", 1]], r) +
        '<p class="k-pozn">Práce = hodiny × ' + PRUMER_SAZBA + " Kč, režie " + Math.round(K.rezie * 100) + " % z práce – obojí vymyšlené. Jízdy zatím jen v km: sazbu za km doplnit podle platné vyhlášky.</p>";
    } },
    { kod: "jizdy", nazev: "Cesty a auta", fn: function () {
      var soucet = K.jizdy.reduce(function (a, j) { return a + j.km; }, 0);
      return "<h1>Cesty a auta</h1>" + info("Kniha jízd: kam, proč, k jaké zakázce. Z telefonu jedním klepnutím, km se dopočítají z trasy. Jízdy se přičtou k nákladům zakázky a slouží jako podklad pro účetní.") +
        tab([["Datum"], ["Auto"], ["Zakázka"], ["Trasa"], ["Účel"], ["km", 1]], K.jizdy.map(function (j) { return [j.datum, j.auto, j.zakazka, esc(j.trasa), j.ucel, j.km]; })) +
        '<p class="k-pozn">Celkem ' + soucet + " km. Náhrady za km a daňová pravidla ověří účetní – TBDB není účetní.</p>";
    } },
    { kod: "cas", nazev: "Docházka a čas", fn: function () {
      return "<h1>Docházka a čas</h1>" + info("Každý v telefonu: začínám – končím – na které zakázce. Kancelář vidí, kdo na čem dělá, a hodiny jdou do nákladů zakázky i do mezd.") +
        tab([["Datum"], ["Kdo"], ["Zakázka"], ["Od"], ["Do"], ["Hodin", 1], ["Poznámka"]], K.dochazka.map(function (r) { return [r.datum, r.kdo, r.zakazka, r.od, r.do, String(hodinyZ(r).toFixed(1)).replace(".", ","), esc(r.poznamka)]; }));
    } },
    { kod: "mzdy", nazev: "Mzdy – podklady", fn: function () {
      return "<h1>Mzdy – podklady pro účetní</h1>" + info("Na konci měsíce se z docházky sestaví podklad: hodiny, přesčasy, náhrady. Odejde účetní jedním tlačítkem. Samotné mzdy, odvody a daně počítá účetní – TBDB není účetní.") +
        tab([["Kdo"], ["Hodiny", 1], ["Přesčas", 1], ["Sazba", 1], ["Hrubý základ", 1]], K.mzdy.map(function (m) {
          var l = K.lide.filter(function (x) { return x.kod === m.kdo; })[0];
          return [esc(l.jmeno), m.hodiny + " h", m.prescas + " h", kc(m.sazba) + "/h", kc(m.hodiny * m.sazba)];
        })) + '<p class="k-pozn">Říjen 2026, vymyšlená čísla. Příplatky za přesčas podle smluv a zákoníku práce doplní účetní.</p>';
    } },
    { kod: "nastaveni", nazev: "Nastavení", fn: function () {
      return "<h1>Nastavení</h1>" + info("Ceník pro nacenění poptávek, dekory pro vizualizace, lidé a sazby, auta, dodavatelé a minimum na skladě.") +
        '<ul class="k-hlida"><li>📋 Ceník – položky a ceny od–do (zatím vymyšlený, sestaví se se stolařem)</li><li>🎨 Dekory a vzorové realizace pro vizualizace</li><li>👷 Lidé, role a hodinové sazby</li><li>🚐 Auta a sazba za km</li><li>🏭 Dodavatelé materiálu</li></ul>';
    } }
  ];

  function menu(akt) {
    document.getElementById("k-menu").innerHTML = M.map(function (m) {
      var h = m.odkaz ? Z + m.odkaz : "#" + m.kod;
      return '<a href="' + h + '"' + (m.kod === akt ? ' aria-current="page"' : "") + ">" + m.nazev + (m.pocet ? ' <span class="k-pocet">' + m.pocet + "</span>" : "") + "</a>";
    }).join("");
  }
  function ukaz() {
    var kod = location.hash.slice(1) || "nastenka", m = M.filter(function (x) { return x.kod === kod && x.fn; })[0] || M[0];
    menu(m.kod); document.getElementById("k-obsah").innerHTML = m.fn(); window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", ukaz); ukaz();
})();
