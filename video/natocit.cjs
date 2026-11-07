// Natočí scény instruktážního videa (Playwright) podle délky namluveného komentáře.
// Spuštění (běžící náhled webu na ZAKLAD):  node video/natocit.cjs http://localhost:8794
// Výstup: video/zaznam/<scéna>.webm + video/zaznam/casy.json (kdy začíná který komentář).
const path = require("path"), fs = require("fs");
const { chromium } = require(process.env.PLAYWRIGHT || "C:/Projekty TBDB/vixen/node_modules/playwright");
const ZAKLAD = process.argv[2] || "http://localhost:8794";
const DIR = __dirname, OUT = path.join(DIR, "zaznam");
const D = JSON.parse(fs.readFileSync(path.join(DIR, "wav", "delky.json"), "utf8"));
fs.mkdirSync(OUT, { recursive: true });

const KURZOR = `addEventListener('DOMContentLoaded',()=>{const c=document.createElement('div');c.id='__k';
c.style.cssText='position:fixed;z-index:2147483647;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:rgba(255,190,60,.55);border:2px solid #7a4a24;pointer-events:none;left:-50px;top:-50px;transition:transform .12s';
document.body.appendChild(c);addEventListener('mousemove',e=>{c.style.left=e.clientX+'px';c.style.top=e.clientY+'px'},true);
addEventListener('mousedown',()=>c.style.transform='scale(.6)',true);addEventListener('mouseup',()=>c.style.transform='',true);});`;

const FOTO = (v) => `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="620" viewBox="0 0 320 220"><rect width="320" height="220" fill="#d9d2c7"/><polygon points="0,0 200,0 0,120" fill="#efe9df"/><polygon points="0,120 200,0 320,0 320,190 0,190" fill="#ece5da"/><rect y="190" width="320" height="30" fill="#b89b78"/><line x1="0" y1="120" x2="200" y2="0" stroke="#c9bfb1" stroke-width="2"/><rect x="${v ? 200 : 236}" y="40" width="58" height="80" fill="#cfe3ef" stroke="#fff" stroke-width="5"/></svg>`;

async function scena(browser, jmeno, viewport, kroky) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, recordVideo: { dir: OUT, size: viewport }, hasTouch: viewport.width < 500 });
  await ctx.addInitScript(KURZOR);
  const page = await ctx.newPage(); const t0 = Date.now(); const casy = {};
  page.klik = async (sel) => {
    const l = page.locator(sel).first(); await l.scrollIntoViewIfNeeded(); await page.waitForTimeout(250);
    const b = await l.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 18 });
    await page.waitForTimeout(250); await page.mouse.down(); await page.mouse.up();
  };
  page.posun = async (sel) => { await page.evaluate((s) => { const e = document.querySelector(s); window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - 70, behavior: "smooth" }); }, sel); await page.waitForTimeout(700); };
  for (const [klic, akce] of kroky) {
    const st = Date.now(); casy[klic] = (st - t0) / 1000;
    await akce(page);
    const zbyva = (D[klic] + 0.7) * 1000 - (Date.now() - st);
    if (zbyva > 0) await page.waitForTimeout(zbyva);
  }
  await page.waitForTimeout(600);
  const video = page.video(); await ctx.close();
  const cil = path.join(OUT, jmeno + ".webm"); fs.renameSync(await video.path(), cil);
  console.log(jmeno, Object.keys(casy).length, "kroků");
  return casy;
}

(async () => {
  const browser = await chromium.launch();
  // obrázky „fotek od zákazníka“ pro nahrání do formuláře
  const p0 = await browser.newPage({ viewport: { width: 900, height: 620 } });
  for (const v of [0, 1]) { await p0.setContent(`<body style="margin:0">${FOTO(v)}</body>`); await p0.screenshot({ path: path.join(OUT, `foto${v + 1}.png`) }); }
  await p0.close();
  const casy = {};

  casy.zakaznik = await scena(browser, "zakaznik", { width: 390, height: 780 }, [
    ["z_00", async (p) => { await p.goto(ZAKLAD + "/"); await p.waitForTimeout(1500); await p.mouse.wheel(0, 500); }],
    ["z_01", async (p) => { await p.mouse.wheel(0, -500); await p.waitForTimeout(600); await p.klik('.hero a.tlacitko[href$="/poptavka/"]'); await p.waitForLoadState(); }],
    ["z_02", async (p) => { await p.waitForTimeout(600); await p.klik('#typ button:has-text("Vestavěné skříně")'); }],
    ["z_03", async (p) => { await p.posun(".velke"); await p.klik(".velke label:first-child"); await p.setInputFiles("#foto", [path.join(OUT, "foto1.png"), path.join(OUT, "foto2.png")]); await p.waitForTimeout(500); }],
    ["z_04", async (p) => { await p.posun(".hlas"); await p.waitForTimeout(1500); await p.klik("#text"); await p.keyboard.type("Vestavěná skříň pod šikminu v podkroví, asi 3,3 m, bílá matná, dole šuplíky.", { delay: 35 }); }],
    ["z_05", async (p) => { await p.posun("#jmeno"); await p.klik("#jmeno"); await p.keyboard.type("Tomáš Testovací", { delay: 40 }); await p.klik("#tel"); await p.keyboard.type("000 000 004", { delay: 40 }); await p.klik("#souhlas"); await p.klik('button[type="submit"]'); }],
    ["z_06", async (p) => { await p.waitForTimeout(400); }],
  ]);

  casy.stolar = await scena(browser, "stolar", { width: 1280, height: 720 }, [
    ["v_00", async (p) => { await p.goto(ZAKLAD + "/sprava/"); await p.waitForTimeout(1200); await p.mouse.move(400, 300, { steps: 10 }); }],
    ["v_01", async (p) => { await p.klik('a[href="#P-0004"]'); await p.waitForTimeout(1500); await p.mouse.wheel(0, 250); }],
    ["v_02", async (p) => { await p.klik('[data-akce="rozbor"]'); await p.waitForTimeout(1300); await p.posun(".rozbor"); }],
    ["v_03", async (p) => { await p.klik('[data-akce="vizu"]'); await p.waitForTimeout(1300); await p.posun(".vizu-pred"); await p.waitForTimeout(3500); await p.posun(".vizu:not(.vizu-pred)"); }],
    ["v_04", async (p) => { await p.posun(".tabulka"); await p.waitForTimeout(1200); await p.klik('[data-m="0"]'); await p.keyboard.press("Control+A"); await p.keyboard.type("3", { delay: 80 }); await p.keyboard.press("Tab"); await p.waitForTimeout(300); await p.posun(".tabulka"); }],
    ["v_05", async (p) => { await p.posun("#predmet"); await p.waitForTimeout(800); await p.mouse.wheel(0, 200); }],
    ["v_06", async (p) => { await p.klik('[data-akce="odeslat"]'); await p.waitForTimeout(1500); await p.klik('#odeslat button[value="ano"]'); await p.waitForTimeout(900); await p.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })); }],
  ]);

  casy.kancelar = await scena(browser, "kancelar", { width: 1280, height: 720 }, [
    ["k_00", async (p) => { await p.goto(ZAKLAD + "/kancelar/"); await p.waitForTimeout(800); await p.mouse.move(700, 300, { steps: 10 }); }],
    ...["zakazky", "kalendar", "sklad", "naklady", "jizdy", "cas", "mzdy"].map((m, i) => ["k_0" + (i + 1), async (p) => { await p.klik(`.k-menu a[href="#${m}"]`); }]),
  ]);

  fs.writeFileSync(path.join(OUT, "casy.json"), JSON.stringify(casy, null, 1));
  await browser.close();
})();
