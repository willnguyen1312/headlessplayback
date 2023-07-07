import UnoCSS from "unocss/vite"
import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  plugins: [solidPlugin(), UnoCSS()],
  build: {
    target: "esnext",
  },
  server: {
    port: 1312,
    host: true,
    open: true,
  },
})
