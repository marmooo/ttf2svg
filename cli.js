import { Command } from "commander";
import { ttf2svg, ttf2svgFont } from "./mod.js";

const program = new Command();
program
  .name("ttf2svg")
  .description("Convert TTF to SVG.")
  .version("0.2.1");
program
  .argument("<fontPath>", "Font path (.otf, .ttf, .woff)")
  .option("--text <string>", "characters to compress")
  .option(
    "--text-file <path>",
    "Path of line separated character file to compress",
  )
  .option("--code <string>", "comma separated codepoints to compress")
  .option(
    "--code-file <path>",
    "Path of line separated codepoint file to compress",
  )
  .option("--name <string>", "comma separated glyph names to compress")
  .option(
    "--name-file <path>",
    "Path of line separated glyph name file to compress",
  )
  .option("--ligature <string>", "comma separated ligatures to compress")
  .option(
    "--ligature-file <path>",
    "Path of line separated ligature file to compress",
  )
  .option("--font", "output as SVG font")
  .option("--width <string>", "SVG width attribute value")
  .option("--height <string>", "SVG height attribute value")
  .option("--glyph-height <number>", "Glyph height when outputting as SVG")
  .option("--translate-y <number>", "Glyph translateY when outputting as SVG")
  .option("--remove-notdef", "remove .notdef")
  .option(
    "--remove-ligatures",
    "remove ligatures associated with the glyphs",
  );
program.parse();

const fontPath = program.args[0];
const options = program.opts();

const font = Deno.readFileSync(fontPath);
if (options.font) {
  const result = ttf2svgFont(font, options);
  console.log(result);
} else {
  const svgs = ttf2svg(font, options);
  if (svgs.length == 1) {
    console.log(svgs[0]);
  } else {
    const html = `<!doctype html>
<html lang="en">
<head>
  <title>SVG</title>
</head>
<body>
${svgs.join("\n")}
</body>
</html>`;
    console.log(html);
  }
}
