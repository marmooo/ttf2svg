import opentype from "npm:opentype.js@1.3.4";
import svgpath from "npm:svgpath@2.6.0";

function calcLineSpace(font) {
  const lineGap = font.lineGap ?? 0;
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

export function toSVGFont(font, targetGlyphs, options) {
  return glyphHeader(font) + toGlyphTag(font, targetGlyphs, options) +
    glyphFooter();
}

function toGlyphTag(font, glyphs, options) {
  const lineGap = font.lineGap ?? 0;
  const height = font.ascender - font.descender + lineGap;
  const existed = glyphs.filter((glyph) => glyph.unicode).map((glyph) => {
    const d = glyph.path.toPathData();
    if (d == "") return undefined;
    return `<glyph glyph-name="&#${glyph.unicode};" unicode="&#${glyph.unicode};"
      horiz-adv-x="${glyph.advanceWidth}" vert-adv-y="${height}"
      d="${d}"/>`;
  }).filter((glyph) => glyph).join("\n");
  if (options.removeNotdef) {
    return existed;
  } else {
    const notdefPos = font.cffEncoding.charset
      .findIndex((name) => name == ".notdef");
    const notdefGlyph = glyphs[notdefPos];
    const d = notdefGlyph.path.toPathData();
    const notDef = `<missing-glyph glyph-name=".notdef"
      horiz-adv-x="${notdefGlyph.advanceWidth}" vert-adv-y="${height}"
      d="${d}"/>`;
    return existed + "\n" + notDef;
  }
}

function selectGlyphs(font, chars) {
  if (chars) {
    return Array.from(chars).map((char) => font.charToGlyph(char));
  } else {
    return Object.values(font.glyphs.glyphs);
  }
}

export function ttf2svg(ttfPath, chars, options = {}) {
  const font = opentype.loadSync(ttfPath);
  const glyphs = selectGlyphs(font, chars);
  return glyphs.map((glyph) => {
    const svg = toSVG(font, glyph, options);
    return { glyph, svg };
  });
}

export function ttf2svgFont(ttfPath, chars, options = {}) {
  const font = opentype.loadSync(ttfPath);
  const glyphs = selectGlyphs(font, chars);
  return toSVGFont(font, glyphs, options);
}
