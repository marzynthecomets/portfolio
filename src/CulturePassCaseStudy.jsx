import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FONTS, ts } from "./theme.js";
import NavTitles from "./NavTitles.jsx";

/* ============================================================
   CULTURE PASS — Service Design Blueprint
   Page background, paper cards, treatments per the spec MD.
   Intro/hero/sections use the portfolio type system (ts).
   ============================================================ */

const C = {
  bg: "#01004E",
  crema: "#FCFBF7",
  kale: "#012D04",
  lavender: "#D1D4FF",
  white: "#FFFFFF",
  ink: "#1A1A1A",
  ivory: "#FFFEF5",
  graph: "#F8F9FA",
  gridLine: "rgba(100,140,200,0.10)",
  tape: "rgba(212,180,140,0.55)",
  divider: "rgba(255,255,255,0.6)",
  dashed: "rgba(255,255,255,0.85)",
  caption: "rgba(255,255,255,0.5)",
  pinHi: "#FFF8CC",
  pinMid: "#FFE066",
  pinLo: "#E6B800",
};

const FNT = {
  ui: "'DM Sans', sans-serif",
  hand: "'Mynerve', cursive",
  mono: "'IBM Plex Mono', monospace",
};

const MOBILE_BREAKPOINT = 900;

const A = {
  heroBg: "/culturepass/hero-nypl-building.png",
  nyplLogo: "/culturepass/nypl-logo-mark.png",
  coffee: "/culturepass/curated-lifestyle-ho-RRxDKRzQ-unsplash.jpg",
  nyplTcs: "/culturepass/NYPL_TCS.PNG",
  nyplDocs: "/culturepass/NYPL_Docs.PNG",
  libraryCardSearch: "/culturepass/librarycardsearch.PNG",
  nyplCardInfo: "/culturepass/nypl_cardinfo.PNG",
  localLibraries: "/culturepass/locallibraries.PNG",
  nyplEntrance: "/culturepass/NYPL_Entrance.png",
  nyplLineSign: "/culturepass/NYPL_LineSign.png",
  nyplInLine: "/culturepass/NYPL_InLine.png",
  nyplDeskSign: "/culturepass/NYPL_DeskSign.png",
  nyplDeskWorker: "/culturepass/NYPL_DeskWorker.png",
  keychain: "/culturepass/Keychain.png",
  pscOrg: "/culturepass/PSC_orgdescription.png",
  pscOffers: "/culturepass/PSC_Offers.png",
  pscOfferDetail: "/culturepass/PSC_OfferDescription.png",
  pscReserve: "/culturepass/PSC_ReservePass.png",
  emailConfirm: "/culturepass/CPass_EmailConfirmation.png",
  myReservations: "/culturepass/CP_MyReservations.png",
  pscMyResMobile: "/culturepass/PSC_MyResMobile.PNG",
  pscRetrievalConfirm: "/culturepass/PSC_RetrievalConfirmation.PNG",
  pscTicket: "/culturepass/PSC_Ticket.PNG",
  pscDirections: "/culturepass/PSC_Directions.PNG",
  pscCheckin: "/culturepass/PSC_Checkin.png",
  pscPaperTicket: "/culturepass/PSC_PaperTicket.png",
  atConcert: "/culturepass/AtConcert.png",
  pscConcert: "/culturepass/PSC_Concert.png",
  // user-supplied (drop into /public/culturepass/ with these exact names)
  cpassHomepage: "/culturepass/CPass_Homepage.png",
  partnerMap: "/culturepass/Screenshot_2026-05-16_at_11_12_39_PM.png",
  cpLogin: "/culturepass/Screenshot_2026-05-16_at_11_05_41_PM.png",
  pinReset: "/culturepass/Screenshot_2026-05-16_at_11_05_53_PM.png",
  cpAttractions: "/culturepass/Screenshot_2026-05-16_at_11_06_08_PM.png",
  cpHomepage: "/culturepass/Screenshot_2026-05-16_at_11_05_25_PM.png",
};

/* ---------- hooks ---------- */
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

/* Seeded pseudo-random so wobble/rotation stay stable across renders. */
function makeRand(seed) {
  let s = seed % 233280 || 1;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* Returns a CSS clip-path polygon that nibbles the edges of a rect inward,
   giving a torn-paper look. Intensity scales the max inward bite in % of
   the element's size. */
function wobbleClipPath(seed, intensity = 0.6, perSide = 14) {
  const rand = makeRand(seed);
  const amp = intensity * 2.4;
  const pts = [];
  const push = (x, y) => pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  for (let i = 0; i <= perSide; i++) push((i / perSide) * 100, rand() * amp);
  for (let i = 1; i <= perSide; i++) push(100 - rand() * amp, (i / perSide) * 100);
  for (let i = 1; i <= perSide; i++) push(100 - (i / perSide) * 100, 100 - rand() * amp);
  for (let i = 1; i < perSide; i++) push(rand() * amp, 100 - (i / perSide) * 100);
  return `polygon(${pts.join(", ")})`;
}

/* Returns a small stable rotation (in degrees) seeded by `seed`. */
function seededRotation(seed, range = 1.6) {
  const r = makeRand(seed);
  return (r() - 0.5) * 2 * range;
}

/* ---------- nav ---------- */
function Nav({ isMobile }) {
  return (
    <nav
      style={{
        background: C.bg,
        borderBottom: `1px solid rgba(252,251,247,0.18)`,
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
          fontFamily: FNT.ui,
          fontWeight: 600,
          fontSize: isMobile ? 20 : 28,
          lineHeight: 1.142,
          color: C.crema,
          fontVariationSettings: "'opsz' 14",
          textDecoration: "none",
        }}
      >
        Mars Nevada
      </a>
      <NavTitles color={C.crema} isMobile={isMobile} currentRoute="culturepass" />
    </nav>
  );
}

/* ---------- hero ---------- */
function Hero({ isMobile }) {
  return (
    <section
      style={{
        position: "relative",
        padding: isMobile ? "28px 20px" : "59px 80px",
        backgroundImage: `url(${A.heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center 35%",
        minHeight: isMobile ? "auto" : 551,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: C.bg,
          border: `3px solid ${C.crema}`,
          borderRadius: 24,
          padding: isMobile ? 24 : 40,
          width: isMobile ? "100%" : 745,
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 9,
          boxSizing: "border-box",
          color: C.crema,
        }}
      >
        <p style={{ ...ts.eyebrow(isMobile), color: C.crema }}>
          SERVICE DESIGN BLUEPRINT MAPPING
        </p>
        <h1
          style={{
            ...ts.display(isMobile),
            color: C.crema,
            fontSize: isMobile ? 32 : 60,
          }}
        >
          Mapping the New York Public Library Culture Pass Experience!
        </h1>
        <p
          style={{
            margin: 0,
            color: C.crema,
            fontFamily: FNT.ui,
            fontWeight: 400,
            fontSize: isMobile ? 16 : 30,
            lineHeight: 1.2,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          Retracing the steps of what it's like to use the Culture Pass program
          to experience what New York City cultural institutions have to offer!
        </p>
      </div>
    </section>
  );
}

/* ---------- what is culture pass ---------- */
function WhatIsCulturePass({ isMobile }) {
  return (
    <section
      style={{
        background: C.crema,
        padding: isMobile ? "60px 20px" : "120px 80px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: isMobile ? 32 : 50,
          width: "100%",
          maxWidth: 1280,
        }}
      >
        <div
          style={{
            flex: "1 0 0",
            borderRight: isMobile ? "none" : `1px solid ${C.bg}`,
            borderBottom: isMobile ? `1px solid ${C.bg}` : "none",
            paddingRight: isMobile ? 0 : 40,
            paddingBottom: isMobile ? 24 : 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            color: C.bg,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: FNT.ui,
              fontWeight: 400,
              fontSize: isMobile ? 26 : 40,
              lineHeight: 1.2,
              letterSpacing: "0.4px",
              fontVariationSettings: "'opsz' 14",
            }}
          >
            What is the Culture Pass?
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: FNT.ui,
              fontWeight: 400,
              fontSize: isMobile ? 16 : 26,
              lineHeight: 1.4,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            The New York Public Library offers free access to hundreds of
            cultural institutions and events across the city to New Yorkers
            with library cards. Any library card holder can reserve tickets
            to any of the partner organizations, but can only reserve one
            pass per organization per year.
          </p>
        </div>
        <div
          style={{
            width: isMobile ? "70%" : 590,
            maxWidth: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={A.nyplLogo}
            alt="New York Public Library logo"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- why blueprint ---------- */
function WhyBlueprint({ isMobile }) {
  return (
    <section
      style={{
        background: C.bg,
        padding: isMobile ? "60px 20px" : "65px 168px",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: "100%",
          maxWidth: 1100,
          color: C.crema,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: FNT.ui,
            fontWeight: 400,
            fontSize: isMobile ? 24 : 40,
            lineHeight: 1.2,
            letterSpacing: "0.4px",
            fontVariationSettings: "'opsz' 14",
          }}
        >
          Why create a service design blueprint?
        </h2>
        <div
          style={{
            fontFamily: FNT.ui,
            fontWeight: 400,
            fontSize: isMobile ? 16 : 26,
            lineHeight: 1.4,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          <p style={{ margin: "0 0 18px" }}>
            Service design blueprints help us get to know{" "}
            <strong style={{ fontWeight: 700 }}>
              how users interact with a service
            </strong>
            , from when they first learn about it and engage with it, to their
            very last interaction with the service and the people who staff the
            service.{" "}
            <strong style={{ fontWeight: 700 }}>
              This helps service designers identify areas for change and
              innovation.
            </strong>
          </p>
          <p style={{ margin: 0 }}>
            This also helps us develop an appreciation for the people who work
            the <strong style={{ fontWeight: 700 }}>front of house</strong>{" "}
            (staff who interact directly with users),{" "}
            <strong style={{ fontWeight: 700 }}>back of house</strong> (staff
            who support the service but don't interact directly with users),
            and the <strong style={{ fontWeight: 700 }}>support processes</strong>{" "}
            that keep a system going.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- "let's get into the blueprint" banner ---------- */
function IntoBlueprintBanner({ isMobile }) {
  return (
    <section
      style={{
        background: C.lavender,
        padding: isMobile ? "20px 16px" : "32px 80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: FONTS.display,
          fontWeight: 700,
          fontSize: isMobile ? 18 : 36,
          lineHeight: 1.2,
          color: C.kale,
          letterSpacing: isMobile ? "2px" : "4.32px",
          whiteSpace: isMobile ? "normal" : "nowrap",
        }}
      >
        LET'S GET INTO THE BLUEPRINT!
      </p>
    </section>
  );
}

/* ============================================================
   Image treatments — Postcard, PhoneMockup, LaptopMockup
   ============================================================ */

function Pushpin({ size = 28 }) {
  return (
    <div
      style={{
        position: "absolute",
        top: -size * 0.35,
        left: "50%",
        transform: "translateX(-50%)",
        width: size,
        height: size,
        pointerEvents: "none",
        zIndex: 3,
      }}
      aria-hidden
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, ${C.pinHi} 0%, ${C.pinMid} 55%, ${C.pinLo} 100%)`,
          boxShadow: `0 2px 4px rgba(0,0,0,0.25), inset -1px -2px 2px rgba(0,0,0,0.18)`,
        }}
      />
    </div>
  );
}

function MissingImage({ filename, width = 280, height = 210 }) {
  return (
    <div
      style={{
        width,
        height,
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          `repeating-linear-gradient(45deg, ${C.graph}, ${C.graph} 10px, #E7EAF1 10px, #E7EAF1 20px)`,
        color: C.ink,
        fontFamily: FNT.mono,
        fontSize: 11,
        lineHeight: 1.4,
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Drop screenshot</div>
        <div style={{ opacity: 0.7, wordBreak: "break-all" }}>{filename}</div>
      </div>
    </div>
  );
}

const LightboxCtx = createContext(null);
function useLightbox() {
  return useContext(LightboxCtx);
}

function ImgOrPlaceholder({ src, alt, style }) {
  const [broken, setBroken] = useState(false);
  const lb = useLightbox();
  if (broken) {
    const filename = src.split("/").pop();
    return <MissingImage filename={filename} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      style={{ cursor: lb ? "zoom-in" : undefined, ...style }}
      onClick={lb ? (e) => { e.stopPropagation(); lb.open({ kind: "image", src, alt }); } : undefined}
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}

function Postcard({ src, alt, credit, seed = 1, isMobile }) {
  const rotation = useMemo(() => seededRotation(seed, 2.2), [seed]);
  const lb = useLightbox();
  // The polaroid frame hugs the image at its native aspect. The image is
  // capped so it can't blow out the layout, but the caps are generous so
  // postcards feel substantial in the scrollytelling column.
  const imageMaxW = isMobile ? 300 : 380;
  const imageMaxH = isMobile ? 380 : 300;
  return (
    <figure
      className={lb ? "cp-clickable" : undefined}
      style={{
        margin: 0,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        transform: `rotate(${rotation}deg)`,
        maxWidth: "100%",
        filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.35))",
      }}
    >
      <div
        style={{
          position: "relative",
          background: C.ivory,
          padding: 12,
          paddingBottom: 14,
          boxSizing: "border-box",
          display: "inline-block",
        }}
      >
        <Pushpin size={26} />
        <ImgOrPlaceholder
          src={src}
          alt={alt}
          style={{
            display: "block",
            maxWidth: imageMaxW,
            maxHeight: imageMaxH,
            width: "auto",
            height: "auto",
          }}
        />
      </div>
      {credit && (
        <figcaption
          style={{
            fontFamily: FNT.mono,
            fontWeight: 300,
            fontSize: 9,
            color: C.caption,
            textAlign: "center",
            lineHeight: 1.3,
            marginTop: 2,
          }}
        >
          {credit}
        </figcaption>
      )}
    </figure>
  );
}

function PhoneMockup({ src, alt, seed = 1, isMobile }) {
  const rotation = useMemo(() => seededRotation(seed, 1.8), [seed]);
  const clip = useMemo(() => wobbleClipPath(seed + 7, 0.5, 18), [seed]);
  const lb = useLightbox();
  const figureWidth = isMobile ? 264 : 180;
  return (
    <figure
      className={lb ? "cp-clickable" : undefined}
      style={{
        margin: 0,
        display: "inline-block",
        transform: `rotate(${rotation}deg)`,
        width: figureWidth,
        maxWidth: "100%",
        filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.4))",
      }}
    >
      <div
        style={{
          position: "relative",
          background: C.ink,
          borderRadius: 28,
          padding: "34px 10px 28px",
          aspectRatio: "9 / 19",
          clipPath: clip,
          boxSizing: "border-box",
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 14,
            background: "#000",
            borderRadius: 8,
            opacity: 0.95,
          }}
          aria-hidden
        />
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#fff",
            borderRadius: 4,
            overflow: "auto",
            position: "relative",
          }}
        >
          <ImgOrPlaceholder
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
        {/* Home indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 56,
            height: 4,
            background: "#fff",
            borderRadius: 2,
            opacity: 0.65,
          }}
          aria-hidden
        />
      </div>
    </figure>
  );
}

function LaptopMockup({ src, alt, seed = 1, isMobile }) {
  const rotation = useMemo(() => seededRotation(seed, 1.1), [seed]);
  const clip = useMemo(() => wobbleClipPath(seed + 13, 0.45, 22), [seed]);
  const lb = useLightbox();
  const figureWidth = isMobile ? "100%" : 440;
  return (
    <figure
      className={lb ? "cp-clickable" : undefined}
      style={{
        margin: 0,
        display: "inline-block",
        transform: `rotate(${rotation}deg)`,
        width: figureWidth,
        maxWidth: "100%",
        filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.4))",
      }}
    >
      <div
        style={{
          position: "relative",
          background: C.ink,
          borderRadius: 12,
          padding: "22px 10px 18px",
          aspectRatio: "16 / 10",
          clipPath: clip,
          boxSizing: "border-box",
        }}
      >
        {/* Webcam */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 6,
            height: 6,
            background: "#444",
            borderRadius: "50%",
          }}
          aria-hidden
        />
        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#fff",
            borderRadius: 2,
            overflow: "auto",
            position: "relative",
          }}
        >
          <ImgOrPlaceholder
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </div>
      {/* Trackpad base */}
      <div
        style={{
          width: "108%",
          marginLeft: "-4%",
          height: 6,
          background: "linear-gradient(180deg, #2A2A2A 0%, #111 100%)",
          borderBottomLeftRadius: 18,
          borderBottomRightRadius: 18,
        }}
        aria-hidden
      />
      <div
        style={{
          width: 56,
          height: 3,
          background: "#222",
          margin: "0 auto",
          borderRadius: 2,
          marginTop: 2,
        }}
        aria-hidden
      />
    </figure>
  );
}

function ImageTreatment({ image, seed, isMobile }) {
  if (!image) return null;
  if (Array.isArray(image)) {
    return (
      <div
        style={{
          display: "flex",
          gap: 18,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {image.map((img, i) => (
          <ImageTreatment
            key={i}
            image={img}
            seed={seed + i * 13}
            isMobile={isMobile}
          />
        ))}
      </div>
    );
  }
  if (image.kind === "postcard")
    return (
      <Postcard
        src={image.src}
        alt={image.alt}
        credit={image.credit}
        seed={seed}
        isMobile={isMobile}
      />
    );
  if (image.kind === "phone")
    return (
      <PhoneMockup
        src={image.src}
        alt={image.alt}
        seed={seed}
        isMobile={isMobile}
      />
    );
  if (image.kind === "laptop")
    return (
      <LaptopMockup
        src={image.src}
        alt={image.alt}
        seed={seed}
        isMobile={isMobile}
      />
    );
  // placeholder: a quiet graph-paper square (used when a paragraph has no
  // associated image)
  return (
    <div
      style={{
        width: isMobile ? "100%" : 320,
        maxWidth: "100%",
        aspectRatio: "4 / 3",
        background: `linear-gradient(${C.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        backgroundColor: C.graph,
        opacity: 0.35,
        borderRadius: 4,
      }}
      aria-hidden
    />
  );
}

/* ============================================================
   Paper cards — front of house, back of house, support
   ============================================================ */

function TapeStrip({ rotation = -2 }) {
  return (
    <div
      style={{
        position: "absolute",
        top: -14,
        left: "50%",
        transform: `translateX(-50%) rotate(${rotation}deg)`,
        width: 110,
        height: 24,
        background: C.tape,
        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
        zIndex: 4,
        opacity: 0.85,
      }}
      aria-hidden
    />
  );
}

function PaperCard({ kind, title, items, revealedCount, seed = 1, isMobile, noRotate, large }) {
  const isFront = kind === "front";
  const clip = useMemo(
    () => wobbleClipPath(seed, (isFront ? 0.65 : kind === "back" ? 0.6 : 0.55) * 0.25, 18),
    [seed, isFront, kind]
  );
  const rotation = useMemo(() => seededRotation(seed + 3, 0.8), [seed]);
  const lb = useLightbox();
  const hasContent = revealedCount > 0;
  const onOpen =
    lb && hasContent
      ? () =>
          lb.open({
            kind: "card",
            paperKind: kind,
            title,
            items: items.slice(0, revealedCount),
            seed,
          })
      : undefined;
  const bg = isFront ? C.ivory : C.graph;
  const font = isFront ? FNT.hand : FNT.mono;
  const fontSize = large
    ? (isFront ? 24 : 18)
    : isFront
    ? (isMobile ? 15 : 16)
    : isMobile ? 13 : 14;
  const titleSize = large ? (isFront ? 18 : 16) : isFront ? (isMobile ? 13 : 14) : isMobile ? 11 : 12;
  return (
    <div
      className={onOpen ? "cp-clickable" : undefined}
      onClick={onOpen}
      style={{
        position: "relative",
        transform: noRotate ? "none" : `rotate(${rotation}deg)`,
        filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.18))",
        width: "100%",
        cursor: onOpen ? "zoom-in" : "default",
      }}
    >
      {!large && <TapeStrip rotation={seededRotation(seed + 11, 6)} />}
      <div
        style={{
          background: bg,
          padding: large
            ? "52px 48px 44px"
            : isMobile
            ? "26px 22px 22px"
            : "34px 30px 28px",
          color: C.ink,
          clipPath: clip,
          position: "relative",
          backgroundImage: isFront
            ? "none"
            : `linear-gradient(${C.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)`,
          backgroundSize: isFront ? "auto" : "22px 22px",
          backgroundColor: bg,
          boxSizing: "border-box",
        }}
      >
        {/* Crease line for back-of-house */}
        {kind === "back" && (
          <div
            style={{
              position: "absolute",
              top: "38%",
              left: 0,
              right: 0,
              height: 1,
              background: "rgba(0,0,0,0.06)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.4)",
              pointerEvents: "none",
            }}
            aria-hidden
          />
        )}
        <div
          style={{
            fontFamily: FNT.mono,
            fontSize: titleSize,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: C.ink,
            opacity: 0.65,
            marginBottom: 14,
          }}
        >
          {title}
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((text, i) => {
            const visible = i < revealedCount;
            return (
              <li
                key={i}
                style={{
                  fontFamily: font,
                  fontSize,
                  lineHeight: 1.4,
                  color: C.ink,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 500ms ease, transform 500ms ease",
                }}
              >
                {text}
              </li>
            );
          })}
          {items.length === 0 && (
            <li
              style={{
                fontFamily: font,
                fontSize,
                color: C.ink,
                opacity: 0.25,
                fontStyle: "italic",
              }}
            >
              —
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

/* ---------- hand-drawn service-blueprint line divider ---------- */
function LineDivider({ label, seed = 99 }) {
  const dashes = useMemo(() => {
    const rand = makeRand(seed);
    return Array.from({ length: 14 }).map(() => ({
      w: 18 + rand() * 12,
      h: 1 + rand() * 1.2,
      rot: (rand() - 0.5) * 8,
      ml: 4 + rand() * 4,
    }));
  }, [seed]);
  const left = dashes.slice(0, 7);
  const right = dashes.slice(7);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        margin: "22px 0",
        width: "100%",
      }}
      aria-hidden
    >
      <div style={{ display: "flex", flex: 1, justifyContent: "flex-end", alignItems: "center", gap: 0 }}>
        {left.map((d, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: d.w,
              height: d.h,
              background: C.dashed,
              marginLeft: d.ml,
              transform: `rotate(${d.rot}deg)`,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: FNT.mono,
          fontSize: 8,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: C.white,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flex: 1, justifyContent: "flex-start", alignItems: "center", gap: 0 }}>
        {right.map((d, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: d.w,
              height: d.h,
              background: C.dashed,
              marginLeft: d.ml,
              transform: `rotate(${d.rot}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Step data (from the spec MD)
   ============================================================ */

const STEPS = [
  {
    number: "01",
    title: "Learning about Culture Pass",
    paragraphs: [
      {
        text:
          "One day, over coffee, I hear about Culture Pass from a friend who recently used it to visit a museum. That sounds cool! I love going to museums but they can be pricey.",
        image: {
          kind: "postcard",
          src: A.coffee,
          alt: "Two friends having coffee",
          credit: "Photo by Curated Lifestyle on Unsplash",
        },
        reveals: {},
      },
      {
        text: "I look up the program online and find the website.",
        image: {
          kind: "laptop",
          src: A.cpassHomepage,
          alt: "Culture Pass homepage",
        },
        reveals: {
          front: [
            "Library staff are available to answer questions about Culture Pass via email or phone.",
          ],
        },
      },
      {
        text:
          "I explore all the partner organizations and get excited about the opportunities!",
        image: {
          kind: "laptop",
          src: A.partnerMap,
          alt: "Culture Pass partner organizations map page",
        },
        reveals: {
          back: [
            "The library web team keep the Culture Pass website updated with a list of partner institutions.",
          ],
          support: [
            "The CMS is updated with new events and details about partner organizations.",
          ],
        },
      },
      {
        text:
          "I learn I need to get a library card to use the Pass. Hmm, I don't have one.",
        image: null,
        reveals: {},
      },
    ],
  },
  {
    number: "02",
    title: "Figuring out the library card",
    paragraphs: [
      {
        text:
          "I look online to see what the requirements are to get a library card.",
        image: [
          {
            kind: "phone",
            src: A.libraryCardSearch,
            alt: "Mobile search for library card requirements",
          },
          {
            kind: "phone",
            src: A.nyplCardInfo,
            alt: "NYPL library card info page on mobile",
          },
        ],
        reveals: {
          front: [
            "Library staff can answer library card questions via email or phone.",
          ],
        },
      },
      {
        text:
          "It takes some searching but on the NYPL Terms and Conditions page, I learn I need proof of residency. I grab a piece of mail, a utility bill, and my ID card.",
        image: [
          {
            kind: "phone",
            src: A.nyplTcs,
            alt: "NYPL Library Card Terms and Conditions on mobile",
          },
          {
            kind: "phone",
            src: A.nyplDocs,
            alt: "NYPL eligibility requirements page",
          },
        ],
        reveals: {
          back: [
            "The library web team keeps the policies page up to date as policies change. The marketing team makes sure the page is optimized for search engines.",
          ],
          support: ["The CMS is updated when policies are updated."],
        },
      },
      {
        text: "I look up nearby libraries in the city and how to get there.",
        image: {
          kind: "phone",
          src: A.localLibraries,
          alt: "Map of nearby libraries on mobile",
        },
        reveals: {
          back: [
            "The staff make sure details are correct on maps listings.",
          ],
          support: [
            "The Google Maps database updates when changes are made to details.",
          ],
        },
      },
      {
        text:
          "I hop on a train and make my way to a New York Public Library, the Stavros Niarchos near Bryant Park.",
        image: null,
        reveals: {},
      },
    ],
  },
  {
    number: "03",
    title: "Going to the library!",
    paragraphs: [
      {
        text: "I arrive at the Stavros Niarchos library!",
        image: {
          kind: "postcard",
          src: A.nyplEntrance,
          alt: "NYPL Stavros Niarchos library entrance",
        },
        reveals: {
          front: ["Security staff check bags at the entrance."],
          back: ["Staff maintain the cleanliness of the library."],
          support: ["Security systems monitor the premises."],
        },
      },
      {
        text: "Signs direct me to get in line.",
        image: {
          kind: "postcard",
          src: A.nyplLineSign,
          alt: "Sign directing patrons to get in line",
        },
        reveals: {},
      },
      {
        text: "I wait impatiently.",
        image: {
          kind: "postcard",
          src: A.nyplInLine,
          alt: "Selfie waiting in line at NYPL",
        },
        reveals: {},
      },
      {
        text: "At the desk, the librarian greets me.",
        image: {
          kind: "postcard",
          src: A.nyplDeskWorker,
          alt: "Librarian greeting patrons at the desk",
        },
        reveals: {
          front: [
            "Library staff greets me at the desk and answers questions about library cards. They verify my documents and provide me with a card.",
          ],
        },
      },
      {
        text:
          "On the desk, I see a sign that directs me to scan a QR code to get a library card.",
        image: {
          kind: "postcard",
          src: A.nyplDeskSign,
          alt: "Sign at desk about scanning a QR code",
        },
        reveals: {},
      },
      {
        text:
          "I hand over my documents to the librarian at the desk and he gives me a library card. Success!",
        image: {
          kind: "postcard",
          src: A.keychain,
          alt: "New NYPL library card on a keychain",
        },
        reveals: {
          back: [
            "Support staff resolve issues when users struggle with their accounts. The technical staff maintains the database for all the accounts.",
          ],
          support: ["Account information is added to the database."],
        },
      },
    ],
  },
  {
    number: "04",
    title: "Making a Culture Pass account",
    paragraphs: [
      {
        text:
          "I visit the Culture Pass site and try to log in with my library credentials but don't remember my password.",
        image: {
          kind: "laptop",
          src: A.cpLogin,
          alt: "Culture Pass login page",
        },
        reveals: {},
      },
      {
        text: "The site redirects me to the NYPL PIN/Password reset page.",
        image: {
          kind: "laptop",
          src: A.pinReset,
          alt: "NYPL PIN/Password reset page",
        },
        reveals: {
          front: [
            "Library staff are able to help users reset their passwords via phone or email.",
          ],
          back: ["Library staff work to resolve issues in the system."],
        },
      },
      {
        text: "I reset my password and try logging into the Culture Pass site again.",
        image: {
          kind: "laptop",
          src: A.cpAttractions,
          alt: "Culture Pass logged in — All Attractions",
        },
        reveals: {
          support: ["Passwords are updated in the library account database."],
        },
      },
      {
        text: "Success!",
        image: {
          kind: "laptop",
          src: A.cpHomepage,
          alt: "Culture Pass homepage hero",
        },
        reveals: {
          support: [
            "The Culture Pass website connects to the library database to confirm access.",
          ],
        },
      },
    ],
  },
  {
    number: "05",
    title: "Browsing organizations and offers",
    paragraphs: [
      {
        text: "I scroll through the long alphabetical list of organizations.",
        image: {
          kind: "laptop",
          src: A.pscOrg,
          alt: "Peoples' Symphony Concerts organization page",
        },
        reveals: {
          front: [
            "Library staff answer emails and questions via phone and email.",
          ],
          back: [
            "Library web team work with organization staff to manage & update offers.",
          ],
          support: [
            "The CMS and database updates with new offers and organization details.",
          ],
        },
      },
      {
        text: "I'm only free on weekends so I click 'Select Available Date.'",
        image: {
          kind: "laptop",
          src: A.pscOffers,
          alt: "PSC offers tab listing concerts",
        },
        reveals: {},
      },
      {
        text:
          "I see a listing for Peoples' Symphony Concerts which interests me! I love classical music. I look through their offers which are concerts coming up! I choose one to learn more.",
        image: {
          kind: "laptop",
          src: A.pscOfferDetail,
          alt: "Juilliard String Quartet offer detail",
        },
        reveals: {},
      },
      {
        text: "I reserve my pass!",
        image: {
          kind: "laptop",
          src: A.pscReserve,
          alt: "Reserve pass confirmation modal",
        },
        reveals: {
          support: [
            "The website adds the reservation to my account details.",
          ],
        },
      },
      {
        text:
          "An email pops up in my inbox, confirming I've reserved a pass! It's not the same as having the pass though… Apparently I have to 'retrieve' the pass?",
        image: {
          kind: "laptop",
          src: A.emailConfirm,
          alt: "Gmail confirmation email",
        },
        reveals: {
          support: [
            "The website sends a confirmation email via CRM, customer relationship management system.",
          ],
        },
      },
    ],
  },
  {
    number: "06",
    title: "Redeeming the pass!",
    paragraphs: [
      {
        text: "I log back into the Culture Pass website to check my reservations.",
        image: {
          kind: "phone",
          src: A.pscMyResMobile,
          alt: "My Reservations page on mobile",
        },
        reveals: {
          front: [
            "Library staff answer emails and questions via phone and email.",
          ],
        },
      },
      {
        text:
          "I go to retrieve my pass and get a popup asking if I'm sure, because if I retrieve it, I won't be able to cancel the reservation.",
        image: {
          kind: "phone",
          src: A.pscRetrievalConfirm,
          alt: "Pass retrieval confirmation popup",
        },
        reveals: {
          back: [
            "Library web team update the offer information if changes occur, like if an event is cancelled.",
          ],
        },
      },
      {
        text:
          "I confirm and go to save the ticket PDF. I screenshot the ticket since there isn't a good way to save the ticket to my phone.",
        image: {
          kind: "phone",
          src: A.pscTicket,
          alt: "Culture Pass ticket PDF with barcode",
        },
        reveals: {
          support: [
            "The CMS and database updates if I've retrieved my pass. The system generates a barcode and the PDF of the ticket.",
          ],
        },
      },
      {
        text:
          "I check the ticket to confirm the address and door opening time.",
        image: {
          kind: "phone",
          src: A.pscDirections,
          alt: "Google Maps transit directions to venue",
        },
        reveals: {},
      },
    ],
  },
  {
    number: "07",
    title: "Checking into the event",
    paragraphs: [
      {
        text: "I get in line and get my bag checked as I walk into the venue.",
        image: {
          kind: "postcard",
          src: A.pscCheckin,
          alt: "Check-in table at HSFI venue",
        },
        reveals: {
          front: ["Security staff check my bag and monitor the line."],
        },
      },
      {
        text:
          "I pull up the ticket screenshot and show it to the staff at check-in. They verify the details, ask for my zipcode, and hand me my physical concert ticket. Cute!",
        image: {
          kind: "postcard",
          src: A.pscPaperTicket,
          alt: "Hand holding the physical paper concert ticket",
        },
        reveals: {
          front: [
            "Staff and volunteers verify and scan tickets and passes. They add zipcode information to a database.",
          ],
          back: ["Security staff monitor security camera feeds."],
          support: [
            "The organization's database updates with zipcodes. Security systems run in the background. The Culture Pass policy manages what verification policies are in place.",
          ],
        },
      },
      {
        text:
          "I enter into the auditorium and settle in for a lovely concert. Success!",
        image: {
          kind: "postcard",
          src: A.atConcert,
          alt: "Selfie in the concert auditorium",
        },
        reveals: {},
      },
    ],
  },
];

/* Aggregate reveals across all paragraphs up to and including `activeIdx`. */
function aggregateReveals(paragraphs, activeIdx) {
  const front = [];
  const back = [];
  const support = [];
  for (let i = 0; i <= activeIdx && i < paragraphs.length; i++) {
    const r = paragraphs[i].reveals || {};
    (r.front || []).forEach((x) => front.push(x));
    (r.back || []).forEach((x) => back.push(x));
    (r.support || []).forEach((x) => support.push(x));
  }
  return { front, back, support };
}

/* Full list across the whole step (so cards always show all items, hidden until revealed). */
function allReveals(paragraphs) {
  return aggregateReveals(paragraphs, paragraphs.length - 1);
}

/* ============================================================
   The big scrollytelling step component
   ============================================================ */

function StepNumbers({ count, active, onJump }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        paddingTop: 2,
        flexShrink: 0,
        minWidth: 32,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Go to paragraph ${i + 1}`}
            aria-current={isActive ? "step" : undefined}
            onClick={() => onJump(i)}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: FNT.ui,
              fontWeight: 500,
              fontSize: 16,
              lineHeight: 1,
              color: isActive ? C.lavender : C.crema,
              opacity: isActive ? 1 : 0.3,
              fontVariationSettings: "'opsz' 14",
              textAlign: "center",
              transition: "opacity 250ms ease, color 250ms ease",
            }}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

function BlueprintStepDesktop({ step, isLast }) {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const total = step.paragraphs.length;
  const VH_PER = 90; // each paragraph gets this many vh of scroll space

  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = rect.height - vh;
      if (totalScroll <= 0) {
        setActive(0);
        return;
      }
      const scrolled = Math.max(0, Math.min(totalScroll, -rect.top));
      const progress = scrolled / totalScroll;
      const idx = Math.min(total - 1, Math.floor(progress * total + 0.0001));
      setActive(idx);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [total]);

  const jumpTo = (idx) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const startY = window.scrollY + rect.top;
    const vh = window.innerHeight;
    const totalScroll = rect.height - vh;
    const target = startY + (idx / total) * totalScroll + 4;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const goToNextStep = () => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const target = window.scrollY + rect.bottom + 4;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  // Up/Down arrow keys advance the stepper for the step the viewport is
  // currently centered in. At a substep boundary, the arrow jumps to the
  // adjacent step (next step's first substep, or previous step's last).
  useEffect(() => {
    function onKey(e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const t = e.target;
      const tag = (t && t.tagName ? t.tagName : "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || (t && t.isContentEditable)) return;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      if (rect.top > mid || rect.bottom <= mid) return;
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const next = active + delta;
      if (next >= total) {
        e.preventDefault();
        goToNextStep();
        return;
      }
      if (next < 0) {
        e.preventDefault();
        const all = document.querySelectorAll("[data-cp-step]");
        const idx = Array.from(all).indexOf(el);
        const prev = idx > 0 ? all[idx - 1] : null;
        if (prev) {
          const prevRect = prev.getBoundingClientRect();
          const prevTop = window.scrollY + prevRect.top;
          const targetY = prevTop + prev.offsetHeight - window.innerHeight - 4;
          window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        } else {
          // First step — scroll up one viewport so the intro / banner
          // section above comes back into view.
          const curTop = window.scrollY + rect.top;
          const targetY = curTop - window.innerHeight;
          window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
        }
        return;
      }
      e.preventDefault();
      jumpTo(next);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, total]);

  const allRev = useMemo(() => allReveals(step.paragraphs), [step]);
  const aggregatedCounts = useMemo(() => {
    const upto = aggregateReveals(step.paragraphs, active);
    return {
      front: upto.front.length,
      back: upto.back.length,
      support: upto.support.length,
    };
  }, [step, active]);

  const para = step.paragraphs[active];
  const seedBase = parseInt(step.number, 10) * 1000;

  return (
    <section
      ref={sectionRef}
      data-cp-step={step.number}
      style={{
        position: "relative",
        minHeight: `${total * VH_PER}vh`,
        paddingBottom: 60,
        background: C.bg,
        color: C.crema,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "minmax(440px, 1fr) minmax(480px, 1.05fr)",
          gap: 48,
          padding: "60px 80px",
          boxSizing: "border-box",
          alignItems: "stretch",
        }}
      >
        {/* LEFT — narrative */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: 32,
            minWidth: 0,
            position: "relative",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: FNT.ui,
              fontWeight: 500,
              fontSize: 28,
              lineHeight: 1.2,
              color: C.crema,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            {step.title}
          </h2>
          <div
            style={{
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: 44,
            }}
          >
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <StepNumbers count={total} active={active} onJump={jumpTo} />
              <div
                style={{
                  width: 1,
                  background: C.crema,
                  opacity: 0.3,
                  margin: "0 24px 0 10px",
                  alignSelf: "stretch",
                  flexShrink: 0,
                }}
                aria-hidden
              />
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 36,
                }}
              >
                <p
                  key={`${step.number}-${active}-text`}
                  style={{
                    margin: 0,
                    fontFamily: FNT.ui,
                    fontWeight: 400,
                    fontSize: 25,
                    lineHeight: 1.45,
                    color: C.crema,
                    fontVariationSettings: "'opsz' 14",
                    animation: "cpFadeIn 380ms ease both",
                  }}
                >
                  {para.text}
                </p>
                {active === total - 1 && !isLast && (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    style={{
                      alignSelf: "flex-start",
                      background: C.lavender,
                      color: C.bg,
                      border: "none",
                      padding: "14px 22px",
                      fontFamily: FNT.ui,
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      borderRadius: 999,
                      transition: "transform 180ms ease, background 180ms ease",
                      animation: "cpFadeIn 380ms ease both",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    Next step →
                  </button>
                )}
                {para.image && (
                  <div
                    key={`${step.number}-${active}-img`}
                    style={{
                      animation: "cpFadeIn 380ms ease both",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      maxWidth: "100%",
                    }}
                  >
                    <ImageTreatment
                      image={para.image}
                      seed={seedBase + active * 7 + 1}
                      isMobile={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — paper cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            minHeight: 0,
          }}
        >
          <LineDivider label="line of interaction" seed={seedBase + 21} />
          <PaperCard
            kind="front"
            title="Front of House"
            items={allRev.front}
            revealedCount={aggregatedCounts.front}
            seed={seedBase + 31}
            isMobile={false}
          />
          <LineDivider label="line of visibility" seed={seedBase + 51} />
          <PaperCard
            kind="back"
            title="Back of House"
            items={allRev.back}
            revealedCount={aggregatedCounts.back}
            seed={seedBase + 61}
            isMobile={false}
          />
          <LineDivider label="line of internal interaction" seed={seedBase + 81} />
          <PaperCard
            kind="support"
            title="Support Processes"
            items={allRev.support}
            revealedCount={aggregatedCounts.support}
            seed={seedBase + 71}
            isMobile={false}
          />
        </div>
      </div>
    </section>
  );
}

function BlueprintStepMobile({ step }) {
  const allRev = useMemo(() => allReveals(step.paragraphs), [step]);
  const seedBase = parseInt(step.number, 10) * 1000;
  return (
    <section
      style={{
        background: C.bg,
        color: C.crema,
        padding: "48px 20px 24px",
      }}
    >
      <h2
        style={{
          margin: "0 0 28px",
          fontFamily: FNT.ui,
          fontWeight: 500,
          fontSize: 22,
          lineHeight: 1.2,
          color: C.crema,
          fontVariationSettings: "'opsz' 14",
        }}
      >
        {step.title}
      </h2>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 28 }}>
        {step.paragraphs.map((para, i) => (
          <li key={i} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {para.image && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ImageTreatment image={para.image} seed={seedBase + i * 7 + 1} isMobile />
              </div>
            )}
            <p
              style={{
                margin: 0,
                fontFamily: FNT.ui,
                fontWeight: 400,
                fontSize: 23,
                lineHeight: 1.5,
                color: C.crema,
                fontVariationSettings: "'opsz' 14",
              }}
            >
              <span style={{ opacity: 0.5, marginRight: 6 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {para.text}
            </p>
          </li>
        ))}
      </ol>
      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 16 }}>
        <LineDivider label="line of interaction" seed={seedBase + 21} />
        <PaperCard
          kind="front"
          title="Front of House"
          items={allRev.front}
          revealedCount={allRev.front.length}
          seed={seedBase + 31}
          isMobile
        />
        <LineDivider label="line of visibility" seed={seedBase + 51} />
        <PaperCard
          kind="back"
          title="Back of House"
          items={allRev.back}
          revealedCount={allRev.back.length}
          seed={seedBase + 61}
          isMobile
        />
        <LineDivider label="line of internal interaction" seed={seedBase + 81} />
        <PaperCard
          kind="support"
          title="Support Processes"
          items={allRev.support}
          revealedCount={allRev.support.length}
          seed={seedBase + 71}
          isMobile
        />
      </div>
    </section>
  );
}

/* ============================================================
   Full blueprint diagram — horizontal-scrolling overview that
   appears after all seven scrollytelling steps. 7 columns
   (one per step), 5 rows (Evidence, Customer Journey, Front of
   House, Back of House, Support Processes) separated by the
   same hand-drawn line dividers.
   ============================================================ */

function getStepImages(step) {
  const out = [];
  for (const p of step.paragraphs) {
    if (!p.image) continue;
    if (Array.isArray(p.image)) out.push(...p.image);
    else out.push(p.image);
  }
  return out;
}

function BPThumbnail({ img }) {
  const lb = useLightbox();
  const isPhone = img.kind === "phone";
  const isLaptop = img.kind === "laptop";
  const W = isPhone ? 28 : isLaptop ? 64 : 52;
  const H = isPhone ? 52 : isLaptop ? 40 : 40;
  const border = isPhone || isLaptop ? C.ink : C.ivory;
  const radius = isPhone ? 4 : isLaptop ? 2 : 0;
  const padding = isPhone || isLaptop ? 2 : 3;
  return (
    <div
      className={lb ? "cp-clickable" : undefined}
      onClick={lb ? () => lb.open({ kind: "image", src: img.src, alt: img.alt }) : undefined}
      style={{
        width: W,
        height: H,
        background: border,
        padding,
        borderRadius: radius,
        flexShrink: 0,
        boxSizing: "border-box",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        cursor: lb ? "zoom-in" : "default",
      }}
    >
      <img
        src={img.src}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.background =
            `repeating-linear-gradient(45deg, ${C.graph}, ${C.graph} 4px, #E7EAF1 4px, #E7EAF1 8px)`;
          e.currentTarget.removeAttribute("src");
        }}
      />
    </div>
  );
}

function BPRowLabel({ children, labelW }) {
  return (
    <div
      style={{
        width: labelW,
        flexShrink: 0,
        fontFamily: FNT.mono,
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: C.crema,
        opacity: 0.7,
        alignSelf: "center",
        paddingRight: 18,
        lineHeight: 1.3,
      }}
    >
      {children}
    </div>
  );
}

function BPCell({ kind, colWidth, children, withArrow }) {
  const isIvory = kind === "journey" || kind === "front";
  const isEvidence = kind === "evidence";
  const font = isIvory ? FNT.hand : FNT.mono;
  const bg = isEvidence ? "transparent" : isIvory ? C.ivory : C.graph;
  const fontSize = isIvory ? 14 : 12;
  return (
    <div style={{ width: colWidth, flexShrink: 0, position: "relative" }}>
      <div
        style={{
          background: bg,
          padding: isEvidence ? "8px 0" : "18px 16px",
          color: C.ink,
          fontFamily: font,
          fontSize,
          lineHeight: 1.45,
          backgroundImage:
            isIvory || isEvidence
              ? "none"
              : `linear-gradient(${C.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)`,
          backgroundSize: isIvory || isEvidence ? "auto" : "22px 22px",
          minHeight: isEvidence ? 0 : 110,
          height: "100%",
          boxSizing: "border-box",
          boxShadow: isEvidence ? "none" : "0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        {children}
      </div>
      {withArrow && (
        <div
          style={{
            position: "absolute",
            right: -22,
            top: "50%",
            transform: "translateY(-50%)",
            color: C.crema,
            fontFamily: FNT.mono,
            fontSize: 22,
            opacity: 0.65,
            pointerEvents: "none",
            lineHeight: 1,
          }}
          aria-hidden
        >
          →
        </div>
      )}
    </div>
  );
}

function BPDivider({ label, contentWidth, labelW }) {
  const leftDashes = useMemo(() => {
    const rand = makeRand(label.length * 17 + 3);
    return Array.from({ length: 5 }).map(() => ({
      w: 18 + rand() * 12,
      h: 1 + rand() * 1.2,
      rot: (rand() - 0.5) * 8,
      ml: 4 + rand() * 4,
    }));
  }, [label]);
  const rightDashes = useMemo(() => {
    const rand = makeRand(label.length * 23 + 11);
    return Array.from({ length: 90 }).map(() => ({
      w: 18 + rand() * 12,
      h: 1 + rand() * 1.2,
      rot: (rand() - 0.5) * 8,
      ml: 4 + rand() * 4,
    }));
  }, [label]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 0" }}>
      <div style={{ width: labelW, flexShrink: 0 }} aria-hidden />
      <div
        style={{
          width: contentWidth,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
        aria-hidden
      >
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {leftDashes.map((d, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: d.w,
                height: d.h,
                background: C.dashed,
                marginLeft: i === 0 ? 0 : d.ml,
                transform: `rotate(${d.rot}deg)`,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: FNT.mono,
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: C.white,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          {rightDashes.map((d, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: d.w,
                height: d.h,
                background: C.dashed,
                marginLeft: i === 0 ? 0 : d.ml,
                transform: `rotate(${d.rot}deg)`,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FullBlueprint({ isMobile }) {
  if (isMobile) {
    return (
      <section
        style={{
          background: C.bg,
          padding: "60px 20px",
          color: C.crema,
          borderTop: "1px solid rgba(252,251,247,0.15)",
        }}
      >
        <h2 style={{ ...ts.h2(true), color: C.crema, margin: 0 }}>
          The full blueprint
        </h2>
        <p
          style={{
            fontFamily: FNT.ui,
            fontSize: 14,
            opacity: 0.7,
            marginTop: 12,
            lineHeight: 1.5,
          }}
        >
          Open this case study on desktop to see the whole service blueprint
          laid out across all seven steps.
        </p>
      </section>
    );
  }

  const COL_W = 280;
  const GAP = 18;
  const LABEL_W = 150;
  const contentWidth = STEPS.length * COL_W + (STEPS.length - 1) * GAP;
  const rowStyle = { display: "flex", alignItems: "stretch", gap: GAP };

  return (
    <section
      style={{
        background: C.bg,
        padding: "100px 0 80px",
        color: C.crema,
        borderTop: "1px solid rgba(252,251,247,0.15)",
      }}
    >
      <div style={{ padding: "0 80px 40px" }}>
        <h2 style={{ ...ts.h1(false), color: C.crema, margin: 0 }}>
          The full blueprint
        </h2>
        <p
          style={{
            fontFamily: FNT.ui,
            fontSize: 16,
            color: C.caption,
            marginTop: 12,
            maxWidth: 640,
            lineHeight: 1.5,
          }}
        >
          Scroll → to see the user's entire path through Culture Pass, with
          the people, systems, and processes layered behind each moment.
        </p>
      </div>

      <div style={{ overflowX: "auto", padding: "0 80px 80px" }}>
        <div
          style={{
            width: LABEL_W + GAP + contentWidth,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Column headers */}
          <div style={rowStyle}>
            <div style={{ width: LABEL_W, flexShrink: 0 }} aria-hidden />
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                style={{
                  width: COL_W,
                  flexShrink: 0,
                  padding: "14px 16px",
                  background: C.lavender,
                  color: C.kale,
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  borderRadius: 4,
                  lineHeight: 1.25,
                  boxSizing: "border-box",
                }}
              >
                {String(i + 1).padStart(2, "0")}. {step.title}
              </div>
            ))}
          </div>

          {/* Evidence */}
          <div style={rowStyle}>
            <BPRowLabel labelW={LABEL_W}>Evidence</BPRowLabel>
            {STEPS.map((step) => {
              const imgs = getStepImages(step);
              return (
                <BPCell key={step.number} kind="evidence" colWidth={COL_W}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      justifyContent: "flex-start",
                      alignItems: "flex-end",
                    }}
                  >
                    {imgs.map((img, j) => (
                      <BPThumbnail key={j} img={img} />
                    ))}
                  </div>
                </BPCell>
              );
            })}
          </div>

          {/* Customer Journey */}
          <div style={rowStyle}>
            <BPRowLabel labelW={LABEL_W}>Customer Journey</BPRowLabel>
            {STEPS.map((step, i) => (
              <BPCell
                key={step.number}
                kind="journey"
                colWidth={COL_W}
                withArrow={i < STEPS.length - 1}
              >
                {step.paragraphs.map((p, j) => (
                  <div
                    key={j}
                    style={{
                      marginBottom: j < step.paragraphs.length - 1 ? 10 : 0,
                    }}
                  >
                    {p.text}
                  </div>
                ))}
              </BPCell>
            ))}
          </div>

          <BPDivider label="line of interaction" contentWidth={contentWidth} labelW={LABEL_W} />

          {/* Front of House */}
          <div style={rowStyle}>
            <BPRowLabel labelW={LABEL_W}>Front of House</BPRowLabel>
            {STEPS.map((step) => {
              const reveals = allReveals(step.paragraphs).front;
              return (
                <BPCell key={step.number} kind="front" colWidth={COL_W}>
                  {reveals.length === 0 ? (
                    <span style={{ opacity: 0.3, fontStyle: "italic" }}>—</span>
                  ) : (
                    reveals.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: i < reveals.length - 1 ? 10 : 0,
                        }}
                      >
                        {r}
                      </div>
                    ))
                  )}
                </BPCell>
              );
            })}
          </div>

          <BPDivider label="line of visibility" contentWidth={contentWidth} labelW={LABEL_W} />

          {/* Back of House */}
          <div style={rowStyle}>
            <BPRowLabel labelW={LABEL_W}>Back of House</BPRowLabel>
            {STEPS.map((step) => {
              const reveals = allReveals(step.paragraphs).back;
              return (
                <BPCell key={step.number} kind="back" colWidth={COL_W}>
                  {reveals.length === 0 ? (
                    <span style={{ opacity: 0.3, fontStyle: "italic" }}>—</span>
                  ) : (
                    reveals.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: i < reveals.length - 1 ? 10 : 0,
                        }}
                      >
                        {r}
                      </div>
                    ))
                  )}
                </BPCell>
              );
            })}
          </div>

          <BPDivider label="line of internal interaction" contentWidth={contentWidth} labelW={LABEL_W} />

          {/* Support Processes */}
          <div style={rowStyle}>
            <BPRowLabel labelW={LABEL_W}>Support Processes</BPRowLabel>
            {STEPS.map((step) => {
              const reveals = allReveals(step.paragraphs).support;
              return (
                <BPCell key={step.number} kind="support" colWidth={COL_W}>
                  {reveals.length === 0 ? (
                    <span style={{ opacity: 0.3, fontStyle: "italic" }}>—</span>
                  ) : (
                    reveals.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: i < reveals.length - 1 ? 10 : 0,
                        }}
                      >
                        {r}
                      </div>
                    ))
                  )}
                </BPCell>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */
function Footer({ isMobile }) {
  return (
    <footer
      style={{
        background: C.bg,
        borderTop: `1px solid rgba(252,251,247,0.18)`,
        padding: isMobile ? "32px 20px" : "48px 80px",
        color: C.crema,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: FNT.mono,
          fontSize: 12,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: C.caption,
        }}
      >
        Service design blueprint — Culture Pass, 2026
      </p>
      <div style={{ display: "flex", gap: 18 }}>
        <a
          href="#/nutrition-source"
          style={{
            fontFamily: FNT.ui,
            fontSize: 14,
            color: C.crema,
            textDecoration: "none",
            borderBottom: `1px solid ${C.crema}`,
            paddingBottom: 2,
          }}
        >
          ← The Nutrition Source
        </a>
        <a
          href="#/nebo"
          style={{
            fontFamily: FNT.ui,
            fontSize: 14,
            color: C.crema,
            textDecoration: "none",
            borderBottom: `1px solid ${C.crema}`,
            paddingBottom: 2,
          }}
        >
          Nebo →
        </a>
      </div>
    </footer>
  );
}

/* ============================================================
   Main page
   ============================================================ */

function Lightbox({ content, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      // Block arrow keys from advancing scrollytelling while lightbox is open.
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.stopPropagation();
        e.preventDefault();
      }
    }
    document.addEventListener("keydown", onKey, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(1, 0, 78, 0.85)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        cursor: "zoom-out",
        animation: "cpFadeIn 200ms ease both",
      }}
    >
      {content.kind === "image" ? (
        <img
          src={content.src}
          alt={content.alt || ""}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "min(92vw, 1280px)",
            maxHeight: "80vh",
            objectFit: "contain",
            display: "block",
            cursor: "default",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}
        />
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(900px, 92vw)",
            maxHeight: "80vh",
            overflowY: "auto",
            cursor: "default",
          }}
        >
          <PaperCard
            kind={content.paperKind}
            title={content.title}
            items={content.items}
            revealedCount={content.items.length}
            seed={content.seed}
            isMobile={false}
            noRotate
            large
          />
        </div>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          marginTop: 22,
          padding: "12px 26px",
          borderRadius: 999,
          background: C.lavender,
          color: C.bg,
          border: "none",
          cursor: "pointer",
          fontFamily: FNT.ui,
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        Close
      </button>
    </div>
  );
}

export default function CulturePassCaseStudy() {
  const isMobile = useIsMobile();
  const [lbContent, setLbContent] = useState(null);
  const lightbox = useMemo(
    () => ({ open: (content) => setLbContent(content) }),
    []
  );
  return (
    <LightboxCtx.Provider value={lightbox}>
      <div style={{ background: C.bg, minHeight: "100vh", color: C.crema }}>
        <style>{`
          @keyframes cpFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .cp-clickable {
            outline: 2px solid transparent;
            outline-offset: 0px;
            transition: outline-color 180ms ease, outline-offset 180ms ease;
          }
          .cp-clickable:hover {
            outline-color: ${C.lavender};
            outline-offset: 5px;
          }
        `}</style>
        <Nav isMobile={isMobile} />
        <Hero isMobile={isMobile} />
        <WhatIsCulturePass isMobile={isMobile} />
        <WhyBlueprint isMobile={isMobile} />
        <IntoBlueprintBanner isMobile={isMobile} />
        {STEPS.map((step, i) => {
          const isLast = i === STEPS.length - 1;
          return isMobile ? (
            <BlueprintStepMobile key={step.number} step={step} />
          ) : (
            <BlueprintStepDesktop key={step.number} step={step} isLast={isLast} />
          );
        })}
        <FullBlueprint isMobile={isMobile} />
        <Footer isMobile={isMobile} />
      </div>
      {lbContent && <Lightbox content={lbContent} onClose={() => setLbContent(null)} />}
    </LightboxCtx.Provider>
  );
}
