/**
 * AI Brainstorming, Critique Partner & Story Feedback Engine
 */

import { callAIText } from './ai-client.js';
import { storage, KEYS } from './storage.js';
import { buildWritingContext, checkDuplicateKnowledge, checkContradiction } from './writing-brain.js';

/**
 * Gets all saved Brainstorm conversations
 */
export function getBrainstormConversations() {
  return storage.get(KEYS.BRAINSTORM_CONVERSATIONS, []);
}

/**
 * Saves Brainstorm conversations
 */
export function saveBrainstormConversations(conversations) {
  storage.set(KEYS.BRAINSTORM_CONVERSATIONS, conversations);
  return conversations;
}

/**
 * Gets a single conversation by ID
 */
export function getBrainstormConversationById(id) {
  const conversations = getBrainstormConversations();
  return conversations.find(c => c.id === id) || null;
}

/**
 * Creates a new Brainstorm conversation
 */
export function createBrainstormConversation(title = 'Diskusi Penulisan Baru') {
  const conversations = getBrainstormConversations();
  const now = Date.now();
  const newConv = {
    id: `bs_${now}_${Math.random().toString(36).slice(2, 6)}`,
    title,
    createdAt: now,
    updatedAt: now,
    messages: [],
    proposals: [],
    decisions: []
  };

  conversations.unshift(newConv);
  saveBrainstormConversations(conversations);
  return newConv;
}

/**
 * Sends a message in a Brainstorming conversation (Discuss or Critique mode)
 */
export async function sendBrainstormMessage({ conversationId, userMessage, mode = 'discuss', storyContext = null, updateStatus }) {
  let conversations = getBrainstormConversations();
  let conv = conversations.find(c => c.id === conversationId);

  if (!conv) {
    conv = createBrainstormConversation(userMessage.slice(0, 30) + '...');
    conversations = getBrainstormConversations();
  }

  const now = Date.now();

  // Add User Message
  conv.messages.push({
    id: `msg_${now}_user`,
    sender: 'user',
    text: userMessage,
    mode,
    timestamp: now
  });

  if (updateStatus) updateStatus(mode === 'critique' ? 'Menganalisis & mengkritik cerita...' : 'Memproses respon diskusi...');

  const writingContextPrompt = buildWritingContext({ task: 'brainstorm' });

  const systemPrompt = `Anda adalah seorang Editor Sastra Senior dan Partner Penulisan Kreatif profesional khusus cerpen Indonesia bertema Realistic Metro-Pop Mystery.

PERAN & ATURAN BERDISKUSI:
1. Jangan selalu menyetujui pendapat pengguna secara buta. Berikan kritik konstruktif, kemukakan alasan ilmiah sastra jika Anda tidak sependapat, dan ajukan pertanyaan balik yang mempertajam alur/karakter/dialog.
2. Jika diskusi menghasilkan prinsip/aturan penulisan yang berharga, atau jika pengguna meminta kritik pada cerita, buatlah usulan aturan baru (PROPOSED RULE).
3. Gaya komunikasi: hangat, tajam, reflektif, khas editor senior berpengalaman.

${writingContextPrompt}

Format JSON wajib:
{
  "replyText": "Tanggapan editor lengkap dalam bentuk teks percakapan alami.",
  "critiqueBreakdown": {
    "whatWorks": "Apa yang sudah bagus (kosongkan jika diskusikan umum)",
    "problems": "Masalah/kelemahan utama",
    "why": "Alasan mengapa hal tersebut menjadi masalah",
    "suggestedImprovement": "Saran perbaikan konkret"
  },
  "proposedRule": {
    "title": "Judul Aturan (kosongkan jika tidak ada usulan baru)",
    "category": "Dialogue|Scene|Character|Pacing|Mystery|Emotion|Humanization|Anti-AI Patterns",
    "content": "Isi aturan 1-2 kalimat ringkas",
    "type": "rule",
    "why": "Alasan singkat mengapa aturan ini diusulkan"
  }
}`;

  const conversationHistoryText = conv.messages.slice(-6).map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n\n');

  const userPrompt = `MODE DISKUSI: ${mode.toUpperCase()}

${storyContext ? `--- KONTEKS CERITA / OUTLINE TERKAIT ---\nJudul: ${storyContext.title || ''}\nCerita/Draft:\n${storyContext.story || storyContext.synopsis || ''}\n---------------------------------------\n` : ''}

--- RIWAYAT DISKUSI ---
${conversationHistoryText}

Tolak/kritik jika ada kelemahan. Hasilkan respon JSON sesuai schema wajib.`;

  try {
    const res = await callAIText({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      temperature: 0.75
    });

    const aiMsgId = `msg_${Date.now()}_ai`;
    let proposalObj = null;

    if (res.proposedRule && res.proposedRule.title && res.proposedRule.content) {
      const dupCheck = checkDuplicateKnowledge(res.proposedRule.content);
      const conflictCheck = checkContradiction(res.proposedRule.content);

      proposalObj = {
        id: `prop_${Date.now()}_bs`,
        title: res.proposedRule.title,
        category: res.proposedRule.category || 'Learned Rules',
        content: res.proposedRule.content,
        type: res.proposedRule.type || 'rule',
        why: res.proposedRule.why || 'Hasil diskusi dengan editor.',
        source: 'brainstorm',
        conversationId: conv.id,
        status: 'proposed',
        createdAt: Date.now(),
        duplicateWarning: dupCheck,
        contradictionWarning: conflictCheck
      };

      conv.proposals.unshift(proposalObj);
    }

    conv.messages.push({
      id: aiMsgId,
      sender: 'ai',
      text: res.replyText || 'Terima kasih, mari kita bedah lebih lanjut.',
      mode,
      critiqueBreakdown: res.critiqueBreakdown || null,
      proposalId: proposalObj ? proposalObj.id : null,
      timestamp: Date.now()
    });

    conv.updatedAt = Date.now();
    saveBrainstormConversations(conversations);

    return {
      conversation: conv,
      newProposal: proposalObj
    };
  } catch (err) {
    console.error('Brainstorm message error:', err);
    throw new Error(`Gagal memproses diskusi: ${err.message}`);
  }
}

/**
 * Initiates Story Critique loop directly from a generated story
 */
export async function initiateStoryFeedbackLoop({ story, userCritique, updateStatus }) {
  const title = `Kritik: ${story.title || 'Cerita'}`;
  const conv = createBrainstormConversation(title);

  const initialUserMsg = userCritique ? 
    `Saya ingin mengkritik cerita "${story.title}": ${userCritique}` :
    `Tolong evaluasi cerita "${story.title}" secara kritis dan berikan saran perbaikan serta usulan aturan Writing Brain jika ada kelemahan.`;

  return sendBrainstormMessage({
    conversationId: conv.id,
    userMessage: initialUserMsg,
    mode: 'critique',
    storyContext: story,
    updateStatus
  });
}
