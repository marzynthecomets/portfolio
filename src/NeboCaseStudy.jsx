import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import leoProfanity from "leo-profanity";

const COLORS = {
  purps: "#270059",
  purpsStripe: "#3B00AD",
  limon: "#EDFF46",
  neptune: "#0300B4",
  neptuneDeep: "#0400E8",
  thothy: "#CCB6FF",
  mint: "#A5FFAD",
  white: "#FFFFFF",
  black: "#000000",
};

const NEBO_IFRAME_SRC = "https://marzynthecomets.github.io/nebo/?v=20260509h";
const NEBO_AVATAR = "/nebo-character.png";
const NEBO_LOGO = "/nebo-logo.png";

const BOLT_ASSETS = {
  nluDiagram: "/nebo-bolts/nlu-diagram.png",
  boubaKiki: "/nebo-bolts/bouba-kiki.svg",
  conceptSketch: "/nebo-bolts/concept-sketch.png",
  logoSketch: "/nebo-bolts/logo-sketch.png",
  wompScene: "/nebo-bolts/womp-scene.png",
  wompLights: "/nebo-bolts/womp-lights.png",
};

const CONVERSATION_DIAGRAM_HREF =
  "https://www.figma.com/board/ikwSVFBQp7skxsWcptjXLj/Nebo_ConversationalDiagram?node-id=12-1686&t=15LgwRZSyTdAIjpH-1";

// --- Nebo-ese translator engine (mirrors the live engine in the Nebo app) ---
const NEBO_ONSET = ["b", "p", "m", "n", "w", "br", "pl", "pf", "bl", ""];
const NEBO_VOWEL = ["uu", "oo", "aa", "ii", "ee", "o", "u", "a", "i"];
const NEBO_CODA = ["p", "m", "n", "b", "tz", "", "", "", "", "", "", ""];
const NEBO_FLAIR = ["~", "~", "", "", "", "", "", ""];

const NEBO_BLOCKLIST = [
  "ass", "damn", "hell", "shit", "piss", "fuck", "crap", "dick",
  "cock", "poop", "poo", "pee", "butt", "tit", "tits", "boob", "bitch",
  "slut", "whore", "cunt", "fag", "nig", "cum", "jizz", "wank",
  "anus", "porn", "sexy", "nude", "dumb", "stupid",
  "fuk", "fuc", "sht", "dik", "kok", "pnus", "bewb",
  "pp", "peep", "weew", "poopu", "poopoo", "peepee",
  "bum", "bumm", "nob", "nip", "nips", "pub", "puu", "puu-puu",
  "wee", "weep", "womb", "nut", "nutz", "putz", "mutz",
  "nub", "nubbin", "pimp", "wimp",
];

function neboHashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function neboPick(arr, seed) {
  return arr[seed % arr.length];
}

function neboIsBad(s) {
  const lower = s.toLowerCase();
  return NEBO_BLOCKLIST.some((bad) => lower.includes(bad));
}

function neboBuildWord(clean, salt) {
  const syllableCount = clean.length <= 3 ? 1 : clean.length <= 6 ? 2 : 3;
  let result = "";
  for (let i = 0; i < syllableCount; i++) {
    const seed = neboHashStr(clean + salt + String(i));
    result +=
      neboPick(NEBO_ONSET, seed) +
      neboPick(NEBO_VOWEL, seed >> 3) +
      neboPick(NEBO_CODA, seed >> 5);
  }
  return result;
}

function toNebo(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return word;
  if (clean === "nebo" || clean === "thoth") return word;

  const h = neboHashStr(clean);
  let result = "";
  for (let attempt = 0; attempt < 10; attempt++) {
    const salt = attempt === 0 ? "" : `_salt${attempt}`;
    result = neboBuildWord(clean, salt);
    if (!neboIsBad(result)) break;
  }

  if (
    word[0] === word[0].toUpperCase() &&
    word[0] !== word[0].toLowerCase()
  ) {
    result = result[0].toUpperCase() + result.slice(1);
  }
  result += neboPick(NEBO_FLAIR, h >> 2);
  return result;
}

function translateToNebo(text) {
  return text.replace(/[a-zA-Z]+/g, (m) => toNebo(m));
}

// --- Nebo voice synthesis (1:1 port of the live app's chirp engine) ---
const NEBO_MOODS = {
  happy:    { freqLow: 600,  freqHigh: 900,  slideDirection: "up",     speed: 100, gain: 0.15, chirpDuration: 0.1 },
  excited:  { freqLow: 700,  freqHigh: 1100, slideDirection: "up",     speed: 75,  gain: 0.15, chirpDuration: 0.08 },
  worried:  { freqLow: 350,  freqHigh: 550,  slideDirection: "down",   speed: 140, gain: 0.12, chirpDuration: 0.14 },
  sad:      { freqLow: 280,  freqHigh: 450,  slideDirection: "down",   speed: 170, gain: 0.10, chirpDuration: 0.16 },
  neutral:  { freqLow: 450,  freqHigh: 700,  slideDirection: "random", speed: 120, gain: 0.13, chirpDuration: 0.12 },
  scanning: { freqLow: 500,  freqHigh: 850,  slideDirection: "up",     speed: 90,  gain: 0.14, chirpDuration: 0.1 },
  chill:    { freqLow: 400,  freqHigh: 600,  slideDirection: "random", speed: 150, gain: 0.11, chirpDuration: 0.14 },
};

let _neboAudioCtx = null;
function getNeboAudioCtx() {
  if (typeof window === "undefined") return null;
  if (!_neboAudioCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    _neboAudioCtx = new Ctor();
  }
  if (_neboAudioCtx.state === "suspended") _neboAudioCtx.resume();
  return _neboAudioCtx;
}

function neboChirp(ctx, startFreq, endFreq, duration, gain, when) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(startFreq, when);
  osc.frequency.exponentialRampToValueAtTime(endFreq, when + duration);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(gain, when + 0.15 * duration);
  g.gain.setValueAtTime(gain, when + 0.6 * duration);
  g.gain.linearRampToValueAtTime(0, when + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(when);
  osc.stop(when + duration + 0.01);
}

function neboRand(low, high) {
  return low + Math.random() * (high - low);
}

// Plays a chirp sequence for `text` in `mood`. Returns total duration in ms.
function playNeboLine(text, mood) {
  const ctx = getNeboAudioCtx();
  if (!ctx) return 0;
  const cfg = NEBO_MOODS[mood] || NEBO_MOODS.neutral;
  const cleaned = (text || "").replace(/[^a-zA-Z]/g, "");
  const chirpCount = !cleaned
    ? 3
    : Math.max(2, Math.min(12, Math.ceil(cleaned.length / 2.5)));
  const start = ctx.currentTime;
  let totalMs = 0;
  for (let i = 0; i < chirpCount; i++) {
    const a = neboRand(cfg.freqLow, cfg.freqHigh);
    const slide = 50 + 150 * Math.random();
    let b;
    if (cfg.slideDirection === "up") b = a + slide;
    else if (cfg.slideDirection === "down") b = a - slide;
    else b = Math.random() > 0.5 ? a + slide : a - slide;
    b = Math.max(100, b);
    const offsetSec = (20 * Math.random()) / 1000;
    const when = start + i * (cfg.speed / 1000) + offsetSec;
    const dur = cfg.chirpDuration + 0.04 * Math.random();
    neboChirp(ctx, a, b, dur, cfg.gain, when);
    totalMs = i * cfg.speed + 1000 * cfg.chirpDuration;
  }
  return totalMs + 200;
}

// --- Thoth voice (Web Speech API, mirrors the app) ---
function speakThoth(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const superstar = voices.find((v) => v.name === "Superstar");
  if (superstar) u.voice = superstar;
  u.pitch = 1;
  u.rate = 1.1;
  window.speechSynthesis.speak(u);
  return u;
}

// Slurs the default leo-profanity dictionary misses (it catches e.g.
// "bulldyke" / "faggot" / "tranny" but not bare "dyke", "homo", etc.).
const NEBO_SLUR_SUPPLEMENT = [
  "dyke", "homo", "fag", "fags", "queer", "tranny", "trannies",
  "retard", "retarded", "spaz", "spastic", "gimp", "midget",
  "gypsy", "gyppo", "raghead", "wetback", "chink", "gook",
  "jap", "kraut", "wop", "dago", "paki", "redskin", "savage",
  "coon", "coons", "darkie", "darky",
];

// Layer in our Nebo-specific words (kid-bathroom-humor stuff like "poo",
// "pee", "butt") plus the slur supplement on top of leo-profanity's
// general English dictionary.
leoProfanity.add([...NEBO_BLOCKLIST, ...NEBO_SLUR_SUPPLEMENT]);

// True if any whitespace-delimited token in `text` (after stripping
// non-letters and lowercasing) matches a blocklisted word. Stripping
// catches obfuscation like "f*ck", "FUCK!!!", "f.u.c.k"; the blocklist
// match is exact so common words ("hello", "class", "title") don't get
// false-flagged by short substrings like "hell" or "ass".
function neboInputHasBadWord(text) {
  const tokens = text.toLowerCase().split(/\s+/);
  return tokens.some((tok) => {
    const clean = tok.replace(/[^a-z]/g, "");
    if (!clean) return false;
    if (leoProfanity.check(clean)) return true;
    return NEBO_BLOCKLIST.includes(clean);
  });
}

function CodeBlock({ children, fontSize = 20, maxHeight }) {
  const isMobile = useIsMobile();
  const codeRef = useRef(null);
  const [scroll, setScroll] = useState({
    overflows: false,
    thumbHeight: 0,
    thumbTop: 0,
  });
  const renderedFontSize = isMobile ? Math.max(12, Math.round(fontSize * 0.7)) : fontSize;
  const padding = isMobile ? 18 : 30;

  useLayoutEffect(() => {
    if (!maxHeight) return;
    const el = codeRef.current;
    if (!el) return;
    const update = () => {
      const visible = el.clientHeight;
      const total = el.scrollHeight;
      if (total <= visible + 1) {
        setScroll({ overflows: false, thumbHeight: 0, thumbTop: 0 });
        return;
      }
      const thumbHeight = Math.max(40, (visible / total) * visible);
      const maxScroll = total - visible;
      const thumbTop = maxScroll > 0
        ? (el.scrollTop / maxScroll) * (visible - thumbHeight)
        : 0;
      setScroll({ overflows: true, thumbHeight, thumbTop });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(update)
      : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, [maxHeight, children]);

  const isScrollable = Boolean(maxHeight);

  return (
    <div
      style={{
        background: "#000000",
        borderRadius: isMobile ? 14 : 20,
        padding,
        display: "flex",
        gap: isMobile ? 16 : 30,
        alignItems: "stretch",
        maxHeight,
        boxSizing: "border-box",
      }}
    >
      <pre
        ref={codeRef}
        className="nebo-code-scroll"
        style={{
          margin: 0,
          flex: "1 1 0",
          minWidth: 0,
          color: "#EDFF46",
          fontFamily: "'Space Grotesk', ui-monospace, monospace",
          fontWeight: 300,
          fontSize: renderedFontSize,
          lineHeight: 1.3,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowY: isScrollable ? "auto" : "visible",
        }}
      >
        {children}
      </pre>
      {isScrollable && (
        <div
          aria-hidden
          style={{
            width: 8,
            flexShrink: 0,
            borderRadius: 200,
            background: scroll.overflows
              ? "rgba(255, 255, 255, 0.51)"
              : "transparent",
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
              width: 8,
              top: scroll.thumbTop,
              height: scroll.thumbHeight,
              background: "#FFFFFF",
              borderRadius: 200,
            }}
          />
        </div>
      )}
    </div>
  );
}

function NeboTranslator() {
  const isMobile = useIsMobile();
  const [input, setInput] = useState("Hello, my name is Nebo!");
  const inputBlocked = neboInputHasBadWord(input);
  const output = inputBlocked
    ? "Otz~ Nebo's not going to say that!"
    : translateToNebo(input);

  const labelStyle = {
    color: COLORS.limon,
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: isMobile ? 11 : 13,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    margin: 0,
    opacity: 0.75,
  };

  return (
    <div
      style={{
        background: COLORS.neptune,
        borderRadius: 16,
        padding: isMobile ? 20 : 28,
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 16 : 22,
        border: `1px solid ${COLORS.limon}`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={labelStyle}>English</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={isMobile ? 3 : 2}
          spellCheck={false}
          aria-label="English text to translate into Nebo-ese"
          style={{
            width: "100%",
            background: "transparent",
            color: COLORS.limon,
            border: "none",
            borderBottom: `1px solid ${COLORS.limon}`,
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? 16 : 22,
            lineHeight: 1.4,
            resize: "vertical",
            padding: "6px 0",
            boxSizing: "border-box",
            caretColor: COLORS.limon,
            fontVariationSettings: "'opsz' 14",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p style={labelStyle}>Nebo-ese</p>
        <p
          aria-live="polite"
          style={{
            margin: 0,
            color: COLORS.limon,
            fontFamily: "'Fredoka One', sans-serif",
            fontSize: isMobile ? 24 : 32,
            lineHeight: 1.2,
            wordBreak: "break-word",
            minHeight: isMobile ? 58 : 78,
          }}
        >
          {output || " "}
        </p>
      </div>
    </div>
  );
}

// Real lines pulled from the Nebo app's source, paired with their
// in-app emoticons + moods. Each emoticon doubles as the mood signal —
// when the line plays, this is the face Nebo wears.
const NEBO_VOICE_LINES = [
  { mood: "happy",    emoticon: "(◕ヮ◕)", text: "Pfa!", note: "thanks!" },
  { mood: "excited",  emoticon: "(^O^)",                text: "Wii paapmiipniip~!", note: "scanning the stars!" },
  { mood: "sad",      emoticon: "(>_<)",                text: "Nib otz~!", note: "that's not it..." },
  { mood: "scanning", emoticon: "(★‿★)", text: "Miinii~!", note: "scanner activated!" },
];

const THOTH_VOICE_LINES = [
  "Hello? Oh, are you a human?",
  "Scanning the skies above us!",
  "Sunsets on Mars look blue!",
  "You could fit one million Earths inside the Sun!",
];

function PlayIcon({ size = 14 }) {
  return (
    <svg
      viewBox="0 0 12 14"
      width={size}
      height={size * (14 / 12)}
      aria-hidden="true"
      style={{ display: "block", marginLeft: 2 }}
    >
      <path d="M0 0 L12 7 L0 14 Z" fill="#FFFFFF" />
    </svg>
  );
}

function PlayButton({ onClick, isPlaying, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        flexShrink: 0,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: COLORS.neptune,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.15s ease",
        transform: isPlaying ? "scale(1.08)" : "scale(1)",
        boxShadow: isPlaying
          ? `0 0 0 3px ${COLORS.neptune}33`
          : "none",
      }}
    >
      <PlayIcon />
    </button>
  );
}

const VOICE_FRAME_STYLE = (isMobile) => ({
  background: COLORS.limon,
  borderRadius: 16,
  border: `2px solid ${COLORS.neptune}`,
  padding: isMobile ? 18 : 24,
  display: "flex",
  flexDirection: "column",
  gap: isMobile ? 10 : 12,
});

function NeboVoicePlayer() {
  const isMobile = useIsMobile();
  const [activeMood, setActiveMood] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const play = (line) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMood(line.mood);
    const durationMs = playNeboLine(line.text, line.mood);
    timeoutRef.current = setTimeout(
      () => setActiveMood(null),
      Math.max(400, durationMs)
    );
  };

  return (
    <div style={VOICE_FRAME_STYLE(isMobile)}>
      {NEBO_VOICE_LINES.map((line) => {
        const isPlaying = activeMood === line.mood;
        return (
          <div
            key={line.mood}
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 12 : 16,
              padding: isMobile ? "6px 4px" : "8px 4px",
            }}
          >
            <PlayButton
              onClick={() => play(line)}
              isPlaying={isPlaying}
              label={`Play ${line.mood} chirp`}
            />
            <span
              style={{
                fontFamily: "'Space Mono', 'Courier New', monospace",
                fontSize: isMobile ? 18 : 22,
                color: COLORS.neptune,
                minWidth: isMobile ? 60 : 78,
                display: "inline-block",
                transition: "transform 0.18s ease",
                transform: isPlaying ? "scale(1.18)" : "scale(1)",
                fontVariationSettings: "'opsz' 14",
              }}
            >
              {line.emoticon}
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "'Fredoka One', sans-serif",
                  fontSize: isMobile ? 18 : 22,
                  color: COLORS.neptune,
                  lineHeight: 1.2,
                }}
              >
                {line.text}
              </span>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: isMobile ? 10 : 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: COLORS.neptune,
                  opacity: 0.6,
                }}
              >
                {line.mood} · {line.note}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ThothVoicePlayer() {
  const isMobile = useIsMobile();
  const [activeIdx, setActiveIdx] = useState(null);
  const utterRef = useRef(null);

  useEffect(
    () => () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    },
    []
  );

  const play = (text, idx) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setActiveIdx(idx);
    const u = speakThoth(text);
    if (!u) {
      setActiveIdx(null);
      return;
    }
    u.onend = () => setActiveIdx((cur) => (cur === idx ? null : cur));
    u.onerror = () => setActiveIdx((cur) => (cur === idx ? null : cur));
    utterRef.current = u;
  };

  return (
    <div style={VOICE_FRAME_STYLE(isMobile)}>
      {THOTH_VOICE_LINES.map((line, i) => {
        const isPlaying = activeIdx === i;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 12 : 16,
              padding: isMobile ? "6px 4px" : "8px 4px",
            }}
          >
            <PlayButton
              onClick={() => play(line, i)}
              isPlaying={isPlaying}
              label={`Play Thoth line: ${line}`}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: isMobile ? 16 : 20,
                lineHeight: 1.35,
                color: COLORS.neptune,
                fontVariationSettings: "'opsz' 14",
              }}
            >
              {line}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function BoltLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ color: "inherit", fontWeight: 700, textDecoration: "underline" }}
    >
      {children}
    </a>
  );
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

const STEPS = [
  {
    id: "meet",
    avatars: ["nebo", "thoth"],
    headline: "Meet Nebo and Thoth!",
    body: (
      <>
        <p style={{ margin: 0 }}>
          Nebo is a cute alien astronaut and Thoth is his faithful computer
          navigation system.
        </p>
        <p style={{ margin: 0 }}>
          The two of them have crash-landed on Earth and need help getting home!
        </p>
      </>
    ),
  },
  {
    id: "scan",
    avatars: ["nebo", "thoth"],
    headline: (
      <>
        Let&rsquo;s <strong>scan the sky</strong> to get home!
      </>
    ),
    body: (
      <>
        <p style={{ margin: 0 }}>
          The key feature of Nebo is the{" "}
          <span style={{ color: COLORS.mint, fontWeight: 700 }}>
            Star Scanner
          </span>{" "}
          which uses the state a user is in to identify which constellation is
          closest and most visible!
        </p>
        <p style={{ margin: 0 }}>
          Users can then learn fun facts about the different stars that make up
          the constellation or choose to scan for other constellations nearby.
        </p>
      </>
    ),
  },
  {
    id: "characters",
    avatars: ["nebo", "thoth"],
    headline: "Driving discovery through story and characters",
    body: (
      <>
        <p style={{ margin: 0 }}>
          Virtual characters have been proven to{" "}
          <strong>
            help improve K&ndash;12 students&rsquo; learning outcomes and
            motivations
          </strong>{" "}
          to learn!
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 10,
            lineHeight: 1.142,
            marginTop: 8,
          }}
        >
          Schroeder, Noah L, Shan Zhang, and Emmanuel Dorley. &ldquo;Virtual
          Characters Help K&ndash;12 Students Learn and Improve Motivation: A
          Meta-Analysis.&rdquo; Review of Educational Research, November 29,
          2025. https://journals.sagepub.com/doi/10.3102/00346543251389930.
        </p>
      </>
    ),
  },
  {
    id: "safety",
    avatars: [],
    headline: "Safety-first design",
    body: (
      <>
        <p style={{ margin: 0 }}>
          The only data Nebo needs is a user&rsquo;s state which is not
          personally identifiable information and is compliant with COPPA.
        </p>
        <p style={{ margin: 0 }}>
          Additionally, with the rise in unhealthy relationships with AI
          chatbots, Nebo was designed to <strong>not</strong> be powered by an
          LLM.{" "}
          <strong>
            Every conversational branch is designed by a human and vetted.
          </strong>
        </p>
        <p style={{ margin: 0, fontStyle: "italic" }}>
          Even the character design is safety-led.
        </p>
      </>
    ),
  },
  {
    id: "creating",
    avatars: [],
    headline: "Creating Characters",
    isCharacterSplit: true,
  },
];

const BOLTS = [
  {
    id: "multi-modality",
    label: "Multi-Modality",
    title: "Multi-Modality",
    noScroll: true,
    body: (
      <>
        <p style={{ margin: 0 }}>
          Nebo is a mobile browser experience with a{" "}
          <strong>primarily chat-driven interface</strong> with touch input,
          text-to-speech voiceover and character-driven sound design.
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>Why touch input AND chat?</p>
        <p style={{ margin: 0 }}>
          Typing in &ldquo;hey&rdquo; is easy, but typing in &ldquo;Pherkad&rdquo;
          to learn more about the star? Not so much, especially for kids. For
          inputs with a high likelihood of typos (common in children), we
          provide drop-down <strong>buttons</strong> and{" "}
          <strong>option buttons</strong> to simplify input.
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>Why text-to-speech?</p>
        <p style={{ margin: 0 }}>
          Giving Thoth a voice has the combined benefits of giving the character
          a voice, but also helps kids who may struggle with reading text
          output.
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>
          Why alien language and chirps for Nebo?
        </p>
        <p style={{ margin: 0 }}>
          Since Nebo is the emotional element in the game, we wanted to design
          him so that he was expressive but not a character you could really
          build a relationship with. Giving him chirps lets us make the most of
          his expressiveness and moods to add emotional tone and storytelling
          elements while staying contained to his storyline.
        </p>
      </>
    ),
  },
  {
    id: "nlu",
    label: "Natural Language Understanding",
    title: "Natural Language Understanding",
    body: (
      <>
        <p style={{ margin: 0 }}>
          So, what do we use for a chatbot if not an LLM? This might sound
          old-fashioned but Natural Language Understanding is still great! By
          building a database of <strong>utterance data</strong>, or words and
          phrases associated with intents or meaning, we can still build an
          understanding of what a user is saying, that is, building NLU.
        </p>
        <p style={{ margin: 0 }}>
          Historically, this is done with an NLU service like AWS&rsquo;s Lex,
          but for a fairly linear narrative, it made more sense to build this
          natively in React with a Javascript engine. Where using an LLM makes
          sense is to generate absolute bucket-loads of possible utterance data
          for different intents.
        </p>
        <p style={{ margin: 0 }}>
          For example, for a <strong>YesIntent,</strong> aka, how someone says
          yes, the utterance data looks something like this:
        </p>
        <CodeBlock maxHeight={382}>
{`"yes", "yeah", "yep", "yup", "ya", "ye", "yea", "yah", "yeh", "yas", "yass", "yasss", "yusss", "yass queen", "yess", "yesss", "yessss", "yesssss", "yessssss", "yeaah", "yeahh", "yeahhh", "yeahhhh", "yepp", "yuppp", "yuppers", "yepperoni", "yuparoo", "yepperdoodle", "yepski", "yepsicle", "y", "sure", "sure thing", "shore", "shore thing", "fer sure", "ok", "okay", "okk", "okkk", "okie", "okey", "okeh", "okai", "k", "kk", "kkk sure", "kk sure", "alright", "aiight", "aight", "ight", "bet", "betbet", "fact", "facts", "true", "truth", "real talk", "cool", "coolio", "cool cool", "cool beans", "fine", "fine fine", "sounds good", "sounds great", "sounds fun", "sounds cool", "sounds awesome", "sounds like a plan", "good idea", "great idea", "for sure", "fo sho", "fosho", "fer sho", "deal", "it's a deal", "its a deal", "you got a deal", "okie doke", "absolutely", "absolutley", "definitely", "definately", "of course", "ofc", "course", "duh", "well duh", "obviously", "obvi", "obvs", "heck yes", "heck yeah", "heckyes", "heckyeah", "oh yeah", "oh yes", "oh ya", "ohyeah", "yes please", "yes pls", "yeah sure", "yea sure", "yeah okay", "100", "100%", "1000%", "10000%", "indeed", "indubitably", "certainly", "naturally", "you bet", "you betcha", "betcha", "darn right", "dang right", "darn tootin", "darn tootin'", "i can", "i will", "i'll help", "ill help", "i can help", "i will help", "i wanna help", "i want to help", "i'd love to", "id love to", "i would love to", "i want to", "i wanna", "wanna", "i'll try", "ill try", "i can try", "i'll see what i can do", "let's go", "lets go", "let's gooo", "lets gooo", "let's do it", "lets do it", "let's do this", "lets do this", "let's roll", "lets roll", "lets ride", "let me help", "lemme help", "lemme at em", "lemme at them", "count me in", "i'm in", "im in", "i'm down", "im down", "i'm game", "im game", "down for it", "down to", "down to help", "woohoo", "woo hoo", "woohooo", "woop", "woot", "woot woot", "yay", "yayy", "yayyy", "yayyyy", "yaya", "wahoo", "whoo", "whoop", "whoopee", "hooray", "hurray", "hurrah", "huzzah", "epic", "amazing", "awesome", "wonderful", "fantastic", "got it", "gotcha", "got ya", "u got it", "you got it", "roger", "roger that", "10-4", "10 4", "ten four", "copy", "copy that", "affirmative", "no problem", "np", "no prob", "yes sir", "yessir", "yes ma'am", "yes maam", "yes mam", "no problemo", "no problem-o", "no probs", "you betcha", "betcha bottom dollar", "fer sure", "fer sho", "why not", "say less", "less go", "leggo", "lesgo", "lfg", "yolo", "send it", "we ridin", "we eatin", "fr", "fr fr", "frfr", "for real", "for realz", "no cap", "nocap", "on god", "ong", "i guess", "i guess so", "guess so", "i guess yeah", "uh yes", "uh yeah", "umm yes", "umm yeah", "fine then", "ok then", "ok fine", "okay fine", "alright then", "alright fine", "mhm", "mmhm", "mhmm", "mm hmm", "mmm hmm", "uh huh", "uh-huh", "uhuh", "uhhuh", "yee", "yeet", "yee haw", "yeehaw", "yippee", "yippie", "si", "sí", "oui", "ja", "jah", "da", "hai", "ya ya", "claro", "cierto", "vale", "okido"`}
        </CodeBlock>
        <p style={{ margin: 0 }}>
          The other thing that a service like Lex gets you is slot management,
          intent management, and session attribute management. But for a fairly
          linear and well-controlled narrative structure, that&rsquo;s not
          really necessary. I don&rsquo;t need to manage slots since the only
          true user input is the user&rsquo;s state. I also designed the
          conversation flow to manage divergence from the narrative and push
          the user back into the flow I desired. You can view the diagram below
          or{" "}
          <BoltLink href={CONVERSATION_DIAGRAM_HREF}>
            look at it in better detail here
          </BoltLink>
          :
        </p>
        <img
          src={BOLT_ASSETS.nluDiagram}
          alt="Nebo conversational flow diagram"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </>
    ),
  },
  {
    id: "nebo-language",
    label: "Nebo's Language",
    title: "Nebo's Language",
    body: (
      <>
        <p style={{ margin: 0 }}>
          How does one actually design an alien language to be{" "}
          <strong>
            linguistically cute, consistent and easy for a writer to use at
            scale?
          </strong>
        </p>
        <p style={{ margin: 0 }}>
          Enter the hash! A hash is, essentially a bit of math that lets us
          transform a word into a string of numbers, then back into an alien
          word. The same English word becomes the same alien word every time.
          We use a hash to make a <strong>phonology</strong> engine that can
          take a written bit of script or conversation in English (to spare our
          poor copywriters) and turn it into Nebo-ese!
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>
          How we use math to get linguistic &ldquo;cuteness&rdquo;
        </p>
        <p style={{ margin: 0 }}>
          So what makes a language cute? There&rsquo;s this thing called the
          bouba/kiki effect. Of the two shapes below, which do you think is the
          bouba and which is the kiki?
        </p>
        <img
          src={BOLT_ASSETS.boubaKiki}
          alt="Bouba and kiki shapes"
          style={{
            width: "100%",
            maxWidth: 524,
            height: "auto",
            display: "block",
          }}
        />
        <p style={{ margin: 0 }}>
          You probably got it right. Everybody does. But how do you get a
          language to be &ldquo;bouba&rdquo; or squishy and round, just like
          Nebo? You select phonemes (bits of sound that make up words) that
          feel like bouba! We break a word up into: <em>onset</em>, the
          beginning of a word; <em>vowel</em>, self-explanatory but also
          sometimes called the <em>nucleus</em>; <em>coda</em>, the ending or
          closure of the word; and, for fun, we add <em>flair</em>, the little
          tail on the end of the word! Our alien flair could also be called a{" "}
          <em>suprasegmental</em> or <em>prosodic</em> feature, adding meaning
          and character to our words!
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>
          So, in the code, we break things down like this:
        </p>
        <CodeBlock>
{`const ONSET = ["b", "p", "m", "n", "w", "br", "pl", "pf", "bl", ""];
const VOWEL = ["uu", "oo", "aa", "ii", "ee", "o", "u", "a", "i"];
const CODA  = ["p", "m", "n", "b", "tz", "", "", "", "", "", "", ""];
const FLAIR = ["~", "~", "", "", "", "", "", ""];`}
        </CodeBlock>
        <p style={{ margin: 0 }}>
          Then the hash breaks down our original English word into math, maps
          it to our phonemes which are optimized for maximum bouba, and
          transforms it into Nebo-ese! The translator is hard-baked into the
          code, so that the English scripts are translated automatically!
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>
          Try it yourself:
        </p>
        <NeboTranslator />
        <p style={{ margin: 0, fontWeight: 700 }}>
          But wait, couldn&rsquo;t we accidentally make the word
          &ldquo;poop&rdquo; or &ldquo;boob&rdquo;?
        </p>
        <p style={{ margin: 0 }}>
          Ah, well, you see, yes but no! Baked into our engine is a blocklist!
          Before the engine serves up the Nebo-ese translation, it checks the
          word against the blocklist and if it matches, the engine runs it
          again with a slightly different bit of math.
        </p>
      </>
    ),
  },
  {
    id: "nebo-voice",
    label: "Nebo's Voice",
    title: "Nebo's Voice",
    noScroll: true,
    body: (
      <>
        <p style={{ margin: 0 }}>
          Using text-to-speech on Nebo&rsquo;s alien language would sound, in a
          word, wack. But we do want the expressiveness of a voice!
        </p>
        <p style={{ margin: 0 }}>
          So, we use <strong>Web Audio API</strong> to make Nebo&rsquo;s
          chirps! Web Audio API is basically a synthesizer. So, how do you make
          a synthesizer sound like a character? How do you make synths have
          mood and tone?
        </p>
        <p style={{ margin: 0 }}>
          With <em>prosody</em>! Prosody is the rhythm, pitch and frequency of
          language that helps give it meaning. We can dictate these qualities
          in a synthesizer and map them to moods. Every sentence gets a mood,
          seen below:
        </p>
        <CodeBlock fontSize={19}>
{`happy:   { freqLow: 600,  freqHigh: 900,  slideDirection: "up",   speed: 100 }
excited: { freqLow: 700,  freqHigh: 1100, slideDirection: "up",   speed: 75  }
worried: { freqLow: 350,  freqHigh: 550,  slideDirection: "down", speed: 140 }
sad:     { freqLow: 280,  freqHigh: 450,  slideDirection: "down", speed: 170 }`}
        </CodeBlock>
        <p style={{ margin: 0 }}>
          Happier sentences are higher frequencies and slide up! Sadder
          sentences are slower and lower.
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>
          Hear Nebo&rsquo;s moods:
        </p>
        <NeboVoicePlayer />
      </>
    ),
  },
  {
    id: "thoth-voice",
    label: "Thoth's Voice",
    title: "Thoth's Voice",
    noScroll: true,
    body: (
      <>
        <p style={{ margin: 0 }}>
          Thoth is the latest in a long line of computer characters. We could
          have gone the suave and sleek British route, a la Jarvis, but
          that&rsquo;s no fun! I used Web Speech API&rsquo;s
          &ldquo;Superstar&rdquo; with a few tweaks to pitch and rate:
        </p>
        <CodeBlock fontSize={19}>
{`const superstar = voices.find(v => v.name === "Superstar");
u.voice = superstar;
u.pitch = 1;
u.rate = 1.1;
speechSynthesis.speak(u);`}
        </CodeBlock>
        <p style={{ margin: 0 }}>
          The only problem is, I don&rsquo;t know if the voice sounds the same
          on all devices. Future research is getting as many people as possible
          to run the demo on different devices to see what happens or if it
          needs to use a fallback or it just sounds weird.
        </p>
        <p style={{ margin: 0 }}>
          I did think about using a voice agent like the ElevenLabs service,
          but honestly, the latency would have just driven me up the wall. I
          could have pre-baked the lines, but that wouldn&rsquo;t have been
          scalable in the long run or easily editable if I wanted to change
          some lines here or there.
        </p>
        <p style={{ margin: 0 }}>
          Plus, there&rsquo;s a diegetic (in-story) reason he sounds like a
          robot. Because he is!
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>
          Hear Thoth speak:
        </p>
        <ThothVoicePlayer />
      </>
    ),
  },
  {
    id: "astronomy-api",
    label: "AstronomyAPI",
    title: "AstronomyAPI",
    body: (
      <>
        <p style={{ margin: 0 }}>
          God bless the good folks over at AstronomyAPI. AstronomyAPI is an
          open API that allows you to call celestial body and star chart data
          based on your latitude and longitude. The API generates a chart
          visual and you can choose between different render styles.
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>
          How do you get a user&rsquo;s latitude and longitude?
        </p>
        <p style={{ margin: 0 }}>
          So, that would technically be illegal as our users are assumed to be
          children. Under COPPA, the Children&rsquo;s Online Privacy Protection
          Act, you can&rsquo;t collect specific location data, even what city a
          young user is in, without the explicit consent of a guardian or
          parent.
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>What do you do instead?</p>
        <p style={{ margin: 0 }}>
          Instead, we ask a user to provide what state they&rsquo;re in.
          It&rsquo;s at a nonspecific enough level that eliciting the
          information doesn&rsquo;t violate COPPA. We call the latitude and
          longitude of the state&rsquo;s capital and use that to ping the API.
          The difference between a star chart for New York City and Albany is
          essentially the same.
        </p>
        <p style={{ margin: 0 }}>
          The other fun side effect is we can also teach kids about the Bortle
          scale, a rating from 1&ndash;9 that indicates how much light
          pollution obscures the night sky and the user&rsquo;s ability to view
          the stars. I pulled together a database of each state&rsquo;s
          capitals and what the Bortle rating is, pulling data from{" "}
          <BoltLink href="https://www.lightpollutionmap.info/">
            lightpollutionmap.info
          </BoltLink>
          . When the kid triggers the Star Scanner and enters their state, I
          take the opportunity to teach them about the scale and what their
          capital&rsquo;s Bortle scale rating is.
        </p>
      </>
    ),
  },
  {
    id: "fuzzy-matching",
    label: "Fuzzy String Matching",
    title: "Fuzzy String Matching",
    body: (
      <>
        <p style={{ margin: 0 }}>
          This is where it gets math-y, and I&rsquo;m sorry. So, if you&rsquo;re
          not using an LLM to actually power the conversation engine or a NLU
          service likes AWS&rsquo;s Lex, and you&rsquo;ve decided instead to
          use a database with thousands of utterance data strings, you need a
          way to handle things when someone enters a word or string that&rsquo;s{" "}
          <em>close</em> to a string in your database, but not exactly, i.e., a
          typo. Kids are not great at spelling, so any conversation engine
          needs to be good at handling typos. This is what we call fuzzy string
          matching.
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>How does it work?</p>
        <p style={{ margin: 0 }}>
          So, there&rsquo;s this thing called <em>Levenshtein distance</em>,
          aka the number of edits needed to change a string to a completely
          different string.
          <br />
          Example, the Levenshtein distance between &ldquo;kitten&rdquo; and
          &ldquo;sitting&rdquo; is 3:
        </p>
        <ol style={{ margin: 0, paddingLeft: 36, display: "flex", flexDirection: "column", gap: 4 }}>
          <li>kitten &rarr; sitten (substitution of &ldquo;s&rdquo; for &ldquo;k&rdquo;)</li>
          <li>sitten &rarr; sittin (substitution of &ldquo;i&rdquo; for &ldquo;e&rdquo;)</li>
          <li>sittin &rarr; sitting (insertion of &ldquo;g&rdquo; at the end).</li>
        </ol>
        <p style={{ margin: 0 }}>
          Using this, we guess what string a user was going for if they make a
          typo. The longer the word, the more typos they get. But the shorter
          the word, the less wiggle room.
        </p>
        <p style={{ margin: 0 }}>
          You hardcode a little Levenshtein distance checking into your engine:
        </p>
        <CodeBlock maxHeight={382}>
{`function editDistance(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function fuzzyMatch(input, names) {
  const lower = input.toLowerCase().trim();

  const exact = names.find((n) => n.toLowerCase() === lower);
  if (exact) return exact;

  let bestMatch = null;
  let bestDist = Infinity;

  for (const name of names) {
    const dist = editDistance(lower, name.toLowerCase());
    const threshold = name.length <= 4 ? 1 : name.length <= 7 ? 2 : 3;
    if (dist <= threshold && dist < bestDist) {
      bestDist = dist;
      bestMatch = name;
    }
  }

  return bestMatch;
}`}
        </CodeBlock>
        <p style={{ margin: 0 }}>
          And voila, typo tolerance aka fuzzy string matching.
        </p>
      </>
    ),
  },
  {
    id: "proxying",
    label: "Proxying",
    title: "Proxying",
    noScroll: true,
    body: (
      <>
        <p style={{ margin: 0 }}>
          Proxying is one of the things you learn very quickly is important
          when vibe-coding. Essentially, to use an API, you typically have a
          key, like a password. Now, you could stash that key in your code but
          that would be like posting your Facebook password to X. Deeply
          inadvisable. Anyone could take your password and make havoc for you
          and your digital life. Proxying makes you a nice safe little box to
          stash your key in. Instead of pinging AstronomyAPI directly, I ping
          the proxy (in this case, Netlify) and say, &ldquo;Hey, do you mind
          asking AstronomyAPI for this chart, please?&rdquo; and my proxy runs
          off to AstronomyAPI, grabs the star chart, and comes running back to
          the user with a beautiful star chart. All without putting my key out
          to the public for anyone to use and abuse.
        </p>
      </>
    ),
  },
  {
    id: "vibe-coding",
    label: "Vibe-Coding",
    title: "Vibe-Coding",
    body: (
      <>
        <p style={{ margin: 0 }}>
          Now, if you&rsquo;re thinking, Mars, how did you do this? I
          didn&rsquo;t know that you were a developer! That&rsquo;s correct, I
          absolutely am not a developer. This project was put together with
          Claude and Claude Code. I drew the concept art and 3D modeled the
          environment and character of Nebo, and designed the wireframes in
          Figma, but the technical implementation was all Claude and Claude
          Code. The conversation engine doesn&rsquo;t use an LLM but an LLM was
          used to build the engine.
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>
          I think I learned some valuable lessons along the way:
        </p>
        <ul style={{ margin: 0, paddingLeft: 36, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>
            <strong>Planning is literally everything.</strong> You can go back
            and forth forever with an LLM if you don&rsquo;t have a clear
            vision in mind.
          </li>
          <li>
            <strong>Maintain design control via Figma MCP.</strong> Even if you
            screenshot some sketches or give an LLM screenshots, it&rsquo;s
            always going to be guessing at what you want. The Figma MCP
            actually retrieves your exact designs pixel by pixel from a design
            file.
          </li>
          <li>
            <strong>Plan multiple edits per turn.</strong> Enumerate the
            changes you want made and list them out in one message so you
            don&rsquo;t burn time and tokens making edits piecemeal one by one.
          </li>
          <li>
            <strong>Ask your LLM to teach you and help you learn.</strong>{" "}
            It&rsquo;s easy to just have an LLM churn, burn, and have it spit
            out the product. But it&rsquo;s better to impress upon your LLM the
            value of pedagogy, not just efficiency. Ask it to explain what
            it&rsquo;s doing and ask it to involve you in choices, especially
            when those choices have trade-offs you might not be aware of.
          </li>
          <li>
            <strong>Actually read documentation and laws.</strong> When I
            initially designed this app, Claude assured me that collecting city
            names was fine under COPPA since we wouldn&rsquo;t be storing the
            data. However, when I actually read the law, FTC guidance, and
            several law firm blog posts, I learned that it&rsquo;s not just
            about storing the data, but about the elicitation itself. So,
            yeah, you still have to do your homework.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "concept-art",
    label: "Concept Art",
    title: "Concept Art",
    body: (
      <>
        <p style={{ margin: 0 }}>
          I love concepting, especially as an art director turned product
          designer. Drawing sketches helps you come up with new ways to explore
          information and interfaces, especially in an age where LLMs are
          trained on endless existing design patterns and regurgitate them all
          the same.
        </p>
        <div
          style={{
            display: "flex",
            gap: 47,
            alignItems: "flex-start",
            marginTop: 30,
          }}
        >
          <img
            src={BOLT_ASSETS.conceptSketch}
            alt="Initial Nebo interface concept sketch"
            style={{ width: 355, height: "auto", flexShrink: 0, display: "block" }}
          />
          <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ margin: 0 }}>
              This is my initial sketch for the interface and characters. You
              can see that Nebo was originally purple and Thoth was a classic
              green text emoticon. A friend pointed out that this Nebo design
              was very Pokemon Ditto-adjacent so I made him more classically
              alien-green.
            </p>
            <p style={{ margin: 0 }}>
              I also had been experimenting with making the ship more battered
              since the crash is part of the storyline but it felt distracting
              in the interface. The Nebo text also used to be inside the ship
              panel but it became too overwhelming so I pulled it out into a
              speech bubble.
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 47,
            alignItems: "flex-start",
            marginTop: 30,
          }}
        >
          <img
            src={BOLT_ASSETS.logoSketch}
            alt="Hand-drawn Nebo logo concept"
            style={{ width: 355, height: "auto", flexShrink: 0, display: "block" }}
          />
          <p style={{ margin: 0, flex: "1 1 0", minWidth: 0 }}>
            Here&rsquo;s my sketch of the logo. I wanted something bouba and
            puffy. I considered keeping the hand-drawn element as it was
            charming, but I wanted to make it 3D like Nebo himself. I drew
            these designs by hand in Procreate, then vectorized them for use in
            Womp.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "modeling",
    label: "3D Modeling",
    title: "3D Modeling",
    body: (
      <>
        <p style={{ margin: 0 }}>
          I wanted to give Nebo and his ship dimension and texture to make the
          experience feel more immersive. I built the scene in Womp, a liquid
          3D interface, using my concept art as reference.
        </p>
        <p style={{ margin: 0 }}>
          You can actually see the different elements of the scene here from
          this angle. There&rsquo;s a light actually between the two
          environment walls to keep him well-lit.
        </p>
        <img
          src={BOLT_ASSETS.wompScene}
          alt="Nebo 3D scene in Womp"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <p style={{ margin: 0 }}>
          There&rsquo;s also a hefty array of both scene lights and these
          in-scene pink lights that ring the bubble.
        </p>
        <img
          src={BOLT_ASSETS.wompLights}
          alt="Nebo 3D scene lighting array"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <p style={{ margin: 0 }}>
          Now, to actually bring this scene into the experience, bringing in
          real 3D objects would have caused unbearable latency and load issues.
          Instead, I exported the objects as PNGs and used the z-index to
          position them accordingly. That also allows me to animate and control
          Nebo&rsquo;s positioning independently from the other layers.
        </p>
      </>
    ),
  },
];

const DESIGN_W = 1440;
// Approximate yellow nav height (20px top pad + 20px bottom pad + 28px font).
// Used to keep the phone, hero block, and each stepper screen all
// vertically centered within the *visible* purple region (i.e. the
// viewport minus the nav), so the phone aligns with whichever block is
// in view rather than offsetting against absolute viewport center.
const NAV_H = 72;
// Nebo's CSS uses width: calc(100dvh * 0.5625), i.e. it expects a 9:16
// inner viewport. We keep the design's intended outer width (291) and
// derive the height so the inner area matches 9:16 with no letterboxing.
const PHONE_W = 291;
const PHONE_BORDER = 10;
const PHONE_INNER_W = PHONE_W - PHONE_BORDER * 2; // 271
const PHONE_INNER_H = Math.round(PHONE_INNER_W / 0.5625); // 482
const PHONE_H = PHONE_INNER_H + PHONE_BORDER * 2; // 502

// Nebo's UI uses fixed pixel values (margin-top: 100px on the scanner
// header, fixed button paddings, etc.) that assume a real-phone viewport
// height (~640px). At 482px those fixed values dominate and content
// crams against the borders. We render the iframe at this larger
// "design" viewport and CSS-scale it down to the visible phone size.
const NEBO_VIEWPORT_W = 360;
const NEBO_VIEWPORT_H = 640;

function NeboAvatar({ size = 119 }) {
  // Wrapper is sized off the avatar so larger sizes don't overflow the slot.
  const wrapW = size * (136 / 119);
  const wrapH = size * (141 / 119);
  return (
    <div
      style={{
        width: wrapW,
        height: wrapH,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <img
        src={NEBO_AVATAR}
        alt="Nebo"
        style={{
          width: size,
          height: size * (124.579 / 118.724),
          transform: "rotate(8.59deg)",
          objectFit: "contain",
          pointerEvents: "none",
        }}
        draggable={false}
      />
    </div>
  );
}

function ThothAvatar({ size = 100 }) {
  // Match Nebo's wrapper ratio so Nebo and Thoth sit visually adjacent in
  // step layouts instead of separated by Thoth's extra slot padding.
  const wrapW = size * (136 / 119);
  return (
    <div
      style={{
        width: wrapW,
        paddingTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          background: COLORS.black,
          border: `${size * 0.06}px solid ${COLORS.thothy}`,
          borderRadius: "50%",
          width: size,
          height: size,
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            position: "absolute",
            left: size * 0.169,
            top: size * 0.223,
            margin: 0,
            fontFamily: "'Space Mono', monospace",
            fontSize: size * 0.294,
            color: COLORS.thothy,
            whiteSpace: "nowrap",
          }}
        >
          ^o^
        </p>
      </div>
    </div>
  );
}

function StepContent({ step, isMobile }) {
  if (step.isCharacterSplit) return <CharacterSplit isMobile={isMobile} />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 14 : 20,
        color: COLORS.white,
      }}
    >
      {step.avatars && step.avatars.length > 0 && (
        <div style={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          {step.avatars.includes("nebo") && <NeboAvatar size={isMobile ? 80 : 119} />}
          {step.avatars.includes("thoth") && <ThothAvatar size={isMobile ? 70 : 100} />}
        </div>
      )}
      <h2
        style={{
          margin: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 400,
          fontSize: isMobile ? 24 : 32,
          lineHeight: 1.142,
          color: COLORS.mint,
          maxWidth: 500,
        }}
      >
        {step.headline}
      </h2>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: isMobile ? 16 : 22,
          lineHeight: 1.4,
          color: COLORS.white,
          fontVariationSettings: "'opsz' 14",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 12 : 16,
          maxWidth: 540,
        }}
      >
        {step.body}
      </div>
    </div>
  );
}

function CharacterSplit({ isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 18 : 22, color: COLORS.white }}>
      <h2
        style={{
          margin: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 400,
          fontSize: isMobile ? 24 : 32,
          lineHeight: 1.142,
          color: COLORS.mint,
        }}
      >
        Creating Characters
      </h2>

      <div
        style={{
          display: "flex",
          gap: isMobile ? 16 : 29,
          alignItems: isMobile ? "center" : "flex-start",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <NeboAvatar size={isMobile ? 90 : 119} />
          <p style={{ margin: 0, fontFamily: "'Fredoka One', sans-serif", fontSize: isMobile ? 24 : 32, color: COLORS.mint }}>
            Nebo
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            color: COLORS.white,
            fontSize: isMobile ? 16 : 20,
            width: isMobile ? "100%" : 402,
          }}
        >
          <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, lineHeight: 1.2, fontVariationSettings: "'opsz' 14" }}>
            <strong>Nebo</strong> brings the emotion and expression but in a
            chirpy alien language! This <em>reduces parasociality</em> since
            users can&rsquo;t actually understand him.
          </p>
          <p style={{ margin: 0, fontFamily: "'Fredoka One', sans-serif", lineHeight: 1.2 }}>
            We use Fredoka to give his words extra bubbly friendliness and Web
            Audio API to make his alien chirps!
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: isMobile ? 16 : 25,
          alignItems: isMobile ? "center" : "flex-start",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            width: 136,
            flexShrink: 0,
          }}
        >
          <ThothAvatar size={isMobile ? 80 : 100} />
          <p style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, fontSize: isMobile ? 24 : 32, color: COLORS.thothy }}>
            Thoth
          </p>
        </div>
        <div
          style={{
            flex: isMobile ? undefined : "1 1 0",
            width: isMobile ? "100%" : undefined,
            color: COLORS.white,
            fontSize: isMobile ? 16 : 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, lineHeight: 1.2, fontVariationSettings: "'opsz' 14" }}>
            <strong>Thoth</strong> delivers the facts and information. Since
            he&rsquo;s literally an OS, there&rsquo;s no need for him to have
            the typical emotiveness of an LLM. However, he does have very cute
            emoticons!
          </p>
          <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 400, lineHeight: 1.2, fontVariationSettings: "'opsz' 14" }}>
            We use Web Speech API to give him the classic computer voice but
            with a kid-friendly tone.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepperDots({ activeIndex, onPick }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
      {STEPS.map((s, i) => (
        <button
          key={s.id}
          type="button"
          aria-label={`Go to step ${i + 1}`}
          onClick={() => onPick(i)}
          style={{
            width: 46,
            height: 7,
            borderRadius: 200,
            background: i === activeIndex ? COLORS.white : COLORS.thothy,
            border: "none",
            padding: 0,
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
        />
      ))}
    </div>
  );
}

export default function NeboCaseStudy() {
  const isMobile = useIsMobile();
  const [activeStep, setActiveStep] = useState(0);
  const prevStepRef = useRef(0);
  const [stepDirection, setStepDirection] = useState(1);

  const [activeBolt, setActiveBolt] = useState(BOLTS[0].id);
  const [demoMode, setDemoMode] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  const stepperSectionRef = useRef(null);
  const normalSlotRef = useRef(null);
  const overlaySlotRef = useRef(null);
  const phoneStickyRef = useRef(null);

  // Track previous step to determine slide direction
  useEffect(() => {
    setStepDirection(activeStep >= prevStepRef.current ? 1 : -1);
    prevStepRef.current = activeStep;
  }, [activeStep]);

  // Mark portal targets ready
  useLayoutEffect(() => {
    setPortalReady(true);
  }, []);

  const goToStep = (i) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, i));
    setActiveStep(next);
  };

  // Arrow keys advance steps when stepper section is on screen
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (demoMode) return;

      const sec = stepperSectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const inSection =
        rect.top < window.innerHeight * 0.5 &&
        rect.bottom > window.innerHeight * 0.5;
      if (!inSection) return;

      if (e.code === "ArrowDown" || e.code === "ArrowRight") {
        e.preventDefault();
        goToStep(activeStep + 1);
      } else if (e.code === "ArrowUp" || e.code === "ArrowLeft") {
        e.preventDefault();
        goToStep(activeStep - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeStep, demoMode]);

  // Lock body scroll while demo is open
  useEffect(() => {
    document.body.style.overflow = demoMode ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [demoMode]);

  // Esc closes demo
  useEffect(() => {
    if (!demoMode) return;
    const onKey = (e) => {
      if (e.code === "Escape") setDemoMode(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [demoMode]);

  // Phone sticky-top is interpolated based on scroll: starts a touch below
  // hero-center and lands at the stepper text-top as the stepper comes into
  // view (so the phone's top edge aligns with the stepper headline top).
  // We write to the ref directly to avoid a re-render every scroll frame.
  useEffect(() => {
    if (isMobile) return;
    const STEPPER_PAD_TOP = 40; // matches StepperSection desktop padding-top
    const update = () => {
      const el = phoneStickyRef.current;
      if (!el) return;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const heroScroll = vh - NAV_H; // hero is min-height vh - NAV_H
      const sectionCenterTop = vh / 2 - PHONE_H / 2 + NAV_H / 2;
      const startTop = sectionCenterTop + 15;
      // At scrollY = heroScroll, the stepper section top sits at viewport-y
      // = NAV_H, so its text-top is at NAV_H + STEPPER_PAD_TOP. Pinning the
      // phone there aligns its top edge with the stepper headline top.
      const endTop = NAV_H + STEPPER_PAD_TOP;
      let t;
      if (scrollY <= 0) t = 0;
      else if (scrollY >= heroScroll) t = 1;
      else t = scrollY / heroScroll;
      const top = startTop + (endTop - startTop) * t;
      el.style.top = `${top}px`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isMobile]);

  // Once the iframe captures focus (user clicks into Nebo's input), key
  // events go into Nebo and never reach the parent — so the arrow-key
  // stepper navigation stops working. Auto-blur the iframe on mouseleave
  // so arrows work as soon as the user moves their cursor off the proto.
  useEffect(() => {
    const onPointerOut = (e) => {
      // pointerout (with pointerleave-like semantics) fires when the mouse
      // moves from the iframe to outside; relatedTarget is the new element.
      if (e.target?.tagName !== "IFRAME") return;
      if (document.activeElement?.tagName !== "IFRAME") return;
      document.activeElement.blur();
    };
    document.addEventListener("pointerout", onPointerOut);
    return () => document.removeEventListener("pointerout", onPointerOut);
  }, []);

  // Even with the slot's layout footprint collapsed via negative margins,
  // hitting Enter inside Nebo's chat input still triggers a parent-page
  // scroll jump — likely because Nebo internally calls scrollIntoView on
  // the input (or its chat-log) after submit, and the browser propagates
  // that up to the parent for cross-origin iframe focus management.
  // Mark scrolls that follow a real user gesture on the parent (wheel,
  // touch, key, mouse) as "allowed" and snap back any scroll that doesn't.
  useEffect(() => {
    let allowedY = window.scrollY;
    let lastUserAt = 0;
    const grantGrace = () => {
      lastUserAt = Date.now();
      allowedY = window.scrollY;
    };
    grantGrace();
    setTimeout(grantGrace, 50);

    const markUser = () => {
      lastUserAt = Date.now();
      allowedY = window.scrollY;
    };

    const onScroll = () => {
      const sinceUser = Date.now() - lastUserAt;
      if (sinceUser < 250) {
        allowedY = window.scrollY;
        return;
      }
      if (window.scrollY !== allowedY) {
        window.scrollTo({ top: allowedY });
      }
    };

    window.addEventListener("wheel", markUser, { passive: true });
    window.addEventListener("touchstart", markUser, { passive: true });
    window.addEventListener("touchmove", markUser, { passive: true });
    window.addEventListener("keydown", markUser, { passive: true });
    window.addEventListener("mousedown", markUser, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", markUser);
      window.removeEventListener("touchstart", markUser);
      window.removeEventListener("touchmove", markUser);
      window.removeEventListener("keydown", markUser);
      window.removeEventListener("mousedown", markUser);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const activeBoltContent = BOLTS.find((b) => b.id === activeBolt);

  const demoButton = (
    <button
      type="button"
      onClick={() => setDemoMode(true)}
      style={{
        background: "transparent",
        border: `3px solid ${isMobile ? COLORS.neptune : COLORS.limon}`,
        color: isMobile ? COLORS.neptune : COLORS.limon,
        borderRadius: 285,
        padding: "14px 28px",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 17,
        letterSpacing: "0.04em",
        cursor: "pointer",
        whiteSpace: "nowrap",
        zIndex: 5,
        ...(isMobile
          ? { alignSelf: "flex-start" }
          : {
              position: "absolute",
              top: `calc(50vh - ${PHONE_H / 2 - NAV_H / 2 - 15}px)`,
              left: 80,
            }),
      }}
    >
      DEMO MODE
    </button>
  );

  return (
    <>
      <div
        style={{
          width: "100%",
          background: COLORS.purps,
          // `clip` (not `hidden`) — `hidden` creates an implicit scroll
          // container which breaks position: sticky against the window.
          overflowX: "clip",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: DESIGN_W,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <Nav isMobile={isMobile} />

          {isMobile ? (
            <>
              <div
                style={{
                  padding: "32px 24px 36px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Hero isMobile />
              </div>
              <div
                style={{
                  background: COLORS.limon,
                  padding: "28px 24px 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 20,
                }}
              >
                {demoButton}
                <PhoneFrame slotRef={normalSlotRef} isMobile />
              </div>
              <div
                style={{
                  padding: "36px 24px 48px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <StepperSection
                  sectionRef={stepperSectionRef}
                  activeStep={activeStep}
                  stepDirection={stepDirection}
                  onPick={goToStep}
                  isMobile
                />
              </div>
            </>
          ) : (
            <>
              {/* Combined hero + stepper region. Phone sticks throughout. */}
              <div
                style={{
                  display: "flex",
                  gap: 90,
                  padding: "0 120px",
                  position: "relative",
                  alignItems: "flex-start",
                }}
              >
                {/* Sticky phone column — sticky directly on the flex item.
                    With alignItems: flex-start the column doesn't stretch, so
                    sticky has a proper scroll range within the parent's height. */}
                <div
                  ref={phoneStickyRef}
                  style={{
                    width: PHONE_W,
                    flexShrink: 0,
                    marginLeft: 176, // aligns phone left edge to design x=296 (120 padding + 176)
                    position: "sticky",
                    top: `calc(50vh - 150px)`,
                    alignSelf: "flex-start",
                  }}
                >
                  <PhoneFrame slotRef={normalSlotRef} />
                </div>

                {/* Right column: hero, then stepper section */}
                <div style={{ flex: "1 1 0", minWidth: 0 }}>
                  <Hero />
                  <StepperSection
                    sectionRef={stepperSectionRef}
                    activeStep={activeStep}
                    stepDirection={stepDirection}
                    onPick={goToStep}
                  />
                </div>
              </div>

              {demoButton}
            </>
          )}

          <NutsAndBolts
            bolts={BOLTS}
            activeBolt={activeBolt}
            onPick={setActiveBolt}
            content={activeBoltContent}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* Demo overlay container — always mounted so portal target exists */}
      <DemoOverlay
        visible={demoMode}
        onClose={() => setDemoMode(false)}
        slotRef={overlaySlotRef}
        isMobile={isMobile}
      />

      {/* Single iframe, portaled to active slot.
          overscroll-behavior: contain stops Nebo's chat-log from
          scroll-chaining to the parent page when it auto-scrolls to
          the latest message. */}
      {portalReady &&
        (demoMode ? overlaySlotRef.current : normalSlotRef.current) &&
        createPortal(
          <iframe
            title="Nebo demo"
            src={NEBO_IFRAME_SRC}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
              background: COLORS.black,
              overscrollBehavior: "contain",
            }}
            allow="microphone; speaker-selection; autoplay"
          />,
          demoMode ? overlaySlotRef.current : normalSlotRef.current
        )}
    </>
  );
}

function Nav({ isMobile }) {
  return (
    <nav
      style={{
        background: COLORS.limon,
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
          color: COLORS.neptune,
          fontVariationSettings: "'opsz' 14",
          textDecoration: "none",
        }}
      >
        Mars Nevada
      </a>
      <p
        style={{
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          fontSize: isMobile ? 13 : 22,
          lineHeight: 1.142,
          color: COLORS.black,
          whiteSpace: "nowrap",
          fontVariationSettings: "'opsz' 14",
        }}
      >
        {isMobile ? "About" : "Sr. Art Director \\ Product Designer \\ About"}
      </p>
    </nav>
  );
}

function PhoneFrame({ slotRef, isMobile }) {
  // Scale the larger Nebo design viewport down into the visible inner area
  const scale = PHONE_INNER_W / NEBO_VIEWPORT_W;
  return (
    <div
      style={{
        border: `${PHONE_BORDER}px solid ${isMobile ? COLORS.neptune : COLORS.limon}`,
        borderRadius: 20,
        height: PHONE_H,
        width: PHONE_W,
        boxSizing: "border-box",
        background: COLORS.black,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        ref={slotRef}
        style={{
          width: NEBO_VIEWPORT_W,
          height: NEBO_VIEWPORT_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          // Collapse layout footprint to match visual size after scale —
          // transform: scale() leaves the layout box at 360x640, which
          // makes the browser treat the iframe as larger than the visible
          // phone area. Negative margins shrink the footprint so layout
          // matches what the user sees.
          marginRight: -(NEBO_VIEWPORT_W - PHONE_INNER_W),
          marginBottom: -(NEBO_VIEWPORT_H - PHONE_INNER_H),
        }}
      />
    </div>
  );
}

function Hero({ isMobile }) {
  return (
    <div
      style={{
        minHeight: isMobile ? undefined : `calc(100vh - ${NAV_H}px)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: isMobile ? 16 : 28,
        padding: isMobile ? "8px 0 0" : "40px 0",
      }}
    >
      <img
        src={NEBO_LOGO}
        alt="Nebo!"
        style={{
          width: isMobile ? "min(80%, 320px)" : 480,
          height: "auto",
          display: "block",
          transform: "rotate(-0.4deg)",
          pointerEvents: "none",
        }}
        draggable={false}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 12 : 16,
          maxWidth: 600,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? 14 : 20,
            lineHeight: 0.984,
            color: COLORS.thothy,
            textTransform: "uppercase",
          }}
        >
          An educational character-driven chatbot for kids
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? 30 : 52,
            lineHeight: 1.142,
            color: COLORS.mint,
          }}
        >
          Learn about astronomy with Nebo and Thoth!
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? 17 : 28,
            lineHeight: 1.35,
            color: COLORS.white,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          Find out what stars and constellations are above you and help Nebo and
          Thoth get home!
        </p>
      </div>
    </div>
  );
}

function StepperSection({ sectionRef, activeStep, stepDirection, onPick, isMobile }) {
  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: isMobile ? 24 : 36,
        padding: isMobile ? "16px 0" : "40px 0",
      }}
    >
      {/* Grid stack: every step occupies the same cell, so the container
          auto-sizes to the tallest step and all steps render at matching
          heights — no fixed minHeight needed. */}
      <div
        style={{
          display: "grid",
          gridTemplateAreas: '"stack"',
          overflow: "visible",
        }}
      >
        {STEPS.map((step, i) => {
          const isActive = i === activeStep;
          const offset =
            i === activeStep ? 0 : (i - activeStep) * 60 * stepDirection;
          return (
            <div
              key={step.id}
              aria-hidden={!isActive}
              style={{
                gridArea: "stack",
                opacity: isActive ? 1 : 0,
                transform: isActive
                  ? "translateX(0)"
                  : `translateX(${offset}px)`,
                transition:
                  "opacity 0.45s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)",
                pointerEvents: isActive ? "auto" : "none",
                willChange: "opacity, transform",
                display: "flex",
                alignItems: "center",
              }}
            >
              <StepContent step={step} isMobile={isMobile} />
            </div>
          );
        })}
      </div>

      <StepperDots activeIndex={activeStep} onPick={onPick} />
    </section>
  );
}

function NutsAndBolts({ bolts, activeBolt, onPick, content, isMobile }) {
  const contentRef = useRef(null);
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(836);
  const [scroll, setScroll] = useState({
    overflows: false,
    thumbHeight: 0,
    thumbTop: 0,
  });
  const [navOpen, setNavOpen] = useState(false);

  // Match the inner content's max height to the side nav's height so the
  // two columns align and the section feels self-contained.
  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      setNavHeight(el.offsetHeight);
    });
    observer.observe(el);
    setNavHeight(el.offsetHeight);
    return () => observer.disconnect();
  }, []);

  // Track scroll within the bolt content so the custom scroll thumb
  // reflects the user's position. Recompute on bolt change & resize.
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const update = () => {
      const visible = el.clientHeight;
      const total = el.scrollHeight;
      if (total <= visible + 2) {
        setScroll({ overflows: false, thumbHeight: 0, thumbTop: 0 });
        return;
      }
      const thumbHeight = Math.max(48, (visible / total) * visible);
      const maxScroll = total - visible;
      const thumbTop = maxScroll > 0
        ? (el.scrollTop / maxScroll) * (visible - thumbHeight)
        : 0;
      setScroll({ overflows: true, thumbHeight, thumbTop });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(update)
      : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, [content?.id, navHeight]);

  // Reset content scroll when the user picks a new bolt
  useLayoutEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [content?.id]);

  // Close the accordion whenever the active bolt changes (e.g. via picking
  // an item from the open dropdown).
  useEffect(() => {
    setNavOpen(false);
  }, [content?.id]);

  const titleNode = (
    <h3
      key={`${content?.id}-title`}
      style={{
        margin: 0,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700,
        fontSize: isMobile ? 28 : 40,
        lineHeight: 1.142,
        color: COLORS.neptune,
        fontVariationSettings: "'opsz' 14",
        animation: "neboFadeIn 0.35s ease",
      }}
    >
      {content?.title || content?.label}
    </h3>
  );
  const bodyNode = (
    <div
      key={`${content?.id}-body`}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 400,
        fontSize: isMobile ? 16 : 22,
        lineHeight: 1.5,
        color: COLORS.black,
        fontVariationSettings: "'opsz' 14",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 14 : 18,
        animation: "neboFadeIn 0.4s ease",
      }}
    >
      {content?.body || (
        <p style={{ margin: 0, fontStyle: "italic", opacity: 0.6 }}>
          Content coming soon.
        </p>
      )}
    </div>
  );

  return (
    <section
      style={{
        // Buffer above the yellow so the released sticky phone doesn't
        // sit flush against the section. This gap is OUTSIDE the sticky
        // phone's containing block, so the phone bottom aligns with the
        // stepper's bottom and then the gap separates it from yellow.
        marginTop: isMobile ? 40 : 100,
        background: COLORS.limon,
        padding: isMobile ? "24px 24px 56px" : "40px 120px 90px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 28 : 40,
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isMobile ? 10 : 14,
          textAlign: "center",
          paddingBottom: isMobile ? 24 : 40,
          borderBottom: `1px solid ${COLORS.purpsStripe}`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? 17 : 28,
            lineHeight: 1.3,
            color: COLORS.purpsStripe,
            maxWidth: 752,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          {isMobile
            ? "Tap to explore the design decisions and technical elements behind the app."
            : "Click to explore the design decisions and technical elements behind the app and how it works."}
        </p>
      </div>

      {isMobile ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            width: "100%",
          }}
        >
          <div style={{ position: "relative", width: "100%" }}>
            <button
              type="button"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
              style={{
                width: "100%",
                background: COLORS.neptune,
                color: COLORS.limon,
                border: "none",
                borderRadius: 12,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              <span>{content?.label || "Pick a section"}</span>
              <span
                aria-hidden
                style={{
                  fontSize: 18,
                  display: "inline-block",
                  transform: navOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                ▾
              </span>
            </button>
            {navOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  background: COLORS.limon,
                  border: `2px solid ${COLORS.neptune}`,
                  borderRadius: 12,
                  zIndex: 6,
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "60vh",
                  overflowY: "auto",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
                }}
              >
                {bolts.map((b, i) => {
                  const isActive = b.id === activeBolt;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        onPick(b.id);
                        setNavOpen(false);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        borderTop:
                          i === 0 ? "none" : `1px solid ${COLORS.purpsStripe}`,
                        textAlign: "left",
                        padding: "12px 16px",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: isActive ? 700 : 400,
                        fontSize: 17,
                        lineHeight: 1.2,
                        color: isActive ? COLORS.neptune : COLORS.purps,
                        cursor: "pointer",
                      }}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div
            key={`${content?.id}-mobile`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {titleNode}
            {bodyNode}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 82,
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {content?.noScroll ? (
            <div
              key={`${content?.id}-static`}
              style={{
                flex: "1 1 0",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {titleNode}
              {bodyNode}
            </div>
          ) : (
            <div
              style={{
                flex: "1 1 0",
                minWidth: 0,
                display: "flex",
                gap: 34,
                alignItems: "stretch",
              }}
            >
              <div
                ref={contentRef}
                key={`${content?.id}-scroll`}
                className="nebo-bolt-content"
                style={{
                  flex: "1 1 0",
                  minWidth: 0,
                  maxHeight: navHeight,
                  overflowY: "auto",
                  paddingRight: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {titleNode}
                {bodyNode}
              </div>

              <div
                aria-hidden
                style={{
                  width: 14,
                  flexShrink: 0,
                  borderRadius: 200,
                  background: scroll.overflows
                    ? "rgba(59, 0, 173, 0.2)"
                    : "transparent",
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
                    background: COLORS.neptune,
                    borderRadius: 200,
                  }}
                />
              </div>
            </div>
          )}

          <nav
            ref={navRef}
            style={{
              width: 314,
              flexShrink: 0,
              borderLeft: `2px solid ${COLORS.neptuneDeep}`,
              paddingLeft: 20,
              display: "flex",
              flexDirection: "column",
              gap: 0,
              alignSelf: "flex-start",
            }}
          >
            {bolts.map((b, i) => {
              const isActive = b.id === activeBolt;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onPick(b.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderTop:
                      i === 0 ? "none" : `2px solid ${COLORS.neptuneDeep}`,
                    textAlign: "left",
                    padding: "14px 0",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: isActive ? 700 : 400,
                    fontSize: 28,
                    lineHeight: 1.142,
                    color: isActive ? COLORS.neptune : COLORS.purps,
                    cursor: "pointer",
                    width: "100%",
                    transition: "color 0.18s ease, font-weight 0.18s ease",
                  }}
                >
                  {b.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      <style>{`
        @keyframes neboFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nebo-bolt-content::-webkit-scrollbar,
        .nebo-code-scroll::-webkit-scrollbar { width: 0; height: 0; }
        .nebo-bolt-content,
        .nebo-code-scroll { scrollbar-width: none; }
      `}</style>
    </section>
  );
}

function DemoOverlay({ visible, onClose, slotRef, isMobile }) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Nebo's CSS uses fixed-pixel offsets sized for a ~640px viewport, so
  // letting the iframe stretch leaves Nebo's content marooned in the middle
  // with black space top/bottom. Match the small phone strategy: render the
  // iframe at its 360x640 design viewport and CSS-scale it up to the box.
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const update = () => {
      if (!boxRef.current) return;
      const h = boxRef.current.offsetHeight;
      if (h > 0) setScale(h / NEBO_VIEWPORT_H);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [visible]);

  const padding = isMobile ? 8 : 12;
  // Fit within both viewport height and width while preserving 9:16. We
  // subtract the yellow-frame padding twice so the visible inner box
  // (where Nebo renders) is what we measure.
  const boxHeight = isMobile
    ? `min(calc(100vh - ${padding * 2 + 32}px), calc((100vw - ${padding * 2 + 24}px) * 16 / 9))`
    : "min(90vh, 880px)";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: COLORS.purps,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.3s ease",
      }}
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={onClose}
        style={{
          position: isMobile ? "fixed" : "absolute",
          top: isMobile ? 12 : 32,
          left: isMobile ? 12 : 32,
          background: isMobile ? COLORS.limon : "transparent",
          border: `3px solid ${isMobile ? COLORS.neptune : COLORS.limon}`,
          color: isMobile ? COLORS.neptune : COLORS.limon,
          borderRadius: 285,
          padding: isMobile ? "8px 18px" : "14px 28px",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: isMobile ? 14 : 17,
          letterSpacing: "0.04em",
          cursor: "pointer",
          zIndex: 1100,
          boxShadow: isMobile ? "0 4px 14px rgba(0,0,0,0.3)" : "none",
        }}
      >
        × CLOSE
      </button>
      <div
        style={{
          padding,
          background: COLORS.limon,
          borderRadius: isMobile ? 32 : 44,
          boxSizing: "content-box",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          display: "inline-block",
        }}
      >
        <div
          ref={boxRef}
          style={{
            aspectRatio: "9 / 16",
            height: boxHeight,
            background: COLORS.black,
            borderRadius: isMobile ? 22 : 30,
            overflow: "hidden",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          <div
            ref={slotRef}
            style={{
              width: NEBO_VIEWPORT_W,
              height: NEBO_VIEWPORT_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
    </div>
  );
}
