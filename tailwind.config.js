/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Modo Claro
        primary: {
          50: "#e6f1f8",
          100: "#b3d7ed",
          200: "#80bdde",
          300: "#4da3cf",
          400: "#2693c4",
          500: "#005696", // Azul El Rincón - Principal
          600: "#004577",
          700: "#003559",
          800: "#002a44",
          900: "#001f33",
        },
        accent: {
          50: "#fce8e9",
          100: "#f7b8bc",
          200: "#f38890",
          300: "#ee5864",
          400: "#e92f3c",
          500: "#e30613", // Rojo corporativo - Principal
          600: "#b6050f",
          700: "#8a040b",
          800: "#5e0308",
          900: "#320204",
        },
        // Fondos y superficies (modo claro)
        background: {
          DEFAULT: "#f9f9f9",
          alt: "#f3f4f6",
        },
        surface: {
          DEFAULT: "#ffffff",
          alt: "#f3f4f6",
        },
        // Textos (modo claro)
        text: {
          primary: "#1f2937",
          secondary: "#6b7280",
          tertiary: "#9ca3af",
          "on-primary": "#ffffff",
          "on-accent": "#ffffff",
        },
        // Bordes
        border: {
          DEFAULT: "#e5e7eb",
          strong: "#d1d5db",
        },
        // Colores semánticos
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        info: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        // Modo oscuro
        dark: {
          primary: {
            50: "#1a3a4f",
            100: "#245270",
            200: "#2e6a91",
            300: "#3882b2",
            400: "#3a8fc9",
            500: "#3a8fc9", // Azul brillante modo oscuro
            600: "#5ca7d8",
            700: "#7dbce5",
            800: "#9dd1f2",
            900: "#bee6ff",
          },
          accent: {
            50: "#4a1315",
            100: "#6e1b1e",
            200: "#922327",
            300: "#b62b30",
            400: "#da3339",
            500: "#f72c3a", // Rojo brillante modo oscuro
            600: "#fa5560",
            700: "#fc7d86",
            800: "#fda6ac",
            900: "#ffced2",
          },
          background: {
            DEFAULT: "#0f172a",
            alt: "#1e293b",
          },
          surface: {
            DEFAULT: "#1e293b",
            alt: "#334155",
          },
          text: {
            primary: "#f1f5f9",
            secondary: "#cbd5e1",
            tertiary: "#94a3b8",
            "on-primary": "#ffffff",
            "on-accent": "#ffffff",
          },
          border: {
            DEFAULT: "#334155",
            strong: "#475569",
          },
          success: {
            50: "#064e3b",
            100: "#065f46",
            500: "#34d399",
            600: "#6ee7b7",
            700: "#a7f3d0",
          },
          warning: {
            50: "#78350f",
            100: "#92400e",
            500: "#fbbf24",
            600: "#fcd34d",
            700: "#fde68a",
          },
          error: {
            50: "#7f1d1d",
            100: "#991b1b",
            500: "#f87171",
            600: "#fca5a5",
            700: "#fecaca",
          },
          info: {
            50: "#1e3a8a",
            100: "#1e40af",
            500: "#60a5fa",
            600: "#93c5fd",
            700: "#bfdbfe",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

module.exports = config;
