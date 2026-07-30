/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary — Emerald
        emerald: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        // Secondary — Teal
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
        },
        // Accent — Lime
        lime: {
          200: "#D9F99D",
          300: "#BEF264",
          400: "#A3E635",
          500: "#84CC16",
        },
        // Semantic freshness states
        fresh: "#10B981",
        good: "#14B8A6",
        acceptable: "#84CC16",
        nearSpoilage: "#F59E0B",
        spoiled: "#F43F5E",
        // Surfaces (dark mode aware, referenced via CSS variables)
        surface: {
          light: "#FFFFFF",
          "light-secondary": "#F8FAFC",
          dark: "#0B1120",
          "dark-secondary": "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.4" }],
        xl: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "4xl": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.875rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(15 23 42 / 0.04)",
        sm: "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
        md: "0 4px 12px -2px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.05)",
        lg: "0 12px 24px -6px rgb(15 23 42 / 0.1), 0 4px 8px -4px rgb(15 23 42 / 0.06)",
        glow: "0 0 0 1px rgb(16 185 129 / 0.15), 0 8px 24px -4px rgb(16 185 129 / 0.25)",
        "dark-sm": "0 1px 2px 0 rgb(0 0 0 / 0.3)",
        "dark-md": "0 4px 16px -2px rgb(0 0 0 / 0.4)",
        "dark-lg": "0 16px 32px -8px rgb(0 0 0 / 0.5)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #10B981 0%, #14B8A6 100%)",
        "gradient-brand-hover": "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
        "gradient-mesh":
          "radial-gradient(at 20% 20%, rgba(16,185,129,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(20,184,166,0.12) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(163,230,53,0.1) 0px, transparent 50%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.35)" },
          "50%": { boxShadow: "0 0 0 8px rgba(16,185,129,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3.5s ease-in-out infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
