import { copySync } from "@std/fs";
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: [
    "./mod.js",
    {
      kind: "bin",
      name: "ttf2svg",
      path: "./cli.js",
    },
  ],
  outDir: "./npm",
  importMap: "deno.json",
  compilerOptions: {
    lib: ["ESNext"],
  },
  shims: {
    deno: true,
  },
  package: {
    name: "@marmooo/ttf2svg",
    version: "0.2.5",
    description: "Convert TTF to SVG.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/marmooo/ttf2svg.git",
    },
    bugs: {
      url: "https://github.com/marmooo/ttf2svg/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
    copySync("test", "npm/esm/test");
    copySync("test", "npm/script/test");
  },
});
