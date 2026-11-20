import ResearchArticle from "./ResearchArticle.jsx";
import { C } from "./tnsShared.jsx";
import { INTAKE } from "./intakeFormsContent.js";

// "Queering Intake Form Design (and Other Onboarding Processes)",
// originally a 2021 blog post.

const TABLE_NOTES = {
  "Table 1": "Interview questions for providers",
  "Table 2": "Interview questions for nonbinary patients",
};
const BLOCKS = INTAKE.blocks.map((b) => (b.t === "table" ? { ...b, note: TABLE_NOTES[b.k] } : b));

export default function QueeringIntakeForms() {
  return (
    <ResearchArticle
      current="queering-intake-forms"
      eyebrowText="Research · June 30, 2021"
      title="Queering Intake Form Design (and Other Onboarding Processes)"
      hero={{
        src: "/research/intake-exam-room.webp",
        alt: "A genderqueer person in a hospital gown sitting on an exam table, looking toward a window",
        width: 2500,
        height: 1667,
        caption: (
          <>
            A genderqueer person sitting in a hospital gown in an exam room, courtesy of Vice’s{" "}
            <a href="https://genderspectrum.vice.com/" target="_blank" rel="noreferrer" style={{ color: C.navy }}>
              Gender Spectrum Collection
            </a>
            .
          </>
        ),
      }}
      lead={{ paragraphs: INTAKE.intro.slice(0, -1), after: INTAKE.intro[INTAKE.intro.length - 1] }}
      start={{ id: "research-proposal", label: "Introduction", box: { eyebrow: "Research proposal", title: INTAKE.title } }}
      blocks={BLOCKS}
    />
  );
}
