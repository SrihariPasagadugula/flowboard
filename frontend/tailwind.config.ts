import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        muted: "#f3f4f6",
        border: "#e5e7eb"
      },
      borderRadius: {
        xl: "12px"
      }
    },
  },
  plugins: [],
}

export default config