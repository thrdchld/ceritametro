/**
 * Critic Engine & Humanization Pass — Quality Audit V2 Refined
 */

import { callAIText } from './ai-client.js';
import { cleanStoryText } from '../utils/text.js';

/**
 * Critiques a draft story and performs a targeted humanization rewrite
 */
export async function criticizeAndHumanizeDraft({ draftStory, storyLogic, updateStatus }) {
  if (updateStatus) updateStatus('Melakukan Quality Audit & Humanization Pass...');

  const systemPrompt = `Anda adalah editor sastra & kritikus cerpen Indonesia senior khusus genre Realistic Metro-Pop Mystery.
Tugas Anda adalah melakukan audit ketat dan merevisi draft cerita (Humanization Pass) agar prosa terasa 100% seperti tulisan manusia, hidup, dan bebas dari gaya sinopsis/AI kaku.

CHECKLIST AUDIT & REVISI WAJIB (QUALITY AUDIT V2):

1. POLESDAN KURANGI NARATOR OVER-EXPLAINING:
   Cari dan hapus pola: "Raka tahu bahwa...", "Ia menyadari bahwa...", "Ini membuatnya...", "Suasana terasa...", "Ia merasa...".
   Ubah penjelasan emosi/pikiran ini menjadi AKSI FISIK, BEHAVIOR, DIALOG, atau DETAIL RUANG. Biarkan pembaca yang menyimpulkan.

2. REVISI DIALOG SINOPSIS MENJADI DIALOG ALAMI:
   Jika ada dialog yang terdengar seperti membacakan data/sinopsis kepada pembaca (contoh: "Saya sudah memeriksa akta..."), REVISI MENJADI PERCAKAPAN NYATA!
   Berikan dialog: subteks, perlawanan/resistensi, nada ragu, kebingungan, dan respon non-verbal. Karakter TIDAK boleh langsung membeberkan informasi paling penting.

3. KETATKAN REVEAL (Pengungkapan Ringkas):
   Jika pengungkapan misteri di draft menggunakan monolog penjelasan panjang, POTONG!
   Gunakan 1 dokumen, 1 foto, 1 tindakan, 1 kalimat singkat, atau 1 detail fisik yang langsung membuat petunjuk sebelumnya masuk akal.

4. REVISI ENDING MENJADI ENDING BERBASIS ADEGAN:
   HAPUS paragraf penutup yang berisi refleksi moral ("Ia belajar bahwa...", "Ia sadar bahwa...", "Ini bukti bahwa...").
   Ganti ending dengan ADEGAN KONKRET: gerakan fisik, benda di tangan, tatapan, kalimat pendek, atau tindakan sederhana. Lalu selesai.

5. BASMI FRASA KLISE AI & METAFORA PUITIS GENERIK:
   Hapus frasa AI: "di tengah hiruk-pikuk", "tanpa terasa", "pada akhirnya", "sejak saat itu", "dadanya sesak", "hatinya menciut", "langit kelam", "suasana terasa semakin panas", "takdir", "harapan", "perjalanan hidup".
   Ganti metafora puitis generik dengan detail fisik konkret (misal: "kulit jok mobil panas").

6. BERSIHKAN MARKDOWN & JAGALAH RITME:
   Variasikan panjang kalimat. HAPUS 100% SIMBOL MARKDOWN (*, **, #, __) dari judul dan cerita. Hasil HARUS 100% plain text.
   Target panjang: 800 - 1.200 kata.`;

  const userPrompt = `Berikut adalah data Story Logic dan Draft Cerita saat ini.

--- LOGIKA CERITA ---
Premis: ${storyLogic.premise || ''}
Karakter: ${storyLogic.character || ''}
Misteri Utama: ${storyLogic.mystery || ''}
Jawaban Sebenarnya: ${storyLogic.trueAnswer || ''}
Petunjuk: ${storyLogic.clues || ''}
Ending: ${storyLogic.ending || ''}

--- DRAFT CERITA SAAT INI ---
${draftStory}

--- TUGAS REVISI ---
Lakukan revisi mendalam (humanization pass) pada draft di atas berdasarkan 6 Checklist Audit V2.
Audit dialog yang terlalu informatif, hapus penjelasan narator berlebihan, singkatkan reveal, buat ending berbasis adegan visual tanpa moralisasi, dan hapus frasa AI & markdown.

Respon HARUS dalam format JSON berikut:
{
  "criticNotes": "1-2 kalimat ringkasan revisi prosa & dialog yang dilakukan",
  "finalTitle": "Judul Cerpen Plain Text",
  "finalStory": "Isi cerita lengkap plain text tanpa markdown artifacts (*, **, #, __)"
}`;

  try {
    const res = await callAIText({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      temperature: 0.65
    });

    const cleanedStory = cleanStoryText(res.finalStory || draftStory);
    const cleanedTitle = cleanStoryText(res.finalTitle || storyLogic.title || 'Tanpa Judul');

    return {
      title: cleanedTitle,
      story: cleanedStory,
      criticNotes: res.criticNotes || 'Revisi Quality Audit V2 selesai (subteks dialog, aksi fisik, ending visual).'
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
