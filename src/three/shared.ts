// Mutable per-frame state shared between the DOM and the 3D scene (no React re-renders).

/** Pointer in normalised [-1, 1] coords, tracked on window so HTML on top of the canvas doesn't block it. */
export const pointer = { x: 0, y: 0 };

/** Scroll progress from the hero (0) to the About desk scene (1), eased. */
export const stage = { p: 0 };

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Colour the monitor is currently casting (drives the screen light, glasses tint and glow). */
export const screen = { color: { r: 0.48, g: 0.64, b: 1 } };

/** Where each hand is typing: key position (avatar units) and a 0..1 "just pressed" pulse. Index 0 = left. */
export const typing = [
  { x: -0.34, z: 1.18, dip: 0 },
  { x: 0.34, z: 1.18, dip: 0 },
];
