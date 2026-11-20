// The portfolio's type scale. Every text size on the case study pages is one
// step on this scale: size = base × ratio^step. Change the base, the ratio or a
// level's step here and the whole hierarchy moves together.
// The ?tune panel (TypeTuner.jsx) overrides these live through CSS variables.

export const SCALE = {
  base: 1.125, // rem (18px at the default browser size)
  ratio: 1.25, // major third
  steps: { h1: 4, h2: 3, h3: 2, body: 0, small: -1 },
  leading: { h1: 1.15, h2: 1.22, h3: 1.2, body: 1.44, small: 1 },
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
  { id: "body", label: "Body text" },
  { id: "small", label: "Small · eyebrows and toggles" },
];

// Phones use a flatter set so headlines don't wrap word by word.
const MOBILE = { h1: "1.75rem", h2: "1.625rem", h3: "1.375rem", body: "1rem", small: "0.8125rem" };

export const stepRem = (level, s = SCALE) => s.base * s.ratio ** s.steps[level];

// CSS values for a level: the tuner's variable if set, otherwise the scale value.
export const tsSize = (level, isMobile = false) =>
  isMobile ? MOBILE[level] : `var(--ts-${level}, ${stepRem(level).toFixed(4)}rem)`;
export const tsLead = (level) => `var(--ts-${level}-lh, ${SCALE.leading[level]})`;
