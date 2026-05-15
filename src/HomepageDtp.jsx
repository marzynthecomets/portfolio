import { useState, useRef, useCallback, useEffect } from "react";
import { ts, srOnly } from "./theme.js";
import NavTitles from "./NavTitles.jsx";

const TOTAL_FRAMES = 184;
const ROTATION_INTERVAL_MS = 60;
const KEY_NUDGE = 2;
const DESIGN_W = 1440;
const DESIGN_H = 1128;
const frameSrc = (i) => `/spinner/frame_${String(i).padStart(3, "0")}.png`;

const COLORS = {
  limon: "#EDFF46",
  neptune: "#0400E8",
  navText: "#0300B4",
  bodyText: "#3B00AD",
  accent: "#FF8400",
};

// Stickers swing left/right as the bottle rotates. peakFrame = the frame where
// the sticker faces forward. Position is derived from sin/cos of the rotation
// angle relative to that peak.
const TRACK = {
  period: TOTAL_FRAMES, // frames per full rotation
  centerX: 240, // bottle horizontal center within bottleStage (500 wide)
  radius: 85, // how far the sticker swings off-center, in px
  baseCircleSize: 220,
  pillOffsetY: 140, // pill sits this many px above circle center
  visibilityCos: 0.2, // sticker is "in front" when cos(angle) exceeds this
};

const STICKERS = [
  {
    id: "nutrition-source",
    label: "Making Nutrition Education Digestible",
    peakFrame: 0,
    centerY: 350,
    href: "#/nutrition-source",
  },
  {
    id: "nebo",
    label: "AN EDUCATIONAL ASTRONOMY CHATBOT",
    peakFrame: 50,
    centerY: 460,
    href: "#/nebo",
  },
  {
    id: "diaspora-dna",
    label: "REIMAGINING DATA LIFECYCLES FOR ARTS NONPROFITS",
    peakFrame: 115,
    centerY: 460,
  },
];

function trackSticker(sticker, frame) {
  const angle =
    (-2 * Math.PI * (frame - sticker.peakFrame)) / TRACK.period;
  const sinA = Math.sin(angle);
  const cosA = Math.cos(angle);
  return {
    visible: cosA > TRACK.visibilityCos,
    x: TRACK.centerX + TRACK.radius * sinA,
    y: sticker.centerY,
    scale: Math.max(0.55, cosA),
  };
}

const MOBILE_BREAKPOINT = 900;

function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function HomepageDtp() {
  const isMobile = useIsMobile();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [gridView, setGridView] = useState(false);
  const [hoveredSticker, setHoveredSticker] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const dragStart = useRef(null);

  // Desktop: scale the 1440-wide design canvas to viewport width (cap upscale
  // at 1.5x). Mobile uses a separate native layout so the scale factor is
  // unused there.
  useEffect(() => {
    if (isMobile) return;
    const update = () => {
      const s = Math.min(window.innerWidth / DESIGN_W, 1.5);
      setScale(s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isMobile]);

  // Auto-rotate
  useEffect(() => {
    if (!isPlaying || isDragging) return;
    const id = setInterval(() => {
      setCurrentFrame((f) => (f + 1) % TOTAL_FRAMES);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPlaying, isDragging]);

  // Keyboard: ← → nudge, Space play/pause
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentFrame(
          (f) => (f - KEY_NUDGE + TOTAL_FRAMES) % TOTAL_FRAMES
        );
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentFrame((f) => (f + KEY_NUDGE) % TOTAL_FRAMES);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleDragStart = useCallback(
    (e) => {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      dragStart.current = { x, frame: currentFrame };
      setIsDragging(true);
      e.preventDefault();
    },
    [currentFrame]
  );

  const handleDragMove = useCallback((e) => {
    if (!dragStart.current) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - dragStart.current.x;
    // On mobile the bottle is rendered smaller, so a given finger movement
    // covers fewer logical CSS pixels — divide by less to keep dragging
    // feeling responsive at native finger speeds.
    const delta = Math.round(dx / (isMobile ? 2.5 : 4));
    const next =
      ((dragStart.current.frame - delta) % TOTAL_FRAMES + TOTAL_FRAMES) %
      TOTAL_FRAMES;
    setCurrentFrame(next);
  }, [isMobile]);

  const handleDragEnd = useCallback(() => {
    if (!dragStart.current) return;
    dragStart.current = null;
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove);
    window.addEventListener("touchend", handleDragEnd);
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  if (isMobile) {
    const mobileStageScale = 0.7;
    const stageHeight = 920 * mobileStageScale; // matches bottleStage height
    return (
      <div style={S.mobileRoot}>
        <nav style={S.mobileNav}>
          <p style={S.mobileLogo}>Mars Nevada</p>
          <NavTitles color={COLORS.neptune} isMobile currentRoute="home" />
        </nav>

        <main style={S.mobileMain}>
          <div style={S.mobileHero}>
            <p style={S.mobileEyebrow}>Hi, i&rsquo;m mars &amp; i like to</p>
            <h1 style={S.mobileHeadline}>
              stay curious,
              <br />
              stay thirsty!
            </h1>
            <p style={S.mobileBody}>
              Spin the bottle to explore my case studies or{" "}
              <button
                type="button"
                role="switch"
                aria-checked={gridView}
                aria-label="Toggle grid view"
                onClick={() => setGridView((v) => !v)}
                style={S.toggleTrack}
              >
                <span
                  style={{
                    ...S.toggleDot,
                    left: gridView ? "calc(100% - 18px - 5px)" : "5px",
                  }}
                />
              </button>{" "}
              <span style={S.bodyBold}>view as a grid.</span>
            </p>
          </div>

          <div
            style={{
              width: 500 * mobileStageScale,
              height: stageHeight,
              position: "relative",
              alignSelf: "center",
              touchAction: "none",
              userSelect: "none",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div
              style={{
                width: 500,
                height: 920,
                position: "absolute",
                top: 0,
                left: 0,
                transformOrigin: "top left",
                transform: `scale(${mobileStageScale})`,
              }}
            >
              <img
                src={frameSrc(currentFrame)}
                alt="Spinning bottle"
                style={S.bottleImg}
                draggable={false}
              />
              {STICKERS.map((s) => {
                const pos = trackSticker(s, currentFrame);
                const active = hoveredSticker === s.id;
                const size = TRACK.baseCircleSize * pos.scale;
                const innerInset = size * 0.064;
                return (
                  <div key={s.id}>
                    <div
                      style={{
                        position: "absolute",
                        top: `${pos.y}px`,
                        left: `${pos.x}px`,
                        transform: "translate(-50%, -50%)",
                        width: `${size}px`,
                        height: `${size}px`,
                        borderRadius: "50%",
                        zIndex: 3,
                        pointerEvents: pos.visible ? "auto" : "none",
                        cursor: s.href ? "pointer" : "default",
                      }}
                      onMouseEnter={() => setHoveredSticker(s.id)}
                      onMouseLeave={() => setHoveredSticker(null)}
                      onClick={() => {
                        if (s.href && pos.visible) {
                          window.location.hash = s.href.replace(/^#/, "");
                        }
                      }}
                    >
                      <div
                        style={{
                          ...S.ringOuter,
                          opacity: active && pos.visible ? 1 : 0,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: `${innerInset}px`,
                          left: `${innerInset}px`,
                          width: `${size - innerInset * 2}px`,
                          height: `${size - innerInset * 2}px`,
                          borderRadius: "50%",
                          border: `3px solid ${COLORS.limon}`,
                          boxShadow: `0 0 0 1px ${COLORS.neptune}`,
                          transition: "opacity 0.18s ease",
                          pointerEvents: "none",
                          opacity: active && pos.visible ? 1 : 0,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        ...S.pill,
                        top: `${pos.y - TRACK.pillOffsetY}px`,
                        left: `${pos.x}px`,
                        opacity: active && pos.visible ? 1 : 0,
                        transform: `translate(-50%, ${
                          active && pos.visible ? "0" : "8px"
                        })`,
                      }}
                    >
                      <p style={S.pillText}>{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: `${DESIGN_H * scale}px`,
        overflow: "hidden",
        background: "#EFEFEF",
        position: "relative",
      }}
    >
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        {/* Yellow nav bar */}
        <nav style={S.nav}>
          <p style={S.logo}>Mars Nevada</p>
          <NavTitles
            color={COLORS.neptune}
            isMobile={false}
            currentRoute="home"
          />
        </nav>

        {/* Hero text block */}
        <div style={S.hero}>
          <div style={S.heroHeadingGroup}>
            <p style={S.eyebrow}>Hi, i&rsquo;m mars &amp; i like to</p>
            <h1 style={S.headline}>
              stay curious,
              <br />
              stay thirsty!
            </h1>
          </div>
          <p style={S.body}>
            Spin the bottle to explore my case studies or{" "}
            <button
              type="button"
              role="switch"
              aria-checked={gridView}
              aria-label="Toggle grid view"
              onClick={() => setGridView((v) => !v)}
              style={S.toggleTrack}
            >
              <span
                style={{
                  ...S.toggleDot,
                  left: gridView ? "calc(100% - 18px - 5px)" : "5px",
                }}
              />
            </button>{" "}
            <span style={S.bodyBold}>view as a grid.</span>
          </p>
        </div>

        {/* Bottle */}
        <div
          style={{
            ...S.bottleStage,
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <img
            src={frameSrc(currentFrame)}
            alt="Spinning bottle"
            style={S.bottleImg}
            draggable={false}
          />

          {/* Per-study hover hotspots + pills (track sticker as bottle spins) */}
          {STICKERS.map((s) => {
            const pos = trackSticker(s, currentFrame);
            const active = hoveredSticker === s.id;
            const size = TRACK.baseCircleSize * pos.scale;
            const innerInset = size * 0.064;
            return (
              <div key={s.id}>
                <div
                  style={{
                    position: "absolute",
                    top: `${pos.y}px`,
                    left: `${pos.x}px`,
                    transform: "translate(-50%, -50%)",
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: "50%",
                    zIndex: 3,
                    pointerEvents: pos.visible ? "auto" : "none",
                    cursor: s.href ? "pointer" : "default",
                  }}
                  onMouseEnter={() => setHoveredSticker(s.id)}
                  onMouseLeave={() => setHoveredSticker(null)}
                  onClick={() => {
                    if (s.href && pos.visible) {
                      window.location.hash = s.href.replace(/^#/, "");
                    }
                  }}
                >
                  <div
                    style={{
                      ...S.ringOuter,
                      opacity: active && pos.visible ? 1 : 0,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: `${innerInset}px`,
                      left: `${innerInset}px`,
                      width: `${size - innerInset * 2}px`,
                      height: `${size - innerInset * 2}px`,
                      borderRadius: "50%",
                      border: `3px solid ${COLORS.limon}`,
                      boxShadow: `0 0 0 1px ${COLORS.neptune}`,
                      transition: "opacity 0.18s ease",
                      pointerEvents: "none",
                      opacity: active && pos.visible ? 1 : 0,
                    }}
                  />
                </div>
                <div
                  style={{
                    ...S.pill,
                    top: `${pos.y - TRACK.pillOffsetY}px`,
                    left: `${pos.x}px`,
                    opacity: active && pos.visible ? 1 : 0,
                    transform: `translate(-50%, ${
                      active && pos.visible ? "0" : "8px"
                    })`,
                  }}
                >
                  <p style={S.pillText}>{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Keyboard hint */}
        <div style={S.kbdHint} aria-hidden>
          drag · ← → · space {isPlaying ? "pause" : "play"}
        </div>
      </div>
    </div>
  );
}

const S = {
  nav: {
    background: COLORS.limon,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "32px 80px 30px",
    width: "100%",
    margin: 0,
    position: "relative",
    zIndex: 5,
  },
  logo: {
    flex: "1 0 0",
    margin: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: "40px",
    lineHeight: 1.142,
    color: COLORS.neptune,
    fontVariationSettings: "'opsz' 14",
  },
  navLinks: {
    margin: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: "32px",
    lineHeight: 1.142,
    color: COLORS.neptune,
    whiteSpace: "nowrap",
    fontVariationSettings: "'opsz' 14",
  },
  hero: {
    position: "absolute",
    left: "80px",
    top: "280px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    alignItems: "flex-start",
    zIndex: 2,
    width: "540px",
  },
  heroHeadingGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "flex-start",
    color: COLORS.neptune,
    lineHeight: 1.142,
  },
  eyebrow: {
    margin: 0,
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "28px",
    textTransform: "uppercase",
  },
  headline: {
    margin: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 900,
    fontSize: "76px",
    whiteSpace: "pre-wrap",
    fontVariationSettings: "'opsz' 14",
  },
  body: {
    margin: 0,
    color: COLORS.neptune,
    fontSize: "26px",
    lineHeight: 1.29,
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
  },
  bodyBold: {
    fontWeight: 700,
    color: COLORS.neptune,
  },
  toggleTrack: {
    position: "relative",
    width: "64px",
    height: "34px",
    borderRadius: "200px",
    background: COLORS.neptune,
    border: `3px solid ${COLORS.neptune}`,
    padding: 0,
    cursor: "pointer",
    overflow: "hidden",
    display: "inline-block",
    verticalAlign: "middle",
    boxSizing: "border-box",
    margin: "0 4px",
  },
  toggleDot: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "18px",
    height: "18px",
    borderRadius: "200px",
    background: COLORS.accent,
    border: `3px solid ${COLORS.limon}`,
    transition: "left 0.18s ease",
    boxSizing: "border-box",
  },
  bottleStage: {
    position: "absolute",
    left: "720px",
    top: "150px",
    width: "500px",
    height: "920px",
    userSelect: "none",
    touchAction: "none",
    zIndex: 1,
  },
  bottleImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center top",
    pointerEvents: "none",
  },
  ringOuter: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: `3px solid ${COLORS.limon}`,
    boxShadow: `0 0 0 1px ${COLORS.neptune}`,
    transition: "opacity 0.18s ease",
    pointerEvents: "none",
  },
  pill: {
    position: "absolute",
    background: COLORS.neptune,
    border: `2px solid ${COLORS.limon}`,
    borderRadius: "200px",
    padding: "10px 19px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "2px 4px 14.8px rgba(0, 0, 0, 0.25)",
    transition: "opacity 0.18s ease, transform 0.18s ease",
    pointerEvents: "none",
    zIndex: 4,
    whiteSpace: "nowrap",
  },
  pillText: {
    margin: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 800,
    fontSize: "20.8px",
    lineHeight: "normal",
    color: COLORS.limon,
    fontVariationSettings: "'opsz' 14",
  },
  kbdHint: {
    position: "absolute",
    right: "24px",
    bottom: "24px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "13px",
    color: COLORS.neptune,
    opacity: 0.5,
    letterSpacing: "0.04em",
    pointerEvents: "none",
  },
  mobileRoot: {
    background: "#EFEFEF",
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden",
  },
  mobileNav: {
    background: COLORS.limon,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
  },
  mobileLogo: {
    flex: "1 0 0",
    margin: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: 1.142,
    color: COLORS.neptune,
    fontVariationSettings: "'opsz' 14",
  },
  mobileNavLinks: {
    margin: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: "13px",
    lineHeight: 1.142,
    color: COLORS.neptune,
    fontVariationSettings: "'opsz' 14",
  },
  mobileMain: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "28px 24px 48px",
    boxSizing: "border-box",
  },
  mobileHero: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    color: COLORS.neptune,
  },
  mobileEyebrow: {
    margin: 0,
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    textTransform: "uppercase",
    color: COLORS.neptune,
    lineHeight: 1.142,
  },
  mobileHeadline: {
    margin: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 900,
    fontSize: "44px",
    lineHeight: 1.05,
    color: COLORS.neptune,
    fontVariationSettings: "'opsz' 14",
  },
  mobileBody: {
    margin: 0,
    color: COLORS.neptune,
    fontSize: "17px",
    lineHeight: 1.35,
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
  },
};
