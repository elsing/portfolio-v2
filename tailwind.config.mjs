/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs:  '400px',   // status text visible above 400px
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        bg:              "#1e2422",
        bg2:             "#262c29",
        bg3:             "#2d3430",
        "site-green":    "#3ddb72",
        "site-amber":    "#d4a84b",
        "site-blue":     "#5b9fd4",
        "site-text":     "#e2ede6",
        "site-muted":    "#4f6359",
        "site-muted-hi": "#7d9a88",
        "site-red":      "#e05050",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
