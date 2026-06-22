import { createClient } from '@supabase/supabase-js';

const SUPABASE_CONFIG = Object.freeze({
  url: '',
  anonKey: '',
});

export const isSupabaseConfigured = Boolean(
  SUPABASE_CONFIG.url.startsWith('https://') && SUPABASE_CONFIG.anonKey.startsWith('eyJ')
);

const disabledResult = () => ({
  data: null,
  error: new Error('Supabase is not configured. Add your project URL and anon key in backend/integration/supabase.js.'),
});

const createDisabledQuery = () => {
  const query = {
    select: () => query,
    insert: () => query,
    update: () => query,
    upsert: () => query,
    delete: () => query,
    eq: () => query,
    order: () => query,
    maybeSingle: () => Promise.resolve(disabledResult()),
    single: () => Promise.resolve(disabledResult()),
    then: (resolve, reject) => Promise.resolve(disabledResult()).then(resolve, reject),
    catch: (reject) => Promise.resolve(disabledResult()).catch(reject),
  };
  return query;
};

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : {
      from: () => createDisabledQuery(),
      auth: {
        signInWithPassword: async () => disabledResult(),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
    };

const MAX_IMAGE_SIZE_BYTES = 200 * 1024;

export const validateAdminImage = (file) => {
  if (!file) {
    return 'Please choose a WebP image.';
  }

  const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');
  if (!isWebp) {
    return 'Only .webp images are allowed.';
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image must be 200 KB or smaller.';
  }

  return null;
};

const UPLOAD_ENDPOINT = '';
const UPLOAD_API_KEY = '';

// Uploads an admin image to an external image host and returns its public URL.
// Until UPLOAD_ENDPOINT / UPLOAD_API_KEY are filled, use direct image URLs in
// the dummy admin panel.
export const uploadAdminImage = async (file, folder) => {
  const validationError = validateAdminImage(file);
  if (validationError) {
    return { data: null, error: new Error(validationError) };
  }

  if (!UPLOAD_ENDPOINT || !UPLOAD_API_KEY) {
    return {
      data: null,
      error: new Error('Image upload is not configured. Add your upload endpoint/API key or paste an image URL manually.'),
    };
  }

  const formData = new FormData();
  formData.append('folder', folder);
  formData.append('image', file, file.name);

  try {
    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      headers: { 'X-API-KEY': UPLOAD_API_KEY },
      body: formData,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success || !result?.url) {
      const message = result?.error || result?.message || 'Image upload failed. Please try again.';
      return { data: null, error: new Error(message) };
    }

    return { data: result.url, error: null };
  } catch {
    return { data: null, error: new Error('Could not reach the image server. Please try again.') };
  }
};
