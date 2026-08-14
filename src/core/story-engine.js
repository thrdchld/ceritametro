/**
 * Story Generation Pipeline Engine — Quality Audit V2 Refined
 */

import { callAIText } from './ai-client.js';
import { criticizeAndHumanizeDraft } from './critic-engine.js';

export const SYSTEM_STORY_PROMPT = `Anda adalah penulis profesional cerpen Indonesia bertema Realistic Metro-Pop Mystery.
Gaya penulisan Anda sangat hidup, berfokus pada adegan (scene-first), ritme manusiawi, dialog bersubteks, serta misteri logis tanpa unsur gaib.

PRINSIP PENULISAN WAJIB (QUALITY AUDIT V2):

1. ATURAN HIERARKI PENULISAN:
   Gunakan urutan prioritas: ACTION -> BEHAVIOR -> DIALOGUE -> PHYSICAL DETAIL -> THOUGHT -> EXPLICIT EXPLANATION.
   DILARANG NARATOR OVER-EXPLAINING! Hapus/hindari pola: "Raka tahu bahwa...", "Ia menyadari bahwa...", "Ini membuatnya...", "Suasana terasa...", "Ia merasa...". Biarkan pembaca menyimpulkan emosi dan situasi dari adegan.

2. DIALOG BERSUBTEKS (BUKAN Laporan Sinopsis):
   Dialog karakter HARUS memiliki tujuan, tekanan, hubungan, subteks, resistensi, dan jeda.
   DILARANG membuat karakter berbicara seperti membacakan sinopsis/laporan data (Contoh BURUK: "Saya sudah memeriksa akta kelahiran Nastiti..."). Karakter TIDAK selalu memberikan informasi utama secara langsung.

3. MISTERI NON-LINEAR & HIPOTESIS BERTAHAP:
   Struktur misteri: Clue A -> Hipotesis A -> Clue B -> Hipotesis A Diragukan -> Hipotesis B -> Clue C -> Reinterpretasi -> Reveal.
   Karakter BISA salah tafsir, ragu, atau menarik kesimpulan sementara sebelum fakta sebenarnya terungkap. Misteri tidak boleh terlalu instan/linear. Untuk rahasia keluarga/warisan, fokuskan misteri pada ALASAN/MOTIF di balik kerahasiaan bertahun-tahun, bukan sekadar identitas.

4. REVEAL RINGKAS & FOKUS BUKAN MONOLOG LENGKAP:
   Saat rahasia terungkap, DILARANG membuat karakter menjelaskan seluruh sejarah masa lalu dalam satu monolog panjang.
   Gunakan 1 dokumen, 1 kalimat pendek, 1 foto, 1 tindakan, atau 1 detail fisik yang membuat semua petunjuk sebelumnya masuk akal. Pembaca yang menyambungkan titik-titiknya.

5. ENDING BERBASIS ADEGAN (Bukan Paragraf Moral):
   Tutup cerita dengan adegan konkret: benda, gerakan fisik, kalimat pendek, tatapan, atau tindakan. Lalu selesai.
   DILARANG menutup cerita dengan kesimpulan moral/refleksi: "Ia belajar bahwa...", "Ia sadar bahwa...", "Raka tahu bahwa...", "Ini adalah bukti bahwa...".

6. KONKRET > PUITIS (Grounded Physical Detail):
   Utamakan detail fisik spesifik daripada metafora puitis generik (Contoh BAGUS: "Kulit jok mobil sudah panas ketika Raka masuk" daripada "Jakarta terasa seperti tungku").

7. RITME KALIMAT MANUSIAWI (Human Rhythm):
   Variasikan panjang-pendek kalimat dan paragraf secara alami. Jangan membuat semua paragraf terlalu pendek atau semua kalimat terlalu panjang.

8. ANTI-AI PHRASES & ZERO MARKDOWN:
   DILARANG frasa klise AI: "di tengah hiruk-pikuk", "tanpa terasa", "pada akhirnya", "sejak saat itu", "dadanya sesak", "hatinya menciut", "langit kelam", "suasana terasa semakin panas", "takdir", "harapan", "perjalanan hidup".
   DILARANG SEMUA SIMBOL MARKDOWN (*, **, #, __) di dalam teks cerita. Teks cerita HARUS 100% plain text.
   Panjang cerita ideal: 800 - 1.200 kata.`;

/**
 * Generates 5 distinct story outline options for Mode 2 (Otomatis) or Mode 1A (Ide Sendiri)
 */
export async function generateOutlineOptions({ userIdea = '', theme = 'Bebas', updateStatus }) {
  if (updateStatus) updateStatus('Menyusun 5 pilihan alur cerita...');

  const systemPrompt = `${SYSTEM_STORY_PROMPT}
Tugas Anda adalah menghasilkan 5 konsep alur cerpen misteri metro-pop yang unik, bernuansa misteri ambigu/non-linear, dan realistis.`;

  const userPrompt = `Input Pengguna:
${userIdea ? `Ide Utama: ${userIdea}` : 'Biarkan AI menentukan 5 ide alur misteri realistis urban Indonesia yang menarik.'}
Tema: ${theme}

Buatlah 5 opsi alur cerita yang berbeda.
Setiap alur harus memiliki:
- Teka-teki yang ambigu (tidak langsung ketahuan dari awal)
- Petunjuk yang memicu salah tafsir awal (Hipotesis A) sebelum fakta sebenarnya (Reveal) terungkap
- Alasan/motif manusiawi yang mendalam di balik kerahasiaan

Kembalikan respon DALAM FORMAT JSON BERIKUT:
{
  "options": [
    {
      "id": "1",
      "title": "Judul Sementara",
      "tags": ["Keluarga", "Dokumen", "Rahasia Kota"],
      "synopsis": "Ringkasan alur cerita singkat dengan eskalasi konflik...",
      "premise": "Premis dasar cerita",
      "conflict": "Konflik utama & taruhan emosional",
      "mystery": "Teka-teki utama yang membingungkan",
      "trueAnswer": "Kenyataan logis & motif sejati di balik misteri",
      "clues": "Petunjuk A (membuat salah tafsir) dan Petunjuk B (reinterpretasi)",
      "reveal": "Gaya pengungkapan ringkas (dokumen/benda/tindakan)",
      "ending": "Ending berbasis adegan visual"
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
Tugas Anda adalah merancang Scene Plan terstruktur (3-4 adegan) sebelum menulis draft cerita. Setiap adegan wajib memiliki Goal, Obstacle, Action, Change, dan New Info/Hypothesis.`;

  const logicUserPrompt = `Alur Cerita Terpilih:
Judul: ${outline.title}
Premis: ${outline.premise || outline.synopsis}
Konflik: ${outline.conflict || ''}
Misteri: ${outline.mystery || ''}
Jawaban Sebenarnya: ${outline.trueAnswer || ''}
Petunjuk: ${outline.clues || ''}
Reveal: ${outline.reveal || ''}

Susun Scene Plan 3-4 adegan di mana karakter mengalami keraguan/salah tafsir awal sebelum menemukan kebenaran.
Khusus jika mengenai surat rahasia/warisan/anak: fokuskan misteri pada MENGAPA rahasia disimpan bertahun-tahun, bukan sekadar hubungan darah.

Kembalikan JSON:
{
  "premise": "${outline.premise || outline.synopsis}",
  "character": "Deskripsi karakter utama, keinginan konkret, dan ketakutannya",
  "mystery": "${outline.mystery || ''}",
  "trueAnswer": "${outline.trueAnswer || ''}",
  "clues": "${outline.clues || ''}",
  "ending": "${outline.ending || ''}",
  "scenes": [
    {
      "sceneNumber": 1,
      "goal": "Tujuan konkret karakter di adegan ini",
      "obstacle": "Hambatan / resistensi lawan bicara / situasi",
      "action": "Aksi fisik & interaksi utama",
      "change": "Perubahan situasi / emosi",
      "newInfo": "Petunjuk baru & hipotesis sementara karakter (bisa salah)"
    }
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
  if (updateStatus) updateStatus('Menulis draft adegan demi adegan (±1.000 kata)...');

  const draftSystemPrompt = `${SYSTEM_STORY_PROMPT}
Tuliskan cerpen utuh adegan demi adegan secara hidup berdasarkan Scene Plan.
PATUHI STRICTLY ATURAN QUALITY AUDIT V2:
- Tulis aksi, gestur, dan detail fisik konkret. KURANGI narasi narator yang menjelaskan pikiran/emosi ("Raka tahu bahwa...", "Ia menyadari...").
- Dialog bersubteks, penuh jeda & nada ragu, BUKAN laporan sinopsis.
- Reveal cukup 1 detail/dokumen/tindakan, BUKAN monolog panjang.
- Ending berbasis adegan visual (benda/gerakan/tatapan), BUKAN kesimpulan moral.
- ZEROS MARKDOWN SYMBOLS.`;

  const draftUserPrompt = `Tuliskan cerpen lengkap berdasarkan logika & adegan berikut:
Judul: ${storyLogic.title}
Premis: ${storyLogic.premise}
Karakter Utama: ${storyLogic.character || 'Karakter utama'}
Misteri Utama: ${storyLogic.mystery}
Jawaban Sebenarnya: ${storyLogic.trueAnswer}
Petunjuk: ${storyLogic.clues}
Ending: ${storyLogic.ending}

Scene Plan:
${JSON.stringify(storyLogic.scenes || [], null, 2)}

ATURAN DRAFTING:
1. Tulis langsung isi cerita lengkap sekitar 800 - 1.200 kata.
2. Tuliskan judul di baris paling atas (tanpa tanda # atau **), lalu langsung isi cerita.
3. JANGAN gunakan simbol markdown (**bold**, *italic*, # header, __).
4. Pastikan dialog terasa seperti percakapan nyata manusia (ada tawar-menawar, kebingungan, ketegangan, bukan penjelasan kaku).`;

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
