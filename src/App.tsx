import { useCallback, useEffect, useState } from "react";
import Loader from "./components/Loader";
import Nav from "./components/Nav";
import Stage from "./components/Stage";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Services from "./components/Services";
import TechStack from "./components/TechStack";
import Work from "./components/Work";
import Testimonials from "./components/Testimonials";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import { prefersReducedMotion } from "./lib";

/**
 * Scroll reveals for [data-reveal] (fade up) and [data-lines] (masked lines slide up).
 * One IntersectionObserver sets `data-revealed`; the motion itself is CSS (see "reveal" in global.css).
 * A data attribute rather than a class: React rewrites `className` on re-render and would drop it.
 * Content is only hidden once this runs, so nothing disappears if JS or IO is unavailable.
 */
function useScrollReveal(enabled: boolean) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.setAttribute("data-revealed", "");
          io.unobserve(e.target);
        }),
      // huge top margin: anything already scrolled past counts as seen, so a fast flick never leaves items hidden
      { rootMargin: "99999px 0px -12% 0px" }
    );
    document.querySelectorAll("[data-reveal], [data-lines]").forEach((el) => io.observe(el));
    root.classList.add("reveal-on");
    return () => {
      io.disconnect();
      root.classList.remove("reveal-on");
    };
  }, [enabled]);
}

export default function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const onLoaded = useCallback(() => setLoaded(true), []);
  useScrollReveal(loaded);

  return (
    <>
      {!loaded && <Loader ready={sceneReady} onDone={onLoaded} />}
      <Nav />
      <main>
        <Stage onSceneReady={onSceneReady} started={loaded}>
          <Hero started={loaded} />
          <About />
        </Stage>
        <Marquee />
        <Services />
        <TechStack />
        <Work />
        <Testimonials />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
