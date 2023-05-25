import { defineConfig } from "tsup"

export default defineConfig({
  clean: true,
  format: ["cjs", "esm"],
  external: ["react"],
  dts: true,
  treeshake: true,
})
