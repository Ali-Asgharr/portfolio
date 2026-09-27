import { initials, profile } from "../data/content";

const Plus = ({ top }: { top: string }) => (
  <svg className="plus" style={{ top }} viewBox="0 0 11 11" aria-hidden="true">
    <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" />
  </svg>
);

/** The intro (name lines slide up, details fade in) is pure CSS, triggered by `is-started` once the loader lifts. */
export default function Hero({ started }: { started: boolean }) {
  return (
    <section className={`hero${started ? " is-started" : ""}`} id="home">
      <div className="hero__grid" aria-hidden="true">
        <div className="wrap">
          {[0, 1, 2, 3].map((i) => (
            <div className="col" key={i}>
              <Plus top="22%" />
              <Plus top="48%" />
              <Plus top="74%" />
            </div>
          ))}
        </div>
      </div>

      <div className="hero__ghost" aria-hidden="true">
        {profile.lastName}
      </div>

      <div className="wrap hero__content">
        <div className="hero__bottom">
          <h1 className="hero__name">
            <small className="hero__fade">©{new Date().getFullYear()} · {profile.role}</small>
            <span className="line-mask">
              <span>{profile.firstName}</span>
            </span>
            <span className="line-mask">
              <span>{profile.lastName}</span>
            </span>
          </h1>
          <a className="hero__talk hero__fade" href="#contact">
            <span className="hero__talk-avatar">{initials}</span>
            <span>
              <span className="mono dim hero__talk-status">
                {profile.available && <span className="dot dot--live" />} Available for projects
              </span>
              <strong>Let's automate it</strong>
            </span>
            <span className="btn__arrow">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
