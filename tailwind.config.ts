import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const wScreenSize = plugin(({ matchUtilities, theme }) => {
  matchUtilities(
    {
      "w-screen": (value) => ({
        width: value,
      }),
    },
    {
      values: theme("screens"),
    }
  );
});

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      "2xs": "0px",
      xs: "370px",
      sm: "490px",
      md: "768px",
      lg: "1024px",
      xl: "1210px",
      "2xl": "1440px",
      "3xl": "1610px",
      "4xl": "1860px",
    },
    container: {
      center: true,
      screens: ["1210px"],
    },
    colors: {
      ct: "transparent",
      // Main
      bg: "#101014",
      light: "#f8f8f8",
      dark: "#000",

      // Main Others
      // ----- Items
      "item-1": "#292931",
      "item-1h": "#444449",
      "item-1a": "#444449",
      "item-2": "#35353d",
      "item-2h": "#4a4a51",
      "item-2a": "#4a4a51",
      // ----- Accents
      "accent--1t": "#127cea2f",
      "accent-1": "#127cea",
      "accent-1h": "#2a89ef",

      // ----- Accents - Shadows
      "s-accent-1": "#127cea2f",

      // ----- Alts
      "alt-1": "#FF1493",

      // ----- Borders
      "border-1": "#262629",
      "alt-border-1": "#333333",

      // ----- infos
      "alert-1": "#e70000",

      // ----- Shadows
      "basic-s": "#00000040",
    },
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "ui-sans-serif", "system-ui", "sans-serif"],
        main: ["Raleway", "Arial", "system-ui"],
        header: ["Unbounded", "Arial", "system-ui"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      padding: {
        site: "6rem",
        big: "2.4rem",
        title: "4rem",
      },
      boxShadow: {
        "button-md": "0px 0px 10px 1px",
        img: "0px 0px 12px 4px",
        item: "0px 0px 16px 1px",
      },
    },
  },
  plugins: [
    wScreenSize,
    plugin(({ addComponents }) => {
      addComponents({
        ".item-1": {
          "@apply bg-item-1 border border-border-1 bg-opacity-45": {},
        },
        // ".item-1o": {
        //   "@apply bg-item-1 border border-border-1 bg-opacity-45": {},
        // },
      });
    }),
  ],
} satisfies Config;
