import { defineConfig } from "vite"
import UnoCSS from "unocss/vite"

export default defineConfig({
  plugins: [UnoCSS()],
  server: {
    host: true,
    open: true,
    port: 1312,
  },
})
