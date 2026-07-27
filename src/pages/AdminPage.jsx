import { useState, useEffect, useMemo } from "react";
import MediaAdmin from "../components/admin/MediaAdmin";

const toJSON = (value) => {
  try { return JSON.stringify(value, null, 2); } catch { return ""; }
};
const fromJSON = (value) => {
  try { return JSON.parse(value); } catch { return []; }
};

function extractSpecsAndCustomData(specifications) {
  const specs = [];
  let gmbReviews = null;
  let videoSection = null;
  let heroMobileUrl = "";
  let companyLogoUrl = "";
  let gmbGoogleIconUrl = "";
  let gmbStarIconUrl = "";
  let locationMapUrl = "";
  let floorPlans = [];

  (specifications || []).forEach((s) => {
    if (s.title === "__gmb_reviews__") {
      try { gmbReviews = JSON.parse(s.desc); } catch (e) {}
    } else if (s.title === "__video_section__") {
      try { videoSection = JSON.parse(s.desc); } catch (e) {}
    } else if (s.title === "__hero_mobile_url__") {
      heroMobileUrl = s.desc;
    } else if (s.title === "__company_logo_url__") {
      companyLogoUrl = s.desc;
    } else if (s.title === "__gmb_google_icon_url__") {
      gmbGoogleIconUrl = s.desc;
    } else if (s.title === "__gmb_star_icon_url__") {
      gmbStarIconUrl = s.desc;
    } else if (s.title === "__location_map_url__") {
      locationMapUrl = s.desc;
    } else if (s.title === "__floor_plans__") {
      try { floorPlans = JSON.parse(s.desc); } catch (e) {}
    } else {
      specs.push(s);
    }
  });

  return {
    specifications: specs,
    gmbReviews,
    videoSection,
    heroMobileUrl,
    companyLogoUrl,
    gmbGoogleIconUrl,
    gmbStarIconUrl,
    locationMapUrl,
    floorPlans,
  };
}

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
  heroMobileUrl: "",
  heroImagePosition: "center center",
  heroImageFit: "cover",
  companyLogoUrl: "",
  gmbGoogleIconUrl: "",
  gmbStarIconUrl: "",
  locationMapUrl: "",
  floorPlans: [],
  videoSection: { enabled: false, videoUrl: "", thumbnailUrl: "" },
  gmbReviews: { enabled: false, googleIconUrl: "", starIconUrl: "", reviews: [] },
  overviewParagraphs: [],
  overviewHighlights: [],
  amenities: [],
  specifications: [],
  specificationImage: "",
  locationImage: "",
  locationMapEmbed: "",
  locationDestinations: [],
  walkthroughVideoId: "",
  galleryImages: [],
  brochureUrl: "",
  faqs: [],
  relatedProjectSlugs: [],
  ctaLabels: { brochure: "Download Brochure", visit: "Book a Visit" },
  ogImage: "",
  metaTitle: "",
  metaDescription: "",
  isPublished: true,
};

const emptyBlog = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  author: "Admin",
  image: "",
  category: "News",
  tags: "",
  featured: false,
  status: "draft",
  image_alt: "",
  published_at: "",
  seo_title: "",
  seo_description: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  reading_time_minutes: "",
  old_url: "",
  related_project_links: "",
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
const AMENITY_PRESETS = [
  { name: "Swimming Pool", icon: "pool" },
  { name: "Gymnasium", icon: "gym" },
  { name: "Open Gym", icon: "gym" },
  { name: "Clubhouse", icon: "hall" },
  { name: "Multi-purpose Hall", icon: "hall" },
  { name: "Library", icon: "library" },
  { name: "Table Tennis", icon: "table-tennis" },
  { name: "Badminton Court", icon: "badminton" },
  { name: "Tennis Court", icon: "tennis" },
  { name: "Yoga / Meditation Area", icon: "yoga" },
  { name: "Jogging Track", icon: "jogging" },
  { name: "Children Play Area", icon: "playground" },
  { name: "Landscaped Garden", icon: "landscape" },
  { name: "Car Parking", icon: "parking" },
  { name: "Security", icon: "security" },
  { name: "Power Backup", icon: "generator" },
];

const DEFAULT_OVERVIEW_HIGHLIGHT_ICONS = ["location", "amenities", "infrastructure", "size"];
const DEFAULT_OVERVIEW_HIGHLIGHTS = [
  { label: "Prime Location", desc: "Well-connected address with everyday conveniences close by." },
  { label: "Lifestyle Amenities", desc: "Thoughtfully planned spaces for daily comfort and community living." },
  { label: "Quality Infrastructure", desc: "Designed with dependable services, security, and long-term usability." },
  { label: "Flexible Spaces", desc: "Practical layouts planned for modern residential and investment needs." },
];

function withOverviewHighlightIcons(items = []) {
  const source = Array.isArray(items) && items.length ? items : DEFAULT_OVERVIEW_HIGHLIGHTS;
  return source.slice(0, 4).map((item, index) => ({
    label: item.label || DEFAULT_OVERVIEW_HIGHLIGHTS[index]?.label || "Project Highlight",
    desc: item.desc || DEFAULT_OVERVIEW_HIGHLIGHTS[index]?.desc || "Key project advantage.",
    icon: DEFAULT_OVERVIEW_HIGHLIGHT_ICONS[index] || "location",
  }));
}

function AdminField({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}


async function deleteUploadedAsset(url) {
  if (!url || !window.RuchiBackend?.deleteImage) return;
  const { error } = await window.RuchiBackend.deleteImage(url);
  if (error) console.warn("Could not delete uploaded asset", error);
}

function collectProjectAssetUrls(project = {}, subpage = null) {
  const urls = [project.image_url, project.img];
  if (!subpage) return urls.filter(Boolean);
  urls.push(subpage.heroLogo, subpage.heroBg, subpage.locationImage, subpage.brochureUrl);
  (subpage.galleryImages || []).forEach((item) => urls.push(item.src));
  (subpage.specifications || []).forEach((item) => {
    if (item.title === "__floor_plans__") {
      try { JSON.parse(item.desc || "[]").forEach((plan) => urls.push(plan.desc)); } catch {}
    }
    if (item.title === "__video_section__") {
      try {
        const video = JSON.parse(item.desc || "{}");
        urls.push(video.thumbnailUrl);
      } catch {}
    }
  });
  return [...new Set(urls.filter(Boolean))];
}
function compressAndConvertToWebP(file, maxKb = 100) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDimension = 1600;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        const attempt = () => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            if (blob.size <= maxKb * 1024 || quality <= 0.1) {
              resolve(blob);
            } else {
              quality -= 0.08;
              attempt();
            }
          }, "image/webp", quality);
        };
        attempt();
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function uploadErrorMessage(error, label = "image") {
  const text = String(error?.message || error || "");
  if (/failed to fetch/i.test(text)) {
    return "Upload could not reach Supabase Storage. Check your internet connection, make sure the storage bucket exists, and confirm this admin user has storage upload permission.";
  }
  if (/row-level security|violates row-level security|403|Unauthorized|permission/i.test(text)) {
    return "Upload was blocked by Supabase permissions. Confirm the logged-in user has public.profiles.role = admin and the storage policy allows admin uploads.";
  }
  if (/bucket|not found/i.test(text)) {
    return "Storage bucket is missing. Create the project-images and blog-images buckets from the setup SQL, then try again.";
  }
  return text || `Could not upload ${label}.`;
}

function uploadGuidance(label = "") {
  const key = label.toLowerCase();
  if (key.includes("logo")) return "Upload only the project/logo mark here. Do not upload a landscape, building, or brochure image in this field.";
  if (key.includes("background") || key.includes("project image")) return "Upload a landscape/project visual here. Do not upload the logo in this field.";
  if (key.includes("location")) return "Upload a map or location image here.";
  if (key.includes("blog")) return "Upload the blog cover image here.";
  return "Upload the matching image for this field.";
}

function AdminImageUpload({ label, value, onChange }) {
  const [error, setError] = useState("");
  const [compressing, setCompressing] = useState(false);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      setError("");
      setCompressing(true);

      if (!file.type.startsWith("image/")) {
        throw new Error(`${label} must be an image file.`);
      }
      const webpBlob = await compressAndConvertToWebP(file, 100);
      const safeName = file.name.replace(/\.[^.]+$/, "") + ".webp";
      const webpFile = new File([webpBlob], safeName, { type: "image/webp" });

      const bucket = label.toLowerCase().includes("blog") ? "blog-images" : "project-images";
      const url = await window.RuchiBackend.uploadImage(webpFile, bucket);
      onChange(url);
    } catch (uploadError) {
      setError(uploadErrorMessage(uploadError, label));
    } finally {
      setCompressing(false);
    }
  };

  return (
    <div className="admin-uploader">
      <div className="admin-uploader__preview">
        {value ? <img src={value} alt="" /> : <span>No image selected</span>}
      </div>
      <div className="admin-uploader__body">
        <span className="admin-uploader__label">{label}</span>
        <p className="admin-note" style={{ margin: "0 0 8px" }}>{uploadGuidance(label)}</p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
          <label className="admin-upload-btn" style={{ opacity: compressing ? 0.6 : 1 }}>
            {compressing ? "Uploading..." : "Upload file"}
            <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/*" onChange={upload} disabled={compressing} style={{ display: "none" }} />
          </label>
          {value ? <button type="button" className="admin-text-btn" onClick={async () => { setError(""); await deleteUploadedAsset(value); onChange(""); }} disabled={compressing}>Remove</button> : null}
        </div>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste local path / URL (e.g. assets/projects/...)"
          style={{ width: "100%", padding: "6px 10px", fontSize: "12px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }}
          disabled={compressing}
        />
        {error ? <p className="admin-error">{error}</p> : null}
      </div>
    </div>
  );
}
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (!window.RuchiBackend?.auth?.login) {
      setError("Admin backend is not loaded. Refresh the page and try again.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const { data, error: loginError } = await window.RuchiBackend.auth.login(email, password);
      if (loginError) {
        setError(loginError.message || "Sign in failed. Please check the Supabase user and admin profile.");
        return;
      }
      onLogin(data);
    } catch (loginError) {
      setError(loginError.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <form className="admin-login__box" onSubmit={submit}>
        <img src="assets/logo-h.png" alt="Ruchi Realty" />
        <p className="admin-kicker">Secure admin login</p>
        <h1>Admin panel</h1>
        <AdminField label="Email">
          <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </AdminField>
        <AdminField label="Password">
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </AdminField>
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="admin-primary" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        <p className="admin-note">Use a Supabase Auth user that also has role admin in public.profiles.</p>
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
                  <span>{lead.interest} - {lead.status}</span>
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
                  <span>{app.job_title || "Career"} - {app.status}</span>
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

function KeyValueListEditor({ title, items, onChange, keyPlaceholder = "Label", valuePlaceholder = "Description", keyProp = "label", valueProp = "desc", thirdProp = "", thirdPlaceholder = "" }) {
  const list = Array.isArray(items) ? items : [];
  const updateRow = (index, prop, val) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [prop]: val };
    onChange(newList);
  };
  const addRow = () => {
    const newItem = { [keyProp]: "", [valueProp]: "" };
    if (thirdProp) {
      newItem[thirdProp] = "";
    }
    onChange([...list, newItem]);
  };
  const removeRow = (index) => {
    onChange(list.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-list-editor" style={{ marginBottom: "18px", padding: "12px", border: "1px solid rgba(35, 31, 32, 0.15)", borderRadius: "6px" }}>
      <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", opacity: 0.7 }}>{title}</h4>
      {list.map((item, index) => (
        <div key={index} style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
          <input
            type="text"
            value={item[keyProp] || ""}
            onChange={(e) => updateRow(index, keyProp, e.target.value)}
            placeholder={keyPlaceholder}
            style={{ flex: "1 1 120px", minWidth: "120px", padding: "6px 10px", fontSize: "13px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }}
          />
          <input
            type="text"
            value={item[valueProp] || ""}
            onChange={(e) => updateRow(index, valueProp, e.target.value)}
            placeholder={valuePlaceholder}
            style={{ flex: "2 1 180px", minWidth: "180px", padding: "6px 10px", fontSize: "13px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }}
          />
          {thirdProp && (
            <input
              type="text"
              value={item[thirdProp] || ""}
              onChange={(e) => updateRow(index, thirdProp, e.target.value)}
              placeholder={thirdPlaceholder}
              list={thirdProp === "icon" ? "highlight-icons" : undefined}
              style={{ flex: "1.5 1 140px", minWidth: "140px", padding: "6px 10px", fontSize: "13px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }}
            />
          )}
          <button
            type="button"
            onClick={() => removeRow(index)}
            style={{
              background: "#ff4d4d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Remove
          </button>
        </div>
      ))}
      {thirdProp === "icon" && (
        <datalist id="highlight-icons">
          {["location", "home", "amenities", "security"].map((ico) => <option key={ico} value={ico} />)}
        </datalist>
      )}
      <button
        type="button"
        onClick={addRow}
        style={{
          background: "var(--rr-indigo)",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "6px 12px",
          cursor: "pointer",
          fontSize: "12px"
        }}
      >
        + Add Row
      </button>
    </div>
  );
}

function AmenitiesListEditor({ items, onChange }) {
  const list = Array.isArray(items) ? items : [];
  const updateRow = (index, prop, val) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [prop]: val };
    onChange(newList);
  };
  const addPreset = (presetName) => {
    const preset = AMENITY_PRESETS.find((item) => item.name === presetName);
    if (!preset) return;
    if (list.some((item) => item.name === preset.name)) return;
    onChange([...list, { ...preset }]);
  };
  const addCustom = () => onChange([...list, { name: "", icon: "other" }]);
  const removeRow = (index) => onChange(list.filter((_, i) => i !== index));
  const iconOptions = [...new Set([...AMENITY_PRESETS.map((item) => item.icon), "other"])]

  return (
    <div className="admin-list-editor" style={{ marginBottom: "18px", padding: "12px", border: "1px solid rgba(35, 31, 32, 0.15)", borderRadius: "6px" }}>
      <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", opacity: 0.7 }}>Amenities</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
        <select defaultValue="" onChange={(e) => { addPreset(e.target.value); e.target.value = ""; }} style={{ flex: "1 1 220px", minWidth: "220px", padding: "8px 10px", border: "1px solid rgba(35,31,32,.2)", borderRadius: "4px" }}>
          <option value="" disabled>Select amenity to add</option>
          {AMENITY_PRESETS.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
        <button type="button" className="admin-text-btn" onClick={addCustom}>Add custom amenity</button>
      </div>
      {list.map((item, index) => (
        <div key={index} style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
          <input type="text" value={item.name || ""} onChange={(e) => updateRow(index, "name", e.target.value)} placeholder="Amenity Name" style={{ flex: "2 1 180px", minWidth: "180px", padding: "6px 10px", fontSize: "13px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }} />
          <select value={item.icon || "other"} onChange={(e) => updateRow(index, "icon", e.target.value)} style={{ flex: "1.5 1 140px", minWidth: "140px", padding: "6px 10px", fontSize: "13px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }}>
            {iconOptions.map((ico) => <option key={ico} value={ico}>{ico}</option>)}
          </select>
          <button type="button" onClick={() => removeRow(index)} style={{ background: "#ff4d4d", color: "#fff", border: "none", borderRadius: "4px", padding: "6px 10px", cursor: "pointer", fontSize: "12px" }}>Remove</button>
        </div>
      ))}
      {!list.length ? <p className="admin-note">Choose amenities from the dropdown. The selected name and matching icon will be saved to the project subpage.</p> : null}
    </div>
  );
}
function FloorPlansEditor({ items, onChange }) {
  const list = Array.isArray(items) ? items : [];
  const updateRow = (index, prop, val) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [prop]: val };
    onChange(newList);
  };
  const addRow = () => onChange([...list, { title: "", desc: "", config: "" }]);
  const removeRow = async (index) => {
    await deleteUploadedAsset(list[index]?.desc);
    onChange(list.filter((_, i) => i !== index));
  };
  const handleUpload = async (index, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const webpBlob = await compressAndConvertToWebP(file, 140);
      const safeName = file.name.replace(/\.[^.]+$/, "") + ".webp";
      const webpFile = new File([webpBlob], safeName, { type: "image/webp" });
      const url = await window.RuchiBackend.uploadImage(webpFile, "project-images");
      updateRow(index, "desc", url);
    } catch (err) {
      alert(uploadErrorMessage(err, "floor plan image"));
    }
  };

  return (
    <div className="admin-list-editor" style={{ marginBottom: "18px", padding: "12px", border: "1px solid rgba(35, 31, 32, 0.15)", borderRadius: "6px" }}>
      <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", opacity: 0.7 }}>Floor Plans</h4>
      {list.map((item, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(35, 31, 32, 0.2)", borderRadius: "4px", marginBottom: "10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            {item.desc ? <img src={item.desc} alt="" style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "4px" }} /> : <div style={{ width: "56px", height: "56px", background: "#eee", borderRadius: "4px", display: "grid", placeItems: "center", fontSize: "10px", color: "#999" }}>No plan</div>}
            <input type="text" value={item.title || ""} onChange={(e) => updateRow(index, "title", e.target.value)} placeholder="Plan title (e.g. 10th Floor Plan)" style={{ flex: "1 1 180px", minWidth: "180px", padding: "6px 10px", fontSize: "12px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }} />
            <input type="text" value={item.config || ""} onChange={(e) => updateRow(index, "config", e.target.value)} placeholder="Config (e.g. 3 BHK)" style={{ flex: "0 1 140px", minWidth: "120px", padding: "6px 10px", fontSize: "12px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }} />
            <button type="button" onClick={() => removeRow(index)} style={{ background: "#ff4d4d", color: "#fff", border: "none", borderRadius: "4px", padding: "6px 10px", cursor: "pointer", fontSize: "12px" }}>Remove</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            <label className="admin-upload-btn" style={{ margin: 0, padding: "6px 12px", fontSize: "12px" }}>
              Upload plan image
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/*" onChange={(e) => handleUpload(index, e)} style={{ display: "none" }} />
            </label>
            <input type="text" value={item.desc || ""} onChange={(e) => updateRow(index, "desc", e.target.value)} placeholder="Or paste floor plan image URL / local path" style={{ flex: "1 1 260px", minWidth: "220px", padding: "6px 10px", fontSize: "12px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }} />
          </div>
        </div>
      ))}
      <button type="button" onClick={addRow} style={{ background: "var(--rr-indigo)", color: "#fff", border: "none", borderRadius: "4px", padding: "6px 12px", cursor: "pointer", fontSize: "12px" }}>+ Add Floor Plan</button>
    </div>
  );
}
function GalleryListEditor({ items, onChange }) {
  const list = Array.isArray(items) ? items : [];
  const updateRow = (index, prop, val) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [prop]: val };
    onChange(newList);
  };
  const addRow = () => {
    onChange([...list, { src: "", alt: "" }]);
  };
  const removeRow = async (index) => {
    await deleteUploadedAsset(list[index]?.src);
    onChange(list.filter((_, i) => i !== index));
  };
  const handleUpload = async (index, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (!file.type.startsWith("image/")) throw new Error("Gallery item must be an image file.");
      const webpBlob = await compressAndConvertToWebP(file, 140);
      const safeName = file.name.replace(/\.[^.]+$/, "") + ".webp";
      const webpFile = new File([webpBlob], safeName, { type: "image/webp" });
      const url = await window.RuchiBackend.uploadImage(webpFile, "project-images");
      updateRow(index, "src", url);
    } catch (err) {
      alert(uploadErrorMessage(err, "gallery image"));
    }
  };

  return (
    <div className="admin-list-editor" style={{ marginBottom: "18px", padding: "12px", border: "1px solid rgba(35, 31, 32, 0.15)", borderRadius: "6px" }}>
      <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", opacity: 0.7 }}>Gallery Images</h4>
      {list.map((item, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(35, 31, 32, 0.2)", borderRadius: "4px", marginBottom: "10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
            {item.src ? (
              <img src={item.src} alt="" style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
            ) : (
              <div style={{ width: "50px", height: "50px", background: "#eee", borderRadius: "4px", display: "grid", placeItems: "center", fontSize: "10px", color: "#999" }}>No Img</div>
            )}
            <div style={{ flex: 1, display: "flex", gap: "8px", alignItems: "center" }}>
              <label className="admin-upload-btn" style={{ margin: 0, padding: "6px 12px", fontSize: "12px" }}>
                Upload file
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/*" onChange={(e) => handleUpload(index, e)} style={{ display: "none" }} />
              </label>
              <input
                type="text"
                value={item.src || ""}
                onChange={(e) => updateRow(index, "src", e.target.value)}
                placeholder="Or paste local path / URL"
                style={{ flex: 1, padding: "6px 10px", fontSize: "12px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }}
              />
            </div>
            <button
              type="button"
              onClick={() => removeRow(index)}
              style={{
                background: "#ff4d4d",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              Remove
            </button>
          </div>
          <input
            type="text"
            value={item.alt || ""}
            onChange={(e) => updateRow(index, "alt", e.target.value)}
            placeholder="Alt description / Caption"
            style={{ padding: "6px 10px", fontSize: "12px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        style={{
          background: "var(--rr-indigo)",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "6px 12px",
          cursor: "pointer",
          fontSize: "12px"
        }}
      >
        + Add Gallery Image
      </button>
    </div>
  );
}

function ReviewsListEditor({ items, onChange }) {
  const list = Array.isArray(items) ? items : [];
  const updateRow = (index, prop, val) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [prop]: val };
    onChange(newList);
  };
  const addRow = () => {
    onChange([...list, { author: "", text: "", time: "Recent" }]);
  };
  const removeRow = (index) => {
    onChange(list.filter((_, i) => i !== index));
  };
  return (
    <div className="admin-list-editor" style={{ marginBottom: "18px", padding: "12px", border: "1px solid rgba(35, 31, 32, 0.15)", borderRadius: "6px" }}>
      <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", opacity: 0.7 }}>GMB Reviews List</h4>
      {list.map((item, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "10px", background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(35, 31, 32, 0.2)", borderRadius: "4px", marginBottom: "10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <input
              type="text"
              value={item.author || ""}
              onChange={(e) => updateRow(index, "author", e.target.value)}
              placeholder="Author Name"
              style={{ flex: "1 1 120px", minWidth: "120px", padding: "6px 10px", fontSize: "12px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }}
            />
            <input
              type="text"
              value={item.time || ""}
              onChange={(e) => updateRow(index, "time", e.target.value)}
              placeholder="Time (e.g., 2 weeks ago)"
              style={{ flex: "1 1 120px", minWidth: "120px", padding: "6px 10px", fontSize: "12px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }}
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              style={{ background: "#ff4d4d", color: "#fff", border: "none", borderRadius: "4px", padding: "6px 10px", cursor: "pointer", fontSize: "12px" }}
            >
              Remove
            </button>
          </div>
          <textarea
            value={item.text || ""}
            onChange={(e) => updateRow(index, "text", e.target.value)}
            placeholder="Review Text"
            rows={2}
            style={{ padding: "6px 10px", fontSize: "12px", border: "1px solid rgba(35, 31, 32, 0.2)", borderRadius: "4px" }}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        style={{ background: "var(--rr-indigo)", color: "#fff", border: "none", borderRadius: "4px", padding: "6px 12px", cursor: "pointer", fontSize: "12px" }}
      >
        + Add Review
      </button>
    </div>
  );
}

function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [overviewText, setOverviewText] = useState("");
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    const { data } = await window.RuchiBackend.projects.getAllProjects();
    setProjects(data || []);
  };

  useEffect(() => { load(); }, []);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  
  const edit = async (project) => {
    setEditingId(project.id);
    
    // Smooth scroll to the form container
    const formElement = document.querySelector(".admin-grid form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

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
    setOverviewText(sp?.overviewParagraphs?.join("\n\n") || "");
    const extracted = extractSpecsAndCustomData(sp?.specifications);
    setForm({
      ...base,
      heroTitle: sp?.heroTitle || "",
      heroTagline: sp?.heroTagline || "",
      heroLogo: sp?.heroLogo || "",
      heroBg: sp?.heroBg || "",
      overviewParagraphs: sp?.overviewParagraphs || [],
      overviewHighlights: withOverviewHighlightIcons(sp?.overviewHighlights),
      amenities: sp?.amenities || [],
      specifications: extracted.specifications || [],
      heroMobileUrl: extracted.heroMobileUrl || "",
      heroImagePosition: sp?.heroImagePosition || "center center",
      heroImageFit: sp?.heroImageFit || "cover",
      companyLogoUrl: extracted.companyLogoUrl || "",
      gmbGoogleIconUrl: extracted.gmbGoogleIconUrl || "",
      gmbStarIconUrl: extracted.gmbStarIconUrl || "",
      locationMapUrl: extracted.locationMapUrl || "",
      floorPlans: sp?.floorPlans?.length ? sp.floorPlans : extracted.floorPlans || [],
      videoSection: sp?.videos?.[0] || (extracted.videoSection?.videoUrl ? extracted.videoSection : { enabled: Boolean(sp?.walkthroughVideoId), videoUrl: sp?.walkthroughVideoId || "", thumbnailUrl: "" }),
      gmbReviews: extracted.gmbReviews || { enabled: false, googleIconUrl: "", starIconUrl: "", reviews: [] },
      locationImage: sp?.locationImage || "",
      locationMapEmbed: sp?.locationMapEmbed || "",
      locationDestinations: sp?.locationDestinations || [],
      walkthroughVideoId: extracted.videoSection?.videoUrl || sp?.walkthroughVideoId || "",
      galleryImages: sp?.galleryImages || [],
      brochureUrl: sp?.brochureUrl || "",
      specificationImage: sp?.specificationImage || "",
      faqs: sp?.faqs || [],
      relatedProjectSlugs: sp?.relatedProjectSlugs || [],
      ctaLabels: sp?.ctaLabels || { brochure: "Download Brochure", visit: "Book a Visit" },
      ogImage: sp?.ogImage || "",
      metaTitle: sp?.metaTitle || "",
      metaDescription: sp?.metaDescription || "",
      isPublished: sp?.isPublished ?? true,
    });
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyProject);
    setOverviewText("");
  };

  const save = async (event) => {
    event.preventDefault();
    setUpdating(true);
    try {
      const paragraphs = overviewText.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
      const vidUrl = (form.videoSection?.videoUrl || form.walkthroughVideoId || "").trim();
      const videoSectionPayload = {
        enabled: Boolean(vidUrl),
        title: form.videoSection?.title || "Construction Walkthrough",
        videoUrl: vidUrl,
        thumbnailUrl: form.videoSection?.thumbnailUrl || ""
      };
      const specsWithCustom = [
        ...(form.specifications || []),
        { title: "__hero_mobile_url__", desc: form.heroMobileUrl || "" },
        { title: "__company_logo_url__", desc: form.companyLogoUrl || "" },
        { title: "__gmb_google_icon_url__", desc: form.gmbGoogleIconUrl || "" },
        { title: "__gmb_star_icon_url__", desc: form.gmbStarIconUrl || "" },
        { title: "__location_map_url__", desc: "" },
        { title: "__floor_plans__", desc: JSON.stringify(form.floorPlans || []) },
        { title: "__video_section__", desc: JSON.stringify(videoSectionPayload) },
        { title: "__gmb_reviews__", desc: JSON.stringify(form.gmbReviews || { enabled: false, googleIconUrl: "", starIconUrl: "", reviews: [] }) },
      ];
      const subpagePayload = (projectId) => ({
        project_id: projectId,
        heroTitle: form.heroTitle || form.title,
        heroTagline: form.heroTagline || form.tag || form.description,
        heroLogo: form.heroLogo || form.companyLogoUrl || "assets/logo-h.png",
        heroBg: form.heroBg || form.image_url,
        heroMobileUrl: form.heroMobileUrl || "",
        heroImagePosition: form.heroImagePosition || "center center",
        heroImageFit: form.heroImageFit || "cover",
        overviewParagraphs: paragraphs.length ? paragraphs : [form.description].filter(Boolean),
        overviewHighlights: withOverviewHighlightIcons(form.overviewHighlights),
        amenities: form.amenities,
        specifications: specsWithCustom,
        specificationImage: form.specificationImage || "",
        floorPlans: form.floorPlans || [],
        locationImage: form.locationImage,
        locationMapEmbed: form.locationMapEmbed,
        locationDestinations: form.locationDestinations,
        walkthroughVideoId: vidUrl,
        videos: vidUrl ? [videoSectionPayload] : [],
        galleryImages: form.galleryImages,
        brochureUrl: form.brochureUrl || "",
        faqs: form.faqs || [],
        relatedProjectSlugs: form.relatedProjectSlugs || [],
        ctaLabels: form.ctaLabels || { brochure: "Download Brochure", visit: "Book a Visit" },
        ogImage: form.ogImage || form.heroBg || form.image_url || "",
        metaTitle: form.metaTitle || `${form.title} | Ruchi Realty`,
        metaDescription: form.metaDescription || form.description,
        isPublished: form.isPublished !== false,
      });
      if (editingId) {
        await window.RuchiBackend.projects.updateProject(editingId, form);
        const { error: subpageError } = await window.RuchiBackend.projectSubpages.upsert(subpagePayload(editingId));
        if (subpageError) throw subpageError;
      } else {
        const { data: created, error: createError } = await window.RuchiBackend.projects.createProject(form);
        if (createError) throw createError;
        if (created?.id) {
          const { error: subpageError } = await window.RuchiBackend.projectSubpages.upsert(subpagePayload(created.id));
          if (subpageError) throw subpageError;
        }
      }
      reset();
      load();
    } catch (e) {
      alert("Failed to save: " + e.message);
    } finally {
      setUpdating(false);
    }
  };

  const remove = async (id) => {
    const project = projects.find((item) => item.id === id) || {};
    const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(id);
    await Promise.all(collectProjectAssetUrls(project, sp).map((url) => deleteUploadedAsset(url)));
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
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      {updating && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(35, 31, 32, 0.7)",
          zIndex: 9999,
          display: "grid",
          placeItems: "center",
          color: "#fff",
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#fff",
            color: "var(--rr-ink)",
            padding: "32px 48px",
            borderRadius: "8px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(46,49,146,0.1)",
              borderTopColor: "var(--rr-indigo)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <strong style={{ fontSize: "16px" }}>Updating Project...</strong>
            <span style={{ fontSize: "13px", opacity: 0.6 }}>Saving changes to Supabase database</span>
          </div>
        </div>
      )}
      <form className="admin-panel" onSubmit={save} style={{ maxWidth: "100%", overflowX: "hidden" }}>
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
              {["Residential", "Commercial"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </AdminField>
          <AdminField label="Status">
            <select value={form.status} onChange={(event) => set("status", event.target.value)}>
              {["Ready to Move", "Ongoing", "Upcoming", "New Launch", "For Sale"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </AdminField>
          <AdminField label="Sort order"><input inputMode="numeric" pattern="[0-9]*" value={form.sort_order ?? ""} onChange={(event) => set("sort_order", event.target.value.replace(/[^0-9]/g, ""))} placeholder="Projects page order, lower first" /></AdminField>
          <AdminField label="Feature order"><input inputMode="numeric" pattern="[0-9]*" value={form.feature_order ?? ""} onChange={(event) => set("feature_order", event.target.value.replace(/[^0-9]/g, ""))} placeholder="Homepage featured order, lower first" /></AdminField>
        </div>
        <AdminImageUpload label="Project image" value={form.image_url} onChange={(value) => set("image_url", value)} />
        <AdminField label="Description"><textarea rows={4} value={form.description} onChange={(event) => set("description", event.target.value)} /></AdminField>
        <label className="admin-check"><input type="checkbox" checked={form.featured} onChange={(event) => set("featured", event.target.checked)} /> Featured project</label>

        <details className="admin-details" open={!editingId} style={{ marginTop: "24px", width: "100%", maxWidth: "100%", overflow: "hidden" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "14px", userSelect: "none" }}>Project subpage content</summary>
          <div style={{ marginTop: "16px", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Hero</h3>
            <AdminField label="Hero title"><input value={form.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} /></AdminField>
            <AdminField label="Hero tagline"><input value={form.heroTagline} onChange={(e) => set("heroTagline", e.target.value)} /></AdminField>
            <AdminImageUpload label="Hero logo only" value={form.heroLogo} onChange={(v) => set("heroLogo", v)} />
            <AdminImageUpload label="Hero background landscape" value={form.heroBg} onChange={(v) => set("heroBg", v)} />
            <AdminImageUpload label="Optional mobile hero image" value={form.heroMobileUrl} onChange={(v) => set("heroMobileUrl", v)} />
            <AdminField label="Hero image focal position"><input value={form.heroImagePosition} onChange={(e) => set("heroImagePosition", e.target.value)} placeholder="center center, 50% 30%, left center" /></AdminField>
            <AdminField label="Hero image fit"><select value={form.heroImageFit} onChange={(e) => set("heroImageFit", e.target.value)}><option value="cover">Cover — fill hero</option><option value="contain">Contain — preserve entire image</option></select></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Overview</h3>
            <AdminField label="Overview Paragraphs (separate paragraphs with an empty line)"><textarea rows={6} value={overviewText} onChange={(e) => setOverviewText(e.target.value)} placeholder="Write first paragraph.&#10;&#10;Write second paragraph." /></AdminField>
            <KeyValueListEditor title="Overview Highlights" items={form.overviewHighlights.length ? form.overviewHighlights : DEFAULT_OVERVIEW_HIGHLIGHTS} onChange={(list) => set("overviewHighlights", withOverviewHighlightIcons(list))} keyPlaceholder="Highlight Label" valuePlaceholder="Highlight Description" />

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Amenities</h3>
            <AmenitiesListEditor items={form.amenities} onChange={(list) => set("amenities", list)} />

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Specifications / Landscape</h3>
            <KeyValueListEditor title="Specifications / Landscape" items={form.specifications} onChange={(list) => set("specifications", list)} keyPlaceholder="Specification Title" valuePlaceholder="Specification Details" keyProp="title" valueProp="desc" />
            <AdminImageUpload label="Optional shared specification image" value={form.specificationImage} onChange={(v) => set("specificationImage", v)} />
            <FloorPlansEditor items={form.floorPlans} onChange={(list) => set("floorPlans", list)} />

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Location</h3>
            <AdminField label="Google Maps embed iframe URL"><input value={form.locationMapEmbed} onChange={(e) => set("locationMapEmbed", e.target.value)} placeholder="Paste Google Maps embed URL or iframe code only" /></AdminField>
            <KeyValueListEditor title="Location Destinations" items={form.locationDestinations} onChange={(list) => set("locationDestinations", list)} keyPlaceholder="Destination Name" valuePlaceholder="Distance (e.g. 5 km)" keyProp="name" valueProp="dist" />

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Walkthrough</h3>
            <AdminField label="Walkthrough YouTube URL (e.g. https://www.youtube.com/watch?v=...)">
              <input 
                type="text" 
                value={form.walkthroughVideoId ? (form.walkthroughVideoId.length === 11 ? `https://www.youtube.com/watch?v=${form.walkthroughVideoId}` : form.walkthroughVideoId) : ""} 
                onChange={(e) => {
                  const val = e.target.value;
                  const getYouTubeId = (url) => {
                    if (!url) return "";
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = url.match(regExp);
                    return (match && match[2].length === 11) ? match[2] : url;
                  };
                  set("walkthroughVideoId", getYouTubeId(val));
                }}
                placeholder="Paste YouTube video link here"
              />
            </AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Video / Testimonial Section</h3>
            <label className="admin-check" style={{ margin: "12px 0" }}>
              <input type="checkbox" checked={form.videoSection?.enabled} onChange={(e) => set("videoSection", { ...form.videoSection, enabled: e.target.checked })} /> Enable Video / Testimonial Section
            </label>
            <AdminField label="Video URL"><input value={form.videoSection?.videoUrl || ""} onChange={(e) => set("videoSection", { ...form.videoSection, videoUrl: e.target.value })} placeholder="YouTube link or direct video file URL" /></AdminField>
            <AdminField label="Video Thumbnail URL"><input value={form.videoSection?.thumbnailUrl || ""} onChange={(e) => set("videoSection", { ...form.videoSection, thumbnailUrl: e.target.value })} placeholder="Thumbnail image URL" /></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>GMB Reviews Section</h3>
            <label className="admin-check" style={{ margin: "12px 0" }}>
              <input type="checkbox" checked={form.gmbReviews?.enabled} onChange={(e) => set("gmbReviews", { ...form.gmbReviews, enabled: e.target.checked })} /> Enable GMB Reviews Section
            </label>
            <AdminField label="Google Icon URL"><input value={form.gmbReviews?.googleIconUrl || ""} onChange={(e) => set("gmbReviews", { ...form.gmbReviews, googleIconUrl: e.target.value })} /></AdminField>
            <AdminField label="Star Icon URL"><input value={form.gmbReviews?.starIconUrl || ""} onChange={(e) => set("gmbReviews", { ...form.gmbReviews, starIconUrl: e.target.value })} /></AdminField>
            <ReviewsListEditor items={form.gmbReviews?.reviews} onChange={(list) => set("gmbReviews", { ...form.gmbReviews, reviews: list })} />

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Gallery</h3>
            <GalleryListEditor items={form.galleryImages} onChange={(list) => set("galleryImages", list)} />

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>Brochure</h3>
            <AdminField label="Brochure URL"><input value={form.brochureUrl} onChange={(e) => set("brochureUrl", e.target.value)} placeholder="Optional. Leave blank to keep the brochure CTA and send users to enquiry." /></AdminField>
            <AdminField label="Brochure CTA label"><input value={form.ctaLabels?.brochure || ""} onChange={(e) => set("ctaLabels", { ...form.ctaLabels, brochure: e.target.value })} /></AdminField>
            <AdminField label="Enquiry / visit CTA label"><input value={form.ctaLabels?.visit || ""} onChange={(e) => set("ctaLabels", { ...form.ctaLabels, visit: e.target.value })} /></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>FAQ & Related Projects</h3>
            <KeyValueListEditor title="Frequently Asked Questions" items={form.faqs} onChange={(list) => set("faqs", list)} keyPlaceholder="Question" valuePlaceholder="Answer" keyProp="question" valueProp="answer" />
            <AdminField label="Related project slugs (comma separated)"><input value={(form.relatedProjectSlugs || []).join(", ")} onChange={(e) => set("relatedProjectSlugs", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))} placeholder="one-rajarhat, active-greens" /></AdminField>

            <h3 style={{ margin: "20px 0 8px", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}>SEO</h3>
            <AdminField label="Meta title"><input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} /></AdminField>
            <AdminField label="Meta description"><textarea rows={2} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} /></AdminField>
            <AdminImageUpload label="Open Graph sharing image" value={form.ogImage} onChange={(v) => set("ogImage", v)} />

            <label className="admin-check" style={{ margin: "12px 0" }}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} /> Subpage published
            </label>
          </div>
        </details>

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
                <span>{project.location} - {project.type} - {project.status}</span>
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
              <span>{lead.phone} - {lead.email}</span>
              <span>{lead.interest} - {lead.source}</span>
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
  const [updating, setUpdating] = useState(false);
  const [comments, setComments] = useState([]);
  const [subTab, setSubTab] = useState("posts");

  const load = async () => {
    const { data } = await window.RuchiBackend.blogs.getAllBlogs();
    setBlogs(data || []);
  };
  useEffect(() => { load(); }, []);
  const loadComments = async () => { const { data } = await window.RuchiBackend.blogs.getAllComments(); setComments(data || []); };
  useEffect(() => { loadComments(); }, []);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const reset = () => {
    setEditingId(null);
    setForm(emptyBlog);
  };
  const save = async (event) => {
    event.preventDefault();
    setUpdating(true);
    try {
      const payload = { ...form, related_project_links: String(form.related_project_links || "").split(",").map((item) => item.trim()).filter(Boolean) };
      const result = editingId ? await window.RuchiBackend.blogs.updateBlog(editingId, payload) : await window.RuchiBackend.blogs.createBlog(payload);
      if (result.error) throw result.error;
      reset();
      load();
    } catch (e) {
      alert("Failed to save blog: " + e.message);
    } finally {
      setUpdating(false);
    }
  };
  const edit = (blog) => {
    setEditingId(blog.id);
    
    // Smooth scroll to the form container
    const formElement = document.querySelector(".admin-grid form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setForm({ ...emptyBlog, ...blog, tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "", related_project_links: Array.isArray(blog.related_project_links) ? blog.related_project_links.join(", ") : blog.related_project_links || "", published_at: blog.published_at ? blog.published_at.slice(0, 16) : "" });
  };
  const remove = async (id) => {
    await window.RuchiBackend.blogs.deleteBlog(id);
    if (editingId === id) reset();
    load();
  };

  const filteredBlogs = blogs.filter((blog) =>
    `${blog.title} ${blog.category} ${blog.author}`.toLowerCase().includes(query.toLowerCase())
  );
  const moderate = async (id, status) => { const { error } = await window.RuchiBackend.blogs.updateCommentStatus(id, status); if (!error) loadComments(); };
  const removeComment = async (id) => { if (!confirm("Delete this comment permanently?")) return; await window.RuchiBackend.blogs.deleteComment(id); loadComments(); };

  return (
    <section className="admin-grid">
      <div className="admin-subtabs"><button type="button" className={subTab === "posts" ? "is-active" : ""} onClick={() => setSubTab("posts")}>Blog posts ({blogs.length})</button><button type="button" className={subTab === "comments" ? "is-active" : ""} onClick={() => setSubTab("comments")}>Comments ({comments.length})</button></div>
      {updating && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(35, 31, 32, 0.7)",
          zIndex: 9999,
          display: "grid",
          placeItems: "center",
          color: "#fff",
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#fff",
            color: "var(--rr-ink)",
            padding: "32px 48px",
            borderRadius: "8px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(46,49,146,0.1)",
              borderTopColor: "var(--rr-indigo)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <strong style={{ fontSize: "16px" }}>Updating Blog...</strong>
            <span style={{ fontSize: "13px", opacity: 0.6 }}>Saving changes to Supabase database</span>
          </div>
        </div>
      )}
      {subTab === "posts" ? <><form className="admin-panel" onSubmit={save}>
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
          <AdminField label="Slug"><input value={form.slug} onChange={(event) => set("slug", event.target.value)} placeholder="generated-from-title" /></AdminField>
          <AdminField label="Status"><select value={form.status} onChange={(event) => set("status", event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="unpublished">Unpublished</option></select></AdminField>
          <AdminField label="Publish date"><input type="datetime-local" value={form.published_at} onChange={(event) => set("published_at", event.target.value)} /></AdminField>
        </div>
        <AdminImageUpload label="Blog image" value={form.image} onChange={(value) => set("image", value)} />
        <AdminField label="Image alt text"><input required value={form.image_alt} onChange={(event) => set("image_alt", event.target.value)} /></AdminField>
        <AdminField label="Excerpt"><textarea required rows={3} value={form.excerpt} onChange={(event) => set("excerpt", event.target.value)} /></AdminField>
        <AdminField label="Content"><textarea required rows={7} value={form.content} onChange={(event) => set("content", event.target.value)} /></AdminField>
        <AdminField label="Tags, comma separated"><input value={form.tags} onChange={(event) => set("tags", event.target.value)} /></AdminField>
        <div className="admin-form-grid"><AdminField label="SEO title"><input maxLength="70" value={form.seo_title} onChange={(event) => set("seo_title", event.target.value)} /></AdminField><AdminField label="Canonical URL"><input type="url" value={form.canonical_url} onChange={(event) => set("canonical_url", event.target.value)} /></AdminField><AdminField label="Reading time (minutes)"><input type="number" min="1" value={form.reading_time_minutes} onChange={(event) => set("reading_time_minutes", event.target.value)} /></AdminField></div>
        <AdminField label="SEO description"><textarea maxLength="170" rows={3} value={form.seo_description} onChange={(event) => set("seo_description", event.target.value)} /></AdminField>
        <div className="admin-form-grid"><AdminField label="OG title"><input value={form.og_title} onChange={(event) => set("og_title", event.target.value)} /></AdminField><AdminField label="OG image URL"><input value={form.og_image_url} onChange={(event) => set("og_image_url", event.target.value)} /></AdminField></div>
        <AdminField label="OG description"><textarea rows={2} value={form.og_description} onChange={(event) => set("og_description", event.target.value)} /></AdminField>
        <AdminField label="Related project links, comma separated"><input value={form.related_project_links} onChange={(event) => set("related_project_links", event.target.value)} placeholder="/projects/one-victoria-new-town, /projects/oscar-pride-indore" /></AdminField>
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
                <span>{blog.category} - {blog.author}</span>
              </div>
              <div className="admin-actions">
                <button type="button" onClick={() => edit(blog)}>Edit</button>
                <button type="button" onClick={() => remove(blog.id)}>Delete</button>
              </div>
            </article>
          )) : <p className="admin-empty">No matching blogs yet.</p>}
        </div>
      </div></> : <div className="admin-panel admin-comments"><div className="admin-panel__head"><h2>Comment moderation</h2><span className="admin-count">{comments.length}</span></div><div className="admin-list">{comments.map((item) => <article className="admin-comment" key={item.id}><div><strong>{item.name}</strong><span>{item.email} · {item.blogs?.title || "Blog"} · {new Date(item.created_at).toLocaleString()}</span><p>{item.comment}</p><em className={`comment-status comment-status--${item.status}`}>{item.status}</em></div><div className="admin-actions"><button type="button" onClick={() => moderate(item.id, "approved")}>Approve</button><button type="button" onClick={() => moderate(item.id, "rejected")}>Reject</button><button type="button" onClick={() => moderate(item.id, "spam")}>Spam</button><button type="button" onClick={() => removeComment(item.id)}>Delete</button></div></article>)}</div></div>}
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
        <div className="admin-subtabs admin-careers-subtabs">
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
  const [checkingSession, setCheckingSession] = useState(Boolean(window.RuchiBackend?.auth?.currentUser()));
  const [tab, setTab] = useState("dashboard");
  const tabs = useMemo(() => [
    ["dashboard", "Dashboard"],
    ["projects", "Projects"],
    ["careers", "Careers"],
    ["leads", "Leads"],
    ["settings", "Settings"],
    ["blogs", "Blogs"],
    ["media", "Media"],
  ], []);

  useEffect(() => {
    document.body.classList.add("admin-body");
    return () => document.body.classList.remove("admin-body");
  }, []);

  useEffect(() => {
    let active = true;
    const verify = async () => {
      if (!window.RuchiBackend?.auth?.verifyCurrentUser) {
        setCheckingSession(false);
        return;
      }
      const { data, error } = await window.RuchiBackend.auth.verifyCurrentUser();
      if (!active) return;
      setUser(error ? null : data);
      setCheckingSession(false);
    };
    verify();
    return () => { active = false; };
  }, []);

  if (checkingSession) return <main className="admin-login"><div className="admin-login__box"><p className="admin-kicker">Secure admin login</p><h1>Checking session...</h1></div></main>;
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
        {tab === "media" ? <MediaAdmin /> : null}
      </main>
    </>
  );
}
