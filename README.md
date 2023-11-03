# @marmooo/ttf2svg

Convert TTF to SVG.

## Install

### Deno

```
deno install -fr --allow-read --allow-write --name ttf2svg \
https://raw.githubusercontent.com/marmooo/ttf2svg/main/cli.js
```

### Node

```
npm install @marmooo/ttf2svg -g
```

## Usage

```
Usage: ttf2svg [options] <ttfPath> [chars]

Convert TTF to SVG.

Arguments:
  ttfPath                 Path of TTF font path
  chars                   Characters to convert to SVG

Options:
  -V, --version           output the version number
  --font                  output as SVG font
  --height <number>       Glyph height when outputting as SVG
  --translate-y <number>  Glyph translateY when outputting as SVG
  -h, --help              display help for command
```

## Examples

```
ttf2svg font.ttf a > a.svg
ttf2svg font.ttf 漢 --translate-y 850 > 漢.svg
ttf2svg font.ttf abc > abc.html
ttf2svg font.ttf > list.svg
ttf2svg font.ttf --font > font.svg
```

## License

MIT
