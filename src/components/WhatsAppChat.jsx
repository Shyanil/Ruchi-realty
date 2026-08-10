import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const WHATSAPP_URL = "https://wa.me/919630096112?text=Hello%20Ruchi%20Realty%2C%20I%20would%20like%20to%20know%20more%20about%20your%20projects.";

export default function WhatsAppChat() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const [isPastHomeHero, setIsPastHomeHero] = useState(false);

  useEffect(() => {
    if (!isHomePage) {
      setIsPastHomeHero(false);
      return undefined;
    }

    let frame;
    const updateVisibility = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const hero = document.querySelector(".hero");
        setIsPastHomeHero(hero ? hero.getBoundingClientRect().bottom <= 0 : window.scrollY >= window.innerHeight);
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      window.cancelAnimationFrame(frame);
    };
  }, [isHomePage]);

  if (pathname.toLowerCase().includes("admin")) return null;
  if (isHomePage && !isPastHomeHero) return null;

  return (
    <a
      className="whatsapp-chat"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ruchi Realty on WhatsApp"
    >
      <span className="whatsapp-chat__icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" role="img">
          <path d="M16.02 3.2A12.72 12.72 0 0 0 5.11 22.46L3.3 29l6.7-1.76A12.72 12.72 0 1 0 16.02 3.2Zm0 22.98a10.2 10.2 0 0 1-5.2-1.43l-.37-.22-3.98 1.05 1.06-3.87-.24-.4A10.25 10.25 0 1 1 16.02 26.18Zm5.62-7.68c-.3-.15-1.8-.89-2.08-.99-.28-.1-.48-.15-.68.15-.2.3-.79.99-.97 1.19-.18.2-.36.23-.66.08-.3-.16-1.28-.48-2.44-1.52a9.13 9.13 0 0 1-1.69-2.1c-.18-.3-.02-.46.13-.61.14-.14.3-.36.46-.54.15-.18.2-.3.3-.51.1-.2.05-.38-.03-.54-.08-.15-.68-1.65-.94-2.26-.24-.59-.5-.51-.68-.52h-.58c-.2 0-.54.08-.82.38-.28.3-1.07 1.04-1.07 2.54s1.1 2.95 1.25 3.15c.15.2 2.14 3.27 5.19 4.59.72.31 1.29.5 1.73.64.73.23 1.39.2 1.91.12.58-.09 1.8-.74 2.06-1.45.25-.71.25-1.32.18-1.45-.08-.13-.28-.2-.59-.35Z" />
        </svg>
      </span>
      <span className="whatsapp-chat__label">Chat with us</span>
    </a>
  );
}
