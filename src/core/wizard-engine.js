/**
 * 8-Stage Adaptive Story Wizard Engine
 */

import { callAIText } from './ai-client.js';

export const WIZARD_STAGES = [
  { key: 'premise', title: 'Premis', desc: 'Garis besar ide cerita utama' },
  { key: 'character', title: 'Tokoh Utama', desc: 'Latar belakang & keinginan karakter' },
  { key: 'location', title: 'Lokasi', desc: 'Suasana & tempat kejadian urban' },
  { key: 'mystery', title: 'Misteri Utama', desc: 'Teka-teki realistis yang harus dipecahkan' },
  { key: 'conflict', title: 'Konflik Utama', desc: 'Hambatan & taruhan emosional' },
  { key: 'clues', title: 'Petunjuk Tersembunyi', desc: 'Clues yang akan dipasang secara fair-play' },
  { key: 'reveal', title: 'Pengungkapan Rahasia', desc: 'Kenyataan di balik teka-teki' },
  { key: 'ending', title: 'Bentuk Ending', desc: 'Penyelesaian & penutup cerita' }
];

/**
 * Generates initial 5 premises for Mode 3 (Wizard Story)
 */
export async function generateInitialPremises({ theme = 'Bebas', updateStatus }) {
  if (updateStatus) updateStatus('Menyusun 5 pilihan premis cerita...');

  const systemPrompt = `Anda adalah penulis profesional cerpen Indonesia bertema Realistic Metro-Pop Mystery.
Tugas Anda adalah membuat 5 premis cerita misteri urban realistis yang menarik. Tanpa unsur gaib/hantu.`;

  const userPrompt = `Tema: ${theme}

Buatlah 5 opsi premis unik.
Format JSON wajib:
{
  "options": [
    { "id": "1", "title": "Judul Sementara", "summary": "Deskripsi premis singkat...", "tags": ["Keluarga", "Misteri Dokumen"] }
  ]
}`;

  const res = await callAIText({
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.8
  });

  return res.options || [];
}

/**
 * Generates 5 adaptive choices for a given wizard stage based on previous selections
 */
export async function generateWizardStageChoices({ stageIndex, currentSelections, updateStatus }) {
  const stage = WIZARD_STAGES[stageIndex];
  if (updateStatus) updateStatus(`Menyusun pilihan untuk tahap ${stage.title}...`);

  const systemPrompt = `Anda adalah konsultan struktur cerita misteri metro-pop realistis Indonesia.
Berikan 4 pilihan kreatif yang selaras dengan pilihan-pilihan tahap sebelumnya + 1 opsi rekomendasi AI terpintar.`;

  const userPrompt = `Tahap Saat Ini: ${stage.title} (${stage.desc})

Pilihan yang Sudah Ditentukan Sebelumnya:
${JSON.stringify(currentSelections, null, 2)}

Buatlah 5 pilihan adaptif untuk tahap "${stage.title}".
Catatan: Pilihan ke-5 HARUS berupa rekomendasi AI terbaik ("AI Pilihkan yang Paling Kuat").

Format JSON wajib:
{
  "choices": [
    { "id": "1", "label": "Pilihan Singkat", "detail": "Penjelasan detail pilihan..." },
    { "id": "2", "label": "Pilihan Singkat", "detail": "Penjelasan detail pilihan..." },
    { "id": "3", "label": "Pilihan Singkat", "detail": "Penjelasan detail pilihan..." },
    { "id": "4", "label": "Pilihan Singkat", "detail": "Penjelasan detail pilihan..." },
    { "id": "5", "label": "AI Pilihkan yang Paling Kuat", "detail": "Pilihan terefektif menurut AI berdasarkan alur..." }
  ]
}`;

  try {
    const res = await callAIText({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      temperature: 0.75
    });

    return res.choices || [];
  } catch (err) {
    console.warn('Fallback stage choices:', err);
    return [
      { id: '1', label: 'Opsi Standar A', detail: `Opsi realistis untuk ${stage.title}` },
      { id: '2', label: 'Opsi Standar B', detail: `Opsi alternatif untuk ${stage.title}` },
      { id: '3', label: 'Opsi Standar C', detail: `Opsi emosional untuk ${stage.title}` },
      { id: '4', label: 'Opsi Standar D', detail: `Opsi dramatis untuk ${stage.title}` },
      { id: '5', label: 'AI Pilihkan yang Paling Kuat', detail: 'Pilihan paling logis dan kuat menurut AI.' }
    ];
  }
}

/**
 * Generates Review Analysis ("Kenapa Alur Ini Bekerja") for completed Wizard outline
 */
export async function generateOutlineReview(wizardData, updateStatus) {
  if (updateStatus) updateStatus('Menganalisis efektivitas alur cerita...');

  const systemPrompt = `Anda adalah editor sastra senior. Evaluasi alur cerita yang disajikan dan berikan penjelasan 2-3 kalimat mengapa alur cerita ini bekerja dengan baik secara dramatis & logis.`;

  const userPrompt = `Data Alur Cerita:
${JSON.stringify(wizardData, null, 2)}

Format JSON wajib:
{
  "whyItWorks": "2-3 kalimat penjelasan ilmiah kepenulisan kenapa alur ini menarik & logis."
}`;

  try {
    const res = await callAIText({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      temperature: 0.7
    });
    return res.whyItWorks || 'Alur ini memiliki fondasi misteri logis dengan eskalasi emosi yang seimbang.';
  } catch (e) {
    return 'Alur cerita ini menghubungkan motivasi karakter dengan rahasia logis secara fair-play.';
  }
}

/**
 * Generates an improved version of the outline for the [PERBAIKI ALUR] feature
 */
export async function improveOutline(wizardData, updateStatus) {
  if (updateStatus) updateStatus('Merancang perbaikan alur cerita...');

  const systemPrompt = `Anda adalah editor sastra senior. Perbaiki alur cerita di bawah ini agar dinamika misteri, konflik, dan penanam petunjuknya jauh lebih kuat tanpa mengubah esensi inti premis.`;

  const userPrompt = `Versi Alur Saat Ini:
${JSON.stringify(wizardData, null, 2)}

Berikan versi perbaikan yang lebih tajam dan jelaskan alasannya singkat (1-2 kalimat).
Format JSON wajib:
{
  "improvedOutline": {
    "title": "Judul Baru / Perbaikan",
    "premise": "Premis diperbaiki",
    "character": "Karakter diperbaiki",
    "location": "Lokasi diperbaiki",
    "mystery": "Misteri diperbaiki",
    "conflict": "Konflik diperbaiki",
    "clues": "Petunjuk diperbaiki",
    "reveal": "Pengungkapan diperbaiki",
    "ending": "Ending diperbaiki"
  },
  "improvementReason": "Alasan 1-2 kalimat mengapa versi ini lebih kuat."
}`;

  const res = await callAIText({
    systemPrompt,
    userPrompt,
    jsonMode: true,
    temperature: 0.75
  });

  return {
    improvedOutline: res.improvedOutline || wizardData,
    improvementReason: res.improvementReason || 'Peningkatan struktur penanaman petunjuk & konflik.'
  };
}
