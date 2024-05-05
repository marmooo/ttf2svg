# @marmooo/ttf2svg

Convert TTF to SVG.

## Installation

### Deno

```
deno install -fr --allow-read --name ttf2svg \
https://raw.githubusercontent.com/marmooo/ttf2svg/main/cli.js
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
  --font                   output as SVG font
  --width <string>         SVG width attribute value
  --height <string>        SVG height attribute value
  --glyph-height <number>  Glyph height when outputting as SVG
  --translate-y <number>   Glyph translateY when outputting as SVG
  --remove-notdef          remove .notdef
  --remove-ligatures       remove ligatures associated with the glyphs
  -h, --help               display help for command
```

## Examples

```
ttf2svg font.ttf > list.html
ttf2svg font.otf --text abcdef --translate-y 850 > abcdef.svg
ttf2svg font.otf --code 0x61,98 > code.html
ttf2svg font.woff --font > font.svg
ttf2svg font.woff --text-file characters.lst --font > text.svg
```

## License

MIT
