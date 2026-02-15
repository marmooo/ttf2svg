import { ttf2svg, ttf2svgFont } from "./mod.js";
import { assert } from "@std/assert";

const roboto = Deno.readFileSync("./test/Roboto-Regular.ttf");
const materialIcons = Deno.readFileSync("./test/material-icons.ttf");
const homeSvg = ttf2svg(materialIcons, { name: "home" });
const homeFont = ttf2svgFont(materialIcons, { name: "home" });

Deno.test("ttf2svg: text check", () => {
  const svg = ttf2svg(roboto, { text: "a" });
  assert(svg.length === 1);
  const svgs = ttf2svg(roboto);
  assert(svgs.length !== 1);
});
Deno.test("ttf2svg: code 10 check", () => {
  const svg = ttf2svg(materialIcons, { code: "59530" });
  assert(svg.length === 1);
  assert(svg[0] === homeSvg[0]);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});
Deno.test("ttf2svg: code 16 check", () => {
  const svg = ttf2svg(materialIcons, { code: "0xe88a" });
  assert(svg.length === 1);
  assert(svg[0] === homeSvg[0]);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});
Deno.test("ttf2svg: name check", () => {
  const svg = ttf2svg(materialIcons, { name: "home" });
  assert(svg.length === 1);
  assert(svg[0] === homeSvg[0]);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});
Deno.test("ttf2svg: ligature check", () => {
  const svg = ttf2svg(materialIcons, { ligature: "home" });
  assert(svg.length === 1);
  assert(svg[0] === homeSvg[0]);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});

Deno.test("ttf2svgFont: text check", () => {
  const glyph = ttf2svgFont(roboto, { text: "a" });
  const glyphCount = (glyph.match(/<glyph/g) || []).length;
  assert(glyphCount === 1);
  const glyphs = ttf2svgFont(roboto);
  const glyphsCount = (glyphs.match(/glyph/g) || []).length;
  assert(glyphsCount !== 1);
});
Deno.test("ttf2svgFont: code 10 check", () => {
  const glyph = ttf2svgFont(materialIcons, { code: "59530" });
  const glyphCount = (glyph.match(/<glyph/g) || []).length;
  assert(glyphCount === 1);
  assert(glyph === homeFont);
  const glyphs = ttf2svgFont(materialIcons);
  const glyphsCount = (glyphs.match(/glyph/g) || []).length;
  assert(glyphsCount !== 1);
});
Deno.test("ttf2svgFont: code 16 check", () => {
  const glyph = ttf2svgFont(materialIcons, { code: "0xe88a" });
  const glyphCount = (glyph.match(/<glyph/g) || []).length;
  assert(glyphCount === 1);
  assert(glyph === homeFont);
  const glyphs = ttf2svgFont(materialIcons);
  const glyphsCount = (glyphs.match(/glyph/g) || []).length;
  assert(glyphsCount !== 1);
});
Deno.test("ttf2svgFont: name check", () => {
  const glyph = ttf2svgFont(materialIcons, { name: "home" });
  const glyphCount = (glyph.match(/<glyph/g) || []).length;
  assert(glyphCount === 1);
  assert(glyph === homeFont);
  const glyphs = ttf2svgFont(materialIcons);
  const glyphsCount = (glyphs.match(/glyph/g) || []).length;
  assert(glyphsCount !== 1);
});
Deno.test("ttf2svgFont: ligature check", () => {
  const glyph = ttf2svgFont(materialIcons, { ligature: "home" });
  const glyphCount = (glyph.match(/<glyph/g) || []).length;
  assert(glyphCount === 1);
  assert(glyph === homeFont);
  const glyphs = ttf2svgFont(materialIcons);
  const glyphsCount = (glyphs.match(/glyph/g) || []).length;
  assert(glyphsCount !== 1);
});
