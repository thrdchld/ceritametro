/**
 * Story history management with LocalStorage & Supabase sync
 */

import {
  initSupabase,
  isSupabaseActive,
  syncStoryToSupabase,
  fetchStoriesFromSupabase,
  deleteStoryFromSupabase
} from './supabase-client.js';

import { getSettings } from './storage.js';

const STORAGE_KEY_HISTORY = 'cerita_metro_history';

/**
 * Initializes Supabase connection if configured in settings
 */
export function setupHistorySupabase() {
  const settings = getSettings();
  if (settings.supabaseUrl && settings.supabaseAnonKey) {
    initSupabase(settings.supabaseUrl, settings.supabaseAnonKey);
  }
}

/**
 * Loads stories list from localStorage (and optionally syncs from Supabase)
 */
export async function loadHistory() {
  let localStories = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      localStories = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading history from localStorage:', err);
  }

  // Attempt sync with Supabase if active
  setupHistorySupabase();
  if (isSupabaseActive()) {
    const cloudStories = await fetchStoriesFromSupabase();
    if (cloudStories && Array.isArray(cloudStories)) {
      // Merge local and cloud stories based on ID & timestamp
      const mergedMap = new Map();
      
      // Put local stories first
      localStories.forEach(s => mergedMap.set(s.id, s));
      
      // Merge/overwrite with cloud stories if newer or missing locally
      cloudStories.forEach(cs => {
        if (!mergedMap.has(cs.id) || (cs.updatedAt && cs.updatedAt > (mergedMap.get(cs.id).updatedAt || 0))) {
          mergedMap.set(cs.id, cs);
        }
      });

      const mergedList = Array.from(mergedMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      saveHistoryLocalOnly(mergedList);
      return mergedList;
    }
  }

  return localStories.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

/**
 * Helper to write history to localStorage only
 */
function saveHistoryLocalOnly(stories) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(stories));
  } catch (err) {
    console.error('Error saving history to localStorage:', err);
  }
}

/**
 * Saves or updates a story in history (localStorage + Supabase)
 */
export async function saveStory(storyItem) {
  if (!storyItem.id) {
    storyItem.id = 'story_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  storyItem.updatedAt = Date.now();
  if (!storyItem.createdAt) {
    storyItem.createdAt = Date.now();
  }

  const stories = await loadHistory();
  const existingIdx = stories.findIndex(s => s.id === storyItem.id);

  if (existingIdx >= 0) {
    stories[existingIdx] = { ...stories[existingIdx], ...storyItem };
  } else {
    stories.unshift(storyItem);
  }

  saveHistoryLocalOnly(stories);

  // Sync to Supabase in background
  setupHistorySupabase();
  if (isSupabaseActive()) {
    syncStoryToSupabase(storyItem).catch(err => console.warn('Supabase sync warning:', err));
  }

  return storyItem;
}

/**
 * Deletes a story by ID
 */
export async function deleteStory(id) {
  let stories = await loadHistory();
  stories = stories.filter(s => s.id !== id);
  saveHistoryLocalOnly(stories);

  setupHistorySupabase();
  if (isSupabaseActive()) {
    deleteStoryFromSupabase(id).catch(err => console.warn('Supabase delete warning:', err));
  }

  return stories;
}

/**
 * Retrieves a single story by ID
 */
export async function getStoryById(id) {
  const stories = await loadHistory();
  return stories.find(s => s.id === id) || null;
}
