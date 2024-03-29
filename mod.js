import { parse } from "npm:opentype.js@1.3.4";
import svgpath from "npm:svgpath@2.6.0";

function calcLineSpace(font) {
  const lineGap = font.tables.hhea?.lineGap ?? 0;
  return font.ascender - font.descender + lineGap;
}

function svgHeader(font, glyph, options = {}) {
  const widthAttribute = (options.width) ? `width="${options.width}"` : "";
  const heightAttribute = (options.height) ? `height="${options.height}"` : "";
  const glyphWidth = glyph.advanceWidth;
  const glyphHeight = options.glyphHeight ?? calcLineSpace(font);
  const copyright = fontToCopyright(font);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg"
  ${widthAttribute} ${heightAttribute} viewBox="0 0 ${glyphWidth} ${glyphHeight}">
`;
  if (copyright != "") {
    svg += `  <!--
${copyright}
  -->
`;
  }
  return svg;
}

export function toSVG(font, glyph, options = {}) {
  const translateY = options.translateY ?? font.ascender;
  const d = svgpath(glyph.path.toPathData())
    .scale(1, -1)
    .translate(0, Number(translateY))
    .toString();
  if (d == "") return undefined;
  const path = `<path d="${d}"/>`;
  return svgHeader(font, glyph, options) + path + "\n</svg>";
}

function getInfo(hash) {
  if (!hash) return "";
  const arr = Object.values(hash);
  if (arr.length > 0) {
    return arr[0];
  } else {
    return "";
  }
}

function fontToCopyright(font) {
  const copyrights = font.names.copyright
    ? Object.values(font.names.copyright).join("\n")
    : "";
  const trademarks = font.names.trademark
    ? Object.values(font.names.trademark).join("\n")
    : "";
  const licenses = font.names.license
    ? Object.values(font.names.license).join("\n")
    : "";
  const licenseURLs = font.names.licenseURL
    ? Object.values(font.names.licenseURL).join("\n")
    : "";
  const infos = [copyrights, trademarks, licenses, licenseURLs];
  return infos.filter((info) => info).join("\n");
}

function glyphHeader(font) {
  let header = `<svg xmlns="http://www.w3.org/2000/svg">
`;
  const copyright = fontToCopyright(font);
  if (copyright != "") {
    header += `<!--
${copyright}
  -->
`;
  }
  header += `
  <defs>
    <font name="${getInfo(font.names.fullName)}"
      horiz-adv-x="${font.unitsPerEm}" vert-adv-y="${font.unitsPerEm}" >
    <font-face font-family="${getInfo(font.names.fontFamily)}" font-weight="400"
      font-stretch="normal"
      units-per-em="${font.unitsPerEm}"
      ascent="${font.ascender}"
      descent="${font.descender}"/>
`;
  return header;
}

function glyphFooter() {
  return `
    </font>
  </defs>
</svg>`;
}

export function toSVGFont(font, glyphs, options) {
  return glyphHeader(font) + toGlyphTag(font, glyphs, options) +
    glyphFooter();
}

export function toGlyphTag(font, glyphs, options) {
  const lineGap = font.tables.hhea?.lineGap ?? 0;
  const height = font.ascender - font.descender + lineGap;
  const existed = glyphs.filter((glyph) => glyph.unicode).map((glyph) => {
    const d = glyph.path.toPathData();
    if (d == "") return undefined;
    return `<glyph glyph-name="${glyph.name}" unicode="&#${glyph.unicode};"
      horiz-adv-x="${glyph.advanceWidth}" vert-adv-y="${height}"
      d="${d}"/>`;
  }).filter((glyphTag) => glyphTag).join("\n");
  if (options.removeNotdef) {
    return existed;
  } else {
    const notdefGlyph = font.glyphs.get(0);
    const d = notdefGlyph.path.toPathData();
    const notDef = `<missing-glyph glyph-name=".notdef"
      horiz-adv-x="${notdefGlyph.advanceWidth}" vert-adv-y="${height}"
      d="${d}"/>`;
    return existed + "\n" + notDef;
  }
}

function getGlyphString(options = {}) {
  if (options.textFile) {
    const text = Deno.readTextFileSync(options.textFile);
    return text.trimEnd().replace(/\n/g, "");
  } else if (options.codeFile) {
    const text = Deno.readTextFileSync(options.codeFile);
    return text.trimEnd().split("\n")
      .map((line) => String.fromCodePoint(Number(line))).join("");
  } else if (options.text) {
    return options.text;
  } else if (options.code) {
    return options.code.split(",")
      .map((code) => String.fromCodePoint(Number(code))).join("");
  } else {
    return undefined;
  }
}

export function filterGlyphs(font, options = {}) {
  const glyphString = getGlyphString(options);
  if (glyphString) {
    return font.stringToGlyphs(glyphString);
  } else {
    return Object.values(font.glyphs.glyphs);
  }
}

export function font2svg() {
  const glyphs = filterGlyphs(font, options);
  return glyphs.map((glyph) => {
    return toSVG(font, glyph, options);
  });
}

export function ttf2svg(uint8array, options = {}) {
  const font = parse(uint8array.buffer);
  font2svg(font, options);
}

export function ttf2svgFont(uint8array, options = {}) {
  const font = parse(uint8array.buffer);
  font2svgFont(font, options);
}

export function font2svgFont(font, options = {}) {
  const glyphs = filterGlyphs(font, options);
  return toSVGFont(font, glyphs, options);
}
