import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/client/index.ts",
    "src/runtime/index.ts",
    "src/types/index.ts"
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ["astro", "@casoon/fragment-renderer"]
});
