import { useEffect, useLayoutEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogDetailsPage from './pages/BlogDetailsPage'
import CareersPage from './pages/CareersPage'
import ContactPage from './pages/ContactPage'
import MediaPage from './pages/MediaPage'
import MediaGalleryPage from './pages/MediaGalleryPage'
import PressReleasesPage from './pages/PressReleasesPage'
import PressReleaseDetailPage from './pages/PressReleaseDetailPage'
import EventsAwardsPage from './pages/EventsAwardsPage'
import AwardsPage from './pages/AwardsPage'
import AdminPage from './pages/AdminPage'
import GenericProjectPage from './pages/GenericProjectPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import DisclaimerPage from './pages/DisclaimerPage'

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return undefined;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = "auto"; };
  }, []);

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      const frame = window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const targetId = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    const scrollToHash = () => {
      const el = document.getElementById(targetId);
      if (el) {
        const offset = 80;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
        return;
      }
      attempts += 1;
      if (attempts < 20) window.setTimeout(scrollToHash, 50);
    };

    window.setTimeout(scrollToHash, 0);
    return undefined;
  }, [pathname, hash, key]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/oscar-indore" element={<Navigate to="/projects/oscar-indore" replace />} />
      <Route path="/Oscar.html" element={<Navigate to="/projects/oscar-indore" replace />} />
      <Route path="/active-business-park" element={<Navigate to="/projects/active-business-park" replace />} />
      <Route path="/ActiveBusinessPark.html" element={<Navigate to="/projects/active-business-park" replace />} />
      <Route path="/active-acres-angelica" element={<Navigate to="/projects/active-acres-angelica" replace />} />
      <Route path="/ActiveAcresAngelica.html" element={<Navigate to="/projects/active-acres-angelica" replace />} />
      <Route path="/active-greens" element={<Navigate to="/projects/active-greens" replace />} />
      <Route path="/ActiveGreens.html" element={<Navigate to="/projects/active-greens" replace />} />
      <Route path="/one-rajarhat" element={<Navigate to="/projects/one-rajarhat" replace />} />
      <Route path="/one-prime-residential" element={<Navigate to="/projects/one-prime-residential" replace />} />
      <Route path="/projects/one-prime-residential" element={<GenericProjectPage slugOverride="one-prime-residential" />} />
      <Route path="/OneRajarhat.html" element={<Navigate to="/projects/one-rajarhat" replace />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/one-victoria" element={<Navigate to="/projects/one-victoria-new-town" replace />} />
      <Route path="/one-victoria-new-town" element={<Navigate to="/projects/one-victoria-new-town" replace />} />
      <Route path="/lifescapes-bhopal" element={<Navigate to="/projects/lifescapes-bhopal" replace />} />
      <Route path="/ruchi-lifescapes-indore" element={<Navigate to="/projects/ruchi-lifescapes-indore-project" replace />} />
      <Route path="/ruchi-lifescapes-indore-project" element={<Navigate to="/projects/ruchi-lifescapes-indore-project" replace />} />
      <Route path="/anand-vihar" element={<Navigate to="/projects/anand-vihar-indore" replace />} />
      <Route path="/anand-vihar-indore" element={<Navigate to="/projects/anand-vihar-indore" replace />} />
      <Route path="/saatvikgreen-indore" element={<Navigate to="/projects/saatvikgreen-indore" replace />} />
      <Route path="/saatvik-green-indore" element={<Navigate to="/projects/saatvikgreen-indore" replace />} />
      <Route path="/saatvik-vihar" element={<Navigate to="/projects/saatvik-vihar-indore" replace />} />
      <Route path="/saatvik-vihar-indore" element={<Navigate to="/projects/saatvik-vihar-indore" replace />} />
      <Route path="/ruchi-enclave" element={<Navigate to="/projects/ruchi-enclave-indore" replace />} />
      <Route path="/ruchi-enclave-indore" element={<Navigate to="/projects/ruchi-enclave-indore" replace />} />
      <Route path="/oscar-sanctuary" element={<Navigate to="/projects/oscar-sanctuary-indore" replace />} />
      <Route path="/oscar-sanctuary-indore" element={<Navigate to="/projects/oscar-sanctuary-indore" replace />} />
      <Route path="/oscar-fort" element={<Navigate to="/projects/oscar-fort-indore" replace />} />
      <Route path="/oscar-fort-indore" element={<Navigate to="/projects/oscar-fort-indore" replace />} />

      <Route path="/Projects.html" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<GenericProjectPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/About.html" element={<AboutPage />} />
      <Route path="/blogs" element={<BlogPage />} />
      <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
      <Route path="/blog" element={<Navigate to="/blogs" replace />} />
      <Route path="/Blog.html" element={<Navigate to="/blogs" replace />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/disclaimer" element={<DisclaimerPage />} />
      <Route path="/Contact.html" element={<Navigate to="/contact" replace />} />
      <Route path="/media" element={<MediaPage />} />
      <Route path="/media/gallery" element={<MediaGalleryPage />} />
      <Route path="/media/press-releases" element={<PressReleasesPage />} />
      <Route path="/media/press-releases/:slug" element={<PressReleaseDetailPage />} />
      <Route path="/media/events-awards" element={<EventsAwardsPage />} />
      <Route path="/gallery" element={<Navigate to="/media/gallery" replace />} />
      <Route path="/press-releases" element={<Navigate to="/media/press-releases" replace />} />
      <Route path="/Careers.html" element={<CareersPage />} />
      <Route path="/awards" element={<Navigate to="/media/events-awards" replace />} />
      <Route path="/Awards.html" element={<Navigate to="/media/events-awards" replace />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/Admin.html" element={<AdminPage />} />
    </Routes>
    </>
  )
}
