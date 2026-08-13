/**
 * Text utility functions for Cerita Metro
 */

/**
 * Removes markdown formatting symbols (**bold**, *italic*, # headers, codeblocks, etc.)
 * returning clean plain text suitable for Facebook copy-paste.
 */
export function cleanStoryText(text) {
  if (!text) return '';

  let cleaned = text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold and italic
    .replace(/(\*\*|__|\*|_)(.*?)\1/g, '$2')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove bullet points symbols at line start
    .replace(/^\s*[-+*]\s+/gm, '')
    // Remove numbered lists symbols at line start like "1. "
    .replace(/^\s*\d+\.\s+/gm, '')
    // Clean excessive empty lines (more than 2 newlines to 2 newlines)
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

/**
 * Counts words in a string.
 */
export function countWords(text) {
  if (!text) return 0;
  const clean = cleanStoryText(text);
  const words = clean.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

/**
 * Validates generated story text for anti-AI rules & markdown artifacts.
 */
export function validateStoryText(text) {
  const issues = [];
  
  if (!text) {
    issues.push('Teks cerita kosong.');
    return { valid: false, issues };
  }

  if (/\*\*|\*|__|#|```/.test(text)) {
    issues.push('Masih mengandung simbol markdown (**bold**, *italic*, #, dll).');
  }

  const wordCount = countWords(text);
  if (wordCount < 400) {
    issues.push(`Jumlah kata terlalu pendek (${wordCount} kata, target 800-1200 kata).`);
  }

  const aiClichés = [
    'hiruk-pikuk',
    'tanpa terasa waktu',
    'ia menyadari bahwa',
    'hidup mengajarkan',
    'sejak saat itu ia memahami'
  ];

  const lower = text.toLowerCase();
  for (const cliché of aiClichés) {
    if (lower.includes(cliché)) {
      issues.push(`Mengandung frasa klise AI: "${cliché}"`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    wordCount
  };
}
