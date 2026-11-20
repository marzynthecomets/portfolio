import { useLayoutEffect, useRef } from "react";
import rough from "roughjs";

// Brushed card outline, approach 2: Rough.js draws a hand-drawn-style rounded
// rectangle that fits whatever size its parent ends up. A fixed `seed` keeps
// the wobble identical on every render instead of reshuffling. The parent
// needs position: relative.
function roundedRectPath(w, h, r, inset) {
  const x = inset;
  const y = inset;
  const W = w - inset * 2;
  const H = h - inset * 2;
  return `M${x + r},${y} H${x + W - r} Q${x + W},${y} ${x + W},${y + r} V${y + H - r} Q${x + W},${y + H} ${x + W - r},${y + H} H${x + r} Q${x},${y + H} ${x},${y + H - r} V${y + r} Q${x},${y} ${x + r},${y} Z`;
}

export default function RoughFrame({ stroke, strokeWidth = 3, radius = 20, seed = 1, roughness = 1.2 }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const draw = () => {
      const { width, height } = svg.getBoundingClientRect();
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      if (!width || !height) return;
      const rc = rough.svg(svg);
      svg.appendChild(
        rc.path(roundedRectPath(width, height, radius, strokeWidth / 2 + 1), {
          stroke,
          strokeWidth,
          roughness,
          bowing: 0.8,
          seed,
          disableMultiStroke: false,
        })
      );
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [stroke, strokeWidth, radius, seed, roughness]);
  return (
    <svg
      ref={ref}
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}
    />
  );
}
