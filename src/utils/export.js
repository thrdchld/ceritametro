/**
 * Export and Import utilities for JSON backup & Markdown export
 */

/**
 * Downloads a file to user device
 */
export function downloadFile(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

/**
 * Exports history array as JSON backup file
 */
export function exportHistoryJSON(stories) {
  const dataStr = JSON.stringify(stories, null, 2);
  const fileName = `ceritametro-backup-${new Date().toISOString().slice(0, 10)}.json`;
  downloadFile(dataStr, fileName, 'application/json');
}

/**
 * Exports a single story as formatted Markdown file
 */
export function exportStoryMarkdown(storyItem) {
  const dateStr = new Date(storyItem.createdAt || Date.now()).toLocaleDateString('id-ID');
  let md = `# ${storyItem.title || 'Tanpa Judul'}\n\n`;
  md += `*Tanggal: ${dateStr}*\n`;
  md += `*Mode: ${storyItem.mode || 'Otomatis'}*\n`;
  if (storyItem.theme) md += `*Tema: ${storyItem.theme}*\n`;
  md += `\n---\n\n`;
  md += `${storyItem.story || ''}\n\n`;
  
  if (storyItem.imagePrompt) {
    md += `## Prompt Gambar AI\n\n\`\`\`\n${storyItem.imagePrompt}\n\`\`\`\n`;
  }

  const fileName = `${(storyItem.title || 'cerita').toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
  downloadFile(md, fileName, 'text/markdown');
}

/**
 * Validates and imports JSON file array
 */
export function importHistoryJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed)) {
          throw new Error('Format JSON harus berupa daftar (array) cerita.');
        }

        // Basic schema check
        const validItems = parsed.filter(item => item && typeof item === 'object' && item.title && item.story);
        if (validItems.length === 0) {
          throw new Error('Tidak ditemukan data cerita yang valid dalam file.');
        }

        resolve(validItems);
      } catch (err) {
        reject(err.message || 'File JSON tidak valid.');
      }
    };
    reader.onerror = () => reject('Gagal membaca file.');
    reader.readAsText(file);
  });
}
