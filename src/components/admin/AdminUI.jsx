import { AdminIcon } from "./AdminShell";

export function PageHeader({ eyebrow, title, description, actions }) {
  return <div className="admin-page-head"><div>{eyebrow ? <span>{eyebrow}</span> : null}<h2>{title}</h2>{description ? <p>{description}</p> : null}</div>{actions ? <div className="admin-page-head__actions">{actions}</div> : null}</div>;
}

export function StatusBadge({ value = "Unknown" }) {
  const key = String(value).toLowerCase().replace(/\s+/g, "-");
  return <span className={`admin-status admin-status--${key}`}><i />{value}</span>;
}

export function StatCard({ icon, label, value, detail, onClick, tone = "default" }) {
  const Tag = onClick ? "button" : "article";
  return <Tag type={onClick ? "button" : undefined} className={`admin-stat-card admin-stat-card--${tone}`} onClick={onClick}>
    <span className="admin-stat-card__icon"><AdminIcon name={icon} /></span>
    <span className="admin-stat-card__copy"><small>{label}</small><strong>{value}</strong><em>{detail}</em></span>
  </Tag>;
}

export function EmptyState({ icon = "document", title, description, action }) {
  return <div className="admin-empty-state"><span><AdminIcon name={icon} size={24} /></span><h3>{title}</h3><p>{description}</p>{action || null}</div>;
}

export function LoadingState({ rows = 4 }) {
  return <div className="admin-skeleton-list" aria-label="Loading">{Array.from({ length: rows }, (_, index) => <span key={index} />)}</div>;
}

export function DonutChart({ data, total, label }) {
  const colors = ["#3437a6", "#b7cf3e", "#716fd1", "#e2a844", "#43a58a", "#87909d"];
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return <div className="admin-donut-layout">
    <div className="admin-donut admin-donut--svg">
      <svg viewBox="0 0 180 180" role="img" aria-label={`${label}: ${total}`}>
        <circle className="admin-donut__track" cx="90" cy="90" r={radius} />
        {total ? data.map((item, index) => {
          const length = (item.value / total) * circumference;
          const dashOffset = -offset;
          offset += length;
          return <circle key={item.label} className="admin-donut__segment" cx="90" cy="90" r={radius} stroke={colors[index % colors.length]} strokeDasharray={`${Math.max(0, length - 5)} ${circumference - Math.max(0, length - 5)}`} strokeDashoffset={dashOffset}><title>{item.label}: {item.value}</title></circle>;
        }) : null}
      </svg>
      <div><strong>{total}</strong><span>{label}</span><small>{data.length} statuses</small></div>
    </div>
    <div className="admin-chart-legend admin-chart-legend--rich">{data.map((item, index) => <div key={item.label}><i style={{ background: colors[index % colors.length] }} /><span>{item.label}<small>{total ? Math.round((item.value / total) * 100) : 0}% of portfolio</small></span><strong>{item.value}</strong></div>)}</div>
  </div>;
}

export function BarChart({ data }) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return <div className="admin-bars">{data.map((item) => <div key={item.label}><span>{item.label}</span><div><i style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }} /></div><strong>{item.value}</strong></div>)}</div>;
}

export function ColumnChart({ data }) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return <div className="admin-columns" role="img" aria-label="Column chart">
    {data.map((item, index) => <div className="admin-column" key={item.label}>
      <strong>{item.value}</strong>
      <div><i style={{ height: `${Math.max(8, (item.value / max) * 100)}%`, "--column-index": index }} /></div>
      <span title={item.label}>{item.label}</span>
    </div>)}
  </div>;
}
