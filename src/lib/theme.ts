// ============================================================
// GLOBAL THEME CONSTANTS
// Change brand colors here to update the entire website
// ============================================================

export const THEME = {
  colors: {
    // Brand palette derived from the logo blue
    rose: '#14177D',   // primary
    cream:'#F6F8FF',   // background
    sage: '#D7DEF4',   // borders
    teal: '#4B7BFF',   // accent

    // Derived shades (used in CSS variables)
    roseDark:  '#0E115C',
    roseLight: '#DDE4FF',
    tealDark:  '#2F62E1',
    tealLight: '#E1EBFF',
    sageLight: '#EDF2FF',

    // Neutral
    ink:    '#171D36',
    muted:  '#67718F',
    white:  '#FFFFFF',
  },

  // Fonts - change here to swap globally
  fonts: {
    heading: "'Cormorant Garamond', Georgia, serif",
    body:    "'DM Sans', system-ui, sans-serif",
    mono:    "'JetBrains Mono', monospace",
  },

  // Site metadata
  site: {
    name: 'Ccharmy Shah',
    tagline: 'Discover Your Numbers, Decode Your Destiny',
    numerologistName: 'Ccharmy Shah',
    email: 'shahccharmy@gmail.com',
    phone: '+91 7304623234',
    whatsapp: '+917304623234',
    instagram: 'https://instagram.com/CcharmyShah',
    facebook: 'https://facebook.com/CcharmyShah',
    youtube:  ' https://www.youtube.com/@Numerologywithccharmyshah',
  },

  // Razorpay config
  razorpay: {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    currency: 'INR',
  },
} as const;

export type ThemeColors = typeof THEME.colors;

