/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:              "#161a18",
        bg2:             "#1c201e",
        bg3:             "#222824",
        "site-green":    "#3ddb72",
        "site-amber":    "#d4a84b",
        "site-blue":     "#5b9fd4",
        "site-purple":   "#9d7fea",
        "site-orange":   "#e8822a",
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
      fontSize: {
        "2xs": "0.625rem", // 10px
      },
    },
  },
  plugins: [],
};
