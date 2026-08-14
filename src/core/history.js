/**
 * Story History Management with Storage Abstraction
 */

import { storage, KEYS } from './storage.js';

/**
 * Loads stories list from domain storage (with legacy fallback)
 */
export function loadHistory() {
  let stories = storage.get(KEYS.STORIES_INDEX);
  
  if (!stories || !Array.isArray(stories)) {
    // Migration fallback from legacy key
    const legacy = storage.get(KEYS.LEGACY_HISTORY);
    if (Array.isArray(legacy)) {
      stories = legacy;
      storage.set(KEYS.STORIES_INDEX, stories);
    } else {
      stories = [];
    }
  }

  return stories.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

/**
 * Saves history array to domain storage
 */
function saveHistoryDomain(stories) {
  storage.set(KEYS.STORIES_INDEX, stories);
  // Keep legacy key updated for safety
  storage.set(KEYS.LEGACY_HISTORY, stories);
}

/**
 * Saves or updates a story item in history
 */
export function saveStory(storyItem) {
  if (!storyItem.id) {
    storyItem.id = 'story_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }

  storyItem.updatedAt = Date.now();
  if (!storyItem.createdAt) {
    storyItem.createdAt = Date.now();
  }

  const stories = loadHistory();
  const existingIdx = stories.findIndex(s => s.id === storyItem.id);

  if (existingIdx >= 0) {
    stories[existingIdx] = { ...stories[existingIdx], ...storyItem };
  } else {
    stories.unshift(storyItem);
  }

  saveHistoryDomain(stories);
  return storyItem;
}

/**
 * Deletes a story by ID
 */
export function deleteStory(id) {
  let stories = loadHistory();
  stories = stories.filter(s => s.id !== id);
  saveHistoryDomain(stories);
  return stories;
}

/**
 * Retrieves a single story by ID
 */
export function getStoryById(id) {
  const stories = loadHistory();
  return stories.find(s => s.id === id) || null;
}
