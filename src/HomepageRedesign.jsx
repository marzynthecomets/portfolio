import { useState } from "react";
import { Menu, Footer, nunito, OUTFIT, T } from "./HepRedesign.jsx";

// Live build of the redesigned Nutrition Source homepage.
// Source: Figma file "wippy", frame HNS (node 52:3066), 1440 wide.
// Rendered at full design size; the case study scales it into its frame.

const H = "/tns/v2/home";
const IMG = {
  arrowCircle: "/tns/v2/arrow-circle.svg",
  search: "/tns/newnav/search-icon.svg",
  searchGo: `${H}/search-go.svg`,
  check: `${H}/check.svg`,
  chevron: `${H}/chevron.svg`,
  donations: `${H}/donations.png`,
};

const C = {
  cream: "#FFFDF4",
  lightBg: "#F1F0EA",
  grayBg: "#F0F0F2",
  darkText: "#13273A",
  lightestText: "#595859",
  placeholder: "rgba(89,88,89,0.75)",
};

/* ---------- Hero ---------- */
// Frame 256 (76:5723): hovering or focusing a word makes it the bold, active
// one with the arrow, and swaps the photo. The words stay in place.
const WORDS = [
  { word: "plate", img: "/tns/v2/fork-photo.png", crop: { height: "114.34%", left: "-10.26%", top: "-7.25%", width: "63.35%" } },
  { word: "cup", img: `${H}/hero-cup.png`, crop: { height: "359.46%", left: "-45.5%", top: "-129.68%", width: "100%" } },
  { word: "cart", img: `${H}/hero-cart.png`, crop: { height: "194.44%", left: "-58.43%", top: "-55.62%", width: "100.38%" } },
];
const WORD_TEXT = { fontFamily: OUTFIT, fontSize: 68.691, lineHeight: "62.135px", whiteSpace: "nowrap" };

function HeroWord({ word, active, onActivate }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 12 }}>
      <button
        type="button"
        aria-pressed={active}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={onActivate}
        style={{
          ...WORD_TEXT,
          fontWeight: active ? 700 : 400,
          color: active ? "#000" : "rgba(0,0,0,0.5)",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          transition: "color 0.15s",
        }}
      >
        {word}
      </button>
      {active && (
        <span style={{ paddingTop: 9.159, display: "flex" }}>
          <img alt="" src={IMG.arrowCircle} width="53.4265" height="53.4265" style={{ display: "block" }} />
        </span>
      )}
    </span>
  );
}

function Hero() {
  const [active, setActive] = useState("plate");
  const [first, ...rest] = WORDS;
  return (
    // The basket photo has transparent edges; the hero's own grey (the colour
    // the gradient fades to) shows through there, not the page's cream.
    <section style={{ position: "relative", background: "rgb(241,241,241)", padding: "80px 230px 80px 250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {WORDS.map((w) => (
          <div key={w.word} style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: active === w.word ? 1 : 0, transition: "opacity 0.3s" }}>
            <img alt="" src={w.img} style={{ position: "absolute", maxWidth: "none", ...w.crop }} />
          </div>
        ))}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(81.03deg, rgba(241,241,241,0) 42.73%, rgb(241,241,241) 48.617%)" }} />
      </div>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
        <div style={{ width: 586, color: C.darkText, letterSpacing: "-0.42px" }}>
          <p style={nunito(700, 28)}>Your nutrition guide starts here.</p>
          <p style={nunito(400, 28)}>Explore research-backed guidelines from experts at Harvard on the healthiest ways to</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8.717 }}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <span style={{ ...WORD_TEXT, fontWeight: 700, color: "#000" }}>fill your&nbsp;</span>
            <HeroWord word={first.word} active={active === first.word} onActivate={() => setActive(first.word)} />
          </div>
          <div style={{ paddingLeft: 247, display: "flex", flexDirection: "column", gap: 9 }}>
            {rest.map((w) => (
              <HeroWord key={w.word} word={w.word} active={active === w.word} onActivate={() => setActive(w.word)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Search + tags ---------- */
const TAGS = [
  ["Healthy recipes", "Nutrition guidance for my kids", "How much protein I should be eating?", "What’s an anti-inflammatory diet?"],
  ["How does nutrition affect my sleep?", "What’s intuitive eating?", "How much salt is okay?", "How do carbohydrates affect my blood sugar?"],
];

function TagSection() {
  const [query, setQuery] = useState("");
  return (
    <section style={{ background: C.lightBg, padding: "60px 80px", display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
      <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <label htmlFor="tns-home-search" style={nunito(700, 32, { color: C.darkText, letterSpacing: "-0.48px", whiteSpace: "nowrap" })}>
          I’m looking for...
        </label>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 630, height: 64, boxSizing: "border-box", background: "white", border: `1.5px solid ${C.lightestText}`, borderRadius: 50, padding: "20px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <input
              id="tns-home-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search"
              style={{ flex: 1, border: "none", outline: "none", padding: 0, background: "transparent", ...nunito(600, 17.041, { color: C.darkText }) }}
            />
            <img alt="" src={IMG.search} style={{ width: 20, height: 20, display: "block" }} />
          </div>
          <button type="submit" aria-label="Search" style={{ width: 64, height: 64, padding: 0, border: "none", background: "transparent", cursor: "pointer" }}>
            <img alt="" src={IMG.searchGo} width="64" height="64" style={{ display: "block" }} />
          </button>
        </div>
      </form>
      <div style={{ display: "flex", flexDirection: "column", gap: 15, alignItems: "center", width: "100%" }}>
        {TAGS.map((row, i) => (
          <div key={i} style={{ display: "flex", gap: 10, justifyContent: "center", width: "100%" }}>
            {row.map((t) => {
              const on = query === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setQuery(on ? "" : t)}
                  style={{ background: on ? C.darkText : "white", border: `1.5px solid ${C.lightestText}`, borderRadius: 26.627, padding: "15px 30px", cursor: "pointer", ...nunito(600, 17.041, { color: on ? "white" : C.darkText, whiteSpace: "nowrap" }) }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Navigation cards ---------- */
// crop: Figma's placement of each photo in its 400 × 200 slot. Two exports
// (Nutrition 101, the donation photo) came with invalid placement values, so
// those fall back to filling the slot.
const CARDS = [
  { title: "Nutrition 101: The Healthy Eating Plate", body: "Create healthy, balanced meals using this visual guide as a blueprint.", img: `${H}/card-hep.png`, crop: null },
  { title: "What Should I Eat?", body: "Navigate the world of macronutrients and food groups to build a foundation for lifelong health.", img: `${H}/card-eat.png`, crop: { height: "300%", left: "-0.11%", top: "-60.19%", width: "100%" } },
  { title: "What Should I Drink?", body: "From water to coffee, discover which beverages best support your health and which to limit.", img: `${H}/card-drink.png`, crop: null },
  { title: "Diets & Dieting", body: "Separate nutrition facts from myths to understand the impact of popular diets.", img: `${H}/card-diets.png`, crop: { height: "133.31%", left: "0%", top: "-7.99%", width: "100%" } },
  { title: "Your Health & Disease", body: "Discover how dietary choices can lower your risk of heart disease, diabetes, and other conditions.", img: `${H}/card-health.png`, crop: { height: "168.49%", left: "-0.09%", top: "-33.75%", width: "100%" } },
  { title: "Sustainability", body: "Explore this multifaceted issue, in which food production and our diets play a major role.", img: `${H}/card-sustainability.png`, crop: null },
  { title: "Healthy Food Settings", body: "Tips for fostering healthy eating habits in schools, workplaces, and our communities.", img: `${H}/card-settings.png`, crop: { height: "266.67%", left: "0%", top: "-83.33%", width: "100%" } },
  { title: "Recipes", body: "Healthy eating begins in the kitchen, whether at home or another venue.", img: `${H}/card-recipes.png`, crop: { height: "133.51%", left: "0.06%", top: "-33.67%", width: "100%" } },
  { title: "Nutrition News", body: "Stay informed on recent studies and emerging trends in the world of nutrition science.", img: `${H}/card-news.png`, crop: { height: "161.33%", left: "-10.52%", top: "-30.4%", width: "121.04%" } },
];

function NavCard({ card }) {
  const r = 7.988;
  return (
    <div style={{ width: 400, background: C.grayBg, borderRadius: r, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: 200, overflow: "hidden", borderRadius: `${r}px ${r}px 0 0` }}>
        <img
          alt=""
          src={card.img}
          loading="lazy"
          style={
            card.crop
              ? { position: "absolute", maxWidth: "none", ...card.crop }
              : { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
          }
        />
      </div>
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={nunito(700, 17.041, { color: C.darkText })}>{card.title}</p>
          <p style={nunito(600, 14.911, { color: C.lightestText })}>{card.body}</p>
        </div>
        <button type="button" style={{ background: T.crimson100, border: "none", borderRadius: 26.627, padding: "8.521px 17.041px", cursor: "pointer", ...nunito(600, 14.91, { color: "white", whiteSpace: "nowrap" }) }}>
          Learn more
        </button>
      </div>
    </div>
  );
}

function NavigationCards() {
  const rows = [CARDS.slice(0, 3), CARDS.slice(3, 6), CARDS.slice(6, 9)];
  return (
    <section style={{ background: "white", padding: "40px 80px", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      <h2 aria-level={3} style={nunito(700, 32, { color: C.darkText, letterSpacing: "-0.48px", whiteSpace: "nowrap" })}>Explore the Nutrition Source</h2>
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 40, justifyContent: "center", alignItems: "stretch", width: "100%", padding: i === 0 ? "20px 0" : i === 1 ? "0 0 20px" : 0 }}>
          {row.map((c) => (
            <NavCard key={c.title} card={c} />
          ))}
        </div>
      ))}
    </section>
  );
}

/* ---------- Donation ---------- */
const AMOUNTS = ["$50", "$100", "$250", "$500"];

function Donations() {
  const [frequency, setFrequency] = useState("One-time");
  const [amount, setAmount] = useState(null);
  const [other, setOther] = useState("");
  const pill = { height: 40, borderRadius: 26.627, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none" };
  return (
    <section style={{ padding: "0 80px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: "100%", boxSizing: "border-box", borderRadius: 7.988, overflow: "hidden", padding: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img alt="" src={IMG.donations} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
        <div style={{ position: "relative", flex: "1 0 0", padding: "0 40px", color: "white", letterSpacing: "-0.3834px" }}>
          <p style={nunito(700, 25.562, { marginBottom: 20 })}>
            Help us keep evidence-based
            <br />
            nutrition education free and accessible
            <br />
            for everyone!
          </p>
          <p style={nunito(800, 25.562)}>Make a Donation Today.</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} style={{ position: "relative", width: 644, boxSizing: "border-box", background: "white", borderRadius: 7.988, padding: 32, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <div role="radiogroup" aria-label="Donation frequency" style={{ width: 580, height: 40, background: C.lightBg, borderRadius: 26.63, display: "flex", alignItems: "center", overflow: "hidden" }}>
            {["One-time", "Monthly"].map((f) => {
              const on = frequency === f;
              return (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setFrequency(f)}
                  style={{ ...pill, flex: "1 0 0", height: 39.509, borderRadius: 26.63, background: on ? T.crimson100 : "transparent", gap: 9, padding: 8.254 }}
                >
                  {on && <img alt="" src={IMG.check} width="20.0792" height="18.6511" style={{ display: "block" }} />}
                  <span style={nunito(600, 17.041, { color: on ? "white" : C.lightestText, whiteSpace: "nowrap" })}>{f}</span>
                </button>
              );
            })}
          </div>
          <p style={nunito(700, 17.041, { color: C.darkText, whiteSpace: "nowrap" })}>Choose an amount to donate</p>
          <div style={{ display: "grid", gridTemplateColumns: "285px 285px", gap: 10, width: "100%" }}>
            {AMOUNTS.map((a) => {
              const on = amount === a;
              return (
                <button
                  key={a}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setAmount(on ? null : a);
                    setOther("");
                  }}
                  style={{ ...pill, width: 285, background: on ? C.darkText : C.lightBg, padding: "8.521px 17.041px" }}
                >
                  <span style={nunito(700, 17.041, { color: on ? "white" : C.lightestText })}>{a}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,0.25fr) minmax(0,1fr)", width: 580, overflow: "hidden" }}>
            <div style={{ height: 40, background: C.lightBg, borderRadius: "26.63px 0 0 26.63px", display: "flex", gap: 16, alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
              <span style={nunito(600, 17.04, { color: C.lightestText })}>USD</span>
              <img alt="" src={IMG.chevron} width="12.2485" height="7.34646" style={{ display: "block" }} />
            </div>
            <label style={{ height: 40, background: C.lightBg, borderLeft: "1.598px solid white", borderRadius: "0 26.63px 26.63px 0", display: "flex", alignItems: "center", gap: 6, padding: "0 20px" }}>
              <span style={nunito(700, 17.04, { color: C.lightestText })}>$</span>
              <input
                inputMode="decimal"
                value={other}
                onChange={(e) => {
                  setOther(e.target.value.replace(/[^\d.]/g, ""));
                  setAmount(null);
                }}
                placeholder="Other"
                aria-label="Other amount in US dollars"
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: 0, ...nunito(700, 17.04, { color: C.darkText }) }}
              />
            </label>
          </div>
          <div style={{ paddingTop: 10, width: "100%" }}>
            <button type="submit" style={{ ...pill, width: "100%", background: T.crimson100, padding: "8.521px 17.041px" }}>
              <span style={nunito(700, 17.041, { color: "white" })}>Donate</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ---------- Newsletter ---------- */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section style={{ background: C.lightBg, padding: "40px 80px", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
      <h2 aria-level={3} style={nunito(700, 25.562, { color: C.darkText, letterSpacing: "-0.3834px", textAlign: "center", whiteSpace: "nowrap" })}>Subscribe to The Nutrition Source Update</h2>
      <p style={nunito(700, 17.041, { color: C.lightestText, textAlign: "center", whiteSpace: "nowrap" })}>A monthly e-newsletter with practical strategies for healthy living.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,0.25fr)", gap: 10, width: 954, height: 48 }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSent(false);
          }}
          placeholder="Email"
          aria-label="Email"
          style={{ height: 48, boxSizing: "border-box", background: "white", border: `1.5px solid ${C.lightestText}`, borderRadius: 26.63, padding: "0 20px", outline: "none", ...nunito(600, 19.172, { color: C.darkText, letterSpacing: "-0.2876px" }) }}
        />
        <button type="submit" style={{ height: 48, border: "none", borderRadius: 26.627, background: T.crimson100, cursor: "pointer", ...nunito(700, 17.041, { color: "white" }) }}>
          Sign Up
        </button>
      </form>
      {sent && <p role="status" style={nunito(600, 15, { color: C.lightestText })}>This is a prototype, so no email was sent.</p>}
    </section>
  );
}

export default function HomepageRedesign() {
  return (
    <div style={{ width: 1440, background: C.cream, display: "flex", flexDirection: "column" }}>
      <Menu />
      <Hero />
      <TagSection />
      <NavigationCards />
      <Donations />
      <Newsletter />
      <Footer />
    </div>
  );
}
