import { ttf2svg, ttf2svgFont } from "./mod.js";
import { assert } from "@std/assert";

const roboto = Deno.readFileSync("./test/Roboto-Regular.ttf");
const materialIcons = Deno.readFileSync("./test/material-icons.ttf");
const homeSvg = ttf2svg(materialIcons, { name: "home" });
const homeFont = ttf2svgFont(materialIcons, { name: "home" });

Deno.test("text check", () => {
  const svg = ttf2svg(roboto, { text: "a" });
  assert(svg.length === 1);
  const svgs = ttf2svg(roboto);
  assert(svgs.length !== 1);
});
Deno.test("code 10 check", () => {
  const svg = ttf2svg(materialIcons, { code: "59530" });
  assert(svg.length === 1);
  assert(svg[0] === homeSvg[0]);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});
Deno.test("code 16 check", () => {
  const svg = ttf2svg(materialIcons, { code: "0xe88a" });
  assert(svg.length === 1);
  assert(svg[0] === homeSvg[0]);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});
Deno.test("name check", () => {
  const svg = ttf2svg(materialIcons, { name: "home" });
  assert(svg.length === 1);
  assert(svg[0] === homeSvg[0]);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});
Deno.test("ligature check", () => {
  const svg = ttf2svg(materialIcons, { ligature: "home" });
  assert(svg.length === 1);
  assert(svg[0] === homeSvg[0]);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});

Deno.test("text check", () => {
  const svg = ttf2svgFont(roboto, { text: "a" });
  const svgCount = (svg.match(/<glyph/g) || []).length;
  assert(svgCount === 1);
  const svgs = ttf2svgFont(roboto);
  const svgsCount = (svgs.match(/glyph/g) || []).length;
  assert(svgsCount !== 1);
});
Deno.test("code 10 check", () => {
  const svg = ttf2svgFont(materialIcons, { code: "59530" });
  const svgCount = (svg.match(/<glyph/g) || []).length;
  assert(svgCount === 1);
  assert(svg === homeFont);
  const svgs = ttf2svgFont(materialIcons);
  const svgsCount = (svgs.match(/glyph/g) || []).length;
  assert(svgsCount !== 1);
});
Deno.test("code 16 check", () => {
  const svg = ttf2svgFont(materialIcons, { code: "0xe88a" });
  const svgCount = (svg.match(/<glyph/g) || []).length;
  assert(svgCount === 1);
  assert(svg === homeFont);
  const svgs = ttf2svgFont(materialIcons);
  const svgsCount = (svgs.match(/glyph/g) || []).length;
  assert(svgsCount !== 1);
});
Deno.test("name check", () => {
  const svg = ttf2svgFont(materialIcons, { name: "home" });
  const svgCount = (svg.match(/<glyph/g) || []).length;
  assert(svgCount === 1);
  assert(svg === homeFont);
  const svgs = ttf2svgFont(materialIcons);
  const svgsCount = (svgs.match(/glyph/g) || []).length;
  assert(svgsCount !== 1);
});
Deno.test("ligature check", () => {
  const svg = ttf2svgFont(materialIcons, { ligature: "home" });
  const svgCount = (svg.match(/<glyph/g) || []).length;
  assert(svgCount === 1);
  assert(svg === homeFont);
  const svgs = ttf2svgFont(materialIcons);
  const svgsCount = (svgs.match(/glyph/g) || []).length;
  assert(svgsCount !== 1);
});
