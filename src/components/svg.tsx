import { useEffect, useId, useRef, type SVGProps } from "react";
import { prefersReducedMotion } from "../lib";

/**
 * Shared building blocks for the animated SVG diagrams (service visuals and project screens).
 * Sequenced animations all run on one LOOP so a whole diagram can be paused, or frozen on a
 * "finished" frame for reduced motion, with a single call.
 */

export const LOOP = 6; // seconds

/** useId() made safe for SVG `url(#id)` references (React ids can contain ":" or "«»"). */
export const useSvgId = () => "s" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
export const MONO = { fontFamily: "JetBrains Mono, monospace" } as const;
export const loop = { dur: `${LOOP}s`, repeatCount: "indefinite" } as const;

/** Keyframes that switch something on at `start` (0..1 of the loop) and off again near the end. */
export const seq = (start: number, on: string | number = 1, off: string | number = 0, rise = 0.05) => {
  const s = Math.min(0.85, Math.max(0.001, start));
  return { values: `${off};${off};${on};${on};${off}`, keyTimes: `0;${s.toFixed(3)};${(s + rise).toFixed(3)};0.93;1` };
};

/** Shows one of several labels at a time, cycling through them across the loop. */
export function Cycle({ items, ...p }: { items: string[] } & Omit<SVGProps<SVGTextElement>, "values">) {
  const n = items.length;
  const e = 0.005;
  return (
    <>
      {items.map((v, i) => {
        const a = i / n, b = (i + 1) / n;
        const anim =
          i === 0
            ? { values: "1;1;0;0", keyTimes: `0;${(b - e).toFixed(3)};${b.toFixed(3)};1` }
            : i === n - 1
              ? { values: "0;0;1;1", keyTimes: `0;${a.toFixed(3)};${(a + e).toFixed(3)};1` }
              : { values: "0;0;1;1;0;0", keyTimes: `0;${a.toFixed(3)};${(a + e).toFixed(3)};${(b - e).toFixed(3)};${b.toFixed(3)};1` };
        return (
          <text key={v + i} {...p} opacity={i === n - 1 ? 1 : 0} {...MONO}>
            <animate attributeName="opacity" {...anim} {...loop} />
            {v}
          </text>
        );
      })}
    </>
  );
}

/** A bar that grows in at `start` and holds until the loop resets. */
export function Grow({ x, y, w, h, fill, start, rx = 3 }: { x: number; y: number; w: number; h: number; fill: string; start: number; rx?: number }) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill}>
      <animate attributeName="width" {...seq(start, w, 0, 0.1)} {...loop} />
    </rect>
  );
}

/** A path drawn twice: a dim track, and an accent dash pattern that flows along it. */
export function Wire({ d, color, track, delay = 0 }: { d: string; color: string; track: string; delay?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={track} strokeWidth="2" />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeDasharray="5 11" className="svc-flow" style={delay ? { animationDelay: `${delay}s` } : undefined} />
    </>
  );
}

/**
 * A glowing packet travelling along a path. The glow is a soft halo circle rather than a CSS
 * drop-shadow filter, which would be re-rasterised every frame. `offset` uses a negative begin so
 * packets are already mid-flight on the first frame instead of waiting at the SVG origin.
 */
export function Packet({ d, color, dur = 1.8, offset = 0, r = 3.6 }: { d: string; color: string; dur?: number; offset?: number; r?: number }) {
  return (
    <g>
      <animateMotion dur={`${dur}s`} begin={`${-offset}s`} repeatCount="indefinite" path={d} />
      <circle r={r * 2.2} fill={color} opacity="0.25" />
      <circle r={r} fill={color} />
    </g>
  );
}

/**
 * Runs an SVG's animations only while `playing` (SMIL through the SVG API, CSS through the
 * `is-paused` class). With reduced motion it freezes on a representative, fully drawn frame.
 */
export function useSvgPlayback(playing: boolean) {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = prefersReducedMotion();
  const run = playing && !reduce;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (run) el.unpauseAnimations();
    else {
      if (reduce) el.setCurrentTime(LOOP * 0.8);
      el.pauseAnimations();
    }
  }, [run, reduce]);
  return { ref, pausedClass: run ? "" : "is-paused" };
}
