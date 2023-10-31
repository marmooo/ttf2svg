import { ttf2svg } from "./mod.js";

const ttfPath = Deno.args[0];
const word = Deno.args[1];

if (1 <= Deno.args.length && Deno.args.length <= 2) {
  console.log(ttf2svg(ttfPath, word));
} else {
  console.log("Usage: ttf2svg ttfPath [words]");
}
