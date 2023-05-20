import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), UnoCSS()],
  server: {
    host: true,
    open: true,
  },
});
