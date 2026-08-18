import { useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  return new Promise((resolve, reject) => {
    let script = document.getElementById(TURNSTILE_SCRIPT_ID);
    const onLoad = () => resolve(window.turnstile);
    const onError = () => reject(new Error("Could not load Cloudflare Turnstile."));

    if (!script) {
      script = document.createElement("script");
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
  });
}

export default function CommentSection({ blogId }) {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", comment: "", website: "" });
  const [state, setState] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaState, setCaptchaState] = useState("loading");
  const [submitting, setSubmitting] = useState(false);
  const captchaRef = useRef(null);
  const widgetIdRef = useRef(null);

  const load = async () => {
    if (!blogId) return;
    const { data } = await window.RuchiBackend.blogs.getApprovedComments(blogId);
    setComments(data || []);
  };

  useEffect(() => {
    load();
  }, [blogId]);

  useEffect(() => {
    let cancelled = false;

    const setupTurnstile = async () => {
      try {
        const [turnstile, configResponse] = await Promise.all([
          loadTurnstile(),
          fetch("/api/blog-comments", { headers: { Accept: "application/json" } }),
        ]);
        const config = await configResponse.json().catch(() => ({}));
        if (!configResponse.ok || !config.siteKey) throw new Error(config.error || "Comment verification is not configured.");
        if (cancelled || !captchaRef.current) return;

        widgetIdRef.current = turnstile.render(captchaRef.current, {
          sitekey: config.siteKey,
          action: "blog_comment",
          theme: "light",
          size: "flexible",
          callback: (token) => {
            setTurnstileToken(token);
            setCaptchaState("ready");
          },
          "expired-callback": () => {
            setTurnstileToken("");
            setCaptchaState("expired");
          },
          "error-callback": () => {
            setTurnstileToken("");
            setCaptchaState("error");
          },
        });
      } catch (error) {
        if (!cancelled) {
          setCaptchaState("error");
          setState(error.message || "Could not load security verification.");
        }
      }
    };

    setupTurnstile();
    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, []);

  const resetTurnstile = () => {
    setTurnstileToken("");
    setCaptchaState("loading");
    if (widgetIdRef.current !== null && window.turnstile) window.turnstile.reset(widgetIdRef.current);
  };

  const submit = async (event) => {
    event.preventDefault();
    setState("");
    if (form.website || form.comment.trim().length < 10) {
      setState("Please write at least 10 characters.");
      return;
    }
    if (!turnstileToken) {
      setState("Please complete the security verification.");
      return;
    }
    const last = Number(localStorage.getItem("ruchi_comment_at") || 0);
    if (Date.now() - last < 60000) {
      setState("Please wait a minute before posting another comment.");
      return;
    }
    setSubmitting(true);
    const { error } = await window.RuchiBackend.blogs.createComment(blogId, { ...form, turnstileToken });
    setSubmitting(false);
    resetTurnstile();
    if (error) {
      setState(error.message);
    } else {
      localStorage.setItem("ruchi_comment_at", Date.now());
      setForm({ name: "", email: "", comment: "", website: "" });
      setState("Thank you. Your comment is awaiting moderation.");
    }
  };

  return (
    <section className="comments" id="comments">
      <div className="comments__header">
        <h2>Comments</h2>
        <span className="comments__count" aria-label={`${comments.length} approved comments`}>
          {comments.length}
        </span>
      </div>

      {comments.length ? (
        <div className="comment-list">
          {comments.map((item) => (
            <article key={item.id}>
              <div className="comment-list__meta">
                <strong>{item.name}</strong>
                <time>{new Date(item.created_at).toLocaleDateString("en-IN")}</time>
              </div>
              <p>{item.comment}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="comments__empty">No approved comments yet. Start the conversation.</p>
      )}

      <form className="comments__form" onSubmit={submit}>
        <h3>Leave a comment</h3>
        <div className="comments__form-card">
          <div className="comment-fields">
            <label>
              Name
              <input required maxLength="80" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>
              Email
              <input required type="email" maxLength="160" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
          </div>
          <input
            className="comment-hp"
            aria-hidden="true"
            aria-label="Website"
            name="website"
            tabIndex="-1"
            autoComplete="off"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />
          <label>
            Comment
            <textarea required minLength="10" maxLength="3000" rows="6" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          </label>
          <div className="comments__captcha">
            <span>Verify you are human</span>
            <div ref={captchaRef} />
            {captchaState === "loading" && <small>Loading security verification…</small>}
            {captchaState === "expired" && <small>Verification expired. Please verify again.</small>}
            {captchaState === "error" && <small>Security verification could not load. Please refresh and try again.</small>}
          </div>
          <button type="submit" disabled={submitting || !turnstileToken}>
            {submitting ? "Submitting…" : "Submit for review"}
          </button>
          {state && <p className="comments__status" role="status">{state}</p>}
        </div>
      </form>
    </section>
  );
}
