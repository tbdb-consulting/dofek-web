// Nastavení webu. ZAKLAD_URL = podsložka na testovací adrese GitHub Pages (např. /dofek-web),
// na vlastní doméně prázdné. Verze a build jako u hb-web: verze z package.json, build = počet commitů.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

function git(prikaz, nahrada) {
  try { return execSync(prikaz, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); }
  catch { return nahrada; }
}

const balik = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url)));
const ted = new Date();

export default {
  zaklad: process.env.ZAKLAD_URL || "",
  verze: "v" + balik.version,
  build: git("git rev-list --count HEAD", "0"),
  commit: git("git rev-parse --short HEAD", "-"),
  sestaveno: `${ted.getDate()}. ${ted.getMonth() + 1}. ${ted.getFullYear()}`,
  // Dokud web není zveřejněný na doméně stolařství, vyhledávače ho nemají indexovat.
  testovaci: process.env.OSTRY !== "1",
};
