import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
        display: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "Monaco",
          "Inconsolata",
          "Roboto Mono",
          "monospace",
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // Corporate specific sizes
        'heading-xl': ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
        'heading-lg': ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }],
        'heading-md': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Corporate brand colors
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        // Status colors with accessibility in mind
        status: {
          success: {
            50: "#f0fdf4",
            100: "#dcfce7",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            900: "#14532d",
          },
          warning: {
            50: "#fffbeb",
            100: "#fef3c7",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            900: "#78350f",
          },
          error: {
            50: "#fef2f2",
            100: "#fee2e2",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            900: "#7f1d1d",
          },
          info: {
            50: "#eff6ff",
            100: "#dbeafe",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            900: "#1e3a8a",
          },
        },
        // Neutral grays with proper contrast ratios
        neutral: {
          0: "#ffffff",
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
      borderRadius: {
        none: "0px",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
        // Corporate specific - minimal rounding
        corporate: "0.25rem",
        "corporate-lg": "0.5rem",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },
      minHeight: {
        "44": "44px", // Minimum touch target size
      },
      minWidth: {
        "44": "44px", // Minimum touch target size
      },
      boxShadow: {
        corporate: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
        "corporate-lg": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        "corporate-xl": "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        "corporate-2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        // Focus states
        "focus-brand": "0 0 0 3px rgb(59 130 246 / 0.15)",
        "focus-error": "0 0 0 3px rgb(239 68 68 / 0.15)",
        "focus-success": "0 0 0 3px rgb(34 197 94 / 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideIn: {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for corporate utilities
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".corporate-transition": {
          "transition-property":
            "color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow",
          "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
          "transition-duration": "200ms",
        },
        ".corporate-focus": {
          "&:focus": {
            outline: "none",
            "box-shadow": "0 0 0 3px rgb(59 130 246 / 0.15)",
          },
          "&:focus-visible": {
            outline: "2px solid transparent",
            "outline-offset": "2px",
            "box-shadow": "0 0 0 3px rgb(59 130 246 / 0.15)",
          },
        },
        ".corporate-disabled": {
          opacity: "0.5",
          "pointer-events": "none",
          cursor: "not-allowed",
        },
        // Typography utilities
        ".text-heading-xl": {
          "font-size": "2.5rem",
          "line-height": "3rem",
          "font-weight": "700",
          "letter-spacing": "-0.025em",
        },
        ".text-heading-lg": {
          "font-size": "2rem",
          "line-height": "2.5rem",
          "font-weight": "600",
          "letter-spacing": "-0.025em",
        },
        ".text-heading-md": {
          "font-size": "1.5rem",
          "line-height": "2rem",
          "font-weight": "600",
          "letter-spacing": "-0.025em",
        },
        ".text-heading-sm": {
          "font-size": "1.25rem",
          "line-height": "1.75rem",
          "font-weight": "600",
        },
        ".text-body-lg": {
          "font-size": "1.125rem",
          "line-height": "1.75rem",
          "font-weight": "400",
        },
        ".text-body": {
          "font-size": "1rem",
          "line-height": "1.5rem",
          "font-weight": "400",
        },
        ".text-body-sm": {
          "font-size": "0.875rem",
          "line-height": "1.25rem",
          "font-weight": "400",
        },
        ".text-caption": {
          "font-size": "0.75rem",
          "line-height": "1rem",
          "font-weight": "400",
          "letter-spacing": "0.025em",
        },
        // Button utilities
        ".btn-corporate": {
          "border-radius": "0.25rem",
          "font-weight": "500",
          "transition-property":
            "color, background-color, border-color, text-decoration-color, fill, stroke, box-shadow",
          "transition-timing-function": "cubic-bezier(0.4, 0, 0.2, 1)",
          "transition-duration": "200ms",
          "&:focus": {
            outline: "none",
            "box-shadow": "0 0 0 3px rgb(59 130 246 / 0.15)",
          },
          "&:disabled": {
            opacity: "0.5",
            "pointer-events": "none",
            cursor: "not-allowed",
          },
        },
        // Card utilities
        ".card-corporate": {
          "background-color": "white",
          "border-radius": "0.5rem",
          "box-shadow": "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          border: "1px solid rgb(229 231 235)",
        },
        // Accessibility utilities
        ".sr-only-focusable": {
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          "white-space": "nowrap",
          "border-width": "0",
          "&:focus": {
            position: "static",
            width: "auto",
            height: "auto",
            padding: "0",
            margin: "0",
            overflow: "visible",
            clip: "auto",
            "white-space": "normal",
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
