import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Footer, nunito, T } from "./HepRedesign.jsx";
import { usePrefersReducedMotion } from "./tnsShared.jsx";

// Live build of the redesigned Recipes hub and recipe page.
// Source: Figma file "wippy" — RecipeHub (165:20307), RecipeHub with the filter
// menu open (165:16867), RecipeHub filtered to Vegan + Without Nuts (165:19794),
// RecipePage (165:16907) and the component sheet (165:18041). 1440 wide; the
// case study scales it into its frame.

const R = "/tns/v2/recipes";
const IMG = {
  search: "/tns/newnav/search-icon.svg",
  time: `${R}/icon-time.svg`,
  serves: `${R}/icon-serves.svg`,
  arrow: `${R}/arrow-right.svg`,
  filter: `${R}/filter-icon.svg`,
  home: `${R}/home-icon.svg`,
  hero: `${R}/hero-greens.jpg`,
};

const K = {
  crimson: T.crimson100,
  crimsonDark: "#830D1F",
  maroon: T.crimson300,
  darkText: "#13273A",
  lightestText: "#595859",
  lightBg: "#F1F0EA",
  pageBg: "#FCFBF7",
  cardBorder: "#CCCCCC",
  link: "#00658C",
};
const MERRI = "'Merriweather', Georgia, serif";
const INTER = "'Inter', system-ui, sans-serif";
const merri = (weight, size, extra = {}) => ({
  margin: 0,
  fontFamily: MERRI,
  fontWeight: weight,
  fontSize: size,
  ...extra,
});
const bare = { background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit", color: "inherit", textAlign: "left" };

/* ---------- Icons ---------- */
function Chevron({ open, color = K.crimson, width = 17.839, height = 8.919 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20.33 11.41" fill="none" aria-hidden="true"
      style={{ display: "block", flexShrink: 0, overflow: "visible", transform: open ? "scaleY(-1)" : "none" }}>
      <path d="M1.245 1.245L10.164 10.164L19.083 1.245" stroke={color} strokeWidth="2.489" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function XIcon({ size, color = "white" }) {
  const p = size * 0.28;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <path d={`M${p} ${p}L${size - p} ${size - p}M${size - p} ${p}L${p} ${size - p}`} stroke={color} strokeWidth={size / 12} strokeLinecap="round" />
    </svg>
  );
}
function Check() {
  return (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <path d="M1.5 5L4.8 8.3L11.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Dots({ count, active, onSelect, label }) {
  // Carousel Slider: 142 wide, 6 dots, filled crimson for the current one.
  return (
    <div role={onSelect ? "group" : undefined} aria-label={label} style={{ display: "flex", gap: 13.2, alignItems: "center", height: 12.888 }}>
      {Array.from({ length: count }, (_, i) => {
        const on = Array.isArray(active) ? active.includes(i) : i === active;
        const dot = { width: 12.888, height: 12.888, boxSizing: "border-box", borderRadius: "50%", border: `1.1px solid ${K.crimson}`, background: on ? K.crimson : "transparent", padding: 0, display: "block" };
        return onSelect ? (
          <button key={i} type="button" aria-label={`Slide ${i + 1}`} aria-current={on || undefined} onClick={() => onSelect(i)} style={{ ...dot, cursor: "pointer" }} />
        ) : (
          <span key={i} aria-hidden="true" style={dot} />
        );
      })}
    </div>
  );
}

/* ---------- Data ---------- */
// Only Garlic-Braised Greens has a full recipe page in the Figma file; the
// attribute tags drive the filters and were assigned for the prototype.
const RECIPES = [
  { id: "endive", title: "Endive Salad with Citrus Walnut Dressing", desc: "Citrus lends brightness to this crisp and nutty salad.", time: ["15", "min"], mins: 15, serves: 4,
    meal: ["Lunch"], cuisine: ["French"], diet: ["Vegetarian", "Vegan", "Mediterranean"], allergens: ["Tree Nuts"], tags: ["quick", "fiber"], difficulty: "Easy" },
  { id: "greens", title: "Garlic-Braised Greens", desc: "Roasted garlic melds with tender greens for a hearty side dish.", time: ["40", "min"], mins: 40, serves: 4,
    meal: ["Lunch", "Dinner"], cuisine: ["Mediterranean"], diet: ["Vegetarian", "Vegan", "Mediterranean", "DASH", "MIND", "Low-Carb"], allergens: [], tags: ["budget", "fiber"], difficulty: "Easy" },
  { id: "crawfish", title: "Crawfish Etouffee", desc: "The longer this spicy seafood stew sits, the better it gets.", time: ["1", "hour"], mins: 60, serves: 4,
    meal: ["Dinner"], cuisine: ["Southern"], diet: ["Pescatarian"], allergens: ["Shellfish", "Wheat/Gluten", "Milk/Dairy", "Nightshades"], tags: ["protein"], difficulty: "Medium" },
  { id: "farro", title: "Farro Risotto with Pesto", desc: "Tender-but-toothsome, al dente grains laden with creamy sauce.", time: ["30", "min"], mins: 30, serves: 4,
    meal: ["Dinner"], cuisine: ["Mediterranean"], diet: ["Vegetarian", "Mediterranean", "MIND"], allergens: ["Milk/Dairy", "Wheat/Gluten", "Tree Nuts"], tags: ["fiber"], difficulty: "Medium" },
  { id: "moroccan", title: "Moroccan Chicken Stew\nwith Apricots", desc: "Savor the rich warm spices and sweet dried fruit of this stew.", time: ["1.5", "hours"], mins: 90, serves: 4,
    meal: ["Dinner"], cuisine: ["Mediterranean"], diet: ["Mediterranean", "Halal"], allergens: ["Nightshades"], tags: ["protein"], difficulty: "Medium" },
  { id: "hummus", title: "Green Lentil Hummus with Herbs and Olives", desc: "Lentils give this dip an earthier flavor and extra protein!", time: ["15", "min"], mins: 15, serves: 12,
    meal: ["Snacks"], cuisine: ["Mediterranean"], diet: ["Vegetarian", "Vegan", "Mediterranean", "DASH", "Kosher", "Halal"], allergens: ["Sesame"], tags: ["quick", "budget", "protein", "fiber"], difficulty: "Easy" },
  { id: "stuffing", title: "Olive Oil Dressing (Stuffing) with Chicken & Walnuts", desc: "Walnuts give this perfect side dish a subtle, nutty flavor.", time: ["35", "min"], mins: 35, serves: 8,
    meal: ["Dinner"], cuisine: ["Southern"], diet: [], allergens: ["Wheat/Gluten", "Tree Nuts"], tags: ["protein"], difficulty: "Medium" },
  { id: "shrimp", title: "Shrimp with Red Curry and Crispy Sprouted Lentils", desc: "Roast lentils to get a crunchy topping for this rich curry.", time: ["20", "min"], mins: 20, serves: 4,
    meal: ["Dinner"], cuisine: ["Thai"], diet: ["Pescatarian"], allergens: ["Shellfish", "Fish"], tags: ["quick", "protein"], difficulty: "Medium" },
  { id: "tabouli", title: "Couscous-Quinoa Tabouli", desc: "Try this tabouli with quinoa, a nutritious wonder-grain.", time: ["20", "min"], mins: 20, serves: 4,
    meal: ["Lunch"], cuisine: ["Mediterranean"], diet: ["Vegetarian", "Vegan", "Mediterranean", "Kosher", "Halal"], allergens: ["Wheat/Gluten", "Nightshades"], tags: ["quick", "budget", "fiber"], difficulty: "Easy" },
  { id: "carrot", title: "Chef Milind’s Carrot and Coriander Soup", desc: "Coriander brightens this creamy and comforting soup.", time: ["40", "min"], mins: 40, serves: 6,
    meal: ["Lunch", "Dinner"], cuisine: ["Indian"], diet: ["Vegetarian", "Vegan", "DASH", "Halal", "Kosher"], allergens: [], tags: ["budget"], difficulty: "Easy" },
  { id: "snappeas", title: "Sugar Snap Peas with\nFresh Mint", desc: "Mint gives these crisp peas a satisfying bright freshness.", time: ["10", "min"], mins: 10, serves: 4,
    meal: ["Lunch", "Dinner"], cuisine: [], diet: ["Vegetarian", "Vegan", "Mediterranean", "Low-Carb", "Kosher", "Halal"], allergens: [], tags: ["quick"], difficulty: "Easy" },
  { id: "rice", title: "Forbidden Rice with Scallions", desc: "This rice gets its color from anthocyanin, an antioxidant.", time: ["25", "min"], mins: 25, serves: 4,
    meal: ["Dinner"], cuisine: ["Chinese"], diet: ["Vegetarian", "Vegan", "Kosher", "Halal"], allergens: [], tags: ["fiber"], difficulty: "Easy" },
  { id: "mushroom", title: "Wild Mushroom Soup\nwith Soba", desc: "Chewy soba noodles make for a satisfying and warming dish.", time: ["40", "min"], mins: 40, serves: 4,
    meal: ["Dinner"], cuisine: ["Japanese"], diet: ["Vegetarian", "Vegan"], allergens: ["Soy", "Wheat/Gluten"], tags: [], difficulty: "Medium" },
  { id: "barley", title: "Barley Roasted Portobello\nand Fennel Salad", desc: "This dish is packed with savory umami and fiber!", time: ["35", "min"], mins: 35, serves: 4,
    meal: ["Lunch"], cuisine: ["Mediterranean"], diet: ["Vegetarian", "Vegan", "Mediterranean", "MIND"], allergens: ["Wheat/Gluten"], tags: ["fiber"], difficulty: "Easy" },
  { id: "squash", title: "Butternut Squash Soup", desc: "This colorful soup gets natural sweetness from the squash.", time: ["40", "min"], mins: 40, serves: 5,
    meal: ["Dinner"], cuisine: [], diet: ["Vegetarian", "Vegan", "DASH", "Kosher", "Halal"], allergens: [], tags: ["budget", "fiber"], difficulty: "Easy" },
].map((r) => ({ ...r, img: `${R}/card-${r.id === "greens" ? "greens" : r.id}.jpg` }));

const SLIDES = [
  { img: `${R}/slide-1.jpg`, hero: true },
  { img: `${R}/slide-2.jpg`, title: "Spicy Broccolini\nwith Red Pepper", desc: "Tender broccolini is given a kick with red pepper and sautéed with olive oil." },
  { img: `${R}/slide-3.jpg`, title: "Farro with Confetti\nVegetables", desc: "Diced “confetti” vegetables slow-roasted and mixed with whole-grain farro." },
  { img: `${R}/slide-4.jpg`, title: "French Style Lentils", desc: "Whole grain mustard and a splash of red wine vinegar give complexity to this simple-to-make, hearty dish." },
  { img: `${R}/slide-5.jpg`, title: "Penne with Pistachio Pesto and Cherry Tomatoes", desc: "Blended tofu gives this pasta a surprising creaminess and extra protein!" },
  { img: `${R}/slide-6.jpg`, title: "Roasted Cauliflower\nand Walnut Soup", desc: "Walnuts give this velvety soup richness, sweetness, and a pleasant buttery quality." },
];

// Filter menu groups (FilterOptions, 165:18050). Allergies exclude; the rest include.
const GROUPS = [
  { key: "meal", label: "Meal Type", options: ["Breakfast", "Lunch", "Snacks", "Dinner", "Dessert"] },
  { key: "cuisine", label: "Cuisine", options: ["Mexican", "Southern", "Chinese", "Indian", "Japanese", "Thai", "French", "Korean", "Mediterranean"] },
  { key: "diet", label: "Diets and Dietary Needs", options: ["Vegetarian", "Vegan", "Pescatarian", "Mediterranean", "DASH", "MIND", "Low-Carb", "Halal", "Kosher"] },
  { key: "time", label: "Time", options: ["<15 minutes", "15 minutes", "30 minutes", "1 hour", "1-2 hours", "2+ hours"] },
  { key: "difficulty", label: "Difficulty", options: ["Easy", "Medium", "Hard"] },
  { key: "allergy", label: "Allergies", options: ["Milk/Dairy", "Eggs", "All Nuts", "Peanuts", "Tree Nuts", "Wheat/Gluten", "Soy", "Fish", "Shellfish", "Sesame", "Nightshades"] },
];
const TIME_TEST = {
  "<15 minutes": (m) => m < 15,
  "15 minutes": (m) => m >= 15 && m < 30,
  "30 minutes": (m) => m >= 30 && m < 60,
  "1 hour": (m) => m === 60,
  "1-2 hours": (m) => m > 60 && m <= 120,
  "2+ hours": (m) => m > 120,
};
// Quick tags share state with the filter menu where they mean the same thing,
// so picking Vegan in the menu lights up the Vegan tag (as in 165:19794).
const TAGS = [
  ["Quick and easy", "tag:quick"],
  ["On a budget", "tag:budget"],
  ["High protein", "tag:protein"],
  ["Fiber-rich", "tag:fiber"],
  ["Healthy snacks", "meal:Snacks"],
  ["Vegetarian", "diet:Vegetarian"],
  ["Vegan", "diet:Vegan"],
  ["Gluten-free", "allergy:Wheat/Gluten"],
];
const TAG_KEYS = new Set(TAGS.map(([, k]) => k));
const ALLERGY_LABEL = { "All Nuts": "Nuts", "Milk/Dairy": "Dairy" };

function matches(r, selected, query) {
  const byGroup = {};
  for (const key of selected) {
    const [g, v] = key.split(/:(.+)/);
    (byGroup[g] ||= []).push(v);
  }
  for (const [g, vals] of Object.entries(byGroup)) {
    if (g === "tag") { if (!vals.every((v) => r.tags.includes(v))) return false; continue; }
    if (g === "allergy") {
      const hit = vals.some((v) => (v === "All Nuts" ? r.allergens.some((a) => a === "Tree Nuts" || a === "Peanuts") : r.allergens.includes(v)));
      if (hit) return false;
      continue;
    }
    if (g === "time") { if (!vals.some((v) => TIME_TEST[v](r.mins))) return false; continue; }
    if (g === "difficulty") { if (!vals.includes(r.difficulty)) return false; continue; }
    if (!vals.some((v) => r[g].includes(v))) return false;
  }
  const q = query.trim().toLowerCase();
  if (q && !`${r.title} ${r.desc}`.toLowerCase().includes(q)) return false;
  return true;
}

// Scroll the nearest scrolling ancestor (the case study's frame) to a position.
function scroller(el) {
  let p = el?.parentElement;
  while (p) {
    const oy = getComputedStyle(p).overflowY;
    if ((oy === "auto" || oy === "scroll") && p.scrollHeight > p.clientHeight) return p;
    p = p.parentElement;
  }
  return null;
}

/* ---------- Hub: carousel ---------- */
function LearnMore({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...bare, height: 40, boxSizing: "border-box", padding: "8.521px 17.041px", borderRadius: 26.627, background: hover ? K.maroon : K.crimson, display: "flex", alignItems: "center", ...nunito(600, 17.041, { color: "white", whiteSpace: "nowrap" }) }}>
      Learn more
    </button>
  );
}

function Carousel({ onNotBuilt }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [note, setNote] = useState(false);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (paused || reduced) return undefined;
    const t = setTimeout(() => setI((n) => (n + 1) % SLIDES.length), 6000);
    return () => clearTimeout(t);
  }, [i, paused, reduced]);
  const s = SLIDES[i];
  const learn = () => { setNote(true); setTimeout(() => setNote(false), 2600); onNotBuilt?.(); };
  return (
    <section aria-roledescription="carousel" aria-label="Featured recipes"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      style={{ position: "relative", width: 1440, height: 440, overflow: "hidden", padding: "40px 80px", boxSizing: "border-box", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
      {SLIDES.map((sl, n) => (
        <img key={sl.img} alt="" src={sl.img} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: n === i ? 1 : 0, transition: reduced ? "none" : "opacity 600ms ease" }} />
      ))}
      <div style={{ position: "relative", width: 428, height: 360, background: K.lightBg, borderRadius: 8 }}>
        <div style={{ position: "absolute", left: 32, top: 32, width: 364, display: "flex", flexDirection: "column", gap: s.hero ? 12 : 20 }}>
          {s.hero ? (
            <>
              <h1 style={nunito(700, 42, { color: K.maroon, lineHeight: 1.194, letterSpacing: "-0.63px" })}>Explore colorful, delicious and nutritious recipes!</h1>
              <p style={merri(500, 18, { color: K.lightestText, lineHeight: 1.6, letterSpacing: "0.36px" })}>Find recipes that meet your nutritional needs, by chefs and Harvard staff.</p>
            </>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={nunito(400, 12, { color: K.darkText, letterSpacing: "-0.18px" })}>FEATURED RECIPE</p>
                <h2 style={nunito(700, 26, { color: K.darkText, letterSpacing: "-0.39px", whiteSpace: "pre-line" })}>{s.title}</h2>
                <p style={merri(500, 18, { color: K.lightestText, lineHeight: 1.6 })}>{s.desc}</p>
              </div>
              <div style={{ alignSelf: "flex-start" }}>
                {note ? (
                  <p role="status" style={nunito(600, 15, { color: K.maroon, height: 40, display: "flex", alignItems: "center" })}>This recipe isn’t built out in the prototype.</p>
                ) : (
                  <LearnMore onClick={learn} />
                )}
              </div>
            </>
          )}
        </div>
        <div style={{ position: "absolute", left: 32, top: 295, width: 364, height: 1, background: "rgba(19,39,58,0.25)" }} />
        <div style={{ position: "absolute", left: 252.52, top: 315 }}>
          <Dots count={SLIDES.length} active={i} onSelect={setI} label="Choose a featured recipe" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Hub: filters ---------- */
function FilterButton({ onClick, hidden, expanded }) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" onClick={onClick} aria-expanded={expanded} aria-controls="tns-recipe-filters"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...bare, opacity: hidden ? 0 : 1, flexShrink: 0, height: 48, boxSizing: "border-box", padding: "9.764px 16.738px", borderRadius: 139.48, background: hover ? K.maroon : K.crimson, display: "flex", alignItems: "center", gap: 6.974 }}>
      <span style={nunito(800, 16, { color: "white", letterSpacing: "1.28px" })}>FILTER</span>
      <img alt="" src={IMG.filter} style={{ width: 18.83, height: 11.158, display: "block", marginTop: -1.4 }} />
    </button>
  );
}

function CheckRow({ label, checked, onToggle }) {
  return (
    <label style={{ display: "flex", gap: 11.94, alignItems: "center", padding: "20px 17.91px", background: "white", borderBottom: "0.746px solid black", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ position: "absolute", opacity: 0, width: 1, height: 1, margin: 0 }} />
      <span aria-hidden="true" style={{ width: 19.403, height: 19.403, boxSizing: "border-box", flexShrink: 0, borderRadius: 0.97, border: `1.493px solid ${checked ? K.crimson : "black"}`, background: checked ? K.crimson : "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {checked && <Check />}
      </span>
      <span style={{ flex: 1, fontFamily: INTER, fontSize: 17.91, color: "black" }}>{label}</span>
    </label>
  );
}

function FilterMenu({ selected, toggle, onClose }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const down = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const key = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [onClose]);
  return (
    <div ref={ref} id="tns-recipe-filters" role="dialog" aria-label="Filter recipes"
      style={{ position: "absolute", left: 0, top: 0, zIndex: 5, width: 338.524, maxHeight: 450, overflowX: "hidden", overflowY: "auto", background: K.crimson, border: `2px solid ${K.crimson}`, borderRadius: 15, boxShadow: "0 12px 40px rgba(0,0,0,0.18)" }}>
      <div style={{ background: "white", borderRadius: "0 15.113px 15.113px 0", overflow: "hidden" }}>
        <div style={{ background: K.crimson, height: 48, display: "flex", alignItems: "center", padding: "0 6px 0 18.135px", gap: 7.556 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={nunito(800, 16, { color: "white", letterSpacing: "1.28px" })}>FILTER</span>
            <img alt="" src={IMG.filter} style={{ width: 18.83, height: 11.158, display: "block", marginTop: -1.4 }} />
          </div>
          <button type="button" aria-label="Close filters" onClick={onClose} style={{ ...bare, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <XIcon size={30} />
          </button>
        </div>
        {GROUPS.map((g) => {
          const isOpen = open === g.key;
          const count = g.options.filter((o) => selected.has(`${g.key}:${o}`)).length;
          return (
            <div key={g.key}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : g.key)}
                style={{ ...bare, width: "100%", height: 55.59, boxSizing: "border-box", padding: "15.764px 26.551px 15.764px 19.913px", display: "flex", alignItems: "center", gap: 8.297, background: isOpen ? K.lightBg : "white", borderBottom: "0.83px solid black" }}>
                <span style={nunito(700, 19.913, { flex: 1, color: isOpen ? K.crimsonDark : "black" })}>
                  {g.label}{count > 0 && <span style={{ color: K.crimson }}>{` (${count})`}</span>}
                </span>
                <Chevron open={isOpen} />
              </button>
              {isOpen && g.options.map((o) => (
                <CheckRow key={o} label={o} checked={selected.has(`${g.key}:${o}`)} onToggle={() => toggle(`${g.key}:${o}`)} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tag({ label, on, onClick }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick}
      style={{ ...bare, height: 40, boxSizing: "border-box", padding: "8.521px 17.041px", borderRadius: 26.627, display: "flex", alignItems: "center",
        background: on ? K.maroon : "white", border: on ? `1.5px solid ${K.maroon}` : `1.5px solid ${K.lightestText}`, filter: on ? "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" : "none",
        ...nunito(600, 17.041, { color: on ? "white" : K.darkText, whiteSpace: "nowrap" }) }}>
      {label}
    </button>
  );
}

function ActiveChip({ k, onRemove }) {
  const [g, v] = k.split(/:(.+)/);
  const isAllergy = g === "allergy";
  return (
    <button type="button" onClick={onRemove} aria-label={`Remove filter: ${isAllergy ? "without " : ""}${v}`}
      style={{ ...bare, height: 40, boxSizing: "border-box", padding: "8.521px 17.041px", borderRadius: 26.627, background: K.maroon, border: `1.5px solid ${K.lightestText}`, display: "flex", alignItems: "center", gap: 5.325 }}>
      <XIcon size={20} />
      <span style={nunito(600, 17.041, { color: "white", whiteSpace: "nowrap" })}>
        {isAllergy && <span style={{ fontWeight: 900 }}>Without </span>}
        {isAllergy ? ALLERGY_LABEL[v] || v : v}
      </span>
    </button>
  );
}

/* ---------- Hub: cards ---------- */
function Meta({ icon, children, size = 22.313, gap = 12, font = nunito }) {
  return (
    <div style={{ display: "flex", gap, alignItems: "center" }}>
      <img alt="" src={icon} style={{ width: 23.011, height: 23.011, display: "block" }} />
      <p style={font(400, size, { color: font === nunito ? K.darkText : "black", whiteSpace: "nowrap" })}>{children}</p>
    </div>
  );
}

function RecipeCard({ r, onOpen }) {
  const [hover, setHover] = useState(false);
  const [note, setNote] = useState(false);
  const built = r.id === "greens";
  const open = () => {
    if (built) onOpen(r.id);
    else { setNote(true); setTimeout(() => setNote(false), 2600); }
  };
  return (
    <article onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", minHeight: 467.717, border: `1.5px solid ${K.cardBorder}`, borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", background: "white",
        boxShadow: hover ? "0 6px 18px rgba(0,0,0,0.08)" : "none", transition: "box-shadow 150ms ease" }}>
      <img alt="" src={r.img} style={{ width: "100%", height: 201, objectFit: "cover", display: "block", flexShrink: 0 }} />
      <div style={{ flex: 1, padding: 26, display: "flex", flexDirection: "column", gap: 22.717 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <h3 style={nunito(700, 22.717, { color: K.darkText, whiteSpace: "pre-line" })}>
            <button type="button" onClick={open} style={{ ...bare, textAlign: "left" }}>{r.title}</button>
          </h3>
          <p style={merri(300, 20, { color: K.darkText, lineHeight: "28px", letterSpacing: "0.4px" })}>{r.desc}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingRight: 52 }}>
          <Meta icon={IMG.time}><b style={{ fontWeight: 700 }}>{r.time[0]}</b> {r.time[1]}</Meta>
          <Meta icon={IMG.serves}>Serves <b style={{ fontWeight: 700 }}>{r.serves}</b></Meta>
        </div>
      </div>
      <button type="button" onClick={open} aria-label={`Open ${r.title.replace("\n", " ")}`}
        style={{ ...bare, position: "absolute", right: -0.33, bottom: -0.28, padding: 7.25, borderTopLeftRadius: 17.4, background: hover ? K.maroon : K.crimson, transition: "background 150ms ease" }}>
        <img alt="" src={IMG.arrow} style={{ width: 43.5, height: 43.5, display: "block", transform: hover ? "translateX(2px)" : "none", transition: "transform 150ms ease" }} />
      </button>
      {note && (
        <div role="status" style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 201, background: "rgba(255,255,255,0.94)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <p style={nunito(600, 20, { color: K.maroon, lineHeight: 1.35 })}>Only Garlic-Braised Greens has a full recipe page in this prototype.</p>
        </div>
      )}
    </article>
  );
}

function RecipeHub({ state, setState, onOpen }) {
  const { selected, query, shown } = state;
  const [menuOpen, setMenuOpen] = useState(false);
  const setSelected = (fn) => setState((s) => ({ ...s, selected: fn(s.selected), shown: 9 }));
  const toggle = (k) => setSelected((prev) => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const results = useMemo(() => RECIPES.filter((r) => matches(r, selected, query)), [selected, query]);
  const visible = results.slice(0, shown);
  const chips = [...selected].filter((k) => !TAG_KEYS.has(k));
  const pages = Math.max(1, Math.ceil(results.length / 9));
  const closeMenu = useMemo(() => () => setMenuOpen(false), []);

  return (
    <>
      <Carousel />
      <section style={{ background: K.pageBg, padding: "64px 80px 100px", display: "flex", flexDirection: "column", gap: 48, alignItems: "center" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <form role="search" onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 16.226 }}>
              <label htmlFor="tns-recipe-search" style={nunito(700, 32, { color: "black" })}>Search Recipes</label>
              <div style={{ width: 630, height: 48, boxSizing: "border-box", background: "white", border: `1.5px solid ${K.lightestText}`, borderRadius: 26.627, padding: "8.521px 17.041px", display: "flex", alignItems: "center", gap: 12 }}>
                <input id="tns-recipe-search" type="search" value={query} placeholder="Type to search..."
                  onChange={(e) => setState((s) => ({ ...s, query: e.target.value, shown: 9 }))}
                  style={{ flex: 1, border: "none", outline: "none", padding: 0, background: "transparent", ...nunito(600, 17.041, { color: K.darkText }) }} />
                <img alt="" src={IMG.search} style={{ width: 20, height: 20, display: "block" }} />
              </div>
            </form>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ position: "relative", display: "flex", gap: 32, alignItems: "center" }}>
                <FilterButton onClick={() => setMenuOpen(true)} hidden={menuOpen} expanded={menuOpen} />
                <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TAGS.map(([label, k]) => (
                    <Tag key={k} label={label} on={selected.has(k)} onClick={() => toggle(k)} />
                  ))}
                </div>
                {menuOpen && <FilterMenu selected={selected} toggle={toggle} onClose={closeMenu} />}
              </div>
              {chips.length > 0 && (
                <div style={{ paddingLeft: 151, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {chips.map((k) => <ActiveChip key={k} k={k} onRemove={() => toggle(k)} />)}
                </div>
              )}
            </div>
          </div>
          {visible.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 60 }}>
              {visible.map((r) => <RecipeCard key={r.id} r={r} onOpen={onOpen} />)}
            </div>
          ) : (
            <div style={{ padding: "60px 0", display: "flex", flexDirection: "column", gap: 20, alignItems: "center", textAlign: "center" }}>
              <p style={nunito(700, 28, { color: K.darkText })}>No recipes match all of those filters.</p>
              <button type="button" onClick={() => setState((s) => ({ ...s, selected: new Set(), query: "", shown: 9 }))}
                style={{ ...bare, height: 48, padding: "0 32px", borderRadius: 139.48, background: K.crimson, ...nunito(800, 16, { color: "white", letterSpacing: "0.64px" }) }}>
                CLEAR FILTERS
              </button>
            </div>
          )}
        </div>
        {results.length > shown && (
          <button type="button" onClick={() => setState((s) => ({ ...s, shown: s.shown + 9 }))}
            style={{ ...bare, height: 48, padding: "9.764px 32px", borderRadius: 139.48, background: K.crimson, fontFamily: INTER, fontWeight: 700, fontSize: 16, color: "white", letterSpacing: "0.64px" }}>
            SHOW MORE
          </button>
        )}
        {results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
            <Dots count={pages} active={Array.from({ length: Math.ceil(visible.length / 9) }, (_, n) => n)} />
            <p role="status" style={nunito(600, 22.717, { color: K.darkText })}>
              Showing {visible.length} of {results.length} results
            </p>
          </div>
        )}
      </section>
    </>
  );
}

/* ---------- Recipe page ---------- */
const GREENS = {
  title: "Garlic-Braised Greens",
  author: "Mollie Katzen & Harvard University Dining Services",
  intro: [
    "Roasted garlic has a handsomely bitter flavor that is both deeper and milder than fresh garlic. Roasted and fresh team up really well together to embrace an assortment of greens.",
    "Remember to roast the garlic as much as several days ahead of time. Store it in a sealed plastic bag in the refrigerator until use. Furthermore, make this in two batches so the pan won’t be crowded. Contact with the hot pan is key.",
  ],
  nutrition: ["130 calories", "3 grams of protein", "9 grams of carbohydrates", "3 grams of fiber", "85 milligrams of sodium"],
  ingredients: [
    "2 medium-sized bulbs garlic (tip sliced off near the top)",
    "3 tablespoons extra-virgin olive oil",
    "8 to 10 cups or about a pound (packed) braising greens",
    "Salt to taste",
    "½ to 1 teaspoon minced or crushed garlic",
  ],
  steps: [
    "Preheat the oven to 375 degrees Fahrenheit. Line a small baking tray with foil and brush lightly with olive oil.",
    "Stand the garlic bulbs root side-down on the prepared tray, and drizzle the open top surfaces (where you sliced off the tops) with a little olive oil. Roast in the center of the oven for 35 to 40 minutes, or until they feel soft when gently squeezed. Remove the tray from the oven, and let the bulbs cool until comfortable to handle. Separate the cloves, and squeeze each one over a small bowl, releasing the pulp. (Some cloves might keep their shape, while others turn to mush. All forms are welcome!)",
    "You can also peel all the garlic while it is still uncooked, and wrap the cloves in a tight little foil packet, spooning in about a teaspoon of olive oil. Roast the packet for about 20 to 30 minutes at 325 degrees Fahrenheit or until the cloves are very soft.",
    "Stem the greens, if necessary. Leave them whole, if very small, or coarsely chop if medium-small. Your call.",
    "Place a large, deep skillet over medium heat. After about a minute, add half the remaining olive oil, and swirl to coat the pan. Toss in half of the greens, turn the heat up to medium-high, and stir-fry, turning with tongs, for about 5 minutes, or until wilted. Stir in half the fresh garlic, sprinkle lightly with salt, if desired, then transfer to a medium-sized bowl, and set aside. Repeat this step with the remaining olive oil and greens.",
    "When the leaves have wilted and the fresh garlic is mixed in, reduce the heat to medium-low, and return the first batch of greens to the pan. Add the roasted garlic, turning everything together with tongs to combine. Add a little extra olive oil, if desired, and taste to adjust salt. Serve hot, warm, or at room temperature.",
  ],
};
const BODY = merri(300, 20.193, { color: "black", lineHeight: 1.45 });
const DM = (weight, size) => ({ fontFamily: "'DM Sans', sans-serif", fontWeight: weight, fontSize: size, fontVariationSettings: '"opsz" 14' });

function RecipePage({ onBack }) {
  const [nutritionOpen, setNutritionOpen] = useState(false);
  const [steps, setSteps] = useState(() => GREENS.steps.map(() => true));
  const anyOpen = steps.some(Boolean);
  const r = RECIPES.find((x) => x.id === "greens");
  const crumb = nunito(600, 12, { color: K.link, textDecoration: "underline", whiteSpace: "nowrap" });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 79, alignItems: "center", paddingBottom: 79 }}>
      <nav aria-label="Breadcrumb" style={{ width: 1440, height: 48.583, boxSizing: "border-box", background: K.lightBg, padding: "0 80px", display: "flex", alignItems: "center" }}>
        <img alt="" src={IMG.home} style={{ width: 23.603, height: 13.603, display: "block" }} />
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", gap: 4, alignItems: "center" }}>
          <li><span style={crumb}>The Nutrition Source</span></li>
          <li aria-hidden="true" style={nunito(600, 12, { color: K.lightestText })}>&gt;</li>
          <li><button type="button" onClick={onBack} style={{ ...bare, ...crumb }}>Recipes</button></li>
          <li aria-hidden="true" style={nunito(600, 12, { color: K.lightestText })}>&gt;</li>
          <li aria-current="page" style={nunito(600, 12, { color: K.lightestText, whiteSpace: "nowrap" })}>{GREENS.title}</li>
        </ol>
      </nav>
      <article style={{ width: "100%", boxSizing: "border-box", padding: "0 242px", display: "flex", flexDirection: "column", gap: 32 }}>
        <img alt="Braised greens in a metal bowl" src={IMG.hero} style={{ width: "100%", height: 339, objectFit: "cover", borderRadius: 12, display: "block" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h1 style={nunito(700, 48, { color: K.maroon, letterSpacing: "-0.72px" })}>{GREENS.title}</h1>
            <div style={{ display: "flex", gap: 38 }}>
              <Meta icon={IMG.time} gap={7.67} font={(w, s, x) => ({ margin: 0, ...DM(w, s), ...x })}><b>{r.time[0]}</b> {r.time[1]}</Meta>
              <Meta icon={IMG.serves} gap={7.67} font={(w, s, x) => ({ margin: 0, ...DM(w, s), ...x })}>Serves <b>{r.serves}</b></Meta>
            </div>
          </div>
          <p style={nunito(400, 16, { color: "black" })}><b style={{ fontWeight: 700 }}>Author</b> {GREENS.author}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 866 }}>
            {GREENS.intro.map((t) => <p key={t.slice(0, 12)} style={BODY}>{t}</p>)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button type="button" aria-expanded={nutritionOpen} onClick={() => setNutritionOpen((o) => !o)} style={{ ...bare, display: "flex", gap: 10, alignItems: "center", alignSelf: "flex-start" }}>
            <span style={nunito(700, 24, { color: "black" })}>Nutrition Facts</span>
            <Chevron open={nutritionOpen} color="black" width={14} height={7} />
          </button>
          {nutritionOpen && (
            <div style={merri(300, 20, { color: "black" })}>
              <p style={merri(700, 20, { color: "black", marginBottom: 8 })}>Per 1/4 of recipe:</p>
              <ul style={{ margin: 0, paddingLeft: 30 }}>
                {GREENS.nutrition.map((n) => <li key={n} style={{ marginBottom: 4 }}>{n}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h2 style={nunito(700, 24, { color: "black" })}>Ingredients</h2>
          <ul style={{ margin: 0, paddingLeft: 33, ...nunito(400, 22, { color: "black" }) }}>
            {GREENS.ingredients.map((g) => <li key={g} style={{ marginBottom: 4 }}>{g}</li>)}
          </ul>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ borderBottom: "1px solid black", paddingBottom: 12, display: "flex", gap: 16, alignItems: "flex-end" }}>
            <h2 style={nunito(700, 24, { color: "black" })}>Directions</h2>
            <button type="button" onClick={() => setSteps(steps.map(() => !anyOpen))} style={{ ...bare, paddingBottom: 3, ...nunito(700, 14, { color: "#363636" }) }}>
              {anyOpen ? "CLOSE ALL" : "OPEN ALL"}
            </button>
          </div>
          {GREENS.steps.map((t, n) => (
            <div key={n} style={{ borderBottom: "1px solid black", paddingBottom: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              <button type="button" aria-expanded={steps[n]} onClick={() => setSteps(steps.map((v, j) => (j === n ? !v : v)))}
                style={{ ...bare, display: "flex", gap: 12, alignItems: "center", alignSelf: "flex-start" }}>
                <span style={nunito(700, 20.193, { color: "black" })}>Step {n + 1}</span>
                <Chevron open={steps[n]} color="black" width={14} height={7} />
              </button>
              {steps[n] && <p style={BODY}>{t}</p>}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

/* ---------- Page ---------- */
export default function RecipesRedesign() {
  const [view, setView] = useState("hub");
  const [hub, setHub] = useState({ selected: new Set(), query: "", shown: 9 });
  const rootRef = useRef(null);
  const hubScroll = useRef(0);
  const go = (next) => {
    const sc = scroller(rootRef.current);
    if (next === "recipe") hubScroll.current = sc ? sc.scrollTop : 0;
    setView(next);
    requestAnimationFrame(() => { if (sc) sc.scrollTop = next === "hub" ? hubScroll.current : 0; });
  };
  return (
    <div ref={rootRef} style={{ width: 1440, background: "white", position: "relative" }}>
      <Menu />
      {view === "hub" ? (
        <RecipeHub state={hub} setState={setHub} onOpen={() => go("recipe")} />
      ) : (
        <RecipePage onBack={() => go("hub")} />
      )}
      <Footer />
    </div>
  );
}
