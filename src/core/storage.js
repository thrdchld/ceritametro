/**
 * Storage Abstraction Layer for Local-First Storage Management
 */

// Domain Key Constants
export const KEYS = {
  APP_SETTINGS: 'ceritametro.app.settings',
  AI_SETTINGS: 'ceritametro.ai.settings',
  WRITING_BRAIN_ENTRIES: 'ceritametro.writingbrain.entries',
  WRITING_BRAIN_PROFILE: 'ceritametro.writingbrain.profile',
  WRITING_BRAIN_VERSION_HISTORY: 'ceritametro.writingbrain.versionHistory',
  RESEARCH_SESSIONS: 'ceritametro.research.sessions',
  BRAINSTORM_CONVERSATIONS: 'ceritametro.brainstorm.conversations',
  STORIES_INDEX: 'ceritametro.stories.index',
  STORY_ITEM_PREFIX: 'ceritametro.stories.item.',
  BACKUP_HISTORY: 'ceritametro.backup.history',
  
  // Legacy Key
  LEGACY_SETTINGS: 'cerita_metro_settings',
  LEGACY_HISTORY: 'cerita_metro_history'
};

export const DEFAULT_SETTINGS = {
  endpoint: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-4o-mini',
  imageEndpoint: 'https://api.openai.com/v1/images/generations',
  imageApiKey: '',
  imageModel: 'dall-e-3'
};

const memoryStore = new Map();

/**
 * Storage Interface Abstraction
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      if (typeof localStorage === 'undefined') {
        return memoryStore.has(key) ? memoryStore.get(key) : defaultValue;
      }
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return defaultValue;
      return JSON.parse(raw);
    } catch (err) {
      console.error(`Storage get error [key: ${key}]:`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      if (typeof localStorage === 'undefined') {
        memoryStore.set(key, value);
        return true;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Storage set error [key: ${key}]:`, err);
      return false;
    }
  },

  remove(key) {
    try {
      if (typeof localStorage === 'undefined') {
        memoryStore.delete(key);
        return true;
      }
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`Storage remove error [key: ${key}]:`, err);
      return false;
    }
  },

  keys() {
    try {
      if (typeof localStorage === 'undefined') {
        return Array.from(memoryStore.keys());
      }
      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        allKeys.push(localStorage.key(i));
      }
      return allKeys;
    } catch (err) {
      console.error('Storage keys error:', err);
      return [];
    }
  },

  clearAllDomainData() {
    try {
      if (typeof localStorage === 'undefined') {
        memoryStore.clear();
        return true;
      }
      const allKeys = this.keys();
      allKeys.forEach(k => {
        if (k.startsWith('ceritametro.') || k.startsWith('cerita_metro_')) {
          localStorage.removeItem(k);
        }
      });
      return true;
    } catch (err) {
      console.error('Storage clear error:', err);
      return false;
    }
  }
};

/**
 * Backward compatible getSettings helper
 */
export function getSettings() {
  const current = storage.get(KEYS.AI_SETTINGS);
  if (current) {
    return { ...DEFAULT_SETTINGS, ...current };
  }
  
  // Migration check from legacy key
  const legacy = storage.get(KEYS.LEGACY_SETTINGS);
  if (legacy) {
    const merged = { ...DEFAULT_SETTINGS, ...legacy };
    storage.set(KEYS.AI_SETTINGS, merged);
    return merged;
  }

  return { ...DEFAULT_SETTINGS };
}

/**
 * Backward compatible saveSettings helper
 */
export function saveSettings(newSettings) {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  storage.set(KEYS.AI_SETTINGS, updated);
  // Also save to legacy key for safety
  storage.set(KEYS.LEGACY_SETTINGS, updated);
  return updated;
}
