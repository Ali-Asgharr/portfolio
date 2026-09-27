import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is on screen.
 * - `inView`: true while it intersects (used to pause animations and WebGL off-screen)
 * - `seen`: latches true the first time it does (used for one-off entrance effects)
 */
export function useInView<T extends Element>(rootMargin = "0px") {
  const ref = useRef<T>(null);
  const [state, setState] = useState({ inView: false, seen: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setState((s) => ({ inView: entry.isIntersecting, seen: s.seen || entry.isIntersecting })),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, state.inView, state.seen] as const;
}
