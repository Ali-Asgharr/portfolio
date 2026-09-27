import { clients } from "../data/content";

export default function Marquee() {
  const list = [...clients, ...clients]; // duplicated for a seamless CSS loop
  return (
    <div className="marquee">
      <div className="wrap marquee__inner">
        <span className="mono dim">Clients</span>
        <div className="marquee__track">
          <div className="marquee__list">
            {list.map((c, i) => (
              <span key={i} aria-hidden={i >= clients.length}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
