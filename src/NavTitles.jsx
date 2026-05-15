import { useState } from "react";

// Shared primary-nav job-title block used across the homepage and case
// studies. Each label uses a lighter weight by default and goes bold on
// hover/focus. "Product Designer" reveals a dropdown of case studies.

const CASE_STUDIES = [
  { route: "nutrition-source", label: "The Nutrition Source", href: "#/nutrition-source" },
  { route: "nebo", label: "Nebo", href: "#/nebo" },
];

export default function NavTitles({ color, isMobile, currentRoute }) {
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(false);

  const baseStyle = (key) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: hovered === key || (key === "product" && open) ? 700 : 300,
    fontSize: isMobile ? 13 : 22,
    lineHeight: 1.142,
    color,
    fontVariationSettings: "'opsz' 14",
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textDecoration: "none",
    transition: "font-weight 0.15s",
    whiteSpace: "nowrap",
  });

  const sep = (
    <span aria-hidden style={{ color, opacity: 0.55, padding: "0 8px" }}>
      \
    </span>
  );

  if (isMobile) {
    return (
      <a
        href="#/about"
        style={{ ...baseStyle("about"), fontWeight: hovered === "about" ? 700 : 500 }}
        onMouseEnter={() => setHovered("about")}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered("about")}
        onBlur={() => setHovered(null)}
      >
        About
      </a>
    );
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      <span
        tabIndex={0}
        style={baseStyle("art")}
        onMouseEnter={() => setHovered("art")}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered("art")}
        onBlur={() => setHovered(null)}
      >
        Sr. Art Director
      </span>
      {sep}
      <div
        style={{ position: "relative", display: "inline-flex" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setHovered("product")}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered("product")}
          onBlur={() => setHovered(null)}
          style={baseStyle("product")}
        >
          Product Designer
        </button>
        {open && (
          <div
            role="menu"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              paddingTop: 12,
              zIndex: 30,
            }}
          >
            <div
              style={{
                background: "#FFF9E0",
                border: `1px solid ${color}`,
                borderRadius: 12,
                padding: "10px 0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                minWidth: 240,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {CASE_STUDIES.map((cs) => {
                const active = currentRoute === cs.route;
                const isHover = hovered === `cs-${cs.route}`;
                return (
                  <a
                    key={cs.route}
                    href={cs.href}
                    role="menuitem"
                    onMouseEnter={() => setHovered(`cs-${cs.route}`)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(`cs-${cs.route}`)}
                    onBlur={() => setHovered(null)}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: isHover || active ? 700 : 300,
                      fontSize: 20,
                      lineHeight: 1.2,
                      color,
                      fontVariationSettings: "'opsz' 14",
                      textDecoration: "none",
                      padding: "10px 20px",
                      whiteSpace: "nowrap",
                      transition: "font-weight 0.15s",
                    }}
                  >
                    {cs.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {sep}
      <a
        href="#/about"
        style={baseStyle("about")}
        onMouseEnter={() => setHovered("about")}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered("about")}
        onBlur={() => setHovered(null)}
      >
        About
      </a>
    </div>
  );
}
