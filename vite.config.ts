import UnoCSS from "unocss/vite";
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [UnoCSS(), solid({ ssr: false })],
    ssr: {
      noExternal: ["@kobalte/core", "@internationalized/message"],
    },
  };
});
