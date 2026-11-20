import { useMemo, useState } from "react";
import { GLASS, GlassEdge, NUNITO_VAR, PlateContent, PlusIcon } from "./tnsShared.jsx";
import { INGREDIENTS } from "./tnsIngredients.js";

// Live build of the redesigned Healthy Eating Plate page.
// Source: Figma file "wippy", frame Hi-Fi Homepage (node 81:5838), 1440 wide.
// Rendered at full design size; the case study scales it into its frame.

const H = "/tns/v2/hep";
const IMG = {
  hsphLogo: `${H}/hsph-logo-white.svg`,
  tnsLogo: `${H}/tns-logo.png`,
  footerLogo: `${H}/footer-hsph-logo.svg`,
  creatorPlate: `${H}/creator-plate.svg`,
  resultsPlate: `${H}/results-plate.svg`,
  arrowLeft: `${H}/arrow-left.svg`,
  arrowDown: `${H}/arrow-down.svg`,
  chipPlus: `${H}/chip-plus.svg`,
  oils: `${H}/oils.png`,
  water: `${H}/water.png`,
  plate: {
    vegetables: `${H}/plate-greens.png`,
    grains: `${H}/plate-grains.png`,
    protein: `${H}/plate-protein.png`,
    fruits: `${H}/plate-fruits.png`,
  },
  search: "/tns/newnav/search-icon.svg",
};

const T = {
  crimson100: "#A51C30",
  crimson300: "#610311",
  titleRed: "#A71E34",
  slate: "#364153",
  brown: "#5A360F",
  cream: "#FFFCF1",
  plateBg: "#FCFBF7",
  creatorBorder: "rgba(153,122,89,0.29)",
  navBorder: "#C5C5C5",
};

const OUTFIT = "'Outfit', sans-serif";
const NUNITO = "'Nunito Sans', sans-serif";
const nunito = (weight, size, extra = {}) => ({
  margin: 0,
  fontFamily: NUNITO,
  fontWeight: weight,
  fontSize: size,
  ...NUNITO_VAR,
  ...extra,
});
const plainButton = {
  background: "white",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

/* ---------- Header ---------- */
function Menu() {
  const topItems = ["Nutrition News", "About", "Donate"];
  const mainItems = [
    ["Nutrition 101", 161],
    ["What Should I Eat?", 218],
    ["What Should I Drink?", 238],
    ["Diets & Dieting", 179],
    ["Explore More", null],
    ["Recipes", 108],
  ];
  return (
    <header style={{ borderBottom: `1px solid ${T.navBorder}`, width: "100%" }}>
      <div style={{ background: T.crimson100, padding: "13px 46px" }}>
        <img alt="Harvard T.H. Chan School of Public Health" src={IMG.hsphLogo} width="178.994" height="31.9657" style={{ display: "block", width: 179, height: 31.966 }} />
      </div>
      <div style={{ background: "white", display: "flex", alignItems: "center", paddingBottom: 10 }}>
        <div style={{ position: "relative", width: 292, height: 113, flexShrink: 0 }}>
          <img alt="The Nutrition Source" src={IMG.tnsLogo} style={{ position: "absolute", left: 43, top: 18, width: 229, height: 79, objectFit: "cover" }} />
        </div>
        <nav style={{ flex: "1 0 0", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", paddingRight: 30 }}>
            <button type="button" style={{ ...plainButton, gap: 4, padding: "12.134px 17.191px" }}>
              <img alt="" src={IMG.search} style={{ width: 15.375, height: 15.375 }} />
              <span style={nunito(700, 16.179, { color: "#000", letterSpacing: "-0.2427px" })}>Search</span>
            </button>
            {topItems.map((t) => (
              <button key={t} type="button" style={{ ...plainButton, padding: "12.134px 17.191px" }}>
                <span style={nunito(700, 16.179, { color: "#000" })}>{t}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 30, width: "100%" }}>
            {mainItems.map(([t, w]) => (
              <button key={t} type="button" style={{ ...plainButton, padding: "12px 17px", width: w || undefined, boxSizing: "border-box" }}>
                <span style={nunito(700, 21, { color: "#000", letterSpacing: "-0.315px", whiteSpace: "nowrap" })}>{t}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ---------- Plate ---------- */
// The page's plate is the same component as the case-study hero, drawn at
// 1.2566× (540.27 / 429.96). Content box: 1198 × 450 inside a 1438 × 570 frame.
const PLATE_SCALE = 540.268 / 429.963;

const SIDE_ITEMS = {
  oils: {
    label: "Healthy Oils",
    body: (
      <>
        Use healthy oils (like olive and canola oil) for cooking, on salad, and at the table. <strong>Limit</strong>{" "}
        butter. <strong>Avoid</strong> trans fat.
      </>
    ),
  },
  water: {
    label: "Water",
    body: (
      <>
        Drink water, tea, or coffee (with little or no sugar). <strong>Limit</strong> milk/dairy (1-2 servings/day) and
        juice (1 small glass/day). <strong>Avoid</strong> sugary drinks.
      </>
    ),
  },
};
function SidePill({ label, open }) {
  return (
    <span
      style={{
        position: "absolute",
        left: "calc(50% - 0.5px)",
        top: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(36,36,36,0.38)",
        ...GLASS,
        borderRadius: 10,
        padding: 12,
        display: "flex",
        gap: 4,
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <GlassEdge radius={10} />
      <span style={{ position: "relative", width: 12, height: 12, flexShrink: 0, transform: open ? "rotate(45deg)" : "none" }}>
        <PlusIcon size={32.6} />
      </span>
      <span style={{ fontFamily: OUTFIT, fontSize: 26, lineHeight: "29.185px", color: "white", whiteSpace: "nowrap" }}>{label}</span>
    </span>
  );
}

// Each tile opens its card directly beneath it, pushing anything below down.
function SideCard({ children }) {
  return (
    <div style={{ background: "white", border: "1px solid #997A59", borderRadius: 11, padding: 24 }}>
      <p style={nunito(400, 20, { lineHeight: "26px", color: "#000" })}>{children}</p>
    </div>
  );
}

function OilAndWater({ open, onToggle, hidden }) {
  const tile = { position: "relative", height: 90, width: "100%", borderRadius: 10, overflow: "hidden", padding: 0, border: "none", cursor: "pointer", display: "block" };
  const photo = {
    oils: <img alt="" src={IMG.oils} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />,
    water: (
      <span style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 10 }}>
        <img alt="" src={IMG.water} style={{ position: "absolute", height: "1551.29%", left: "-178.03%", top: "-697.39%", width: "455.92%", maxWidth: "none" }} />
      </span>
    ),
  };
  return (
    <div
      aria-hidden={hidden || undefined}
      style={{
        position: "absolute",
        left: 1070,
        top: 293,
        width: 245,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        zIndex: 1,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        transition: "opacity 0.2s",
      }}
    >
      {["oils", "water"].map((key) => {
        const item = SIDE_ITEMS[key];
        const isOpen = open === key;
        return (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <button type="button" aria-expanded={isOpen} aria-label={item.label} onClick={() => onToggle(key)} style={tile}>
              {photo[key]}
              <SidePill label={item.label} open={isOpen} />
            </button>
            {isOpen && <SideCard>{item.body}</SideCard>}
          </div>
        );
      })}
    </div>
  );
}

function PlateSection() {
  const [active, setActive] = useState(null);
  const [side, setSide] = useState(null);
  const select = (key) => {
    setSide(null);
    setActive((cur) => (cur === key ? null : key));
  };
  const toggleSide = (key) => {
    setActive(null);
    setSide((cur) => (cur === key ? null : key));
  };
  return (
    <section style={{ position: "relative", background: T.plateBg, padding: "60px 0 80px", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      {/* The grains and protein callouts open into the space these tiles use. */}
      <OilAndWater open={side} onToggle={toggleSide} hidden={active === "grains" || active === "protein"} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", textAlign: "center", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 302px" }}>
          <h1 style={{ margin: 0, fontFamily: OUTFIT, fontWeight: 500, fontSize: 48, lineHeight: "48px", letterSpacing: "0.3516px", color: T.titleRed }}>
            The Healthy Eating Plate
          </h1>
          <p style={nunito(400, 26, { lineHeight: "37px", color: T.slate })}>
            Use the portion guidelines below as a guide for creating healthy, balanced meals—whether served at the table or packed in a lunch box.
          </p>
        </div>
        <p style={nunito(400, 20, { lineHeight: 1.2, color: T.crimson300, whiteSpace: "nowrap" })}>
          Click below to explore the Healthy Eating Plate.
        </p>
      </div>
      <div style={{ position: "relative", width: 1438, height: 570, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 120 - 96.3 * PLATE_SCALE,
            top: 60 - 93.91 * PLATE_SCALE,
            width: 1146,
            height: 545.146,
            transform: `scale(${PLATE_SCALE})`,
            transformOrigin: "top left",
          }}
        >
          <PlateContent activeKey={active} interactive onSelect={select} images={IMG.plate} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Make the Plate yours ---------- */
const PRIORITIES = [
  { id: "wic", label: "WIC-Eligible", test: (i) => i.wic === "Yes" || i.wic === "State option" },
  { id: "freshness", label: "Freshness", test: (i) => i.form === "Fresh" },
  { id: "time", label: "Time", test: (i) => i.prep === "No cook" || i.prep === "Under 15 min" },
  { id: "cost", label: "Cost", test: (i) => i.cost === 1 },
  { id: "prep", label: "Meal-Prep Friendly", test: (i) => i.mealPrep === "Yes" },
  { id: "crowd", label: "Good for a Crowd", test: (i) => i.crowd === "Yes" },
  { id: "vegan", label: "Vegan", test: (i) => i.vegan === "Yes" },
  { id: "vegetarian", label: "Vegetarian", test: (i) => i.vegetarian === "Yes" },
  { id: "gf", label: "Gluten-free", test: (i) => i.glutenFree === "Yes" },
];
const ALLERGENS = ["Wheat", "Soy", "Peanuts", "Tree Nuts", "Fish", "Egg", "Sesame"];
const METHODS = [
  { id: "Microwave", label: "Microwave" },
  { id: "Stovetop", label: "Stovetop" },
  { id: "None", label: "No Cooking" },
];
// Results order and colours from Figma (PersonalPlate_Results, node 162:12943).
const RESULT_SECTIONS = [
  { title: "Vegetables", section: "Vegetables", color: "#39B54A" },
  { title: "Fruit", section: "Fruits", color: "#B50937" },
  { title: "Whole Grains", section: "Whole grains", color: "#A68461" },
  { title: "Protein", section: "Healthy protein", color: "#E87D1D" },
];

function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      style={{
        background: selected ? T.brown : "white",
        border: `1px solid ${T.brown}`,
        borderRadius: 100,
        padding: "6px 24px",
        display: "flex",
        gap: 6,
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <img
        alt=""
        src={IMG.chipPlus}
        width="16"
        height="16"
        style={{
          display: "block",
          transform: selected ? "rotate(45deg)" : "none",
          filter: selected ? "brightness(0) invert(1)" : "none",
        }}
      />
      <span style={{ fontFamily: OUTFIT, fontSize: 20, lineHeight: "37px", color: selected ? "white" : T.brown, whiteSpace: "nowrap" }}>{label}</span>
    </button>
  );
}

function ChipGroup({ title, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", width: "100%" }}>
      <p style={{ margin: 0, fontFamily: OUTFIT, fontWeight: 500, fontSize: 22, lineHeight: "37px", color: T.brown, textAlign: "center" }}>{title}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 10px", justifyContent: "center", width: "100%" }}>{children}</div>
    </div>
  );
}

function filterIngredients(priorities, allergens, methods) {
  const allowedEquipment = methods.size ? new Set([...methods, "None"]) : null;
  return INGREDIENTS.filter((i) => {
    for (const p of PRIORITIES) if (priorities.has(p.id) && !p.test(i)) return false;
    for (const a of allergens) if (i.allergens.toLowerCase().includes(a.toLowerCase())) return false;
    if (allowedEquipment && !allowedEquipment.has(i.equipment)) return false;
    // "No Cooking" alone means nothing that needs heat at all.
    if (methods.size === 1 && methods.has("None") && i.equipment !== "None") return false;
    return true;
  });
}

const equipmentLabel = (e) => (e === "None" ? "No cooking" : e);
const metaLine = (m) =>
  [m.form, equipmentLabel(m.equipment), m.prep === "No cook" ? null : m.prep, "$".repeat(m.cost)].filter(Boolean).join(" | ");

function downloadGuide(matches) {
  const lines = ["My Personal Healthy Eating Plate Guide", ""];
  for (const s of RESULT_SECTIONS) {
    lines.push(s.title.toUpperCase());
    const items = matches.filter((m) => m.section === s.section);
    if (!items.length) lines.push("  (nothing matched every choice)");
    for (const m of items) {
      lines.push(`- ${m.name}: ${metaLine(m)}`);
      if (m.notes) lines.push(`  ${m.notes}`);
    }
    lines.push("");
  }
  lines.push("Always check labels for allergens. WIC-eligible foods vary by state.");
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-healthy-eating-plate-guide.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function FoodCard({ item }) {
  return (
    <div style={{ border: `1px solid ${T.brown}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column", gap: 8, color: T.brown }}>
      <p style={nunito(500, 30, { lineHeight: "37px" })}>{item.name}</p>
      <p style={nunito(300, 18, { lineHeight: "22px" })}>{metaLine(item)}</p>
      {item.notes && <p style={nunito(500, 18, { lineHeight: "22px" })}>{item.notes}</p>}
    </div>
  );
}

function PersonalPlateResults({ matches, onBack }) {
  const action = { borderRadius: 26.627, padding: "12px 24px", display: "flex", gap: 13, alignItems: "center", justifyContent: "center", cursor: "pointer" };
  return (
    <div style={{ width: 1200, boxSizing: "border-box", background: T.cream, border: `1px solid ${T.creatorBorder}`, borderRadius: 40, padding: 60, display: "flex", flexDirection: "column", gap: 46, alignItems: "center", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 46, alignItems: "center", width: "100%" }}>
        <img alt="" src={IMG.resultsPlate} width="169.999" height="169.983" style={{ display: "block", width: 170, height: 169.984, flexShrink: 0 }} />
        <div style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ borderBottom: "1px solid #000", paddingBottom: 24, display: "flex", flexDirection: "column", gap: 12, color: T.brown }}>
            <p style={{ margin: 0, fontFamily: OUTFIT, fontWeight: 200, fontSize: 26, lineHeight: "37px", textTransform: "uppercase" }}>My Healthy Eating Plate Creator</p>
            <h3 style={{ margin: 0, fontFamily: OUTFIT, fontWeight: 400, fontSize: 36, lineHeight: "44px" }}>Your Personalized Healthy Eating Plate Guide</h3>
          </div>
          <div style={{ display: "flex", gap: 26 }}>
            <button type="button" onClick={onBack} style={{ ...action, background: "transparent", border: `2px solid ${T.crimson100}` }}>
              <img alt="" src={IMG.arrowLeft} width="11" height="18" style={{ display: "block" }} />
              <span style={nunito(600, 20, { color: T.crimson100, whiteSpace: "nowrap" })}>Back to Personalization</span>
            </button>
            <button type="button" onClick={() => downloadGuide(matches)} style={{ ...action, background: T.crimson100, border: "none" }}>
              <span style={nunito(600, 20, { color: "white", whiteSpace: "nowrap" })}>Download My Guide</span>
              <img alt="" src={IMG.arrowDown} width="14.7279" height="18" style={{ display: "block" }} />
            </button>
          </div>
        </div>
      </div>
      {RESULT_SECTIONS.map((s) => {
        const items = matches.filter((m) => m.section === s.section);
        return (
          <section key={s.title} style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
            <div style={{ borderBottom: `1px solid ${s.color}`, paddingBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
              <span aria-hidden style={{ background: s.color, width: 20, height: 21, borderRadius: 200, flexShrink: 0 }} />
              <h4 style={{ margin: 0, fontFamily: OUTFIT, fontWeight: 500, fontSize: 38, lineHeight: "37px", color: T.brown, whiteSpace: "nowrap" }}>{s.title}</h4>
            </div>
            {items.length ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 27 }}>
                {items.map((m) => (
                  <FoodCard key={m.name + m.form} item={m} />
                ))}
              </div>
            ) : (
              <p style={nunito(400, 20, { lineHeight: "26px", color: T.brown })}>
                Nothing here matches every choice you made. Try going back and removing a filter.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function PersonalPlate() {
  const [priorities, setPriorities] = useState(new Set());
  const [allergens, setAllergens] = useState(new Set());
  const [methods, setMethods] = useState(new Set());
  const [showGuide, setShowGuide] = useState(false);

  const toggle = (setter) => (id) =>
    setter((cur) => {
      const next = new Set(cur);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const togglePriority = toggle(setPriorities);
  const toggleAllergen = toggle(setAllergens);
  const toggleMethod = toggle(setMethods);

  const matches = useMemo(() => filterIngredients(priorities, allergens, methods), [priorities, allergens, methods]);


  // Going back keeps every choice so people can adjust rather than start over.
  if (showGuide) return <PersonalPlateResults matches={matches} onBack={() => setShowGuide(false)} />;

  return (
    <div
      style={{
        width: 1200,
        boxSizing: "border-box",
        background: T.cream,
        border: `1px solid ${T.creatorBorder}`,
        borderRadius: 40,
        padding: 60,
        display: "flex",
        flexDirection: "column",
        gap: 46,
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", gap: 46, alignItems: "flex-end", width: "100%" }}>
        <img alt="" src={IMG.creatorPlate} width="169.999" height="169.983" style={{ display: "block", width: 170, height: 169.984, flexShrink: 0 }} />
        <div style={{ flex: "1 0 0", borderBottom: `1px solid ${T.brown}`, paddingBottom: 30, display: "flex", flexDirection: "column", gap: 12, color: T.brown }}>
          <p style={{ margin: 0, fontFamily: OUTFIT, fontWeight: 200, fontSize: 26, lineHeight: "37px", textTransform: "uppercase" }}>
            My Healthy Eating Plate Creator
          </p>
          <p style={{ margin: 0, fontFamily: OUTFIT, fontWeight: 400, fontSize: 28, lineHeight: "36px" }}>
            What matters most to you when it comes to buying and preparing food for meals?
          </p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center", width: "100%" }}>
          <ChipGroup title="Select all that apply:">
            {PRIORITIES.map((p) => (
              <Chip key={p.id} label={p.label} selected={priorities.has(p.id)} onClick={() => togglePriority(p.id)} />
            ))}
          </ChipGroup>
          <ChipGroup title="Allergens?">
            {ALLERGENS.map((a) => (
              <Chip key={a} label={a} selected={allergens.has(a)} onClick={() => toggleAllergen(a)} />
            ))}
          </ChipGroup>
          <ChipGroup title="Preparation Method">
            {METHODS.map((m) => (
              <Chip key={m.id} label={m.label} selected={methods.has(m.id)} onClick={() => toggleMethod(m.id)} />
            ))}
          </ChipGroup>
        </div>
        <button
          type="button"
          onClick={() => setShowGuide(true)}
          style={{ background: T.crimson100, border: "none", borderRadius: 42.437, padding: "20px 40px", cursor: "pointer" }}
        >
          <span style={nunito(700, 22, { color: "white", whiteSpace: "nowrap" })}>Make My Personal Healthy Eating Plate Guide</span>
        </button>
      </div>
    </div>
  );
}

function MakeItYours() {
  return (
    <section style={{ background: "white", padding: "80px 120px", display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", textAlign: "center", color: T.slate }}>
        <h2 style={{ margin: 0, fontFamily: OUTFIT, fontWeight: 500, fontSize: 36, lineHeight: "37px", whiteSpace: "nowrap" }}>
          Nutrition is personal. Make the Plate yours!
        </h2>
        <p style={nunito(400, 26, { lineHeight: "37px" })}>
          What matters to you in food? Time? Convenience? Design your Plate your way.
        </p>
      </div>
      <PersonalPlate />
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const links = [
    ["Harvard Chan Home", "https://www.hsph.harvard.edu/"],
    ["Donate", null],
    ["Privacy Policy", "https://hsph.harvard.edu/privacy-policy/"],
    ["Report Copyright Violation", "https://www.harvard.edu/copyright-issue"],
    ["Accessibility", "https://accessibility.huit.harvard.edu/"],
  ];
  const linkStyle = nunito(800, 22, { lineHeight: "37px", color: "white", textDecoration: "none", whiteSpace: "nowrap" });
  return (
    <footer style={{ background: T.crimson300, padding: "32px 46px 46px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ padding: "16px 0" }}>
        <img alt="Harvard T.H. Chan School of Public Health" src={IMG.footerLogo} width="273" height="48.7539" style={{ display: "block" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", gap: 60 }}>
          {links.map(([label, href]) =>
            href ? (
              <a key={label} href={href} target="_blank" rel="noreferrer" style={linkStyle}>
                {label}
              </a>
            ) : (
              <span key={label} style={linkStyle}>
                {label}
              </span>
            )
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, color: "white" }}>
          <p style={nunito(600, 18, { lineHeight: "37px" })}>Copyright © 2026 The President and Fellows of Harvard College</p>
          <div>
            <p style={nunito(800, 18, { lineHeight: "26px", marginBottom: 8 })}>Terms of Use</p>
            <p style={nunito(600, 18, { lineHeight: "26px" })}>
              The contents of this website are for educational purposes and are not intended to offer personal medical advice. You should seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website. The Nutrition Source does not recommend or endorse any products.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HepRedesign() {
  return (
    <div style={{ width: 1440, background: "white", display: "flex", flexDirection: "column" }}>
      <Menu />
      <PlateSection />
      <MakeItYours />
      <Footer />
    </div>
  );
}
