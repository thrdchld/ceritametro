/**
 * Critic Engine & Humanization Pass
 */

import { callAIText } from './ai-client.js';
import { cleanStoryText } from '../utils/text.js';

/**
 * Critiques a draft story and performs a targeted humanization rewrite
 */
export async function criticizeAndHumanizeDraft({ draftStory, storyLogic, updateStatus }) {
  if (updateStatus) updateStatus('Memeriksa kualitas & dialog cerita...');

  const systemPrompt = `Anda adalah editor sastra & kritikus cerpen Indonesia berpengalaman khusus genre Realistic Metro-Pop Mystery.
Tugas Anda adalah memeriksa draft cerpen dan melakukan revisi penulisan (humanization pass) agar cerita terasa sangat alami, modern, dan bebas dari gaya penulisan AI yang kaku.

ATURAN KRITIK & REVISI:
1. Hapus semua penjelasan yang berlebihan (over-telling). Tunjukkan melalui aksi (Show, Don't Tell).
2. Perbaiki dialog agar tidak kaku, tambahkan subteks, jeda, dan non-verbal.
3. Hapus frasa klise AI ("di tengah hiruk-pikuk", "tanpa terasa", "ia menyadari bahwa", "hidup mengajarkan", "ternyata").
4. Pastikan ritme kalimat bervariasi (panjang-pendek natural).
5. HAPUS SEMUA SIMBOL MARKDOWN (**bold**, *italic*, # header, dll). Hasil harus 100% plain text.
6. Pertahankan kata ±800-1200 kata. Jangan memotong jalan cerita.`;

  const userPrompt = `Berikut adalah data Story Logic dan Draft Cerpen saat ini.

--- LOGIKA CERITA ---
Premis: ${storyLogic.premise || ''}
Karakter: ${storyLogic.character || ''}
Misteri Utama: ${storyLogic.mystery || ''}
Jawaban Sebenarnya: ${storyLogic.trueAnswer || ''}
Petunjuk: ${storyLogic.clues || ''}
Reveal & Ending: ${storyLogic.ending || ''}

--- DRAFT SAAT INI ---
${draftStory}

--- TUGAS ---
Lakukan perbaikan (humanization pass) pada draft di atas dan tuliskan VERSI FINAL CERITA.
Respon HARUS dalam format JSON berikut:
{
  "criticNotes": "1-2 kalimat ringkasan perbaikan yang dilakukan",
  "finalTitle": "Judul Cerpen Plain Text",
  "finalStory": "Isi cerita lengkap plain text tanpa markdown artifacts (*, **, #)"
}`;

  try {
    const res = await callAIText({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      temperature: 0.6
    });

    const cleanedStory = cleanStoryText(res.finalStory || draftStory);
    const cleanedTitle = cleanStoryText(res.finalTitle || storyLogic.title || 'Tanpa Judul');

    return {
      title: cleanedTitle,
      story: cleanedStory,
      criticNotes: res.criticNotes || 'Revisi ritme & dialog selesai.'
    };
  } catch (err) {
    console.warn('Critic Engine fallback to cleaned draft due to AI error:', err);
    return {
      title: cleanStoryText(storyLogic.title || 'Tanpa Judul'),
      story: cleanStoryText(draftStory),
      criticNotes: 'Menggunakan draft awal yang telah dibersihkan.'
    };
  }
}
