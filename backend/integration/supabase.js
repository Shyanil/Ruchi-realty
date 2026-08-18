import { createClient } from '@supabase/supabase-js';

const SUPABASE_CONFIG = Object.freeze({
  url: import.meta.env?.VITE_SUPABASE_URL || globalThis?.process?.env?.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || globalThis?.process?.env?.VITE_SUPABASE_ANON_KEY || '',
});

export const isSupabaseConfigured = Boolean(
  SUPABASE_CONFIG.url.startsWith('https://') && SUPABASE_CONFIG.anonKey.startsWith('eyJ')
);

const disabledResult = () => ({
  data: null,
  error: new Error('Supabase is not configured. Add its URL and anon key to the environment.'),
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

export const uploadAdminImage = async (file, folder) => {
  const validationError = validateAdminImage(file);
  if (validationError) {
    return { data: null, error: new Error(validationError) };
  }

  const bucket = folder === 'blogs' ? 'blog-images' : 'project-images';
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || 'image/webp',
  });
  if (error) {
    return { data: null, error };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { data: data.publicUrl, error: null };
};
