import { useEffect, useMemo, useState } from "react";
import { getGallery, getPress, getEvents, GALLERY_CATEGORIES, EVENT_TYPES, slugifyMedia } from "../../services/mediaService";
import { showAdminToast } from "./AdminShell";

const categories = GALLERY_CATEGORIES;
const types = EVENT_TYPES.filter((value) => value !== "All");
const statuses = ["draft", "published", "unpublished"];

const emptyPress = {
  title: "", slug: "", excerpt: "", content: "", release_date: "", source_name: "", author: "Ruchi Realty",
  external_url: "", pdf_url: "", status: "draft", is_featured: false, display_order: 0,
  seo_title: "", seo_description: "", cover_asset_id: null,
};

const emptyEvent = {
  title: "", slug: "", item_type: "Event", event_date: "", location: "", excerpt: "", description: "",
  video_url: "", external_url: "", related_project_slug: "", status: "draft", is_featured: false,
  display_order: 0, seo_title: "", seo_description: "", cover_asset_id: null,
};

async function webpFile(file) {
  if (!file.type.startsWith("image/")) throw new Error("Use JPG, PNG, or WebP images only.");
  const bitmap = await createImageBitmap(file);
  const max = 1800;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  let quality = 0.84;
  let blob;
  do {
    blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    quality -= 0.07;
  } while (blob?.size > 200 * 1024 && quality >= 0.42);
  if (!blob) throw new Error("The selected image could not be optimized.");
  const hash = await crypto.subtle.digest("SHA-256", await file.arrayBuffer())
    .then((buffer) => [...new Uint8Array(buffer)].map((value) => value.toString(16).padStart(2, "0")).join(""));
  return {
    file: new File([blob], `${slugifyMedia(file.name.replace(/\.[^.]+$/, ""))}.webp`, { type: "image/webp" }),
    hash,
    width: bitmap.width,
    height: bitmap.height,
    size: blob.size,
  };
}

function MediaUploader({ multiple = false, onUploaded, label = "Upload image" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const upload = async (event) => {
    const files = [...(event.target.files || [])];
    event.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setError("");
    try {
      for (const source of files) {
        const result = await webpFile(source);
        const url = await window.RuchiBackend.uploadImage(result.file, "media-images");
        const asset = await window.RuchiBackend.media.createAsset(url, "gallery", {
          hash: result.hash,
          original_filename: source.name,
          file_size: result.size,
          width: result.width,
          height: result.height,
        });
        if (asset.error) throw asset.error;
        await onUploaded(asset.data, source);
      }
    } catch (uploadError) {
      setError(uploadError.message || "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return <div className="media-admin-upload">
    <div><strong>{label}</strong><small>JPG, PNG or WebP. Images are optimized before upload.</small></div>
    <label className="admin-upload-btn">{busy ? "Optimizing…" : "Choose files"}<input hidden type="file" multiple={multiple} accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy} /></label>
    {error ? <p className="contact-error">{error}</p> : null}
  </div>;
}

function Field({ label, children, wide = false }) {
  return <label className={`media-field${wide ? " media-field--wide" : ""}`}><span>{label}</span>{children}</label>;
}

function StatusFields({ form, setForm }) {
  return <fieldset className="media-publish">
    <legend>Publishing</legend>
    <Field label="Status"><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></Field>
    <Field label="Display order"><input type="number" min="0" value={form.display_order} onChange={(event) => setForm({ ...form, display_order: Number(event.target.value) })} /></Field>
    <label className="media-feature-toggle"><input type="checkbox" checked={form.is_featured} onChange={(event) => setForm({ ...form, is_featured: event.target.checked })} /><span><strong>Featured item</strong><small>Show prominently on the public page.</small></span></label>
  </fieldset>;
}

function SeoFields({ form, setForm }) {
  return <div className="media-seo-fields">
    <Field label="SEO title"><input value={form.seo_title || ""} onChange={(event) => setForm({ ...form, seo_title: event.target.value })} /></Field>
    <Field label="SEO description" wide><textarea rows="3" value={form.seo_description || ""} onChange={(event) => setForm({ ...form, seo_description: event.target.value })} /></Field>
  </div>;
}

function Records({ items, edit, remove, dateKey }) {
  return <div className="media-admin-records">
    {items.length ? items.map((item) => <article key={item.id}>
      <div><strong>{item.title}</strong><small>{item[dateKey] ? new Date(item[dateKey]).toLocaleDateString() : "No date"}</small></div>
      <span className={`admin-status admin-status--${item.status}`}><i />{item.status}</span>
      {item.is_featured ? <span className="admin-featured-pill">Featured</span> : null}
      <button type="button" onClick={() => edit(item)}>Edit</button>
      <button type="button" onClick={() => { if (confirm(`Delete ${item.title || "this media record"} permanently?`)) remove(item.id); }}>Delete</button>
    </article>) : <div className="admin-empty-state"><span>□</span><h3>No matching entries</h3><p>Create the first record or adjust the active filters.</p></div>}
  </div>;
}

function Editor({ kind, onSubmit, upload, onCancel, children }) {
  return <form className="admin-panel media-editor" onSubmit={onSubmit}>
    <div className="media-editor-head"><div><span>Content editor</span><h2>{kind}</h2></div><button type="button" className="admin-text-btn" onClick={onCancel}>Close</button></div>
    <MediaUploader label="Optional cover image" onUploaded={upload} />
    <div className="media-editor-body">{children}</div>
    <div className="admin-editor-actions"><span>Changes use the existing media publishing workflow.</span><button className="admin-primary" type="submit">Save {kind.toLowerCase()}</button></div>
  </form>;
}

export default function MediaAdmin({ initialTab = "gallery", onSectionChange }) {
  const [tab, setTab] = useState(initialTab);
  const [gallery, setGallery] = useState([]);
  const [press, setPress] = useState([]);
  const [events, setEvents] = useState([]);
  const [pressForm, setPressForm] = useState(emptyPress);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [editPress, setEditPress] = useState();
  const [editEvent, setEditEvent] = useState();
  const [editorOpen, setEditorOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("newest");

  const load = () => Promise.all([getGallery(true), getPress(true), getEvents(true)]).then(([galleryData, pressData, eventData]) => {
    setGallery(galleryData);
    setPress(pressData);
    setEvents(eventData);
  });
  useEffect(() => { load(); }, []);
  useEffect(() => { setTab(initialTab); setEditorOpen(false); }, [initialTab]);

  const addGallery = async (asset, file) => {
    await window.RuchiBackend.media.saveGallery({
      title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      slug: `${slugifyMedia(file.name.replace(/\.[^.]+$/, ""))}-${asset.id.slice(0, 6)}`,
      caption: "", alt_text: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      image_asset_id: asset.id, category: "Events", album: "", display_order: gallery.length,
      status: "published", is_featured: false,
    });
    showAdminToast("Media uploaded", `${file.name} was added to the gallery.`);
    load();
  };
  const patchGallery = async (item, key, value) => {
    await window.RuchiBackend.media.saveGallery({ [key]: value }, item.id);
    if (["status", "is_featured"].includes(key)) showAdminToast("Media updated", "The publishing settings were saved.");
    load();
  };
  const savePress = async (event) => {
    event.preventDefault();
    const payload = { ...pressForm, slug: pressForm.slug || slugifyMedia(pressForm.title), release_date: pressForm.release_date || null };
    await window.RuchiBackend.media.savePress(payload, editPress);
    showAdminToast(editPress ? "Press release updated" : "Press release created", `${pressForm.title} was saved successfully.`);
    setPressForm(emptyPress); setEditPress(); setEditorOpen(false); load();
  };
  const saveEvent = async (event) => {
    event.preventDefault();
    if (eventForm.video_url && !/^https?:\/\//i.test(eventForm.video_url)) return alert("Video URL must begin with http:// or https://");
    const payload = { ...eventForm, slug: eventForm.slug || slugifyMedia(eventForm.title), event_date: eventForm.event_date || null };
    await window.RuchiBackend.media.saveEvent(payload, editEvent);
    showAdminToast(editEvent ? "Event updated" : "Event created", `${eventForm.title} was saved successfully.`);
    setEventForm(emptyEvent); setEditEvent(); setEditorOpen(false); load();
  };

  const currentItems = tab === "gallery" ? gallery : tab === "press" ? press : events;
  const filteredItems = useMemo(() => currentItems.filter((item) => {
    const matchesQuery = `${item.title || ""} ${item.caption || item.excerpt || ""} ${item.related_project_slug || ""}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesCategory = tab !== "gallery" || categoryFilter === "All" || item.category === categoryFilter;
    return matchesQuery && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    if (sort === "name") return String(a.title || "").localeCompare(String(b.title || ""));
    if (sort === "order") return Number(a.display_order || 0) - Number(b.display_order || 0);
    return new Date(b.updated_at || b.created_at || b.release_date || b.event_date || 0) - new Date(a.updated_at || a.created_at || a.release_date || a.event_date || 0);
  }), [currentItems, query, statusFilter, categoryFilter, sort, tab]);

  const changeTab = (nextTab) => { setTab(nextTab); setEditorOpen(false); setQuery(""); setStatusFilter("All"); setCategoryFilter("All"); onSectionChange?.(nextTab); };
  const openNew = () => {
    if (tab === "press") { setEditPress(); setPressForm(emptyPress); }
    if (tab === "events") { setEditEvent(); setEventForm(emptyEvent); }
    setEditorOpen(true);
  };

  return <section className="admin-media-page">
    <div className="admin-collection-head"><div><span className="admin-section-kicker">Asset library</span><h2>Media</h2><p>Organize gallery images, press releases, events and awards.</p></div>{tab === "gallery" ? <MediaUploader multiple label="Upload media" onUploaded={addGallery} /> : <button type="button" className="admin-primary" onClick={openNew}>+ Add {tab === "press" ? "press release" : "event or award"}</button>}</div>
    <div className="admin-pipeline-stats admin-media-stats">
      <article><span>Gallery assets</span><strong>{gallery.length}</strong></article><article><span>Press releases</span><strong>{press.length}</strong></article><article><span>Events & awards</span><strong>{events.length}</strong></article><article><span>Featured</span><strong>{[...gallery, ...press, ...events].filter((item) => item.is_featured).length}</strong></article>
    </div>
    <div className="admin-subtabs"><button className={tab === "gallery" ? "is-active" : ""} onClick={() => changeTab("gallery")}>Gallery ({gallery.length})</button><button className={tab === "press" ? "is-active" : ""} onClick={() => changeTab("press")}>Press Releases ({press.length})</button><button className={tab === "events" ? "is-active" : ""} onClick={() => changeTab("events")}>Events & Awards ({events.length})</button></div>
    <div className="admin-toolbar media-filterbar"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search media..." />{tab === "gallery" ? <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="All">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select> : null}<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="All">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Recently updated</option><option value="name">Name A-Z</option><option value="order">Display order</option></select></div>

    {tab === "gallery" ? <div className="admin-panel media-admin-panel"><div className="admin-panel__head"><h2>Gallery library</h2><span className="admin-count">{filteredItems.length}</span></div><div className="media-admin-gallery">{filteredItems.length ? filteredItems.map((item) => <article key={item.id}>
      {item.thumbnail_url || item.image_url ? <img decoding="async" loading="lazy" src={item.thumbnail_url || item.image_url} alt="" /> : <div className="media-placeholder">VIDEO</div>}
      <div><input aria-label="Media title" value={item.title || ""} onChange={(event) => setGallery((value) => value.map((entry) => entry.id === item.id ? { ...entry, title: event.target.value } : entry))} onBlur={(event) => patchGallery(item, "title", event.target.value)} /><input aria-label="Caption" placeholder="Caption" value={item.caption || ""} onChange={(event) => setGallery((value) => value.map((entry) => entry.id === item.id ? { ...entry, caption: event.target.value } : entry))} onBlur={(event) => patchGallery(item, "caption", event.target.value)} /><input aria-label="Alt text" placeholder="Alt text" value={item.alt_text || ""} onChange={(event) => setGallery((value) => value.map((entry) => entry.id === item.id ? { ...entry, alt_text: event.target.value } : entry))} onBlur={(event) => patchGallery(item, "alt_text", event.target.value)} />
        <div><select aria-label="Category" value={item.category} onChange={(event) => patchGallery(item, "category", event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select><input placeholder="Album" value={item.album || ""} onChange={(event) => setGallery((value) => value.map((entry) => entry.id === item.id ? { ...entry, album: event.target.value } : entry))} onBlur={(event) => patchGallery(item, "album", event.target.value)} /><input placeholder="Video URL" value={item.video_url || ""} onChange={(event) => setGallery((value) => value.map((entry) => entry.id === item.id ? { ...entry, video_url: event.target.value, media_type: event.target.value ? "video" : "image" } : entry))} onBlur={(event) => patchGallery(item, "video_url", event.target.value)} /><input placeholder="Project slug" value={item.related_project_slug || ""} onChange={(event) => setGallery((value) => value.map((entry) => entry.id === item.id ? { ...entry, related_project_slug: event.target.value } : entry))} onBlur={(event) => patchGallery(item, "related_project_slug", event.target.value)} /></div>
        <div className="admin-actions"><select aria-label="Publishing status" value={item.status} onChange={(event) => patchGallery(item, "status", event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><button type="button" onClick={() => patchGallery(item, "is_featured", !item.is_featured)}>{item.is_featured ? "Featured" : "Set featured"}</button><button type="button" onClick={() => patchGallery(item, "display_order", Math.max(0, item.display_order - 1))}>Move up</button><button type="button" onClick={() => patchGallery(item, "display_order", item.display_order + 1)}>Move down</button><button type="button" onClick={async () => { if (confirm("Delete gallery item permanently?")) { await window.RuchiBackend.media.deleteGallery(item.id); load(); } }}>Delete</button></div>
      </div></article>) : <div className="admin-empty-state"><span>□</span><h3>No media found</h3><p>Upload a new asset or adjust the active filters.</p></div>}</div></div> : null}

    {tab === "press" ? <div className={`media-library-layout${editorOpen ? " is-editing" : ""}`}>
      {editorOpen ? <Editor kind={editPress ? "Edit press release" : "New press release"} onSubmit={savePress} onCancel={() => setEditorOpen(false)} upload={async (asset) => setPressForm((value) => ({ ...value, cover_asset_id: asset.id }))}>
        <Field label="Title"><input required value={pressForm.title} onChange={(event) => setPressForm({ ...pressForm, title: event.target.value })} /></Field><Field label="Slug"><input value={pressForm.slug} onChange={(event) => setPressForm({ ...pressForm, slug: event.target.value })} /></Field><Field label="Release date"><input type="date" value={pressForm.release_date} onChange={(event) => setPressForm({ ...pressForm, release_date: event.target.value })} /></Field><Field label="Source / publication"><input value={pressForm.source_name} onChange={(event) => setPressForm({ ...pressForm, source_name: event.target.value })} /></Field><Field label="Author"><input value={pressForm.author} onChange={(event) => setPressForm({ ...pressForm, author: event.target.value })} /></Field><Field label="Excerpt" wide><textarea rows="3" value={pressForm.excerpt} onChange={(event) => setPressForm({ ...pressForm, excerpt: event.target.value })} /></Field><Field label="Full content" wide><textarea rows="8" value={pressForm.content} onChange={(event) => setPressForm({ ...pressForm, content: event.target.value })} /></Field><Field label="PDF URL"><input value={pressForm.pdf_url} onChange={(event) => setPressForm({ ...pressForm, pdf_url: event.target.value })} /></Field><Field label="External article URL"><input value={pressForm.external_url} onChange={(event) => setPressForm({ ...pressForm, external_url: event.target.value })} /></Field><SeoFields form={pressForm} setForm={setPressForm} /><StatusFields form={pressForm} setForm={setPressForm} />
      </Editor> : null}<div className="admin-panel media-record-panel"><div className="admin-panel__head"><h2>Press releases</h2><span className="admin-count">{filteredItems.length}</span></div><Records items={filteredItems} dateKey="release_date" edit={(item) => { setEditPress(item.id); setPressForm({ ...emptyPress, ...item, release_date: item.release_date || "" }); setEditorOpen(true); }} remove={async (id) => { await window.RuchiBackend.media.deletePress(id); load(); }} /></div></div> : null}

    {tab === "events" ? <div className={`media-library-layout${editorOpen ? " is-editing" : ""}`}>
      {editorOpen ? <Editor kind={editEvent ? "Edit event or award" : "New event or award"} onSubmit={saveEvent} onCancel={() => setEditorOpen(false)} upload={async (asset) => setEventForm((value) => ({ ...value, cover_asset_id: asset.id }))}>
        <Field label="Title"><input required value={eventForm.title} onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })} /></Field><Field label="Slug"><input value={eventForm.slug} onChange={(event) => setEventForm({ ...eventForm, slug: event.target.value })} /></Field><Field label="Type"><select value={eventForm.item_type} onChange={(event) => setEventForm({ ...eventForm, item_type: event.target.value })}>{types.map((type) => <option key={type}>{type}</option>)}</select></Field><Field label="Event date"><input type="date" value={eventForm.event_date} onChange={(event) => setEventForm({ ...eventForm, event_date: event.target.value })} /></Field><Field label="Location"><input value={eventForm.location} onChange={(event) => setEventForm({ ...eventForm, location: event.target.value })} /></Field><Field label="Short description" wide><textarea rows="3" value={eventForm.excerpt} onChange={(event) => setEventForm({ ...eventForm, excerpt: event.target.value })} /></Field><Field label="Full description" wide><textarea rows="6" value={eventForm.description} onChange={(event) => setEventForm({ ...eventForm, description: event.target.value })} /></Field><Field label="Video URL"><input type="url" placeholder="https://youtube.com/..." value={eventForm.video_url} onChange={(event) => setEventForm({ ...eventForm, video_url: event.target.value })} /></Field><Field label="External link"><input value={eventForm.external_url} onChange={(event) => setEventForm({ ...eventForm, external_url: event.target.value })} /></Field><Field label="Related project slug"><input value={eventForm.related_project_slug} onChange={(event) => setEventForm({ ...eventForm, related_project_slug: event.target.value })} /></Field><SeoFields form={eventForm} setForm={setEventForm} /><StatusFields form={eventForm} setForm={setEventForm} />
      </Editor> : null}<div className="admin-panel media-record-panel"><div className="admin-panel__head"><h2>Events & awards</h2><span className="admin-count">{filteredItems.length}</span></div><Records items={filteredItems} dateKey="event_date" edit={(item) => { setEditEvent(item.id); setEventForm({ ...emptyEvent, ...item, event_date: item.event_date || "" }); setEditorOpen(true); }} remove={async (id) => { await window.RuchiBackend.media.deleteEvent(id); load(); }} /></div></div> : null}
  </section>;
}
