// NÁVRH kanceláře – VYMYŠLENÁ DATA. Žádná čísla nejsou ze Stolařství DOFEK.
// Lidé, zakázky, ceny, mzdy i kilometry jsou smyšlené, aby bylo vidět, co modul ukáže.
window.K = {
  dnes: "Po 9. 11. 2026",
  lide: [
    { kod: "VD", jmeno: "Václav Dofek", role: "majitel, zaměření, montáž", sazbaHod: null },
    { kod: "PN", jmeno: "Pavel Novák (vymyšlený)", role: "stolař – dílna", sazbaHod: 260 },
    { kod: "JK", jmeno: "Jan Král (vymyšlený)", role: "stolař – dílna, montáže", sazbaHod: 240 }
  ],
  zakazky: [
    { id: "Z-2611", nazev: "Kuchyň – Líšeň", zakaznik: "Jana Ukázková", stav: "vyroba", cena: 128000, termin: "20. 11.", material: 41200, hodinyPlan: 70, hodiny: 46, km: 64 },
    { id: "Z-2610", nazev: "Skříň do podkroví – Žabovřesky", zakaznik: "Tomáš Testovací", stav: "zamereni", cena: 64000, termin: "4. 12.", material: 0, hodinyPlan: 32, hodiny: 2, km: 18 },
    { id: "Z-2609", nazev: "Vestavěná skříň – předsíň", zakaznik: "Petr Vzorový", stav: "montaz", cena: 61000, termin: "10. 11.", material: 18900, hodinyPlan: 30, hodiny: 33, km: 42 },
    { id: "Z-2608", nazev: "Knihovna – Kuřim", zakaznik: "Eva Smyšlená", stav: "hotovo", cena: 27000, termin: "3. 11.", material: 7400, hodinyPlan: 14, hodiny: 12, km: 56 },
    { id: "Z-2607", nazev: "Kancelář – recepce", zakaznik: "Firma Vzor s.r.o.", stav: "fakturace", cena: 185000, termin: "31. 10.", material: 62300, hodinyPlan: 95, hodiny: 108, km: 120 }
  ],
  kalendar: [
    { den: "Po 9. 11.", co: "Montáž", zakazka: "Z-2609", kdo: "VD, JK", cas: "7:30–15:00", misto: "Brno" },
    { den: "Út 10. 11.", co: "Zaměření", zakazka: "Z-2610", kdo: "VD", cas: "16:00", misto: "Brno-Žabovřesky" },
    { den: "St 11. 11.", co: "Výroba – korpusy", zakazka: "Z-2611", kdo: "PN, JK", cas: "celý den", misto: "dílna" },
    { den: "Čt 12. 11.", co: "Dovoz desek", zakazka: "sklad", kdo: "dodavatel", cas: "9:00", misto: "dílna" },
    { den: "Pá 13. 11.", co: "Zaměření (nová poptávka)", zakazka: "P-0005", kdo: "VD", cas: "8:00", misto: "Kuřim" }
  ],
  sklad: [
    { material: "Lamino bílá mat 18 mm", jednotka: "deska", stav: 6, min: 8, objednano: 12 },
    { material: "Lamino dub přírodní 18 mm", jednotka: "deska", stav: 9, min: 5, objednano: 0 },
    { material: "Pracovní deska dub 38 mm", jednotka: "ks 4,1 m", stav: 1, min: 2, objednano: 2 },
    { material: "ABS hrana bílá 2 mm", jednotka: "role", stav: 3, min: 2, objednano: 0 },
    { material: "Panty s tichým dovíráním", jednotka: "ks", stav: 38, min: 40, objednano: 60 },
    { material: "Výsuvy plnovýsuvné 500 mm", jednotka: "pár", stav: 14, min: 10, objednano: 0 }
  ],
  jizdy: [
    { datum: "2. 11.", auto: "Dodávka", zakazka: "Z-2608", trasa: "dílna – Kuřim – dílna", km: 56, ucel: "montáž" },
    { datum: "4. 11.", auto: "Osobní", zakazka: "Z-2611", trasa: "dílna – Líšeň – dílna", km: 22, ucel: "doměření" },
    { datum: "5. 11.", auto: "Dodávka", zakazka: "sklad", trasa: "dílna – velkoobchod – dílna", km: 34, ucel: "nákup materiálu" },
    { datum: "6. 11.", auto: "Osobní", zakazka: "Z-2610", trasa: "dílna – Žabovřesky – dílna", km: 18, ucel: "obhlídka" }
  ],
  dochazka: [
    { datum: "6. 11.", kdo: "PN", zakazka: "Z-2611", od: "7:00", do: "15:30", pauza: 30, poznamka: "korpusy" },
    { datum: "6. 11.", kdo: "JK", zakazka: "Z-2609", od: "7:00", do: "13:00", pauza: 30, poznamka: "dvířka, lepení hran" },
    { datum: "6. 11.", kdo: "JK", zakazka: "Z-2611", od: "13:00", do: "15:30", pauza: 0, poznamka: "" },
    { datum: "6. 11.", kdo: "VD", zakazka: "Z-2610", od: "16:00", do: "17:00", pauza: 0, poznamka: "obhlídka" }
  ],
  mzdy: [
    { kdo: "PN", hodiny: 164, prescas: 6, sazba: 260, priplatky: 0, nahrady: 0 },
    { kdo: "JK", hodiny: 158, prescas: 0, sazba: 240, priplatky: 0, nahrady: 0 }
  ],
  nahradaKm: null, // sazba za km podle vyhlášky – doplnit aktuální; v návrhu se počítá jen s km
  rezie: 0.18      // vymyšlená režie (energie, nájem dílny, stroje) jako podíl z ceny práce
};
