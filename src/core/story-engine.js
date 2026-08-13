/**
 * Story Generation Pipeline Engine
 */

import { callAIText } from './ai-client.js';
import writingBrainData from '../data/writing-brain.json';
import { criticizeAndHumanizeDraft } from './critic-engine.js';
import { cleanStoryText } from '../utils/text.js';

const SYSTEM_STORY_PROMPT = `Anda adalah penulis profesional cerpen Indonesia bertema Realistic Metro-Pop Mystery.
Gaya penulisan Anda sangat mengutamakan kualitas, ritme natural, dialog bersubteks, serta misteri logis tanpa unsur gaib.

PRINSIP PENULISAN WAJIB:
1. TERLARANG: Hantu, setan, jin, kutukan, supernatural, perjalanan waktu, gaib.
2. Misteri berasal dari realita kehidupan kota Indonesia (rahasia keluarga, pekerjaan, dokumen, pesan tersembunyi, kebetulan masuk akal).
3. Fair-play mystery: Petunjuk (clues) harus dipasang sebelum rahasia terungkap.
4. Show, Don't Tell: Jangan tulis "ia merasa sedih", tapi tunjukkan lewat tindakan & gestur fisik.
5. Bahasa Indonesia natural, modern, semi-formal, enak dibaca di smartphone.
6. HAPUS SEMUA SIMBOL MARKDOWN (*, **, #, __) dari teks cerita final. Teks harus 100% plain text.
7. Panjang cerita ideal: 800 - 1.200 kata.`;

/**
 * Generates 5 distinct story outline options for Mode 2 (Otomatis) or Mode 1A (Ide Sendiri)
 */
export async function generateOutlineOptions({ userIdea = '', theme = 'Bebas', updateStatus }) {
  if (updateStatus) updateStatus('Menyusun 5 pilihan alur cerita...');

  const systemPrompt = `${SYSTEM_STORY_PROMPT}
Tugas Anda adalah menghasilkan 5 konsep alur cerpen misteri metro-pop yang unik, menarik, dan realistis.`;

  const userPrompt = `Input Pengguna:
${userIdea ? `Ide Utama: ${userIdea}` : 'Biarkan AI menentukan 5 ide alur misteri realistis urban Indonesia yang menarik.'}
Tema: ${theme}

Buatlah 5 opsi alur cerita yang berbeda.
Kembalikan respon DALAM FORMAT JSON BERIKUT:
{
  "options": [
    {
      "id": "1",
      "title": "Judul Sementara",
      "tags": ["Keluarga", "Dokumen", "Dua Bahasa"],
      "synopsis": "Ringkasan alur cerita singkat dari awal hingga akhir...",
      "premise": "Premis dasar cerita",
      "conflict": "Konflik utama",
      "mystery": "Teka-teki yang membingungkan",
      "trueAnswer": "Kenyataan logis di balik misteri",
      "clues": "Petunjuk yang akan ditanam",
      "reveal": "Pengungkapan di akhir",
      "ending": "Gaya ending (open ending / bittersweet / dll)"
    }
  ]
}`;

  const res = await callAIText({
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.85
  });

  return res.options || [];
}

/**
 * Executes full pipeline from a selected outline to produce final story
 */
export async function generateFinalStoryFromOutline({ outline, updateStatus }) {
  // Step 1: Build detailed Story Logic & Scene Plan
  if (updateStatus) updateStatus('Membangun logika cerita & scene plan...');

  const logicSystemPrompt = `${SYSTEM_STORY_PROMPT}
Tugas Anda adalah merancang Story Logic dan Scene Plan terstruktur sebelum menulis draft cerita.`;

  const logicUserPrompt = `Alur Cerita Terpilih:
Judul: ${outline.title}
Premis: ${outline.premise || outline.synopsis}
Konflik: ${outline.conflict || ''}
Misteri: ${outline.mystery || ''}
Jawaban Sebenarnya: ${outline.trueAnswer || ''}
Petunjuk: ${outline.clues || ''}
Reveal: ${outline.reveal || ''}

Tentukan Scene Plan (3-4 adegan utama).
Kembalikan JSON:
{
  "premise": "${outline.premise || outline.synopsis}",
  "character": "Deskripsi singkat karakter utama & motivasinya",
  "mystery": "${outline.mystery || ''}",
  "trueAnswer": "${outline.trueAnswer || ''}",
  "clues": "${outline.clues || ''}",
  "ending": "${outline.ending || ''}",
  "scenes": [
    { "sceneNumber": 1, "goal": "Tujuan adegan", "action": "Aksi utama", "change": "Perubahan situasi" }
  ]
}`;

  let storyLogic = outline;
  try {
    const logicRes = await callAIText({
      systemPrompt: logicSystemPrompt,
      userPrompt: logicUserPrompt,
      jsonMode: true,
      temperature: 0.7
    });
    storyLogic = { ...outline, ...logicRes };
  } catch (e) {
    console.warn('Fallback story logic structure:', e);
  }

  // Step 2: Write Draft
  if (updateStatus) updateStatus('Menulis draft cerita (±1.000 kata)...');

  const draftSystemPrompt = `${SYSTEM_STORY_PROMPT}
Gunakan Story Logic yang sudah dirancang untuk menulis cerpen utuh.
Tuliskan adegan demi adegan secara hidup, bukan ringkasan. Dialog harus alami dengan subteks. Tunjukkan emosi lewat gestur.`;

  const draftUserPrompt = `Tuliskan cerita lengkap berdasarkan logika berikut:
Judul: ${storyLogic.title}
Premis: ${storyLogic.premise}
Karakter: ${storyLogic.character || 'Karakter utama'}
Misteri: ${storyLogic.mystery}
Jawaban Sebenarnya: ${storyLogic.trueAnswer}
Petunjuk wajib muncul: ${storyLogic.clues}
Reveal & Ending: ${storyLogic.reveal} | ${storyLogic.ending}

TARGET TERPENTING:
- Tulis langsung cerita lengkap sekitar 800 - 1.200 kata.
- JANGAN gunakan simbol markdown (**bold**, *italic*, #).
- Tuliskan judul di baris paling atas, diikuti isi cerita.`;

  const rawDraft = await callAIText({
    systemPrompt: draftSystemPrompt,
    userPrompt: draftUserPrompt,
    jsonMode: false,
    temperature: 0.75
  });

  // Step 3: Critic & Humanization Pass
  const finalResult = await criticizeAndHumanizeDraft({
    draftStory: rawDraft,
    storyLogic,
    updateStatus
  });

  return {
    title: finalResult.title || storyLogic.title,
    story: finalResult.story,
    outline: storyLogic,
    criticNotes: finalResult.criticNotes
  };
}
