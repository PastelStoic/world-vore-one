/**
 * Pure axial (flat-top) hex grid math.
 * Coordinates use the "axial" system with implicit cube s = -q-r.
 * All functions are side-effect free and suitable for both rendering and hit-testing.
 *
 * Flat-top layout reference (redblobgames conventions):
 *   - x = size * 3/2 * q
 *   - y = size * √3 * (r + q/2)
 */

export interface AxialCoord {
  q: number;
  r: number;
}

export interface Point {
  x: number;
  y: number;
}

// Visual size (outer radius / distance from center to vertex).
// Tweak this to change the rendered scale of every hex.
export const HEX_SIZE = 36;

// Derived metrics for flat-top hexes.
export const HEX_WIDTH = HEX_SIZE * 2;
export const HEX_HEIGHT = HEX_SIZE * Math.sqrt(3);

// Pre-computed vertex angles for flat-top (starting east, going CCW).
const VERTEX_ANGLES = [0, 60, 120, 180, 240, 300].map((deg) =>
  (deg * Math.PI) / 180
);

/** Add two axial coordinates. */
export function hexAdd(a: AxialCoord, b: AxialCoord): AxialCoord {
  return { q: a.q + b.q, r: a.r + b.r };
}

/** The six neighbor deltas in axial space (flat-top order). */
const NEIGHBOR_DELTAS: AxialCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

/** Return all six neighbors of a hex. */
export function hexNeighbors(hex: AxialCoord): AxialCoord[] {
  return NEIGHBOR_DELTAS.map((d) => hexAdd(hex, d));
}

/** Cube-round a floating cube coordinate back to the nearest axial hex. */
function cubeRound(frac: { q: number; r: number; s: number }): AxialCoord {
  let q = Math.round(frac.q);
  let r = Math.round(frac.r);
  let s = Math.round(frac.s);

  const qDiff = Math.abs(q - frac.q);
  const rDiff = Math.abs(r - frac.r);
  const sDiff = Math.abs(s - frac.s);

  if (qDiff > rDiff && qDiff > sDiff) {
    q = -r - s;
  } else if (rDiff > sDiff) {
    r = -q - s;
  } else {
    s = -q - r;
  }
  return { q, r };
}

/** Convert world (pixel) coordinates to the nearest axial hex. */
export function pixelToHex(x: number, y: number, size = HEX_SIZE): AxialCoord {
  // Inverse of the flat layout matrix.
  const q = ((2 / 3) * x) / size;
  const r = ((-1 / 3) * x + (Math.sqrt(3) / 3) * y) / size;
  const s = -q - r;
  return cubeRound({ q, r, s });
}

/** Convert an axial hex to its center point in world pixels. */
export function hexToPixel(hex: AxialCoord, size = HEX_SIZE): Point {
  const x = size * (3 / 2) * hex.q;
  const y = size * Math.sqrt(3) * (hex.r + hex.q / 2);
  return { x, y };
}

/** Distance in hex steps between two axial coordinates. */
export function hexDistance(a: AxialCoord, b: AxialCoord): number {
  const dq = Math.abs(a.q - b.q);
  const dr = Math.abs(a.r - b.r);
  const ds = Math.abs((-a.q - a.r) - (-b.q - b.r));
  return Math.max(dq, dr, ds);
}

/** Return the six corner points (in world pixels) for a hex polygon. */
export function hexCorners(center: Point, size = HEX_SIZE): Point[] {
  return VERTEX_ANGLES.map((angle) => ({
    x: center.x + size * Math.cos(angle),
    y: center.y + size * Math.sin(angle),
  }));
}

/** Generate a compact rectangular-ish map of hexes (useful for initial view). */
export function generateRectangularGrid(
  qMin: number,
  qMax: number,
  rMin: number,
  rMax: number,
): AxialCoord[] {
  const out: AxialCoord[] = [];
  for (let q = qMin; q <= qMax; q++) {
    for (let r = rMin; r <= rMax; r++) {
      out.push({ q, r });
    }
  }
  return out;
}

/** Return a ring of hexes at exact distance `radius` from center. */
export function hexRing(center: AxialCoord, radius: number): AxialCoord[] {
  if (radius === 0) return [center];
  const results: AxialCoord[] = [];
  // Start at the "west" neighbor of the ring and walk.
  let hex = hexAdd(center, { q: -radius, r: radius });
  for (const delta of NEIGHBOR_DELTAS) {
    for (let i = 0; i < radius; i++) {
      results.push(hex);
      hex = hexAdd(hex, delta);
    }
  }
  return results;
}

/** All hexes whose distance from center <= radius (inclusive). */
export function hexesInRange(center: AxialCoord, radius: number): AxialCoord[] {
  const results: AxialCoord[] = [];
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      results.push({ q: center.q + q, r: center.r + r });
    }
  }
  return results;
}

/** Convenience: is this the exact same hex? */
export function isSameHex(a: AxialCoord, b: AxialCoord): boolean {
  return a.q === b.q && a.r === b.r;
}

/** Stable string key for a hex coord. */
export function coordKey(c: AxialCoord): string {
  return `${c.q}:${c.r}`;
}

/** Parse a stable key back into an axial coordinate (inverse of coordKey). */
export function parseCoordKey(key: string): AxialCoord {
  const [q, r] = key.split(":").map(Number);
  return { q: q || 0, r: r || 0 };
}
