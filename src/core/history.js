/**
 * Story history management with LocalStorage
 */

const STORAGE_KEY_HISTORY = 'cerita_metro_history';

/**
 * Loads stories list from localStorage
 */
export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const stories = JSON.parse(raw);
    return stories.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (err) {
    console.error('Error loading history from localStorage:', err);
    return [];
  }
}

/**
 * Saves history array to localStorage
 */
function saveHistoryLocal(stories) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(stories));
  } catch (err) {
    console.error('Error saving history to localStorage:', err);
  }
}

/**
 * Saves or updates a story in history
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

  saveHistoryLocal(stories);
  return storyItem;
}

/**
 * Deletes a story by ID
 */
export function deleteStory(id) {
  let stories = loadHistory();
  stories = stories.filter(s => s.id !== id);
  saveHistoryLocal(stories);
  return stories;
}

/**
 * Retrieves a single story by ID
 */
export function getStoryById(id) {
  const stories = loadHistory();
  return stories.find(s => s.id === id) || null;
}
