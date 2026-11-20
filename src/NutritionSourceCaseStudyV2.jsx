import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Reskinned Nutrition Source case study.
// Source: Figma file "wippy", frame New_NutritionSource_CaseStudy (node 1:21).
// Token names below match the styles defined in that file.

const C = {
  lime100: "#E4F262", // Lime/100
  sand50: "#FFFCF7", // Sand/50
  sand100: "#F4EEE3", // Sand/100
  navy: "#10094C", // Navy
  crimson100: "#A51C30", // Crimson/100
  forest100: "#1F4A00", // Forest/100
  gris: "#F5F5F3", // Gris
  white: "#FFFFFF",
  plateBg: "#FCFBF7",
  cardBorder: "#717171",
  calloutBorder: "#997A59",
  tnsDarkText: "#13273A",
  tnsLightBg: "#F1F0EA",
  tnsLightestText: "#595859",
};

const F = {
  mono: "'DM Mono', monospace",
  sans: "'DM Sans', sans-serif",
  plex: "'IBM Plex Mono', monospace",
  outfit: "'Outfit', sans-serif",
  nunito: "'Nunito Sans', sans-serif",
};

const DM_SANS_OPSZ = { fontVariationSettings: "'opsz' 14" };
const NUNITO_VAR = { fontVariationSettings: "'YTLC' 500, 'wdth' 100" };

const V2 = "/tns/v2";
const A = {
  plate: {
    greens: `${V2}/plate-greens.png`,
    greensDim: `${V2}/plate-greens-dim.png`,
    grains: `${V2}/plate-grains.png`,
    grainsDim: `${V2}/plate-grains-dim.png`,
    protein: `${V2}/plate-protein.png`,
    proteinDim: `${V2}/plate-protein-dim.png`,
    fruits: `${V2}/plate-fruits.png`,
    fruitsDim: `${V2}/plate-fruits-dim.png`,
  },
  iconPlus: `${V2}/icon-plus.svg`,
  iconClose: `${V2}/icon-plus-b.svg`,
  learnMoreArrow: `${V2}/learn-more-arrow.svg`,
  lines: {
    vegetables: `${V2}/line-vegetable.svg`,
    grains: `${V2}/line-grain.svg`,
    protein: `${V2}/line-protein.svg`,
    fruits: `${V2}/line-fruit.svg`,
  },
  inkPlate: `${V2}/ink-plate.png`,
  inkInterview: `${V2}/ink-interview.png`,
  inkLibrary: `${V2}/ink-library.png`,
  inkClock: `${V2}/ink-clock.png`,
  inkDollar: `${V2}/ink-dollar.png`,
  inkFamily: `${V2}/ink-family.png`,
  inkCart: `${V2}/ink-cart.png`,
  originalScreencap: `${V2}/tns-original-screencap.png`,
  bubbles: [`${V2}/bubble-1.svg`, `${V2}/bubble-2.svg`, `${V2}/bubble-3.svg`],
  forkPhoto: `${V2}/fork-photo.png`,
  arrowCircle: `${V2}/arrow-circle.svg`,
  searchIcon: "/tns/newnav/search-icon.svg",
  homepageBefore: "/tns/pages/homepage-before.png",
  hepBefore: `${V2}/hep-before-full.png`,
  hepAfter: "/tns/pages/hep-after.png",
};

const MOBILE_BREAKPOINT = 900;

function useIsMobile() {
  const [m, setM] = useState(
    typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT
  );
  useEffect(() => {
    const on = () => setM(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return m;
}

function usePrefersReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setR(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}

// Renders children at a fixed design size and scales them down to fit the
// available width. Used for pieces that are drawn at exact Figma geometry.
function ScaleBox({ width, height, children, style }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const upd = () => setScale(Math.min(1, el.clientWidth / width));
    upd();
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div
      ref={ref}
      style={{ width: "100%", maxWidth: width, height: height * scale, position: "relative", ...style }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Type helpers ---------- */
const eyebrow = (color = C.navy) => ({
  margin: 0,
  fontFamily: F.mono,
  fontWeight: 400,
  fontSize: 18,
  lineHeight: 0.984,
  textTransform: "uppercase",
  color,
});
const h2 = (isMobile, color = C.navy) => ({
  margin: 0,
  fontFamily: F.mono,
  fontWeight: 400,
  fontSize: isMobile ? 24 : 34,
  lineHeight: isMobile ? "30px" : "40px",
  letterSpacing: isMobile ? "0.48px" : "0.68px",
  color,
});
const h2Medium = (isMobile, color = C.navy) => ({
  margin: 0,
  fontFamily: F.mono,
  fontWeight: 500,
  fontSize: isMobile ? 22 : 32,
  lineHeight: isMobile ? "28px" : "39px",
  letterSpacing: isMobile ? "-0.44px" : "-0.64px",
  color,
});
const pLarge = (isMobile, color = C.navy) => ({
  margin: 0,
  fontFamily: F.sans,
  fontWeight: 400,
  fontSize: isMobile ? 18 : 24,
  lineHeight: isMobile ? "26px" : "32px",
  color,
  ...DM_SANS_OPSZ,
});
const pMedium = (color = C.navy) => ({
  margin: 0,
  fontFamily: F.sans,
  fontWeight: 400,
  fontSize: 18,
  lineHeight: "22px",
  color,
  ...DM_SANS_OPSZ,
});

const sectionPad = (isMobile, desktop) => (isMobile ? "48px 20px" : desktop);

/* ---------- Nav ---------- */
function Nav({ isMobile }) {
  const text = {
    margin: 0,
    fontSize: isMobile ? 14 : 24,
    lineHeight: "normal",
    color: C.navy,
  };
  return (
    <nav
      style={{
        background: C.lime100,
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        padding: isMobile ? "16px 20px" : "28px 64px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <a
        href="#/"
        style={{ ...text, flex: "1 0 0", fontFamily: F.mono, fontWeight: 500, textDecoration: "none" }}
      >
        MARS NEVADA
      </a>
      <p
        style={{
          ...text,
          fontFamily: F.plex,
          fontWeight: 400,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <span>Research</span>
        <span>&amp;</span>
        <span>Design</span>
        <span>&amp;</span>
        <span>Health Storytelling</span>
      </p>
    </nav>
  );
}

/* ---------- Plate hero ---------- */
// Geometry from Figma: the plate sits in a 953.4 × 358.1 content box,
// centred, 429.96 × 429.92. Wedges, label pills, callouts and leader lines
// are positioned exactly as in the "open state" frames.
const PLATE_PORTIONS = [
  {
    key: "vegetables",
    name: "Greens",
    label: ["Vegetables"],
    iconFirst: true,
    img: A.plate.greens,
    dim: A.plate.greensDim,
    wedge: { left: 0, top: 0, width: 208.281, height: 279.102 },
    pill: { dx: 4.63, dy: 29.89, width: 163.942 },
    callout: {
      box: { left: 13.53, top: 35.02, width: 226.812 },
      kicker: "The majority of your plate.",
      body: <>The more veggies — and the greater the variety — the better. Potatoes and French fries don’t count.</>,
    },
    line: { left: 240.34, top: 132.9, width: 50.137, flip: false },
  },
  {
    key: "grains",
    name: "Grains",
    label: ["Whole", "Grains"],
    iconFirst: false,
    img: A.plate.grains,
    dim: A.plate.grainsDim,
    wedge: { right: -0.28, top: 0, width: 211.937, height: 214.37 },
    pill: { dx: -17.87, dy: 22.5, width: 111.417 },
    callout: {
      box: { right: 19.51, top: -35.02, width: 222.037 },
      kicker: "A quarter of your plate",
      body: (
        <>
          Eat a variety of whole grains (like whole-wheat bread, whole-grain pasta, and brown rice).{" "}
          <strong>Limit</strong> refined grains (like white rice and white bread).
        </>
      ),
    },
    line: { left: 623.93, top: 93.91, width: 88.337, flip: true },
  },
  {
    key: "protein",
    name: "Protein",
    label: ["Healthy", "Protein"],
    iconFirst: false,
    img: A.plate.protein,
    dim: A.plate.proteinDim,
    wedge: { right: -0.13, bottom: 0.19, width: 211.783, height: 206.651 },
    pill: { dx: -14.61, dy: -34.15, width: 125.742 },
    callout: {
      box: { right: 19.51, bottom: -17.38, width: 222.037 },
      kicker: "A quarter of your plate",
      body: (
        <>
          Choose fish, poultry, beans, and nuts.
          <br />
          <strong>Limit</strong> red meat and cheese; avoid bacon, cold cuts, and other processed meats.
        </>
      ),
    },
    line: { left: 634.28, top: 257.05, width: 77.992, flip: true },
  },
  {
    key: "fruits",
    name: "Fruits",
    label: ["Fruits"],
    iconFirst: true,
    img: A.plate.fruits,
    dim: A.plate.fruitsDim,
    wedge: { left: 12.73, bottom: 0.1, width: 195.707, height: 142.274 },
    pill: { dx: 22.03, dy: -16.05, width: 100.275 },
    callout: {
      box: { left: 27.85, bottom: -25.34, width: 226.812 },
      kicker: "A small part of your plate",
      body: (
        <>
          Eat plenty of fruits of <strong>all</strong> colors.
        </>
      ),
    },
    // Figma places this line inside the plate box (left -7.16, top 342.04);
    // converted here to content-box coordinates.
    line: { left: 254.88, top: 306.15, width: 89.929, flip: false },
  },
];

const PLATE_W = 429.963;
const PLATE_H = 429.922;
const CONTENT_W = 953.408;
const CONTENT_H = 358.125;
const PLATE_LEFT = (CONTENT_W - PLATE_W) / 2 + 0.4;
const PLATE_TOP = (CONTENT_H - PLATE_H) / 2 + 0.02;

// Figma timeline: 20 s loop, each portion fades in over 1 s, holds, fades out.
const PLATE_TIMELINE = [
  [0, 0.04, 0.09, 0.2, 0.25, 1],
  [0, 0.28, 0.33, 0.44, 0.49, 1],
  [0, 0.52, 0.57, 0.68, 0.73, 1],
  [0, 0.76, 0.81, 0.92, 0.97, 1],
];
const PLATE_KEYFRAMES = PLATE_TIMELINE.map((t, i) => {
  const ops = [0, 0, 1, 1, 0, 0];
  const steps = t
    .map(
      (time, j) =>
        `${(time * 100).toFixed(2)}% { opacity: ${ops[j]}; animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1); }`
    )
    .join(" ");
  return `@keyframes tnsPlate${i} { ${steps} }`;
}).join("\n");

function PortionPill({ portion, open }) {
  const icon = (
    <span
      aria-hidden
      style={{
        position: "relative",
        width: open ? 13.506 : 9.55,
        height: open ? 13.506 : 9.55,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          position: "relative",
          width: 9.55,
          height: 9.55,
          transform: open ? "rotate(45deg)" : "none",
        }}
      >
        <img
          alt=""
          src={open ? A.iconClose : A.iconPlus}
          width="25.9442"
          height="25.9442"
          style={{ position: "absolute", left: "-85.83%", top: "-85.83%", display: "block", maxWidth: "none" }}
        />
      </span>
    </span>
  );
  const text = (
    <span
      style={{
        fontFamily: F.outfit,
        fontWeight: 400,
        fontSize: 25.677,
        lineHeight: "23.226px",
        color: C.white,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {portion.label.map((l, i) => (
        <span key={i} style={{ display: "block" }}>
          {l}
        </span>
      ))}
    </span>
  );
  return (
    <span
      style={{
        position: "absolute",
        left: `calc(50% + ${portion.pill.dx}px)`,
        top: `calc(50% + ${portion.pill.dy}px)`,
        transform: "translate(-50%, -50%)",
        width: portion.pill.width,
        boxSizing: "border-box",
        background: "rgba(36,36,36,0.24)",
        borderRadius: 7.958,
        padding: 9.55,
        display: "flex",
        gap: 3.183,
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {portion.iconFirst ? (
        <>
          {icon}
          {text}
        </>
      ) : (
        <>
          {text}
          {icon}
        </>
      )}
    </span>
  );
}

// One full plate drawing. `activeKey` decides which wedge is lit and open.
function PlateDrawing({ activeKey, interactive, onSelect }) {
  return (
    <div
      style={{
        position: "absolute",
        left: PLATE_LEFT,
        top: PLATE_TOP,
        width: PLATE_W,
        height: PLATE_H,
      }}
    >
      {PLATE_PORTIONS.map((p) => {
        const isOpen = activeKey === p.key;
        const dimmed = activeKey && !isOpen;
        const Tag = interactive ? "button" : "div";
        return (
          <Tag
            key={p.key}
            type={interactive ? "button" : undefined}
            aria-pressed={interactive ? isOpen : undefined}
            aria-label={interactive ? `${p.label.join(" ")}: ${isOpen ? "close" : "open"} details` : undefined}
            tabIndex={interactive ? 0 : -1}
            onClick={interactive ? () => onSelect(p.key) : undefined}
            style={{
              position: "absolute",
              display: "block",
              padding: 0,
              margin: 0,
              border: "none",
              background: "transparent",
              cursor: interactive ? "pointer" : "default",
              ...p.wedge,
            }}
          >
            <img
              alt=""
              src={dimmed ? p.dim : p.img}
              width={p.wedge.width}
              height={p.wedge.height}
              style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", maxWidth: "none" }}
            />
            <PortionPill portion={p} open={isOpen} />
          </Tag>
        );
      })}
    </div>
  );
}

function Callout({ portion }) {
  const { box, kicker, body } = portion.callout;
  return (
    <>
      <div
        style={{
          position: "absolute",
          ...box,
          boxSizing: "border-box",
          background: C.white,
          border: `0.796px solid ${C.calloutBorder}`,
          borderRadius: 8.754,
          padding: 22.283,
          display: "flex",
          flexDirection: "column",
          gap: 15.917,
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 3.183, width: "100%" }}>
          <p
            style={{
              margin: 0,
              fontFamily: F.nunito,
              fontSize: 11.142,
              lineHeight: "20.692px",
              textTransform: "uppercase",
              color: "#000",
              ...NUNITO_VAR,
            }}
          >
            {kicker}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: F.nunito,
              fontSize: 15.917,
              lineHeight: "20.692px",
              color: "#000",
              ...NUNITO_VAR,
            }}
          >
            {body}
          </p>
        </div>
        <span
          style={{
            background: C.crimson100,
            borderRadius: 21.191,
            padding: "6.367px 12.733px",
            display: "flex",
            gap: 10.346,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: F.nunito,
              fontWeight: 600,
              fontSize: 9.55,
              color: C.white,
              whiteSpace: "nowrap",
              ...NUNITO_VAR,
            }}
          >
            Learn more
          </span>
          <span style={{ position: "relative", width: 0, height: 14.325 }}>
            <img
              alt=""
              src={A.learnMoreArrow}
              width="7.1625"
              height="14.325"
              style={{ position: "absolute", left: -6.76, top: 0, display: "block", maxWidth: "none" }}
            />
          </span>
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: portion.line.left,
          top: portion.line.top,
          width: portion.line.width,
          height: 0,
          transform: portion.line.flip ? "rotate(180deg)" : "none",
        }}
      >
        <img
          alt=""
          src={A.lines[portion.key]}
          width={portion.line.width}
          height="0.795833"
          style={{ position: "absolute", left: 0, top: -0.8, display: "block", maxWidth: "none" }}
        />
      </div>
    </>
  );
}

function PlateContent({ activeKey, interactive, onSelect }) {
  const portion = PLATE_PORTIONS.find((p) => p.key === activeKey);
  return (
    <div
      style={{
        position: "absolute",
        left: 0.8,
        top: 46.16,
        width: 1144.408,
        height: 453.625,
        padding: "47.75px 95.5px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", width: CONTENT_W, height: CONTENT_H }}>
        {portion && <Callout portion={portion} />}
        <PlateDrawing activeKey={activeKey} interactive={interactive} onSelect={onSelect} />
      </div>
    </div>
  );
}

function PlateHero() {
  const reducedMotion = usePrefersReducedMotion();
  const [selected, setSelected] = useState(null);
  const autoplay = !selected && !reducedMotion;

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
          <PlateContent activeKey={selected} interactive onSelect={onSelect} />
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

/* ---------- Intro ---------- */
function Intro({ isMobile }) {
  return (
    <section
      style={{
        background: C.navy,
        padding: sectionPad(isMobile, "60px 120px"),
        display: "flex",
        flexDirection: "column",
        gap: 40,
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", textAlign: "center" }}>
        <p style={eyebrow(C.lime100)}>From Harvard to the Grocery Aisle</p>
        <h1
          style={{
            margin: 0,
            fontFamily: F.mono,
            fontWeight: 400,
            fontSize: isMobile ? 26 : 36,
            lineHeight: isMobile ? "34px" : "52px",
            letterSpacing: isMobile ? "-0.52px" : "-0.72px",
            color: C.white,
          }}
        >
          Making Nutrition Research Digestible
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 32 : 128,
          alignItems: "flex-start",
          maxWidth: 1204,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: isMobile ? "100%" : 587 }}>
          <p style={eyebrow(C.lime100)}>The project</p>
          <p style={pLarge(isMobile, C.white)}>
            A usability analysis and speculative redesign of the Harvard Nutrition Source, an educational website about
            nutrition and healthy eating.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: isMobile ? "100%" : 489 }}>
          <p style={eyebrow(C.lime100)}>The team</p>
          <p style={pLarge(isMobile, C.white)}>Mars Nevada, Xinyu Wang, Mai Amit</p>
          <p style={pMedium(C.white)}>All team members contributed to both research and design.</p>
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
            fontFamily: F.mono,
            fontWeight: 400,
            fontSize: isMobile ? 26 : 36,
            lineHeight: isMobile ? "34px" : "52px",
            letterSpacing: isMobile ? "-0.52px" : "-0.72px",
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
    titleSize: 32,
    body: "Americans have preventable chronic diseases which are often related to diet and physical inactivity. Nutrition can also have a protective effect on health. - ",
    source: { label: "NIH", href: "https://www.niehs.nih.gov/health/topics/nutrition", underline: false },
  },
  {
    title: "Less than 1 in 10",
    titleSize: 30,
    body: "children and adults eat their recommended vegetables, increasing the risk of diseases like obesity, depression, type 2 diabetes, heart disease, and some cancers - ",
    source: { label: "CDC", href: "https://www.cdc.gov/cdi/indicator-definitions/npao.html", underline: true },
  },
  {
    title: "Disinformation about nutrition",
    titleSize: 30,
    body: "is rampant online, especially on social media. Most online sources of nutrition information are inaccurate or of low quality. - ",
    source: { label: "PHN", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10346027/", underline: true },
  },
];

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
              border: `3px solid ${C.cardBorder}`,
              borderRadius: 19,
              padding: isMobile ? "28px 24px" : "42px 35px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              color: C.navy,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: F.sans,
                fontWeight: 700,
                fontSize: isMobile ? 26 : s.titleSize,
                lineHeight: "32px",
                ...DM_SANS_OPSZ,
              }}
            >
              {s.title}
            </p>
            <p style={pMedium()}>
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
          <p style={pMedium()}>
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
            style={{
              display: "block",
              border: `6px solid ${C.navy}`,
              width: 486,
              maxWidth: "100%",
              aspectRatio: "486 / 313",
              overflow: "hidden",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -3,
                top: -3,
                width: "calc(100% + 12px)",
                aspectRatio: "486 / 743",
                border: `1px solid ${C.navy}`,
                overflow: "hidden",
              }}
            >
              <img
                alt="Screenshot of the original Nutrition Source homepage"
                src={A.originalScreencap}
                style={{ position: "absolute", left: 0, top: "-0.07%", width: "100%", height: "100.12%", maxWidth: "none" }}
              />
            </div>
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
        padding: sectionPad(isMobile, "80px 120px"),
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <p style={eyebrow()}>Insight 1</p>
      <h2 style={h2(isMobile)}>“I feel like real people don’t use this website.” - P7</h2>
      <p style={pLarge(isMobile)}>
        People felt like they were walking into an academic library and struggled to know where to start.
      </p>
      <img
        alt="Hand-drawn figure standing between towering library shelves"
        src={A.inkLibrary}
        style={{ width: 566, maxWidth: "100%", aspectRatio: "566 / 301.064", objectFit: "cover", display: "block" }}
      />
      <p style={h2Medium(isMobile)}>Because nutrition isn’t academic. It’s personal.</p>
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
      fontFamily: F.mono,
      fontWeight: active ? 500 : 300,
      fontSize: isMobile ? 13 : 21.708,
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

/* ---------- Live redesigned homepage (after) ---------- */
const HOMEPAGE_WORDS = ["plate", "cup", "cart"];
const HOMEPAGE_TAGS = [
  ["Healthy recipes", "Nutrition guidance for my kids", "How much protein I should be eating?", "What’s an anti-inflammatory diet?"],
  ["How does nutrition affect my sleep?", "What’s intuitive eating?", "How much salt is okay?", "How do carbohydrates affect my blood sugar?"],
];

function HomepageAfter() {
  const [word, setWord] = useState(0);
  const [query, setQuery] = useState("");
  const order = [...HOMEPAGE_WORDS.slice(word), ...HOMEPAGE_WORDS.slice(0, word)];
  return (
    <div style={{ width: 1042, display: "flex", flexDirection: "column", background: C.white }}>
      {/* Hero */}
      <div
        style={{
          position: "relative",
          height: 362.325,
          boxSizing: "border-box",
          padding: "57.889px 166.431px 57.889px 180.903px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <img
              alt=""
              src={A.forkPhoto}
              style={{ position: "absolute", height: "114.34%", left: "-10.26%", top: "-7.25%", width: "63.35%", maxWidth: "none" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(81.03deg, rgba(241, 241, 241, 0) 42.73%, rgb(241, 241, 241) 48.617%)",
            }}
          />
        </div>
        {/* In Figma this hero instance is drawn at 72.36% of the component's
            native size (the same factor as the tags and toggle). */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", transform: "scale(0.7236)", transformOrigin: "center" }}>
          <div style={{ width: 586, fontFamily: F.nunito, fontSize: 28, color: C.tnsDarkText, letterSpacing: "-0.42px", ...NUNITO_VAR }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Your nutrition guide starts here.</p>
            <p style={{ margin: 0, fontWeight: 400 }}>
              Explore research-backed guidelines from experts at Harvard on the healthiest ways to
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8.717 }}>
            <div style={{ display: "flex", gap: 12.212, alignItems: "center" }}>
              <p
                aria-live="polite"
                style={{ margin: 0, fontFamily: F.outfit, fontWeight: 700, fontSize: 68.691, lineHeight: "62.135px", color: "#000", whiteSpace: "nowrap" }}
              >
                fill your {order[0]}
              </p>
              <div style={{ paddingTop: 9.159, display: "flex" }}>
                <button
                  type="button"
                  aria-label="Show the next word"
                  onClick={() => setWord((w) => (w + 1) % HOMEPAGE_WORDS.length)}
                  style={{ width: 53.427, height: 53.427, padding: 0, border: "none", background: "transparent", cursor: "pointer" }}
                >
                  <img alt="" src={A.arrowCircle} width="53.4265" height="53.4265" style={{ display: "block" }} />
                </button>
              </div>
            </div>
            <div
              style={{
                paddingLeft: 247,
                display: "flex",
                flexDirection: "column",
                gap: 9,
                fontFamily: F.outfit,
                fontWeight: 400,
                fontSize: 68.691,
                lineHeight: "62.135px",
                color: "rgba(0,0,0,0.5)",
                whiteSpace: "nowrap",
              }}
            >
              {order.slice(1).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWord(HOMEPAGE_WORDS.indexOf(w))}
                  style={{ font: "inherit", color: "inherit", background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer" }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Tag section */}
      <div
        style={{
          background: C.tnsLightBg,
          height: 282.96,
          boxSizing: "border-box",
          padding: "43.417px 57.889px",
          display: "flex",
          flexDirection: "column",
          gap: 21.708,
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8.683, alignItems: "center" }}>
          <label
            htmlFor="tns-v2-search"
            style={{ fontFamily: F.nunito, fontWeight: 700, fontSize: 23.156, color: C.tnsDarkText, letterSpacing: "-0.3473px", whiteSpace: "nowrap", ...NUNITO_VAR }}
          >
            I’m looking for...
          </label>
          <div
            style={{
              width: 455.875,
              boxSizing: "border-box",
              background: C.white,
              border: `1.085px solid ${C.tnsLightestText}`,
              borderRadius: 36.181,
              padding: "14.472px 21.708px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <input
              id="tns-v2-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: 0,
                fontFamily: F.nunito,
                fontWeight: 600,
                fontSize: 12.331,
                color: C.tnsDarkText,
                background: "transparent",
                ...NUNITO_VAR,
              }}
            />
            <img alt="" src={A.searchIcon} style={{ width: 15.375, height: 15.375, display: "block" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10.854, width: "100%", alignItems: "center" }}>
          {HOMEPAGE_TAGS.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 7.236, justifyContent: "center" }}>
              {row.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQuery(t)}
                  style={{
                    background: query === t ? C.tnsDarkText : C.white,
                    color: query === t ? C.white : C.tnsDarkText,
                    border: `1.085px solid ${C.tnsLightestText}`,
                    borderRadius: 19.268,
                    padding: "10.854px 21.708px",
                    fontFamily: F.nunito,
                    fontWeight: 600,
                    fontSize: 12.331,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    ...NUNITO_VAR,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomepageRedesign({ isMobile }) {
  const [view, setView] = useState("after");
  return (
    <section
      style={{
        background: C.navy,
        padding: isMobile ? "48px 20px" : "60px 120px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 40,
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", textAlign: "center", maxWidth: 1040 }}>
        <p style={eyebrow(C.white)}>Homepage redesign</p>
        <h2 style={h2Medium(isMobile, C.white)}>We started with making a clear starting point.</h2>
        <p style={pLarge(isMobile, C.white)}>
          Since the Nutrition Source truly has so much educational content, giving an overview of common nutrition
          questions, popular content, as well as a search bar, helps reduce the cognitive overload of a large content
          library.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 30, alignItems: "center", width: "100%", maxWidth: 1042 }}>
        <BeforeAfterToggle labels={["Homepage Before", "Homepage after"]} value={view} onChange={setView} isMobile={isMobile} />
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: `12.301px solid ${C.lime100}`,
            background: C.white,
            overflow: "hidden",
          }}
        >
          {view === "after" ? (
            <ScaleBox width={1042 - 24.602} height={645.461 - 24.602}>
              <div style={{ position: "relative", left: -6.15, top: -6.15 }}>
                <HomepageAfter />
              </div>
            </ScaleBox>
          ) : (
            <div style={{ aspectRatio: `${1042 - 24.602} / ${645.461 - 24.602}`, overflowY: "auto" }}>
              <img alt="The original Nutrition Source homepage" src={A.homepageBefore} style={{ width: "100%", display: "block" }} />
            </div>
          )}
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
        padding: sectionPad(isMobile, "80px 120px"),
        display: "flex",
        flexDirection: "column",
        gap: 40,
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
          textAlign: "center",
          padding: isMobile ? 0 : "0 156px",
          color: C.navy,
        }}
      >
        <p style={eyebrow()}>Insight 2</p>
        <h2 style={h2(isMobile)}>No one’s nutritional needs are the same, because their lives aren’t the same.</h2>
        <p style={pLarge(isMobile)}>
          In our interviews, people said there’s what they <em>should</em> eat, and what they <em>actually</em> end up
          eating, because of life. Well, specifically because of:
        </p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 30, alignItems: "stretch" }}>
        {NEEDS.map((n) => (
          <div
            key={n.title}
            style={{
              width: 246,
              boxSizing: "border-box",
              border: `3px solid ${C.navy}`,
              borderRadius: 20,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ position: "relative", ...n.frame, flexShrink: 0 }}>
              <div style={{ position: "absolute", ...n.box, overflow: "hidden" }}>
                <img alt="" src={n.img} style={{ position: "absolute", maxWidth: "none", ...n.crop }} />
              </div>
            </div>
            <h3
              style={{
                margin: 0,
                fontFamily: F.sans,
                fontWeight: 700,
                fontSize: 26,
                lineHeight: "32px",
                color: C.navy,
                ...DM_SANS_OPSZ,
              }}
            >
              {n.title}
            </h3>
            <p style={pMedium()}>{n.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Healthy Eating Plate redesign ---------- */
function PlateRedesign({ isMobile }) {
  const [view, setView] = useState("before");
  return (
    <section
      style={{
        background: C.navy,
        padding: sectionPad(isMobile, "60px 120px"),
        display: "flex",
        flexDirection: "column",
        gap: 40,
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", textAlign: "center", width: "100%" }}>
        <p style={eyebrow(C.white)}>Healthy Eating Plate page redesign</p>
        <h2 style={h2Medium(isMobile, C.white)}>Personalizing the Plate</h2>
        <p style={{ ...pLarge(isMobile, C.white), padding: isMobile ? 0 : "0 119px" }}>
          The Healthy Eating Plate is Harvard’s guidelines to healthy portions. But they’re broad guidelines that don’t
          account for people’s individual needs. So I designed an interactive Healthy Eating Plate.
        </p>
        <p style={eyebrow(C.lime100)}>Solo extension of the team project</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 48, alignItems: "center", width: "100%", maxWidth: 1042 }}>
        <BeforeAfterToggle labels={["Plate Before", "Plate After"]} value={view} onChange={setView} isMobile={isMobile} />
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: `11px solid ${C.lime100}`,
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
            <img alt="The redesigned Healthy Eating Plate page" src={A.hepAfter} style={{ width: "100%", display: "block" }} />
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function NutritionSourceCaseStudyV2() {
  const isMobile = useIsMobile();
  return (
    <main style={{ background: C.sand50, width: "100%", overflowX: "hidden" }}>
      <Nav isMobile={isMobile} />
      <PlateHero />
      <Intro isMobile={isMobile} />
      <AboutTNS isMobile={isMobile} />
      <WhyItMatters isMobile={isMobile} />
      <TestersSay isMobile={isMobile} />
      <InsightOne isMobile={isMobile} />
      <HomepageRedesign isMobile={isMobile} />
      <InsightTwo isMobile={isMobile} />
      <PlateRedesign isMobile={isMobile} />
    </main>
  );
}
