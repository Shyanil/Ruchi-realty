import { useEffect, useMemo, useState } from "react";
import { getGallery, getPress, getEvents, GALLERY_CATEGORIES, EVENT_TYPES, slugifyMedia, youtubeThumb } from "../../services/mediaService";
import { showAdminToast } from "./AdminShell";

const categories = GALLERY_CATEGORIES;
const types = EVENT_TYPES.filter((value) => value !== "All");
const statuses = ["draft", "published", "unpublished"];

const emptyGallery = {
  title: "", slug: "", caption: "", alt_text: "", category: "Videos", album: "",
  media_type: "video", video_url: "", image_url: "", thumbnail_url: "",
  status: "published", is_featured: false, display_order: 0, image_asset_id: null,
};

const emptyPress = {
  title: "", slug: "", excerpt: "", content: "", release_date: "", source_name: "", author: "Ruchi Realty",
  external_url: "", pdf_url: "", status: "draft", is_featured: false, display_order: 0,
  seo_title: "", seo_description: "", cover_asset_id: null, internal_links: [],
};

const emptyEvent = {
  title: "", slug: "", item_type: "Event", event_date: "", location: "", excerpt: "", description: "",
  video_url: "", external_url: "", related_project_slug: "", status: "draft", is_featured: false,
  display_order: 0, seo_title: "", seo_description: "", cover_asset_id: null, internal_links: [],
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

function InternalLinksEditor({ links = [], onChange }) {
  const items = Array.isArray(links) ? links : [];
  const update = (index, key, value) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  return <fieldset className="media-internal-links">
    <legend>Internal hyperlinks</legend>
    <small>Link this content to relevant project, blog, media, or event pages. Use an internal path beginning with /.</small>
    {items.map((item, index) => <div className="media-internal-link-row" key={index}>
      <input aria-label={`Internal link ${index + 1} label`} placeholder="Link label" value={item.label || ""} onChange={(event) => update(index, "label", event.target.value)} />
      <input aria-label={`Internal link ${index + 1} path`} placeholder="/projects/one-victoria-new-town" value={item.url || ""} onChange={(event) => update(index, "url", event.target.value)} />
      <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
    </div>)}
    <div className="media-internal-links__actions"><button type="button" onClick={() => onChange([...items, { label: "", url: "" }])}>+ Add internal link</button></div>
  </fieldset>;
}

function Records({ items, edit, remove, dateKey }) {
  return <div className="media-admin-records">
    {items.length ? items.map((item) => <article key={item.id}>
      <div className="media-admin-record__info"><strong>{item.title}</strong><small>{item[dateKey] ? new Date(item[dateKey]).toLocaleDateString() : "No date"}</small></div>
      <div className="media-admin-record__badges">
        <span className={`admin-status admin-status--${item.status}`}><i />{item.status}</span>
        {item.is_featured ? <span className="admin-featured-pill">Featured</span> : null}
      </div>
      <div className="media-admin-record__actions">
        <button type="button" onClick={() => edit(item)}>Edit</button>
        <button type="button" onClick={() => { if (confirm(`Delete ${item.title || "this media record"} permanently?`)) remove(item.id); }}>Delete</button>
      </div>
    </article>) : <div className="admin-empty-state"><span>□</span><h3>No matching entries</h3><p>Create the first record or adjust the active filters.</p></div>}
  </div>;
}

function Editor({ kind, onSubmit, upload, onCancel, children }) {
  return <form className="admin-panel media-editor" onSubmit={onSubmit} noValidate>
    <div className="media-editor-head">
      <div><span>Content editor</span><h2>{kind}</h2></div>
      <div className="admin-header-actions">
        <button type="button" className="admin-text-btn" onClick={onCancel}>Close</button>
        <button className="admin-primary" type="submit">Save</button>
      </div>
    </div>
    <div className="admin-editor-actions admin-editor-actions--top">
      <span>Save changes for "{kind}"</span>
      <button className="admin-primary" type="submit">Save</button>
    </div>
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
  const [galleryForm, setGalleryForm] = useState(emptyGallery);
  const [pressForm, setPressForm] = useState(emptyPress);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [editGallery, setEditGallery] = useState();
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
    const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    const category = categoryFilter !== "All" ? categoryFilter : "Events";
    const res = await window.RuchiBackend.media.saveGallery({
      title,
      slug: `${slugifyMedia(title)}-${asset.id.slice(0, 6)}`,
      caption: "",
      alt_text: title,
      image_asset_id: asset.id,
      image_url: asset.public_url || "",
      thumbnail_url: asset.thumbnail_url || "",
      category,
      album: "",
      media_type: "image",
      display_order: gallery.length,
      status: "published",
      is_featured: false,
    });
    if (res?.error) {
      showAdminToast("Upload failed", res.error.message || "Failed to save gallery item.");
      return;
    }
    showAdminToast("Media uploaded", `${file.name} was added to the gallery.`);
    load();
  };

  const patchGallery = async (item, key, value) => {
    const payload = { [key]: value };
    if (key === "video_url") {
      const isVid = Boolean(value && value.trim());
      payload.media_type = isVid ? "video" : "image";
      if (isVid && !item.thumbnail_url && !item.image_asset_id) {
        const yt = youtubeThumb(value);
        if (yt) {
          payload.thumbnail_url = yt;
          payload.image_url = yt;
        }
      }
    }
    const res = await window.RuchiBackend.media.saveGallery(payload, item.id);
    if (res?.error) {
      showAdminToast("Update failed", res.error.message || "Could not save changes to Supabase.");
      return;
    }
    if (["status", "is_featured", "category"].includes(key)) {
      showAdminToast("Media updated", `The ${key} setting was saved.`);
    } else if (key === "video_url") {
      showAdminToast("Video link saved", "Video URL and media type updated successfully.");
    }
    load();
  };

  const saveGalleryItem = async (event) => {
    event.preventDefault();
    if (!galleryForm.title?.trim()) {
      alert("Please enter a title for the gallery item.");
      return;
    }
    const isVideo = galleryForm.media_type === "video" || Boolean(galleryForm.video_url && galleryForm.video_url.trim());
    let ytThumb = "";
    if (galleryForm.video_url) {
      ytThumb = youtubeThumb(galleryForm.video_url);
    }
    const slug = galleryForm.slug?.trim() || `${slugifyMedia(galleryForm.title)}-${Math.random().toString(36).slice(2, 7)}`;
    const payload = {
      title: galleryForm.title.trim(),
      slug,
      caption: galleryForm.caption || "",
      alt_text: galleryForm.alt_text || galleryForm.title.trim(),
      category: galleryForm.category || (isVideo ? "Videos" : "Events"),
      album: galleryForm.album || "",
      media_type: isVideo ? "video" : "image",
      video_url: galleryForm.video_url || "",
      image_url: galleryForm.image_url || ytThumb || "",
      thumbnail_url: galleryForm.thumbnail_url || ytThumb || galleryForm.image_url || "",
      status: galleryForm.status || "published",
      is_featured: Boolean(galleryForm.is_featured),
      display_order: Number(galleryForm.display_order || 0),
      image_asset_id: galleryForm.image_asset_id || null,
    };

    const res = await window.RuchiBackend.media.saveGallery(payload, editGallery);
    if (res?.error) {
      showAdminToast("Save failed", res.error.message || "Failed to save gallery item.");
      return;
    }
    showAdminToast(editGallery ? "Gallery item updated" : "Gallery item created", `${payload.title} was saved successfully.`);
    setGalleryForm(emptyGallery);
    setEditGallery(undefined);
    setEditorOpen(false);
    load();
  };

  const savePress = async (event) => {
    event.preventDefault();
    const payload = { ...pressForm, slug: pressForm.slug || slugifyMedia(pressForm.title), release_date: pressForm.release_date || null };
    const res = await window.RuchiBackend.media.savePress(payload, editPress);
    if (res?.error) {
      showAdminToast("Save failed", res.error.message || "Failed to save press release.");
      return;
    }
    showAdminToast(editPress ? "Press release updated" : "Press release created", `${pressForm.title} was saved successfully.`);
    setPressForm(emptyPress); setEditPress(); setEditorOpen(false); load();
  };

  const saveEvent = async (event) => {
    event.preventDefault();
    if (eventForm.video_url && !/^https?:\/\//i.test(eventForm.video_url)) return alert("Video URL must begin with http:// or https://");
    const payload = { ...eventForm, slug: eventForm.slug || slugifyMedia(eventForm.title), event_date: eventForm.event_date || null };
    const res = await window.RuchiBackend.media.saveEvent(payload, editEvent);
    if (res?.error) {
      showAdminToast("Save failed", res.error.message || "Failed to save event.");
      return;
    }
    showAdminToast(editEvent ? "Event updated" : "Event created", `${eventForm.title} was saved successfully.`);
    setEventForm(emptyEvent); setEditEvent(); setEditorOpen(false); load();
  };

  const currentItems = tab === "gallery" ? gallery : tab === "press" ? press : events;
  const filteredItems = useMemo(() => currentItems.filter((item) => {
    const matchesQuery = `${item.title || ""} ${item.caption || item.excerpt || ""} ${item.album || ""}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesCategory = tab !== "gallery" || categoryFilter === "All" || item.category === categoryFilter;
    return matchesQuery && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    if (sort === "name") return String(a.title || "").localeCompare(String(b.title || ""));
    if (sort === "order") return Number(a.display_order || 0) - Number(b.display_order || 0);
    return new Date(b.updated_at || b.created_at || b.release_date || b.event_date || 0) - new Date(a.updated_at || a.created_at || a.release_date || a.event_date || 0);
  }), [currentItems, query, statusFilter, categoryFilter, sort, tab]);

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setEditorOpen(false);
    setEditGallery(undefined);
    setQuery("");
    setStatusFilter("All");
    setCategoryFilter("All");
    onSectionChange?.(nextTab);
  };

  const openNew = () => {
    if (tab === "gallery") {
      setEditGallery(undefined);
      setGalleryForm({
        ...emptyGallery,
        category: categoryFilter !== "All" ? categoryFilter : "Videos",
        display_order: gallery.length,
      });
      setEditorOpen(true);
    }
    if (tab === "press") { setEditPress(); setPressForm(emptyPress); setEditorOpen(true); }
    if (tab === "events") { setEditEvent(); setEventForm(emptyEvent); setEditorOpen(true); }
  };

  const openEditGallery = (item) => {
    setEditGallery(item.id);
    setGalleryForm({
      ...emptyGallery,
      ...item,
      image_url: item.image_url || item.thumbnail_url || "",
      thumbnail_url: item.thumbnail_url || item.image_url || "",
    });
    setEditorOpen(true);
  };

  return <section className="admin-media-page">
    <div className="admin-collection-head">
      <div>
        <span className="admin-section-kicker">Asset library</span>
        <h2>Media</h2>
        <p>Organize gallery images, video URLs, press releases, events and awards.</p>
      </div>
      <div className="media-head-actions">
        {tab === "gallery" ? (
          <>
            <button type="button" className="admin-primary" onClick={openNew}>+ Add video or item</button>
            <MediaUploader multiple label="Upload image(s)" onUploaded={addGallery} />
          </>
        ) : (
          <button type="button" className="admin-primary" onClick={openNew}>
            + Add {tab === "press" ? "press release" : "event or award"}
          </button>
        )}
      </div>
    </div>
    <div className="admin-pipeline-stats admin-media-stats">
      <article><span>Gallery assets</span><strong>{gallery.length}</strong></article>
      <article><span>Press releases</span><strong>{press.length}</strong></article>
      <article><span>Events & awards</span><strong>{events.length}</strong></article>
      <article><span>Featured</span><strong>{[...gallery, ...press, ...events].filter((item) => item.is_featured).length}</strong></article>
    </div>
    <div className="admin-subtabs">
      <button className={tab === "gallery" ? "is-active" : ""} onClick={() => changeTab("gallery")}>Gallery ({gallery.length})</button>
      <button className={tab === "press" ? "is-active" : ""} onClick={() => changeTab("press")}>Press Releases ({press.length})</button>
      <button className={tab === "events" ? "is-active" : ""} onClick={() => changeTab("events")}>Events & Awards ({events.length})</button>
    </div>
    <div className="admin-toolbar media-filterbar">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search media..." />
      {tab === "gallery" ? (
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="All">All categories</option>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      ) : null}
      <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
        <option value="All">All statuses</option>
        {statuses.map((status) => <option key={status}>{status}</option>)}
      </select>
      <select value={sort} onChange={(event) => setSort(event.target.value)}>
        <option value="newest">Recently updated</option>
        <option value="name">Name A-Z</option>
        <option value="order">Display order</option>
      </select>
    </div>

    {tab === "gallery" ? (
      <div className={`media-library-layout${editorOpen ? " is-editing" : ""}`}>
        {editorOpen ? (
          <Editor
            kind={editGallery ? "Edit gallery item" : "New gallery item / video"}
            onSubmit={saveGalleryItem}
            onCancel={() => { setEditorOpen(false); setEditGallery(undefined); }}
            upload={async (asset) => {
              setGalleryForm((value) => ({
                ...value,
                image_asset_id: asset.id,
                image_url: asset.public_url || value.image_url,
                thumbnail_url: asset.thumbnail_url || value.thumbnail_url,
              }));
              showAdminToast("Image attached", "Image asset linked to this gallery item.");
            }}
          >
            <Field label="Title *">
              <input required value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} placeholder="e.g. Construction Walkthrough" />
            </Field>
            <Field label="Category">
              <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Media Type">
              <select value={galleryForm.media_type} onChange={(e) => setGalleryForm({ ...galleryForm, media_type: e.target.value })}>
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
            </Field>
            <Field label="Album / Tag">
              <input value={galleryForm.album} onChange={(e) => setGalleryForm({ ...galleryForm, album: e.target.value })} placeholder="e.g. Interior Walkthrough" />
            </Field>
            <Field label="Video URL" wide>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... or .mp4 URL"
                value={galleryForm.video_url}
                onChange={(e) => {
                  const url = e.target.value;
                  const yt = youtubeThumb(url);
                  setGalleryForm((cur) => ({
                    ...cur,
                    video_url: url,
                    media_type: url.trim() ? "video" : cur.media_type,
                    category: (url.trim() && (!cur.category || cur.category === "Events")) ? "Videos" : cur.category,
                    thumbnail_url: cur.thumbnail_url || yt,
                    image_url: cur.image_url || yt,
                  }));
                }}
              />
              <small style={{ color: "#64748b", marginTop: 4, display: "block", fontSize: 11 }}>
                Paste a YouTube URL or direct video link. YouTube thumbnail is detected automatically.
              </small>
            </Field>
            <Field label="Custom Image / Thumbnail URL" wide>
              <input
                placeholder="https://... (or leave blank to use YouTube thumbnail / uploaded image)"
                value={galleryForm.thumbnail_url || galleryForm.image_url || ""}
                onChange={(e) => setGalleryForm({ ...galleryForm, thumbnail_url: e.target.value, image_url: e.target.value })}
              />
            </Field>
            <Field label="Caption" wide>
              <textarea rows="2" value={galleryForm.caption} onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })} placeholder="Optional description or caption" />
            </Field>
            <Field label="Alt text" wide>
              <input value={galleryForm.alt_text} onChange={(e) => setGalleryForm({ ...galleryForm, alt_text: e.target.value })} placeholder="Accessibility text describing the visual" />
            </Field>
            <StatusFields form={galleryForm} setForm={setGalleryForm} />
          </Editor>
        ) : null}
        <div className="admin-panel media-admin-panel">
          <div className="admin-panel__head">
            <h2>Gallery library</h2>
            <span className="admin-count">{filteredItems.length}</span>
          </div>
          <div className="media-admin-gallery">
            {filteredItems.length ? filteredItems.map((item) => (
              <article key={item.id} className="media-admin-card">
                <div className="media-thumb-wrap">
                  {item.thumbnail_url || item.image_url ? (
                    <img decoding="async" loading="lazy" src={item.thumbnail_url || item.image_url} alt="" />
                  ) : (
                    <div className="media-placeholder">VIDEO</div>
                  )}
                  {item.media_type === "video" && <span className="media-thumb-play" aria-hidden="true">&#9654;</span>}
                </div>
                <div className="media-card-content">
                  <input
                    aria-label="Media title"
                    placeholder="Media title"
                    value={item.title || ""}
                    onChange={(event) => setGallery((val) => val.map((entry) => entry.id === item.id ? { ...entry, title: event.target.value } : entry))}
                    onBlur={(event) => patchGallery(item, "title", event.target.value)}
                  />
                  <input
                    aria-label="Caption"
                    placeholder="Caption"
                    value={item.caption || ""}
                    onChange={(event) => setGallery((val) => val.map((entry) => entry.id === item.id ? { ...entry, caption: event.target.value } : entry))}
                    onBlur={(event) => patchGallery(item, "caption", event.target.value)}
                  />
                  <div className="media-gallery-meta">
                    <div className="media-field-cell">
                      <label>Category</label>
                      <select
                        aria-label="Category"
                        value={item.category || "Videos"}
                        onChange={(event) => patchGallery(item, "category", event.target.value)}
                      >
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="media-field-cell">
                      <label>Album / Tag</label>
                      <input
                        placeholder="Album"
                        value={item.album || ""}
                        onChange={(event) => setGallery((val) => val.map((entry) => entry.id === item.id ? { ...entry, album: event.target.value } : entry))}
                        onBlur={(event) => patchGallery(item, "album", event.target.value)}
                      />
                    </div>
                    <div className="media-field-cell media-field-cell--full">
                      <label>
                        Video URL {item.media_type === "video" && <span className="media-pill-tag">Video</span>}
                      </label>
                      <input
                        placeholder="https://www.youtube.com/watch?v=... or MP4"
                        value={item.video_url || ""}
                        onChange={(event) => setGallery((val) => val.map((entry) => entry.id === item.id ? { ...entry, video_url: event.target.value, media_type: event.target.value ? "video" : "image" } : entry))}
                        onBlur={(event) => patchGallery(item, "video_url", event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="admin-actions">
                    <button type="button" className="admin-edit-btn" onClick={() => openEditGallery(item)}>Edit details</button>
                    <select
                      aria-label="Publishing status"
                      value={item.status}
                      onChange={(event) => patchGallery(item, "status", event.target.value)}
                    >
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <button type="button" onClick={() => patchGallery(item, "is_featured", !item.is_featured)}>
                      {item.is_featured ? "Featured" : "Set featured"}
                    </button>
                    <button type="button" onClick={() => patchGallery(item, "display_order", Math.max(0, (item.display_order || 0) - 1))}>
                      Up
                    </button>
                    <button type="button" onClick={() => patchGallery(item, "display_order", (item.display_order || 0) + 1)}>
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm("Delete gallery item permanently?")) {
                          await window.RuchiBackend.media.deleteGallery(item.id);
                          load();
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )) : (
              <div className="admin-empty-state">
                <span>□</span>
                <h3>No media found</h3>
                <p>Upload a new asset, add a video, or adjust the active filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : null}

    {tab === "press" ? <div className={`media-library-layout${editorOpen ? " is-editing" : ""}`}>
      {editorOpen ? <Editor kind={editPress ? "Edit press release" : "New press release"} onSubmit={savePress} onCancel={() => setEditorOpen(false)} upload={async (asset) => setPressForm((value) => ({ ...value, cover_asset_id: asset.id }))}>
        <Field label="Title"><input required value={pressForm.title} onChange={(event) => setPressForm({ ...pressForm, title: event.target.value })} /></Field><Field label="Slug"><input value={pressForm.slug} onChange={(event) => setPressForm({ ...pressForm, slug: event.target.value })} /></Field><Field label="Release date"><input type="date" value={pressForm.release_date} onChange={(event) => setPressForm({ ...pressForm, release_date: event.target.value })} /></Field><Field label="Source / publication"><input value={pressForm.source_name} onChange={(event) => setPressForm({ ...pressForm, source_name: event.target.value })} /></Field><Field label="Author"><input value={pressForm.author} onChange={(event) => setPressForm({ ...pressForm, author: event.target.value })} /></Field><Field label="Excerpt" wide><textarea rows="3" value={pressForm.excerpt} onChange={(event) => setPressForm({ ...pressForm, excerpt: event.target.value })} /></Field><Field label="Full content" wide><textarea rows="8" value={pressForm.content} onChange={(event) => setPressForm({ ...pressForm, content: event.target.value })} /></Field><Field label="PDF URL"><input value={pressForm.pdf_url} onChange={(event) => setPressForm({ ...pressForm, pdf_url: event.target.value })} /></Field><Field label="External article URL"><input value={pressForm.external_url} onChange={(event) => setPressForm({ ...pressForm, external_url: event.target.value })} /></Field><InternalLinksEditor links={pressForm.internal_links} onChange={(links) => setPressForm({ ...pressForm, internal_links: links })} /><SeoFields form={pressForm} setForm={setPressForm} /><StatusFields form={pressForm} setForm={setPressForm} />
      </Editor> : null}<div className="admin-panel media-record-panel"><div className="admin-panel__head"><h2>Press releases</h2><span className="admin-count">{filteredItems.length}</span></div><Records items={filteredItems} dateKey="release_date" edit={(item) => { setEditPress(item.id); setPressForm({ ...emptyPress, ...item, release_date: item.release_date || "" }); setEditorOpen(true); }} remove={async (id) => { await window.RuchiBackend.media.deletePress(id); load(); }} /></div></div> : null}

    {tab === "events" ? <div className={`media-library-layout${editorOpen ? " is-editing" : ""}`}>
      {editorOpen ? <Editor kind={editEvent ? "Edit event or award" : "New event or award"} onSubmit={saveEvent} onCancel={() => setEditorOpen(false)} upload={async (asset) => setEventForm((value) => ({ ...value, cover_asset_id: asset.id }))}>
        <Field label="Title"><input required value={eventForm.title} onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })} /></Field><Field label="Slug"><input value={eventForm.slug} onChange={(event) => setEventForm({ ...eventForm, slug: event.target.value })} /></Field><Field label="Type"><select value={eventForm.item_type} onChange={(event) => setEventForm({ ...eventForm, item_type: event.target.value })}>{types.map((type) => <option key={type}>{type}</option>)}</select></Field><Field label="Event date"><input type="date" value={eventForm.event_date} onChange={(event) => setEventForm({ ...eventForm, event_date: event.target.value })} /></Field><Field label="Location"><input value={eventForm.location} onChange={(event) => setEventForm({ ...eventForm, location: event.target.value })} /></Field><Field label="Short description" wide><textarea rows="3" value={eventForm.excerpt} onChange={(event) => setEventForm({ ...eventForm, excerpt: event.target.value })} /></Field><Field label="Full description" wide><textarea rows="6" value={eventForm.description} onChange={(event) => setEventForm({ ...eventForm, description: event.target.value })} /></Field><Field label="Video URL"><input type="url" placeholder="https://youtube.com/..." value={eventForm.video_url} onChange={(event) => setEventForm({ ...eventForm, video_url: event.target.value })} /></Field><Field label="External link"><input value={eventForm.external_url} onChange={(event) => setEventForm({ ...eventForm, external_url: event.target.value })} /></Field><Field label="Related project slug"><input value={eventForm.related_project_slug} onChange={(event) => setEventForm({ ...eventForm, related_project_slug: event.target.value })} /></Field><InternalLinksEditor links={eventForm.internal_links} onChange={(links) => setEventForm({ ...eventForm, internal_links: links })} /><SeoFields form={eventForm} setForm={setEventForm} /><StatusFields form={eventForm} setForm={setEventForm} />
      </Editor> : null}<div className="admin-panel media-record-panel"><div className="admin-panel__head"><h2>Events & awards</h2><span className="admin-count">{filteredItems.length}</span></div><Records items={filteredItems} dateKey="event_date" edit={(item) => { setEditEvent(item.id); setEventForm({ ...emptyEvent, ...item, event_date: item.event_date || "" }); setEditorOpen(true); }} remove={async (id) => { await window.RuchiBackend.media.deleteEvent(id); load(); }} /></div></div> : null}
  </section>;
}
