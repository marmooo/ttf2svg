const fontCarrier = require("font-carrier");

function ttf2svg(ttfPath, words) {
  const transFont = fontCarrier.transfer(ttfPath);
  if (words) {
    if (words.length == 1) {
      const glyph = transFont.getGlyph(words);
      console.log(glyph.toSvg());
    } else {
      const font = fontCarrier.create();
      words.split("").forEach((word) => {
        const glyph = transFont.getGlyph(word);
        font.setGlyph(word, {
          glyphName: word,
          svg: glyph.toSvg(),
        });
      });
      const output = font.output({
        types: ["svg"],
      });
      console.log(output.svg.toString());
    }
  } else {
    const output = transFont.output({
      types: ["svg"],
    });
    console.log(output.svg.toString());
  }
}

module.exports = ttf2svg;
