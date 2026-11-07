"""Připraví fotky pro web Stolařství DOFEK.

Zdroj: fotky stažené z facebookové stránky Stolařství DOFEK a z profilu Václava Dofka
(7. 11. 2026), složka dat zákazníka. Soukromé fotky z profilu jsou vyřazené a smazané.

Co dělá:
  1. podle katalogu (src/_data/fotky.json) vezme každou fotku ze zdrojové složky,
  2. uloží zmenšeninu pro web (delší strana 1400 px) a náhled (delší strana 600 px)
     do src/fotky/ jako JPEG,
  3. doplní do katalogu rozměry.

Spuštění:  py -I nastroje/fotky.py "<zdrojová složka>"
"""
import json, os, sys
from PIL import Image, ImageOps

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KATALOG = os.path.join(KOREN, "src", "_data", "fotky.json")
CIL = os.path.join(KOREN, "src", "fotky")


def uloz(im, cesta, delka, kvalita):
    k = im.copy()
    k.thumbnail((delka, delka), Image.LANCZOS)
    k.save(cesta, "JPEG", quality=kvalita, optimize=True, progressive=True)
    return k.size


def main(zdroj):
    os.makedirs(CIL, exist_ok=True)
    kat = json.load(open(KATALOG, encoding="utf-8"))
    for f in kat["fotky"]:
        im = ImageOps.exif_transpose(Image.open(os.path.join(zdroj, f["zdroj"]))).convert("RGB")
        f["w"], f["h"] = uloz(im, os.path.join(CIL, f["id"] + ".jpg"), 1400, 82)
        uloz(im, os.path.join(CIL, f["id"] + "-n.jpg"), 600, 78)
    json.dump(kat, open(KATALOG, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("hotovo:", len(kat["fotky"]), "fotek")


if __name__ == "__main__":
    main(sys.argv[1])
