// src/config/brand.config.ts

export const BRAND = {
  name: "Sports Gallery",
  useStoreName: "sports-gallery-store",

  // Replace with your own logo URL (Cloudinary or public image URL)
  logo: "https://thumbs.dreamstime.com/b/vector-sports-icons-circle-icon-sign-symbol-pictogram-set-collection-flat-style-isolated-different-sport-equipment-games-66247271.jpg",

  phone: "+91 9876543210",
  whatsapp: "+91 9876543210",
  email: "support@sportsgallery.com",

  address:
    "MG Road, Bengaluru, Karnataka 560001",

  social: {
    instagram: "https://www.instagram.com/sportsgallery",
    facebook: "https://www.facebook.com/sportsgallery",
    twitter: "https://x.com/sportsgallery",
    youtube: "https://www.youtube.com/@sportsgallery",
  },

  theme: {
    primary: "#1565C0",     // Sports Blue
    secondary: "#0D47A1",
    accent: "#E3F2FD",

    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",

    neutral: {
      light: "#F9FAFB",
      dark: "#111827",
      border: "#E5E7EB",
      muted: "#6B7280",
    },

    surface: {
      base: "#FFFFFF",
      elevated: "#F8FAFC",
      glass: "rgba(255,255,255,0.7)",
    },

    darkSurface: {
      base: "#111827",
      elevated: "#1F2937",
      glass: "rgba(17,24,39,0.7)",
    },

    state: {
      hover: "0.08",
      active: "0.16",
      focus: "0.24",
    },
  },
};
