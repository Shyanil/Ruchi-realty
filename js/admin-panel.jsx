/* ============================================================
   Ruchi Realty — Admin review panel
   ============================================================ */
const { useEffect: useAdminEffect, useMemo: useAdminMemo, useState: useAdminState } = React;

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

function AdminField({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function AdminImageUpload({ label, value, onChange }) {
  const [error, setError] = useAdminState("");
  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      const dataUrl = await window.RuchiBackend.uploadImage(file);
      onChange(dataUrl);
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
          <input type="file" accept="image/*" onChange={upload} />
        </label>
        {value ? <button type="button" className="admin-text-btn" onClick={() => onChange("")}>Remove</button> : null}
        {error ? <p className="admin-error">{error}</p> : <p className="admin-note">Stored locally for preview now. Later this can upload to Supabase/cPanel.</p>}
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const creds = window.RuchiBackend.dummyCredentials;
  const [email, setEmail] = useAdminState(creds.email);
  const [password, setPassword] = useAdminState(creds.password);
  const [error, setError] = useAdminState("");

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
        <p className="admin-kicker">Dummy review login</p>
        <h1>Admin panel preview</h1>
        <AdminField label="Email">
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </AdminField>
        <AdminField label="Password">
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </AdminField>
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="admin-primary" type="submit">Sign in</button>
        <p className="admin-note">Credentials: {creds.email} / {creds.password}</p>
      </form>
    </main>
  );
}

function DashboardAdmin({ onTab }) {
  const [projects, setProjects] = useAdminState([]);
  const [leads, setLeads] = useAdminState([]);
  const [blogs, setBlogs] = useAdminState([]);

  useAdminEffect(() => {
    window.RuchiBackend.projects.getAllProjects().then(({ data }) => setProjects(data || []));
    window.RuchiBackend.leads.getAllLeads().then(({ data }) => setLeads(data || []));
    window.RuchiBackend.blogs.getAllBlogs().then(({ data }) => setBlogs(data || []));
  }, []);

  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const featuredProjects = projects.filter((project) => project.featured).length;
  const latestLeads = leads.slice(0, 4);

  return (
    <section className="admin-dashboard">
      <div className="admin-hero">
        <div>
          <p className="admin-kicker">Review workspace</p>
          <h2>Manage content before Supabase is connected.</h2>
          <p>Projects, leads, settings, and articles are saved in this browser for preview.</p>
        </div>
        <button type="button" className="admin-primary" onClick={() => onTab("projects")}>Add project</button>
      </div>
      <div className="admin-metrics">
        {[
          ["Admin projects", projects.length],
          ["New leads", newLeads],
          ["Featured projects", featuredProjects],
          ["Draft blogs", blogs.length],
        ].map(([label, value]) => (
          <button type="button" className="admin-metric" key={label} onClick={() => onTab(label.includes("lead") ? "leads" : label.includes("blog") ? "blogs" : "projects")}>
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
                  <span>{lead.interest} · {lead.status}</span>
                </div>
                <button type="button" className="admin-text-btn" onClick={() => onTab("leads")}>Open</button>
              </article>
            )) : <p className="admin-empty">No leads yet.</p>}
          </div>
        </div>
        <div className="admin-panel">
          <h2>Next steps</h2>
          <div className="admin-task-list">
            <span>Replace dummy Supabase config when credentials arrive.</span>
            <span>Run `backend/sql/00_complete_setup.sql` in Supabase.</span>
            <span>Create a real Auth user and update the admin email placeholder.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsAdmin() {
  const [projects, setProjects] = useAdminState([]);
  const [form, setForm] = useAdminState(emptyProject);
  const [editingId, setEditingId] = useAdminState(null);
  const [query, setQuery] = useAdminState("");
  const [statusFilter, setStatusFilter] = useAdminState("All");

  const load = async () => {
    const { data } = await window.RuchiBackend.projects.getAllProjects();
    setProjects(data || []);
  };

  useAdminEffect(() => { load(); }, []);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const edit = (project) => {
    setEditingId(project.id);
    setForm({
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
    });
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyProject);
  };

  const save = async (event) => {
    event.preventDefault();
    if (editingId) await window.RuchiBackend.projects.updateProject(editingId, form);
    else await window.RuchiBackend.projects.createProject(form);
    reset();
    load();
  };

  const remove = async (id) => {
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
                <span>{project.location} · {project.type} · {project.status}</span>
              </div>
              <div className="admin-actions">
                <button type="button" onClick={() => edit(project)}>Edit</button>
                <button type="button" onClick={() => remove(project.id)}>Delete</button>
              </div>
            </article>
          )) : <p className="admin-empty">No matching admin projects. Seed projects still show on public pages.</p>}
        </div>
      </div>
    </section>
  );
}

function LeadsAdmin() {
  const [leads, setLeads] = useAdminState([]);
  const [query, setQuery] = useAdminState("");
  const [statusFilter, setStatusFilter] = useAdminState("All");
  const load = async () => {
    const { data } = await window.RuchiBackend.leads.getAllLeads();
    setLeads(data || []);
  };
  useAdminEffect(() => { load(); }, []);

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
              <span>{lead.phone} · {lead.email}</span>
              <span>{lead.interest} · {lead.source}</span>
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
  const [settings, setSettings] = useAdminState(null);
  const [saved, setSaved] = useAdminState(false);

  useAdminEffect(() => {
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
      {saved ? <p className="admin-success">Settings saved in dummy storage.</p> : null}
    </form>
  );
}

function BlogsAdmin() {
  const [blogs, setBlogs] = useAdminState([]);
  const [form, setForm] = useAdminState(emptyBlog);
  const [editingId, setEditingId] = useAdminState(null);
  const [query, setQuery] = useAdminState("");
  const load = async () => {
    const { data } = await window.RuchiBackend.blogs.getAllBlogs();
    setBlogs(data || []);
  };
  useAdminEffect(() => { load(); }, []);

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
                <span>{blog.category} · {blog.author}</span>
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

function AdminApp() {
  const [user, setUser] = useAdminState(() => window.RuchiBackend.auth.currentUser());
  const [tab, setTab] = useAdminState("dashboard");
  const tabs = useAdminMemo(() => [
    ["dashboard", "Dashboard"],
    ["projects", "Projects"],
    ["leads", "Leads"],
    ["settings", "Settings"],
    ["blogs", "Blogs"],
  ], []);

  if (!user) return <AdminLogin onLogin={setUser} />;

  const logout = async () => {
    await window.RuchiBackend.auth.logout();
    setUser(null);
  };

  return (
    <React.Fragment>
      <header className="admin-top">
        <a href="Homepage.html" className="admin-brand"><img src="assets/logo-h.png" alt="Ruchi Realty" /></a>
        <div>
          <p className="admin-kicker">Dummy mode · Supabase blank</p>
          <h1>Admin panel</h1>
        </div>
        <button type="button" className="admin-logout" onClick={logout}>Logout</button>
      </header>
      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.map(([id, label]) => (
          <button key={id} className={tab === id ? "is-active" : ""} type="button" onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>
      <main className="admin-main">
        {tab === "dashboard" ? <DashboardAdmin onTab={setTab} /> : null}
        {tab === "projects" ? <ProjectsAdmin /> : null}
        {tab === "leads" ? <LeadsAdmin /> : null}
        {tab === "settings" ? <SettingsAdmin /> : null}
        {tab === "blogs" ? <BlogsAdmin /> : null}
      </main>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AdminApp />);
