import { ttf2svg } from "./mod.js";
import { assert } from "@std/assert";

const roboto = Deno.readFileSync("./test/Roboto-Regular.ttf");
const materialIcons = Deno.readFileSync("./test/material-icons.ttf");

Deno.test("text check", () => {
  const svg = ttf2svg(roboto, { text: "a" });
  assert(svg.length === 1);
  const svgs = ttf2svg(roboto);
  assert(svgs.length !== 1);
});
Deno.test("code 10 check", () => {
  const svg = ttf2svg(materialIcons, { code: "59530" });
  assert(svg.length === 1);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});
Deno.test("code 16 check", () => {
  const svg = ttf2svg(materialIcons, { code: "0xe88a" });
  assert(svg.length === 1);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});
Deno.test("name check", () => {
  const svg = ttf2svg(materialIcons, { name: "home" });
  assert(svg.length === 1);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});
Deno.test("ligature check", () => {
  const svg = ttf2svg(materialIcons, { ligature: "home" });
  assert(svg.length === 1);
  const svgs = ttf2svg(materialIcons);
  assert(svgs.length !== 1);
});
