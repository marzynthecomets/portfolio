import { useEffect, useState } from "react";
import { C, F } from "./tnsShared.jsx";

// Type tuner: open any page with ?tune in the address (e.g. /?tune#/nutrition-source).
// Each slider sets a CSS variable on <html>; the page's type styles read those
// variables (with their shipped values as fallbacks), so the real page updates live.
// Visitors never see this unless the address contains ?tune.

export const tunerEnabled = () =>
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("tune");

const PARTS = [
  { id: "headline", label: "Insight headline" },
  { id: "heading", label: "Redesign heading" },
  { id: "body", label: "Body text" },
  { id: "eyebrow", label: "Eyebrow label" },
  { id: "spacing", label: "Spacing between blocks" },
];

const CONTROLS = [
  { part: "headline", v: "--ns-insight-size", label: "Size", min: 1.5, max: 3.5, step: 0.0625, def: 2.25, unit: "rem" },
  { part: "headline", v: "--ns-insight-lh", label: "Leading", min: 1, max: 1.6, step: 0.02, def: 1.22, unit: "" },
  { part: "heading", v: "--ns-sub-size", label: "Size", min: 1, max: 2.5, step: 0.0625, def: 1.5, unit: "rem" },
  { part: "heading", v: "--ns-sub-lh", label: "Leading", min: 1, max: 1.6, step: 0.02, def: 1.25, unit: "" },
  { part: "body", v: "--ns-body-size", label: "Size", min: 0.75, max: 1.5, step: 0.0625, def: 1.125, unit: "rem" },
  { part: "body", v: "--ns-body-lh", label: "Leading", min: 1.1, max: 2, step: 0.02, def: 1.44, unit: "" },
  { part: "body", v: "--ns-measure", label: "Paragraph width", min: 25, max: 70, step: 0.5, def: 45, unit: "rem" },
  { part: "eyebrow", v: "--ns-eyebrow-size", label: "Size", min: 0.625, max: 1.25, step: 0.03125, def: 0.875, unit: "rem" },
  { part: "eyebrow", v: "--ns-eyebrow-track", label: "Letterspacing", min: 0, max: 0.2, step: 0.005, def: 0.08, unit: "em" },
  { part: "spacing", v: "--ns-gap-sm", label: "Gap inside a group", min: 0, max: 2, step: 0.0625, def: 0.8125, unit: "rem" },
  { part: "spacing", v: "--ns-gap-lg", label: "Gap between groups", min: 1, max: 6, step: 0.125, def: 3.25, unit: "rem" },
];
const DEFAULTS = Object.fromEntries(CONTROLS.map((c) => [c.v, c.def]));
const STORE = "type-tuner-values";
const MIN_PX = 14;

const load = () => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORE) || "{}") };
  } catch {
    return { ...DEFAULTS };
  }
};

// Average character width of body text, measured with the real font.
function avgCharPx(bodyPx) {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = `400 ${bodyPx}px 'DM Sans', sans-serif`;
  const sample =
    "Since the Nutrition Source truly has so much educational content, giving an overview of common nutrition questions";
  return ctx.measureText(sample).width / sample.length;
}

export default function TypeTuner() {
  const [vals, setVals] = useState(load);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [rootPx, setRootPx] = useState(16);
  const [charPx, setCharPx] = useState(9);

  const bodyPx = vals["--ns-body-size"] * rootPx;

  useEffect(() => {
    const root = document.documentElement;
    CONTROLS.forEach((c) => root.style.setProperty(c.v, vals[c.v] + c.unit));
    try {
      localStorage.setItem(STORE, JSON.stringify(vals));
    } catch {
      /* storage unavailable: values just won't persist */
    }
  }, [vals]);

  useEffect(() => {
    setRootPx(parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
    const measure = () => setCharPx(avgCharPx(bodyPx));
    measure();
    document.fonts?.ready.then(measure);
  }, [bodyPx]);

  // Guardrails
  const px = (v) => vals[v] * rootPx;
  const cpl = Math.round(px("--ns-measure") / charPx);
  const warnings = [];
  const flag = (part, text) => warnings.push({ part, text });
  if (px("--ns-eyebrow-size") < MIN_PX) flag("eyebrow", `Size is ${px("--ns-eyebrow-size").toFixed(1)}px, under ${MIN_PX}px.`);
  if (bodyPx < 16) flag("body", `Size is ${bodyPx.toFixed(1)}px. 16px or more reads best on screen.`);
  if (cpl > 75) flag("body", `Paragraphs run ~${cpl} characters a line. Over 75 gets tiring to read.`);
  if (cpl < 45) flag("body", `Paragraphs run ~${cpl} characters a line. Under 45 breaks too often.`);
  if (vals["--ns-body-lh"] < 1.4) flag("body", "Leading under 1.4 feels cramped at this size.");
  if (px("--ns-sub-size") >= px("--ns-insight-size") * 0.9) {
    flag("headline", "Nearly the same size as the redesign heading: the two levels blur.");
    flag("heading", "Nearly as big as the insight headline: the two levels blur.");
  }
  if (px("--ns-sub-size") <= bodyPx * 1.1) {
    flag("heading", "Barely bigger than body text.");
    flag("body", "Nearly as big as the redesign heading.");
  }
  if (vals["--ns-gap-sm"] * 2 > vals["--ns-gap-lg"]) flag("spacing", "Gaps inside groups are close to gaps between them, so groups won't separate.");
  const [part, setPart] = useState("headline");
  const here = warnings.filter((w) => w.part === part);
  const elsewhere = [...new Set(warnings.filter((w) => w.part !== part).map((w) => PARTS.find((p) => p.id === w.part).label))];

  const set = (v, n) => setVals((s) => ({ ...s, [v]: n }));
  const css = ":root {\n" + CONTROLS.map((c) => `  ${c.v}: ${vals[c.v]}${c.unit};`).join("\n") + "\n}";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy these values:", css);
    }
  };

  const ui = { fontFamily: F.sans, fontSize: 13, color: C.navy };
  const btn = {
    ...ui, background: C.sand50, border: `1px solid ${C.navy}`, borderRadius: 6,
    padding: "6px 10px", cursor: "pointer", minHeight: 32,
  };

  return (
    <aside
      role="region"
      aria-label="Type tuner"
      style={{
        position: "fixed", right: 16, bottom: 16, zIndex: 1000, width: open ? 330 : "auto",
        maxHeight: "calc(100vh - 32px)", overflowY: "auto", boxSizing: "border-box",
        background: C.white, border: `1px solid ${C.navy}`, borderRadius: 10,
        boxShadow: "0 12px 32px rgba(16,9,76,0.18)", padding: open ? 16 : 8, ...ui,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        {open && <strong style={{ fontFamily: F.mono, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>Type tuner</strong>}
        <button type="button" style={btn} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Hide" : "Type tuner"}
        </button>
      </div>

      {open && (
        <>
          <label htmlFor="tt-part" style={{ display: "block", fontWeight: 700, marginTop: 14 }}>Working on</label>
          <select
            id="tt-part" value={part} onChange={(e) => setPart(e.target.value)}
            style={{ ...ui, width: "100%", marginTop: 4, padding: "6px 8px", minHeight: 34, border: `1px solid ${C.navy}`, borderRadius: 6, background: C.sand50 }}
          >
            {PARTS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>

          <div style={{ marginTop: 6 }}>
            {CONTROLS.filter((c) => c.part === part).map((c) => {
              const id = "tt" + c.v;
              const shown = c.unit === "rem" ? `${Math.round(vals[c.v] * rootPx)}px` : `${vals[c.v]}${c.unit}`;
              return (
                <div key={c.v} style={{ display: "grid", gridTemplateColumns: "1fr 56px", alignItems: "center", columnGap: 8, marginTop: 8 }}>
                  <label htmlFor={id}>{c.label}</label>
                  <output htmlFor={id} style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{shown}</output>
                  <input
                    id={id} type="range" min={c.min} max={c.max} step={c.step} value={vals[c.v]}
                    onChange={(e) => set(c.v, +e.target.value)}
                    style={{ gridColumn: "1 / -1", width: "100%", accentColor: C.navy, margin: "2px 0 0" }}
                  />
                </div>
              );
            })}
          </div>

          {part === "body" && (
            <p style={{ margin: "12px 0 0" }}>
              <strong>~{cpl}</strong> characters per line (45–75 is comfortable)
            </p>
          )}
          <div aria-live="polite" style={{ marginTop: 10 }}>
            {here.length === 0 ? (
              <p style={{ margin: 0, color: C.forest100 }}>No readability flags here.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18, color: C.crimson100 }}>
                {here.map((w) => <li key={w.text} style={{ marginTop: 4 }}>{w.text}</li>)}
              </ul>
            )}
            {elsewhere.length > 0 && (
              <p style={{ margin: "8px 0 0", color: C.crimson100 }}>Also flagged: {elsewhere.join(", ")}</p>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button type="button" style={btn} onClick={copy}>{copied ? "Copied" : "Copy values"}</button>
            <button type="button" style={btn} onClick={() => setVals({ ...DEFAULTS })}>Reset</button>
          </div>
        </>
      )}
    </aside>
  );
}
