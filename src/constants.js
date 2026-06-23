export const INSTAGRAM_URL = 'https://instagram.com/taravee.studio';
export const INSTAGRAM_DM = 'https://ig.me/m/taravee.studio';
export const INSTAGRAM_HANDLE = 'taravee.studio';

export const TOKEN_KEY = 'taravee_admin_token';
export const ADMIN_KEY = 'taravee_admin_user';

// Set EXPO_PUBLIC_API_URL in .env (e.g. https://yoursite.com/api)
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || 'https://taraveestudio.com/api';

export function instagramDmLink(pieceName) {
  const text = `Hi! I'm interested in the ${
    pieceName || 'piece'
  } listed on Taravee Studio. Could you share the price? 🌸`;
  return `${INSTAGRAM_DM}?text=${encodeURIComponent(text)}`;
}

export function unsplashUrl(base, { w = 1920, q = 80 } = {}) {
  if (!base) return base;
  return base.includes('?') ? base : `${base}?w=${w}&q=${q}&auto=format&fit=crop`;
}
