const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: "#6D5DF6",
        "primary-strong": "#5F50EF",
        page: "#F5F3FF",
        ink: "#111827",
        "ink-soft": "#334155",
        surface: "#FFFFFF",
        "surface-muted": "#F8F7FF",
        "line-soft": "#E7E4FF"
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, rgba(109, 93, 246, 1) 0%, rgba(139, 92, 246, 0.85) 50%, rgba(236, 233, 255, 1) 100%)",
        "brand-gradient":
          "linear-gradient(135deg, rgba(109, 93, 246, 1) 0%, rgba(124, 102, 255, 0.95) 45%, rgba(167, 139, 250, 0.92) 100%)"
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(79, 70, 229, 0.08)",
        raised: "0 18px 40px rgba(79, 70, 229, 0.12)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.7)"
      }
    }
  },
  plugins: []
};
