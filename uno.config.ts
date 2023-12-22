import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetMini,
  transformerDirectives,
} from "unocss";
import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  shortcuts: {
    "border-base": "border-gray-200 dark:border-gray-800",
    "border-border": "border-border-color",
    "bg-active": "bg-gray:10",
    "bg-faded": "bg-gray:5",
    "bg-background": "bg-background-body",
    "bg-base": "bg-white dark:bg-[#020420]",
    "text-faded": "text-gray6:100 dark:text-gray:100",
    "button-default":
      "bg-background-body text-offwhite h-8.5 border-border hover:bg-dark-gray flex items-center justify-center gap-1.5 rounded-md border px-1.5 outline-0",
    "button-primary": "button-default bg-[#432a11] border-[#c77100]",
    "button-secondary": "button-default bg-[#2c153f] border-[#6a0ab9]",
  },
  theme: {
    colors: {
      primary: {
        DEFAULT: "#f68f08",
      },
      "background-body": "#121212",
      "background-hover": "#202020",
      "dark-gray": "#1b1b1b",
      "dark-gray-hover": "#2f2f2f",
      "base-font-color": "#FFF",
      "base-font-receding-color": "#a2a2a2",
      "base-font-more-receding-color": "#838383",
      "light-grey": "#383838",
      "input-bg": "#191919",
      "border-color": "#333",
      "selected-option-border": "#155a34",
      green: "#25c77a",
      red: "#ed495d",
      white: "#fff",
      offwhite: "#e3e3e3",
      black: "#000",
    },
    breakpoints: {
      lgg: "1190px",
    },
  },
  presets: [
    presetMini(),
    presetUno(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
  extractors: [],
  content: {
    // filesystem: ["./content/**/*.md"],
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
