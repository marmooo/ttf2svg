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

function toSVG(font, glyph, options = {}) {
  const translateY = options.translateY ?? calcLineSpace(font);
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

function toSVGFont(font, targetGlyphs) {
  return glyphHeader(font) + toGlyphTag(font, targetGlyphs) + glyphFooter();
}

function toGlyphTag(font, glyphs) {
  const lineGap = font.lineGap ?? 0;
  const height = font.ascender + font.descender + lineGap;
  return glyphs.map((glyph) => {
    const d = glyph.path.toPathData();
    if (d == "") return undefined;
    return `<glyph glyph-name="&#${glyph.unicode};" unicode="&#${glyph.unicode};"
      horiz-adv-x="${glyph.advanceWidth}" vert-adv-y="${height}"
      d="${d}"/>`;
  }).filter((glyph) => glyph).join("\n");
}

export function ttf2svg(ttfPath, chars, options) {
  const font = opentype.loadSync(ttfPath);
  if (chars) {
    const glyphs = chars.split("")
      .map((char) => {
        const targetGlyph = font.charToGlyph(char);
        const codePoint = char.codePointAt(0);
        const glyph = new opentype.Glyph({
          // name: char,
          unicode: codePoint,
          glyphName: codePoint,
          advanceWidth: targetGlyph.advanceWidth,
          path: targetGlyph.path,
        });
        return glyph;
      });
    return glyphs.map((glyph) => {
      const codePoint = glyph.unicode;
      const svg = toSVG(font, glyph, options);
      return { codePoint, svg };
    });
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
    return glyphs.map((glyph) => {
      const codePoint = glyph.unicode;
      const svg = toSVG(font, glyph, options);
      return { codePoint, svg };
    });
  }
}

export function ttf2svgFont(ttfPath, chars) {
  const font = opentype.loadSync(ttfPath);
  if (chars) {
    const glyphs = chars.split("")
      .map((char) => {
        const targetGlyph = font.charToGlyph(char);
        const codePoint = char.codePointAt(0);
        const glyph = new opentype.Glyph({
          // name: char,
          unicode: codePoint,
          glyphName: codePoint,
          advanceWidth: targetGlyph.advanceWidth,
          path: targetGlyph.path,
        });
        return glyph;
      });
    return toSVGFont(font, glyphs);
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
