import { useState, useEffect, useMemo } from "react";

const toJSON = (value) => {
  try { return JSON.stringify(value, null, 2); } catch { return ""; }
};
const fromJSON = (value) => {
  try { return JSON.parse(value); } catch { return []; }
};

const emptyProject = {
  title: "",
  tag: "",
  image_url: "",
  location: "",
  description: "",
  type: "Residential",
  status: "Ongoing",
  featured: false,
  sort_order: "",
  feature_order: "",
  heroTitle: "",
  heroTagline: "",
  heroLogo: "",
  heroBg: "",
  overviewParagraphs: [],
  overviewHighlights: [],
  amenities: [],
  specifications: [],
  locationImage: "",
  locationMapEmbed: "",
  locationDestinations: [],
  walkthroughVideoId: "",
  galleryImages: [],
  brochureUrl: "",
  metaTitle: "",
  metaDescription: "",
  isPublished: false,
};

const emptyBlog = {
  title: "",
  excerpt: "",
  content: "",
  author: "Admin",
  image: "",
  category: "News",
  tags: "",
  featured: false,
};

const emptyJob = {
  title: "",
  dept: "",
  type: "Full-time",
  desc: "",
  overview: "",
  responsibilities: "",
  requirements: "",
  is_active: true,
  sort_order: "",
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Future Opportunity"];

function AdminField({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function AdminImageUpload({ label, value, onChange }) {
  const [error, setError] = useState("");
  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      const bucket = label.toLowerCase().includes("blog") ? "blog-images" : "project-images";
      const url = await window.RuchiBackend.uploadImage(file, bucket);
      onChange(url);
    } catch (uploadError) {
      setError(uploadError.message || "Image upload failed.");
    }
  };

  return (
    <div className="admin-uploader">
      <div className="admin-uploader__preview">
        {value ? <img src={value} alt="" /> : <span>No image selected</span>}
      </div>
      <div className="admin-uploader__body">
        <span className="admin-uploader__label">{label}</span>
        <label className="admin-upload-btn">
          Upload image
          <input type="file" accept="image/webp,.webp" onChange={upload} />
        </label>
        {value ? <button type="button" className="admin-text-btn" onClick={() => onChange("")}>Remove</button> : null}
        {error ? <p className="admin-error">{error}</p> : <p className="admin-note">Use WebP only, 200 KB max. Uploads to Supabase Storage after admin sign-in.</p>}
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const { data, error: loginError } = await window.RuchiBackend.auth.login(email, password);
    if (loginError) {
      setError(loginError.message);
      return;
    }
    onLogin(data);
  };

  return (
    <main className="admin-login">
      <form className="admin-login__box" onSubmit={submit}>
        <img src="assets/logo-h.png" alt="Ruchi Realty" />
        <p className="admin-kicker">Secure admin login</p>
        <h1>Admin panel</h1>
        <AdminField label="Email">
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </AdminField>
        <AdminField label="Password">
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </AdminField>
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="admin-primary" type="submit">Sign in</button>
        <p className="admin-note">Use an approved staff account with an admin profile.</p>
      </form>
    </main>
  );
}

function DashboardAdmin({ onTab }) {
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    window.RuchiBackend.projects.getAllProjects().then(({ data }) => setProjects(data || []));
    window.RuchiBackend.leads.getAllLeads().then(({ data }) => setLeads(data || []));
    window.RuchiBackend.blogs.getAllBlogs().then(({ data }) => setBlogs(data || []));
    window.RuchiBackend.careers.getAll().then(({ data }) => setJobs(data || []));
    window.RuchiBackend.careerApplications.getAll().then(({ data }) => setApplications(data || []));
  }, []);

  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const activeJobs = jobs.filter((job) => job.is_active).length;
  const latestLeads = leads.slice(0, 4);
  const latestApps = applications.slice(0, 4);

  const navigateMetric = (label) => {
    if (label.includes("lead")) return onTab("leads");
    if (label.includes("blog")) return onTab("blogs");
    if (label.includes("job") || label.includes("Career")) return onTab("careers");
    return onTab("projects");
  };

  return (
    <section className="admin-dashboard">
      <div className="admin-hero">
        <div>
          <p className="admin-kicker">Staff workspace</p>
          <h2>Manage live website content.</h2>
          <p>Projects, leads, settings, and articles are managed through authenticated staff access with RLS protection.</p>
        </div>
        <button type="button" className="admin-primary" onClick={() => onTab("projects")}>Add project</button>
      </div>
      <div className="admin-metrics">
        {[
          ["Admin projects", projects.length],
          ["New leads", newLeads],
          ["Active jobs", activeJobs],
          ["Draft blogs", blogs.length],
        ].map(([label, value]) => (
          <button type="button" className="admin-metric" key={label} onClick={() => navigateMetric(label)}>
            <span>{label}</span>
            <strong>{value}</strong>
          </button>
        ))}
      </div>
      <div className="admin-grid admin-grid--dashboard">
        <div className="admin-panel">
          <h2>Latest leads</h2>
          <div className="admin-list">
            {latestLeads.length ? latestLeads.map((lead) => (
              <article className="admin-row" key={lead.id}>
                <div>
                  <strong>{lead.name}</strong>
                  <span>{lead.interest} \u00b7 {lead.status}</span>
                </div>
                <button type="button" className="admin-text-btn" onClick={() => onTab("leads")}>Open</button>
              </article>
            )) : <p className="admin-empty">No leads yet.</p>}
          </div>
        </div>
        <div className="admin-panel">
          <h2>Latest applications</h2>
          <div className="admin-list">
            {latestApps.length ? latestApps.map((app) => (
              <article className="admin-row" key={app.id}>
                <div>
                  <strong>{app.full_name}</strong>
                  <span>{app.job_title || "Career"} \u00b7 {app.status}</span>
                </div>
                <button type="button" className="admin-text-btn" onClick={() => onTab("careers")}>Open</button>
              </article>
            )) : <p className="admin-empty">No applications yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const load = async () => {
    const { data } = await window.RuchiBackend.projects.getAllProjects();
    setProjects(data || []);
  };

  useEffect(() => { load(); }, []);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const edit = async (project) => {
    setEditingId(project.id);
    const base = {
      title: project.title || "",
      tag: project.tag || "",
      image_url: project.image_url || "",
      location: project.location || "",
      description: project.description || "",
      type: project.type || "Residential",
      status: project.status || "Ongoing",
      featured: Boolean(project.featured),
      sort_order: project.sort_order ?? "",
      feature_order: project.feature_order ?? "",
    };
    const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(project.id);
    setForm({
      ...base,
      heroTitle: sp?.heroTitle || "",
      heroTagline: sp?.heroTagline || "",
      heroLogo: sp?.heroLogo || "",
      heroBg: sp?.heroBg || "",
      overviewParagraphs: sp?.overviewParagraphs || [],
      overviewHighlights: sp?.overviewHighlights || [],
      amenities: sp?.amenities || [],
      specifications: sp?.specifications || [],
      locationImage: sp?.locationImage || "",
      locationMapEmbed: sp?.locationMapEmbed || "",
      locationDestinations: sp?.locationDestinations || [],
      walkthroughVideoId: sp?.walkthroughVideoId || "",
      galleryImages: sp?.galleryImages || [],
      brochureUrl: sp?.brochureUrl || "",
      metaTitle: sp?.metaTitle || "",
      metaDescription: sp?.metaDescription || "",
      isPublished: sp?.isPublished ?? false,
    });
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyProject);
  };

  const save = async (event) => {
    event.preventDefault();
    if (editingId) {
      await window.RuchiBackend.projects.updateProject(editingId, form);
      await window.RuchiBackend.projectSubpages.upsert({
        project_id: editingId,
        heroTitle: form.heroTitle,
        heroTagline: form.heroTagline,
        heroLogo: form.heroLogo,
        heroBg: form.heroBg,
        overviewParagraphs: form.overviewParagraphs,
        overviewHighlights: form.overviewHighlights,
        amenities: form.amenities,
        specifications: form.specifications,
        locationImage: form.locationImage,
        locationMapEmbed: form.locationMapEmbed,
        locationDestinations: form.locationDestinations,
        walkthroughVideoId: form.walkthroughVideoId,
        galleryImages: form.galleryImages,
        brochureUrl: form.brochureUrl,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        isPublished: form.isPublished,
      });
    } else {
      await window.RuchiBackend.projects.createProject(form);
    }
    reset();
    load();
  };

  const remove = async (id) => {
    await window.RuchiBackend.projectSubpages.delete(id);
    await window.RuchiBackend.projects.deleteProject(id);
    if (editingId === id) reset();
    load();
  };

  const filteredProjects = projects.filter((project) => {
    const haystack = `${project.title} ${project.location} ${project.type} ${project.status}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (statusFilter === "All" || project.status === statusFilter);
  });

  return (
    <section className="admin-grid">
      <form className="admin-panel" onSubmit={save}>
        <div className="admin-panel__head">
          <h2>{editingId ? "Update project" : "Create project"}</h2>
          {editingId ? <button type="button" className="admin-text-btn" onClick={reset}>Cancel edit</button> : null}
        </div>
        <div className="admin-form-grid">
          <AdminField label="Title"><input required value={form.title} onChange={(event) => set("title", event.target.value)} /></AdminField>
          <AdminField label="Tag"><input required value={form.tag} onChange={(event) => set("tag", event.target.value)} /></AdminField>
          <AdminField label="Location"><input required value={form.location} onChange={(event) => set("location", event.target.value)} /></AdminField>
          <AdminField label="Type">
            <select value={form.type} onChange={(event) => set("type", event.target.value)}>
              {["Residential", "Commercial", "Township", "Land", "Leasing"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </AdminField>
          <AdminField label="Status">
            <select value={form.status} onChange={(event) => set("status", event.target.value)}>
              {["Ready to Move", "Ongoing", "Upcoming", "New Launch", "For Sale"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </AdminField>
          <AdminField label="Sort order"><input type="number" value={form.sort_order} onChange={(event) => set("sort_order", event.target.value)} /></AdminField>
          <AdminField label="Feature order"><input type="number" value={form.feature_order} onChange={(event) => set("feature_order", event.target.value)} /></AdminField>
        </div>
        <AdminImageUpload label="Project image" value={form.image_url} onChange={(value) => set("image_url", value)} />
        <AdminField label="Description"><textarea rows={4} value={form.description} onChange={(event) => set("description", event.target.value)} /></AdminField>
        <label className="admin-check"><input type="checkbox" checked={form.featured} onChange={(event) => set("featured", event.target.checked)} /> Featured project</label>

        {editingId ? (<details className="admin-details" style={{ marginTop: "24px" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "14px", userSelect: "none" }}>Project subpage content</summary>
          <div style={{ marginTop: "16px" }}>
            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Hero</h3>
            <AdminField label="Hero title"><input value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} /></AdminField>
            <AdminField label="Hero tagline"><input value={form.heroTagline} onChange={(e) => set("heroTagline", e.target.value)} /></AdminField>
            <AdminImageUpload label="Hero logo" value={form.heroLogo} onChange={(v) => set("heroLogo", v)} />
            <AdminImageUpload label="Hero background" value={form.heroBg} onChange={(v) => set("heroBg", v)} />

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Overview</h3>
            <AdminField label="Paragraphs (JSON array)"><textarea rows={3} value={toJSON(form.overviewParagraphs)} onChange={(e) => set("overviewParagraphs", fromJSON(e.target.value))} /></AdminField>
            <AdminField label="Highlights (JSON array)"><textarea rows={4} value={toJSON(form.overviewHighlights)} onChange={(e) => set("overviewHighlights", fromJSON(e.target.value))} /></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Amenities</h3>
            <AdminField label="Amenities (JSON array)"><textarea rows={4} value={toJSON(form.amenities)} onChange={(e) => set("amenities", fromJSON(e.target.value))} /></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Specifications</h3>
            <AdminField label="Specifications (JSON array)"><textarea rows={4} value={toJSON(form.specifications)} onChange={(e) => set("specifications", fromJSON(e.target.value))} /></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Location</h3>
            <AdminImageUpload label="Location image" value={form.locationImage} onChange={(v) => set("locationImage", v)} />
            <AdminField label="Map embed URL"><input value={form.locationMapEmbed} onChange={(e) => set("locationMapEmbed", e.target.value)} /></AdminField>
            <AdminField label="Destinations (JSON array)"><textarea rows={4} value={toJSON(form.locationDestinations)} onChange={(e) => set("locationDestinations", fromJSON(e.target.value))} /></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Walkthrough</h3>
            <AdminField label="YouTube video ID"><input value={form.walkthroughVideoId} onChange={(e) => set("walkthroughVideoId", e.target.value)} /></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Gallery</h3>
            <AdminField label="Gallery images (JSON array)"><textarea rows={4} value={toJSON(form.galleryImages)} onChange={(e) => set("galleryImages", fromJSON(e.target.value))} /></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Brochure</h3>
            <AdminField label="Brochure URL"><input value={form.brochureUrl} onChange={(e) => set("brochureUrl", e.target.value)} /></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>SEO</h3>
            <AdminField label="Meta title"><input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} /></AdminField>
            <AdminField label="Meta description"><textarea rows={2} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} /></AdminField>

            <label className="admin-check" style={{ margin: "12px 0" }}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} /> Subpage published
            </label>
          </div>
        </details>) : null}

        <button className="admin-primary" type="submit">{editingId ? "Update project" : "Create project"}</button>
      </form>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>Admin-added projects</h2>
          <span className="admin-count">{filteredProjects.length}</span>
        </div>
        <div className="admin-toolbar">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {["All", "Ready to Move", "Ongoing", "Upcoming", "New Launch", "For Sale"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="admin-list">
          {filteredProjects.length ? filteredProjects.map((project) => (
            <article className="admin-row admin-row--media" key={project.id}>
              <img className="admin-thumb" src={project.image_url || "assets/logo-mark.png"} alt="" />
              <div>
                <strong>{project.title}</strong>
                <span>{project.location} \u00b7 {project.type} \u00b7 {project.status}</span>
              </div>
              <div className="admin-actions">
                <button type="button" onClick={() => edit(project)}>Edit</button>
                <button type="button" onClick={() => remove(project.id)}>Delete</button>
              </div>
            </article>
          )) : <p className="admin-empty">No matching projects in Supabase yet.</p>}
        </div>
      </div>
    </section>
  );
}

function LeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const load = async () => {
    const { data } = await window.RuchiBackend.leads.getAllLeads();
    setLeads(data || []);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await window.RuchiBackend.leads.updateLeadStatus(id, status);
    load();
  };
  const remove = async (id) => {
    await window.RuchiBackend.leads.deleteLead(id);
    load();
  };

  const filteredLeads = leads.filter((lead) => {
    const haystack = `${lead.name} ${lead.phone} ${lead.email} ${lead.interest} ${lead.source}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (statusFilter === "All" || lead.status === statusFilter);
  });

  return (
    <section className="admin-panel">
      <div className="admin-panel__head">
        <h2>Leads</h2>
        <span className="admin-count">{filteredLeads.length}</span>
      </div>
      <div className="admin-toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads" />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {["All", "new", "contacted", "qualified", "lost", "closed"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="admin-list">
        {filteredLeads.length ? filteredLeads.map((lead) => (
          <article className="admin-row admin-row--lead" key={lead.id}>
            <div>
              <strong>{lead.name}</strong>
              <span>{lead.phone} \u00b7 {lead.email}</span>
              <span>{lead.interest} \u00b7 {lead.source}</span>
              {lead.notes ? <p>{lead.notes}</p> : null}
            </div>
            <div className="admin-actions">
              <select value={lead.status} onChange={(event) => updateStatus(lead.id, event.target.value)}>
                {["new", "contacted", "qualified", "lost", "closed"].map((item) => <option key={item}>{item}</option>)}
              </select>
              <button type="button" onClick={() => remove(lead.id)}>Delete</button>
            </div>
          </article>
        )) : <p className="admin-empty">No matching leads. Submit the public contact form to create one.</p>}
      </div>
    </section>
  );
}

function SettingsAdmin() {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.RuchiBackend.settings.getSettings().then(({ data }) => setSettings(data));
  }, []);

  if (!settings) return null;

  const set = (key, value) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const save = async (event) => {
    event.preventDefault();
    const { data } = await window.RuchiBackend.settings.updateSettings(settings);
    setSettings(data);
    setSaved(true);
  };

  return (
    <form className="admin-panel" onSubmit={save}>
      <h2>Site settings</h2>
      <div className="admin-form-grid">
        {["siteName", "phone", "whatsapp", "email", "workingHours", "facebook", "instagram", "youtube", "linkedin"].map((key) => (
          <AdminField key={key} label={key}>
            <input value={settings[key] || ""} onChange={(event) => set(key, event.target.value)} />
          </AdminField>
        ))}
      </div>
      <AdminField label="Address"><textarea rows={3} value={settings.address || ""} onChange={(event) => set("address", event.target.value)} /></AdminField>
      <AdminField label="Map embed URL"><input value={settings.mapEmbedUrl || ""} onChange={(event) => set("mapEmbedUrl", event.target.value)} /></AdminField>
      <AdminField label="Map link"><input value={settings.mapLink || ""} onChange={(event) => set("mapLink", event.target.value)} /></AdminField>
      <button className="admin-primary" type="submit">Save settings</button>
      {saved ? <p className="admin-success">Settings saved in Supabase.</p> : null}
    </form>
  );
}

function BlogsAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(emptyBlog);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const load = async () => {
    const { data } = await window.RuchiBackend.blogs.getAllBlogs();
    setBlogs(data || []);
  };
  useEffect(() => { load(); }, []);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const reset = () => {
    setEditingId(null);
    setForm(emptyBlog);
  };
  const save = async (event) => {
    event.preventDefault();
    if (editingId) await window.RuchiBackend.blogs.updateBlog(editingId, form);
    else await window.RuchiBackend.blogs.createBlog(form);
    reset();
    load();
  };
  const edit = (blog) => {
    setEditingId(blog.id);
    setForm({ ...emptyBlog, ...blog, tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "" });
  };
  const remove = async (id) => {
    await window.RuchiBackend.blogs.deleteBlog(id);
    if (editingId === id) reset();
    load();
  };

  const filteredBlogs = blogs.filter((blog) =>
    `${blog.title} ${blog.category} ${blog.author}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="admin-grid">
      <form className="admin-panel" onSubmit={save}>
        <div className="admin-panel__head">
          <h2>{editingId ? "Update blog" : "Create blog"}</h2>
          {editingId ? <button type="button" className="admin-text-btn" onClick={reset}>Cancel edit</button> : null}
        </div>
        <div className="admin-form-grid">
          <AdminField label="Title"><input required value={form.title} onChange={(event) => set("title", event.target.value)} /></AdminField>
          <AdminField label="Category">
            <select value={form.category} onChange={(event) => set("category", event.target.value)}>
              {["News", "Buying Guide", "Market Trends", "Investment"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </AdminField>
          <AdminField label="Author"><input value={form.author} onChange={(event) => set("author", event.target.value)} /></AdminField>
        </div>
        <AdminImageUpload label="Blog image" value={form.image} onChange={(value) => set("image", value)} />
        <AdminField label="Excerpt"><textarea required rows={3} value={form.excerpt} onChange={(event) => set("excerpt", event.target.value)} /></AdminField>
        <AdminField label="Content"><textarea required rows={7} value={form.content} onChange={(event) => set("content", event.target.value)} /></AdminField>
        <AdminField label="Tags, comma separated"><input value={form.tags} onChange={(event) => set("tags", event.target.value)} /></AdminField>
        <label className="admin-check"><input type="checkbox" checked={form.featured} onChange={(event) => set("featured", event.target.checked)} /> Featured article</label>
        <button className="admin-primary" type="submit">{editingId ? "Update blog" : "Create blog"}</button>
      </form>
      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>Blogs</h2>
          <span className="admin-count">{filteredBlogs.length}</span>
        </div>
        <div className="admin-toolbar">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search blogs" />
        </div>
        <div className="admin-list">
          {filteredBlogs.length ? filteredBlogs.map((blog) => (
            <article className="admin-row admin-row--media" key={blog.id}>
              <img className="admin-thumb" src={blog.image || "assets/logo-mark.png"} alt="" />
              <div>
                <strong>{blog.title}</strong>
                <span>{blog.category} \u00b7 {blog.author}</span>
              </div>
              <div className="admin-actions">
                <button type="button" onClick={() => edit(blog)}>Edit</button>
                <button type="button" onClick={() => remove(blog.id)}>Delete</button>
              </div>
            </article>
          )) : <p className="admin-empty">No matching blogs yet.</p>}
        </div>
      </div>
    </section>
  );
}

function CareersAdmin() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [subTab, setSubTab] = useState("jobs");
  const [form, setForm] = useState(emptyJob);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");

  const loadJobs = async () => {
    const { data } = await window.RuchiBackend.careers.getAll();
    setJobs(data || []);
  };
  const loadApplications = async () => {
    const { data } = await window.RuchiBackend.careerApplications.getAll();
    setApplications(data || []);
  };

  useEffect(() => { loadJobs(); loadApplications(); }, []);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const reset = () => {
    setEditingId(null);
    setForm(emptyJob);
  };
  const save = async (event) => {
    event.preventDefault();
    if (editingId) await window.RuchiBackend.careers.update(editingId, form);
    else await window.RuchiBackend.careers.create(form);
    reset();
    loadJobs();
  };
  const edit = (job) => {
    setEditingId(job.id);
    setForm({
      title: job.title || "",
      dept: job.dept || "",
      type: job.type || "Full-time",
      desc: job.desc || "",
      overview: job.overview || "",
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : "",
      requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
      is_active: job.is_active !== false,
      sort_order: job.sort_order ?? "",
    });
  };
  const remove = async (id) => {
    await window.RuchiBackend.careers.remove(id);
    if (editingId === id) reset();
    loadJobs();
  };
  const download = () => {
    window.RuchiBackend.careerApplications.downloadCSV(applications);
  };

  const toggleActive = async (id, current) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    await window.RuchiBackend.careers.update(id, { ...job, is_active: !current });
    loadJobs();
  };

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.dept} ${job.type}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="admin-careers-head">
        <div className="admin-tabs" style={{ margin: 0 }}>
          <button type="button" className={subTab === "jobs" ? "is-active" : ""} onClick={() => setSubTab("jobs")}>Job Listings</button>
          <button type="button" className={subTab === "applications" ? "is-active" : ""} onClick={() => setSubTab("applications")}>Applications ({applications.length})</button>
        </div>
      </div>

      {subTab === "jobs" ? (
        <div className="admin-grid admin-careers-grid">
          <div className="admin-panel">
            <div className="admin-panel__head">
              <h2>Job Listings</h2>
              <span className="admin-count">{filteredJobs.length}</span>
            </div>
            <div className="admin-toolbar">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jobs..." />
            </div>
            <div className="admin-list">
              {filteredJobs.length ? filteredJobs.map((job) => (
                <article className={`admin-row ${job.is_active ? "" : "admin-row--inactive"}`} key={job.id}>
                  <div>
                    <strong>{job.title}</strong>
                    <div className="admin-job-meta">
                      <span className="admin-job-dept">{job.dept}</span>
                      <span className="admin-job-type">{job.type}</span>
                      {!job.is_active ? <span className="admin-job-inactive">Inactive</span> : null}
                    </div>
                  </div>
                  <div className="admin-actions">
                    <button type="button" onClick={() => edit(job)}>Edit</button>
                    <button type="button" onClick={() => toggleActive(job.id, job.is_active)}>{job.is_active ? "Deactivate" : "Activate"}</button>
                    <button type="button" onClick={() => remove(job.id)}>Delete</button>
                  </div>
                </article>
              )) : <p className="admin-empty">No job listings yet.</p>}
            </div>
          </div>

          <form className="admin-panel" onSubmit={save}>
            <div className="admin-panel__head">
              <h2>{editingId ? "Update job" : "Add job"}</h2>
              {editingId ? <button type="button" className="admin-text-btn" onClick={reset}>Cancel</button> : null}
            </div>
            <div className="admin-form-grid">
              <AdminField label="Title"><input required value={form.title} onChange={(event) => set("title", event.target.value)} /></AdminField>
              <AdminField label="Department"><input required value={form.dept} onChange={(event) => set("dept", event.target.value)} /></AdminField>
              <AdminField label="Type">
                <select value={form.type} onChange={(event) => set("type", event.target.value)}>
                  {JOB_TYPES.map((item) => <option key={item}>{item}</option>)}
                </select>
              </AdminField>
              <AdminField label="Sort order"><input type="number" value={form.sort_order} onChange={(event) => set("sort_order", event.target.value)} /></AdminField>
            </div>
            <AdminField label="Short description"><textarea required rows={2} value={form.desc} onChange={(event) => set("desc", event.target.value)} /></AdminField>
            <AdminField label="Overview"><textarea rows={3} value={form.overview} onChange={(event) => set("overview", event.target.value)} /></AdminField>
            <AdminField label="Responsibilities (one per line)"><textarea rows={4} value={form.responsibilities} onChange={(event) => set("responsibilities", event.target.value)} /></AdminField>
            <AdminField label="Requirements (one per line)"><textarea rows={4} value={form.requirements} onChange={(event) => set("requirements", event.target.value)} /></AdminField>
            <label className="admin-check"><input type="checkbox" checked={form.is_active} onChange={(event) => set("is_active", event.target.checked)} /> Active listing</label>
            <button className="admin-primary" type="submit">{editingId ? "Update job" : "Add job"}</button>
          </form>
        </div>
      ) : (
        <>
          <div className="admin-apps-toolbar">
            <div className="admin-apps-toolbar-left">
              <h3 style={{ margin: 0 }}>Applications</h3>
              <span className="admin-apps-count">{applications.length} application{applications.length !== 1 ? "s" : ""}</span>
            </div>
            <button type="button" className="admin-primary" onClick={download}>Download CSV</button>
          </div>
          <div className="admin-list">
            {applications.length ? applications.map((app) => (
              <article className="admin-row admin-app-card" key={app.id}>
                <div className="admin-app-main">
                  <div className="admin-app-header">
                    <strong className="admin-app-name">{app.full_name}</strong>
                    <span className="admin-app-date">{app.created_at ? new Date(app.created_at).toLocaleString() : ""}</span>
                  </div>
                  <div className="admin-app-contact">
                    <span>{app.phone}</span>
                    <span>{app.email}</span>
                    {app.job_title ? <span className="admin-app-job">{app.job_title}</span> : null}
                    {app.city ? <span>{app.city}</span> : null}
                  </div>
                  {app.candidate_profile ? <div className="admin-app-section"><span className="admin-app-label">Profile</span><p>{app.candidate_profile}</p></div> : null}
                  {app.message ? <div className="admin-app-section"><span className="admin-app-label">Message</span><p className="admin-app-message">{app.message}</p></div> : null}
                  {app.resume_url ? (
                    <div className="admin-app-section">
                      <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="admin-text-btn admin-app-resume">View Resume ({app.resume_name || "file"})</a>
                    </div>
                  ) : null}
                </div>
                <div className="admin-app-side">
                  <span className={`admin-app-status admin-app-status--${app.status}`}>{app.status}</span>
                  <select value={app.status} onChange={async (event) => {
                    await window.RuchiBackend.careerApplications.updateStatus(app.id, event.target.value);
                    loadApplications();
                  }}>
                    {["new", "contacted", "qualified", "lost", "closed"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
              </article>
            )) : <p className="admin-empty">No career applications yet.</p>}
          </div>
        </>
      )}
    </>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState(() => window.RuchiBackend?.auth?.currentUser());
  const [tab, setTab] = useState("dashboard");
  const tabs = useMemo(() => [
    ["dashboard", "Dashboard"],
    ["projects", "Projects"],
    ["careers", "Careers"],
    ["leads", "Leads"],
    ["settings", "Settings"],
    ["blogs", "Blogs"],
  ], []);

  useEffect(() => {
    document.body.classList.add("admin-body");
    return () => document.body.classList.remove("admin-body");
  }, []);

  if (!user) return <AdminLogin onLogin={setUser} />;

  const logout = async () => {
    await window.RuchiBackend.auth.logout();
    setUser(null);
  };

  return (
    <>
      <div className="admin-top-row">
        <a href="/" className="admin-brand"><img src="assets/logo-h.png" alt="Ruchi Realty" /></a>
        <button type="button" className="admin-logout" onClick={logout}>Logout</button>
      </div>
      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.map(([id, label]) => (
          <button key={id} className={tab === id ? "is-active" : ""} type="button" onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>
      <main className="admin-main">
        {tab === "dashboard" ? <DashboardAdmin onTab={setTab} /> : null}
        {tab === "projects" ? <ProjectsAdmin /> : null}
        {tab === "careers" ? <CareersAdmin /> : null}
        {tab === "leads" ? <LeadsAdmin /> : null}
        {tab === "settings" ? <SettingsAdmin /> : null}
        {tab === "blogs" ? <BlogsAdmin /> : null}
      </main>
    </>
  );
}
