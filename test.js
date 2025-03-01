import { ttf2svg, ttf2svgFont } from "./mod.js";
import { assertEquals, assertInstanceOf } from "@std/assert";

Deno.test("ttf2svg check", () => {
  const file = Deno.readFileSync("./test/Roboto-Regular.ttf");
  const svg = ttf2svg(file);
  assertInstanceOf(svg, Array);
});
Deno.test("ttf2svgFont check", () => {
  const file = Deno.readFileSync("./test/Roboto-Regular.ttf");
  const svg = ttf2svgFont(file);
  assertEquals(typeof svg, "string");
});
