import { API_BASE_URL } from '../constants';

export function getApiOrigin() {
  return API_BASE_URL.replace(/\/api\/?$/, '');
}

export function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const origin = getApiOrigin();
  if (trimmed.startsWith('/')) return `${origin}${trimmed}`;
  return `${origin}/${trimmed}`;
}

export function getPhotoUri(photo) {
  if (!photo) return null;
  if (typeof photo === 'string') return resolveMediaUrl(photo);
  return resolveMediaUrl(photo.url || photo.secure_url || photo.path || photo.src);
}
