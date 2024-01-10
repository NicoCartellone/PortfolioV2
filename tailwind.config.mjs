const {nextui} = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
	'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    // single component styles
    "./node_modules/@nextui-org/theme/dist/components/button.js", 
    // or you can use a glob pattern (multiple component styles)
    './node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input).js'
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};