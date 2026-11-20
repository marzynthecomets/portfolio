// The portfolio's type scale. Every text size on the case study pages is one
// step on this scale: size = base × ratio^step. Change the base, the ratio or a
// level's step here and the whole hierarchy moves together.
// The ?tune panel (TypeTuner.jsx) overrides these live through CSS variables.

export const SCALE = {
  base: 1.125, // rem (18px at the default browser size)
  ratio: 1.2, // minor third
  steps: { h1: 5.5, h2: 4.5, h3: 1, body: 0.5, medium: -1, small: 0.5 },
  leading: { h1: 1.14, h2: 1.22, h3: 1.24, body: 1.36, medium: 1.26, small: 1.3 },
};

export const RATIOS = [
  ["Major second", 1.125],
  ["Minor third", 1.2],
  ["Major third", 1.25],
  ["Perfect fourth", 1.333],
  ["Perfect fifth", 1.5],
];

export const LEVELS = [
  { id: "h1", label: "H1 · page title" },
  { id: "h2", label: "H2 · section headlines" },
  { id: "h3", label: "H3 · card and stat titles" },
  { id: "body", label: "Body large · paragraphs and quotes" },
  { id: "medium", label: "Body medium · text inside cards" },
  { id: "small", label: "Small · eyebrows and toggles" },
];

// Phones use the same steps on a smaller base and gentler ratio, so the
// hierarchy keeps its proportions without headlines wrapping word by word.
export const PHONE = { base: 1.0625, ratio: 1.125 }; // 17px × 1.125
// Hand adjustments on top of the phone scale, in px.
export const PHONE_ADJUST_PX = { small: 2, h2: -2, body: 2, medium: 2 };
export const PHONE_MAX = 899.98; // matches useIsMobile's 900px breakpoint

export const stepRem = (level, s = SCALE) => s.base * s.ratio ** s.steps[level];

// Each level reads --ts-<level>. The phone value is set by a media query (see
// scaleCss), so styles don't need to know the screen size; the ?tune panel
// overrides the variable inline. isMobile is accepted for older call sites.
export const tsSize = (level, _isMobile) => `var(--ts-${level}, ${stepRem(level).toFixed(4)}rem)`;
export const tsLead = (level) => `var(--ts-${level}-lh, ${SCALE.leading[level]})`;

export const scaleCss = () =>
  `@media (max-width: ${PHONE_MAX}px) { :root { ` +
  Object.keys(SCALE.steps)
    .map((l) => `--ts-${l}: ${(stepRem(l, { ...SCALE, ...PHONE }) + (PHONE_ADJUST_PX[l] || 0) / 16).toFixed(4)}rem;`)
    .join(" ") +
  ` } }`;
