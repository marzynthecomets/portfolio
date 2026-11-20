import { useEffect, useState } from "react";
import { C, F } from "./tnsShared.jsx";
import { SCALE, RATIOS, LEVELS } from "./typeScale.js";

// Type tuner: open any page with ?tune in the address (e.g. /?tune#/nutrition-source).
// Set the scale (base size × ratio), then pick a level (H1, H2, …) and move it up or
// down the scale. Values are written to CSS variables on <html>, which the page's
// type styles read, so the real page updates live. Hidden unless the URL has ?tune.

export const tunerEnabled = () =>
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("tune");

const DEFAULTS = {
  base: SCALE.base,
  ratio: SCALE.ratio,
  steps: { ...SCALE.steps },
  leading: { ...SCALE.leading },
  weight: { h1: 400, h2: 400, h3: 700, body: 400, medium: 400, small: 400 },
  track: { h1: -0.02, h2: 0.01, h3: 0, small: 0.08 },
  wrap: { h1: "wrap", h2: "balance", h3: "wrap" },
  wordSpace: 0,
  align: "",
  measure: 45,
  gapSm: 0.8125,
  gapLg: 3.25,
};
const STORE = "type-tuner-v3";
// Weights actually loaded for each family (see index.html).
const MONO = [300, 400, 500];
const SANS = [400, 500, 600, 700, 800, 900];
const WEIGHTS = { h1: MONO, h2: MONO, h3: SANS, body: SANS, medium: SANS, small: MONO };
const MIN_PX = 14;

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "{}");
    return {
      ...DEFAULTS, ...saved,
      steps: { ...DEFAULTS.steps, ...saved.steps },
      leading: { ...DEFAULTS.leading, ...saved.leading },
      weight: { ...DEFAULTS.weight, ...saved.weight },
      track: { ...DEFAULTS.track, ...saved.track },
      wrap: { ...DEFAULTS.wrap, ...saved.wrap },
    };
  } catch {
    return structuredClone(DEFAULTS);
  }
};

function avgCharPx(bodyPx) {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = `400 ${bodyPx}px 'DM Sans', sans-serif`;
  const sample =
    "Since the Nutrition Source truly has so much educational content, giving an overview of common nutrition questions";
  return ctx.measureText(sample).width / sample.length;
}

function Slider({ id, label, value, shown, min, max, step, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 64px", alignItems: "center", columnGap: 8, marginTop: 8 }}>
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id} style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{shown}</output>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ gridColumn: "1 / -1", width: "100%", accentColor: C.navy, margin: "2px 0 0" }} />
    </div>
  );
}

const short = (id) => (id === "spacing" ? "Spacing" : LEVELS.find((l) => l.id === id).label.split(" · ")[0]);

export default function TypeTuner() {
  const [t, setT] = useState(load);
  const [part, setPart] = useState("h2");
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [rootPx, setRootPx] = useState(16);
  const [charPx, setCharPx] = useState(9);

  const rem = (level) => t.base * t.ratio ** t.steps[level];
  const px = (level) => rem(level) * rootPx;

  useEffect(() => {
    const root = document.documentElement.style;
    LEVELS.forEach(({ id }) => {
      root.setProperty(`--ts-${id}`, `${(t.base * t.ratio ** t.steps[id]).toFixed(4)}rem`);
      root.setProperty(`--ts-${id}-lh`, String(t.leading[id]));
    });
    LEVELS.forEach(({ id }) => root.setProperty(`--ts-${id}-weight`, String(t.weight[id])));
    Object.entries(t.track).forEach(([id, v]) => root.setProperty(`--ts-${id}-track`, `${v}em`));
    Object.entries(t.wrap).forEach(([id, v]) => root.setProperty(`--ts-${id}-wrap`, v));
    root.setProperty("--ts-body-wordspace", `${t.wordSpace}em`);
    if (t.align) root.setProperty("--ts-body-align", t.align);
    else root.removeProperty("--ts-body-align");
    root.setProperty("--ns-measure", `${t.measure}rem`);
    root.setProperty("--ns-gap-sm", `${t.gapSm}rem`);
    root.setProperty("--ns-gap-lg", `${t.gapLg}rem`);
    try {
      localStorage.setItem(STORE, JSON.stringify(t));
    } catch {
      /* storage unavailable: values just won't persist */
    }
  }, [t]);

  const bodyPx = px("body");
  useEffect(() => {
    setRootPx(parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
    const measure = () => setCharPx(avgCharPx(bodyPx));
    measure();
    document.fonts?.ready.then(measure);
  }, [bodyPx]);

  // Guardrails
  const cpl = Math.round((t.measure * rootPx) / charPx);
  const warnings = [];
  const flag = (where, text) => warnings.push({ where, text });
  if (px("small") < MIN_PX) flag("small", `${px("small").toFixed(1)}px is under ${MIN_PX}px.`);
  if (px("medium") < 15) flag("medium", `${px("medium").toFixed(1)}px is small for several lines of card text.`);
  if (bodyPx < 16) flag("body", `${bodyPx.toFixed(1)}px. 16px or more reads best on screen.`);
  if (cpl > 75) flag("body", `~${cpl} characters a line. Over 75 gets tiring to read.`);
  if (cpl < 45) flag("body", `~${cpl} characters a line. Under 45 breaks too often.`);
  if (t.leading.body < 1.4) flag("body", "Leading under 1.4 feels cramped.");
  if (t.align !== "left" && cpl > 50)
    flag("body", "Most paragraphs are centered. Past a couple of lines, centered text makes each line's start hard to find.");
  if (t.wordSpace > 0.12) flag("body", "Wide word spacing opens gaps that run down the paragraph.");
  if (t.wordSpace < -0.03) flag("body", "Tight word spacing runs words together.");
  if (t.weight.body >= 600) flag("body", "Heavy body text gets dense and tiring over several lines.");
  ["h1", "h2", "h3"].forEach((id) => {
    if (t.track[id] > 0.05) flag(id, "Letterspacing mixed-case headlines pulls the words apart.");
  });
  const order = ["h1", "h2", "h3", "body", "medium", "small"];
  order.slice(0, -1).forEach((a, i) => {
    const b = order[i + 1];
    if (t.steps[a] <= t.steps[b]) {
      const msg = `${short(a)} isn't bigger than ${short(b)}: the hierarchy flips or flattens.`;
      flag(a, msg);
      flag(b, msg);
    }
  });
  if (t.gapSm * 2 > t.gapLg) flag("spacing", "Gaps inside groups are close to gaps between them, so groups won't separate.");
  const here = warnings.filter((w) => w.where === part);
  const elsewhere = [...new Set(warnings.filter((w) => w.where !== part).map((w) => short(w.where)))];

  const upd = (fn) => setT((s) => { const n = structuredClone(s); fn(n); return n; });

  const obj = (o) => "{ " + Object.entries(o).map(([k, v]) => `${k}: ${v}`).join(", ") + " }";
  const snippet =
    `// typeScale.js\nexport const SCALE = {\n  base: ${t.base},\n  ratio: ${t.ratio},\n` +
    `  steps: ${obj(t.steps)},\n  leading: ${obj(t.leading)},\n};\n` +
    `// weight ${obj(t.weight)}\n// letterspacing (em) ${obj(t.track)}\n// balance lines ${obj(t.wrap)}\n` +
    `// body: word spacing ${t.wordSpace}em · align ${t.align || "as designed"} · width ${t.measure}rem\n` +
    `// gaps ${t.gapSm}rem / ${t.gapLg}rem`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy these values:", snippet);
    }
  };

  const ui = { fontFamily: F.sans, fontSize: 13, color: C.navy };
  const btn = { ...ui, background: C.sand50, border: `1px solid ${C.navy}`, borderRadius: 6, padding: "6px 10px", cursor: "pointer", minHeight: 32 };
  const field = { ...ui, width: "100%", marginTop: 4, padding: "6px 8px", minHeight: 34, border: `1px solid ${C.navy}`, borderRadius: 6, background: C.sand50 };
  const heading = { display: "block", fontWeight: 700, marginTop: 14 };

  return (
    <aside role="region" aria-label="Type tuner" style={{
      position: "fixed", right: 16, bottom: 16, zIndex: 1000, width: open ? 330 : "auto",
      maxHeight: "calc(100vh - 32px)", overflowY: "auto", boxSizing: "border-box",
      background: C.white, border: `1px solid ${C.navy}`, borderRadius: 10,
      boxShadow: "0 12px 32px rgba(16,9,76,0.18)", padding: open ? 16 : 8, ...ui,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        {open && <strong style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>Type tuner</strong>}
        <button type="button" style={btn} aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? "Hide" : "Type tuner"}</button>
      </div>

      {open && (
        <>
          <span style={heading}>Scale</span>
          <Slider id="tt-base" label="Base size (body)" value={t.base} shown={`${Math.round(t.base * rootPx)}px`}
            min={0.875} max={1.375} step={0.0625} onChange={(v) => upd((n) => { n.base = v; })} />
          <label htmlFor="tt-ratio" style={{ display: "block", marginTop: 8 }}>Ratio</label>
          <select id="tt-ratio" style={field} value={t.ratio} onChange={(e) => upd((n) => { n.ratio = +e.target.value; })}>
            {RATIOS.map(([name, r]) => <option key={r} value={r}>{name} · {r}</option>)}
          </select>

          {/* The scale at a glance; the selected level is highlighted. */}
          <ol aria-label="Current scale" style={{ listStyle: "none", padding: 0, margin: "10px 0 0" }}>
            {LEVELS.map((l) => (
              <li key={l.id} style={{
                display: "flex", justifyContent: "space-between", padding: "3px 6px", borderRadius: 4,
                background: part === l.id ? C.lime100 : "transparent", fontVariantNumeric: "tabular-nums",
              }}>
                <span>{short(l.id)}</span>
                <span>step {t.steps[l.id]} · {px(l.id).toFixed(1)}px</span>
              </li>
            ))}
          </ol>

          <label htmlFor="tt-part" style={heading}>Working on</label>
          <select id="tt-part" style={field} value={part} onChange={(e) => setPart(e.target.value)}>
            {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            <option value="spacing">Spacing between blocks</option>
          </select>

          {part !== "spacing" && (
            <>
              <Slider id="tt-step" label="Step on the scale" value={t.steps[part]} shown={`${px(part).toFixed(1)}px`}
                min={-2} max={6} step={0.5} onChange={(v) => upd((n) => { n.steps[part] = v; })} />
              <Slider id="tt-lh" label="Leading" value={t.leading[part]} shown={t.leading[part].toFixed(2)}
                min={0.9} max={2} step={0.02} onChange={(v) => upd((n) => { n.leading[part] = v; })} />
              <label htmlFor="tt-weight" style={{ display: "block", marginTop: 8 }}>Weight</label>
              <select id="tt-weight" style={field} value={t.weight[part]} onChange={(e) => upd((n) => { n.weight[part] = +e.target.value; })}>
                {WEIGHTS[part].map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </>
          )}
          {["h1", "h2", "h3"].includes(part) && (
            <>
              <Slider id="tt-htrack" label="Letterspacing" value={t.track[part]} shown={`${t.track[part]}em`}
                min={-0.08} max={0.1} step={0.005} onChange={(v) => upd((n) => { n.track[part] = v; })} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, minHeight: 32 }}>
                <input type="checkbox" checked={t.wrap[part] === "balance"} style={{ accentColor: C.navy, width: 18, height: 18 }}
                  onChange={(e) => upd((n) => { n.wrap[part] = e.target.checked ? "balance" : "wrap"; })} />
                Balance line lengths when it wraps
              </label>
            </>
          )}
          {part === "small" && (
            <Slider id="tt-track" label="Letterspacing" value={t.track.small} shown={`${t.track.small}em`}
              min={0} max={0.2} step={0.005} onChange={(v) => upd((n) => { n.track.small = v; })} />
          )}
          {part === "body" && (
            <>
              <Slider id="tt-measure" label="Paragraph width" value={t.measure} shown={`${Math.round(t.measure * rootPx)}px`}
                min={25} max={70} step={0.5} onChange={(v) => upd((n) => { n.measure = v; })} />
              <p style={{ margin: "10px 0 0" }}><strong>~{cpl}</strong> characters per line (45–75 is comfortable)</p>
              <Slider id="tt-ws" label="Word spacing" value={t.wordSpace} shown={`${t.wordSpace}em`}
                min={-0.05} max={0.3} step={0.01} onChange={(v) => upd((n) => { n.wordSpace = v; })} />
              <label htmlFor="tt-align" style={{ display: "block", marginTop: 8 }}>Alignment</label>
              <select id="tt-align" style={field} value={t.align} onChange={(e) => upd((n) => { n.align = e.target.value; })}>
                <option value="">As designed (mostly centered)</option>
                <option value="left">Left</option>
                <option value="center">Center</option>
              </select>
            </>
          )}
          {part === "spacing" && (
            <>
              <Slider id="tt-gsm" label="Gap inside a group" value={t.gapSm} shown={`${Math.round(t.gapSm * rootPx)}px`}
                min={0} max={2} step={0.0625} onChange={(v) => upd((n) => { n.gapSm = v; })} />
              <Slider id="tt-glg" label="Gap between groups" value={t.gapLg} shown={`${Math.round(t.gapLg * rootPx)}px`}
                min={1} max={6} step={0.125} onChange={(v) => upd((n) => { n.gapLg = v; })} />
            </>
          )}

          <div aria-live="polite" style={{ marginTop: 10 }}>
            {here.length === 0 ? (
              <p style={{ margin: 0, color: C.forest100 }}>No readability flags here.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18, color: C.crimson100 }}>
                {here.map((w) => <li key={w.text} style={{ marginTop: 4 }}>{w.text}</li>)}
              </ul>
            )}
            {elsewhere.length > 0 && <p style={{ margin: "8px 0 0", color: C.crimson100 }}>Also flagged: {elsewhere.join(", ")}</p>}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button type="button" style={btn} onClick={copy}>{copied ? "Copied" : "Copy values"}</button>
            <button type="button" style={btn} onClick={() => setT(structuredClone(DEFAULTS))}>Reset</button>
          </div>
        </>
      )}
    </aside>
  );
}
