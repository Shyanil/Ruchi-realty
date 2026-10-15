export function compareMediaOrder(a, b) {
  const aOrder = a.display_order == null ? Number.MAX_SAFE_INTEGER : Number(a.display_order);
  const bOrder = b.display_order == null ? Number.MAX_SAFE_INTEGER : Number(b.display_order);
  if (aOrder !== bOrder) return aOrder - bOrder;
  const dateField = 'release_date' in a ? 'release_date' : 'event_date' in a ? 'event_date' : 'created_at';
  const aDate = Date.parse(a[dateField] || '') || 0;
  const bDate = Date.parse(b[dateField] || '') || 0;
  const dateDifference = dateField === 'created_at' ? aDate - bDate : bDate - aDate;
  return dateDifference || String(a.id).localeCompare(String(b.id));
}

export function sortMediaByOrder(items) {
  return [...items].sort(compareMediaOrder);
}

export function mediaScope(items, item, section) {
  return sortMediaByOrder(section === 'gallery'
    ? items.filter((entry) => entry.category === item.category)
    : items);
}

export function planMediaPosition(items, id, targetPosition, section) {
  const item = items.find((entry) => entry.id === id);
  if (!item || !Number.isInteger(targetPosition) || targetPosition < 0) return [];
  const ordered = mediaScope(items, item, section);
  const index = ordered.findIndex((item) => item.id === id);
  const next = Math.min(targetPosition, ordered.length - 1);
  if (index < 0 || index === next && ordered.every((entry, position) => Number(entry.display_order) === position)) return [];
  ordered.splice(next, 0, ...ordered.splice(index, 1));
  return ordered.map((item, position) => ({
    id: item.id,
    display_order: position,
    previous_order: item.display_order,
  })).filter((item) => item.previous_order == null || Number(item.previous_order) !== item.display_order);
}
