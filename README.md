# @marmooo/ttf2svg

Convert TTF to SVG.

## Installation

### Deno

```
deno install -fr -RE -g npm:@marmooo/ttf2svg --name ttf2svg
```

### Node

```
npm install @marmooo/ttf2svg -g
```

## Usage

```
import { ttf2svg, ttf2svgFont } from "@marmooo/ttf2svg";

const font = Deno.readFileSync("font.ttf");
ttf2svg(font);
ttf2svg(font, { text: "abcdef", width: 100 });
ttf2svg(font, { code: "0x61,98" });
ttf2svgFont(font);
ttf2svgFont(font, { codeFile: "codepoints.lst" });
```

## CLI

```
Usage: ttf2svg [options] <fontPath>

Convert TTF to SVG.

Arguments:
  fontPath                 Font path (.otf, .ttf, .woff)

Options:
  -V, --version            output the version number
  --text <string>          characters to compress
  --text-file <path>       Path of line separated character file to compress
  --code <string>          comma separated codepoints to compress
  --code-file <path>       Path of line separated codepoint file to compress
  --name <string>          comma separated glyph names to compress
  --name-file <path>       Path of line separated glyph name file to compress
  --ligature <string>      comma separated ligatures to compress
  --ligature-file <path>   Path of line separated ligature file to compress
  --font                   output as SVG font
  --width <string>         SVG width attribute value
  --height <string>        SVG height attribute value
  --metrics <string>       source of font metrics (choices: "typo", "win", "hhea", default: "typo")
  --glyph-height <number>  Glyph height when outputting as SVG
  --translate-y <number>   Glyph translateY when outputting as SVG
  --remove-notdef          remove .notdef
  --remove-ligatures       remove ligatures associated with the glyphs
  -h, --help               display help for command
```

## Examples

```
ttf2svg font.ttf > list.html
ttf2svg font.woff --font > font.svg
ttf2svg font.otf --text abcdef --translate-y 850 > abcdef.svg
ttf2svg font.otf --text-file characters.lst --font > font.svg
ttf2svg font.woff2 --code 0x61,98 > font.html
ttf2svg font.woff2 --name alarm,box --font > font.svg
ttf2svg font.woff2 --ligature home,menu --font > font.svg
```

## License

MIT
