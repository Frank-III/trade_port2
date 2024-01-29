import UnoCSS from "unocss/vite";
import solid from "solid-start/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
	return {
		plugins: [UnoCSS(), solid({ ssr: true, prerenderRoutes: [] })],
		ssr: {
			noExternal: ["@kobalte/core", "@internationalized/message"],
		},
	};
});
