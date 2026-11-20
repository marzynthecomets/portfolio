import ResearchArticle from "./ResearchArticle.jsx";
import { RSV } from "./rsvPaperContent.js";

// "When #RSV Goes Viral: Designing TikTok to Fight Infodemics",
// seminar paper for INFO-601-09, December 15, 2025.

// Figure sizes, so each figure reserves its space before it loads.
const FIG_SIZE = {1: [1600, 923], 2: [1600, 916], 3: [1600, 818], 4: [1488, 1062], 5: [1600, 836], 6: [1280, 720], 7: [1600, 836], 8: [1600, 799]};

const [, abstractBlock, ...rest] = RSV.blocks; // [h2 Abstract, p abstract, ...]
const BLOCKS = [
  ...rest.map((b) =>
    b.t === "fig"
      ? { ...b, w: FIG_SIZE[b.n][0], h: FIG_SIZE[b.n][1] }
      : b.t === "h2" && b.x.startsWith("Proposed Alternatives")
      ? { ...b, tocLabel: "Proposed Alternatives" }
      : b.t === "h3" && b.x.startsWith("The Shift Towards Automated")
        ? { ...b, tocLabel: "The Shift Towards Automated Moderation" }
        : b
  ),
  { t: "h2", x: "Sources" },
  ...RSV.refs.map((x) => ({ t: "ref", x })),
];

export default function RsvInfodemics() {
  return (
    <ResearchArticle
      current="rsv-infodemics"
      date="December 15, 2025"
      title="When #RSV Goes Viral: Designing TikTok to Fight Infodemics"
      lead={{ id: "abstract", eyebrow: "Abstract", paragraphs: [abstractBlock.x] }}
      start={{ id: "abstract", label: "Abstract" }}
      blocks={BLOCKS}
      figBase="/research/rsv"
    />
  );
}
