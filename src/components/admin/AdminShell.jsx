import { useEffect, useMemo, useState } from "react";

export function showAdminToast(message, detail = "Your changes are live in the admin workspace.", tone = "success") {
  window.dispatchEvent(new CustomEvent("ruchi-admin-toast", { detail: { message, detail, tone } }));
}

export function adminNameFor(user) {
  const explicitName = user?.name || user?.full_name || user?.display_name || user?.user_metadata?.full_name || user?.user_metadata?.name;
  if (explicitName) return String(explicitName).trim();
  const emailName = String(user?.email || "").split("@")[0].replace(/[._-]+/g, " ").trim();
  if (!emailName || emailName.toLowerCase() === "admin") return "Admin";
  return emailName.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function AdminToastHost() {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    let timer;
    const show = (event) => {
      clearTimeout(timer);
      setToast(event.detail);
      timer = setTimeout(() => setToast(null), 3600);
    };
    window.addEventListener("ruchi-admin-toast", show);
    return () => { clearTimeout(timer); window.removeEventListener("ruchi-admin-toast", show); };
  }, []);
  return toast ? <div className={`admin-toast admin-toast--${toast.tone}`} role="status"><strong>{toast.message}</strong><span>{toast.detail}</span></div> : null;
}

const NAV_GROUPS = [
  { label: "Main", items: [["dashboard", "Dashboard", "dashboard"]] },
  { label: "Content", items: [["projects", "Projects", "building"], ["careers", "Careers", "briefcase"], ["leads", "Leads", "users"], ["blogs", "Blogs", "document"], ["media_gallery", "Gallery", "image"], ["media_press", "Press Releases", "document"], ["media_events", "Events & Awards", "award"]] },
  { label: "System", items: [["settings", "Settings", "settings"]] },
];

const PAGE_META = {
  dashboard: ["Overview", "Monitor content, enquiries and publishing activity."],
  projects: ["Projects", "Manage residential and commercial project content."],
  careers: ["Careers", "Manage open roles and candidate applications."],
  leads: ["Leads", "Review and progress website enquiries."],
  blogs: ["Blogs", "Create, publish and maintain editorial content."],
  media: ["Gallery", "Organize gallery assets, press releases and events."],
  media_gallery: ["Gallery", "Manage website gallery images and videos."],
  media_press: ["Press Releases", "Create and publish company press coverage."],
  media_events: ["Events & Awards", "Manage events, awards and recognitions."],
  settings: ["Settings", "Maintain public contact and website information."],
};

export function AdminIcon({ name, size = 18 }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    building: <><path d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16"/><path d="M9 21v-4h3v4M8 7h1m3 0h1M8 11h1m3 0h1M17 9h3v12M2 21h20"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    document: <><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
    award: <><circle cx="12" cy="8" r="5"/><path d="m8.5 12-1 9 4.5-2.5L16.5 21l-1-9M9.5 8l1.5 1.5L14.5 6"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.09A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.56-1.03H3v-4h.09A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63h.01A1.7 1.7 0 0 0 10.03 3H14v.09A1.7 1.7 0 0 0 15 4.64a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9v.01A1.7 1.7 0 0 0 21 10.03V14h-.09A1.7 1.7 0 0 0 19.4 15Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    collapse: <path d="m14 18-6-6 6-6"/>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></>,
  };
  return <svg className="admin-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">{paths[name] || paths.document}</svg>;
}

async function loadSearchData() {
  const api = window.RuchiBackend;
  const calls = [
    ["projects", "Project", api?.projects?.getAllProjects],
    ["blogs", "Blog", api?.blogs?.getAllBlogs],
    ["careers", "Job", api?.careers?.getAll],
    ["leads", "Lead", api?.leads?.getAllLeads],
  ];
  const results = await Promise.all(calls.map(async ([tab, type, fn]) => {
    if (!fn) return [];
    const { data } = await fn();
    return (data || []).map((item) => ({
      tab,
      type,
      id: item.id,
      title: item.title || item.name || item.full_name || "Untitled",
      meta: item.location || item.category || item.dept || item.email || "",
    }));
  }));
  return results.flat();
}

export default function AdminShell({ tab, onTab, user, onLogout, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchItems, setSearchItems] = useState([]);
  const [searchLoaded, setSearchLoaded] = useState(false);
  const [attentionCount, setAttentionCount] = useState(0);
  const [title, subtitle] = PAGE_META[tab] || PAGE_META.dashboard;
  const adminName = adminNameFor(user);

  useEffect(() => {
    let active = true;
    Promise.all([
      window.RuchiBackend?.leads?.getAllLeads?.(),
      window.RuchiBackend?.careerApplications?.getAll?.(),
    ]).then(([leadResult, appResult]) => {
      if (!active) return;
      const newLeads = (leadResult?.data || []).filter((item) => item.status === "new").length;
      const newApps = (appResult?.data || []).filter((item) => item.status === "new").length;
      setAttentionCount(newLeads + newApps);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const ensureSearch = async () => {
    if (searchLoaded) return;
    try { setSearchItems(await loadSearchData()); } finally { setSearchLoaded(true); }
  };

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return searchItems.filter((item) => `${item.title} ${item.meta} ${item.type}`.toLowerCase().includes(needle)).slice(0, 8);
  }, [query, searchItems]);

  const navigate = (nextTab) => {
    onTab(nextTab);
    setMobileOpen(false);
    setQuickOpen(false);
    setQuery("");
  };

  return <div className={`admin-app-shell${collapsed ? " is-collapsed" : ""}`}>
    <AdminToastHost />
    {mobileOpen ? <button className="admin-sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} /> : null}
    <aside className={`admin-sidebar${mobileOpen ? " is-open" : ""}`}>
      <div className="admin-sidebar__brand">
        <a href="/" aria-label="Ruchi Realty website"><img className="admin-sidebar__logo-full" src="/assets/logo-h-white.webp" alt="Ruchi Realty" /><img className="admin-sidebar__logo-mark" src="/assets/logo-mark.webp" alt="" /></a>
        <button type="button" className="admin-sidebar__collapse" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}><AdminIcon name="collapse" /></button>
      </div>
      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {NAV_GROUPS.map((group) => <div className="admin-sidebar__group" key={group.label}>
          <span className="admin-sidebar__label">{group.label}</span>
          {group.items.map(([id, label, icon]) => <button title={collapsed ? label : undefined} key={id} type="button" className={tab === id ? "is-active" : ""} onClick={() => navigate(id)}>
            <AdminIcon name={icon} /><span>{label}</span>
          </button>)}
        </div>)}
      </nav>
      <div className="admin-sidebar__account">
        <div className="admin-avatar">{String(user?.email || "A").slice(0, 1).toUpperCase()}</div>
        <div><strong>{adminName}</strong><span>{user?.email || "Authenticated user"}</span></div>
        <button title="Logout" type="button" onClick={onLogout} aria-label="Logout"><AdminIcon name="logout" /></button>
      </div>
    </aside>
    <div className="admin-workspace">
      <header className="admin-app-header">
        <button type="button" className="admin-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><AdminIcon name="menu" /></button>
        <div className="admin-page-context"><span>Ruchi Realty <b>/</b> {title}</span><h1>{title}</h1><p>{subtitle}</p></div>
        <div className="admin-header-actions">
          <div className="admin-global-search">
            <AdminIcon name="search" />
            <input value={query} onFocus={ensureSearch} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, blogs, jobs, leads" aria-label="Search admin content" />
            {query ? <div className="admin-search-results">{results.length ? results.map((item) => <button type="button" key={`${item.tab}-${item.id}`} onClick={() => navigate(item.tab)}><span>{item.type}</span><strong>{item.title}</strong><small>{item.meta}</small></button>) : <p>No matching content found.</p>}</div> : null}
          </div>
          <button type="button" className="admin-icon-button" onClick={() => navigate("leads")} aria-label={`${attentionCount} new leads and applications`}><AdminIcon name="bell" />{attentionCount ? <span>{attentionCount}</span> : null}</button>
          <div className="admin-quick-create">
            <button type="button" className="admin-primary admin-quick-create__button" onClick={() => setQuickOpen((value) => !value)}><AdminIcon name="plus" />Create</button>
            {quickOpen ? <div className="admin-quick-menu">{[["projects", "New project"], ["careers", "New job"], ["blogs", "New blog"], ["media_gallery", "Upload media"]].map(([id, label]) => <button type="button" key={id} onClick={() => navigate(id)}>{label}</button>)}</div> : null}
          </div>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  </div>;
}
