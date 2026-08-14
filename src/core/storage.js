/**
 * Configuration & Settings storage manager using localStorage
 */

const STORAGE_KEY_SETTINGS = 'cerita_metro_settings';

export const DEFAULT_SETTINGS = {
  endpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-4o-mini',
  imageEndpoint: 'https://api.openai.com/v1/images/generations',
  imageApiKey: '',
  imageModel: 'dall-e-3'
};

/**
 * Loads saved settings merged with defaults
 */
export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Error loading settings:', err);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Saves updated settings to localStorage
 */
export function saveSettings(newSettings) {
  try {
    const current = getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving settings:', err);
    throw new Error('Gagal menyimpan pengaturan ke localStorage.');
  }
}
