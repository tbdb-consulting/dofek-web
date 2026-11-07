// Eleventy – web Stolařství DOFEK (T26-08-1).
// Stejný základ jako nový web Hory Bory (hb-web): hotové HTML předem, žádná databáze pro texty.
// Texty a údaje o firmě jsou v src/_data/firma.json, fotky v src/_data/fotky.json.

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets", "src/fotky": "fotky" });

  // Čísla a jednotky se nelámou na konci řádku (603 164 240, 7:00–17:00).
  eleventyConfig.addFilter("nezalom", (s) =>
    s == null ? s : String(s).replace(/(\d) (?=\d)/g, "$1 ").replace(/ (Kč|km|m)\b/g, " $1"));

  // Fotky jedné kategorie / jen hlavní / jen reference.
  eleventyConfig.addFilter("vKategorii", (fotky, kod) => fotky.filter((f) => f.kategorie === kod));
  // Hlavní fotky: novější a ostřejší z profilu majitele napřed, starší ze stránky stolařství za nimi.
  eleventyConfig.addFilter("hlavni", (fotky) =>
    fotky.filter((f) => f.hlavni).sort((a, b) => (a.odkud === b.odkud ? 0 : a.odkud === "profil" ? -1 : 1)));
  eleventyConfig.addFilter("reference", (fotky) => fotky.filter((f) => !f.hlavni && f.kategorie !== "dilna"));
  eleventyConfig.addFilter("najdi", (fotky, id) => fotky.find((f) => f.id === id));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
