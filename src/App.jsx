import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import CareersPage from './pages/CareersPage'
import AwardsPage from './pages/AwardsPage'
import AdminPage from './pages/AdminPage'
import OscarPage from './pages/OscarPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/oscar-indore" element={<OscarPage />} />
      <Route path="/Oscar.html" element={<OscarPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/Projects.html" element={<ProjectsPage />} />
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
  )
}
