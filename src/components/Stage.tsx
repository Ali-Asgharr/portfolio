import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { hasWebGL } from "../lib";
import { useInView } from "../hooks";

// Start downloading the 3D chunk immediately so it loads while the loader is on screen.
const sceneImport = import("../three/HeroScene");
const HeroScene = lazy(() => sceneImport);

/**
 * Hero + About share one pinned canvas: the avatar travels from the hero down to the desk scene
 * as you scroll (like a sticky stage), then scrolls away with the About section.
 */
type Props = { children: ReactNode; onSceneReady: () => void; started: boolean };

export default function Stage({ children, onSceneReady, started }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>("0px");
  const [ready, setReady] = useState(false);
  const webgl = hasWebGL();

  useEffect(() => {
    if (!webgl) onSceneReady();
  }, [webgl, onSceneReady]);

  return (
    <div className="stage" ref={ref}>
      <div className="stage__canvas" aria-hidden="true">
        <div className={`stage__sticky${ready ? " is-ready" : ""}`}>
          {webgl ? (
            <Suspense fallback={null}>
              <HeroScene
                // Draw one frame during the loader (compiles shaders, proves it works), then pause
                // until the loader is gone so the loader animation gets the whole main thread.
                active={inView && (started || !ready)}
                onReady={() => {
                  setReady(true);
                  onSceneReady();
                }}
              />
            </Suspense>
          ) : (
            <div className="hero__fallback" />
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
