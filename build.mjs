import { build } from "esbuild";

await build({
  entryPoints: ["main.js"],
  bundle: true,
  platform: "node",
  target: "es2020",
  outfile: "./dist.js",
});
