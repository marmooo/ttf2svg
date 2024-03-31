import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: [
    "./mod.js",
    {
      kind: "bin",
      name: "@marmooo/ttf2svg",
      path: "./cli.js",
    },
  ],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  package: {
    name: "@marmooo/ttf2svg",
    version: "0.1.7",
    description: "Convert TTF to SVG.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/marmooo/ttf2svg/repo.git",
    },
    bugs: {
      url: "https://github.com/marmooo/ttf2svg/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
