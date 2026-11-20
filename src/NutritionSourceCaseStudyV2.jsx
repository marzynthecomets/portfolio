import { tsSize, tsLead } from "./typeScale.js";
import { useRef, useState } from "react";
import {
  C, F, A, DM_SANS_OPSZ, NUNITO_VAR, useIsMobile, usePrefersReducedMotion, ScaleBox,
  PLATE_PORTIONS, PLATE_KEYFRAMES, PlateContent,
} from "./tnsShared.jsx";
import HepRedesign from "./HepRedesign.jsx";
import HomepageRedesign from "./HomepageRedesign.jsx";
import RecipesRedesign from "./RecipesRedesign.jsx";
import SiteNav from "./SiteNav.jsx";

// Reskinned Nutrition Source case study.
// Source: Figma file "wippy", frame New_NutritionSource_CaseStudy (node 1:21).
/* ---------- Type helpers ---------- */
// Type: every size is a step on the scale in typeScale.js.
// DM Sans everywhere, except eyebrows and card headers (H3): all-caps DM Mono.
const eyebrow = (color = C.navy) => ({
  margin: 0,
  fontFamily: F.mono,
  fontWeight: "var(--ts-small-weight, 400)",
  fontSize: tsSize("small"),
  lineHeight: 0.984,
  letterSpacing: "var(--ts-small-track, 0.13em)", // letterspace all-caps ~5–10% of type size
  textTransform: "uppercase",
  color,
});
// Section headlines; insights and redesigns share this level (problem / answer).
const h2 = (isMobile, color = C.navy) => ({
  margin: 0,
  fontFamily: F.sans,
  fontWeight: "var(--ts-h2-weight, 400)",
  fontSize: tsSize("h2", isMobile),
  lineHeight: tsLead("h2"),
  letterSpacing: "var(--ts-h2-track, 0.03em)",
  textWrap: "var(--ts-h2-wrap, balance)",
  color,
});
const h2Insight = h2;
const h3 = (isMobile, color = C.navy) => ({
  margin: 0,
  fontFamily: F.mono,
  fontWeight: "var(--ts-h3-weight, 400)",
  fontSize: tsSize("h3", isMobile),
  lineHeight: tsLead("h3"),
  letterSpacing: "var(--ts-h3-track, 0.1em)", // all caps: letterspace ~5–10%
  textTransform: "uppercase",
  textWrap: "var(--ts-h3-wrap, balance)",
  color,
});
const pLarge = (isMobile, color = C.navy) => ({
  margin: 0,
  fontFamily: F.sans,
  fontWeight: "var(--ts-body-weight, 400)",
  fontSize: tsSize("body", isMobile),
  lineHeight: tsLead("body"),
  wordSpacing: "var(--ts-body-wordspace, -0.01em)",
  // Unset unless the tuner sets it, so each paragraph keeps its section's alignment.
  textAlign: "var(--ts-body-align)",
  // One measure for all body text: a ceiling, so paragraphs in narrower columns keep their column width.
  maxWidth: "var(--ns-measure, 44.5rem)",
  textWrap: "pretty",
  color,
  ...DM_SANS_OPSZ,
});
// Body medium: card text (stat cards, need cards). Quote bubbles stay body large.
const pMedium = (isMobile, color = C.navy) => ({
  ...pLarge(isMobile, color),
  fontWeight: "var(--ts-medium-weight, 400)",
  fontSize: tsSize("medium", isMobile),
  lineHeight: tsLead("medium"),
});

const sectionPad = (isMobile, desktop) => (isMobile ? "48px 20px" : desktop);

function PlateHero() {
  const reducedMotion = usePrefersReducedMotion();
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  // Hovering previews a section; clicking pins it open until clicked again.
  const active = hovered || selected;
  const autoplay = !active && !reducedMotion;

  const onSelect = (key) => setSelected((cur) => (cur === key ? null : key));

  return (
    <section
      aria-label="The Healthy Eating Plate"
      style={{ display: "flex", justifyContent: "center", background: C.sand50, padding: "0 0" }}
    >
      <style>{PLATE_KEYFRAMES}</style>
      <ScaleBox width={1146} height={545.146}>
        <div style={{ position: "relative", width: 1146, height: 545.146, background: C.plateBg, overflow: "hidden" }}>
          {/* Base layer: the clickable plate. */}
          <PlateContent activeKey={active} interactive onSelect={onSelect} onHover={setHovered} />
          {/* Autoplay layers, one per portion, faded on the Figma timeline. */}
          {autoplay &&
            PLATE_PORTIONS.map((p, i) => (
              <div
                key={p.key}
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: C.plateBg,
                  opacity: 0,
                  pointerEvents: "none",
                  animation: `tnsPlate${i} 20s infinite`,
                }}
              >
                <PlateContent activeKey={p.key} interactive={false} />
              </div>
            ))}
        </div>
      </ScaleBox>
    </section>
  );
}

/* ---------- Live demos ---------- */
// Each live redesign is a whole fake Harvard page. To a screen reader it's
// labelled as one region inside this page, with a way to jump past it.
function LiveDemo({ id, label, children }) {
  const end = useRef(null);
  return (
    <section aria-label={label} style={{ position: "relative" }}>
      <button type="button" className="skip-demo" onClick={() => end.current && end.current.focus()}>
        Skip past this demo
      </button>
      {children}
      <span ref={end} id={`${id}-end`} tabIndex={-1} className="sr-only">
        End of {label.toLowerCase()}
      </span>
    </section>
  );
}

/* ---------- Intro ---------- */
// Figma 163:13067: title band above the plate.
function TitleBand({ isMobile }) {
  return (
    <section
      style={{
        background: C.navy,
        padding: isMobile ? "32px 20px" : "40px 120px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <p style={eyebrow(C.lime100)}>From Harvard to the Grocery Aisle</p>
      <h1
        style={{
          margin: 0,
          fontFamily: F.sans,
          fontWeight: "var(--ts-h1-weight, 400)",
          fontSize: tsSize("h1", isMobile),
          lineHeight: tsLead("h1"),
          letterSpacing: "var(--ts-h1-track, 0.03em)",
          textWrap: "var(--ts-h1-wrap, wrap)",
          color: C.white,
        }}
      >
        Making Nutrition Research Digestible
      </h1>
    </section>
  );
}

// Figma 15:533: project and team, below the plate.
function ProjectBand({ isMobile }) {
  return (
    <section style={{ background: C.lime100, padding: sectionPad(isMobile, "60px 120px"), display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 32 : 128,
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: isMobile ? "100%" : 587 }}>
          <p style={eyebrow(C.navy)}>The project</p>
          <p style={pLarge(isMobile, C.navy)}>
            A usability analysis and speculative redesign of the Harvard Nutrition Source, an educational website about
            nutrition and healthy eating.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: isMobile ? "100%" : 489 }}>
          <p style={eyebrow(C.navy)}>The team</p>
          <p style={pLarge(isMobile, C.navy)}>Mars Nevada, Xinyu Wang, Mai Amit</p>
          <p style={pLarge(isMobile, C.navy)}>All team members contributed to both research and design.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- The Nutrition Source ---------- */
function CroppedImg({ src, box, crop, alt = "" }) {
  // box: rendered frame size; crop: Figma's percentage placement of the image.
  return (
    <div style={{ position: "relative", width: box.width, height: box.height, flexShrink: 0, maxWidth: "100%" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <img
          alt={alt}
          src={src}
          style={{ position: "absolute", maxWidth: "none", ...crop }}
        />
      </div>
    </div>
  );
}

function AboutTNS({ isMobile }) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 24 : 64,
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "48px 20px 12px" : "60px 120px 20px",
      }}
    >
      <CroppedImg
        src={A.inkPlate}
        box={{ width: 242, height: 218 }}
        crop={{ width: "183.18%", height: "203.17%", left: "-42.93%", top: "-50.4%" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: isMobile ? "100%" : 690 }}>
        <h2
          style={{
            margin: 0,
            fontFamily: F.sans,
            fontWeight: "var(--ts-h2-weight, 400)",
            fontSize: tsSize("h2", isMobile),
            lineHeight: tsLead("h2"),
            letterSpacing: "var(--ts-h2-track, 0.03em)",
            textWrap: "var(--ts-h2-wrap, balance)",
            color: C.navy,
          }}
        >
          The Nutrition Source
        </h2>
        <p style={pLarge(isMobile)}>
          Created by Harvard, the Nutrition Source provides free, research-backed information about nutrition, recipes
          created with researchers, and news articles addressing misinformation and news on the latest in the field.
        </p>
      </div>
    </section>
  );
}

const STATS = [
  {
    title: "129 million",
    body: "Americans have preventable chronic diseases which are often related to diet and physical inactivity. Nutrition can also have a protective effect on health. - ",
    source: { label: "NIH", href: "https://www.niehs.nih.gov/health/topics/nutrition", underline: false },
  },
  {
    title: "Less than 1 in 10",
    body: "children and adults eat their recommended vegetables, increasing the risk of diseases like obesity, depression, type 2 diabetes, heart disease, and some cancers - ",
    source: { label: "CDC", href: "https://www.cdc.gov/cdi/indicator-definitions/npao.html", underline: true },
  },
  {
    title: "Disinformation about nutrition",
    body: "is rampant online, especially on social media. Most online sources of nutrition information are inaccurate or of low quality. - ",
    source: { label: "PHN", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10346027/", underline: true },
  },
];

// Brushed outlines, exported from the Figma frames as artwork and applied with
// border-image: the image is sliced into nine pieces, so the drawn corners keep
// their shape and the edges stretch to any size.
const brushBorder = (file, slice) => ({
  borderStyle: "solid",
  borderColor: "transparent",
  borderWidth: slice,
  borderImageSource: `url(/tns/v2/${file})`,
  borderImageSlice: slice,
  borderImageWidth: `${slice}px`,
  borderImageRepeat: "stretch",
});

// Cards: the outline sits under the text, so it can be the card's own border.
const BRUSH_FRAME = { ...brushBorder("stat-card-brush.svg", 32), borderWidth: 3 }; // Frame 246, 43:161
const NEEDS_BRUSH = { ...brushBorder("needs-card-brush.svg", 28), borderWidth: 3 }; // 110:12188

// Image frames: in Figma the brush is painted on top of the picture, and a
// border-image would draw under it, so these lie over the frame. `bleed` is
// how far the drawn stroke reaches past the frame in the export [t, r, b, l].
function BrushOverlay({ file, slice, bleed }) {
  const [t, r, b, l] = bleed;
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        top: -t,
        right: -r,
        bottom: -b,
        left: -l,
        pointerEvents: "none",
        zIndex: 2,
        ...brushBorder(file, slice),
      }}
    />
  );
}

function WhyItMatters({ isMobile }) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: isMobile ? "24px 20px 48px" : "40px 120px 80px",
      }}
    >
      <p style={{ ...eyebrow(), textAlign: "center" }}>Why it matters</p>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 24, alignItems: "stretch" }}>
        {STATS.map((s) => (
          <div
            key={s.title}
            style={{
              flex: "1 0 0",
              minWidth: 0,
              background: C.sand50,
              ...BRUSH_FRAME,
              padding: isMobile ? "28px 24px" : "42px 35px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              color: C.navy,
            }}
          >
            <p style={h3(isMobile)}>
              {s.title}
            </p>
            <p style={pMedium(isMobile)}>
              {s.body}
              <a
                href={s.source.href}
                target="_blank"
                rel="noreferrer"
                style={{ color: "inherit", textDecoration: s.source.underline ? "underline" : "none" }}
              >
                {s.source.label}
              </a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- What did testers say? ---------- */
const QUOTES = [
  { text: "“It looks like a textbook.” - P4", box: { w: 234, h: 131 }, bubble: 0, text_pos: { left: 33, top: 27, width: 180 }, inset: [-1.45, -1.12, -1, -1] },
  { text: "“[...] it feels like a library website.” - P2", box: { w: 201, h: 167 }, bubble: 1, text_pos: { left: 28, top: 27, width: 156 }, inset: [-1.48, -1.27, 0, -0.78] },
  { text: "“It definitely feels like an encyclopedia.” - P3", box: { w: 313, h: 131 }, bubble: 2, text_pos: { left: 32, top: 27, width: 259 }, inset: [-2.34, -0.98, -1.05, -1.28] },
];

function QuoteBubble({ q }) {
  const [t, r, b, l] = q.inset;
  return (
    <figure style={{ position: "relative", width: q.box.w, height: q.box.h, margin: 0, flexShrink: 0 }}>
      <div style={{ position: "absolute", top: `${t}%`, right: `${r}%`, bottom: `${b}%`, left: `${l}%` }}>
        <img alt="" src={A.bubbles[q.bubble]} style={{ display: "block", width: "100%", height: "100%", maxWidth: "none" }} />
      </div>
      <blockquote
        style={{
          position: "absolute",
          margin: 0,
          ...q.text_pos,
          ...pLarge(false),
        }}
      >
        {q.text}
      </blockquote>
    </figure>
  );
}

function TestersSay({ isMobile }) {
  return (
    <section
      style={{
        background: C.sand100,
        padding: sectionPad(isMobile, "80px 120px"),
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 40 : 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 40,
          alignItems: isMobile ? "center" : "flex-start",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: isMobile ? "100%" : 587 }}>
          <h2 style={h2(isMobile)}>What did testers say?</h2>
          <p style={pLarge(isMobile)}>
            Accurate nutrition information is only as good as it is discoverable and digestible to everyday people. So
            we asked them.
          </p>
          <p style={pLarge(isMobile)}>
            We conducted qualitative interviews with participants in which they explored the website without guidance
            and we learned how they approach their own nutrition habits and information-seeking.
          </p>
        </div>
        <CroppedImg
          src={A.inkInterview}
          box={{ width: 369, height: 218 }}
          crop={{ width: "257.46%", height: "435.8%", left: "-72.04%", top: "-155.34%" }}
        />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 40 : 128, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: "100%" }}>
          <p style={{ ...eyebrow(), width: isMobile ? "auto" : 486 }}>
            Original (and{" "}
            <a href="https://nutritionsource.hsph.harvard.edu/" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
              current
            </a>{" "}
            design):
          </p>
          <a
            href="https://nutritionsource.hsph.harvard.edu/"
            target="_blank"
            rel="noreferrer"
            aria-label="The current Nutrition Source homepage (opens in a new tab)"
            style={{ display: "block", position: "relative", width: 486, maxWidth: "100%", aspectRatio: "486 / 313" }}
          >
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: C.white }}>
              <img
                alt="Screenshot of the original Nutrition Source homepage"
                src={A.originalScreencap}
                style={{ position: "absolute", left: 0.5, top: 0.5, width: "calc(100% - 1px)", aspectRatio: "485 / 742", border: `1px solid ${C.navy}`, boxSizing: "content-box", maxWidth: "none" }}
              />
            </div>
            {/* 43:266 */}
            <BrushOverlay file="screencap-frame-brush.svg" slice={12} bleed={[3, 2.096, 2, 0.904]} />
          </a>
        </div>
        <div style={{ flex: "1 0 0", minWidth: isMobile ? "100%" : 0, display: "flex", flexDirection: "column", gap: 24 }}>
          <p style={eyebrow()}>What participants said about the site:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 16 : 46 }}>
              <QuoteBubble q={QUOTES[0]} />
              <QuoteBubble q={QUOTES[1]} />
            </div>
            <QuoteBubble q={QUOTES[2]} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Insight 1 ---------- */
function InsightOne({ isMobile }) {
  return (
    <section
      style={{
        padding: sectionPad(isMobile, "78px 120px var(--ns-gap-lg, 6rem)"),
        display: "flex",
        flexDirection: "column",
        gap: "var(--ns-gap-sm, 0.75rem)",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <p style={eyebrow()}>Insight 1</p>
      <h2 style={h2Insight(isMobile)}>“I feel like real people don’t use this website.” - P7</h2>
      <p style={pLarge(isMobile)}>
        People felt like they were walking into an academic library and struggled to know where to start.
      </p>
      <img
        alt="Hand-drawn figure standing between towering library shelves"
        src={A.inkLibrary}
        style={{ width: 566, maxWidth: "100%", aspectRatio: "566 / 301.064", objectFit: "cover", display: "block" }}
      />
      <p style={{ ...pLarge(isMobile), fontWeight: 500, fontStyle: "italic" }}>Because nutrition isn’t academic. It’s personal.</p>
    </section>
  );
}

/* ---------- Before / after toggle ---------- */
function BeforeAfterToggle({ labels, value, onChange, isMobile }) {
  const seg = (side) => {
    const active = value === side;
    const isLeft = side === "before";
    return {
      background: active ? C.lime100 : C.sand50,
      // As in Figma: the left segment has no right border; the right one is fully outlined.
      border: `0.724px solid ${C.navy}`,
      borderRight: isLeft ? "none" : `0.724px solid ${C.navy}`,
      borderRadius: isLeft ? "72.361px 0 0 72.361px" : "0 72.361px 72.361px 0",
      padding: isMobile
        ? isLeft ? "12px 8px 12px 16px" : "12px 16px 12px 8px"
        : isLeft ? "18.09px 11.578px 18.09px 26.05px" : "18.09px 26.05px 18.09px 11.578px",
      fontFamily: F.sans,
      fontWeight: active ? 600 : 400,
      fontSize: tsSize("small", isMobile),
      letterSpacing: "var(--ts-small-track, 0.13em)",
      lineHeight: 0.984,
      textTransform: "uppercase",
      color: C.navy,
      cursor: active ? "default" : "pointer",
      whiteSpace: "nowrap",
    };
  };
  return (
    <div role="group" aria-label="Before and after" style={{ display: "flex", alignItems: "center" }}>
      <button type="button" aria-pressed={value === "before"} onClick={() => onChange("before")} style={seg("before")}>
        {labels[0]}
      </button>
      <button type="button" aria-pressed={value === "after"} onClick={() => onChange("after")} style={seg("after")}>
        {labels[1]}
      </button>
    </div>
  );
}

function HomepageSection({ isMobile }) {
  const [view, setView] = useState("after");
  return (
    <section
      style={{
        padding: isMobile ? "0 20px 48px" : "26px 120px 78px",
        display: "flex",
        flexDirection: "column",
        gap: "var(--ns-gap-lg, 6rem)",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--ns-gap-sm, 0.75rem)", alignItems: "center", textAlign: "center", maxWidth: 1040 }}>
        <p style={eyebrow(C.navy)}>Homepage redesign</p>
        <h2 style={h2Insight(isMobile)}>We started with making a clear starting point.</h2>
        <p style={{ ...pLarge(isMobile, C.navy) }}>
          Since the Nutrition Source truly has so much educational content, giving an overview of common nutrition
          questions, popular content, as well as a search bar, helps reduce the cognitive overload of a large content
          library.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", width: "100%", maxWidth: 1042 }}>
        <BeforeAfterToggle labels={["Homepage Before", "Homepage after"]} value={view} onChange={setView} isMobile={isMobile} />
        <div style={{ position: "relative", width: "100%" }}>
          <div style={{ width: "100%", background: C.white, overflow: "hidden" }}>
            <div style={{ aspectRatio: "1042 / 645.461", overflowY: "auto" }}>
              {view === "after" ? (
                <LiveDemo id="homepage-demo" label="Live demo: homepage redesign">
                  <ScaleBox width={1440}>
                    <HomepageRedesign />
                  </ScaleBox>
                </LiveDemo>
              ) : (
                <img alt="The original Nutrition Source homepage" src={A.homepageBefore} style={{ width: "100%", display: "block" }} />
              )}
            </div>
          </div>
          {/* HomepageChange, 110:11418 */}
          <BrushOverlay file="homepage-frame-brush.svg" slice={20} bleed={[5.968, 7.129, 6.571, 5.871]} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Insight 2 ---------- */
const NEEDS = [
  {
    title: "Time",
    body: "Participants just felt they didn’t have time to shop or cook healthy foods.",
    img: A.inkClock,
    frame: { width: 145.701, height: 145.701 },
    box: { width: 145.701, height: 145.701, top: 0, left: 0 },
    crop: { width: "170.18%", height: "170.18%", left: "-35.09%", top: "-35.09%" },
  },
  {
    title: "Cost",
    body: "Participants felt overwhelmed by the cost of groceries and fresh produce.",
    img: A.inkDollar,
    frame: { width: 185, height: 145.7 },
    box: { width: 185, height: 143, top: 0, left: 0 },
    crop: { width: "132.76%", height: "129.37%", left: "-16.17%", top: "-11.38%" },
  },
  {
    title: "Loved Ones",
    body: "Participants have to consider what their loved ones want to eat and their dietary needs.",
    img: A.inkFamily,
    frame: { width: 185, height: 145.7 },
    box: { width: 185, height: 124, top: 10.7, left: 0 },
    crop: { width: "100.32%", height: "127.42%", left: "0.38%", top: "-15.65%" },
  },
  {
    title: "Store Struggles",
    body: "Participants have to take time to cross-check the ingredients for additives.",
    img: A.inkCart,
    frame: { width: 163.433, height: 146 },
    box: { width: 163.433, height: 146, top: 0, left: 0 },
    crop: { width: "168.88%", height: "189.04%", left: "-34.44%", top: "-46.01%" },
  },
];

function InsightTwo({ isMobile }) {
  return (
    <section
      style={{
        padding: sectionPad(isMobile, "78px 120px var(--ns-gap-lg, 6rem)"),
        display: "flex",
        flexDirection: "column",
        gap: "var(--ns-gap-lg, 6rem)",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--ns-gap-sm, 0.75rem)",
          alignItems: "center",
          textAlign: "center",
          padding: isMobile ? 0 : "0 156px",
          color: C.navy,
        }}
      >
        <p style={eyebrow()}>Insight 2</p>
        <h2 style={h2Insight(isMobile)}>No one’s nutritional needs are the same, because their lives aren’t the same.</h2>
        <p style={{ ...pLarge(isMobile) }}>
          In our interviews, people said there’s what they <em>should</em> eat, and what they <em>actually</em> end up
          eating, because of life. Well, specifically because of:
        </p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 26, alignItems: "stretch" }}>
        {NEEDS.map((n) => (
          <div
            key={n.title}
            style={{
              position: "relative",
              width: 246,
              boxSizing: "border-box",
              ...NEEDS_BRUSH,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 13,
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ position: "relative", ...n.frame, flexShrink: 0 }}>
              <div style={{ position: "absolute", ...n.box, overflow: "hidden" }}>
                <img alt="" src={n.img} style={{ position: "absolute", maxWidth: "none", ...n.crop }} />
              </div>
            </div>
            <h3 style={h3(isMobile)}>
              {n.title}
            </h3>
            <p style={pMedium(isMobile)}>{n.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Healthy Eating Plate redesign ---------- */
function PlateRedesign({ isMobile }) {
  const [view, setView] = useState("after");
  return (
    <section
      style={{
        padding: sectionPad(isMobile, "26px 120px 78px"),
        display: "flex",
        flexDirection: "column",
        gap: "var(--ns-gap-lg, 6rem)",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--ns-gap-sm, 0.75rem)", alignItems: "center", textAlign: "center", width: "100%" }}>
        <p style={eyebrow(C.navy)}>Healthy Eating Plate page redesign</p>
        <h2 style={h2Insight(isMobile)}>Personalizing the Plate</h2>
        <p style={{ ...pLarge(isMobile, C.navy) }}>
          The Healthy Eating Plate is Harvard’s guidelines to healthy portions. But they’re broad guidelines that don’t
          account for people’s individual needs. So I designed an interactive Healthy Eating Plate.
        </p>
        <p style={eyebrow(C.navy)}>Solo design work on team project</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 39, alignItems: "center", width: "100%", maxWidth: 1042 }}>
        <BeforeAfterToggle labels={["Plate Before", "Plate After"]} value={view} onChange={setView} isMobile={isMobile} />
        <div style={{ position: "relative", width: "100%" }}>
        {/* Frame 339, 155:12480 */}
        <BrushOverlay file="plate-frame-brush.svg" slice={16} bleed={[3.822, 5.256, 6.178, 3.744]} />
        <div
          style={{
            width: "100%",
            aspectRatio: "1042 / 1491",
            position: "relative",
            overflowY: view === "after" ? "auto" : "hidden",
            background: C.white,
          }}
        >
          {view === "before" ? (
            <img
              alt="The original Healthy Eating Plate page"
              src={A.hepBefore}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <LiveDemo id="plate-demo" label="Live demo: Healthy Eating Plate page redesign">
              <ScaleBox width={1440}>
                <HepRedesign />
              </ScaleBox>
            </LiveDemo>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Insight 3 (165:16434) ---------- */
function InsightThree({ isMobile }) {
  return (
    <section style={{ padding: sectionPad(isMobile, "78px 120px var(--ns-gap-lg, 6rem)"), display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 24 : 46,
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          role="img"
          aria-label="Ink drawing of two eyes peering over an open cookbook, with a question mark"
          style={{ position: "relative", width: 428, maxWidth: "100%", aspectRatio: "428 / 191.884", overflow: "hidden", flexShrink: 0 }}
        >
          <img
            alt=""
            src="/tns/v2/insight-eyes.png"
            style={{ position: "absolute", maxWidth: "none", width: "221.28%", height: "276.61%", left: "-58.36%", top: "-92.88%" }}
          />
        </div>
        <div style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: "var(--ns-gap-sm, 0.75rem)", color: C.navy, textAlign: isMobile ? "center" : "left" }}>
          <p style={eyebrow()}>Insight 3</p>
          <h2 style={h2Insight(isMobile)}>People want actionable content, like recipes, but they need to be able to find them easily.</h2>
        </div>
      </div>
    </section>
  );
}

/* ---------- Recipe page redesign (165:16852) ---------- */
function RecipeRedesign({ isMobile }) {
  const [view, setView] = useState("after");
  return (
    <section
      style={{
        padding: sectionPad(isMobile, "26px 120px 78px"),
        display: "flex",
        flexDirection: "column",
        gap: "var(--ns-gap-lg, 6rem)",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--ns-gap-sm, 0.75rem)", alignItems: "center", textAlign: "center", width: "100%" }}>
        <p style={eyebrow(C.navy)}>Recipe page redesign</p>
        <h2 style={h2Insight(isMobile)}>Making recipes findable</h2>
        <p style={{ ...pLarge(isMobile, C.navy) }}>
          The existing recipe page was essentially a bulleted text list, but participants told us they relied heavily on
          images to choose what appealed to them, and wanted to be able to filter and search to find recipes quickly. I
          also included quick filter tags for things like “Quick and easy” or high-protein recipes.
        </p>
        <p style={eyebrow(C.navy)}>Solo design work on team project</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 39, alignItems: "center", width: "100%", maxWidth: 1042 }}>
        <BeforeAfterToggle labels={["Recipes Before", "Recipes After"]} value={view} onChange={setView} isMobile={isMobile} />
        <div style={{ position: "relative", width: "100%" }}>
          <BrushOverlay file="plate-frame-brush.svg" slice={16} bleed={[3.822, 5.256, 6.178, 3.744]} />
          <div style={{ width: "100%", aspectRatio: "1042 / 1491", position: "relative", overflowY: "auto", background: C.white }}>
            {view === "before" ? (
              <img
                alt="The original Nutrition Source recipes page: a long text list of recipe links"
                src="/tns/v2/recipes-before.jpg"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            ) : (
              <LiveDemo id="recipes-demo" label="Live demo: recipes page redesign">
                <ScaleBox width={1440}>
                  <RecipesRedesign />
                </ScaleBox>
              </LiveDemo>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Information architecture ---------- */
function InformationArchitecture({ isMobile }) {
  const reduced = usePrefersReducedMotion();
  return (
    <section style={{ background: C.sand100, display: "flex", flexDirection: "column", gap: isMobile ? 32 : 48, alignItems: "center", padding: isMobile ? "48px 0" : "80px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", textAlign: "center", padding: isMobile ? "0 20px" : "0 165px" }}>
        <p style={eyebrow()}>Information architecture &amp; site navigation</p>
        <h2 style={h2Insight(isMobile)}>
          We also conducted card-sorting and tree testing studies to help reorganize the navigation and relabel pages for
          clarity.
        </h2>
      </div>
      <div style={{ width: "100%", boxSizing: "border-box", padding: isMobile ? "0 20px" : "0 160px" }}>
        <video
          src="/tns/v2/ia-changes.mp4"
          poster="/tns/v2/ia-changes-poster.jpg"
          controls
          muted
          loop
          playsInline
          autoPlay={!reduced}
          preload="metadata"
          aria-label="Animation: restructuring The Nutrition Source navigation after card sorting and tree testing"
          style={{ display: "block", width: "100%", aspectRatio: "16 / 9", background: C.sand50, border: "1px solid rgba(16,9,76,0.15)", borderRadius: 4 }}
        />
      </div>
    </section>
  );
}

/* ---------- Conclusion (168:20729) ---------- */
function Conclusion({ isMobile }) {
  return (
    <section style={{ background: C.sand50, padding: sectionPad(isMobile, "80px 120px"), display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
          textAlign: "center",
          padding: isMobile ? 0 : "0 156px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <p style={eyebrow()}>Conclusion</p>
        <div
          role="img"
          aria-label="Ink drawing of a family eating together around a dinner table"
          style={{ position: "relative", width: 686, maxWidth: "100%", aspectRatio: "686 / 325", overflow: "hidden", flexShrink: 0 }}
        >
          <img
            alt=""
            src="/tns/v2/ink-family-table.png"
            style={{ position: "absolute", maxWidth: "none", width: "212.24%", height: "251.08%", left: "-56.56%", top: "-86.15%" }}
          />
        </div>
        <h2 style={h2Insight(isMobile)}>People can eat healthier when they have the resources and support they need.</h2>
        <p style={{ ...pLarge(isMobile) }}>
          At the end of the day, people want to live healthier lives, but those lives aren’t idealized perfect lives in a
          vacuum. They’re messy and busy, and <em>human</em>, and nutrition resources should recognize and reflect that.
        </p>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function NutritionSourceCaseStudyV2() {
  const isMobile = useIsMobile();
  return (
    <main className="case-study" style={{ background: C.sand50, width: "100%", overflowX: "hidden" }}>
      <SiteNav isMobile={isMobile} current="nutrition-source" />
      <TitleBand isMobile={isMobile} />
      <PlateHero />
      <ProjectBand isMobile={isMobile} />
      <AboutTNS isMobile={isMobile} />
      <WhyItMatters isMobile={isMobile} />
      <TestersSay isMobile={isMobile} />
      {/* Each insight shares one band with the redesign it led to; bands alternate pale/dark cream. */}
      <div style={{ background: C.sand50 }}>
        <InsightOne isMobile={isMobile} />
        <HomepageSection isMobile={isMobile} />
      </div>
      <div style={{ background: C.sand100 }}>
        <InsightTwo isMobile={isMobile} />
        <PlateRedesign isMobile={isMobile} />
      </div>
      <div style={{ background: C.sand50 }}>
        <InsightThree isMobile={isMobile} />
        <RecipeRedesign isMobile={isMobile} />
      </div>
      <InformationArchitecture isMobile={isMobile} />
      <Conclusion isMobile={isMobile} />
    </main>
  );
}
