import { defineConfig } from "tsup"

export default defineConfig({
  clean: true,
  entry: {
    ".": "src/index.tsx",
  },
  format: ["cjs", "esm"],
  external: ["react"],
  dts: true,
})
