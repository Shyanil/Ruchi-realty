import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ROUTE_MAP = {
  "About.html": "/about",
  "Careers.html": "/careers",
  "Blog.html": "/blog",
  "Awards.html": "/awards",
  "Projects.html": "/projects",
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

  const phone = settings?.phone || "+91 892 922 5275";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  const cols = [
  ["Residences", [["One Victoria", "#projects"], ["One Prime", "#projects"], ["Active Acres", "#projects"], ["All projects", "Projects.html"]]],
  ["The Firm", [["Approach", "About.html"], ["People", "About.html#team"], ["Careers", "Careers.html"], ["Awards", "Awards.html"], ["Insights", "Blog.html"]]],
  ["Visit", [["Experience Centre", "#contact"], ["Private Viewings", "#contact"], ["Enquiries", "#contact"], ["RERA", "#contact"]]]];

  const offices = [
  ["Kolkata", "54, 10 D. C. Dey Road · Near ITC Sonar,\nTangra · Kolkata 700015."],
  ["Indore", "PU4, Scheme No. 54 · Vijay Nagar,\nIndore 452010."],
  ["Bhopal", "Zone II, Maharana Pratap Nagar,\nBhopal 462011."]];

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
          <span className="we" style={{ fontSize: "100px" }}>We are</span><br />
          <span className="cm" style={{ fontSize: "100px" }}>committed to you.</span>
        </h2>
        <div className="footer__rule"></div>
        <div className="footer-cols">
          <div className="footer__brandcol">
            <img src="assets/logo-h-white.png" alt="Ruchi Realty" className="footer__logo" />
            <p className="footer__tagline">Creators of considered environments across eastern and central India.</p>
            <div className="footer__contact footer__links2">
              <a href={phoneHref}>{phone}</a>
              <a href="https://ruchirealty.com" target="_blank" rel="noopener noreferrer">{settings?.siteName || "ruchirealty.com"}</a>
            </div>
          </div>
          {cols.map(([h, items]) =>
          <div className="footer__col" key={h}>
              <h6>{h}</h6>
              <ul>{items.map(([it, href]) =>
                <li key={it}>{renderLink(it, href)}</li>
              )}</ul>
            </div>
          )}
        </div>
        <div className="footer__offices">
          {offices.map(([cityName, lines]) => {
            const rows = lines.split("\n");
            return (
              <div className="foffice" key={cityName}>
                <div className="foffice__city">{cityName}</div>
                <address className="footer__addr">
                  {rows.map((ln, i) => <React.Fragment key={i}>{ln}{i < rows.length - 1 ? <br /> : null}</React.Fragment>)}
                </address>
              </div>
            );
          })}
        </div>
        <div className="footer__bottom">
          <span>© 1987–2026 · Ruchi Realty Holdings Ltd.</span>
          <span className="footer__rera">RERA/WB/2025/001247</span>
          <span className="footer__legal">
            <a href="#">Privacy</a><a href="#">Disclosures</a><a href="#">Credits</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
