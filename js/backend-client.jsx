/* ============================================================
   Ruchi Realty ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Supabase backend bridge
   ============================================================ */
(function () {
  const SUPABASE = window.RUCHI_SUPABASE_CONFIG || {};
  const CONFIG = {
    supabaseUrl: SUPABASE.url || "",
    supabaseAnonKey: SUPABASE.anonKey || "",
    mode: "supabase",
  };

  const SESSION_KEY = "ruchi_supabase_session";
  const configured = CONFIG.supabaseUrl.startsWith("https://") && CONFIG.supabaseAnonKey.startsWith("eyJ");

  const uid = () =>
    (crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

  const slugify = (value = "") =>
    value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const mapsEmbed = (address) => `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const mapsLink = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const readSession = () => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!session?.access_token || (session.expires_at && session.expires_at * 1000 < Date.now())) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  };

  const saveSession = (session) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  };

  const disabled = (message = "Supabase is not configured.") => ({
    data: null,
    error: new Error(message),
  });

  const authHeader = (requireAuth = false) => {
    const session = readSession();
    if (requireAuth) return session?.access_token || "";
    return CONFIG.supabaseAnonKey;
  };

  const request = async (path, options = {}) => {
    if (!configured) return disabled("Supabase is not configured. Check js/supabase-config.js.");
    const token = options.token || authHeader(options.auth);
    if (options.auth && !token) return { data: null, error: new Error("Please sign in again before uploading or saving admin content.") };
    const headers = {
      apikey: CONFIG.supabaseAnonKey,
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };
    if (options.json !== undefined) headers["Content-Type"] = "application/json";

    try {
      const response = await fetch(`${CONFIG.supabaseUrl}${path}`, {
        method: options.method || "GET",
        headers,
        body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) {
        return { data: null, error: new Error(data?.message || data?.error_description || data?.error || response.statusText) };
      }
      return { data, error: null };
    } catch (error) {
      if (/Failed to fetch/i.test(error?.message || "")) {
        return { data: null, error: new Error("Could not connect to Supabase. Check internet connection, browser CORS/ad-blocking, and Supabase project availability.") };
      }
      return { data: null, error };
    }
  };

  const qs = (params = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) search.set(key, value);
    });
    const text = search.toString();
    return text ? `?${text}` : "";
  };

  const rest = (table, params, options = {}) =>
    request(`/rest/v1/${table}${qs(params)}`, options);

  const toOrder = (value) => (value === "" || value == null || Number.isNaN(Number(value)) ? null : Number(value));

  const projectSlugForTitle = (title = "", location = "") => {
    const key = title.toLowerCase().trim();
    const place = location.toLowerCase().trim();
    if (key.includes("active business park")) return "active-business-park";
    if (key.includes("active acres") || key.includes("angelica")) return "active-acres-angelica";
    if (key.includes("active greens") || key.includes("active green")) return "active-greens";
    if (key.includes("one rajarhat")) return "one-rajarhat";
    if (key.includes("one prime")) return "one-prime-residential";
    if (key.includes("one victoria") && place.includes("kolkata")) return "one-victoria-new-town";
    if (key.includes("ruchi lifescapes") && place.includes("bhopal")) return "lifescapes-bhopal";
    if (key.includes("ruchi lifescapes") && place.includes("indore")) return "ruchi-lifescapes-indore-project";
    if (key.includes("anand vihar") && place.includes("indore")) return "anand-vihar-indore";
    if (key.includes("saatvik green") && place.includes("indore")) return "saatvikgreen-indore";
    if (key.includes("saatvik vihar") && place.includes("indore")) return "saatvik-vihar-indore";
    if (key.includes("ruchi enclave") && place.includes("indore")) return "ruchi-enclave-indore";
    if (key.includes("oscar sanctuary") && place.includes("indore")) return "oscar-sanctuary-indore";
    if (key.includes("oscar fort") && place.includes("indore")) return "oscar-fort-indore";
    if (key.includes("oscar pride") && place.includes("indore")) return "oscar-pride-indore";
    if (key.includes("oscar palace") && place.includes("indore")) return "oscar-palace";
    return slugify(`${title}-${location}`);
  };

  const projectRouteForTitle = (title = "", location = "") => {
    const key = title.toLowerCase().trim();
    const place = location.toLowerCase().trim();
    if (key.includes("one victoria") && place.includes("kolkata")) return "/projects/one-victoria-new-town";
    if (key.includes("oscar") && key.includes("billion")) return "/projects/oscar-indore";
    if (key.includes("active greens") || key.includes("active green")) return "/projects/active-greens";
    if (key.includes("one rajarhat")) return "/projects/one-rajarhat";
    if (key.includes("one prime")) return "/projects/one-prime-residential";
    if (key.includes("active business park")) return "/projects/active-business-park";
    if (key.includes("ruchi lifescapes") && place.includes("bhopal")) return "/projects/lifescapes-bhopal";
    if (key.includes("ruchi lifescapes") && place.includes("indore")) return "/projects/ruchi-lifescapes-indore-project";
    if (key.includes("anand vihar") && place.includes("indore")) return "/projects/anand-vihar-indore";
    if (key.includes("saatvik green") && place.includes("indore")) return "/projects/saatvikgreen-indore";
    if (key.includes("saatvik vihar") && place.includes("indore")) return "/projects/saatvik-vihar-indore";
    if (key.includes("ruchi enclave") && place.includes("indore")) return "/projects/ruchi-enclave-indore";
    if (key.includes("oscar sanctuary") && place.includes("indore")) return "/projects/oscar-sanctuary-indore";
    if (key.includes("oscar fort") && place.includes("indore")) return "/projects/oscar-fort-indore";
    if (key.includes("oscar pride") && place.includes("indore")) return "/projects/oscar-pride-indore";
    if (key.includes("oscar palace") && place.includes("indore")) return "/projects/oscar-palace";
    if (key.includes("active acres") || key.includes("angelica")) return "/projects/active-acres-angelica";
    return "";
  };

  const normalizeProjectType = (type) => String(type || "").toLowerCase() === "commercial" ? "Commercial" : "Residential";

  const normalizeProject = (project = {}) => {
    const title = project.title || project.name || "Untitled Project";
    const location = project.location || project.city || "";
    const slug = project.slug || projectSlugForTitle(title, location);
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
      type: normalizeProjectType(project.type),
      status: project.status || "Ongoing",
      featured: Boolean(project.featured),
      sort_order: toOrder(project.sort_order),
      feature_order: toOrder(project.feature_order),
      slug,
      url: project.url || projectRouteForTitle(title, location) || `/projects/${slug}`,
    };
  };

  const projectPayload = (project = {}) => ({
    title: project.title || project.name,
    tag: project.tag || project.status || "Project",
    image_url: project.image_url || project.img || "",
    location: project.location || project.city || "",
    description: project.description || null,
    type: normalizeProjectType(project.type),
    status: project.status || null,
    featured: Boolean(project.featured),
    sort_order: toOrder(project.sort_order),
    feature_order: toOrder(project.feature_order),
  });

  const sortProjects = (items) =>
    [...items].sort((a, b) => {
      const ao = a.sort_order ?? 9999;
      const bo = b.sort_order ?? 9999;
      if (ao !== bo) return ao - bo;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  const seedProjects = Array.isArray(window.PROJECTS) ? window.PROJECTS.map(normalizeProject) : [];
  const getSeedProjects = () => seedProjects.map((project) => ({ ...project }));

  const mergePublicProjects = (dbProjects = []) => {
    const bySlug = new Map(getSeedProjects().map((item) => [item.slug, item]));
    dbProjects.map(normalizeProject).forEach((item) => {
      const seed = bySlug.get(item.slug) || {};
      const image = item.image_url || item.img || seed.image_url || seed.img || "";
      bySlug.set(item.slug, {
        ...seed,
        ...item,
        image_url: image,
        img: image,
        url: item.url || seed.url || `/projects/${item.slug}`,
      });
    });
    return sortProjects([...bySlug.values()]);
  };

  const syncPublicProjects = async () => {
    if (!Array.isArray(window.PROJECTS)) return [];
    const { data, error } = await projectService.getPublicProjects();
    if (!error && Array.isArray(data)) {
      window.PROJECTS.splice(0, window.PROJECTS.length, ...data);
    }
    return window.PROJECTS;
  };

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

  const normalizeSettings = (settings = {}) => ({
    siteName: settings.site_name || settings.siteName || defaultSettings.siteName,
    phone: settings.phone || defaultSettings.phone,
    whatsapp: settings.whatsapp || defaultSettings.whatsapp,
    email: settings.email || defaultSettings.email,
    address: settings.address || defaultSettings.address,
    workingHours: settings.working_hours || settings.workingHours || defaultSettings.workingHours,
    mapEmbedUrl: settings.map_embed_url || settings.mapEmbedUrl || mapsEmbed(settings.address || defaultSettings.address),
    mapLink: settings.map_link || settings.mapLink || mapsLink(settings.address || defaultSettings.address),
    facebook: settings.facebook || "",
    instagram: settings.instagram || "",
    youtube: settings.youtube || "",
    linkedin: settings.linkedin || "",
  });

  const settingsPayload = (settings = {}) => ({
    id: 1,
    site_name: settings.siteName || null,
    phone: settings.phone || null,
    whatsapp: settings.whatsapp || null,
    email: settings.email || null,
    address: settings.address || null,
    working_hours: settings.workingHours || null,
    map_embed_url: settings.mapEmbedUrl || null,
    map_link: settings.mapLink || null,
    facebook: settings.facebook || null,
    instagram: settings.instagram || null,
    youtube: settings.youtube || null,
    linkedin: settings.linkedin || null,
  });

  const normalizeBlog = (blog = {}) => ({
    ...blog,
    cat: blog.category || blog.cat || "News",
    img: blog.image || blog.img || "",
    date: blog.published_at ? new Date(blog.published_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    image_alt: blog.image_alt || blog.title || "Ruchi Realty blog image",
    status: blog.status || "published",
    reading_time_minutes: blog.reading_time_minutes || Math.max(1, Math.ceil(String(blog.content || "").split(/\s+/).filter(Boolean).length / 200)),
  });

  const blogPayload = (blog = {}) => ({
    title: blog.title,
    slug: blog.slug || slugify(blog.title),
    excerpt: blog.excerpt,
    content: blog.content,
    author: blog.author || "Admin",
    image: blog.image || blog.img || "",
    tags: Array.isArray(blog.tags) ? blog.tags : String(blog.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    category: blog.category || "News",
    featured: Boolean(blog.featured),
    published_at: blog.published_at || new Date().toISOString(),
    image_alt: blog.image_alt || blog.title,
    status: blog.status || "published",
    seo_title: blog.seo_title || null,
    seo_description: blog.seo_description || null,
    canonical_url: blog.canonical_url || null,
    og_title: blog.og_title || null,
    og_description: blog.og_description || null,
    og_image_url: blog.og_image_url || blog.image || null,
    reading_time_minutes: Number(blog.reading_time_minutes) || null,
    old_url: blog.old_url || null,
    related_project_links: Array.isArray(blog.related_project_links) ? blog.related_project_links : [],
  });

  const projectService = {
    async getAllProjects() {
      const result = await rest("projects", { select: "*", order: "sort_order.asc.nullslast,created_at.desc" }, { auth: true });
      return result.error ? result : { data: (result.data || []).map(normalizeProject), error: null };
    },
    async getPublicProjects() {
      const result = await rest("projects", { select: "*", order: "sort_order.asc.nullslast,created_at.desc" });
      if (result.error) return { data: getSeedProjects(), error: result.error };
      return { data: mergePublicProjects(result.data || []), error: null };
    },
    async getProjectBySlug(slug) {
      const { data } = await this.getPublicProjects();
      const project = (data || []).find((item) => item.slug === slug);
      return { data: project || null, error: project ? null : new Error("Project not found") };
    },
    async createProject(projectData) {
      const result = await rest("projects", { select: "*" }, {
        method: "POST",
        auth: true,
        headers: { Prefer: "return=representation" },
        json: projectPayload(projectData),
      });
      return result.error ? result : { data: normalizeProject(result.data?.[0]), error: null };
    },
    async updateProject(id, projectData) {
      const result = await rest("projects", { id: `eq.${id}`, select: "*" }, {
        method: "PATCH",
        auth: true,
        headers: { Prefer: "return=representation" },
        json: projectPayload(projectData),
      });
      return result.error ? result : { data: normalizeProject(result.data?.[0]), error: null };
    },
    async deleteProject(id) {
      return rest("projects", { id: `eq.${id}` }, { method: "DELETE", auth: true });
    },
  };

  const leadService = {
    async submitLead(leadData) {
      return rest("leads", { select: "*" }, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        json: {
          name: (leadData.name || "").trim(),
          email: (leadData.email || "").trim(),
          phone: (leadData.phone || "").trim(),
          interest: leadData.interest || leadData.project || "General",
          source: leadData.source || "Website",
          project_slug: leadData.project_slug || null,
          status: "new",
          notes: leadData.notes || leadData.message || null,
        },
      });
    },
    async getAllLeads() {
      return rest("leads", { select: "*", order: "created_at.desc" }, { auth: true });
    },
    async updateLeadStatus(id, status) {
      return rest("leads", { id: `eq.${id}`, select: "*" }, {
        method: "PATCH",
        auth: true,
        headers: { Prefer: "return=representation" },
        json: { status },
      });
    },
    async deleteLead(id) {
      return rest("leads", { id: `eq.${id}` }, { method: "DELETE", auth: true });
    },
    async getCareerLeads() {
      const result = await rest("leads", { select: "*", interest: "like.Careers:%", order: "created_at.desc" }, { auth: true });
      return result.error ? result : { data: result.data || [], error: null };
    },
    async downloadCSV(leads) {
      const rows = Array.isArray(leads) ? leads : [];
      const headers = ["Name", "Email", "Phone", "Interest", "Source", "Status", "Notes", "Submitted At"];
      const csv = [
        headers.join(","),
        ...rows.map((lead) => [
          `"${(lead.name || "").replace(/"/g, '""')}"`,
          `"${(lead.email || "").replace(/"/g, '""')}"`,
          `"${(lead.phone || "").replace(/"/g, '""')}"`,
          `"${(lead.interest || "").replace(/"/g, '""')}"`,
          `"${(lead.source || "").replace(/"/g, '""')}"`,
          `"${(lead.status || "").replace(/"/g, '""')}"`,
          `"${(lead.notes || "").replace(/"/g, '""')}"`,
          `"${lead.created_at ? new Date(lead.created_at).toLocaleString() : ""}"`,
        ].join(",")),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `career-applications-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  };

  const settingsService = {
    async getSettings() {
      const result = await rest("site_settings", { select: "*", id: "eq.1", limit: "1" });
      if (result.error || !result.data?.[0]) return { data: defaultSettings, error: result.error };
      return { data: normalizeSettings(result.data[0]), error: null };
    },
    async updateSettings(settings) {
      const result = await rest("site_settings", { on_conflict: "id", select: "*" }, {
        method: "POST",
        auth: true,
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        json: settingsPayload(settings),
      });
      return result.error ? result : { data: normalizeSettings(result.data?.[0]), error: null };
    },
  };

  const normalizeCareerJob = (job = {}) => {
    const dropdown_val = job.dropdown_val || `${job.title || ""} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ${job.dept || ""}`;
    return {
      id: job.id || uid(),
      slug: job.slug || "",
      title: job.title || "",
      dept: job.dept || "",
      type: job.type || "Full-time",
      desc: job.desc || "",
      dropdownVal: dropdown_val,
      dropdown_val,
      overview: job.overview || "",
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      is_active: job.is_active !== false,
      sort_order: toOrder(job.sort_order) ?? 0,
      created_at: job.created_at || new Date().toISOString(),
      updated_at: job.updated_at || "",
    };
  };

  const careerJobPayload = (job = {}) => ({
    slug: job.slug || slugify(job.title),
    title: job.title,
    dept: job.dept,
    type: job.type || "Full-time",
    desc: job.desc,
    dropdown_val: job.dropdown_val || `${job.title} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ${job.dept}`,
    overview: job.overview || "",
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    is_active: job.is_active !== false,
    sort_order: toOrder(job.sort_order) ?? 0,
  });

  const uploadResume = async (file) => {
    if (!file) throw new Error("No file selected.");
    const maxSize = 30 * 1024;
    if (file.size > maxSize) throw new Error("Resume must be 30 KB or smaller.");
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) throw new Error("Only .pdf, .doc, and .docx files are accepted.");
    const safeName = file.name.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const path = `careers/${new Date().toISOString().slice(0, 10)}/${uid()}-${safeName}${ext}`;
    const result = await request(`/storage/v1/object/resumes/${path}`, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
      body: file,
    });
    if (result.error) throw result.error;
    return { url: `${CONFIG.supabaseUrl}/storage/v1/object/public/resumes/${path}`, name: file.name };
  };

  const careerApplicationsService = {
    async submit(data) {
      return rest("career_applications", {}, {
        method: "POST",
        json: {
          job_slug: data.job_slug || "",
          job_title: data.job_title || "",
          full_name: (data.full_name || "").trim(),
          email: (data.email || "").trim(),
          phone: (data.phone || "").trim(),
          city: (data.city || "").trim(),
          candidate_profile: data.candidate_profile || "",
          message: data.message || "",
          resume_url: data.resume_url || "",
          resume_name: data.resume_name || "",
          status: "new",
        },
      });
    },
    async getAll() {
      const result = await rest("career_applications", { select: "*", order: "created_at.desc" }, { auth: true });
      return result.error ? result : { data: result.data || [], error: null };
    },
    async updateStatus(id, status) {
      return rest("career_applications", { id: `eq.${id}`, select: "*" }, {
        method: "PATCH",
        auth: true,
        headers: { Prefer: "return=representation" },
        json: { status },
      });
    },
    async remove(id) {
      return rest("career_applications", { id: `eq.${id}` }, { method: "DELETE", auth: true });
    },
    downloadCSV(applications) {
      const rows = Array.isArray(applications) ? applications : [];
      const headers = ["Full Name", "Email", "Phone", "Job Title", "City", "Candidate Profile", "Message", "Resume URL", "Status", "Submitted At"];
      const csv = [
        headers.join(","),
        ...rows.map((app) => [
          `"${(app.full_name || "").replace(/"/g, '""')}"`,
          `"${(app.email || "").replace(/"/g, '""')}"`,
          `"${(app.phone || "").replace(/"/g, '""')}"`,
          `"${(app.job_title || "").replace(/"/g, '""')}"`,
          `"${(app.city || "").replace(/"/g, '""')}"`,
          `"${(app.candidate_profile || "").replace(/"/g, '""')}"`,
          `"${(app.message || "").replace(/"/g, '""')}"`,
          `"${(app.resume_url || "").replace(/"/g, '""')}"`,
          `"${(app.status || "").replace(/"/g, '""')}"`,
          `"${app.created_at ? new Date(app.created_at).toLocaleString() : ""}"`,
        ].join(",")),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `career-applications-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  };

  const careerService = {
    async getAll() {
      const result = await rest("career_jobs", { select: "*", order: "sort_order.asc.nullslast,created_at.desc" });
      return result.error ? result : { data: (result.data || []).map(normalizeCareerJob), error: null };
    },
    async getActive() {
      const result = await rest("career_jobs", { select: "*", is_active: "eq.true", order: "sort_order.asc.nullslast,created_at.desc" });
      return result.error ? { data: [], error: null } : { data: (result.data || []).map(normalizeCareerJob), error: null };
    },
    async create(data) {
      const result = await rest("career_jobs", { select: "*" }, {
        method: "POST",
        auth: true,
        headers: { Prefer: "return=representation" },
        json: careerJobPayload(data),
      });
      return result.error ? result : { data: normalizeCareerJob(result.data?.[0]), error: null };
    },
    async update(id, data) {
      const result = await rest("career_jobs", { id: `eq.${id}`, select: "*" }, {
        method: "PATCH",
        auth: true,
        headers: { Prefer: "return=representation" },
        json: careerJobPayload(data),
      });
      return result.error ? result : { data: normalizeCareerJob(result.data?.[0]), error: null };
    },
    async remove(id) {
      return rest("career_jobs", { id: `eq.${id}` }, { method: "DELETE", auth: true });
    },
  };

  const blogService = {
    async getAllBlogs() {
      const result = await rest("blogs", { select: "*", order: "published_at.desc" }, { auth: true });
      return result.error ? result : { data: (result.data || []).map(normalizeBlog), error: null };
    },
    async getPublicBlogs() {
      const result = await rest("blogs", { select: "*", status: "eq.published", order: "published_at.desc" });
      return result.error ? { data: [], error: result.error } : { data: (result.data || []).map(normalizeBlog), error: null };
    },
    async getBlogBySlug(slug) {
      const result = await rest("blogs", { select: "*", slug: `eq.${slug}`, status: "eq.published", limit: "1" });
      return result.error ? result : { data: result.data?.[0] ? normalizeBlog(result.data[0]) : null, error: null };
    },
    async createBlog(blogData) {
      const result = await rest("blogs", { select: "*" }, {
        method: "POST",
        auth: true,
        headers: { Prefer: "return=representation" },
        json: blogPayload(blogData),
      });
      return result.error ? result : { data: normalizeBlog(result.data?.[0]), error: null };
    },
    async updateBlog(id, blogData) {
      const result = await rest("blogs", { id: `eq.${id}`, select: "*" }, {
        method: "PATCH",
        auth: true,
        headers: { Prefer: "return=representation" },
        json: blogPayload(blogData),
      });
      return result.error ? result : { data: normalizeBlog(result.data?.[0]), error: null };
    },
    async deleteBlog(id) {
      return rest("blogs", { id: `eq.${id}` }, { method: "DELETE", auth: true });
    },
    async getApprovedComments(blogId) {
      const result = await rest("blog_comments", { select: "id,name,comment,created_at", blog_id: `eq.${blogId}`, status: "eq.approved", order: "created_at.desc" });
      return result.error ? result : { data: result.data || [], error: null };
    },
    async createComment(blogId, data) {
      return rest("blog_comments", { select: "id" }, { method: "POST", headers: { Prefer: "return=minimal" }, json: { blog_id: blogId, name: String(data.name || "").trim().slice(0, 80), email: String(data.email || "").trim().toLowerCase().slice(0, 160), comment: String(data.comment || "").trim().slice(0, 3000), status: "pending" } });
    },
    async getAllComments() {
      return rest("blog_comments", { select: "*,blogs(title,slug)", order: "created_at.desc" }, { auth: true });
    },
    async updateCommentStatus(id, status) {
      return rest("blog_comments", { id: `eq.${id}`, select: "*" }, { method: "PATCH", auth: true, headers: { Prefer: "return=representation" }, json: { status } });
    },
    async deleteComment(id) {
      return rest("blog_comments", { id: `eq.${id}` }, { method: "DELETE", auth: true });
    },
  };

  const mediaService = {
    async getGallery() { return rest("media_gallery_items", { select: "*,media_assets!image_asset_id(*)", status: "eq.published", order: "display_order.asc,created_at.desc" }); },
    async getAllGallery() { return rest("media_gallery_items", { select: "*,media_assets!image_asset_id(*)", order: "display_order.asc,created_at.desc" }, { auth: true }); },
    async getPress() { return rest("media_press_releases", { select: "*,media_assets!cover_asset_id(*)", status: "eq.published", order: "is_featured.desc,release_date.desc,display_order.asc" }); },
    async getAllPress() { return rest("media_press_releases", { select: "*,media_assets!cover_asset_id(*)", order: "release_date.desc,display_order.asc" }, { auth: true }); },
    async getPressBySlug(slug) { const result=await rest("media_press_releases", { select: "*,media_assets!cover_asset_id(*)", slug:`eq.${slug}`, status:"eq.published", limit:"1" }); return result.error?result:{data:result.data?.[0]||null,error:null}; },
    async getEvents() { return rest("media_events_awards", { select: "*,media_assets!cover_asset_id(*)", status:"eq.published", order:"is_featured.desc,display_order.asc,event_date.desc" }); },
    async getAllEvents() { return rest("media_events_awards", { select: "*,media_assets!cover_asset_id(*)", order:"display_order.asc,event_date.desc" }, { auth:true }); },
    async createAsset(url, usageType="gallery", meta={}) { const hash=meta.hash||await crypto.subtle.digest("SHA-256",new TextEncoder().encode(url)).then(b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")); const result=await rest("media_assets",{on_conflict:"hash",select:"*"},{method:"POST",auth:true,headers:{Prefer:"resolution=merge-duplicates,return=representation"},json:{original_filename:meta.original_filename||url.split("/").pop(),file_path:url,public_url:url,thumbnail_url:url,mime_type:"image/webp",file_size:meta.file_size||null,width:meta.width||null,height:meta.height||null,hash,usage_type:usageType}}); return result.error?result:{data:result.data?.[0],error:null}; },
    async saveGallery(data,id) { const method=id?"PATCH":"POST", params=id?{id:`eq.${id}`,select:"*"}:{select:"*"}; return rest("media_gallery_items",params,{method,auth:true,headers:{Prefer:"return=representation"},json:data}); },
    async deleteGallery(id){return rest("media_gallery_items",{id:`eq.${id}`},{method:"DELETE",auth:true});},
    async savePress(data,id){return rest("media_press_releases",id?{id:`eq.${id}`,select:"*"}:{select:"*"},{method:id?"PATCH":"POST",auth:true,headers:{Prefer:"return=representation"},json:data});},
    async deletePress(id){return rest("media_press_releases",{id:`eq.${id}`},{method:"DELETE",auth:true});},
    async saveEvent(data,id){return rest("media_events_awards",id?{id:`eq.${id}`,select:"*"}:{select:"*"},{method:id?"PATCH":"POST",auth:true,headers:{Prefer:"return=representation"},json:data});},
    async deleteEvent(id){return rest("media_events_awards",{id:`eq.${id}`},{method:"DELETE",auth:true});},
  };

  /* ------------------------------------------------------------
     Project Subpages (table: project_subpages)
     ------------------------------------------------------------ */
  const normalizeSubpage = (sp = {}) => ({
    id: sp.id || uid(),
    project_id: sp.project_id || "",
    created_at: sp.created_at || new Date().toISOString(),
    updated_at: sp.updated_at || "",
    heroTitle: sp.hero_title || "",
    heroTagline: sp.hero_tagline || "",
    heroLogo: sp.hero_logo || "",
    heroBg: sp.hero_bg || "",
    heroMobileUrl: sp.hero_mobile_url || "",
    heroImagePosition: sp.hero_image_position || "center center",
    heroImageFit: sp.hero_image_fit || "cover",
    overviewParagraphs: Array.isArray(sp.overview_paragraphs) ? sp.overview_paragraphs : [],
    overviewHighlights: Array.isArray(sp.overview_highlights) ? sp.overview_highlights : [],
    amenities: Array.isArray(sp.amenities) ? sp.amenities : [],
    specifications: Array.isArray(sp.specifications) ? sp.specifications : [],
    specificationImage: sp.specification_image || "",
    floorPlans: Array.isArray(sp.floor_plans) ? sp.floor_plans : [],
    locationImage: sp.location_image || "",
    locationMapEmbed: sp.location_map_embed || "",
    locationDestinations: Array.isArray(sp.location_destinations) ? sp.location_destinations : [],
    walkthroughVideoId: sp.walkthrough_video_id || "",
    videos: Array.isArray(sp.videos) ? sp.videos : [],
    galleryImages: Array.isArray(sp.gallery_images) ? sp.gallery_images : [],
    constructionUpdates: Array.isArray(sp.construction_updates) ? sp.construction_updates : [],
    brochureUrl: sp.brochure_url || "",
    faqs: Array.isArray(sp.faqs) ? sp.faqs : [],
    relatedProjectSlugs: Array.isArray(sp.related_project_slugs) ? sp.related_project_slugs : [],
    ctaLabels: sp.cta_labels && typeof sp.cta_labels === "object" ? sp.cta_labels : {},
    ogImage: sp.og_image || "",
    metaTitle: sp.meta_title || "",
    metaDescription: sp.meta_description || "",
    isPublished: Boolean(sp.is_published),
  });

  const subpagePayload = (sp = {}) => ({
    project_id: sp.project_id,
    hero_title: sp.heroTitle || "",
    hero_tagline: sp.heroTagline || "",
    hero_logo: sp.heroLogo || "",
    hero_bg: sp.heroBg || "",
    hero_mobile_url: sp.heroMobileUrl || "",
    hero_image_position: sp.heroImagePosition || "center center",
    hero_image_fit: sp.heroImageFit || "cover",
    overview_paragraphs: Array.isArray(sp.overviewParagraphs) ? sp.overviewParagraphs : [],
    overview_highlights: Array.isArray(sp.overviewHighlights) ? sp.overviewHighlights : [],
    amenities: Array.isArray(sp.amenities) ? sp.amenities : [],
    specifications: Array.isArray(sp.specifications) ? sp.specifications : [],
    specification_image: sp.specificationImage || "",
    floor_plans: Array.isArray(sp.floorPlans) ? sp.floorPlans : [],
    location_image: sp.locationImage || "",
    location_map_embed: sp.locationMapEmbed || "",
    location_destinations: Array.isArray(sp.locationDestinations) ? sp.locationDestinations : [],
    walkthrough_video_id: sp.walkthroughVideoId || "",
    videos: Array.isArray(sp.videos) ? sp.videos : [],
    gallery_images: Array.isArray(sp.galleryImages) ? sp.galleryImages : [],
    construction_updates: Array.isArray(sp.constructionUpdates) ? sp.constructionUpdates : [],
    brochure_url: sp.brochureUrl || "",
    faqs: Array.isArray(sp.faqs) ? sp.faqs : [],
    related_project_slugs: Array.isArray(sp.relatedProjectSlugs) ? sp.relatedProjectSlugs : [],
    cta_labels: sp.ctaLabels && typeof sp.ctaLabels === "object" ? sp.ctaLabels : {},
    og_image: sp.ogImage || "",
    meta_title: sp.metaTitle || "",
    meta_description: sp.metaDescription || "",
    is_published: sp.isPublished ?? false,
  });

  const projectSubpagesService = {
    async getByProjectId(projectId, options = {}) {
      const result = await rest("project_subpages", {
        select: "*",
        project_id: `eq.${projectId}`,
        limit: "1",
      }, options);
      return result.error ? result : { data: result.data?.[0] ? normalizeSubpage(result.data[0]) : null, error: null };
    },
    async upsert(subpage) {
      const payload = subpagePayload(subpage);
      const { project_id } = payload;
      const existing = await rest("project_subpages", {
        select: "id",
        project_id: `eq.${project_id}`,
        limit: "1",
      }, { auth: true });
      if (existing.data?.[0]) {
        const result = await rest("project_subpages", {
          project_id: `eq.${project_id}`,
          select: "*",
        }, {
          method: "PATCH",
          auth: true,
          headers: { Prefer: "return=representation" },
          json: payload,
        });
        return result.error ? result : { data: normalizeSubpage(result.data?.[0]), error: null };
      }
      const result = await rest("project_subpages", { select: "*" }, {
        method: "POST",
        auth: true,
        headers: { Prefer: "return=representation" },
        json: { ...payload, id: uid() },
      });
      return result.error ? result : { data: normalizeSubpage(result.data?.[0]), error: null };
    },
    async delete(projectId) {
      return rest("project_subpages", { project_id: `eq.${projectId}` }, { method: "DELETE", auth: true });
    },
  };

  const adminFromSession = (session) => session?.user?.id
    ? { email: session.user?.email, id: session.user.id, role: "admin" }
    : null;

  const assertAdminSession = async (session) => {
    if (!session?.access_token || !session?.user?.id) {
      return { data: null, error: new Error("No active Supabase session.") };
    }

    const profile = await rest("profiles", {
      select: "id,role,email",
      id: `eq.${session.user.id}`,
      limit: "1",
    }, { token: session.access_token });

    if (profile.error) return profile;
    const row = profile.data?.[0];
    if (!row || row.role !== "admin") {
      return { data: null, error: new Error("This Supabase user is signed in, but it does not have an admin profile. Add a public.profiles row with role = 'admin'.") };
    }

    return { data: { email: session.user?.email || row.email, id: session.user.id, role: row.role }, error: null };
  };

  const auth = {
    currentUser() {
      return adminFromSession(readSession());
    },
    async verifyCurrentUser() {
      const session = readSession();
      if (!session) return { data: null, error: null };
      const result = await assertAdminSession(session);
      if (result.error) localStorage.removeItem(SESSION_KEY);
      return result;
    },
    async login(email, password) {
      const cleanEmail = String(email || "").trim();
      const result = await request("/auth/v1/token?grant_type=password", {
        method: "POST",
        json: { email: cleanEmail, password },
      });
      if (result.error) return result;

      const session = saveSession(result.data);
      const admin = await assertAdminSession(session);
      if (admin.error) {
        localStorage.removeItem(SESSION_KEY);
        return admin;
      }
      return admin;
    },
    async logout() {
      const session = readSession();
      if (session?.access_token) {
        await request("/auth/v1/logout", { method: "POST", token: session.access_token });
      }
      localStorage.removeItem(SESSION_KEY);
      return { error: null };
    },
  };


  const storageObjectFromPublicUrl = (url = "") => {
    const text = String(url || "").trim();
    const prefix = `${CONFIG.supabaseUrl}/storage/v1/object/public/`;
    if (!text.startsWith(prefix)) return null;
    const restPath = text.slice(prefix.length);
    const slash = restPath.indexOf("/");
    if (slash <= 0) return null;
    return {
      bucket: restPath.slice(0, slash),
      path: decodeURIComponent(restPath.slice(slash + 1)),
    };
  };

  const deleteImage = async (url) => {
    const object = storageObjectFromPublicUrl(url);
    if (!object) return { data: null, error: null };
    return request(`/storage/v1/object/${object.bucket}/${encodeURI(object.path)}`, {
      method: "DELETE",
      auth: true,
    });
  };
  const uploadImage = async (file, bucket = "project-images") => {
    if (!readSession()?.access_token) return Promise.reject(new Error("Please sign in again before uploading images."));
    if (!file) return Promise.reject(new Error("Please choose an image file."));
    const maxImageSize = 200 * 1024;
    const isWebp = file.type === "image/webp" && file.name.toLowerCase().endsWith(".webp");
    if (!isWebp) return Promise.reject(new Error("Only .webp images are allowed."));
    if (file.size > maxImageSize) return Promise.reject(new Error("Image must be 200 KB or smaller."));
    const ext = "webp";
    const safeName = file.name.toLowerCase().replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const path = `${new Date().toISOString().slice(0, 10)}/${uid()}-${safeName || "image"}.${ext}`;
    const result = await request(`/storage/v1/object/${bucket}/${path}`, {
      method: "POST",
      auth: true,
      headers: {
        "Content-Type": "image/webp",
        "x-upsert": "false",
      },
      body: file,
    });
    if (result.error) {
      const message = result.error.message || "Image upload failed.";
      if (/Could not connect|Failed to fetch/i.test(message)) throw new Error("Upload could not reach Supabase Storage. Check internet connection, CORS/ad-blocking, and that the Supabase project is active.");
      if (/row-level security|permission|unauthorized|403/i.test(message)) throw new Error("Supabase blocked this upload. Confirm your user has public.profiles.role = admin and storage.objects upload policies are installed.");
      if (/bucket|not found/i.test(message)) throw new Error(`Supabase storage bucket '${bucket}' is missing. Run the storage setup SQL first.`);
      throw result.error;
    }
    return `${CONFIG.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
  };

  window.RuchiBackend = {
    config: CONFIG,
    mode: CONFIG.mode,
    auth,
    projects: projectService,
    leads: leadService,
    settings: settingsService,
    blogs: blogService,
    media: mediaService,
    careers: careerService,
    careerApplications: careerApplicationsService,
    projectSubpages: projectSubpagesService,
    syncPublicProjects,
    uploadImage,
    deleteImage,
    uploadResume,
  };

  syncPublicProjects();
})();
