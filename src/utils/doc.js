export function toIdString(id) {
  if (id == null) return '';
  if (typeof id === 'string') return id;
  if (typeof id === 'object') {
    if (id.$oid) return String(id.$oid);
    if (typeof id.toString === 'function' && id.toString !== Object.prototype.toString) {
      const s = id.toString();
      if (s && s !== '[object Object]') return s;
    }
  }
  return String(id);
}

export function shortId(id) {
  const s = toIdString(id);
  return s.length >= 6 ? s.slice(-6).toUpperCase() : s || '—';
}

export function normalizeDoc(doc) {
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) return doc;
  const id = toIdString(doc._id ?? doc.id);
  return id ? { ...doc, _id: id } : { ...doc };
}

export function unwrapList(data, preferredKey) {
  if (Array.isArray(data)) return data.map(normalizeDoc);
  if (data && typeof data === 'object') {
    const keys = [preferredKey, 'data', 'items', 'results'].filter(Boolean);
    for (const key of keys) {
      if (Array.isArray(data[key])) return data[key].map(normalizeDoc);
    }
  }
  return [];
}
