// Shared design tokens for the portfolio. The typescale below is the single
// source of truth for text styling across the homepage and case studies.
// Pair these presets with semantic HTML (<h1>–<h4>, <p>) so the document has
// a real heading hierarchy for screen readers and outline tools.

export const FONTS = {
  display: "'Space Grotesk', sans-serif",
  body: "'DM Sans', sans-serif",
  mono: "'Space Mono', monospace",
};

// Brand colors shared across pages. Per-page palettes may extend this.
export const BRAND = {
  limon: "#EDFF46",
  neptune: "#0300B4",
  kale: "#012D04",
  crimson: "#A51C30",
  crema: "#FCFBF7",
  white: "#FFFFFF",
  black: "#000000",
};

const px = (d, m, isMobile) => (isMobile ? m : d);

// Each preset returns a CSSProperties-like object. Spread it onto an element
// and override individual properties (color, textAlign, etc.) as needed.
export const ts = {
  // Hero / page-title display size. Pair with <h1>.
  display: (isMobile) => ({
    margin: 0,
    fontFamily: FONTS.display,
    fontWeight: 400,
    fontSize: px(60, 34, isMobile),
    lineHeight: 1.142,
  }),
  // Section banner / large heading. Pair with <h1> or <h2>.
  h1: (isMobile) => ({
    margin: 0,
    fontFamily: FONTS.display,
    fontWeight: 400,
    fontSize: px(40, 26, isMobile),
    lineHeight: 1.142,
  }),
  // Major section heading. Pair with <h2>.
  h2: (isMobile) => ({
    margin: 0,
    fontFamily: FONTS.display,
    fontWeight: 700,
    fontSize: px(32, 22, isMobile),
    lineHeight: 1.2,
  }),
  // Subsection heading. Pair with <h3>.
  h3: (isMobile) => ({
    margin: 0,
    fontFamily: FONTS.body,
    fontWeight: 700,
    fontSize: px(24, 18, isMobile),
    lineHeight: 1.2,
    fontVariationSettings: "'opsz' 14",
  }),
  // Small heading or supporting headline. Pair with <h4>.
  h4: (isMobile) => ({
    margin: 0,
    fontFamily: FONTS.body,
    fontWeight: 600,
    fontSize: px(20, 16, isMobile),
    lineHeight: 1.2,
    fontVariationSettings: "'opsz' 14",
  }),
  // Large body copy. Pair with <p>.
  bodyL: (isMobile) => ({
    margin: 0,
    fontFamily: FONTS.body,
    fontWeight: 400,
    fontSize: px(24, 16, isMobile),
    lineHeight: 1.6,
    fontVariationSettings: "'opsz' 14",
  }),
  // Default body copy. Pair with <p>.
  bodyM: (isMobile) => ({
    margin: 0,
    fontFamily: FONTS.body,
    fontWeight: 400,
    fontSize: px(18, 14, isMobile),
    lineHeight: 1.6,
    fontVariationSettings: "'opsz' 14",
  }),
  // Small body / supporting text. Pair with <p> or <span>.
  bodyS: (isMobile) => ({
    margin: 0,
    fontFamily: FONTS.body,
    fontWeight: 400,
    fontSize: px(16, 13, isMobile),
    lineHeight: 1.6,
    fontVariationSettings: "'opsz' 14",
  }),
  // Figure captions, badges, kicker labels. Uppercase with tracking.
  caption: () => ({
    margin: 0,
    fontFamily: FONTS.display,
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 1.2,
    letterSpacing: "1.28px",
    textTransform: "uppercase",
  }),
  // Eyebrow tags above titles (e.g. "FROM HARVARD TO THE GROCERY AISLE").
  eyebrow: (isMobile) => ({
    margin: 0,
    fontFamily: FONTS.display,
    fontWeight: 400,
    fontSize: px(20, 14, isMobile),
    lineHeight: 0.984,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  }),
};

// Visually hides content but keeps it readable by screen readers.
export const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};
