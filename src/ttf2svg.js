const opentype = require("opentype.js");
const svgpath = require("svgpath");

function svgHeader(font, glyph) {
  const height = font.ascender - font.descender;
  const copyright = fontToCopyright(font);
  return `<svg xmlns="http://www.w3.org/2000/svg"
  width="100" height="100"
  viewBox="0 0 ${glyph.advanceWidth} ${height}">
  <!--
${copyright}
  -->
`;
}

function toSVG(font, glyph) {
  const d = svgpath(glyph.path.toPathData())
    .scale(1, -1)
    .translate(0, font.ascender)
    .toString();
  const path = `<path d="${d}"/>`;
  return svgHeader(font, glyph) + path + "\n</svg>";
}

function getInfo(hash) {
  const arr = Object.values(hash);
  if (arr.length > 0) {
    return arr[0];
  } else {
    return "";
  }
}

function fontToCopyright(font) {
  const copyrights = Object.values(font.names.copyright).join("\n");
  const trademarks = Object.values(font.names.trademark).join("\n");
  const licenses = Object.values(font.names.license).join("\n");
  const licenseURLs = Object.values(font.names.licenseURL).join("\n");
  return [copyrights, trademarks, licenses, licenseURLs].join("\n");
}

function glyphHeader(font) {
  const copyright = fontToCopyright(font);
  const header = `<svg xmlns="http://www.w3.org/2000/svg"
  width="100" height="100">
  <!--
${copyright}
  -->
  <defs>
    <font id="${getInfo(font.names.fullName)}"
      horiz-adv-x="${font.tables.hhea.advanceWidthMax}" vert-adv-y="${font.unitsPerEm}" >
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

function toSVGFont(font, targetGlyphs) {
  return glyphHeader(font) + toGlyphTag(font, targetGlyphs) + glyphFooter();
}

function toGlyphTag(font, glyphs) {
  return glyphs.map((glyph) => {
    const d = svgpath(glyph.path.toPathData())
      .scale(1, -1)
      .translate(0, font.ascender)
      .toString();
    return `<glyph glyph-name="&#${glyph.unicode};" unicode="&#${glyph.unicode};"
      horiz-adv-x="${glyph.advanceWidth}" vert-adv-y="${font.unitsPerEm}"
      d="${d}"/>`;
  }).join("\n");
}

function ttf2svg(ttfPath, words) {
  const font = opentype.loadSync(ttfPath);
  if (words) {
    if (words.length == 1) {
      const glyph = font.charToGlyph(words);
      return toSVG(font, glyph);
    } else {
      const glyphs = words.split("")
        .map((word) => {
          const targetGlyph = font.charToGlyph(word);
          const codePoint = word.codePointAt(0);
          const glyph = new opentype.Glyph({
            // name: word,
            unicode: codePoint,
            glyphName: codePoint,
            advanceWidth: targetGlyph.advanceWidth,
            path: targetGlyph.path,
          });
          return glyph;
        });
      return toSVGFont(font, glyphs);
    }
  } else {
    // TODO: multiple missing-glyphs
    const glyphs = Object.values(font.glyphs.glyphs);
    const targetGlyphs = [];
    glyphs.forEach((glyph) => {
      if (glyph.unicode) {
        // glyph.name = String.fromCodePoint(glyph.unicode);
        targetGlyphs.push(glyph);
      }
    });
    return toSVGFont(font, targetGlyphs);
  }
}

module.exports = ttf2svg;
