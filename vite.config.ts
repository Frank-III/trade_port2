import UnoCSS from "unocss/vite";
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  plugins: [UnoCSS()],
  start: {
    ssr: true,
  },
  ssr: {
    noExternal: ["@kobalte/core", "@internationalized/message"],
  },
});
