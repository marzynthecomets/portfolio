import { C, F, DM_SANS_OPSZ, useIsMobile } from "./tnsShared.jsx";
import SiteNav from "./SiteNav.jsx";
import { INTAKE } from "./intakeFormsContent.js";

// Research write-up: "Queering Intake Form Design (and Other Onboarding
// Processes)", originally a 2021 blog post, set in the new site styles.

const READ_W = 760;

const body = (isMobile) => ({
  margin: 0,
  fontFamily: F.sans,
  fontWeight: 400,
  fontSize: isMobile ? 16 : 18,
  lineHeight: isMobile ? "26px" : "30px",
  color: C.navy,
  ...DM_SANS_OPSZ,
});
const eyebrow = (color = C.navy) => ({
  margin: 0,
  fontFamily: F.mono,
  fontWeight: 400,
  fontSize: 18,
  lineHeight: 0.984,
  textTransform: "uppercase",
  color,
});
const h2 = (isMobile) => ({
  margin: 0,
  fontFamily: F.mono,
  fontWeight: 400,
  fontSize: isMobile ? 20 : 24,
  lineHeight: isMobile ? "26px" : "30px",
  letterSpacing: isMobile ? "0.4px" : "0.48px",
  color: C.navy,
});
const h3 = (isMobile) => ({
  margin: 0,
  fontFamily: F.sans,
  fontWeight: 700,
  fontSize: isMobile ? 18 : 20,
  lineHeight: isMobile ? "24px" : "28px",
  color: C.navy,
  ...DM_SANS_OPSZ,
});

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Make URLs and DOIs in references clickable.
function Linkified({ text }) {
  const parts = text.split(/(https?:\/\/\S+|doi: ?10\.\S+)/g);
  return parts.map((p, i) => {
    if (/^https?:\/\//.test(p)) {
      return <a key={i} href={p} target="_blank" rel="noreferrer" style={{ color: C.navy, wordBreak: "break-all" }}>{p}</a>;
    }
    const doi = p.match(/^doi: ?(10\.\S+)/);
    if (doi) {
      return (
        <span key={i}>
          doi:{" "}
          <a href={`https://doi.org/${doi[1]}`} target="_blank" rel="noreferrer" style={{ color: C.navy, wordBreak: "break-all" }}>{doi[1]}</a>
        </span>
      );
    }
    return p;
  });
}

const TABLE_NOTES = {
  "Table 1": "Interview questions for providers",
  "Table 2": "Interview questions for nonbinary patients",
};

function QuestionTable({ k, rows, isMobile }) {
  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      <figcaption style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
        <span style={eyebrow()}>{k}</span>
        <span style={{ ...body(isMobile), fontSize: isMobile ? 14 : 16, opacity: 0.8 }}>{TABLE_NOTES[k]}</span>
      </figcaption>
      <table style={{ width: "100%", borderCollapse: "collapse", borderTop: `1px solid ${C.navy}` }}>
        <tbody>
          {rows.map(([q, text]) => (
            <tr key={q} style={{ borderBottom: `1px solid rgba(16,9,76,0.2)` }}>
              <th
                scope="row"
                style={{
                  ...eyebrow(),
                  fontSize: isMobile ? 14 : 16,
                  lineHeight: isMobile ? "26px" : "30px",
                  textAlign: "left",
                  verticalAlign: "top",
                  padding: isMobile ? "10px 12px 10px 0" : "12px 20px 12px 0",
                  width: isMobile ? 36 : 48,
                  whiteSpace: "nowrap",
                }}
              >
                {q}
              </th>
              <td style={{ ...body(isMobile), padding: isMobile ? "10px 0" : "12px 0" }}>{text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function Block({ b, isMobile }) {
  switch (b.t) {
    case "h2":
      return (
        <h2 id={slug(b.x)} style={{ ...h2(isMobile), marginTop: isMobile ? 24 : 40, paddingTop: 20, borderTop: `1px solid ${C.navy}` }}>
          {b.x}
        </h2>
      );
    case "h3":
      return <h3 id={slug(b.x)} style={{ ...h3(isMobile), marginTop: 12 }}>{b.x}</h3>;
    case "rq":
      return (
        <div style={{ background: C.lime100, padding: isMobile ? "16px 18px" : "20px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={eyebrow()}>{b.k}</span>
          <p style={{ ...body(isMobile), fontWeight: 500 }}>{b.x}</p>
        </div>
      );
    case "table":
      return <QuestionTable k={b.k} rows={b.rows} isMobile={isMobile} />;
    case "ref":
      return (
        <p style={{ ...body(isMobile), fontSize: isMobile ? 14 : 16, lineHeight: isMobile ? "22px" : "26px", paddingLeft: 24, textIndent: -24 }}>
          <Linkified text={b.x} />
        </p>
      );
    default:
      return <p style={body(isMobile)}>{b.x}</p>;
  }
}

export default function QueeringIntakeForms() {
  const isMobile = useIsMobile();
  const [intro, thanks] = [INTAKE.intro.slice(0, -1), INTAKE.intro[INTAKE.intro.length - 1]];
  const pad = isMobile ? "0 20px" : "0 40px";
  const column = { width: "100%", maxWidth: READ_W, margin: "0 auto", boxSizing: "content-box", padding: pad };
  return (
    <main style={{ background: C.sand50, width: "100%", overflowX: "hidden", minHeight: "100vh" }}>
      <SiteNav isMobile={isMobile} current="queering-intake-forms" />
      <header
        style={{
          background: C.navy,
          padding: isMobile ? "32px 20px" : "48px 120px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p style={eyebrow(C.lime100)}>Research · June 30, 2021</p>
        <h1
          style={{
            margin: 0,
            fontFamily: F.mono,
            fontWeight: 400,
            fontSize: isMobile ? 26 : 36,
            lineHeight: isMobile ? "34px" : "48px",
            letterSpacing: isMobile ? "-0.52px" : "-0.72px",
            color: C.white,
            maxWidth: 900,
          }}
        >
          Queering Intake Form Design (and Other Onboarding Processes)
        </h1>
      </header>

      <figure style={{ margin: 0, padding: isMobile ? "32px 20px 0" : "60px 120px 0", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        <img
          src="/research/intake-exam-room.webp"
          alt="A genderqueer person in a hospital gown sitting on an exam table, looking toward a window"
          width="2500"
          height="1667"
          style={{ width: "100%", maxWidth: 1042, height: "auto", display: "block" }}
        />
        <figcaption style={{ ...body(isMobile), fontSize: 14, lineHeight: "20px", maxWidth: 1042, width: "100%", opacity: 0.85 }}>
          A genderqueer person sitting in a hospital gown in an exam room, courtesy of Vice’s{" "}
          <a href="https://genderspectrum.vice.com/" target="_blank" rel="noreferrer" style={{ color: C.navy }}>
            Gender Spectrum Collection
          </a>
          .
        </figcaption>
      </figure>

      <section style={{ ...column, paddingTop: isMobile ? 32 : 60, display: "flex", flexDirection: "column", gap: 20 }}>
        {intro.map((p) => (
          <p key={p.slice(0, 24)} style={{ ...body(isMobile), fontSize: isMobile ? 18 : 22, lineHeight: isMobile ? "28px" : "32px" }}>{p}</p>
        ))}
        <p style={{ ...body(isMobile), fontStyle: "italic" }}>{thanks}</p>
      </section>

      <article
        style={{
          ...column,
          paddingTop: isMobile ? 40 : 72,
          paddingBottom: isMobile ? 64 : 120,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ background: C.sand100, padding: isMobile ? "20px" : "28px 32px", display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={eyebrow()}>Research proposal</p>
          <h2 style={{ ...h2(isMobile), fontWeight: 500 }}>{INTAKE.title}</h2>
        </div>
        {INTAKE.blocks.map((b, i) => <Block key={i} b={b} isMobile={isMobile} />)}
      </article>
    </main>
  );
}
