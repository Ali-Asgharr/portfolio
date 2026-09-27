import { lazy, Suspense } from "react";
import { techStack } from "../data/content";
import { iconTitle } from "../data/icons";
import { hasWebGL } from "../lib";
import { useInView } from "../hooks";
import { SectionLabel } from "./ui";

const BallPit = lazy(() => import("../three/BallPit"));

export default function TechStack() {
  // mount the 3D once it's within a screen of view; render only while it's actually visible
  const [nearRef, , near] = useInView<HTMLElement>("100% 0px");
  const [visRef, visible] = useInView<HTMLDivElement>();
  const webgl = hasWebGL();

  return (
    <section className="stack" id="stack" ref={nearRef}>
      <div className="stack__head wrap">
        <SectionLabel id="stack" title="Tech stack" note="Tools I ship with" style={{ marginBottom: 24 }} />
        <h2 className="display stack__title" data-lines>
          <span className="line-mask">
            <span>
              My <em>stack</em>
            </span>
          </span>
        </h2>
      </div>
      <div className="stack__canvas" ref={visRef}>
        {webgl ? (
          near && (
            <Suspense fallback={null}>
              <BallPit slugs={techStack} active={visible} />
            </Suspense>
          )
        ) : (
          <div className="stack__fallback">
            {techStack.map((t) => (
              <span key={t} className="chip">
                {iconTitle(t)}
              </span>
            ))}
          </div>
        )}
      </div>
      {webgl && <p className="mono dim stack__hint">Move your cursor through the stack</p>}
    </section>
  );
}
