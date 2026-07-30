import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ROUTE_MAP = {
  "About.html": "/about",
  "Careers.html": "/careers",
  "Blog.html": "/blogs",
  "Awards.html": "/awards",
  "Projects.html": "/projects",
  "Contact.html": "/contact",
  "Media.html": "/media",
};

function smoothTo(href) {
  const el = document.querySelector(href);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function Footer() {
  const [settings, setSettings] = useState(null);
  useEffect(() => {
    let active = true;
    if (window.RuchiBackend?.settings) {
      window.RuchiBackend.settings.getSettings().then(({ data }) => {
        if (active) setSettings(data);
      });
    }
    return () => { active = false; };
  }, []);

  const phone = "+91 8929225275";
  const email = "emarketing@rrhlrealty.com";

  const firmLinks = [
    ["About Us", "About.html"],
    ["Team", "About.html#team"],
    ["Careers", "Careers.html"],
    ["Gallery & Events", "Media.html"],
    ["Blogs", "Blog.html"],
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/RuchiRealty",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@ruchirealty.comrealestatec8583",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/ruchi_realty",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/ruchi-realty-holdings-limited/",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "https://api.whatsapp.com/send?phone=919630096112",
      icon: (
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.93 7.93 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93a7.9 7.9 0 0 0-2.327-5.607ZM7.998 14.52a6.57 6.57 0 0 1-3.355-.918l-.24-.144-2.494.654.666-2.43-.156-.25a6.56 6.56 0 0 1-1.007-3.505c0-3.642 2.96-6.603 6.59-6.603a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.674c-.004 3.642-2.96 6.592-6.592 6.592Zm3.615-4.934c-.197-.1-1.17-.578-1.353-.645-.18-.066-.312-.1-.445.1-.132.197-.512.644-.627.776-.116.133-.232.15-.43.05-.197-.1-.835-.308-1.59-.982-.588-.525-.985-1.172-1.101-1.37-.116-.198-.013-.305.087-.404.09-.09.197-.232.296-.347.1-.116.133-.198.198-.33.066-.133.033-.248-.017-.347-.05-.1-.445-1.074-.61-1.47-.16-.389-.323-.336-.445-.342l-.378-.007a.72.72 0 0 0-.523.248c-.181.198-.69.677-.69 1.654s.706 1.92.805 2.053c.1.132 1.39 2.124 3.37 2.978.47.202.837.324 1.123.416.472.15.902.129 1.242.078.379-.057 1.17-.48 1.336-.943.165-.462.165-.859.116-.942-.05-.083-.182-.132-.38-.231Z" />
        </svg>
      ),
    },
  ];

  const offices = [
    ["Kolkata Office", "54, 10, D. C. Dey Rd, near ITC Sonar, Tangra,\nKolkata – 700015 (W.B.), India.\nSales – +91 9836418000\nCorporate – 033-66066777"],
    ["Indore Office", "2/1, South Tukoganj, Behind High Court,\nIndore – 452001 (M.P.), India.\nSales – +91 8929225275\nCorporate – 0731-4018010 | 4018015 | 4018120"],
    ["Bhopal Office", "Behind Bhabha College, Jatkhedi Hoshangabad Road,\nBhopal – 462026 (M.P.), India."],
  ];

  function renderLink(it, href) {
    if (href.startsWith("#")) {
      return <a href={href} onClick={(e) => { e.preventDefault(); smoothTo(href); }}>{it}</a>;
    }
    for (const [oldRoute, newRoute] of Object.entries(ROUTE_MAP)) {
      if (href === oldRoute) {
        return <Link to={newRoute}>{it}</Link>;
      }
      if (href.startsWith(oldRoute + "#")) {
        const hash = href.slice(href.indexOf("#"));
        return <Link to={newRoute + hash}>{it}</Link>;
      }
    }
    return <a href={href}>{it}</a>;
  }

  return (
    <footer className="footer">
      <div className="footer__sig" aria-hidden="true"></div>
      <div className="rr-wrap footer__inner">
        <h2 className="footer__statement">
          <span className="we">We are</span><br />
          <span className="cm">committed to you.</span>
        </h2>
        <div className="footer__rule"></div>
        <div className="footer-cols">
          <div className="footer__brandcol">
            <img src="/assets/logo-h-white.webp" alt="Ruchi Realty" className="footer__logo" />
            <p className="footer__tagline">Creators of considered environments across eastern and central India.</p>
          </div>

          <div className="footer__col">
            <h6>Company</h6>
            <ul>
              {firmLinks.map(([it, href]) => (
                <li key={it}>{renderLink(it, href)}</li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h6>Get In Touch</h6>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <span className="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z" /></svg></span>
                <span><span className="footer-contact-label">Call us</span><a href={`tel:${phone}`} className="footer-contact-val">{phone}</a></span>
              </li>
              <li className="footer-contact-item">
                <span className="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="m22 6-10 7L2 6" /></svg></span>
                <span><span className="footer-contact-label">Email us</span><a href={`mailto:${email}`} className="footer-contact-val">{email}</a></span>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h6>Connect</h6>
            <div className="footer-social-grid">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title={s.name}
                  aria-label={s.name}
                >
                  <span className="footer-social-icon">{s.icon}</span>
                  <span className="footer-social-name">{s.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__offices">
          {offices.map(([cityName, lines]) => {
            const rows = lines.split("\n");
            return (
              <div className="foffice" key={cityName}>
                <div className="foffice__city"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/></svg>{cityName}</div>
                <address className="footer__addr">
                  {rows.map((ln, i) => <React.Fragment key={i}>{ln}{i < rows.length - 1 ? <br /> : null}</React.Fragment>)}
                </address>
              </div>
            );
          })}
        </div>

        <div className="footer__bottom">
          <span>© 2026 · Ruchi Realty Holdings Ltd. · Established 2008</span>
          <span className="footer__legal">
            <Link to="/privacy-policy">Privacy</Link><Link to="/disclaimer">Disclaimer</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
