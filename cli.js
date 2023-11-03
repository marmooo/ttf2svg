import { Command } from "npm:commander@11.1.0";
import { ttf2svg, ttf2svgFont } from "./mod.js";

const program = new Command();
program
  .name("ttf2svg")
  .description("Convert TTF to SVG.")
  .version("0.0.7");
program
  .argument("<ttfPath>", "Path of TTF font path")
  .argument("[chars]", "Characters to convert to SVG")
  .option("--font", "output as SVG font")
  .option("--height <number>", "Glyph height when outputting as SVG")
  .option("--translate-y <number>", "Glyph translateY when outputting as SVG");
program.parse();

const ttfPath = Deno.args[0];
const chars = Deno.args[1];
const options = program.opts();
if (options.font) {
  const result = ttf2svgFont(ttfPath, chars, options);
  console.log(result);
} else {
  const result = ttf2svg(ttfPath, chars, options);
  const svgs = result.map(({ svg }) => svg);
  if (chars.length == 1) {
    console.log(svgs);
  } else {
    const html = `<!doctype html>
<html lang="en">
<head>
  <title>SVG</title>
</head>
${svgs.join("\n")}
</html>`;
    console.log(html);
  }
}
