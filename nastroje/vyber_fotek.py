"""Vygeneruje HTML formulář pro výběr fotek na web (podle skillu otazky-html).

U každé fotky: zaškrtávátko „Použít na webu“, zaškrtávátko „Na hlavní stránku“ a poznámka.
Předvyplněno podle katalogu src/_data/fotky.json (hlavni = návrh Claude).
Náhledy se uloží vedle formuláře do složky <název>_nahledy, aby formulář fungoval
dvojklikem i na jiném počítači se stejnou složkou na Disku.

Spuštění:  py -I nastroje/vyber_fotek.py "<cílový .html>"
"""
import html, json, os, sys
from PIL import Image

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
kat = json.load(open(os.path.join(KOREN, "src", "_data", "fotky.json"), encoding="utf-8"))
cil = sys.argv[1]
slozka = os.path.splitext(os.path.basename(cil))[0] + "_nahledy"
os.makedirs(os.path.join(os.path.dirname(cil), slozka), exist_ok=True)

nazvy = {k["kod"]: k["nazev"] for k in kat["kategorie"]}
casti = []
for k in kat["kategorie"]:
    fs = [f for f in kat["fotky"] if f["kategorie"] == k["kod"]]
    if not fs:
        continue
    karty = []
    for f in fs:
        im = Image.open(os.path.join(KOREN, "src", "fotky", f["id"] + "-n.jpg"))
        im.thumbnail((360, 360))
        im.save(os.path.join(os.path.dirname(cil), slozka, f["id"] + ".jpg"), quality=72)
        pouzit = "checked" if f.get("pouzit", k["kod"] != "dilna") else ""
        hlavni = "checked" if f["hlavni"] else ""
        odkud = "stránka" if f["odkud"] == "stranka" else "profil V. D."
        karty.append(
            f'<div class="item" data-id="{f["id"]}"><a href="{slozka}/{f["id"]}.jpg" target="_blank">'
            f'<img loading="lazy" src="{slozka}/{f["id"]}.jpg" alt="{f["id"]}"></a>'
            f'<div class="id">{f["id"]} <span>{odkud}</span>{" <b class=rec>DOPORUČUJI</b>" if f["hlavni"] else ""}</div>'
            f'<label><input type="checkbox" class="pouzit" {pouzit}> Použít na webu</label>'
            f'<label><input type="checkbox" class="hlavni" {hlavni}> Na hlavní stránku</label>'
            f'<input class="p" placeholder="Poznámka"></div>')
    casti.append(f'<h2>{html.escape(k["nazev"])} <small>{len(fs)} fotek</small></h2><div class="mrizka">{"".join(karty)}</div>')

stranka = """<!DOCTYPE html>
<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>T26-08-1 Stolařství Dofek – výběr fotek na web</title>
<style>
:root{--tbdb:#1F4E78;--tbdb-l:#2E6DA4;--bg:#f4f7fa;--line:#d5dfe8;--mut:#5a6b7a;--grn:#1c6f53}
*{box-sizing:border-box}body{margin:0;padding:0 0 110px;background:var(--bg);color:#1a1a1a;font:14px/1.5 Verdana,Geneva,sans-serif}
.wrap{max-width:1200px;margin:0 auto;padding:0 16px}
header{background:var(--tbdb);color:#fff;padding:20px 0;margin-bottom:18px}h1{margin:0;font-size:20px}header p{margin:6px 0 0;font-size:13px;opacity:.85}
.path{background:#eaf1f7;border:1px solid var(--line);border-left:4px solid var(--tbdb);border-radius:5px;padding:12px 14px;margin-bottom:12px;font-size:12.5px;color:#26445f}
.path code{display:block;margin-top:4px;word-break:break-all}
h2{font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:var(--tbdb-l);margin:26px 0 8px;border-bottom:1px solid var(--line);padding-bottom:5px}h2 small{text-transform:none;color:var(--mut);letter-spacing:0;font-weight:normal}
.mrizka{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}
.item{background:#fff;border:1px solid var(--line);border-radius:6px;padding:8px}
.item.hl{border:2px solid var(--grn)}.item.ne{opacity:.45}
.item img{width:100%;height:150px;object-fit:cover;border-radius:4px;display:block}
.id{font-weight:bold;font-size:12.5px;margin:6px 0 2px}.id span{font-weight:normal;color:var(--mut)}
.rec{display:inline-block;font-size:9.5px;padding:0 6px;border-radius:8px;background:#e8f4ee;color:var(--grn);border:1px solid #a9d2bf}
label{display:flex;gap:6px;align-items:center;font-size:12.5px;cursor:pointer;margin:2px 0}input[type=checkbox]{width:16px;height:16px;accent-color:var(--tbdb)}
input.p,textarea{width:100%;margin-top:4px;border:1px solid var(--line);border-radius:4px;padding:5px 7px;font:12px Verdana,Geneva,sans-serif}
textarea{min-height:70px}.final{background:#fff;border:1px solid var(--tbdb);border-radius:6px;padding:14px;margin-top:22px}
.bar{position:fixed;left:0;right:0;bottom:0;background:#fff;border-top:1px solid var(--line);padding:12px 16px;display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap}
button{background:var(--tbdb);color:#fff;border:0;border-radius:5px;padding:11px 24px;font:bold 14px Verdana,Geneva,sans-serif;cursor:pointer}
#out,#stav{color:var(--mut);font-size:12.5px;white-space:pre-wrap;max-width:600px}
</style></head><body>
<header><div class="wrap"><h1>T26-08-1 Stolařství Dofek – které fotky dát na web</h1>
<p>7. 11. 2026 · nejlepší na hlavní stránky, ostatní do Referencí · klepnutím na fotku ji otevřete ve velkém</p></div></header>
<div class="wrap">
<div class="path">Tento soubor:<code>__CESTA__</code>
Fotky v plné velikosti:<code>C:\\Users\\Dell\\Můj disk\\Claude AI\\TBDB\\Zákazníci\\Stolařství Dofek\\Fotky\\Facebook\\vse\\</code>
Zdroj: facebooková stránka Stolařství DOFEK (starší realizace, malé rozlišení) a profil Václava Dofka (novější realizace, ostřejší). Soukromé fotky z profilu jsem vyřadil a smazal.<br>
<b>Předvyplněno:</b> zelený rámeček a štítek DOPORUČUJI = můj návrh na hlavní stránku. „Použít na webu“ bez „Na hlavní stránku“ = sekce Reference. Fotky dílny jsou předvyplněné jako nepoužité.
<div id="stav"></div></div>
__CASTI__
<div class="final"><b>Cokoli dalšího</b><textarea id="dalsi" placeholder="Např. kterou fotku dát úplně nahoru, co na fotkách vadí…"></textarea></div>
<div class="final" id="vystupbox" style="display:none"><b>Váš výběr</b> <span style="color:#5a6b7a;font-size:12.5px">(když se nezkopíroval sám: klikněte do pole, Ctrl+A, Ctrl+C)</span>
<textarea id="vystup" readonly style="min-height:160px"></textarea></div>
</div>
<div class="bar"><button onclick="kopiruj()">Zkopírovat výběr</button><span id="out"></span></div>
<script>
var items=[].slice.call(document.querySelectorAll('.item'));
function obarvi(){var h=0,u=0;items.forEach(function(it){var p=it.querySelector('.pouzit').checked,hl=it.querySelector('.hlavni').checked;
 if(hl&&!p){it.querySelector('.pouzit').checked=p=true;}
 it.classList.toggle('hl',hl);it.classList.toggle('ne',!p);if(p)u++;if(hl)h++;});
 document.getElementById('stav').textContent='Teď: '+h+' na hlavní stránku, '+(u-h)+' do Referencí, '+(items.length-u)+' nepoužito.';}
items.forEach(function(it){it.querySelector('.hlavni').onchange=obarvi;it.querySelector('.pouzit').onchange=function(){if(!this.checked)it.querySelector('.hlavni').checked=false;obarvi();};});
obarvi();
function sestav(){var H=[],R=[],N=[],P=[];
 items.forEach(function(it){var id=it.dataset.id,p=it.querySelector('.pouzit').checked,hl=it.querySelector('.hlavni').checked,po=it.querySelector('.p').value.trim();
  if(hl)H.push(id);else if(p)R.push(id);else N.push(id);if(po)P.push(id+(p?'':' (NEVYBRÁNO)')+': '+po);});
 var t=['T26-08-1 Stolařství Dofek – výběr fotek:','Hlavní stránka ('+H.length+'): '+H.join(', '),'Reference ('+R.length+'): '+R.join(', '),'Nepoužít ('+N.length+'): '+N.join(', ')];
 if(P.length){t.push('','Poznámky:');t=t.concat(P);}
 var d=document.getElementById('dalsi').value.trim();if(d)t.push('','Cokoli dalšího: '+d);
 return {t:t.join('\\n'),n:H.length+R.length};}
function zprava(ok,n){document.getElementById('out').textContent=ok?'Zkopírováno ('+n+' fotek na web) – vložte do chatu přes Ctrl+V.':'Automaticky zkopírovat nešlo – výběr je označený v poli nad tlačítkem, stiskněte Ctrl+C.';}
function kopiruj(){var s=sestav();var box=document.getElementById('vystupbox'),o=document.getElementById('vystup');
 box.style.display='block';o.value=s.t;o.focus();o.select();var ok=false;try{ok=document.execCommand('copy');}catch(e){}
 if(!ok&&navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(s.t).then(function(){zprava(true,s.n)},function(){zprava(false,s.n)});}else{zprava(ok,s.n);}
 box.scrollIntoView({block:'center'});}
</script></body></html>"""
stranka = stranka.replace("__CESTA__", html.escape(os.path.abspath(cil).replace("/", "\\"))).replace("__CASTI__", "".join(casti))
open(cil, "w", encoding="utf-8").write(stranka)
print("hotovo", cil)
