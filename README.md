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
Usage: ttf2svg ttfPath [word]
```

## Examples

```
ttf2svg font.ttf abc > abc.svg
ttf2svg font.ttf 漢 > 漢.svg
ttf2svg font.ttf > font.svg
```

## License

MIT
