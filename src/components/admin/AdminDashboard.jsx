import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminIcon, adminNameFor } from "./AdminShell";
import { BarChart, ColumnChart, DonutChart, EmptyState, LoadingState, PageHeader, StatCard, StatusBadge } from "./AdminUI";

const countBy = (items, key, fallback = "Unspecified") => Object.entries(items.reduce((acc, item) => {
  const value = item?.[key] || fallback;
  acc[value] = (acc[value] || 0) + 1;
  return acc;
}, {})).map(([label, value]) => ({ label, value }));

const recordTime = (item) => item?.updated_at || item?.created_at || item?.published_at || item?.event_date || item?.release_date || null;

export default function AdminDashboard({ onTab, user }) {
  const [data, setData] = useState({ projects: [], leads: [], blogs: [], jobs: [], applications: [], gallery: [], press: [], events: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshedAt, setRefreshedAt] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const api = window.RuchiBackend;
      const results = await Promise.all([
        api.projects.getAllProjects(), api.leads.getAllLeads(), api.blogs.getAllBlogs(), api.careers.getAll(), api.careerApplications.getAll(),
        api.media?.getAllGallery?.() || Promise.resolve({ data: [] }), api.media?.getAllPress?.() || Promise.resolve({ data: [] }), api.media?.getAllEvents?.() || Promise.resolve({ data: [] }),
      ]);
      const [projects, leads, blogs, jobs, applications, gallery, press, events] = results.map((result) => result?.data || []);
      setData({ projects, leads, blogs, jobs, applications, gallery, press, events });
      setRefreshedAt(new Date());
    } catch (loadError) {
      console.error(loadError);
      setError("The dashboard data could not be loaded. Please check your connection and try again.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const analytics = useMemo(() => {
    const publishedBlogs = data.blogs.filter((item) => item.status === "published").length;
    const draftBlogs = data.blogs.filter((item) => item.status === "draft").length;
    const newLeads = data.leads.filter((item) => item.status === "new").length;
    const activeJobs = data.jobs.filter((item) => item.is_active).length;
    const mediaTotal = data.gallery.length + data.press.length + data.events.length;
    return { publishedBlogs, draftBlogs, newLeads, activeJobs, mediaTotal };
  }, [data]);

  const activity = useMemo(() => [
    ...data.leads.map((item) => ({ ...item, entity: "Lead", title: item.name, tab: "leads", status: item.status })),
    ...data.applications.map((item) => ({ ...item, entity: "Application", title: item.full_name, tab: "careers", status: item.status })),
    ...data.projects.map((item) => ({ ...item, entity: "Project", title: item.title, tab: "projects", status: item.status })),
    ...data.blogs.map((item) => ({ ...item, entity: "Blog", title: item.title, tab: "blogs", status: item.status })),
  ].filter((item) => recordTime(item)).sort((a, b) => new Date(recordTime(b)) - new Date(recordTime(a))).slice(0, 7), [data]);

  const projectStatuses = countBy(data.projects, "status");
  const projectTypes = countBy(data.projects, "type");
  const projectLocations = countBy(data.projects, "location").sort((a, b) => b.value - a.value).slice(0, 6);
  const leadStatuses = countBy(data.leads, "status");
  const blogStatuses = countBy(data.blogs, "status");
  const applicationJobs = countBy(data.applications, "job_title", "General application").sort((a, b) => b.value - a.value).slice(0, 5);
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const adminName = adminNameFor(user);

  return <section className="admin-dashboard admin-dashboard--modern">
    <PageHeader eyebrow="Workspace overview" title={`${greeting}, ${adminName}`} description="Here’s what’s happening across Ruchi Realty today." actions={<><span className="admin-dashboard-date">{new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(new Date())}</span><button type="button" className="admin-secondary" onClick={load}><AdminIcon name="dashboard" />Refresh</button><button type="button" className="admin-primary" onClick={() => onTab("projects")}><AdminIcon name="plus" />Add project</button></>} />
    {error ? <div className="admin-error-state"><strong>Unable to load dashboard</strong><p>{error}</p><button type="button" onClick={load}>Retry</button></div> : null}
    {loading ? <LoadingState rows={4} /> : <>
      <div className="admin-stats-grid">
        <StatCard icon="building" label="Total projects" value={data.projects.length} detail={`${data.projects.filter((item) => item.featured).length} featured`} onClick={() => onTab("projects")} />
        <StatCard icon="users" label="New leads" value={analytics.newLeads} detail={`${data.leads.length} total enquiries`} tone="lime" onClick={() => onTab("leads")} />
        <StatCard icon="briefcase" label="Active jobs" value={analytics.activeJobs} detail={`${data.applications.length} applications`} onClick={() => onTab("careers")} />
        <StatCard icon="document" label="Published blogs" value={analytics.publishedBlogs} detail={`${analytics.draftBlogs} drafts`} onClick={() => onTab("blogs")} />
        <StatCard icon="image" label="Media assets" value={analytics.mediaTotal} detail={`${data.gallery.length} gallery items`} onClick={() => onTab("media_gallery")} />
      </div>
      <div className="admin-analytics-grid admin-analytics-grid--dashboard">
        <article className="admin-chart-card"><header><div><span>Portfolio</span><h3>Project overview</h3></div><small>Live database</small></header><DonutChart data={projectStatuses} total={data.projects.length} label="Projects" /></article>
        <article className="admin-chart-card"><header><div><span>Inventory mix</span><h3>Project types</h3></div><small>Current total</small></header><BarChart data={projectTypes} /></article>
        <article className="admin-chart-card"><header><div><span>Geographic footprint</span><h3>Projects by location</h3></div><small>{projectLocations.length} locations</small></header>{projectLocations.length ? <ColumnChart data={projectLocations} /> : <EmptyState icon="building" title="No locations yet" description="Project locations will appear here." />}</article>
        <article className="admin-chart-card"><header><div><span>CRM pipeline</span><h3>Leads overview</h3></div><button type="button" onClick={() => onTab("leads")}>View all</button></header><BarChart data={leadStatuses} /></article>
        <article className="admin-chart-card"><header><div><span>Recruitment</span><h3>Applications by job</h3></div><small>{data.applications.length} total</small></header>{applicationJobs.length ? <BarChart data={applicationJobs} /> : <EmptyState icon="briefcase" title="No applications yet" description="Applications will be summarized here when candidates apply." />}</article>
        <article className="admin-chart-card"><header><div><span>Editorial workflow</span><h3>Blog publishing</h3></div><button type="button" onClick={() => onTab("blogs")}>Manage</button></header>{blogStatuses.length ? <BarChart data={blogStatuses} /> : <EmptyState icon="document" title="No blog data yet" description="Publishing status will appear after articles are created." />}</article>
      </div>
      <div className="admin-dashboard-bottom">
        <article className="admin-panel admin-activity"><div className="admin-panel__head"><div><span className="admin-section-kicker">Latest records</span><h2>Recent activity</h2></div>{refreshedAt ? <small>Updated {refreshedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small> : null}</div>{activity.length ? <div className="admin-activity-list">{activity.map((item) => <button type="button" key={`${item.entity}-${item.id}`} onClick={() => onTab(item.tab)}><i><AdminIcon name={item.tab === "projects" ? "building" : item.tab === "blogs" ? "document" : item.tab === "careers" ? "briefcase" : "users"} /></i><span><strong>{item.title || "Untitled"}</strong><small>{item.entity} · {new Date(recordTime(item)).toLocaleString()}</small></span><StatusBadge value={item.status || item.entity} /></button>)}</div> : <EmptyState title="No recent records" description="Recent content and enquiry updates will appear here." />}</article>
        <aside className="admin-panel admin-quick-actions"><div className="admin-panel__head"><div><span className="admin-section-kicker">Shortcuts</span><h2>Quick actions</h2></div></div>{[["projects", "building", "Add project", "Create a new project entry"], ["careers", "briefcase", "Add job", "Publish a career opportunity"], ["blogs", "document", "Add blog", "Draft an editorial article"], ["media_gallery", "image", "Upload media", "Add gallery or press content"], ["leads", "users", "View leads", "Review new enquiries"]].map(([nextTab, icon, title, detail]) => <button type="button" key={title} onClick={() => onTab(nextTab)}><span><AdminIcon name={icon} /></span><div><strong>{title}</strong><small>{detail}</small></div><b>→</b></button>)}</aside>
      </div>
    </>}
  </section>;
}
