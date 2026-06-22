import { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, settingsService } from '../services/settingsService';

// Read-only site settings for public components. Starts from the cached/default
// values (so there is no empty flash) and updates once the DB read resolves.
export function useSiteSettings() {
  const [settings, setSettings] = useState(() => settingsService.getCached() || DEFAULT_SETTINGS);

  useEffect(() => {
    let active = true;
    settingsService.getSettings().then(({ data }) => {
      if (active && data) setSettings(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return settings;
}
