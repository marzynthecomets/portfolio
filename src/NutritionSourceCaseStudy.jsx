import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ts } from "./theme.js";
import NavTitles from "./NavTitles.jsx";

// Design tokens pulled from Figma (file: portfolio, page: TNS).
// Token names match the styles defined in Figma.
const C = {
  kale: "#012D04",
  limon: "#EDFF46",
  yellowPure: "#F6FF00",
  creamYellow: "#FFF9E0",
  crimson: "#A51C30",
  crema: "#FCFBF7",
  neptune: "#0300B4",
  white: "#FFFFFF",
  black: "#000000",
};

const DESIGN_W = 1440;
const MOBILE_BREAKPOINT = 900;

const A = {
  hero: {
    bg: "/tns/hero-bg.png",
    logo: "/tns/tns-logo-hero.png",
  },
  laptop: {
    frame: "/tns/MacBook%20Pro%2014.svg",
    maximize: "/tns/maximize.svg",
  },
  pages: {
    "homepage|before": {
      src: "/tns/pages/homepage-before.png",
      naturalHeight: 1320,
    },
    "homepage|after": {
      src: "/tns/pages/homepage-after.png",
      naturalHeight: 2070,
    },
    "hep|before": {
      src: "/tns/pages/hep-before.png",
      naturalHeight: 2452,
    },
    "hep|after": {
      src: "/tns/pages/hep-after.png",
      naturalHeight: 3638,
    },
    "recipe|before": {
      src: "/tns/OLD_RecipeHub.png",
      naturalHeight: 6046,
    },
    "recipe|after": {
      src: "/tns/pages/recipe-after.png",
      naturalHeight: 1871,
    },
  },
  tnsLogo: "/tns/tns-logo-large.png",
  tongue: "/tns/tongue.png",
  newNav: "/tns/new-nav.png",
  secondaryNav: "/tns/secondary-nav.png",
  oldPrimaryNav: "/tns/old-primary-nav.png",
  oldSidebar: "/tns/old-sidebar.png",
  chevronDown: "/tns/chevron-down.svg",
  arrowIndent: "/tns/arrow-indent.svg",
  arrowRename: "/tns/arrow-rename.svg",
  plus: "/tns/plus.svg",
  newNavHsphLogo: "/tns/harvardlogo.svg",
  newNavTnsLogo: "/tns/newnav/tns-logo-white-bg.png",
  newNavSearch: "/tns/newnav/search-icon.svg",
};

const NEW_NAV_MENUS = {
  WSIE: {
    label: "What Should I Eat?",
    columns: [
      ["Vegetables and Fruits", "Whole Grains", "Protein"],
      ["Vitamins and Minerals", "Fiber", "Fats and Cholesterol"],
      ["Carbs and Blood Sugar", "Added Sugar", "Personalizing Nutrition"],
    ],
  },
  WSID: {
    label: "What Should I Drink?",
    columns: [
      ["Water", "Healthy Drink Options", "Low-Calorie and Artificial Sweeteners"],
      ["Sugary Drinks", "What to Drink in Moderation", "Carbs and Blood Sugar"],
    ],
  },
  DAD: {
    label: "Diets & Dieting",
    columns: [
      ["Understanding Body Fat", "The Best Diet: Quality Over Calories", "Healthy Dietary Styles"],
      ["Diet Reviews", "Balanced Salt and Sodium"],
    ],
  },
  EM: {
    label: "Explore More",
    sections: [
      {
        title: "Your Health & Disease",
        columns: [
          ["Heart Disease", "Cancer", "Obesity"],
          ["Diabetes", "Stress and Health", "Healthy Aging"],
          ["Sleep and Health", "Oral Health", "Nutrition and Immunity"],
        ],
      },
      {
        title: "Sustainability",
        columns: [["Food and Sustainability", "Reducing Food Waste"]],
      },
      {
        title: "Healthy Food Settings",
        columns: [
          [
            "Health and Early Childcare",
            "Activity and Nutrition in Schools",
            "Staying Healthy Outside of School",
          ],
          [
            "Food and Healthcare",
            "Wellness in Workplaces",
            "Building Active Communities",
          ],
          ["Nutritious Catering"],
        ],
      },
    ],
  },
};

const NEW_NAV_SECONDARY_ITEMS = [
  { label: "Nutrition 101", key: null, width: 161 },
  { label: "What Should I Eat?", key: "WSIE", width: 218 },
  { label: "What Should I Drink?", key: "WSID", width: 238 },
  { label: "Diets & Dieting", key: "DAD", width: 179 },
  { label: "Explore More", key: "EM", width: null },
  { label: "Recipes", key: null, width: 108 },
];

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [m, setM] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const on = () => setM(window.innerWidth < breakpoint);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [breakpoint]);
  return m;
}

// On desktop, scale the 1440-wide design to the available viewport width so
// it stays pixel-accurate while flexing to any monitor. Cap upscale so the
// canvas never grows past the design width on very large screens.
function useDesignScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const upd = () => {
      const w = window.innerWidth;
      if (w < MOBILE_BREAKPOINT) return;
      setScale(Math.min(w / DESIGN_W, 1));
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);
  return scale;
}

function useAutoAdvance(cb, intervalMs, restartKey) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);
  useEffect(() => {
    const id = setInterval(() => cbRef.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, restartKey]);
}

/* ---------- Nav (Nebo-style match) ---------- */
function Nav({ isMobile }) {
  return (
    <nav
      style={{
        background: C.limon,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: isMobile ? "14px 20px" : "20px 80px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <a
        href="#/"
        style={{
          flex: "1 0 0",
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: isMobile ? 20 : 28,
          lineHeight: 1.142,
          color: C.neptune,
          fontVariationSettings: "'opsz' 14",
          textDecoration: "none",
        }}
      >
        Mars Nevada
      </a>
      <NavTitles
        color={C.neptune}
        isMobile={isMobile}
        currentRoute="nutrition-source"
      />
    </nav>
  );
}

/* ---------- Hero ---------- */
function Hero({ isMobile }) {
  if (isMobile) {
    return (
      <section
        style={{
          position: "relative",
          padding: "32px 20px",
          backgroundImage: `url(${A.hero.bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            background: C.kale,
            border: `2px solid ${C.limon}`,
            borderRadius: 18,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            color: C.crema,
          }}
        >
          <img
            src={A.hero.logo}
            alt="The Nutrition Source logo"
            style={{ width: "70%", maxWidth: 280, height: "auto" }}
          />
          <p style={ts.eyebrow(true)}>FROM HARVARD TO THE GROCERY AISLE</p>
          <h1 style={ts.display(true)}>
            Making Nutrition Education Digestible
          </h1>
          <p style={ts.bodyM(true)}>
            How do we turn a dense academic resource into a practical guide to
            nutrition?
          </p>
        </div>
      </section>
    );
  }
  return (
    <section
      style={{
        position: "relative",
        padding: "59px 80px",
        backgroundImage: `url(${A.hero.bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        minHeight: 616,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: C.kale,
          border: `3px solid ${C.limon}`,
          borderRadius: 24,
          padding: 40,
          width: 745,
          display: "flex",
          flexDirection: "column",
          gap: 40,
          boxSizing: "border-box",
        }}
      >
        <img
          src={A.hero.logo}
          alt="The Nutrition Source logo"
          style={{ width: 378, height: 130.231, display: "block" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 9,
            color: C.crema,
            fontWeight: 400,
            width: "100%",
          }}
        >
          <p style={ts.eyebrow(false)}>FROM HARVARD TO THE GROCERY AISLE</p>
          <h1 style={ts.display(false)}>
            Making Nutrition Education Digestible
          </h1>
          <p style={ts.bodyL(false)}>
            How do we turn a dense academic resource into a practical guide to
            nutrition?
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Cream stripe (Team credit) ---------- */
function TeamCredit({ isMobile }) {
  return (
    <div
      style={{
        background: C.crema,
        padding: isMobile ? "16px 20px" : "20px 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 400,
          fontSize: isMobile ? 13 : 24,
          lineHeight: 1.2,
          letterSpacing: "2.88px",
          color: C.kale,
          textAlign: "center",
          whiteSpace: isMobile ? "normal" : "nowrap",
        }}
      >
        THE TEAM: ME :) | MAI AMIT | XINYU WANG
      </p>
    </div>
  );
}

/* ---------- Before / After laptop section ---------- */

const PAGES = [
  { id: "homepage", label: "HOMEPAGE" },
  { id: "hep", label: "HEALTHY EATING PLATE" },
  { id: "recipe", label: "RECIPE HUB" },
];

// Single SVG MacBook chrome with a scrollable display viewport overlaid at
// the Figma-defined inset (10.24% sides, top 2.45% + 24.72px notch safe area).
function Laptop({ pageId, variant, isMobile }) {
  const key = `${pageId}|${variant}`;
  const page = A.pages[key];
  return (
    <div
      style={{
        position: "relative",
        width: isMobile ? "100%" : 1084,
        aspectRatio: "1084 / 654.768",
        flexShrink: 0,
      }}
    >
      <img
        src={A.laptop.frame}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "2.45%",
          left: "10.24%",
          right: "10.24%",
          bottom: "12.05%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "24.72px",
            width: "100%",
            height: "calc(100% - 24.72px)",
            overflowY: "auto",
            overflowX: "hidden",
            background: C.white,
            scrollbarWidth: "thin",
          }}
        >
          <img
            key={key}
            src={page.src}
            alt={`${pageId} ${variant} page screenshot`}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function BeforeAfterSection({ isMobile }) {
  const [variant, setVariant] = useState("before");
  const [pageId, setPageId] = useState("homepage");
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (!fullScreen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setFullScreen(false);
    };
    const onPop = () => setFullScreen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.history.pushState({ tnsFullScreen: true }, "");
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      if (window.history.state && window.history.state.tnsFullScreen) {
        window.history.back();
      }
    };
  }, [fullScreen]);

  const toggleText = (active) => ({
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: active ? 700 : 300,
    fontSize: isMobile ? 22 : 34.1,
    lineHeight: 1.2,
    color: active ? C.limon : C.white,
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  const tabText = (active) => ({
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: active ? 700 : 300,
    fontSize: isMobile ? 14 : 22.773,
    lineHeight: 1.2,
    color: active ? C.limon : C.white,
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  return (
    <section
      style={{
        background: C.kale,
        padding: isMobile ? "32px 16px" : "60px 0",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 20 : 30,
        alignItems: "center",
      }}
    >
      {/* BEFORE | AFTER */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? 18 : 29.948,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          onClick={() => setVariant("before")}
          aria-pressed={variant === "before"}
          style={toggleText(variant === "before")}
        >
          BEFORE
        </button>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: isMobile ? 1.5 : 1.5,
            height: isMobile ? 28 : 41,
            background: C.limon,
          }}
        />
        <button
          type="button"
          onClick={() => setVariant("after")}
          aria-pressed={variant === "after"}
          style={toggleText(variant === "after")}
        >
          AFTER
        </button>
      </div>

      {/* HOMEPAGE | HEP | RECIPE HUB */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? 18 : 37.955,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPageId(p.id)}
            aria-pressed={pageId === p.id}
            style={tabText(pageId === p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Laptop pageId={pageId} variant={variant} isMobile={isMobile} />

      {/* GO FULL SCREEN? */}
      <button
        type="button"
        onClick={() => setFullScreen(true)}
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <img
          src={A.laptop.maximize}
          alt=""
          style={{ width: 20, height: 20, display: "block" }}
        />
        <span
          style={{
            margin: 0,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1.2,
            color: C.white,
          }}
        >
          GO FULL SCREEN?
        </span>
      </button>
      {fullScreen && (
        <FullScreenViewer
          pageId={pageId}
          setPageId={setPageId}
          variant={variant}
          setVariant={setVariant}
          onClose={() => setFullScreen(false)}
          isMobile={isMobile}
        />
      )}
    </section>
  );
}

function FullScreenViewer({
  pageId,
  setPageId,
  variant,
  setVariant,
  onClose,
  isMobile,
}) {
  if (typeof document === "undefined") return null;
  const key = `${pageId}|${variant}`;
  const page = A.pages[key];
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full screen page preview"
      style={{
        position: "fixed",
        inset: 0,
        background: C.kale,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 16 : 36,
          padding: isMobile ? "12px 16px" : "16px 40px",
          borderBottom: `1px solid ${C.limon}`,
          background: C.kale,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: isMobile ? 14 : 24,
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() => setVariant("before")}
            aria-pressed={variant === "before"}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: variant === "before" ? 700 : 300,
              fontSize: isMobile ? 16 : 22,
              lineHeight: 1.2,
              color: variant === "before" ? C.limon : C.white,
            }}
          >
            BEFORE
          </button>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 1.5,
              height: isMobile ? 18 : 24,
              background: C.limon,
            }}
          />
          <button
            type="button"
            onClick={() => setVariant("after")}
            aria-pressed={variant === "after"}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: variant === "after" ? 700 : 300,
              fontSize: isMobile ? 16 : 22,
              lineHeight: 1.2,
              color: variant === "after" ? C.limon : C.white,
            }}
          >
            AFTER
          </button>
        </div>
        <div
          style={{
            position: isMobile ? "static" : "absolute",
            left: isMobile ? undefined : "50%",
            transform: isMobile ? undefined : "translateX(-50%)",
            display: "flex",
            gap: isMobile ? 14 : 28,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {PAGES.map((p) => {
            const active = pageId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPageId(p.id)}
                aria-pressed={active}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: active ? 700 : 300,
                  fontSize: isMobile ? 13 : 18,
                  lineHeight: 1.2,
                  color: active ? C.limon : C.white,
                  whiteSpace: "nowrap",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close full screen view"
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: `1px solid ${C.limon}`,
            borderRadius: 999,
            padding: isMobile ? "6px 12px" : "8px 18px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: C.limon,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: isMobile ? 13 : 16,
            letterSpacing: "1.28px",
            textTransform: "uppercase",
          }}
        >
          <XIcon size={16} color={C.limon} />
          <span>Close</span>
        </button>
      </div>
      <div
        style={{
          flex: "1 1 0",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          background: C.white,
        }}
      >
        <img
          key={key}
          src={page.src}
          alt={`${pageId} ${variant} page screenshot`}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>
    </div>,
    document.body
  );
}

/* ---------- Limon stripe (The Breakdown) ---------- */
function BreakdownDivider({ isMobile }) {
  return (
    <div
      style={{
        background: C.limon,
        padding: isMobile ? "16px 20px" : "20px 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          ...ts.h2(isMobile),
          fontWeight: 400,
          fontSize: isMobile ? 14 : 24,
          letterSpacing: "2.88px",
          color: C.kale,
          whiteSpace: "nowrap",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        THE CULTURE PROBLEM
      </h2>
    </div>
  );
}

/* ---------- Stat Carousel ---------- */
const STATS = [
  {
    number: "129 million",
    body: (
      <>
        Americans have preventable chronic diseases which are often related to
        diet and physical inactivity. Nutrition can also have a protective
        effect on health. -{" "}
        <a
          href="https://www.niehs.nih.gov/health/topics/nutrition"
          target="_blank"
          rel="noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          NIH
        </a>
      </>
    ),
  },
  {
    number: "Less than 1 in 10",
    body: (
      <>
        children and adults eat their recommended vegetables, increasing the
        risk of diseases like obesity, depression, type 2 diabetes, heart
        disease, and some cancers -{" "}
        <a
          href="https://www.cdc.gov/cdi/indicator-definitions/npao.html"
          target="_blank"
          rel="noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          CDC
        </a>
      </>
    ),
  },
  {
    number: "40% of adults",
    body: (
      <>
        and 20% of adolescents are classified as obese. Only a quarter of
        American adults and 16% of adolescents meet physical activity
        guidelines. -{" "}
        <a
          href="https://www.cdc.gov/cdi/indicator-definitions/npao.html"
          target="_blank"
          rel="noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          CDC
        </a>
      </>
    ),
  },
];

function StatCarousel({ isMobile }) {
  const [i, setI] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  useAutoAdvance(
    () => setI((v) => (v + 1) % STATS.length),
    4000,
    restartKey
  );
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.code === "ArrowLeft") {
        setI((v) => (v - 1 + STATS.length) % STATS.length);
        setRestartKey((k) => k + 1);
      } else if (e.code === "ArrowRight") {
        setI((v) => (v + 1) % STATS.length);
        setRestartKey((k) => k + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const item = STATS[i];
  return (
    <section
      style={{
        background: C.kale,
        height: isMobile ? "auto" : 460,
        padding: isMobile ? "36px 20px" : "60px 80px 30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
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
            color: C.white,
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? 48 : 128,
              lineHeight: 1.2,
              fontVariationSettings: "'opsz' 14",
              whiteSpace: "nowrap",
            }}
          >
            {item.number}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? 16 : 26,
              lineHeight: 1.2,
              width: isMobile ? "100%" : 700,
              maxWidth: 700,
              color: C.white,
            }}
          >
            {item.body}
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Statistic slides"
          style={{
            display: "flex",
            gap: 13.684,
            alignItems: "center",
          }}
        >
          {STATS.map((_, idx) => {
            const active = idx === i;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Go to stat ${idx + 1}`}
                onClick={() => {
                  setI(idx);
                  setRestartKey((k) => k + 1);
                }}
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  border: `2px solid ${C.limon}`,
                  background: active ? C.yellowPure : "transparent",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Enter, The Nutrition Source ---------- */
function EnterTNS({ isMobile }) {
  if (isMobile) {
    return (
      <section
        style={{
          background: C.crimson,
          padding: "48px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          color: C.white,
        }}
      >
        <img
          src={A.tnsLogo}
          alt="The Nutrition Source logo"
          style={{ width: "100%", maxWidth: 320, height: "auto" }}
        />
        <h2
          style={{
            ...ts.h2(true),
            fontWeight: 400,
            textTransform: "uppercase",
          }}
        >
          Enter, The Nutrition Source
        </h2>
        <p style={ts.bodyS(true)}>
          Created by the Harvard T.H. Chan School of Public Health, The Harvard
          Nutrition Source&rsquo;s mission is to provide &ldquo;
          <strong>
            trustworthy, reliable, and clear information&mdash;free from
            industry influence or support.&rdquo;
          </strong>{" "}
          It&rsquo;s a science-backed educational resource from some of the
          best researchers in the country and probably the world.
        </p>
      </section>
    );
  }
  return (
    <section
      style={{
        background: C.crimson,
        padding: "120px 80px",
        display: "flex",
        alignItems: "center",
        gap: 50,
      }}
    >
      <div
        style={{
          flex: "1 0 0",
          borderRight: `1px solid ${C.white}`,
          paddingRight: 40,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          color: C.white,
        }}
      >
        <h2
          style={{
            ...ts.h2(false),
            fontWeight: 400,
            fontSize: 40,
            textTransform: "uppercase",
          }}
        >
          ENTER, THE NUTRITION SOURCE
        </h2>
        <p style={{ ...ts.bodyL(false), fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.2 }}>
          Created by the Harvard T.H. Chan School of Public Health, The Harvard
          Nutrition Source&rsquo;s mission is to provide &ldquo;
          <span style={{ fontWeight: 700 }}>
            trustworthy, reliable, and clear information&mdash;free from
            industry influence or support.&rdquo;
          </span>{" "}
          It&rsquo;s a science-backed educational resource from some of the
          best researchers in the country and probably the world.
        </p>
      </div>
      <div style={{ flexShrink: 0, width: 590, height: 186 }}>
        <img
          src={A.tnsLogo}
          alt="The Nutrition Source logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "left center",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}

/* ---------- What They Said ---------- */
const QUOTES = [
  { text: `"It looks like a textbook."`, who: "- P4" },
  { text: `"It definitely feels like an encyclopedia."`, who: "- P3" },
  { text: `"[…] it feels like a library website."`, who: "- P2" },
];

function QuoteBlock({ isMobile }) {
  const [i, setI] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  useAutoAdvance(
    () => setI((v) => (v + 1) % QUOTES.length),
    4000,
    restartKey
  );
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.code === "ArrowLeft") {
        setI((v) => (v - 1 + QUOTES.length) % QUOTES.length);
        setRestartKey((k) => k + 1);
      } else if (e.code === "ArrowRight") {
        setI((v) => (v + 1) % QUOTES.length);
        setRestartKey((k) => k + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const q = QUOTES[i];
  return (
    <div
      style={{
        background: C.crema,
        width: isMobile ? "100%" : 720,
        height: isMobile ? "auto" : 480,
        padding: isMobile ? "40px 24px" : "81px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 41,
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: isMobile ? 28 : 48,
          lineHeight: 1.32,
          color: C.crimson,
          letterSpacing: "-0.02em",
          fontVariationSettings: "'opsz' 14",
          width: "100%",
          whiteSpace: "pre-wrap",
        }}
      >
        {q.text}
        {"\n"}
        {q.who}
      </p>
      <div
        role="tablist"
        aria-label="Participant quotes"
        style={{
          display: "flex",
          gap: 13.684,
          alignItems: "center",
        }}
      >
        {QUOTES.map((_, idx) => {
          const active = idx === i;
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Go to quote ${idx + 1}`}
              onClick={() => {
                setI(idx);
                setRestartKey((k) => k + 1);
              }}
              style={{
                width: 13,
                height: 13,
                borderRadius: "50%",
                border: `2px solid ${C.crimson}`,
                background: active ? C.crimson : C.crema,
                cursor: "pointer",
                padding: 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function WhatTheySaid({ isMobile, onOpenInterviews }) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          flex: isMobile ? "0 0 auto" : "1 0 0",
          position: "relative",
          minHeight: isMobile ? 320 : 480,
          backgroundImage: `url(${A.tongue})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: isMobile ? "40px 24px" : "120px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          alignItems: "flex-start",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            ...ts.h1(isMobile),
            color: C.white,
            textTransform: "uppercase",
            maxWidth: 720,
          }}
        >
          BUT when we asked people THEIR THOUGHTS about the site, THIS IS WHAT
          THEY <span style={{ fontWeight: 700 }}>SAID</span>:
        </h2>
        <button
          type="button"
          onClick={onOpenInterviews}
          style={{
            background: C.white,
            border: "none",
            borderRadius: 200,
            padding: "10px 13px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          <img
            src={A.plus}
            alt=""
            style={{ width: 20, height: 20, display: "block" }}
          />
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 400,
              fontSize: 20,
              lineHeight: 1.2,
              color: C.black,
              textTransform: "uppercase",
            }}
          >
            research METHOD
          </span>
        </button>
      </div>
      <QuoteBlock isMobile={isMobile} />
    </section>
  );
}

/* ---------- Qualitative Interviews (3-state visibility) ---------- */
const INTERVIEW_PARTICIPANTS = [
  { id: "P1", age: 31, gender: "F", location: "Brooklyn, NY", occupation: "Student" },
  { id: "P2", age: 29, gender: "M", location: "Iowa", occupation: "Therapist" },
  { id: "P3", age: 24, gender: "M", location: "Brooklyn, NY", occupation: "Software Engineer" },
  { id: "P4", age: 23, gender: "M", location: "New York, NY", occupation: "Music Producer" },
  { id: "P5", age: 23, gender: "M", location: "New York, NY", occupation: "Music Artist" },
  { id: "P6", age: 25, gender: "M", location: "California", occupation: "Dental Student" },
  { id: "P7", age: 53, gender: "F", location: "China", occupation: "Mother" },
];

const INTERVIEW_QUESTIONS = [
  {
    heading: "Nutrition Questions",
    items: [
      "How often do you think about nutrition or eating ‘healthy’?",
      "What does ‘healthy’ mean to you?",
      "How many servings of fruits and vegetables do you eat a day? Why?",
      "When preparing meals, how important is nutrition to you?",
      "When grocery shopping, how do you prioritize your shopping list?",
      "Do you look for or save recipes online? Do you care about the nutritional information?",
      "Can you tell me about the last time you sought out nutritional advice or information? Where or on what platform?",
      "Why did you decide to seek out that information?",
      "What was pleasing or frustrating about that process?",
      "In what ways did you apply what you learned?",
    ],
  },
  {
    heading: "Website Impressions:",
    items: [
      "Have you ever used this website or a similar website in the past?",
      "IF SIMILAR: What did you think of that website?",
      "What do you think of The Nutrition Source website?",
      "What kind of information did you want to look for first?",
      "Did you find the website easy or difficult to navigate, and in what sections?",
      "Did you find the content easy or difficult to understand, and in what sections?",
      "Did any pages or sections stand out to you?",
      "On a scale of one to five, how engaging did you find the website to be, with one being the least engaging and five being the most? Please explain why you chose that rating.",
      "What do you like about the website?",
      "What do you not like about the website?",
      "What do you wish the website had but couldn’t find or it did not have?",
      "What would make you come back to this site?",
    ],
  },
];

function MapPinIcon({ size = 20, color = C.black }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BriefcaseIcon({ size = 20, color = C.black }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}

function ParticipantCard({ participant }) {
  return (
    <div
      style={{
        background: C.crema,
        border: "2px solid #990319",
        borderRadius: 11,
        padding: 14,
        width: 150,
        height: 183,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flexShrink: 0,
        boxSizing: "border-box",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <p
        style={{
          margin: 0,
          fontWeight: 700,
          fontSize: 24,
          lineHeight: 1.142,
          color: C.black,
        }}
      >
        {participant.id}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.142,
              color: C.black,
            }}
          >
            <span style={{ fontWeight: 700 }}>Age: </span>
            <span style={{ fontWeight: 400 }}>{participant.age}</span>
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.142,
              color: C.black,
            }}
          >
            <span style={{ fontWeight: 700 }}>Gender: </span>
            <span style={{ fontWeight: 400 }}>{participant.gender}</span>
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPinIcon />
            <span
              style={{
                fontWeight: 400,
                fontSize: 14,
                lineHeight: 1.142,
                color: C.black,
              }}
            >
              {participant.location}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
            <BriefcaseIcon />
            <span
              style={{
                fontWeight: 400,
                fontSize: 14,
                lineHeight: 1.142,
                color: C.black,
                flex: 1,
              }}
            >
              {participant.occupation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParticipantsGrid({ isMobile }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 20,
        marginTop: isMobile ? 8 : 18,
        justifyContent: isMobile ? "center" : "flex-start",
      }}
    >
      {INTERVIEW_PARTICIPANTS.map((p) => (
        <ParticipantCard key={p.id} participant={p} />
      ))}
    </div>
  );
}

function QuestionsScroller({ isMobile }) {
  const contentRef = useRef(null);
  const [scroll, setScroll] = useState({
    overflows: false,
    thumbHeight: 0,
    thumbTop: 0,
  });
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const update = () => {
      const visible = el.clientHeight;
      const total = el.scrollHeight;
      if (total <= visible + 1) {
        setScroll({ overflows: false, thumbHeight: 0, thumbTop: 0 });
        return;
      }
      const thumbHeight = Math.max(48, (visible / total) * visible);
      const maxScroll = total - visible;
      const thumbTop =
        maxScroll > 0
          ? (el.scrollTop / maxScroll) * (visible - thumbHeight)
          : 0;
      setScroll({ overflows: true, thumbHeight, thumbTop });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro) ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [isMobile]);
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "stretch",
        border: `2px solid ${C.crimson}`,
        borderRadius: 20,
        padding: isMobile ? 20 : 30,
        height: isMobile ? 320 : 382,
        marginTop: isMobile ? 8 : 18,
      }}
    >
      <div
        ref={contentRef}
        className="tns-questions-scroll"
        style={{
          flex: "1 1 0",
          minWidth: 0,
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: 8,
          fontFamily: "'Space Grotesk', sans-serif",
          color: C.black,
          fontSize: isMobile ? 16 : 24,
          lineHeight: 1.6,
        }}
      >
        {INTERVIEW_QUESTIONS.map((group, gi) => (
          <div key={group.heading} style={{ marginTop: gi === 0 ? 0 : 16 }}>
            <p
              style={{
                margin: 0,
                marginBottom: 8,
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              {group.heading}
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: 36,
                listStyle: "disc",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {group.items.map((q) => (
                <li key={q} style={{ lineHeight: 1.6, fontWeight: 400 }}>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        aria-hidden
        style={{
          width: 14,
          flexShrink: 0,
          borderRadius: 200,
          background: scroll.overflows ? "rgba(165,28,48,0.2)" : "transparent",
          position: "relative",
          alignSelf: "stretch",
          opacity: scroll.overflows ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 14,
            height: scroll.thumbHeight,
            top: scroll.thumbTop,
            background: C.crimson,
            borderRadius: 200,
          }}
        />
      </div>
      <style>{`
        .tns-questions-scroll::-webkit-scrollbar { width: 0; height: 0; }
        .tns-questions-scroll { scrollbar-width: none; }
      `}</style>
    </div>
  );
}

const INTERVIEW_TABS = [
  {
    id: "overview",
    label: "OVERVIEW",
    title: "Overview",
    body: () => (
      <>
        <p style={{ margin: 0, marginBottom: 8, lineHeight: 1.4 }}>
          My team and I collectively interviewed seven (7) participants,
          recruited from our personal contacts. We wanted to get external
          opinions from &ldquo;normal people&rdquo; on their nutritional
          habits, how they look for nutrition information, and their thoughts
          on The Nutrition Source (TNS) website.
        </p>
        <p style={{ margin: 0, lineHeight: 1.4 }}>
          We parsed the interviews for common patterns and recurring themes,
          sorting them into groups via affinity diagram.
        </p>
      </>
    ),
  },
  {
    id: "participants",
    label: "PARTICIPANTS",
    title: "Participants",
    body: ({ isMobile }) => (
      <>
        <p style={{ margin: 0, lineHeight: 1.4 }}>
          We interviewed seven users recruited from our personal networks. We
          were lucky to capture a diverse set of voices in terms of age,
          gender, location, and profession.
        </p>
        <ParticipantsGrid isMobile={isMobile} />
      </>
    ),
  },
  {
    id: "questions",
    label: "QUESTIONS",
    title: "Questions",
    body: ({ isMobile }) => (
      <>
        <p style={{ margin: 0, lineHeight: 1.4 }}>
          We asked open-ended questions about what eating healthy means to
          each participant, how important nutrition is in their day-to-day,
          where they currently source nutrition information, and what makes
          that information feel trustworthy.
        </p>
        <QuestionsScroller isMobile={isMobile} />
      </>
    ),
  },
  {
    id: "themes",
    label: "FINDINGS",
    title: "Findings",
    body: () => (
      <div
        style={{
          margin: 0,
          lineHeight: 1.6,
          display: "flex",
          flexDirection: "column",
          gap: "1em",
        }}
      >
        <p style={{ margin: 0 }}>
          We discovered that users value nutrition as a way to maintain health
          and improve their quality of life but they frequently find themselves
          having to negotiate between nutrition and flavor and having to
          consider factors such as cost, convenience, family members, or
          partners. Many users tried to incorporate nutritious items and fresh
          produce in their grocery shopping, examining nutrition fact labels
          with the intention of avoiding additives and high levels of sodium,
          sugar, and other carbs. However, users often opted for less-expensive
          and convenient items such as frozen foods, snacks, and sandwich
          ingredients over fresh produce, which can be costly. Some users
          demonstrated curiosity surrounding alternative diets, while others
          actively take supplements or have specific fitness goals affecting
          their daily nutrition choices.
        </p>
        <p style={{ margin: 0 }}>
          Reviewing the Nutrition Source, users recognized the website as a
          well-researched and credible source for nutrition information. That
          said, some users expressed wariness regarding nutrition misinformation
          online as perpetuated by social media influencers and the current
          U.S. administration. In fact, the majority of users regularly turn to
          personally trusted sources like friends, relatives, and primary care
          specialists to answer their specific nutrition questions.
          Additionally, users felt that the site&rsquo;s content was too dense,
          academic and text-heavy, like it was designed more for specialists
          than &ldquo;normal people.&rdquo; The content was also not geared toward
          their interests or needs: namely, easy-to-digest and actionable
          recommendations that
          consider cost, convenience, and cultural diversity. Users also felt
          that the site&rsquo;s aesthetic could be improved with a more modern
          and approachable look, incorporating more engaging visuals
          (especially of food) and videos.
        </p>
      </div>
    ),
  },
];

function XIcon({ size = 20, color = C.black }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function QualitativeInterviews({
  revealed,
  onClose,
  isMobile,
  sectionRef,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  if (!revealed) return null;
  const tab = INTERVIEW_TABS.find((t) => t.id === activeTab);

  return (
    <section
      ref={sectionRef}
      style={{
        background: C.crema,
        borderTop: `4px solid ${C.crimson}`,
        borderBottom: `4px solid ${C.crimson}`,
        position: "relative",
      }}
    >
      <div
        style={{
          padding: isMobile ? "32px 20px" : "60px 80px",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 24 : 30,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 20,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              lineHeight: 1.2,
              color: C.black,
              textTransform: "uppercase",
            }}
          >
            <XIcon size={20} color={C.black} />
            <span>CLOSE</span>
          </button>
          <h2
            style={{
              ...ts.h1(isMobile),
              fontWeight: 700,
              color: C.crimson,
              textTransform: "uppercase",
              width: "100%",
            }}
          >
            research method:{" "}
            <span style={{ fontWeight: 400 }}>qualitative interviews</span>
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 18 : 82,
            alignItems: isMobile ? "stretch" : "flex-start",
          }}
        >
          {/* Tab rail */}
          {isMobile ? (
            <MobileTabSelect
              tabs={INTERVIEW_TABS}
              activeId={activeTab}
              onPick={setActiveTab}
            />
          ) : (
            <nav
              aria-label="Interview sections"
              style={{
                width: 314,
                flexShrink: 0,
                borderRight: `2px solid ${C.crimson}`,
                paddingRight: 40,
                display: "flex",
                flexDirection: "column",
                gap: 21,
              }}
            >
              {INTERVIEW_TABS.map((t) => {
                const active = t.id === activeTab;
                return (
                  <div
                    key={t.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 21,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab(t.id)}
                      aria-current={active ? "page" : undefined}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        margin: 0,
                        textAlign: "left",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: active ? 700 : 400,
                        fontSize: 28,
                        lineHeight: 1.142,
                        color: C.crimson,
                        textTransform: "uppercase",
                        cursor: "pointer",
                      }}
                    >
                      {t.label}
                    </button>
                    <div
                      aria-hidden
                      style={{
                        height: 2,
                        background: C.crimson,
                        width: "100%",
                      }}
                    />
                  </div>
                );
              })}
            </nav>
          )}
          {/* Content */}
          <div
            key={activeTab}
            style={{
              flex: "1 0 0",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              color: C.black,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <h3
              style={{
                ...ts.h1(isMobile),
                fontFamily: "'DM Sans', sans-serif",
                fontVariationSettings: "'opsz' 14",
              }}
            >
              {tab.title}
            </h3>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: isMobile ? 16 : 24,
                lineHeight: 1.6,
                fontVariationSettings: "'opsz' 14",
              }}
            >
              {typeof tab.body === "function" ? tab.body({ isMobile }) : tab.body}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileTabSelect({ tabs, activeId, onPick }) {
  const [open, setOpen] = useState(false);
  const tab = tabs.find((t) => t.id === activeId);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          background: C.crimson,
          color: C.crema,
          border: "none",
          borderRadius: 10,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 16,
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        <span>{tab.label}</span>
        <span aria-hidden>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: C.crema,
            border: `2px solid ${C.crimson}`,
            borderRadius: 10,
            zIndex: 5,
            overflow: "hidden",
          }}
        >
          {tabs.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onPick(t.id);
                setOpen(false);
              }}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderTop:
                  idx === 0 ? "none" : `1px solid ${C.crimson}40`,
                padding: "12px 16px",
                textAlign: "left",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: t.id === activeId ? 700 : 400,
                fontSize: 15,
                color: C.crimson,
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Usability banner ---------- */
function UsabilityBanner({ isMobile }) {
  return (
    <section
      style={{
        background: C.crimson,
        padding: isMobile ? "32px 20px" : "44px 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          ...ts.h1(isMobile),
          fontFamily: "'DM Sans', sans-serif",
          fontVariationSettings: "'opsz' 14",
          color: C.white,
          textAlign: "center",
          maxWidth: 690,
        }}
      >
        It&rsquo;s not just about aesthetics, it&rsquo;s about{" "}
        <span style={{ fontWeight: 700 }}>usability and user needs.</span>
      </h2>
    </section>
  );
}

/* ---------- Key Findings for User Needs ---------- */
function KeyFindings({ isMobile }) {
  return (
    <section
      style={{
        background: C.crema,
        padding: isMobile ? "32px 20px" : "44px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        textAlign: "center",
      }}
    >
      <h2
        style={{
          ...ts.h1(isMobile),
          fontWeight: 700,
          color: C.crimson,
          textTransform: "uppercase",
        }}
      >
        Our Key Findings For User Needs:
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          maxWidth: 825,
          width: "100%",
          color: C.kale,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            width: "100%",
          }}
        >
          <h3
            style={{
              ...ts.h1(isMobile),
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.4px",
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Design for Easy Scanning
          </h3>
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? 16 : 24,
              lineHeight: 1.2,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            <span style={{ fontWeight: 700 }}>
              Our users are busy people who are short on time.
            </span>{" "}
            In the grocery store, they&rsquo;re only quickly scanning the
            nutrition facts while they shop and move on quickly. We need to
            respect their time by making the site easy to navigate and scan
            around for the information they want. This is also why adding more
            visuals is important as they make it easier for users to scan.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            width: "100%",
          }}
        >
          <h3
            style={{
              ...ts.h1(isMobile),
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.4px",
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Integrate Users&rsquo; Goals &amp; Needs
          </h3>
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? 16 : 24,
              lineHeight: 1.2,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            <span style={{ fontWeight: 700 }}>
              Our users want practical advice and content that&rsquo;s relevant
              to their daily goals and needs
            </span>
            , namely, saving money and saving time, or finding easy ways to
            integrate more vegetables into convenient meals.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Final Thoughts ---------- */
const FINAL_THOUGHTS = [
  {
    title: "Users have complex needs",
    body: "Users value nutrition and try to make nutritious choices but reality and their needs often get in the way. Our goal is to help address their needs and goals realistically.",
  },
  {
    title: "Navigating knowledge takes care and direction",
    body: "When presenting users with a breadth of information, guidance goes a long way in building confidence and positive experiences.",
  },
  {
    title: "Trustworthy content still needs to be approachable",
    body: "Harvard’s content is credible but users still need clear guidance, signposting, explicit language, and visual hierarchy to better understand concepts.",
  },
  {
    title: "Teamwork makes the dream work",
    body: "Working with a team helps us approach a site from different perspectives, with different skill sets and our combined passion and time.",
  },
];

function FinalThoughts({ isMobile }) {
  return (
    <section
      style={{
        background: C.limon,
        color: C.kale,
        padding: isMobile ? "40px 20px 60px" : "60px 80px 100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        textAlign: "center",
      }}
    >
      <h2
        style={{
          ...ts.h1(isMobile),
          fontWeight: 400,
          textTransform: "uppercase",
        }}
      >
        Final Thoughts
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          maxWidth: 930,
          width: "100%",
        }}
      >
        {FINAL_THOUGHTS.map((item) => (
          <div
            key={item.title}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              width: "100%",
            }}
          >
            <h3
              style={{
                ...ts.h2(isMobile),
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                letterSpacing: "-0.32px",
                fontVariationSettings: "'opsz' 14",
              }}
            >
              {item.title}
            </h3>
            <p style={ts.bodyL(isMobile)}>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- The Issues I Worked On (Navigation) ---------- */
const ISSUES = [
  { id: "navigation", label: "NAVIGATION" },
  { id: "recipe-hub", label: "RECIPE HUB" },
];

// Tree-structured relabel rows. Any node with `children` is a dropdown (has
// chevron); dropdowns are closed by default. `arrow: true` renders the L
// turn-arrow indent indicator before the row text. Items without an arrow
// but at indent>0 just align under the text of their preceding sibling.
const RELABEL_TREE = [
  { id: "hep-pyr", from: "Healthy Eating Plate & Pyramid", to: "Nutrition 101" },
  {
    id: "wsie",
    from: "What Should I Eat?",
    children: [
      { id: "carbs", from: "Carbohydrates", to: "Carbs & Blood Sugar", arrow: true },
      {
        id: "precision",
        from: "Precision Nutrition",
        to: "Personalizing Nutrition",
        arrow: true,
      },
    ],
  },
  {
    id: "drinks",
    from: "Healthy Drinks",
    to: "What Should I Drink?",
    children: [
      {
        id: "ohbo",
        from: "Other Healthy Beverage Options",
        to: "Healthy Drink Options",
        arrow: true,
      },
      {
        id: "moderation",
        from: "Drinks to Consume in Moderation",
        to: "What to Drink in Moderation",
        indentNoArrow: true,
      },
      {
        id: "low-cal",
        from: "Low-Calorie Sweeteners",
        to: "Low Calorie & Artificial Sweeteners",
        indentNoArrow: true,
      },
    ],
  },
  {
    id: "weight",
    from: "Healthy Weight",
    to: "Diets & Dieting",
    children: [
      { id: "body-fat", from: "Body Fat", to: "Understanding Body Fat", arrow: true },
      {
        id: "best-diet",
        from: "The Best Diet: Quality Counts",
        to: "The Best Diet: Quality Over Calories",
        arrow: true,
      },
    ],
  },
  {
    id: "explore",
    from: "Explore More",
    suffix: "(NEW)",
    fromIsNew: true,
    children: [
      {
        id: "disease",
        from: "Disease Prevention",
        to: "Your Health & Disease",
        arrow: true,
      },
      {
        id: "sustain",
        from: "Sustainability",
        arrow: true,
        children: [
          {
            id: "plate-planet",
            from: "Plate and the Planet",
            to: "Food and Sustainability",
            arrow: true,
            extraIndent: true,
          },
          {
            id: "food-waste",
            from: "Food Waste",
            to: "Reducing Food Waste",
            arrow: true,
            extraIndent: true,
          },
        ],
      },
      {
        id: "hfe",
        from: "Healthy Food Environment",
        to: "Healthy Food Settings",
        arrow: true,
        children: [
          {
            id: "child-care",
            from: "Healthy Child Care Settings",
            to: "Health and Early Childcare",
            arrow: true,
            extraIndent: true,
          },
          {
            id: "schools",
            from: "Healthy Schools",
            to: "Activity and Nutrition in Schools",
            arrow: true,
            extraIndent: true,
          },
          {
            id: "youth",
            from: "Healthy Spaces for Youth",
            to: "Staying Healthy Outside of School",
            arrow: true,
            extraIndent: true,
          },
          {
            id: "health-care",
            from: "Healthy Health Care",
            to: "Food and Healthcare",
            arrow: true,
            extraIndent: true,
          },
          {
            id: "work",
            from: "Healthy Workplaces",
            to: "Wellness in Workplaces",
            arrow: true,
            extraIndent: true,
          },
          {
            id: "communities",
            from: "Active Communities",
            to: "Building Active Communities",
            arrow: true,
            extraIndent: true,
          },
          {
            id: "service",
            from: "Food Service Resources",
            to: "Nutritious Catering",
            arrow: true,
            extraIndent: true,
          },
        ],
      },
    ],
  },
];

// Inline SVG components — the downloaded Figma SVGs use
// preserveAspectRatio="none" + 100% sizing which makes <img> renders
// distort into stripes. Inlining lets us control intrinsic size and color.
function ChevronDown({ open, size = 32, color = C.limon }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        flexShrink: 0,
        display: "block",
        transform: open ? "scaleY(-1)" : "none",
        transition: "transform 0.2s ease",
      }}
      aria-hidden
    >
      <path
        d="M8 12L16 20L24 12"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRename({ width = 31 }) {
  // viewBox 33 x 14.728, so height = width * 14.728/33
  const height = (width * 14.728) / 33;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 14.7279"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: "block" }}
      aria-hidden
    >
      <path
        d="M1 6.36396H0V8.36396H1V7.36396V6.36396ZM32.7071 8.07107C33.0976 7.68054 33.0976 7.04738 32.7071 6.65685L26.3431 0.292893C25.9526 -0.097631 25.3195 -0.097631 24.9289 0.292893C24.5384 0.683418 24.5384 1.31658 24.9289 1.70711L30.5858 7.36396L24.9289 13.0208C24.5384 13.4113 24.5384 14.0445 24.9289 14.435C25.3195 14.8256 25.9526 14.8256 26.3431 14.435L32.7071 8.07107ZM1 7.36396V8.36396H32V7.36396V6.36396H1V7.36396Z"
        fill={C.limon}
      />
    </svg>
  );
}

function ArrowIndent({ width = 29 }) {
  // viewBox 31 x 27.364, so height = width * 27.364/31
  const height = (width * 27.364) / 31;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 31 27.364"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: "block" }}
      aria-hidden
    >
      <path
        d="M2 1V0H0V1H1H2ZM1 20H0V21H1V20ZM30.7071 20.7071C31.0976 20.3166 31.0976 19.6834 30.7071 19.2929L24.3431 12.9289C23.9526 12.5384 23.3195 12.5384 22.9289 12.9289C22.5384 13.3195 22.5384 13.9526 22.9289 14.3431L28.5858 20L22.9289 25.6569C22.5384 26.0474 22.5384 26.6805 22.9289 27.0711C23.3195 27.4616 23.9526 27.4616 24.3431 27.0711L30.7071 20.7071ZM1 1H0V20H1H2V1H1ZM1 20V21H30V20V19H1V20Z"
        fill={C.white}
      />
    </svg>
  );
}

function RelabelRow({ row, depth, isOpen, onToggle }) {
  const hasDropdown = Boolean(row.children);
  const textColor = row.fromIsNew ? C.limon : C.white;
  // The L-arrow indent indicator sits in a fixed-width slot so all row text
  // aligns regardless of whether a given row has the arrow rendered. Rows
  // with `indentNoArrow` skip the arrow but keep the slot.
  const showArrow = row.arrow;
  const reserveSlot = row.arrow || row.indentNoArrow;
  // Extra indentation for grandchildren (Sustainability / HFE sub-items).
  const leftPad = row.extraIndent ? 50 : 0;
  return (
    <div
      onClick={hasDropdown ? onToggle : undefined}
      role={hasDropdown ? "button" : undefined}
      tabIndex={hasDropdown ? 0 : undefined}
      onKeyDown={
        hasDropdown
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle();
              }
            }
          : undefined
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        paddingLeft: leftPad,
        paddingBottom: 20,
        paddingTop: depth === 0 && row === RELABEL_TREE[0] ? 0 : 0,
        borderBottom: `1px solid ${C.white}`,
        width: "100%",
        boxSizing: "border-box",
        cursor: hasDropdown ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      {reserveSlot ? (
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "flex-end",
            justifyContent: "center",
            width: 29,
            height: 26,
            flexShrink: 0,
          }}
        >
          {showArrow ? <ArrowIndent width={29} /> : null}
        </span>
      ) : null}
      <p
        style={{
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: 24,
          lineHeight: 1.2,
          color: textColor,
          whiteSpace: "nowrap",
          fontVariationSettings: "'opsz' 14",
          flexShrink: 0,
        }}
      >
        {row.from}
        {row.suffix ? (
          <span style={{ fontWeight: 400 }}> {row.suffix}</span>
        ) : null}
      </p>
      {row.to ? (
        <>
          <ArrowRename width={31} />
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 24,
              lineHeight: 1.2,
              color: C.white,
              whiteSpace: "nowrap",
              fontVariationSettings: "'opsz' 14",
              flexShrink: 0,
            }}
          >
            {row.to}
          </p>
        </>
      ) : null}
      {hasDropdown ? (
        <span style={{ marginLeft: "auto" }}>
          <ChevronDown open={isOpen} />
        </span>
      ) : null}
    </div>
  );
}

function RelabelTree({ nodes, openSet, onToggle, depth = 0 }) {
  return (
    <>
      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            // Same gap as the outer container so rows + revealed children
            // stay evenly spaced when a dropdown is expanded.
            gap: 20,
          }}
        >
          <RelabelRow
            row={node}
            depth={depth}
            isOpen={openSet.has(node.id)}
            onToggle={() => onToggle(node.id)}
          />
          {node.children && openSet.has(node.id) ? (
            <RelabelTree
              nodes={node.children}
              openSet={openSet}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ) : null}
        </div>
      ))}
    </>
  );
}

function IssuesSection({ isMobile }) {
  const [issueOpen, setIssueOpen] = useState(false);
  const [activeIssue, setActiveIssue] = useState("navigation");
  // All chevroned sections start closed; expanding reveals their children.
  const [openIds, setOpenIds] = useState(() => new Set());
  const [relabelOpen, setRelabelOpen] = useState(false);
  const toggleNode = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const issue = ISSUES.find((i) => i.id === activeIssue);
  return (
    <section
      style={{
        background: C.kale,
        padding: isMobile ? "32px 20px" : "60px 80px",
        display: "flex",
        flexDirection: "column",
        gap: 40,
      }}
    >
      {/* Header: THE ISSUES I WORKED ON: NAVIGATION ▾ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          paddingBottom: 20,
          borderBottom: `1px solid ${C.limon}`,
          flexWrap: "wrap",
        }}
      >
        <h2
          style={{
            ...ts.h1(isMobile),
            fontWeight: 300,
            color: C.white,
            textTransform: "uppercase",
          }}
        >
          THE ISSUES I WORKED ON:
        </h2>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            aria-expanded={issueOpen}
            onClick={() => setIssueOpen((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: isMobile ? 22 : 40,
              lineHeight: 1.2,
              color: C.limon,
              textTransform: "uppercase",
            }}
          >
            {issue.label}
            <ChevronDown open={issueOpen} color={C.limon} />
          </button>
          {issueOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                background: C.kale,
                border: `1px solid ${C.limon}`,
                borderRadius: 8,
                padding: "8px 0",
                zIndex: 10,
                minWidth: "100%",
              }}
            >
              {ISSUES.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setActiveIssue(opt.id);
                    setIssueOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    padding: "10px 20px",
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: opt.id === activeIssue ? 700 : 400,
                    fontSize: isMobile ? 18 : 24,
                    lineHeight: 1.2,
                    color: opt.id === activeIssue ? C.limon : C.white,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeIssue === "navigation" && (
        <NavigationIssueContent
          isMobile={isMobile}
          openIds={openIds}
          toggleNode={toggleNode}
        />
      )}
      {activeIssue === "recipe-hub" && (
        <RecipeHubIssueContent isMobile={isMobile} />
      )}
    </section>
  );
}

function NavigationIssueContent({ isMobile, openIds, toggleNode }) {
  return (
    <>
      {/* Block 1: Headline + body + Figure 1 (new nav) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 820,
          }}
        >
          <h3
            style={{
              ...ts.h2(isMobile),
              fontFamily: "'DM Sans', sans-serif",
              color: C.white,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Limited Exploration and Discovery Through the Primary Navigation
            Menu
          </h3>
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? 16 : 24,
              lineHeight: 1.6,
              color: C.white,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Originally, the{" "}
            <span style={{ fontWeight: 700 }}>
              primary navigation menu (Figure 1)
            </span>{" "}
            at the top of the page only let the user access the homepage, the
            Healthy Eating Plate, Nutrition News, About, Make a Gift, and the
            search function.{" "}
            <span style={{ fontWeight: 700, color: C.white }}>
              Our primary design change was to make it so that a user could
              discover and access any page from the primary navigation.
            </span>
          </p>
        </div>

        <NavBeforeAfterCompare isMobile={isMobile} />
      </div>

      {/* Block 2: Body + Figure 2 (secondary nav screenshot with dashed outline) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div style={{ maxWidth: 820 }}>
          <h4
            style={{
              ...ts.h3(isMobile),
              marginBottom: 8,
              color: C.white,
            }}
          >
            Previously, the rest of the pages were inaccessible via the primary
            navigation, making it seem like the site&rsquo;s content was much
            more limited than it really was.
          </h4>
          <p
            style={{
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? 16 : 24,
              lineHeight: 1.6,
              color: C.white,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Users in our qualitative interviews had to click deeper into the
            site to access the{" "}
            <span style={{ fontWeight: 700 }}>
              secondary navigation (Figure 2)
            </span>{" "}
            to even be able to explore the rest of the pages. Even then, the
            pages were often nested in multiple layers and the side navigation
            used up a lot of space on the page.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: isMobile ? "auto" : 654,
              overflow: "hidden",
              border: `5.444px solid ${C.limon}`,
              borderRadius: 12,
              boxSizing: "border-box",
            }}
          >
            <img
              src={A.secondaryNav}
              alt="Secondary navigation screenshot"
              style={{
                width: "100%",
                height: isMobile ? "auto" : "100%",
                objectFit: "cover",
                objectPosition: "top left",
                display: "block",
              }}
            />
            {!isMobile && (
              <div
                style={{
                  position: "absolute",
                  left: 65,
                  top: 11.38,
                  width: 227,
                  height: 623,
                  border: `5px dashed ${C.kale}`,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: 1.2,
                color: C.white,
                letterSpacing: "1.28px",
                textTransform: "uppercase",
              }}
            >
              Figure 2
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: 1.6,
                color: C.white,
                fontVariationSettings: "'opsz' 14",
              }}
            >
              See the area outlined by the dashed line.
            </p>
          </div>
        </div>
      </div>

      {/* Block 3: labeling paragraph */}
      <div style={{ maxWidth: 820 }}>
        <h4
          style={{
            ...ts.h3(isMobile),
            marginBottom: 12,
            color: C.white,
          }}
        >
          The labeling of the pages themselves also confused users since they
          lacked specificity, clarity, and detail. Pages and subpages lacked a
          clear logical grouping making it difficult to navigate.
        </h4>
        <p
          style={{
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? 16 : 24,
            lineHeight: 1.6,
            color: C.white,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          We conducted{" "}
          <span style={{ fontWeight: 700 }}>
            a card sort study and a tree sort study
          </span>{" "}
          to better understand users&rsquo; mental models of the site and
          their knowledge base of nutrition topics. These studies were very
          useful in helping us determine if labels were clear enough and useful
          in orienting users towards the knowledge they were seeking. Some
          labels were also needlessly complex or wordy, so simplification was
          also necessary in some cases. They also helped us make groupings of
          pages that aligned more with users&rsquo; mental models of topic
          groupings.
        </p>
      </div>

      {/* Block 4: Old Navigation side-by-side with Relabeled pages */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 60,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 23,
            width: isMobile ? "100%" : 288,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "stretch",
            }}
          >
            <h3
              style={{
                ...ts.h2(false),
                color: C.white,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              OLD NAVIGATION
            </h3>
            <div
              style={{
                height: 2,
                background: C.limon,
                width: "100%",
              }}
            />
          </div>
          <div
            style={{
              width: isMobile ? "100%" : 288,
              height: isMobile ? 400 : 801,
              overflowY: "auto",
              overflowX: "hidden",
              background: C.white,
              border: `5.444px solid ${C.limon}`,
              borderRadius: 12,
              boxSizing: "border-box",
            }}
          >
            <img
              src={A.oldSidebar}
              alt="The original Nutrition Source sidebar navigation"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.2,
              color: C.white,
              letterSpacing: "1.28px",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Figure 3
          </p>
        </div>
        <div
          style={{
            flex: "1 0 0",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            minWidth: 0,
            width: isMobile ? "100%" : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h3
              style={{
                ...ts.h2(false),
                color: C.white,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Relabeled pages
            </h3>
            <div
              style={{
                height: 2,
                background: C.limon,
                width: "100%",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              width: "100%",
              overflowX: isMobile ? "auto" : "visible",
            }}
          >
            <RelabelTree
              nodes={RELABEL_TREE}
              openSet={openIds}
              onToggle={toggleNode}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function RecipeHubIssueContent({ isMobile }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 60,
      }}
    >
      {/* Block 1: Headline + intro + Figure 4 (search bar card) */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 40 }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 820,
            color: C.white,
          }}
        >
          <h3
            style={{
              ...ts.h2(isMobile),
              fontFamily: "'DM Sans', sans-serif",
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Bringing Search, Sorting, and Appetizing Visuals to the Recipe Hub
            Page
          </h3>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? 16 : 24,
              lineHeight: 1.2,
              fontVariationSettings: "'opsz' 14",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <p style={{ margin: 0 }}>
              A key piece of feedback we heard from users was that they wanted
              to be able to quickly search and sort through recipes to find one
              that worked for them. They especially wanted to be able to search
              by ingredient since they often cooked meals based on ingredients
              they already had.
            </p>
            <p style={{ margin: 0 }}>
              The other piece of feedback we received was that users wanted
              visuals for every recipe which would help them get a sense of if
              the recipe appealed to them or they would find it appetizing,
              important to know before committing time and energy to making a
              recipe.
            </p>
            <p style={{ margin: 0, fontWeight: 700 }}>
              We implemented a search bar (Figure 4) with quick filter tags
              based on the common types of recipes users wanted:
            </p>
          </div>
        </div>
        <FigureWithCaption caption="Figure 4" fullWidth>
          <img
            src="/tns/SearchRef.png"
            alt="Search Recipes card with search bar, filter button, and quick filter tags"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </FigureWithCaption>
      </div>

      {/* Block 2: paragraph + Figures 5 & 6 (filter menu mockups) */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 32 : 60,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flex: "1 0 0",
            minWidth: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? 16 : 24,
            lineHeight: 1.2,
            color: C.white,
            fontVariationSettings: "'opsz' 14",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <p style={{ margin: 0 }}>
            We also added a filter button that opened up a filter menu (Figure
            5) for <span style={{ fontWeight: 700 }}>Meal Type:</span>{" "}
            Breakfast, Lunch, etc (Figure 6);{" "}
            <span style={{ fontWeight: 700 }}>Cuisine:</span> Mexican, Chinese,
            etc; <span style={{ fontWeight: 700 }}>Diets and Dietary Needs:</span>{" "}
            Vegan, Vegetarian, Kosher, etc;{" "}
            <span style={{ fontWeight: 700 }}>Time:</span> how long to prepare
            and cook; <span style={{ fontWeight: 700 }}>Difficulty:</span> how
            hard a recipe is; and{" "}
            <span style={{ fontWeight: 700 }}>Allergies</span>. In our paper
            prototype testing, users primarily relied on cooking time and
            serving size as a way to choose between similar recipes.
          </p>
          <p style={{ margin: 0 }}>
            To show serving size, we integrated that into the recipe cards
            (see Figure 7) themselves and on the recipe pages.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 24 : 24,
            flexShrink: 0,
          }}
        >
          <FigureWithCaption caption="Figure 5">
            <FilterMenuMock open={false} />
          </FigureWithCaption>
          <FigureWithCaption caption="Figure 6">
            <FilterMenuMock open={true} />
          </FigureWithCaption>
        </div>
      </div>

      {/* Block 3: paragraph + Figure 7 (recipe cards) */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 32 : 60,
          alignItems: "flex-start",
        }}
      >
        <p
          style={{
            margin: 0,
            flex: "1 0 0",
            minWidth: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? 16 : 24,
            lineHeight: 1.2,
            color: C.white,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          For the recipe cards, we wanted to make sure we included a large
          enough section for{" "}
          <span style={{ fontWeight: 700 }}>a recipe photo</span> but also a{" "}
          <span style={{ fontWeight: 700 }}>descriptor</span> for the recipe
          that would be used to make the recipes more interesting or appealing
          or discuss a certain ingredient that was especially notable. We also
          included <span style={{ fontWeight: 700 }}>serving size</span> which
          was useful to users when faced with the idea of preparing a meal for
          others. We also wanted to include a clear{" "}
          <span style={{ fontWeight: 700 }}>arrow button</span> to direct users
          to select to see the full recipe page.
        </p>
        <div
          style={{
            flexShrink: 0,
            width: isMobile ? "100%" : 700,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <img
            src="/tns/RecipeCards.png"
            alt="Two recipe cards showing photo, title, descriptor, time, serving size, and arrow button"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
            }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: 1.2,
              color: C.white,
              letterSpacing: "1.28px",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Figure 7
          </p>
        </div>
      </div>

      {/* Block 4: Before/After recipe hub compare */}
      <RecipeBeforeAfterCompare isMobile={isMobile} />
    </div>
  );
}

function FigureWithCaption({ caption, children, fullWidth = false }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        width: fullWidth ? "100%" : "auto",
        flexShrink: 0,
      }}
    >
      {children}
      <p
        style={{
          margin: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: 1.2,
          color: C.white,
          letterSpacing: "1.28px",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {caption}
      </p>
    </div>
  );
}

function RecipeSearchCard({ isMobile }) {
  const tags = [
    "Quick and easy",
    "On a budget",
    "High protein",
    "Fiber-rich",
    "Healthy snacks",
    "Vegetarian",
    "Vegan",
    "Gluten-free",
  ];
  return (
    <div
      style={{
        width: "100%",
        background: C.crema,
        borderRadius: 27,
        padding: isMobile ? 20 : 29,
        display: "flex",
        flexDirection: "column",
        gap: 28,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p
          style={{
            margin: 0,
            fontFamily: "'Nunito Sans', sans-serif",
            fontWeight: 700,
            fontSize: isMobile ? 24 : 32,
            color: C.black,
          }}
        >
          Search Recipes
        </p>
        <div
          style={{
            background: C.white,
            border: "1.5px solid #595859",
            borderRadius: 27,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 17px",
            maxWidth: 630,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 600,
              fontSize: 17,
              color: "rgba(89,88,89,0.75)",
            }}
          >
            Type to search...
          </p>
          <SearchIcon size={20} color="#595859" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 16 : 32,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: C.crimson,
            borderRadius: 139,
            height: 48,
            padding: "0 17px",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: "1.28px",
              color: C.white,
            }}
          >
            FILTER
          </span>
          <FilterIcon size={18} color={C.white} />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            flex: "1 1 0",
            minWidth: 0,
          }}
        >
          {tags.map((t) => (
            <span
              key={t}
              style={{
                background: C.white,
                border: "1.5px solid #595859",
                borderRadius: 27,
                height: 40,
                padding: "0 17px",
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "'Nunito Sans', sans-serif",
                fontWeight: 600,
                fontSize: 17,
                color: "#13273a",
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterMenuMock({ open }) {
  const categories = [
    "Meal Type",
    "Cuisine",
    "Diets and Dietary Needs",
    "Time",
    "Difficulty",
    "Allergies",
  ];
  const mealItems = ["Breakfast", "Lunch", "Snacks", "Dinner", "Dessert"];
  return (
    <div
      style={{
        width: 338,
        maxWidth: "100%",
        borderRadius: 15,
        background: C.crimson,
        boxShadow: "3px 3px 48px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}
    >
      {/* FILTER header */}
      <div
        style={{
          background: C.crimson,
          height: 48,
          padding: "0 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: "1.28px",
              color: C.white,
            }}
          >
            FILTER
          </span>
          <FilterIcon size={18} color={C.white} />
        </div>
        <XIcon size={20} color={C.white} />
      </div>
      <div style={{ background: C.white }}>
        {categories.map((cat) => {
          const isOpenMeal = open && cat === "Meal Type";
          return (
            <div key={cat}>
              <div
                style={{
                  height: 55,
                  padding: "0 26px 0 20px",
                  borderBottom: "0.83px solid #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: isOpenMeal ? "#F1F0EA" : C.white,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: isOpenMeal ? "#830D1F" : C.black,
                  }}
                >
                  {cat}
                </span>
                <ChevronDown open={isOpenMeal} color={C.black} />
              </div>
              {isOpenMeal && (
                <div>
                  {mealItems.map((it) => {
                    const checked = it === "Lunch";
                    return (
                      <div
                        key={it}
                        style={{
                          padding: "14px 18px",
                          borderBottom: "0.75px solid #000",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          background: C.white,
                        }}
                      >
                        <span
                          style={{
                            width: 19,
                            height: 19,
                            border: "1.5px solid #000",
                            borderRadius: 1,
                            background: checked ? C.black : C.white,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {checked ? (
                            <span
                              style={{
                                color: C.white,
                                fontSize: 14,
                                lineHeight: 1,
                                fontWeight: 700,
                              }}
                            >
                              ✓
                            </span>
                          ) : null}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: checked ? 700 : 400,
                            fontSize: 18,
                            color: C.black,
                          }}
                        >
                          {it}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecipeCard({ title, desc, minutes, serves, hue }) {
  return (
    <div
      style={{
        width: 320,
        maxWidth: "100%",
        border: "1.35px solid #cccccc",
        borderRadius: 18,
        overflow: "hidden",
        background: C.white,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 180,
          background: `linear-gradient(135deg, ${hue}, #00000022)`,
        }}
      />
      <div
        style={{
          padding: 23,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          flex: "1 0 auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <p
            style={{
              margin: 0,
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#13273a",
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: "'Merriweather', serif",
              fontWeight: 300,
              fontSize: 18,
              lineHeight: 1.6,
              color: "#13273a",
            }}
          >
            {desc}
          </p>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ClockIcon size={20} color="#13273a" />
            <span
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: 20,
                color: "#13273a",
              }}
            >
              <strong>{minutes}</strong> min
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PersonIcon size={20} color="#13273a" />
            <span
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: 20,
                color: "#13273a",
              }}
            >
              Serves <strong>{serves}</strong>
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          background: C.crimson,
          borderTopLeftRadius: 16,
          padding: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ArrowRightIcon size={32} color={C.white} />
      </div>
    </div>
  );
}

const RECIPE_PAGES = [
  { id: "recipe-hub", label: "RECIPE HUB" },
  { id: "recipe-page", label: "RECIPE PAGE" },
];

const RECIPE_IMAGES = {
  "recipe-hub|before": {
    src: "/tns/OLD_RecipeHub.png",
    alt: "Original Nutrition Source recipe hub",
  },
  "recipe-hub|after": {
    src: "/tns/RecipeHub_new.png",
    alt: "Redesigned Nutrition Source recipe hub",
  },
  "recipe-page|before": {
    src: "/tns/RecipePage_OLD.png",
    alt: "Original Nutrition Source recipe page",
  },
  "recipe-page|after": {
    src: "/tns/RecipePage_new.png",
    alt: "Redesigned Nutrition Source recipe page",
  },
};

function RecipeBeforeAfterCompare({ isMobile }) {
  const [variant, setVariant] = useState("after");
  const [page, setPage] = useState("recipe-hub");
  const image = RECIPE_IMAGES[`${page}|${variant}`];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 20 : 30,
        alignItems: "stretch",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 29.948,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <button
          type="button"
          onClick={() => setVariant("before")}
          aria-pressed={variant === "before"}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: variant === "before" ? 700 : 300,
            fontSize: isMobile ? 22 : 34.1,
            lineHeight: 1.2,
            color: variant === "before" ? C.limon : C.white,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          BEFORE
        </button>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 1.5,
            height: isMobile ? 28 : 41,
            background: C.limon,
          }}
        />
        <button
          type="button"
          onClick={() => setVariant("after")}
          aria-pressed={variant === "after"}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: variant === "after" ? 700 : 300,
            fontSize: isMobile ? 22 : 34.1,
            lineHeight: 1.2,
            color: variant === "after" ? C.limon : C.white,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          AFTER
        </button>
      </div>
      <div
        style={{
          display: "flex",
          gap: isMobile ? 18 : 37.955,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          flexWrap: "wrap",
        }}
      >
        {RECIPE_PAGES.map((p) => {
          const active = p.id === page;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPage(p.id)}
              aria-pressed={active}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: active ? 700 : 300,
                fontSize: isMobile ? 14 : 22.773,
                lineHeight: 1.2,
                color: active ? C.limon : C.white,
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <div
        style={{
          width: isMobile ? "100%" : "93.333%",
          alignSelf: "center",
          border: `5.444px solid ${C.limon}`,
          borderRadius: 12,
          background: C.kale,
          overflowX: "hidden",
          overflowY: "auto",
          boxSizing: "border-box",
          position: "relative",
          aspectRatio: "16 / 10",
        }}
      >
        {image.src ? (
          <img
            src={image.src}
            alt={image.alt}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
            }}
          />
        ) : (
          <div
            style={{
              padding: "120px 40px",
              textAlign: "center",
              color: C.white,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 400,
              fontSize: isMobile ? 18 : 24,
              letterSpacing: "0.04em",
              opacity: 0.7,
            }}
          >
            Coming soon
          </div>
        )}
      </div>
    </div>
  );
}

function SearchIcon({ size = 20, color = "#000" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function FilterIcon({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="17" x2="14" y2="17" />
    </svg>
  );
}

function ClockIcon({ size = 20, color = "#13273a" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PersonIcon({ size = 20, color = "#13273a" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}

function ArrowRightIcon({ size = 32, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function NavBeforeAfterCompare({ isMobile }) {
  const [variant, setVariant] = useState("after");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 24 : 36,
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 29.948,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <button
          type="button"
          onClick={() => setVariant("before")}
          aria-pressed={variant === "before"}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: variant === "before" ? 700 : 300,
            fontSize: isMobile ? 22 : 34.1,
            lineHeight: 1.2,
            color: variant === "before" ? C.limon : C.white,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          BEFORE
        </button>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 1.5,
            height: isMobile ? 28 : 41,
            background: C.limon,
          }}
        />
        <button
          type="button"
          onClick={() => setVariant("after")}
          aria-pressed={variant === "after"}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: variant === "after" ? 700 : 300,
            fontSize: isMobile ? 22 : 34.1,
            lineHeight: 1.2,
            color: variant === "after" ? C.limon : C.white,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          AFTER
        </button>
      </div>
      <div
        style={{
          width: isMobile ? "100%" : "93.333%",
          alignSelf: "center",
          border: `5.444px solid ${C.limon}`,
          borderRadius: 12,
          background: C.kale,
          position: "relative",
          overflow: "hidden",
          aspectRatio: "1440 / 800",
        }}
      >
        {variant === "before" ? (
          <img
            src={A.oldPrimaryNav}
            alt="Original Nutrition Source primary navigation"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        ) : (
          <NewNavInteractive isMobile={isMobile} />
        )}
      </div>
      <p
        style={{
          margin: 0,
          alignSelf: "center",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: 1.2,
          color: C.white,
          letterSpacing: "1.28px",
          textTransform: "uppercase",
        }}
      >
        Figure 1
      </p>
    </div>
  );
}

function NewNavInteractive({ isMobile }) {
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const DESIGN_W = 1440;
  const NAV_HEIGHT = 182;

  useEffect(() => {
    const el = outerRef.current;
    if (!el || isMobile) return;
    const apply = () => {
      const w = el.getBoundingClientRect().width;
      setScale(w / DESIGN_W);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  const navInner = (
    <div
      style={{
        width: DESIGN_W,
        background: C.white,
        fontFamily: "'Nunito Sans', sans-serif",
      }}
      onMouseLeave={() => {
        setSelected(null);
        setHoveredId(null);
      }}
    >
      {/* HSPH banner */}
      <div
        style={{
          background: C.crimson,
          padding: "13px 46px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={A.newNavHsphLogo}
          alt="Harvard T.H. Chan School of Public Health"
          style={{ height: 32, width: "auto", display: "block" }}
        />
      </div>

      {/* White nav row */}
      <div
        style={{
          background: C.white,
          display: "flex",
          alignItems: "center",
          paddingBottom: 10,
          borderBottom: "1px solid #c5c5c5",
        }}
      >
        <div style={{ width: 292, height: 113, position: "relative", flexShrink: 0 }}>
          <img
            src={A.newNavTnsLogo}
            alt="The Nutrition Source"
            style={{
              position: "absolute",
              left: 43,
              top: 18,
              width: 229,
              height: 79,
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            minWidth: 0,
          }}
        >
          {/* Primary nav (small row) */}
          <div
            style={{ display: "flex", alignItems: "center", paddingRight: 30 }}
          >
            {[
              { label: "Search", withIcon: true },
              { label: "Nutrition News" },
              { label: "About" },
              { label: "Donate" },
            ].map(({ label, withIcon }) => {
              const id = `primary-${label}`;
              const isHover = hoveredId === id;
              return (
                <button
                  key={label}
                  type="button"
                  onMouseEnter={() => {
                    setHoveredId(id);
                    setSelected(null);
                  }}
                  style={primaryNavBtnStyle({ withIcon, isHover })}
                >
                  {withIcon && (
                    <span
                      aria-hidden
                      style={{
                        width: 18,
                        height: 18,
                        display: "block",
                        backgroundColor: isHover ? C.crimson : C.black,
                        WebkitMaskImage: `url(${A.newNavSearch})`,
                        maskImage: `url(${A.newNavSearch})`,
                        WebkitMaskSize: "contain",
                        maskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskPosition: "center",
                        transition: "background-color 0.12s ease",
                      }}
                    />
                  )}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary nav row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 30,
              width: "100%",
              position: "relative",
            }}
          >
            {NEW_NAV_SECONDARY_ITEMS.map((item) => {
              const id = `secondary-${item.label}`;
              const isOpen = item.key && selected === item.key;
              const hasDropdown = Boolean(item.key);
              const isHover = hoveredId === id;
              const textCrimson = !hasDropdown && isHover;
              return (
                <div
                  key={item.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => {
                    setHoveredId(id);
                    if (hasDropdown) setSelected(item.key);
                    else setSelected(null);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasDropdown) return;
                      setSelected((cur) => (cur === item.key ? null : item.key));
                    }}
                    aria-expanded={hasDropdown ? isOpen : undefined}
                    style={{
                      ...(item.width ? { width: item.width } : {}),
                      padding: "12px 17px",
                      background: isOpen ? C.crimson : C.white,
                      border: "none",
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 21,
                      letterSpacing: -0.315,
                      color: isOpen ? C.white : textCrimson ? C.crimson : C.black,
                      borderTopLeftRadius: isOpen ? 8 : 0,
                      borderTopRightRadius: isOpen ? 8 : 0,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 2,
                      transition: "background 0.12s ease, color 0.12s ease",
                    }}
                  >
                    {item.label}
                  </button>
                  {isOpen && <NewNavDropdown menuKey={item.key} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <div style={{ minWidth: DESIGN_W }}>{navInner}</div>
      </div>
    );
  }

  return (
    <div
      ref={outerRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: DESIGN_W,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        {navInner}
      </div>
    </div>
  );
}

function primaryNavBtnStyle({ withIcon = false, isHover = false } = {}) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: withIcon ? 4 : 0,
    padding: "12.134px 17.191px",
    background: C.white,
    border: "none",
    fontFamily: "'Nunito Sans', sans-serif",
    fontWeight: 700,
    fontSize: 16.18,
    letterSpacing: -0.2427,
    color: isHover ? C.crimson : C.black,
    whiteSpace: "nowrap",
    cursor: "pointer",
    transition: "color 0.12s ease",
  };
}

function NewNavDropdown({ menuKey }) {
  const menu = NEW_NAV_MENUS[menuKey];
  const alignments = {
    WSIE: { left: 0, width: 672 },
    WSID: { left: 0, width: 634 },
    DAD: { right: 0, width: 597 },
    EM: { right: 0, width: 738 },
  };
  const align = alignments[menuKey];
  const isEm = menuKey === "EM";

  return (
    <div
      role="menu"
      style={{
        position: "absolute",
        top: "100%",
        ...align,
        background: C.white,
        border: `3px solid ${C.crimson}`,
        borderRadius: "0 0 8px 8px",
        boxShadow: "6px 6px 19.5px rgba(0,0,0,0.07)",
        zIndex: 10,
        textAlign: "left",
        marginTop: -3,
        overflow: "hidden",
        display: "flex",
        flexDirection: isEm ? "column" : "row",
        gap: isEm ? 15 : 32,
        padding: isEm ? "0 0 16px 0" : "16px 28px",
      }}
    >
      {isEm
        ? menu.sections.map((section) => (
            <div
              key={section.title}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  background: C.crimson,
                  color: C.white,
                  padding: "6px 14px",
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {section.title}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  padding: "8px 20px 0",
                  alignItems: "flex-start",
                }}
              >
                {section.columns.map((col, ci) => (
                  <NewNavDropdownColumn key={ci} items={col} />
                ))}
              </div>
            </div>
          ))
        : menu.columns.map((col, ci) => (
            <NewNavDropdownColumn key={ci} items={col} />
          ))}
    </div>
  );
}

function NewNavDropdownColumn({ items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((label) => (
        <NewNavDropdownItem key={label} label={label} />
      ))}
    </div>
  );
}

function NewNavDropdownItem({ label }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "8px 0",
        background: "transparent",
        border: "none",
        fontFamily: "'Nunito Sans', sans-serif",
        fontWeight: 500,
        fontSize: 18,
        lineHeight: 1.6,
        color: hover ? C.crimson : C.black,
        cursor: "pointer",
        whiteSpace: "nowrap",
        textAlign: "left",
        transition: "color 0.12s ease",
      }}
    >
      {label}
    </button>
  );
}

/* ---------- Main ---------- */
export default function NutritionSourceCaseStudy() {
  const isMobile = useIsMobile();
  const scale = useDesignScale();
  const [interviewsRevealed, setInterviewsRevealed] = useState(false);
  const interviewsRef = useRef(null);

  const handleOpenInterviews = () => {
    setInterviewsRevealed(true);
    requestAnimationFrame(() => {
      interviewsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleCloseInterviews = () => {
    setInterviewsRevealed(false);
  };

  const inner = (
    <>
      <Nav isMobile={isMobile} />
      <Hero isMobile={isMobile} />
      <TeamCredit isMobile={isMobile} />
      <BeforeAfterSection isMobile={isMobile} />
      <BreakdownDivider isMobile={isMobile} />
      <StatCarousel isMobile={isMobile} />
      <EnterTNS isMobile={isMobile} />
      <WhatTheySaid
        isMobile={isMobile}
        onOpenInterviews={handleOpenInterviews}
      />
      <QualitativeInterviews
        revealed={interviewsRevealed}
        onClose={handleCloseInterviews}
        isMobile={isMobile}
        sectionRef={interviewsRef}
      />
      <UsabilityBanner isMobile={isMobile} />
      <KeyFindings isMobile={isMobile} />
      <IssuesSection isMobile={isMobile} />
      <FinalThoughts isMobile={isMobile} />
    </>
  );

  if (isMobile) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: C.kale,
          overflowX: "hidden",
        }}
      >
        {inner}
      </div>
    );
  }

  // Desktop: scale the 1440-wide design canvas to viewport width so the
  // layout stays pixel-accurate at any monitor width below the design.
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: C.kale,
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          width: DESIGN_W,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          marginBottom: `calc((${scale} - 1) * 100vh)`,
        }}
      >
        {inner}
      </div>
    </div>
  );
}
