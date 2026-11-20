import { useEffect, useRef, useState } from "react";
import { C, F, DM_SANS_OPSZ } from "./tnsShared.jsx";

// Site-wide nav: "MARS NEVADA" on the left, the practice areas on the right.
// "Research" and "Design" each open a dropdown of pages.

export const CASE_STUDIES = [
  { route: "nutrition-source", label: "The Nutrition Source", href: "#/nutrition-source" },
  { route: "nebo", label: "Nebo", href: "#/nebo" },
];
export const RESEARCH = [
  { route: "queering-intake-forms", label: "Queering Intake Form Design", href: "#/queering-intake-forms" },
];
const MENUS = [
  { label: "Research", items: RESEARCH },
  { label: "Design", items: CASE_STUDIES },
];

// Text that turns bold without moving anything around it: an invisible bold
// copy is stacked in the same grid cell, so the box is always bold-width.
function NoShiftBold({ bold, children }) {
  return (
    <span style={{ display: "inline-grid" }}>
      <span style={{ gridArea: "1 / 1", fontWeight: bold ? 700 : 400 }}>{children}</span>
      <span aria-hidden="true" style={{ gridArea: "1 / 1", fontWeight: 700, visibility: "hidden" }}>
        {children}
      </span>
    </span>
  );
}

function NavMenu({ label, items, current, textStyle }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const down = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      style={{ position: "relative", display: "inline-flex" }}
      // Hover opens it for mouse users only; touch taps would otherwise
      // fire a hover-open followed by a click-close.
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setOpen(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setOpen(false); }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        style={{ ...textStyle, background: "none", border: "none", padding: 0, cursor: "pointer" }}
      >
        <NoShiftBold bold={open || items.some((cs) => cs.route === current)}>{label}</NoShiftBold>
      </button>
      {open && (
        <span style={{ position: "absolute", top: "100%", left: 0, paddingTop: 10, zIndex: 40 }}>
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              background: C.sand50,
              border: `1px solid ${C.navy}`,
              borderRadius: 8,
              padding: "8px 0",
              boxShadow: "0 8px 24px rgba(16,9,76,0.12)",
            }}
          >
            {items.map((cs) => {
              const active = current === cs.route;
              return (
                <a
                  key={cs.route}
                  href={cs.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setHover(cs.route)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(cs.route)}
                  onBlur={() => setHover(null)}
                  style={{
                    ...textStyle,
                    fontFamily: F.sans,
                    ...DM_SANS_OPSZ,
                    fontSize: 20,
                    textDecoration: "none",
                    padding: "10px 20px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <NoShiftBold bold={active || hover === cs.route}>{cs.label}</NoShiftBold>
                </a>
              );
            })}
          </span>
        </span>
      )}
    </span>
  );
}

function MobileMenu({ current }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const down = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  const bar = (transform, opacity = 1) => ({
    position: "absolute", left: 0, width: 24, height: 2, borderRadius: 1, background: C.navy,
    transition: "transform 200ms ease, opacity 150ms ease", transform, opacity,
  });
  return (
    <div ref={ref}>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-mobile-menu"
        onClick={() => setOpen((v) => !v)}
        style={{ background: "none", border: "none", padding: 10, margin: -10, cursor: "pointer", display: "block" }}
      >
        <span style={{ position: "relative", display: "block", width: 24, height: 18 }}>
          <span style={{ ...bar(open ? "translateY(8px) rotate(45deg)" : "none"), top: 0 }} />
          <span style={{ ...bar("none", open ? 0 : 1), top: 8 }} />
          <span style={{ ...bar(open ? "translateY(-8px) rotate(-45deg)" : "none"), top: 16 }} />
        </span>
      </button>
      {open && (
        <div
          id="site-mobile-menu"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: C.sand50,
            borderBottom: `1px solid ${C.navy}`,
            boxShadow: "0 12px 24px rgba(16,9,76,0.12)",
            padding: "20px 20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {MENUS.map((menu, mi) => (
            <div key={menu.label} style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: mi ? 16 : 0 }}>
              <p style={{ margin: "0 0 6px", fontFamily: F.mono, fontSize: 13, letterSpacing: "0.26px", textTransform: "uppercase", color: C.navy }}>
                {menu.label}
              </p>
              {menu.items.map((cs) => {
                const active = current === cs.route;
                return (
                  <a
                    key={cs.route}
                    href={cs.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: F.sans,
                      ...DM_SANS_OPSZ,
                      fontWeight: active ? 700 : 400,
                      fontSize: 22,
                      lineHeight: "30px",
                      color: C.navy,
                      textDecoration: "none",
                      padding: "8px 0",
                    }}
                  >
                    {cs.label}
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SiteNav({ isMobile, current }) {
  const text = {
    margin: 0,
    fontSize: isMobile ? 16 : 24,
    lineHeight: "normal",
    color: C.navy,
  };
  const plex = { ...text, fontFamily: F.plex, fontWeight: 400 };
  return (
    <nav
      style={{
        position: "relative",
        zIndex: 20,
        background: C.lime100,
        display: "flex",
        alignItems: isMobile ? "center" : "flex-end",
        gap: 10,
        padding: isMobile ? "18px 20px" : "28px 64px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <a href="#/" style={{ ...text, flex: "1 0 0", fontFamily: F.mono, fontWeight: 500, textDecoration: "none" }}>
        MARS NEVADA
      </a>
      {isMobile ? (
        <MobileMenu current={current} />
      ) : (
        <div style={{ ...plex, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "baseline" }}>
          <NavMenu label="Research" items={RESEARCH} current={current} textStyle={plex} />
          <span aria-hidden="true">&amp;</span>
          <NavMenu label="Design" items={CASE_STUDIES} current={current} textStyle={plex} />
          <span aria-hidden="true">&amp;</span>
          <span>Health Storytelling</span>
        </div>
      )}
    </nav>
  );
}

// Placeholder home page until the new homepage is built.
export function UnderConstruction({ isMobile }) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.sand50 }}>
      <SiteNav isMobile={isMobile} current="home" />
      <section style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: F.mono,
            fontWeight: 400,
            fontSize: isMobile ? 28 : 48,
            letterSpacing: isMobile ? "0.56px" : "0.96px",
            color: C.navy,
            textAlign: "center",
          }}
        >
          Under construction
        </h1>
      </section>
    </main>
  );
}
