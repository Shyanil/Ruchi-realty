import { supabase } from './supabase';
import { APP_NAME, CONTACT_INFO, SOCIAL_LINKS } from '../utils/constants';

const mapsEmbed = (address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
const mapsLink = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

// Built-in defaults — the site renders with these until settings are saved.
export const DEFAULT_SETTINGS = {
  siteName: APP_NAME,
  phone: CONTACT_INFO.phone,
  whatsapp: CONTACT_INFO.whatsapp,
  email: CONTACT_INFO.email,
  address: CONTACT_INFO.address,
  workingHours: CONTACT_INFO.workingHours,
  mapEmbedUrl: mapsEmbed(CONTACT_INFO.address),
  mapLink: mapsLink(CONTACT_INFO.address),
  facebook: SOCIAL_LINKS.facebook,
  instagram: SOCIAL_LINKS.instagram,
  youtube: SOCIAL_LINKS.youtube,
  linkedin: SOCIAL_LINKS.linkedin,
};

// DB row (snake_case) → app settings (camelCase), keeping defaults for blanks.
const fromRow = (row) => {
  if (!row) return { ...DEFAULT_SETTINGS };
  const mapped = {
    siteName: row.site_name,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    workingHours: row.working_hours,
    mapEmbedUrl: row.map_embed_url,
    mapLink: row.map_link,
    facebook: row.facebook,
    instagram: row.instagram,
    youtube: row.youtube,
    linkedin: row.linkedin,
  };
  const out = { ...DEFAULT_SETTINGS };
  Object.keys(mapped).forEach((key) => {
    const value = mapped[key];
    if (value !== null && value !== undefined && value !== '') out[key] = value;
  });
  // If admin set an address but no explicit map, derive the map from the address.
  if (row.address && !row.map_embed_url) out.mapEmbedUrl = mapsEmbed(row.address);
  if (row.address && !row.map_link) out.mapLink = mapsLink(row.address);
  return out;
};

const toRow = (settings) => ({
  id: 1,
  site_name: settings.siteName || null,
  phone: settings.phone || null,
  whatsapp: settings.whatsapp || null,
  email: settings.email || null,
  address: settings.address || null,
  working_hours: settings.workingHours || null,
  map_embed_url: settings.mapEmbedUrl || null,
  map_link: settings.mapLink || null,
  facebook: settings.facebook || null,
  instagram: settings.instagram || null,
  youtube: settings.youtube || null,
  linkedin: settings.linkedin || null,
  updated_at: new Date().toISOString(),
});

let cache = null;
let inflight = null;

export const settingsService = {
  getCached() {
    return cache;
  },

  async getSettings({ force = false } = {}) {
    if (cache && !force) return { data: cache, error: null };
    if (inflight && !force) return inflight;

    inflight = supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        inflight = null;
        const settings = fromRow(data);
        cache = settings;
        return { data: settings, error };
      });

    return inflight;
  },

  async updateSettings(settings) {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert(toRow(settings), { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (!error) cache = fromRow(data);
    return { data: cache, error };
  },
};
