import opentype from "npm:opentype.js@1.3.4";
import svgpath from "npm:svgpath@2.5.0";

function svgHeader(font, glyph) {
  const height = font.ascender - font.descender;
  const copyright = fontToCopyright(font);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg"
  width="100" height="100"
  viewBox="0 0 ${glyph.advanceWidth} ${height}">
`;
  if (copyright != "") {
    svg += `  <!--
${copyright}
  -->
`;
  }
  return svg;
}

function toSVG(font, glyph) {
  const d = svgpath(glyph.path.toPathData())
    .scale(1, -1)
    .translate(0, font.ascender)
    .toString();
  if (d == "") return undefined;
  const path = `<path d="${d}"/>`;
  return svgHeader(font, glyph) + path + "\n</svg>";
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
  let header = `<svg xmlns="http://www.w3.org/2000/svg"
  width="100" height="100">
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
    if (d == "") return undefined;
    return `<glyph glyph-name="&#${glyph.unicode};" unicode="&#${glyph.unicode};"
      horiz-adv-x="${glyph.advanceWidth}" vert-adv-y="${font.unitsPerEm}"
      d="${d}"/>`;
  }).filter((glyph) => glyph).join("\n");
}

export function ttf2svg(ttfPath, words) {
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
