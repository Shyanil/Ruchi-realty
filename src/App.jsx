import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import CareersPage from './pages/CareersPage'
import AwardsPage from './pages/AwardsPage'
import AdminPage from './pages/AdminPage'
import OscarPage from './pages/OscarPage'
import ActiveBusinessParkPage from './pages/ActiveBusinessParkPage'
import ActiveAcresAngelicaPage from './pages/ActiveAcresAngelicaPage'
import ActiveGreensPage from './pages/ActiveGreensPage'
import OneRajarhatPage from './pages/OneRajarhatPage'
import GenericProjectPage from './pages/GenericProjectPage'

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
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
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/oscar-indore" element={<OscarPage />} />
      <Route path="/Oscar.html" element={<OscarPage />} />
      <Route path="/active-business-park" element={<ActiveBusinessParkPage />} />
      <Route path="/ActiveBusinessPark.html" element={<ActiveBusinessParkPage />} />
      <Route path="/active-acres-angelica" element={<ActiveAcresAngelicaPage />} />
      <Route path="/ActiveAcresAngelica.html" element={<ActiveAcresAngelicaPage />} />
      <Route path="/active-greens" element={<ActiveGreensPage />} />
      <Route path="/ActiveGreens.html" element={<ActiveGreensPage />} />
      <Route path="/one-rajarhat" element={<OneRajarhatPage />} />
      <Route path="/OneRajarhat.html" element={<OneRajarhatPage />} />
      <Route path="/projects" element={<ProjectsPage />} />

      <Route path="/Projects.html" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<GenericProjectPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/About.html" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/Blog.html" element={<BlogPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/Careers.html" element={<CareersPage />} />
      <Route path="/awards" element={<AwardsPage />} />
      <Route path="/Awards.html" element={<AwardsPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/Admin.html" element={<AdminPage />} />
    </Routes>
    </>
  )
}
