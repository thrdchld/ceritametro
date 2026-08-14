/**
 * Full Application Structured ZIP Backup & Restore Engine
 */

import JSZip from 'jszip/dist/jszip.min.js';
import { storage, KEYS, getSettings, saveSettings } from './storage.js';
import { getWritingBrainEntries, saveWritingBrainEntries, getStyleProfile, saveStyleProfile, getVersionHistory, BRAIN_CATEGORIES } from './writing-brain.js';
import { getResearchSessions, saveResearchSessions } from './research-engine.js';
import { getBrainstormConversations, saveBrainstormConversations } from './brainstorm-engine.js';
import { loadHistory, saveStory } from './history.js';

/**
 * Generates local device timestamp string in format: YYYY-MM-DD_HH-mm-ss
 */
export function getBackupTimestampString(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${YYYY}-${MM}-${DD}_${HH}-${mm}-${ss}`;
}

/**
 * Saves metadata of a created backup to local backup history log
 */
export function saveBackupHistoryMetadata(meta) {
  const history = storage.get(KEYS.BACKUP_HISTORY, []);
  history.unshift(meta);
  // Keep last 20 metadata logs
  storage.set(KEYS.BACKUP_HISTORY, history.slice(0, 20));
}

/**
 * Gets backup history metadata list
 */
export function getBackupHistoryMetadata() {
  return storage.get(KEYS.BACKUP_HISTORY, []);
}

/**
 * Creates Full App Structured ZIP Backup
 */
export async function createFullAppBackupZip(options = {}, updateStatus) {
  const {
    includeAiSettings = true,
    includeApiKeys = false,
    includeWritingBrain = true,
    includeResearch = true,
    includeBrainstorm = true,
    includeStories = true,
    includeImages = true
  } = options;

  if (updateStatus) updateStatus('Mengumpulkan data aplikasi...');

  const timestampStr = getBackupTimestampString();
  const folderName = `ceritametro-backup-${timestampStr}`;
  const zipFileName = `${folderName}.zip`;
  const zip = new JSZip();
  const root = zip.folder(folderName);

  // Data collections
  const currentSettings = getSettings();
  const writingBrainEntries = getWritingBrainEntries();
  const styleProfile = getStyleProfile();
  const versionHistory = getVersionHistory();
  const researchSessions = getResearchSessions();
  const brainstormConversations = getBrainstormConversations();
  const stories = loadHistory();

  let imagesCount = 0;

  // 1. App Manifest
  if (updateStatus) updateStatus('Menyusun Manifest...');
  const manifest = {
    app: 'Cerita Metro',
    backupVersion: 1,
    appVersion: '1.0.0',
    createdAt: Date.now(),
    createdAtLocal: new Date().toLocaleString('id-ID'),
    backupFileName: zipFileName,
    includesApiKeys: includeApiKeys,
    sections: [],
    counts: {
      storiesCount: includeStories ? stories.length : 0,
      knowledgeCount: includeWritingBrain ? writingBrainEntries.length : 0,
      researchCount: includeResearch ? researchSessions.length : 0,
      brainstormCount: includeBrainstorm ? brainstormConversations.length : 0,
      imagesCount: 0
    }
  };

  // 2. App & AI Settings
  if (includeAiSettings) {
    manifest.sections.push('ai', 'app');
    const aiFolder = root.folder('ai');
    const appFolder = root.folder('app');

    const safeSettings = { ...currentSettings };
    if (!includeApiKeys) {
      safeSettings.apiKey = '';
      safeSettings.imageApiKey = '';
    }

    aiFolder.file('provider-config.json', JSON.stringify(safeSettings, null, 2));
    appFolder.file('settings.json', JSON.stringify({ theme: 'default', language: 'id' }, null, 2));
  }

  // 3. Writing Brain
  if (includeWritingBrain) {
    if (updateStatus) updateStatus('Menyusun Writing Brain...');
    manifest.sections.push('writing-brain');
    const wbFolder = root.folder('writing-brain');
    wbFolder.file('entries.json', JSON.stringify(writingBrainEntries, null, 2));
    wbFolder.file('style-profile.json', JSON.stringify(styleProfile, null, 2));
    wbFolder.file('categories.json', JSON.stringify(BRAIN_CATEGORIES, null, 2));
    wbFolder.file('version-history.json', JSON.stringify(versionHistory, null, 2));
  }

  // 4. Research
  if (includeResearch) {
    if (updateStatus) updateStatus('Menyusun Research Sessions...');
    manifest.sections.push('research');
    const resFolder = root.folder('research');
    resFolder.file('sessions.json', JSON.stringify(researchSessions, null, 2));
  }

  // 5. Brainstorm
  if (includeBrainstorm) {
    if (updateStatus) updateStatus('Menyusun Brainstorm Conversations...');
    manifest.sections.push('brainstorm');
    const bsFolder = root.folder('brainstorm');
    bsFolder.file('conversations.json', JSON.stringify(brainstormConversations, null, 2));
  }

  // 6. Stories & Images
  if (includeStories) {
    if (updateStatus) updateStatus('Menyusun Stories & Images...');
    manifest.sections.push('stories');
    const storiesFolder = root.folder('stories');
    const itemsFolder = storiesFolder.folder('items');
    const imagesFolder = storiesFolder.folder('images');

    const indexList = stories.map(s => ({
      id: s.id,
      title: s.title,
      mode: s.mode,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      hasImage: !!s.imageData
    }));

    storiesFolder.file('index.json', JSON.stringify(indexList, null, 2));

    stories.forEach((story, idx) => {
      const cleanStory = { ...story };
      if (!includeImages) {
        cleanStory.imageData = '';
      } else if (cleanStory.imageData && cleanStory.imageData.startsWith('data:image/')) {
        imagesCount++;
        const match = cleanStory.imageData.match(/^data:image\/(\w+);base64,(.+)$/);
        if (match) {
          const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
          const b64Data = match[2];
          const imgFileName = `${story.id}.${ext}`;
          imagesFolder.file(imgFileName, b64Data, { base64: true });
        }
      }
      itemsFolder.file(`${story.id}.json`, JSON.stringify(cleanStory, null, 2));
    });

    manifest.counts.imagesCount = imagesCount;
  }

  // Add Manifest & README
  root.file('manifest.json', JSON.stringify(manifest, null, 2));
  root.file('README.txt', `CERITA METRO FULL APP BACKUP
Backup Date: ${manifest.createdAtLocal}
File Name: ${zipFileName}
Backup Version: ${manifest.backupVersion}
Includes API Keys: ${includeApiKeys ? 'YES (KEEP CONFIDENTIAL)' : 'NO'}`);

  // Generate ArrayBuffer (universal for browser & Node.js)
  if (updateStatus) updateStatus('Membuat file ZIP...');
  const zipBlob = await zip.generateAsync({ type: 'arraybuffer', compression: 'DEFLATE' });

  // Save metadata
  saveBackupHistoryMetadata({
    fileName: zipFileName,
    createdAt: Date.now(),
    createdAtLocal: manifest.createdAtLocal,
    size: zipBlob.size,
    sections: manifest.sections,
    includesApiKeys: includeApiKeys
  });

  return {
    blob: zipBlob,
    fileName: zipFileName,
    manifest
  };
}

/**
 * Parses and Validates an imported Backup ZIP file
 */
export async function parseAndValidateBackupZip(file, updateStatus) {
  if (updateStatus) updateStatus('Membaca file ZIP...');
  const zip = await JSZip.loadAsync(file);

  // Find root folder name or files
  let manifestFile = null;
  let rootPrefix = '';

  zip.forEach((relativePath, fileObj) => {
    if (relativePath.endsWith('manifest.json') && !fileObj.dir) {
      manifestFile = fileObj;
      rootPrefix = relativePath.replace('manifest.json', '');
    }
  });

  if (!manifestFile) {
    throw new Error('File backup tidak valid: manifest.json tidak ditemukan.');
  }

  if (updateStatus) updateStatus('Membaca Manifest & data...');
  const manifestText = await manifestFile.async('text');
  let manifest = null;
  try {
    manifest = JSON.parse(manifestText);
  } catch (e) {
    throw new Error('File manifest.json di dalam ZIP rusak.');
  }

  const resultData = {
    manifest,
    aiSettings: null,
    writingBrainEntries: [],
    styleProfile: null,
    researchSessions: [],
    brainstormConversations: [],
    stories: []
  };

  // Helper to read relative json
  const readJson = async (relPath) => {
    const targetPath = `${rootPrefix}${relPath}`;
    const f = zip.file(targetPath);
    if (!f) return null;
    try {
      const text = await f.async('text');
      return JSON.parse(text);
    } catch (e) {
      console.warn(`Failed reading ${targetPath}:`, e);
      return null;
    }
  };

  // Read AI Settings
  resultData.aiSettings = await readJson('ai/provider-config.json');

  // Read Writing Brain
  const wbEntries = await readJson('writing-brain/entries.json');
  if (Array.isArray(wbEntries)) resultData.writingBrainEntries = wbEntries;

  resultData.styleProfile = await readJson('writing-brain/style-profile.json');

  // Read Research
  const resSessions = await readJson('research/sessions.json');
  if (Array.isArray(resSessions)) resultData.researchSessions = resSessions;

  // Read Brainstorm
  const bsConvs = await readJson('brainstorm/conversations.json');
  if (Array.isArray(bsConvs)) resultData.brainstormConversations = bsConvs;

  // Read Stories
  const storiesIndex = await readJson('stories/index.json');
  if (Array.isArray(storiesIndex)) {
    for (const itemMeta of storiesIndex) {
      const storyObj = await readJson(`stories/items/${itemMeta.id}.json`);
      if (storyObj) {
        // If story image was saved as a separate file inside stories/images/
        if (!storyObj.imageData && itemMeta.hasImage) {
          const imgFile = zip.file(`${rootPrefix}stories/images/${itemMeta.id}.png`) ||
                          zip.file(`${rootPrefix}stories/images/${itemMeta.id}.jpg`);
          if (imgFile) {
            const b64 = await imgFile.async('base64');
            const mime = imgFile.name.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
            storyObj.imageData = `data:${mime};base64,${b64}`;
          }
        }
        resultData.stories.push(storyObj);
      }
    }
  }

  return resultData;
}

/**
 * Restores data from parsed backup into app storage using Merge or Replace All strategy
 */
export function executeRestore({ backupData, strategy = 'merge', restoreAiSettings = false, updateStatus }) {
  if (updateStatus) updateStatus(`Memulihkan data (${strategy.toUpperCase()})...`);

  const { aiSettings, writingBrainEntries, styleProfile, researchSessions, brainstormConversations, stories } = backupData;

  // 1. AI Settings
  if (restoreAiSettings && aiSettings) {
    saveSettings(aiSettings);
  }

  // 2. Style Profile
  if (styleProfile) {
    saveStyleProfile(styleProfile);
  }

  // 3. Writing Brain Entries
  if (Array.isArray(writingBrainEntries) && writingBrainEntries.length > 0) {
    if (strategy === 'replace') {
      saveWritingBrainEntries(writingBrainEntries);
    } else {
      // MERGE Strategy
      const current = getWritingBrainEntries();
      const mergedMap = new Map();
      current.forEach(e => mergedMap.set(e.id, e));

      writingBrainEntries.forEach(bEntry => {
        const existing = mergedMap.get(bEntry.id);
        if (!existing || (bEntry.updatedAt || 0) > (existing.updatedAt || 0)) {
          mergedMap.set(bEntry.id, bEntry);
        }
      });
      saveWritingBrainEntries(Array.from(mergedMap.values()));
    }
  }

  // 4. Research Sessions
  if (Array.isArray(researchSessions) && researchSessions.length > 0) {
    if (strategy === 'replace') {
      saveResearchSessions(researchSessions);
    } else {
      const current = getResearchSessions();
      const mergedMap = new Map();
      current.forEach(s => mergedMap.set(s.id, s));

      researchSessions.forEach(r => {
        const existing = mergedMap.get(r.id);
        if (!existing || (r.updatedAt || 0) > (existing.updatedAt || 0)) {
          mergedMap.set(r.id, r);
        }
      });
      saveResearchSessions(Array.from(mergedMap.values()));
    }
  }

  // 5. Brainstorm Conversations
  if (Array.isArray(brainstormConversations) && brainstormConversations.length > 0) {
    if (strategy === 'replace') {
      saveBrainstormConversations(brainstormConversations);
    } else {
      const current = getBrainstormConversations();
      const mergedMap = new Map();
      current.forEach(c => mergedMap.set(c.id, c));

      brainstormConversations.forEach(b => {
        const existing = mergedMap.get(b.id);
        if (!existing || (b.updatedAt || 0) > (existing.updatedAt || 0)) {
          mergedMap.set(b.id, b);
        }
      });
      saveBrainstormConversations(Array.from(mergedMap.values()));
    }
  }

  // 6. Stories
  if (Array.isArray(stories) && stories.length > 0) {
    if (strategy === 'replace') {
      storage.set(KEYS.STORIES_INDEX, stories);
      storage.set(KEYS.LEGACY_HISTORY, stories);
    } else {
      const current = loadHistory();
      const mergedMap = new Map();
      current.forEach(s => mergedMap.set(s.id, s));

      stories.forEach(s => {
        const existing = mergedMap.get(s.id);
        if (!existing || (s.updatedAt || 0) > (existing.updatedAt || 0)) {
          mergedMap.set(s.id, s);
        }
      });
      const mergedList = Array.from(mergedMap.values());
      storage.set(KEYS.STORIES_INDEX, mergedList);
      storage.set(KEYS.LEGACY_HISTORY, mergedList);
    }
  }

  return true;
}
