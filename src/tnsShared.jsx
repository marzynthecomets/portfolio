// Shared pieces for the reskinned Nutrition Source case study and the
// live Healthy Eating Plate redesign: Figma tokens, assets, helpers and the
// interactive plate (Figma file "wippy", nodes 1:21 and 81:5838).
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Reskinned Nutrition Source case study.
// Source: Figma file "wippy", frame New_NutritionSource_CaseStudy (node 1:21).
// Token names below match the styles defined in that file.

export const C = {
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

export const F = {
  mono: "'DM Mono', monospace",
  sans: "'DM Sans', sans-serif",
  plex: "'IBM Plex Mono', monospace",
  outfit: "'Outfit', sans-serif",
  nunito: "'Nunito Sans', sans-serif",
};

export const DM_SANS_OPSZ = { fontVariationSettings: "'opsz' 14" };
export const NUNITO_VAR = { fontVariationSettings: "'YTLC' 500, 'wdth' 100" };

const V2 = "/tns/v2";
export const A = {
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
};

const MOBILE_BREAKPOINT = 900;

export function useIsMobile() {
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

export function usePrefersReducedMotion() {
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
// Renders children at a fixed design width and scales them down to fit the
// available width. Pass `height` for fixed-size pieces; omit it to follow the
// children's own height (it is measured, so content can grow).
export function ScaleBox({ width, height, children, style }) {
  const ref = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [innerH, setInnerH] = useState(height || 0);
  useLayoutEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const upd = () => {
      setScale(Math.min(1, el.clientWidth / width));
      if (!height) setInnerH(inner.offsetHeight);
    };
    upd();
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [width, height]);
  const h = height || innerH;
  return (
    <div ref={ref} style={{ width: "100%", maxWidth: width, height: h * scale, position: "relative", ...style }}>
      <div
        ref={innerRef}
        style={{
          width,
          height: height || "auto",
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


/* ---------- Plate hero ---------- */
// Geometry from Figma: the plate sits in a 953.4 × 358.1 content box,
// centred, 429.96 × 429.92. Wedges, label pills, callouts and leader lines
// are positioned exactly as in the "open state" frames.
export const PLATE_PORTIONS = [
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
export const PLATE_KEYFRAMES = PLATE_TIMELINE.map((t, i) => {
  const ops = [0, 0, 1, 1, 0, 0];
  const steps = t
    .map(
      (time, j) =>
        `${(time * 100).toFixed(2)}% { opacity: ${ops[j]}; animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1); }`
    )
    .join(" ");
  return `@keyframes tnsPlate${i} { ${steps} }`;
}).join("\n");

// Figma's glass effect on the label pills doesn't come through in its code
// export, so this recreates what CSS can: Frost 9 as a 9px backdrop blur.
// Refraction, depth and dispersion have no CSS equivalent.
export const GLASS = {
  backdropFilter: "blur(9px)",
  WebkitBackdropFilter: "blur(9px)",
};

// Light (-45°, 80%): a hairline rim, brightest at the top-left and
// bottom-right corners and fading toward the other two. Drawn as a gradient
// ring (a masked overlay) because CSS borders can't take a gradient with
// rounded corners. Place inside any element styled with GLASS.
export function GlassEdge() {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        padding: 0.5,
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.12) 38%, rgba(255,255,255,0.12) 62%, rgba(255,255,255,0.75) 100%)",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
        pointerEvents: "none",
      }}
    />
  );
}

function PortionPill({ portion, open, images }) {
  const icon = (
    <span
      aria-hidden
      style={{
        position: "relative",
        // Same box in both states so the label never shifts; the × is the
        // plus rotated in place.
        width: 9.55,
        height: 9.55,
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
          src={open ? images?.iconClose || A.iconClose : images?.iconPlus || A.iconPlus}
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
        ...GLASS,
        borderRadius: 7.958,
        padding: 9.55,
        display: "flex",
        gap: 3.183,
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <GlassEdge />
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
function PlateDrawing({ activeKey, interactive, onSelect, images }) {
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
              src={dimmed ? p.dim : images?.[p.key] || p.img}
              width={p.wedge.width}
              height={p.wedge.height}
              style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", maxWidth: "none" }}
            />
            <PortionPill portion={p} open={isOpen} images={images} />
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

// `images` swaps in higher-resolution wedge art (keys: vegetables, grains,
// protein, fruits, iconPlus, iconClose) where a page has its own exports.
export function PlateContent({ activeKey, interactive, onSelect, images }) {
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
        <PlateDrawing activeKey={activeKey} interactive={interactive} onSelect={onSelect} images={images} />
      </div>
    </div>
  );
}

