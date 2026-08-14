/**
 * AI Research System & Knowledge Synthesizer
 */

import { callAIText } from './ai-client.js';
import { storage, KEYS } from './storage.js';
import { checkDuplicateKnowledge, checkContradiction } from './writing-brain.js';

/**
 * Gets all saved research sessions
 */
export function getResearchSessions() {
  return storage.get(KEYS.RESEARCH_SESSIONS, []);
}

/**
 * Saves research sessions list
 */
export function saveResearchSessions(sessions) {
  storage.set(KEYS.RESEARCH_SESSIONS, sessions);
  return sessions;
}

/**
 * Gets single research session by ID
 */
export function getResearchSessionById(id) {
  const sessions = getResearchSessions();
  return sessions.find(s => s.id === id) || null;
}

/**
 * Checks if current AI provider / environment supports automated web research
 */
export function checkWebResearchSupport() {
  // Client-side direct browser calls to external arbitrary CORS search engines are restricted
  // Returns false by default unless manual sources are provided or custom proxy endpoint supports web search
  return false; 
}

/**
 * Executes a Research session (Quick or Deep)
 */
export async function executeResearch({ question, mode = 'quick', manualSources = [], manualSourceText = '', updateStatus }) {
  if (!question || !question.trim()) {
    throw new Error('Pertanyaan riset tidak boleh kosong.');
  }

  if (updateStatus) updateStatus(`Memulai ${mode === 'deep' ? 'Deep Research' : 'Quick Research'}...`);

  const now = Date.now();
  const sessionId = `res_${now}_${Math.random().toString(36).slice(2, 6)}`;

  // Parse manual sources if provided
  const processedSources = manualSources.map((src, idx) => ({
    id: src.id || `src_${now}_${idx + 1}`,
    title: src.title || `Sumber ${idx + 1}`,
    url: src.url || '',
    domain: src.url ? new URL(src.url).hostname : 'manual',
    accessedAt: now,
    excerpt: src.excerpt || '',
    notes: src.notes || '',
    credibility: src.credibility || 'high'
  }));

  const systemPrompt = `Anda adalah peneliti sastra & konsultan teknik penulisan cerpen profesional.
Tugas Anda adalah melakukan riset mendalam mengenai teknik penulisan, menganalisis temuan, merumuskan teknik terbaik, serta menghasilkan usulan aturan (PROPOSED KNOWLEDGE) untuk ditingkatkan ke dalam Writing Brain.

ATURAN RISET (MODE: ${mode.toUpperCase()}):
1. JANGAN PERNAH membuat sumber/URL fiktif! Hanya referensikan sumber nyata yang disediakan pengguna atau prinsip sastra universal yang diakui secara ilmiah.
2. Temuan harus konkret, praktis, dan relevan dengan cerpen Indonesia modern (khususnya metro-pop mystery).
3. Buat usulan aturan (proposedKnowledge) yang ringkas (1-2 kalimat per aturan).

Format JSON wajib:
{
  "keyFindings": ["Point temuan 1", "Point temuan 2"],
  "importantTechniques": ["Teknik A", "Teknik B"],
  "examples": ["Contoh aplikasi 1"],
  "contradictions": ["Catatan/pengecualian jika ada"],
  "recommendations": ["Rekomendasi penerapan"],
  "proposedKnowledge": [
    {
      "id": "prop_1",
      "title": "Judul Aturan Ringkas",
      "category": "Dialogue|Scene|Character|Pacing|Mystery|Emotion|Humanization|Anti-AI Patterns",
      "content": "Isi aturan 1-2 kalimat ringkasan teknik yang wajib diterapkan.",
      "type": "rule",
      "why": "Alasan kepenulisan mengapa aturan ini penting."
    }
  ]
}`;

  const userPrompt = `PERTANYAAN RISET:
"${question}"

BANYAKNYA SUMBER TAMBAHAN:
${manualSourceText ? `Teks Sumber Manual:\n${manualSourceText}\n` : 'Gunakan sintesis pengetahuan kepenulisan sastra universal yang teruji.'}
${processedSources.length > 0 ? `Daftar Sumber URL:\n${JSON.stringify(processedSources, null, 2)}\n` : ''}

Lakukan analisis ${mode === 'deep' ? 'mendalam dengan membandingkan sudut pandang' : 'ringkas dan efektif'}.
Hasilkan respon JSON sesuai schema wajib.`;

  try {
    const res = await callAIText({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      temperature: mode === 'deep' ? 0.7 : 0.6
    });

    // Process proposed knowledge with duplicate & contradiction checks
    const rawProposals = res.proposedKnowledge || [];
    const enrichedProposals = rawProposals.map((p, idx) => {
      const dupCheck = checkDuplicateKnowledge(p.content);
      const conflictCheck = checkContradiction(p.content);
      return {
        id: `prop_${now}_${idx + 1}`,
        title: p.title || 'Usulan Knowledge Baru',
        category: p.category || 'Learned Rules',
        content: p.content || '',
        type: p.type || 'rule',
        why: p.why || 'Hasil riset teknik penulisan.',
        source: 'research',
        researchSessionId: sessionId,
        status: 'proposed',
        duplicateWarning: dupCheck,
        contradictionWarning: conflictCheck
      };
    });

    const report = {
      id: sessionId,
      question: question.trim(),
      mode,
      createdAt: now,
      updatedAt: now,
      keyFindings: res.keyFindings || [],
      importantTechniques: res.importantTechniques || [],
      examples: res.examples || [],
      contradictions: res.contradictions || [],
      recommendations: res.recommendations || [],
      sources: processedSources,
      proposedKnowledge: enrichedProposals
    };

    // Save session
    const sessions = getResearchSessions();
    sessions.unshift(report);
    saveResearchSessions(sessions);

    return report;
  } catch (err) {
    console.error('Research execution error:', err);
    throw new Error(`Gagal melaksanakan riset: ${err.message}`);
  }
}
