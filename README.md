# dofek-web — nový web Stolařství DOFEK (T26-08-1)

Statický web z **Eleventy**, stejný základ jako nový web Hory Bory (`tbdb-consulting/hb-web`):
hotové HTML předem, vlastní písmo Nunito (ne z Googlu), bez cookies a měření.
Kontext zakázky: `C:\Projekty TBDB\tbdb\Klienti\Dofek\KONTEXT.md`.

## Stav k 7. 11. 2026

- Veřejný repozitář `tbdb-consulting/dofek-web` (Pages jde na bezplatném plánu jen z veřejného).
  Testovací adresa **https://tbdb-consulting.github.io/dofek-web/** – zveřejněno se souhlasem Keksy
  7. 11. 2026, ještě bez souhlasu majitele s fotkami (doplnit). Nasazuje `.github/workflows/nasadit.yml`
  po každém push do `main` (kontrola tajných údajů, sestavení, ověření živého webu).
- Stránky: úvod, Reference, Poptávka (formulář z mobilu – zatím nic neodesílá), Kontakt, Ochrana údajů (návrh).
- Žlutě `[DOPLNIT …]` = údaj, který musí dodat stolař (montáž, materiály, zpracovatelé dat).
- Testovací verze má `noindex` a žlutý pruh nahoře. Ostrá verze: `OSTRY=1 npm run build`.

## Jak spustit

```
npm install
npm start          # náhled na http://localhost:8080
npm run build      # výsledek ve složce _site
```

## Kde co je

```
src/_data/firma.json   údaje o firmě (zdroje v poli _zdroje)
src/_data/fotky.json   katalog fotek: kategorie, hlavni (úvodní stránka) / ostatní = Reference
src/_data/web.js       verze, build, adresa podsložky (ZAKLAD_URL)
src/_includes/         kostra stránky
src/fotky/             zmenšené fotky (generuje nastroje/fotky.py)
nastroje/fotky.py      zdroj → src/fotky (1400 px + náhled 600 px)
nastroje/vyber_fotek.py  HTML formulář pro výběr fotek (Otázky zákazníka ve složce dat)
```

## Fotky

Zdroj: facebooková stránka Stolařství DOFEK a profil Václava Dofka, staženo 7. 11. 2026 do
`C:\Users\Dell\Můj disk\Claude AI\TBDB\Zákazníci\T26-08 Stolařství Dofek\Fotky\Facebook\vse\`.
Soukromé fotky z profilu vyřazené a smazané. Výběr udělal Keksa 7. 11. 2026 ve formuláři
`Otázky\261107_T26-08-1_vyber_fotek.html`: v `fotky.json` je `hlavni` + `poradi` (úvodní stránka,
27 fotek), `pouzit: false` = nepoužít (10 fotek dílny), ostatní jdou do Referencí (206).
Fotky jsou majitele stolařství – před zveřejněním potvrdit jeho souhlas.
