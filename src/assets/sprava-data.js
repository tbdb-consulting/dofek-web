// UKÁZKOVÁ DATA správy poptávek – vymyšlené poptávky, vymyšlené ceny.
// Ceník NENÍ ceník Stolařství DOFEK; skutečný se sestaví se stolařem z jeho posledních nabídek.
// Ve skutečném provozu: poptávky z databáze, rozbor a vizualizace z AI, ceník ze správy.
window.CENIK = {
  _pozor: "Vymyšlený ceník jen pro ukázku",
  polozky: [
    { kod: "korpus-lamino", nazev: "Korpus z lamina", jednotka: "bm", od: 9000, do: 11000 },
    { kod: "korpus-horni", nazev: "Horní skříňky (lamino)", jednotka: "bm", od: 5500, do: 7000 },
    { kod: "pracovni-deska", nazev: "Pracovní deska (lamino)", jednotka: "bm", od: 1800, do: 2600 },
    { kod: "dvirka-lamino", nazev: "Dvířka lamino", jednotka: "m²", od: 2200, do: 3000 },
    { kod: "dvirka-lak", nazev: "Dvířka lakovaná", jednotka: "m²", od: 5200, do: 6800 },
    { kod: "posuvne-dvere", nazev: "Posuvné dveře (rám + výplň)", jednotka: "m²", od: 3500, do: 4500 },
    { kod: "zrcadlo", nazev: "Příplatek za zrcadlovou výplň", jednotka: "ks", od: 2500, do: 3500 },
    { kod: "vnitrni-vybaveni", nazev: "Vnitřní vybavení (tyč, police, šuplíky)", jednotka: "sada", od: 4000, do: 7000 },
    { kod: "kovani-tiche", nazev: "Kování s tichým dovíráním", jednotka: "ks", od: 450, do: 700 },
    { kod: "led", nazev: "LED osvětlení pod skříňky", jednotka: "bm", od: 900, do: 1400 },
    { kod: "police-masiv", nazev: "Police z masivu", jednotka: "bm", od: 2400, do: 3400 },
    { kod: "montaz", nazev: "Doprava a montáž", jednotka: "×", od: 3500, do: 6000 }
  ]
};

window.POPTAVKY = [
  {
    id: "P-0003", prijato: "7. 11. 2026 18:42", stav: "nova",
    zakaznik: { jmeno: "Jana Ukázková", tel: "000 000 003", email: "jana@example.com", obec: "Brno-Líšeň" },
    typ: ["Kuchyně"], rozpocet: "60–120 000 Kč", termin: "do 3 měsíců",
    media: { fotky: 4, video: 0, hlas: "0:58" },
    prepis: "Dobrý den, chceme novou kuchyň do rohu, tak jak je to na fotkách. Jedna stěna má asi tři metry, druhá metr osmdesát. Líbí se nám bílá matná dvířka bez úchytek a dřevěná pracovní deska, třeba dub. Horní skříňky až ke stropu. Myčku a troubu máme vlastní.",
    rozbor: null, kalkulace: null, vizualizace: null
  },
  {
    id: "P-0002", prijato: "6. 11. 2026 9:15", stav: "navrh",
    zakaznik: { jmeno: "Petr Vzorový", tel: "000 000 002", email: "petr@example.com", obec: "Brno" },
    typ: ["Vestavěná skříň"], rozpocet: "60–120 000 Kč", termin: "do 3 měsíců",
    media: { fotky: 3, video: 0, hlas: "0:42" },
    prepis: "Chtěli bychom vestavěnou skříň do výklenku v předsíni, co je na fotkách. Je to zhruba dva metry čtyřicet na šířku a skoro až do stropu, strop je dva šedesát. Hloubka asi šedesát. Nejradši posuvné dveře, bílé, a jedny klidně se zrcadlem. Uvnitř tyč na kabáty a nějaké police, dole místo na boty.",
    rozbor: {
      typ: "Vestavěná skříň do výklenku, posuvné dveře",
      rozmery: "š. cca 2,40 m · v. 2,60 m · hl. cca 0,60 m (z hlasu, neměřeno)",
      material: "Bílé lamino, jedny dveře se zrcadlem",
      vnitrek: "Tyč na kabáty, police, dole botník",
      overit: ["Přesné rozměry a pravoúhlost výklenku", "Vypínač u výklenku vs. posuvné dveře", "Počet dveří (2 nebo 3)"]
    },
    kalkulace: [
      { kod: "korpus-lamino", mnozstvi: 2.4 }, { kod: "posuvne-dvere", mnozstvi: 6.24 },
      { kod: "zrcadlo", mnozstvi: 1 }, { kod: "vnitrni-vybaveni", mnozstvi: 1 }, { kod: "montaz", mnozstvi: 1 }
    ],
    vizualizace: ["A", "B"]
  },
  {
    id: "P-0001", prijato: "3. 11. 2026 20:03", stav: "odeslano",
    zakaznik: { jmeno: "Eva Smyšlená", tel: "000 000 001", email: "eva@example.com", obec: "Kuřim" },
    typ: ["Knihovny a police"], rozpocet: "do 30 000 Kč", termin: "nespěchá",
    media: { fotky: 2, video: 1, hlas: "" },
    prepis: "(psaná zpráva) Knihovna přes celou stěnu v obýváku, 3,2 m široká, do výšky 2,5 m, bílá s dubovými policemi.",
    rozbor: {
      typ: "Knihovna přes celou stěnu", rozmery: "š. 3,20 m · v. 2,50 m (ze zprávy)", material: "Bílé lamino, police dub",
      vnitrek: "Otevřené police", overit: ["Nosnost stěny pro kotvení", "Zásuvky a vypínače na stěně"]
    },
    kalkulace: [{ kod: "korpus-lamino", mnozstvi: 3.2 }, { kod: "police-masiv", mnozstvi: 6 }, { kod: "montaz", mnozstvi: 1 }],
    vizualizace: ["A"], odeslano: "4. 11. 2026 7:40"
  }
];
