import { useEffect, useRef, useState } from "react";
import { profile } from "../data/content";
import { BrandMark } from "./ui";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

// One formatter for the lifetime of the page instead of a new one every second.
const clockFormat = new Intl.DateTimeFormat("en-US", { timeZone: profile.timeZone, hour: "numeric", minute: "2-digit", second: "2-digit" });

function Clock() {
  const [time, setTime] = useState(() => clockFormat.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(clockFormat.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="mono nav__clock">{time}</span>;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);

  // Closing by button or Escape hands focus back to the burger; following a link lets the page take it.
  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) burger.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    window.addEventListener("keydown", onKey);
    // keep the page from scrolling behind the open menu (matters on phones)
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menu.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <header className="nav">
        <div className="wrap nav__inner">
          <a href="#home" className="nav__logo" aria-label={`${profile.firstName} ${profile.lastName}, home`}>
            <BrandMark />
          </a>
          <nav className="nav__links" aria-label="Main">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav__right">
            <Clock />
            <button ref={burger} className="nav__burger" aria-label="Open menu" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* `inert` takes the closed menu out of tab order and the accessibility tree in one go */}
      <div id="site-menu" ref={menu} className={`menu${open ? " is-open" : ""}`} inert={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <div className="wrap menu__head">
          <span className="nav__logo">
            <BrandMark />
          </span>
          <button className="mono" onClick={() => close(true)}>
            Close ✕
          </button>
        </div>
        <div className="wrap menu__body">
          <ul className="menu__links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => close(false)}>
                  {l.label}
                  <span aria-hidden="true">+</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="menu__aside">
            <div>
              <p className="mono dim">Email</p>
              {profile.emails.map((e) => (
                <a key={e.address} className="menu__email" href={`mailto:${e.address}`}>
                  {e.address}
                </a>
              ))}
            </div>
            <div>
              <p className="mono dim">Socials</p>
              <div className="menu__socials">
                {profile.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <p className="mono dim">{profile.location}</p>
          </div>
        </div>
      </div>
    </>
  );
}
