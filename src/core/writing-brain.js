/**
 * Evolving Writing Brain Domain Manager
 */

import { storage, KEYS } from './storage.js';
import initialWritingBrainSeed from '../data/writing-brain.json' with { type: 'json' };

export const BRAIN_CATEGORIES = [
  'Core Writing Principles',
  'Metro-Pop Style',
  'Indonesian Prose',
  'Character',
  'Dialogue',
  'Scene',
  'Emotion',
  'Pacing',
  'Mystery',
  'Plot Twist',
  'Open Ending',
  'Facebook Readability',
  'Humanization',
  'Anti-AI Patterns',
  'Visual / Image Storytelling',
  'User Preferences',
  'Learned Rules',
  'Research Knowledge'
];

export const DEFAULT_STYLE_PROFILE = {
  language: 'natural Indonesian',
  prose: 'concrete and restrained',
  paragraphs: 'short to medium',
  dialogue: 'natural with subtext',
  emotion: 'shown through behavior',
  description: 'specific but restrained',
  pacing: 'medium',
  metaphor: 'low',
  ending: 'open or bittersweet when suitable',
  mystery: 'realistic and logical',
  avoid: ['AI phrases', 'exposition dumps', 'explicit moralizing endings']
};

/**
 * Maps raw json seed to structured KnowledgeEntry array
 */
function seedEntriesFromJson(jsonSeed) {
  const entries = [];
  const categoryMap = {
    narrative: 'Core Writing Principles',
    character: 'Character',
    scene: 'Scene',
    dialogue: 'Dialogue',
    emotion: 'Emotion',
    pacing: 'Pacing',
    mystery: 'Mystery',
    twist: 'Plot Twist',
    ending: 'Open Ending',
    humanization: 'Humanization',
    indonesian_prose: 'Indonesian Prose',
    facebook: 'Facebook Readability',
    anti_ai: 'Anti-AI Patterns'
  };

  let idx = 1;
  const now = Date.now();

  for (const [key, rules] of Object.entries(jsonSeed)) {
    const catName = categoryMap[key] || 'Core Writing Principles';
    if (Array.isArray(rules)) {
      rules.forEach(ruleText => {
        entries.push({
          id: `wb_seed_${idx++}`,
          category: catName,
          title: `${catName} Rule ${idx}`,
          content: ruleText,
          type: 'principle',
          source: 'system',
          confidence: 'high',
          status: 'active',
          tags: [key, catName.toLowerCase().replace(/\s+/g, '_')],
          version: 1,
          createdAt: now,
          updatedAt: now,
          researchSessionId: null,
          conversationId: null
        });
      });
    }
  }

  return entries;
}

/**
 * Loads all Writing Brain entries from storage (seeds default if empty)
 */
export function getWritingBrainEntries() {
  let entries = storage.get(KEYS.WRITING_BRAIN_ENTRIES);
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    entries = seedEntriesFromJson(initialWritingBrainSeed);
    storage.set(KEYS.WRITING_BRAIN_ENTRIES, entries);
  }
  return entries;
}

/**
 * Saves Writing Brain entries array
 */
export function saveWritingBrainEntries(entries) {
  storage.set(KEYS.WRITING_BRAIN_ENTRIES, entries);
  return entries;
}

/**
 * Loads Style Profile
 */
export function getStyleProfile() {
  const profile = storage.get(KEYS.WRITING_BRAIN_PROFILE);
  return profile ? { ...DEFAULT_STYLE_PROFILE, ...profile } : { ...DEFAULT_STYLE_PROFILE };
}

/**
 * Saves Style Profile
 */
export function saveStyleProfile(profile) {
  const updated = { ...DEFAULT_STYLE_PROFILE, ...profile };
  storage.set(KEYS.WRITING_BRAIN_PROFILE, updated);
  return updated;
}

/**
 * Adds a new Knowledge Entry to Writing Brain
 */
export function addKnowledgeEntry(entryData) {
  const entries = getWritingBrainEntries();
  const now = Date.now();

  const newEntry = {
    id: entryData.id || `wb_${now}_${Math.random().toString(36).slice(2, 7)}`,
    category: entryData.category || 'Core Writing Principles',
    title: entryData.title || 'Untitled Principle',
    content: entryData.content || '',
    type: entryData.type || 'rule',
    source: entryData.source || 'user',
    confidence: entryData.confidence || 'high',
    status: entryData.status || 'active',
    tags: Array.isArray(entryData.tags) ? entryData.tags : [],
    version: 1,
    createdAt: now,
    updatedAt: now,
    researchSessionId: entryData.researchSessionId || null,
    conversationId: entryData.conversationId || null
  };

  entries.unshift(newEntry);
  saveWritingBrainEntries(entries);
  recordVersionChange(newEntry.id, 'Entry Created', newEntry.source);

  return newEntry;
}

/**
 * Updates an existing Knowledge Entry
 */
export function updateKnowledgeEntry(id, updates) {
  const entries = getWritingBrainEntries();
  const idx = entries.findIndex(e => e.id === id);
  if (idx < 0) return null;

  const current = entries[idx];
  const newVersion = (current.version || 1) + 1;
  const updated = {
    ...current,
    ...updates,
    version: newVersion,
    updatedAt: Date.now()
  };

  entries[idx] = updated;
  saveWritingBrainEntries(entries);
  recordVersionChange(id, `Updated to v${newVersion}`, updates.source || 'user');

  return updated;
}

/**
 * Archives a Knowledge Entry
 */
export function archiveKnowledgeEntry(id) {
  return updateKnowledgeEntry(id, { status: 'archived' });
}

/**
 * Deletes a Knowledge Entry permanently
 */
export function deleteKnowledgeEntry(id) {
  let entries = getWritingBrainEntries();
  entries = entries.filter(e => e.id !== id);
  saveWritingBrainEntries(entries);
  return entries;
}

/**
 * Version History Tracker
 */
export function recordVersionChange(entryId, changeReason, changeSource) {
  const history = storage.get(KEYS.WRITING_BRAIN_VERSION_HISTORY, []);
  history.unshift({
    id: `ver_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    entryId,
    changeReason,
    changeSource,
    timestamp: Date.now()
  });
  // Keep last 100 version logs
  storage.set(KEYS.WRITING_BRAIN_VERSION_HISTORY, history.slice(0, 100));
}

export function getVersionHistory() {
  return storage.get(KEYS.WRITING_BRAIN_VERSION_HISTORY, []);
}

/**
 * Selects relevant knowledge entries based on generation context
 */
export function selectRelevantKnowledge(context = {}) {
  const all = getWritingBrainEntries().filter(e => e.status === 'active');
  const task = (context.task || '').toLowerCase();
  const mode = (context.mode || '').toLowerCase();
  const genre = (context.genre || '').toLowerCase();

  // Score relevance for each entry
  const scored = all.map(entry => {
    let score = 0;
    const cat = entry.category.toLowerCase();
    const content = entry.content.toLowerCase();

    // Core principles and Anti-AI are always high relevance
    if (cat.includes('core') || cat.includes('anti-ai') || cat.includes('humanization')) {
      score += 10;
    }

    if (task.includes('mystery') || genre.includes('mystery')) {
      if (cat.includes('mystery') || cat.includes('twist') || cat.includes('clue')) score += 8;
    }

    if (task.includes('dialogue')) {
      if (cat.includes('dialogue')) score += 8;
    }

    if (task.includes('scene') || mode.includes('wizard')) {
      if (cat.includes('scene') || cat.includes('character') || cat.includes('pacing')) score += 6;
    }

    if (entry.source === 'user' || entry.category.includes('user preference')) {
      score += 5; // User preferences prioritized
    }

    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);
  // Pick top 15 most relevant entries to keep context concise
  return scored.slice(0, 15).map(s => s.entry);
}

/**
 * Builds compact writing context prompt string for AI model
 */
export function buildWritingContext(params = {}) {
  const relevantEntries = selectRelevantKnowledge(params);
  const styleProfile = getStyleProfile();

  const rulesList = relevantEntries.map(e => `- [${e.category}] ${e.content}`).join('\n');

  return `
--- WRITING BRAIN KNOWLEDGE CONTEXT ---
STYLE PROFILE:
- Tone: ${styleProfile.prose} (${styleProfile.language})
- Dialogue: ${styleProfile.dialogue}
- Emotion: ${styleProfile.emotion}
- Pacing: ${styleProfile.pacing}
- Avoid: ${(styleProfile.avoid || []).join(', ')}

ACTIVE RELEVANT KNOWLEDGE RULES:
${rulesList || '- Maintain realistic, grounded, scene-first metro-pop mystery writing.'}
---------------------------------------
`;
}

/**
 * Checks if a proposed rule content is a potential duplicate of existing entries
 */
export function checkDuplicateKnowledge(proposedContent) {
  if (!proposedContent || !proposedContent.trim()) return null;
  const entries = getWritingBrainEntries().filter(e => e.status === 'active');
  const targetLower = proposedContent.toLowerCase().trim();

  for (const entry of entries) {
    const existingLower = entry.content.toLowerCase().trim();
    // Simple overlap check
    if (existingLower === targetLower) {
      return { isExactMatch: true, matchEntry: entry };
    }
    // Substring or high similarity overlap
    const wordsTarget = targetLower.split(/\s+/).filter(w => w.length > 3);
    const matches = wordsTarget.filter(w => existingLower.includes(w));
    if (wordsTarget.length > 4 && matches.length / wordsTarget.length > 0.7) {
      return { isExactMatch: false, similarity: 0.8, matchEntry: entry };
    }
  }

  return null;
}

/**
 * Checks for potential contradiction with existing rules
 */
export function checkContradiction(proposedContent) {
  if (!proposedContent) return null;
  const contentLower = proposedContent.toLowerCase();
  const entries = getWritingBrainEntries().filter(e => e.status === 'active');

  const conflictKeywords = [
    { a: 'singkat', b: 'panjang' },
    { a: 'jelaskan', b: 'jangan jelaskan' },
    { a: 'puitis', b: 'konkret' },
    { a: 'gaib', b: 'realistis' }
  ];

  for (const entry of entries) {
    const existingLower = entry.content.toLowerCase();
    for (const pair of conflictKeywords) {
      if (
        (contentLower.includes(pair.a) && existingLower.includes(pair.b)) ||
        (contentLower.includes(pair.b) && existingLower.includes(pair.a))
      ) {
        return { matchEntry: entry, contradictionPair: pair };
      }
    }
  }

  return null;
}

/**
 * Runs a Writing Brain Health Check report
 */
export function checkBrainHealth() {
  const entries = getWritingBrainEntries();
  const activeEntries = entries.filter(e => e.status === 'active');
  const duplicates = [];
  const emptyEntries = [];
  const contradictions = [];

  for (let i = 0; i < activeEntries.length; i++) {
    const e1 = activeEntries[i];
    if (!e1.content || e1.content.trim().length < 5) {
      emptyEntries.push(e1);
    }
    for (let j = i + 1; j < activeEntries.length; j++) {
      const e2 = activeEntries[j];
      if (e1.content.toLowerCase().trim() === e2.content.toLowerCase().trim()) {
        duplicates.push({ entryA: e1, entryB: e2 });
      }
    }
  }

  return {
    totalEntries: entries.length,
    activeCount: activeEntries.length,
    archivedCount: entries.length - activeEntries.length,
    duplicatesCount: duplicates.length,
    duplicates,
    emptyEntriesCount: emptyEntries.length,
    emptyEntries,
    healthScore: Math.max(10, 100 - (duplicates.length * 10) - (emptyEntries.length * 15)),
    timestamp: Date.now()
  };
}
