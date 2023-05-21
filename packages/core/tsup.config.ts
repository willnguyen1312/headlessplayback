import { defineConfig } from "tsup"

export default defineConfig({
  entry: {
    ".": "src/index.tsx",
  },
  format: ["cjs", "esm"],
  external: ["react"],
  dts: true,
})
