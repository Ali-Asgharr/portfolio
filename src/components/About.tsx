import { about } from "../data/content";
import { useInView } from "../hooks";
import RichText from "./RichText";
import { SectionLabel } from "./ui";

export default function About() {
  // the strike-through draws itself once the headline is on screen
  const [headRef, , headSeen] = useInView<HTMLHeadingElement>("0px 0px -20% 0px");
  return (
    <section className="about" id="about">
      <div className="wrap">
        <SectionLabel id="about" title="About" note="Who I am" />
        <div className="about__col">
          <span className="chip" data-reveal>
            <span className="dot" /> {about.kicker}
          </span>
          <h2 className={`display h-md about__headline${headSeen ? " is-in" : ""}`} ref={headRef} data-reveal>
            <RichText text={about.headline} />
          </h2>
          {about.body.map((para) => (
            <p key={para} className="about__body" data-reveal>
              {para}
            </p>
          ))}
          <p className="mono dim about__steps-label" data-reveal>
            How I work
          </p>
          <ol className="steps">
            {about.steps.map((st, i) => (
              <li key={st.title} className={`step${i === 2 ? " step--accent" : ""}`} data-reveal>
                <span className="mono step__num">0{i + 1}</span>
                <strong className="step__title">{st.title}</strong>
                <span className="step__text">{st.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
