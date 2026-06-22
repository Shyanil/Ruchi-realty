/* ============================================================
   Ruchi Realty — temporary backend bridge
   ------------------------------------------------------------
   Runs without Supabase credentials. Data is stored in localStorage
   so the website and admin panel can be reviewed now.
   ============================================================ */
(function () {
  const CONFIG = {
    supabaseUrl: "",
    supabaseAnonKey: "",
    uploadEndpoint: "",
    uploadApiKey: "",
    mode: "dummy",
  };

  const DUMMY_ADMIN = {
    email: "admin@ruchirealty.local",
    password: "admin123",
    name: "Review Admin",
  };

  const keys = {
    projects: "ruchi_admin_projects",
    leads: "ruchi_admin_leads",
    settings: "ruchi_admin_settings",
    blogs: "ruchi_admin_blogs",
    session: "ruchi_admin_session",
  };

  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  };

  const uid = () =>
    (crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

  const slugify = (value = "") =>
    value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const mapsEmbed = (address) => `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const mapsLink = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const imageToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      if (!file || !file.type?.startsWith("image/")) {
        reject(new Error("Please choose an image file."));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Could not read the image."));
      reader.readAsDataURL(file);
    });

  const defaultSettings = {
    siteName: "Ruchi Realty",
    phone: "+91 892 922 5275",
    whatsapp: "918929225275",
    email: "sales@ruchirealty.com",
    address: "54, 10 D. C. Dey Road, Tangra, Kolkata 700015",
    workingHours: "Monday to Saturday, 10:00 AM to 6:30 PM",
    mapEmbedUrl: mapsEmbed("54, 10 D. C. Dey Road, Tangra, Kolkata 700015"),
    mapLink: mapsLink("54, 10 D. C. Dey Road, Tangra, Kolkata 700015"),
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
  };

  const normalizeProject = (project = {}) => {
    const title = project.title || project.name || "Untitled Project";
    const location = project.location || project.city || "";
    return {
      id: project.id || uid(),
      created_at: project.created_at || new Date().toISOString(),
      title,
      name: title,
      tag: project.tag || project.status || "Project",
      image_url: project.image_url || project.img || "",
      img: project.image_url || project.img || "",
      location,
      city: location,
      description: project.description || "",
      type: project.type || "Residential",
      status: project.status || "Ongoing",
      featured: Boolean(project.featured),
      sort_order: project.sort_order === "" || project.sort_order == null ? null : Number(project.sort_order),
      feature_order: project.feature_order === "" || project.feature_order == null ? null : Number(project.feature_order),
      slug: project.slug || slugify(`${title}-${location}`),
    };
  };

  const sortProjects = (items) =>
    [...items].sort((a, b) => {
      const ao = a.sort_order ?? 9999;
      const bo = b.sort_order ?? 9999;
      if (ao !== bo) return ao - bo;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  const seedProjects = Array.isArray(window.PROJECTS) ? window.PROJECTS.map(normalizeProject) : [];
  const getSeedProjects = () => seedProjects.map((project) => ({ ...project }));
  const getStoredProjects = () => read(keys.projects, []).map(normalizeProject);

  const syncPublicProjects = () => {
    if (!Array.isArray(window.PROJECTS)) return;
    const seedBySlug = new Map(getSeedProjects().map((item) => [item.slug, item]));
    getStoredProjects().forEach((item) => seedBySlug.set(item.slug, item));
    const merged = sortProjects([...seedBySlug.values()]);
    window.PROJECTS.splice(0, window.PROJECTS.length, ...merged);
  };

  const projectService = {
    async getAllProjects() {
      return { data: sortProjects(getStoredProjects()), error: null };
    },
    async getPublicProjects() {
      syncPublicProjects();
      return { data: getSeedProjects(), error: null };
    },
    async getProjectBySlug(slug) {
      syncPublicProjects();
      const project = getSeedProjects().find((item) => item.slug === slug);
      return { data: project || null, error: project ? null : new Error("Project not found") };
    },
    async createProject(projectData) {
      const projects = getStoredProjects();
      const project = normalizeProject(projectData);
      projects.push(project);
      write(keys.projects, projects);
      syncPublicProjects();
      return { data: project, error: null };
    },
    async updateProject(id, projectData) {
      const projects = getStoredProjects();
      const index = projects.findIndex((item) => item.id === id);
      if (index < 0) return { data: null, error: new Error("Project not found") };
      projects[index] = normalizeProject({ ...projects[index], ...projectData, id });
      write(keys.projects, projects);
      syncPublicProjects();
      return { data: projects[index], error: null };
    },
    async deleteProject(id) {
      write(keys.projects, getStoredProjects().filter((item) => item.id !== id));
      syncPublicProjects();
      return { error: null };
    },
  };

  const leadService = {
    async submitLead(leadData) {
      const leads = read(keys.leads, []);
      const lead = {
        id: uid(),
        created_at: new Date().toISOString(),
        name: (leadData.name || "").trim(),
        email: (leadData.email || "").trim(),
        phone: (leadData.phone || "").trim(),
        interest: leadData.interest || leadData.project || "General",
        source: leadData.source || "Website",
        project_slug: leadData.project_slug || null,
        status: "new",
        notes: leadData.notes || leadData.message || null,
      };
      leads.push(lead);
      write(keys.leads, leads);
      return { data: lead, error: null };
    },
    async getAllLeads() {
      return {
        data: read(keys.leads, []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        error: null,
      };
    },
    async updateLeadStatus(id, status) {
      const leads = read(keys.leads, []);
      const index = leads.findIndex((lead) => lead.id === id);
      if (index < 0) return { data: null, error: new Error("Lead not found") };
      leads[index] = { ...leads[index], status };
      write(keys.leads, leads);
      return { data: leads[index], error: null };
    },
    async deleteLead(id) {
      write(keys.leads, read(keys.leads, []).filter((lead) => lead.id !== id));
      return { error: null };
    },
  };

  const settingsService = {
    async getSettings() {
      const saved = read(keys.settings, {});
      const settings = { ...defaultSettings, ...saved };
      if (settings.address && !settings.mapEmbedUrl) settings.mapEmbedUrl = mapsEmbed(settings.address);
      if (settings.address && !settings.mapLink) settings.mapLink = mapsLink(settings.address);
      return { data: settings, error: null };
    },
    async updateSettings(settings) {
      const merged = { ...defaultSettings, ...settings, updated_at: new Date().toISOString() };
      write(keys.settings, merged);
      return { data: merged, error: null };
    },
  };

  const blogService = {
    async getAllBlogs() {
      return { data: read(keys.blogs, []), error: null };
    },
    async createBlog(blogData) {
      const blogs = read(keys.blogs, []);
      const blog = {
        id: uid(),
        created_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        slug: blogData.slug || slugify(blogData.title),
        author: blogData.author || "Admin",
        ...blogData,
        tags: Array.isArray(blogData.tags) ? blogData.tags : String(blogData.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
        featured: Boolean(blogData.featured),
      };
      blogs.push(blog);
      write(keys.blogs, blogs);
      return { data: blog, error: null };
    },
    async updateBlog(id, blogData) {
      const blogs = read(keys.blogs, []);
      const index = blogs.findIndex((blog) => blog.id === id);
      if (index < 0) return { data: null, error: new Error("Blog not found") };
      blogs[index] = { ...blogs[index], ...blogData, slug: blogData.slug || blogs[index].slug || slugify(blogData.title) };
      write(keys.blogs, blogs);
      return { data: blogs[index], error: null };
    },
    async deleteBlog(id) {
      write(keys.blogs, read(keys.blogs, []).filter((blog) => blog.id !== id));
      return { error: null };
    },
  };

  const auth = {
    getDummyCredentials() {
      return { email: DUMMY_ADMIN.email, password: DUMMY_ADMIN.password };
    },
    currentUser() {
      return read(keys.session, null);
    },
    async login(email, password) {
      if (email === DUMMY_ADMIN.email && password === DUMMY_ADMIN.password) {
        const session = { email, name: DUMMY_ADMIN.name, role: "admin", loggedInAt: new Date().toISOString() };
        write(keys.session, session);
        return { data: session, error: null };
      }
      return { data: null, error: new Error("Use the dummy admin credentials for this review build.") };
    },
    async logout() {
      localStorage.removeItem(keys.session);
      return { error: null };
    },
  };

  window.RuchiBackend = {
    config: CONFIG,
    mode: CONFIG.mode,
    auth,
    projects: projectService,
    leads: leadService,
    settings: settingsService,
    blogs: blogService,
    syncPublicProjects,
    uploadImage: imageToDataUrl,
    dummyCredentials: auth.getDummyCredentials(),
  };

  syncPublicProjects();
})();
