import type { CSSProperties } from "react";
import "../styles/Sky.css";

interface CloudSpec {
  x: number; // left position, % of the page width
  y: number; // preferred top position, % of one screen height
  s: number; // size multiplier for the layer's base cloud width
  v: 1 | 2 | 3; // shape variant (where the two round bumps sit)
}

interface LayerSpec {
  id: "far" | "mid" | "near";
  clouds: CloudSpec[];
}

// Far = small, slow, sharp. Near = big, faster, soft. Positions are hand-placed
// so the clouds spread evenly and never line up in rows.
const LAYERS: LayerSpec[] = [
  {
    id: "far",
    clouds: [
      { x: 4, y: 6, s: 0.9, v: 1 },
      { x: 38, y: 14, s: 1.1, v: 2 },
      { x: 72, y: 4, s: 0.8, v: 3 },
      { x: 18, y: 38, s: 1, v: 3 },
      { x: 58, y: 44, s: 0.85, v: 1 },
      { x: 86, y: 58, s: 1.05, v: 2 },
      { x: 30, y: 72, s: 0.9, v: 2 },
    ],
  },
  {
    id: "mid",
    clouds: [
      { x: 10, y: 10, s: 1, v: 2 },
      { x: 62, y: 24, s: 1.15, v: 1 },
      { x: -4, y: 48, s: 1.1, v: 3 },
      { x: 48, y: 62, s: 0.9, v: 2 },
      { x: 80, y: 80, s: 1, v: 1 },
    ],
  },
  {
    id: "near",
    clouds: [
      { x: 6, y: 18, s: 1.1, v: 1 },
      { x: 64, y: 52, s: 1.2, v: 3 },
      { x: 28, y: 80, s: 0.9, v: 2 },
    ],
  },
];

/**
 * Decorative sky that drifts downward, so the page feels like it is rising.
 * Render it once, as the first child of an element with the `lessons-page`
 * class. It is fixed, behind all content, and ignores pointer events.
 */
function SkyBackground() {
  return (
    <div className="sky" aria-hidden="true">
      {LAYERS.map((layer) => (
        <div className={`sky-layer sky-${layer.id}`} key={layer.id}>
          {/* Two identical halves: the layer slides by exactly one half, so the loop has no seam. */}
          {[0, 1].map((half) => (
            <div className="sky-set" key={half}>
              {layer.clouds.map((c, i) => (
                <span
                  key={i}
                  className={`cloud v${c.v}`}
                  style={
                    {
                      "--x": `${c.x}%`,
                      "--y": `${c.y}%`,
                      "--s": c.s,
                    } as CSSProperties
                  }
                >
                  <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default SkyBackground;