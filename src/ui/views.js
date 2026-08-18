/**
 * Main Application View Templates — Bespoke Indonesian Noir Editorial Studio
 * Modern Tactile Inputs, Interactive Wizard Stepper, Inspiration Chips & Dual-Mode Story Editor
 */

import { renderProposalCard } from './components.js';
import { countWords } from '../utils/text.js';
import { BRAIN_CATEGORIES } from '../core/writing-brain.js';
import { WIZARD_STAGES } from '../core/wizard-engine.js';
import { Icons } from './icons.js';

export const THEME_OPTIONS = [
  'Bebas',
  'Metropolitan Noir',
  'Keluarga & Rahasia',
  'Korporat & Ambisi',
  'Romansa & Obsesi',
  'Persahabatan & Khianat',
  'Kehilangan & Masa Lalu'
];

export const INSPIRATION_CHIPS = [
  { label: 'Wasiat Ganda Notaris', text: 'Seorang notaris Jakarta Pusat menemukan brankas klien konglomeratnya berisi dua surat wasiat dengan tanggal sama persis namun ahli waris bertolak belakang.' },
  { label: 'Kamar 404 Apartemen Sudirman', text: 'Kamar 404 apartemen mewah selalu berbau bunga sedap malam setiap jam 2 pagi, padahal pemilik unit dilaporkan hilang sejak enam bulan lalu.' },
  { label: 'Rekaman Dashcam Hujan Lebat', text: 'Seorang sopir taksi online menemukan kartu nama berlumur darah terselip di bawah jok belakang usai mengantar penumpang misterius saat badai.' },
  { label: 'Amplop Cokelat di Loker Kantor', text: 'Seorang auditor junior firma akuntan SCBD mendapati laptop kerjanya ditukar dengan model identik yang berisi salinan mutasi rekening gelap atas namanya.' },
  { label: 'Manuskrip Penulis Lenyap', text: 'Seorang editor penerbitan menerima draf babak akhir novel pembunuhan yang detail peristiwanya persis kejadian nyata di Jakarta kemarin malam.' }
];

export const RANDOM_SPARK_PREMISES = [
  'Seorang kurir ekspres mengantar paket tanpa nama pengirim ke rumah mewah di Menteng, hanya untuk mendapati penerimanya adalah dirinya sendiri sepuluh tahun lalu.',
  'Seorang kurator museum mendapati lukisan potret keluarga kolonial abad ke-19 tiba-tiba memiliki wajah pejabat korup yang baru saja tewas misterius.',
  'Seorang barista kafe 24 jam di Cikini menemukan buku catatan harian tertinggal di meja pojok yang menuliskan detik demi detik pembunuhan yang akan terjadi di kafe itu subuh nanti.',
  'Seorang teknisi lift gedung pencakar langit menemukan pintu rahasia di antara lantai 13 dan 14 yang menghubungkan ke koridor gelap tak tercatat di denah arsitektur.',
  'Seorang wartawan investigasi menerima panggilan telepon dari nomor ponsel rekannya yang telah dimakamkan tiga hari lalu, memintanya memeriksa loker stasiun Manggarai.'
];

export const RESEARCH_QUICK_PROMPTS = [
  'Teknik menanam clue terselubung (fair-play clues) tanpa disadari pembaca',
  'Mekanisme plot twist bertingkat (double reversal) dalam cerpen misteri',
  'Motif kejahatan realistis di dunia korporat metropolitan Jakarta',
  'Menciptakan tensi dan atmosfer noir metropolitan Indonesia yang otentik'
];

export const BRAINSTORM_QUICK_PROMPTS = [
  '🔍 Tolong bedah kelemahan logika dan plot hole dalam ide ceritaku ini...',
  '⚡ Berikan 3 alternatif plot twist yang tidak tertebak untuk naskah ini...',
  '🎭 Evaluasi apakah motivasi tokoh utama sudah cukup kuat dan realistis...',
  '🏙️ Bagaimana cara mempertajam deskripsi suasana agar lebih berasa noir?'
];

/**
 * HOME VIEW — Generator Studio Hub
 */
export function renderHomeView(brainEntriesCount = 0) {
  return `
    <div class="page-header" style="text-align: center; margin-bottom: 1.5rem; margin-top: 0.5rem;">
      <h1 class="page-title" style="font-size: 1.75rem; letter-spacing: -0.03em;">
        CERITA METRO
      </h1>
      <p style="font-size: 0.9rem; color: var(--primary); font-weight: 600; margin-bottom: 0.35rem;">
        Realistic Metro-Pop Mystery Generator & Evolving Writing Studio
      </p>
      <p class="page-subtitle" style="max-width: 620px; margin: 0 auto; font-size: 0.84rem;">
        Susun cerpen misteri urban Indonesia yang berpijak pada logika, beremosi natural, dan diperkuat oleh basis pengetahuan Writing Brain lokal.
      </p>
    </div>

    <!-- 3 Core Modes -->
    <div class="mode-grid">
      <div class="mode-card" data-action="start-mode-1">
        <div>
          <div class="mode-icon">${Icons.pen(20)}</div>
          <div class="mode-card-title">Ide Sendiri</div>
          <div class="mode-card-desc">
            Tuliskan premis, karakter, atau potongan peristiwa Anda. Pilih antara 5 Variasi Alur atau 8-Stage Story Wizard.
          </div>
        </div>
        <span class="mode-badge">FLEKSIBEL & TERARAH</span>
      </div>

      <div class="mode-card" data-action="start-mode-2">
        <div>
          <div class="mode-icon">${Icons.zap(20)}</div>
          <div class="mode-card-title">Alur Otomatis</div>
          <div class="mode-card-desc">
            AI langsung menyusun 5 variasi plot misteri realistis dari repositori Writing Brain untuk Anda pilih.
          </div>
        </div>
        <span class="mode-badge">INSTAN & CEPAT</span>
      </div>

      <div class="mode-card" data-action="start-mode-3">
        <div>
          <div class="mode-icon">${Icons.wand(20)}</div>
          <div class="mode-card-title">Story Wizard</div>
          <div class="mode-card-desc">
            Bangun anatomi cerpen langkah demi langkah: premis, tokoh, misteri, konflik, hingga ending twist.
          </div>
        </div>
        <span class="mode-badge">8 TAHAP INTERAKTIF</span>
      </div>
    </div>

    <!-- Quick Brain Status Widget -->
    <div class="hub-widget">
      <div class="hub-info">
        <div class="hub-icon" style="color: var(--primary); display: flex; align-items: center;">${Icons.brain(24)}</div>
        <div>
          <strong style="font-size: 0.95rem; color: var(--text-main); display: block;">Writing Brain Terhubung</strong>
          <span style="font-size: 0.82rem; color: var(--text-muted);">
            Engine penulisan dipandu oleh kaidah sastra lokal yang terus disempurnakan.
          </span>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" data-route="brain">
        Buka Writing Brain ${Icons.arrowRight(14)}
      </button>
    </div>
  `;
}

/**
 * MODE 1 INPUT VIEW — Tactile Prompt Composer with Inspiration Chips
 */
export function renderMode1InputView(selectedTheme = 'Bebas') {
  return `
    <div class="card">
      <div class="page-header" style="margin-bottom: 1.15rem;">
        <h2 class="page-title" style="font-size: 1.35rem;">Eksplorasi Ide Sendiri</h2>
        <p class="page-subtitle">
          Tuliskan gagasan cerita Anda, atau klik inspirasi pembuka di bawah untuk memicu imajinasi seketika.
        </p>
      </div>

      <!-- Inspiration Sparks Bar -->
      <div class="inspiration-bar">
        <div class="inspiration-header">
          <span>${Icons.sparkles(13)} PEMICU INSPIRASI MISTERI:</span>
          <button type="button" class="btn btn-outline btn-sm" id="btn-surprise-premise" style="padding: 0.15rem 0.5rem; font-size: 0.74rem;">
            ${Icons.refresh(12)} Acak Inspirasi
          </button>
        </div>
        <div class="inspiration-chips-row">
          ${INSPIRATION_CHIPS.map(chip => `
            <button type="button" class="inspiration-chip" data-text="${chip.text.replace(/"/g, '&quot;')}">
              ${chip.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Premise Text Area -->
      <div class="form-group" style="margin-bottom: 1rem;">
        <label class="form-label" for="mode1-user-idea">Gagasan / Premis Cerita</label>
        <textarea id="mode1-user-idea" class="form-textarea" style="min-height: 105px; font-size: 0.92rem;" placeholder="Ketik ide awal, tokoh, atau peristiwa misteri yang ingin Anda ceritakan..."></textarea>
      </div>

      <!-- Tactile Theme Selector (Segmented Pills) -->
      <div class="form-group" style="margin-bottom: 1.5rem;">
        <label class="form-label">Pilih Nuansa & Tema Utama</label>
        <div class="segmented-pills" id="theme-pills-container">
          ${THEME_OPTIONS.map(theme => `
            <button type="button" class="pill-btn ${theme === selectedTheme ? 'active' : ''}" data-theme="${theme}">
              ${theme}
            </button>
          `).join('')}
        </div>
        <input type="hidden" id="mode1-theme-value" value="${selectedTheme}" />
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 0.85rem; flex-wrap: wrap; margin-top: 1.25rem;">
        <button class="btn btn-primary" id="btn-mode1-5options" style="flex: 1.5; min-width: 200px; padding: 0.65rem 1.15rem;">
          ${Icons.zap(16)} Buat 5 Pilihan Alur Cepat
        </button>
        <button class="btn btn-secondary" id="btn-mode1-wizard" style="flex: 1; min-width: 180px; padding: 0.65rem 1.15rem;">
          ${Icons.wand(16)} Masuk ke Story Wizard
        </button>
      </div>
    </div>
  `;
}

/**
 * OUTLINE CHOICES VIEW
 */
export function renderOutlineChoicesView(options = []) {
  return `
    <div class="page-header">
      <h2 class="page-title" style="font-size: 1.35rem;">Pilih 1 dari 5 Variasi Alur</h2>
      <p class="page-subtitle">
        Pilih kerangka plot misteri yang paling memikat untuk dituliskan menjadi cerpen utuh.
      </p>
    </div>

    <div style="display: flex; flex-direction: column; gap: 1.15rem;">
      ${options.map((opt, idx) => `
        <div class="card card-hover" style="margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.75rem; flex-wrap: wrap;">
            <h3 style="font-family: var(--font-heading); font-size: 1.12rem; color: var(--primary); font-weight: 700;">
              ${idx + 1}. ${opt.title}
            </h3>
            <div>
              ${(opt.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
          </div>
          
          <p style="font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.85rem; line-height: 1.55;">
            ${opt.synopsis}
          </p>

          <div style="background: var(--surface-muted); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.84rem; color: var(--text-muted); margin-bottom: 1.15rem; border: 1px solid var(--border-light); line-height: 1.5;">
            <div><strong>Petunjuk Kunci:</strong> ${opt.clues || '-'}</div>
            <div style="margin-top: 0.25rem;"><strong>Arah Ending:</strong> ${opt.ending || '-'}</div>
          </div>

          <button class="btn btn-primary btn-sm btn-select-outline" data-index="${idx}">
            Gunakan Alur Ini & Mulai Menulis ${Icons.arrowRight(14)}
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * WIZARD STAGES VIEW — With Interactive Stepper Ribbon (Jump to any stage)
 */
export function renderWizardStageView({ stageIndex, totalStages, stageInfo, choices = [], selections = {} }) {
  return `
    <!-- Interactive Stepper Ribbon: Allows Jumping Back and Forth -->
    <div class="wizard-stepper-ribbon">
      ${WIZARD_STAGES.map((stg, idx) => {
        const isCompleted = selections[stg.key] !== undefined;
        const isCurrent = idx === stageIndex;
        const isClickable = isCompleted || idx <= stageIndex;
        return `
          <button type="button" class="stepper-step ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}" data-step-index="${idx}" ${isClickable ? '' : 'disabled'}>
            <span class="step-num">${isCompleted && !isCurrent ? Icons.check(11) : idx + 1}</span>
            <span class="step-label">${stg.title}</span>
          </button>
        `;
      }).join('')}
    </div>

    <!-- Active Stage Information Header -->
    <div class="card" style="margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
        <div>
          <span style="font-family: monospace; font-size: 0.72rem; color: var(--primary); font-weight: 700; letter-spacing: 0.05em;">TAHAP ${stageIndex + 1} DARI ${totalStages}</span>
          <h2 class="page-title" style="font-size: 1.3rem; margin-top: 0.2rem;">${stageInfo.title}</h2>
          <p class="page-subtitle" style="font-size: 0.84rem;">${stageInfo.desc}</p>
        </div>
      </div>
    </div>

    <!-- Stage Choice Cards -->
    <div class="wizard-choices">
      ${choices.map((c, idx) => {
        const isAiPick = idx === 4 || c.label.includes('AI Pilihkan');
        const isSelected = selections[stageInfo.key] === (c.detail || c.label);
        return `
          <div class="wizard-choice-item ${isAiPick ? 'wizard-choice-ai' : ''} ${isSelected ? 'selected' : ''}" data-choice-index="${idx}">
            <div style="font-weight: 700; font-size: 0.94rem; color: ${isAiPick ? 'var(--primary)' : 'var(--text-main)'}; margin-bottom: 0.25rem; display: flex; align-items: center; justify-content: space-between;">
              <span>${c.label}</span>
              ${isAiPick ? `<span style="font-size: 0.72rem; color: var(--primary); font-weight: 600; display: inline-flex; align-items: center; gap: 3px;">${Icons.sparkles(13)} REKOMENDASI AI</span>` : ''}
            </div>
            <div style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.45;">${c.detail}</div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Navigation Footbar -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
      <button class="btn btn-outline btn-sm" id="btn-wizard-prev" ${stageIndex === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
        ← Tahap Sebelumnya
      </button>
      <span style="font-size: 0.78rem; color: var(--text-muted); font-family: monospace;">Pilih salah satu kartu untuk melanjutkan</span>
    </div>
  `;
}

/**
 * WIZARD REVIEW VIEW
 */
export function renderWizardReviewView({ wizardData, whyItWorks }) {
  return `
    <div class="card">
      <div class="page-header" style="margin-bottom: 1.25rem;">
        <h2 class="page-title" style="font-size: 1.35rem;">Tinjau Struktur Cerpen</h2>
        <p class="page-subtitle">Periksa ringkasan anatomi naskah sebelum AI menulis versi lengkap.</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.85rem; font-size: 0.88rem; margin-bottom: 1.5rem; background: var(--surface-muted); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
        <div><strong>Judul / Premis:</strong> ${wizardData.title || wizardData.premise || '-'}</div>
        <div><strong>Tokoh Utama:</strong> ${wizardData.character || '-'}</div>
        <div><strong>Setting Lokasi:</strong> ${wizardData.location || '-'}</div>
        <div><strong>Misteri Utama:</strong> ${wizardData.mystery || '-'}</div>
        <div><strong>Konflik:</strong> ${wizardData.conflict || '-'}</div>
        <div><strong>Petunjuk / Clue:</strong> ${wizardData.clues || '-'}</div>
        <div><strong>Pengungkapan:</strong> ${wizardData.reveal || '-'}</div>
        <div><strong>Ending:</strong> ${wizardData.ending || '-'}</div>
      </div>

      ${whyItWorks ? `
        <div style="background: var(--primary-light); border-left: 4px solid var(--primary); padding: 1rem 1.15rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
          <div style="font-weight: 700; font-size: 0.82rem; color: var(--primary); margin-bottom: 0.25rem; letter-spacing: 0.04em;">ANALISIS DINAMIKA PLOT:</div>
          <div style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5;">${whyItWorks}</div>
        </div>
      ` : ''}

      <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
        <button class="btn btn-primary" id="btn-generate-wizard-final" style="flex: 2; min-width: 180px;">
          ${Icons.pen(16)} Tulis Naskah Final Sekarang
        </button>
        <button class="btn btn-secondary" id="btn-improve-wizard-outline" style="flex: 1; min-width: 140px;">
          ${Icons.sparkles(16)} Sempurnakan Alur
        </button>
      </div>
    </div>
  `;
}

/**
 * IMPROVE OUTLINE VIEW
 */
export function renderImproveOutlineView({ currentOutline, improvedOutline, improvementReason }) {
  return `
    <div class="card">
      <div class="page-header" style="margin-bottom: 1.25rem;">
        <h2 class="page-title" style="font-size: 1.35rem;">Perbandingan Alur Cerita</h2>
        <p class="page-subtitle">
          Evaluasi saran perbaikan struktur cerita dari AI sebelum menulis naskah.
        </p>
      </div>

      ${improvementReason ? `
        <div style="background: var(--primary-light); border: 1px solid var(--primary); padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; font-size: 0.88rem; line-height: 1.5;">
          <strong>Rasional Perbaikan:</strong> ${improvementReason}
        </div>
      ` : ''}

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div style="background: var(--surface-muted); padding: 1.15rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
          <h4 style="font-family: var(--font-heading); color: var(--text-muted); font-size: 0.95rem; margin-bottom: 0.75rem;">Alur Awal</h4>
          <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.55; white-space: pre-wrap;">${typeof currentOutline === 'object' ? JSON.stringify(currentOutline, null, 2) : currentOutline}</p>
        </div>

        <div style="background: #FFFFFF; padding: 1.15rem; border-radius: var(--radius-sm); border: 1.5px solid var(--primary); box-shadow: var(--shadow-xs);">
          <h4 style="font-family: var(--font-heading); color: var(--primary); font-size: 0.95rem; margin-bottom: 0.75rem;">Alur yang Disempurnakan</h4>
          <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.55; white-space: pre-wrap;">${typeof improvedOutline === 'object' ? JSON.stringify(improvedOutline, null, 2) : improvedOutline}</p>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <button class="btn btn-primary" id="btn-use-improved-outline" style="flex: 1.5; min-width: 180px;">
          ${Icons.check(16)} Terapkan Alur yang Disempurnakan
        </button>
        <button class="btn btn-outline" id="btn-keep-current-outline" style="flex: 1; min-width: 140px;">
          Gunakan Alur Awal
        </button>
      </div>
    </div>
  `;
}

/**
 * STORY RESULT VIEW — Typeset Reader & Live Inline Editor Canvas
 */
export function renderStoryResultView(storyItem) {
  const wordCnt = countWords(storyItem.story);

  return `
    <div class="story-layout-grid">
      
      <!-- CARD 1: CERITA FINAL & ACTIONS -->
      <div class="card">
        <div class="card-header">
          <div class="story-mode-switch">
            <button type="button" class="mode-switch-btn active" id="btn-view-reader">
              ${Icons.fileText(14)} Mode Baca
            </button>
            <button type="button" class="mode-switch-btn" id="btn-view-editor">
              ${Icons.pen(14)} Mode Edit Naskah
            </button>
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted); font-family: monospace;" id="story-word-count-display">±${wordCnt} kata</span>
        </div>

        <!-- Typography Toolbar (In Read Mode) -->
        <div class="story-toolbar" id="story-typography-toolbar">
          <span style="font-size: 0.76rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Gaya Teks:</span>
          
          <select id="title-font-select" class="form-select" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.82rem;">
            <option value="serif">Serif (Literer)</option>
            <option value="sans">Sans (Modern)</option>
          </select>

          <select id="title-weight-select" class="form-select" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.82rem;">
            <option value="bold">Tebal</option>
            <option value="normal">Normal</option>
          </select>

          <select id="title-style-select" class="form-select" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.82rem;">
            <option value="normal">Tegak</option>
            <option value="italic">Miring (Italic)</option>
          </select>
        </div>

        <!-- Story Display Box (Reader Mode) -->
        <div class="story-box" id="story-display-box">
          <div class="story-title-display title-serif title-bold" id="story-title-render">${storyItem.title}</div>
          <div id="story-body-render">${storyItem.story}</div>
        </div>

        <!-- Live Inline Editor Container (Edit Mode) -->
        <div id="story-edit-container" style="display: none; margin-bottom: 1rem;">
          <label class="form-label" for="story-edit-title-input">Judul Cerita</label>
          <input type="text" id="story-edit-title-input" class="form-control" value="${storyItem.title}" style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem;" />
          
          <label class="form-label" for="story-edit-body-input">Isi Naskah Cerpen</label>
          <textarea id="story-edit-body-input" class="form-textarea story-live-editor">${storyItem.story}</textarea>
          
          <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.65rem;">
            <button type="button" class="btn btn-primary btn-sm" id="btn-save-inline-edit">
              ${Icons.check(14)} Simpan Perubahan Naskah
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 0.65rem; margin-top: 1.25rem; flex-wrap: wrap;">
          <button class="btn btn-primary" id="btn-copy-story" style="flex: 2; min-width: 150px;">
            ${Icons.copy(16)} Salin Naskah
          </button>
          <button class="btn btn-secondary" id="btn-critique-story" style="flex: 1.5; min-width: 150px;">
            ${Icons.chat(16)} Bedah di Editor AI
          </button>
          <button class="btn btn-outline" id="btn-export-story-md" style="flex: 1; min-width: 110px;">
            ${Icons.download(16)} Export MD
          </button>
        </div>
      </div>

      <!-- CARD 2: COVER IMAGE GENERATOR (Integrated Prompt & Image) -->
      <div class="card">
        <div class="card-header">
          <h3 style="font-family: var(--font-heading); font-size: 1.12rem; color: var(--text-main); font-weight: 700;">Ilustrasi Sampul</h3>
        </div>
        
        <div style="text-align: center; background: var(--surface-muted); border: 1.5px dashed var(--border); border-radius: var(--radius-sm); padding: 1.25rem; margin-bottom: 1.15rem;">
          ${storyItem.imageData ? `
            <img src="${storyItem.imageData}" alt="Cover Cerita" style="max-width: 100%; height: auto; border-radius: var(--radius-sm); box-shadow: var(--shadow-md); margin: 0 auto;" />
          ` : `
            <div style="color: var(--text-muted); font-size: 0.84rem;">
              Belum ada cover visual. Buat ilustrasi dengan prompt di bawah.
            </div>
          `}
        </div>

        <div class="form-group">
          <label class="form-label">Prompt Visual AI</label>
          <textarea id="image-prompt-textarea" class="form-textarea" style="font-family: monospace; font-size: 0.82rem; min-height: 80px;">${storyItem.imagePrompt || ''}</textarea>
        </div>

        <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-generate-image-now">
            ${Icons.image(15)} ${storyItem.imageData ? 'Generate Ulang Cover' : 'Generate Cover Gambar'}
          </button>
          <button class="btn btn-outline btn-sm" id="btn-copy-image-prompt">
            ${Icons.copy(15)} Salin Prompt
          </button>
        </div>
      </div>

    </div>
  `;
}

/**
 * WRITING BRAIN DASHBOARD & KNOWLEDGE MANAGEMENT VIEW
 */
export function renderWritingBrainView({ entries = [], profile = {}, healthReport = null, activeTab = 'knowledge', filterCategory = 'all', searchQuery = '' }) {
  const activeEntries = entries.filter(e => e.status === 'active');
  const userRulesCount = activeEntries.filter(e => e.source === 'user').length;
  const researchRulesCount = activeEntries.filter(e => e.source === 'research').length;
  const brainstormRulesCount = activeEntries.filter(e => e.source === 'brainstorm').length;

  let filtered = activeEntries;
  if (filterCategory !== 'all') {
    filtered = filtered.filter(e => e.category === filterCategory);
  }
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q) || (e.tags || []).some(t => t.toLowerCase().includes(q)));
  }

  return `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
        <div>
          <h2 class="page-title" style="font-size: 1.35rem;">Writing Brain Dashboard</h2>
          <p class="page-subtitle">
            Repositori aturan kepenulisan lokal yang berevolusi melalui mekanisme persetujuan (*approval*).
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-wb-add-entry">
            ${Icons.plus(15)} Tambah Kaidah
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-wb-health-check">
            ${Icons.activity(15)} Health Check
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
        <div class="stat-card">
          <div class="stat-num">${activeEntries.length}</div>
          <div class="stat-label">TOTAL KAIDAH</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${userRulesCount}</div>
          <div class="stat-label">ATURAN PENGGUNA</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${researchRulesCount}</div>
          <div class="stat-label">HASIL RISET</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${brainstormRulesCount}</div>
          <div class="stat-label">HASIL DISKUSI</div>
        </div>
      </div>

      ${healthReport ? `
        <div class="card" style="background: var(--primary-light); border: 1.5px solid var(--primary); margin-bottom: 1.25rem;">
          <h4 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 0.35rem; font-size: 0.95rem;">LAPORAN HEALTH CHECK</h4>
          <p style="font-size: 0.86rem;"><strong>Skor:</strong> ${healthReport.healthScore}/100 | <strong>Duplikasi:</strong> ${healthReport.duplicatesCount} | <strong>Entri Kosong:</strong> ${healthReport.emptyEntriesCount}</p>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.25rem;">Health check bersifat analitis dan tidak mengubah data tanpa konfirmasi.</p>
        </div>
      ` : ''}

      <!-- Search Input -->
      <div style="margin-bottom: 0.85rem;">
        <input type="text" id="wb-search-input" class="form-control" placeholder="Cari kaidah cerita..." value="${searchQuery}" />
      </div>

      <!-- Tactile Category Filter Pills -->
      <div class="segmented-pills" id="wb-filter-pills" style="margin-bottom: 1.15rem;">
        <button type="button" class="pill-btn ${filterCategory === 'all' ? 'active' : ''}" data-cat="all">
          Semua (${activeEntries.length})
        </button>
        ${BRAIN_CATEGORIES.map(cat => {
          const count = activeEntries.filter(e => e.category === cat).length;
          return `
            <button type="button" class="pill-btn ${filterCategory === cat ? 'active' : ''}" data-cat="${cat}">
              ${cat} (${count})
            </button>
          `;
        }).join('')}
      </div>

      <!-- Knowledge Items List -->
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${filtered.length === 0 ? `
          <div style="text-align: center; color: var(--text-muted); padding: 2rem; background: var(--surface-muted); border-radius: var(--radius-sm);">
            Tidak ada entri pengetahuan yang sesuai filter.
          </div>
        ` : filtered.map(e => `
          <div class="wb-entry-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem; gap: 0.5rem;">
              <div>
                <span class="tag">${e.category}</span>
                <strong style="font-size: 0.92rem; color: var(--text-main);">${e.title}</strong>
              </div>
              <span style="font-size: 0.72rem; color: var(--text-muted); background: var(--secondary-light); padding: 0.15rem 0.45rem; border-radius: 4px; flex-shrink: 0; font-family: monospace;">v${e.version || 1} • ${e.source}</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.5rem;">${e.content}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-size: 0.76rem; color: var(--text-muted); font-family: monospace;">
                ${(e.tags || []).map(t => `#${t}`).join(' ')}
              </div>
              <div style="display: flex; gap: 0.4rem;">
                <button class="btn btn-outline btn-sm btn-edit-wb" data-id="${e.id}" style="padding: 0.2rem 0.5rem; font-size: 0.76rem;">Edit</button>
                <button class="btn btn-danger btn-sm btn-delete-wb" data-id="${e.id}" style="padding: 0.2rem 0.5rem; font-size: 0.76rem;">Hapus</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * AI RESEARCH VIEW — With Preset Topic Chips
 */
export function renderResearchView({ sessions = [], activeSession = null, mode = 'quick' }) {
  return `
    <div class="card">
      <div class="page-header" style="margin-bottom: 1.25rem;">
        <h2 class="page-title" style="font-size: 1.35rem;">AI Research Lab</h2>
        <p class="page-subtitle">
          Riset teknik penulisan, analisis dinamika misteri, dan sintesis aturan baru untuk Writing Brain Anda.
        </p>
      </div>

      <!-- Quick Research Topic Chips -->
      <div class="inspiration-bar">
        <div class="inspiration-header">
          <span>${Icons.sparkles(13)} REKOMENDASI TOPIK RISET:</span>
        </div>
        <div class="inspiration-chips-row">
          ${RESEARCH_QUICK_PROMPTS.map(p => `
            <button type="button" class="inspiration-chip btn-research-chip" data-query="${p.replace(/"/g, '&quot;')}">
              ${p}
            </button>
          `).join('')}
        </div>
      </div>

      <form id="research-form">
        <div class="form-group">
          <label class="form-label">Topik atau Pertanyaan Riset</label>
          <textarea id="research-question-input" class="form-textarea" placeholder="Ketik topik riset sastra/misteri..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Pilih Mode Riset</label>
          <div class="mode-segmented-control" id="research-mode-segmented">
            <button type="button" class="mode-segment-btn ${mode === 'quick' ? 'active' : ''}" data-mode="quick">
              <span class="mode-icon" style="width: auto; height: auto; background: none; font-size: 1rem; margin: 0; display: inline-flex;">${Icons.zap(16)}</span>
              <div class="mode-info">
                <span class="mode-title">Quick Research</span>
                <span class="mode-time">~10 detik</span>
              </div>
            </button>
            <button type="button" class="mode-segment-btn ${mode === 'deep' ? 'active' : ''}" data-mode="deep">
              <span class="mode-icon" style="width: auto; height: auto; background: none; font-size: 1rem; margin: 0; display: inline-flex;">${Icons.microscope(16)}</span>
              <div class="mode-info">
                <span class="mode-title">Deep Research</span>
                <span class="mode-time">~30 detik</span>
              </div>
            </button>
          </div>

          <div class="mode-description-box" id="research-mode-desc">
            ${mode === 'quick' 
              ? '<strong>Quick Research:</strong> Analisis terarah untuk sintesis cepat 1–2 usulan aturan Writing Brain.' 
              : '<strong>Deep Research:</strong> Eksplorasi mendalam (teknik sastra, psikologi karakter, dinamika plot) dengan sintesis 3–5 usulan aturan.'
            }
          </div>
        </div>

        <button type="submit" class="btn btn-primary" id="btn-run-research" style="margin-top: 1rem; width: 100%;">
          ${Icons.microscope(16)} Mulai Riset Penulisan
        </button>
      </form>

      ${activeSession ? `
        <div style="margin-top: 1.5rem; border-top: 1px solid var(--border); padding-top: 1.25rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.5rem;">
            Hasil Riset Terkini
          </h3>
          
          <div style="background: var(--surface-muted); padding: 1.15rem; border-radius: var(--radius-sm); border: 1px solid var(--border); font-size: 0.9rem; line-height: 1.6; white-space: pre-wrap; margin-bottom: 1rem;">
            ${activeSession.findings || activeSession.answer}
          </div>

          ${activeSession.proposals && activeSession.proposals.length > 0 ? `
            <div style="margin-top: 1rem;">
              <h4 style="font-family: var(--font-heading); color: var(--primary); font-size: 0.95rem; margin-bottom: 0.5rem;">
                Usulan Aturan dari Riset Ini:
              </h4>
              ${activeSession.proposals.map(p => renderProposalCard(p)).join('')}
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * BRAINSTORMING & EDITOR PARTNER VIEW — Studio Layout with Quick Action Prompts
 */
export function renderBrainstormView({ conversation = null, mode = 'discuss' }) {
  const messages = conversation ? conversation.messages : [];
  const proposals = conversation ? conversation.proposals : [];

  return `
    <div class="card studio-card">
      <div class="card-header">
        <div>
          <h2 class="page-title" style="font-size: 1.3rem; margin-bottom: 0.15rem;">Editor Partner & Diskusi</h2>
          <p class="page-subtitle" style="font-size: 0.82rem;">Diskusikan alur, evaluasi karakter, atau diskusikan kelemahan cerita.</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-new-brainstorm">${Icons.plus(14)} Diskusi Baru</button>
      </div>

      <!-- Chat Messages Window -->
      <div class="chat-window" id="brainstorm-chat-window">
        ${messages.length === 0 ? `
          <div style="text-align: center; color: var(--text-muted); margin: auto; padding: 2rem;">
            <div style="color: var(--primary); margin-bottom: 0.5rem; display: inline-flex;">${Icons.chat(32)}</div>
            <p style="font-size: 0.9rem;">Mulai berdiskusi dengan Editor AI mengenai karakter, plot twist, atau evaluasi naskah Anda.</p>
          </div>
        ` : messages.map(msg => `
          <div class="chat-bubble ${msg.sender === 'user' ? 'chat-user' : 'chat-ai'}">
            <div style="font-size: 0.72rem; opacity: 0.8; margin-bottom: 0.25rem; font-weight: 700; letter-spacing: 0.04em;">${msg.sender === 'user' ? 'ANDA' : 'EDITOR AI'}</div>
            <div style="font-size: 0.92rem; line-height: 1.5; white-space: pre-wrap;">${msg.text}</div>
            
            ${msg.critiqueBreakdown && msg.critiqueBreakdown.problems ? `
              <div style="margin-top: 0.75rem; background: rgba(0,0,0,0.04); padding: 0.65rem 0.85rem; border-radius: 6px; font-size: 0.85rem;">
                <strong>Catatan:</strong> ${msg.critiqueBreakdown.problems}<br/>
                <strong>Saran:</strong> ${msg.critiqueBreakdown.suggestedImprovement}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Proposals generated in this session -->
      ${proposals.length > 0 ? `
        <div style="margin-top: 0.75rem; border-top: 1px solid var(--border); padding-top: 0.75rem;">
          <h4 style="font-family: var(--font-heading); color: var(--primary); font-size: 0.92rem; margin-bottom: 0.4rem;">Usulan Aturan dari Diskusi:</h4>
          ${proposals.map(p => renderProposalCard(p)).join('')}
        </div>
      ` : ''}

      <!-- Message Input Form with Quick Prompts -->
      <form id="brainstorm-form" style="margin-top: 0.75rem;">
        <div class="chat-quick-actions">
          ${BRAINSTORM_QUICK_PROMPTS.map(p => `
            <button type="button" class="quick-action-chip btn-brainstorm-prompt" data-prompt="${p.replace(/"/g, '&quot;')}">
              ${p}
            </button>
          `).join('')}
        </div>

        <div class="form-group" style="margin-bottom: 0.45rem;">
          <textarea id="brainstorm-input-text" class="form-textarea" style="min-height: 65px;" placeholder="Ketik pesan atau pertanyaan untuk Editor AI... (Enter kirim, Shift+Enter baris baru)"></textarea>
        </div>

        <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; gap: 0.5rem;">
            <button type="submit" class="btn btn-primary btn-sm" id="btn-send-discuss">
              ${Icons.chat(14)} Kirim Diskusi
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-send-critique">
              ${Icons.search(14)} Minta Kritik Tajam
            </button>
          </div>
          <div style="font-size: 0.74rem; color: var(--text-muted); font-family: monospace;">Enter ↵ kirim • Shift+Enter baris baru</div>
        </div>
      </form>
    </div>
  `;
}

/**
 * FULL APP BACKUP & RESTORE VIEW
 */
export function renderBackupView({ historyMeta = [], restorePreview = null }) {
  return `
    <div class="card">
      <div class="page-header" style="margin-bottom: 1.25rem;">
        <h2 class="page-title" style="font-size: 1.35rem;">Backup & Restore Aplikasi</h2>
        <p class="page-subtitle">
          Simpan seluruh kondisi aplikasi (Writing Brain, Riset, Diskusi, Cerita, Pengaturan) ke dalam satu file ZIP terstruktur.
        </p>
      </div>

      <!-- SECTION 1: EXPORT -->
      <div style="background: var(--surface-muted); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 1.5rem;">
        <h3 class="section-title" style="font-size: 1.05rem; margin-bottom: 0.5rem;">Export Full Backup ZIP</h3>
        
        <div style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 0.85rem;">
          Pilih komponen data yang ingin dicadangkan:
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.65rem; font-size: 0.86rem; margin-bottom: 1.15rem;">
          <label><input type="checkbox" id="chk-bk-brain" checked /> Writing Brain</label>
          <label><input type="checkbox" id="chk-bk-research" checked /> Research Sessions</label>
          <label><input type="checkbox" id="chk-bk-brainstorm" checked /> Brainstorm Lab</label>
          <label><input type="checkbox" id="chk-bk-stories" checked /> Story History</label>
          <label><input type="checkbox" id="chk-bk-images" checked /> Generated Images</label>
          <label><input type="checkbox" id="chk-bk-ai" checked /> AI Settings</label>
          <label><input type="checkbox" id="chk-bk-keys" /> Sertakan API Key</label>
        </div>

        <button class="btn btn-primary btn-block" id="btn-export-full-zip">
          ${Icons.download(16)} Download File Backup ZIP
        </button>
      </div>

      <!-- SECTION 2: IMPORT / RESTORE -->
      <div style="background: var(--surface-muted); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 1.5rem;">
        <h3 class="section-title" style="font-size: 1.05rem; margin-bottom: 0.5rem;">Import & Pulihkan Data</h3>
        
        <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 1rem;">
          Pilih file backup ZIP (ceritametro-backup-*.zip) dari perangkat lain untuk memulihkan kondisi aplikasi.
        </p>

        <label class="btn btn-secondary btn-block" style="cursor: pointer; text-align: center;">
          ${Icons.upload(16)} Pilih File Backup ZIP
          <input type="file" id="input-import-backup-zip" accept=".zip" style="display: none;" />
        </label>
      </div>

      <!-- RESTORE PREVIEW MODAL -->
      ${restorePreview ? `
        <div class="card" style="background: var(--primary-light); border: 2px solid var(--primary); margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-heading); color: var(--primary); font-size: 1.12rem; margin-bottom: 0.5rem;">Pratinjau Isi Backup</h3>
          
          <div style="font-size: 0.86rem; line-height: 1.6; margin-bottom: 1rem;">
            <p><strong>File:</strong> ${restorePreview.manifest.backupFileName || 'backup.zip'}</p>
            <p><strong>Dibuat Pada:</strong> ${restorePreview.manifest.createdAtLocal || '-'}</p>
            <p><strong>Jumlah Cerita:</strong> ${restorePreview.stories.length} cerita</p>
            <p><strong>Writing Brain Entries:</strong> ${restorePreview.writingBrainEntries.length} entri</p>
            <p><strong>Sesi Riset:</strong> ${restorePreview.researchSessions.length} sesi</p>
            <p><strong>Diskusi:</strong> ${restorePreview.brainstormConversations.length} diskusi</p>
          </div>

          <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
            <button class="btn btn-primary" id="btn-restore-merge" style="flex: 1; min-width: 150px;">
              ${Icons.refresh(15)} Gabungkan Data (Merge)
            </button>
            <button class="btn btn-danger" id="btn-restore-replace" style="flex: 1; min-width: 150px;">
              ${Icons.trash(15)} Timpa Semua (Replace)
            </button>
            <button class="btn btn-outline" id="btn-restore-cancel">Batal</button>
          </div>
        </div>
      ` : ''}

      ${historyMeta && historyMeta.length > 0 ? `
        <div>
          <h4 style="font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-main);">Riwayat Cadangan Lokal Terkini</h4>
          <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem;">
            ${historyMeta.map(h => `
              <div style="display: flex; justify-content: space-between; background: var(--surface-muted); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                <span style="font-family: monospace;">${h.fileName}</span>
                <span style="color: var(--text-muted);">${h.createdAtLocal} (${(h.size / 1024).toFixed(1)} KB)</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * SETTINGS VIEW
 */
export function renderSettingsView(settings, scannedTextModels = [], scannedImageModels = [], authStatus = 'none') {
  return `
    <div class="card">
      <div class="page-header" style="margin-bottom: 1.25rem;">
        <h2 class="page-title" style="font-size: 1.35rem;">Pengaturan API Provider</h2>
        <p class="page-subtitle">
          Konfigurasikan endpoint dan API Key provider AI yang Anda gunakan.
        </p>
      </div>

      <div style="font-size: 0.82rem; color: var(--text-muted); background: var(--surface-muted); padding: 0.65rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <span style="color: var(--primary); display: inline-flex;">${Icons.shield(16)}</span>
        <span>API Key disimpan secara lokal di browser Anda (localStorage) dan tidak pernah dikirim ke server pihak ketiga.</span>
      </div>

      <form id="settings-form">
        <h3 class="section-title" style="font-size: 1.05rem; margin-bottom: 0.75rem;">1. AI Text Provider</h3>

        <div class="form-group">
          <label class="form-label">Endpoint URL</label>
          <input type="text" id="setting-endpoint" class="form-control" value="${settings.endpoint}" placeholder="https://api.openai.com/v1/chat/completions" />
        </div>

        <div class="form-group">
          <label class="form-label">API Key</label>
          <input type="password" id="setting-apiKey" class="form-control" value="${settings.apiKey}" placeholder="sk-..." />
        </div>

        <div class="form-group">
          <label class="form-label">Nama Model Teks</label>
          <div class="model-selector">
            <div class="model-input-row" style="display: flex; gap: 0.5rem;">
              <input type="text" id="setting-model" class="form-control" value="${settings.model}" placeholder="Pilih atau ketik model" autocomplete="off" />
              <button type="button" class="btn btn-secondary btn-sm" id="btn-scan-text-models" style="white-space: nowrap;">
                ${Icons.search(14)} Pindai
              </button>
            </div>
            ${scannedTextModels.length > 0 ? `
              <div class="model-chips" id="text-model-chips">
                ${scannedTextModels.map(m => `
                  <button type="button" class="model-chip ${m === settings.model ? 'model-chip-active' : ''}" data-model="${m}" data-target="setting-model">
                    ${m}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid var(--border-light); margin: 1.5rem 0;" />

        <h3 class="section-title" style="font-size: 1.05rem; margin-bottom: 0.75rem;">2. AI Image Provider</h3>

        <div class="form-group">
          <label class="form-label">Endpoint URL Gambar</label>
          <input type="text" id="setting-imageEndpoint" class="form-control" value="${settings.imageEndpoint}" placeholder="https://api.openai.com/v1/images/generations" />
        </div>

        <div class="form-group">
          <label class="form-label">API Key Gambar (Opsional jika sama dengan Text)</label>
          <input type="password" id="setting-imageApiKey" class="form-control" value="${settings.imageApiKey}" placeholder="sk-..." />
        </div>

        <div class="form-group">
          <label class="form-label">Nama Model Gambar</label>
          <div class="model-selector">
            <div class="model-input-row" style="display: flex; gap: 0.5rem;">
              <input type="text" id="setting-imageModel" class="form-control" value="${settings.imageModel}" placeholder="Pilih atau ketik model gambar" autocomplete="off" />
              <button type="button" class="btn btn-secondary btn-sm" id="btn-scan-image-models" style="white-space: nowrap;">
                ${Icons.search(14)} Pindai
              </button>
            </div>
            ${scannedImageModels.length > 0 ? `
              <div class="model-chips" id="image-model-chips">
                ${scannedImageModels.map(m => `
                  <button type="button" class="model-chip ${m === settings.imageModel ? 'model-chip-active' : ''}" data-model="${m}" data-target="setting-imageModel">
                    ${m}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid var(--border-light); margin: 1.5rem 0;" />

        <h3 class="section-title" style="font-size: 1.05rem; margin-bottom: 0.5rem;">3. Keamanan & Kunci Aplikasi</h3>
        
        <div style="background: var(--surface-muted); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.75rem 1rem; margin-bottom: 1rem; font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.3rem;">
            <span style="font-weight: 600; color: var(--text-main);">Status Proteksi:</span>
            <span>
              ${authStatus === 'github_secret' 
                ? '<span style="color: var(--success); font-weight: 700;">Terkunci via GitHub Secret (APP_PASSWORD)</span>' 
                : authStatus === 'local_storage'
                ? '<span style="color: var(--primary); font-weight: 700;">Terkunci via Password Lokal Perangkat</span>'
                : '<span style="color: var(--text-muted);">Belum Terkunci (Atur secret di GitHub atau buat password lokal)</span>'
              }
            </span>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin: 0; line-height: 1.4;">
            Password master dienkripsi dengan SHA-256 dan melindungi akses ke seluruh menu Cerita Metro.
          </p>
        </div>

        <div style="display: flex; gap: 0.65rem; flex-wrap: wrap; margin-bottom: 1rem;">
          <button type="button" class="btn btn-secondary btn-sm" id="btn-lock-app-now">
            ${Icons.lock(14)} Kunci Aplikasi Sekarang
          </button>
          <button type="button" class="btn btn-outline btn-sm" id="btn-set-local-password">
            ${Icons.key(14)} Atur / Ubah Password Lokal
          </button>
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1.25rem;">
          Simpan Pengaturan
        </button>
      </form>
    </div>
  `;
}

/**
 * LOCK SCREEN VIEW — Fullscreen App Lock
 */
export function renderLockScreenView(errorMessage = '') {
  return `
    <div class="lock-screen-container">
      <div class="card lock-card">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div class="brand-icon" style="width: 44px; height: 44px; font-size: 1.15rem; margin: 0 auto 0.75rem auto;">CM</div>
          <h2 class="page-title" style="font-size: 1.3rem; margin-bottom: 0.25rem;">CERITA METRO</h2>
          <p class="page-subtitle" style="font-size: 0.84rem;">
            Aplikasi Terkunci — Masukkan password untuk melanjutkan.
          </p>
        </div>

        ${errorMessage ? `
          <div style="background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger-border); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.84rem; margin-bottom: 1rem; text-align: center;">
            ${errorMessage}
          </div>
        ` : ''}

        <form id="lock-screen-form">
          <div class="form-group" style="margin-bottom: 0.85rem;">
            <label class="form-label" for="lock-password-input">Password Master</label>
            <div style="position: relative;">
              <input type="password" id="lock-password-input" class="form-control" placeholder="Ketik password..." autocomplete="current-password" autofocus required style="padding-right: 40px;" />
              <button type="button" id="btn-toggle-password-visibility" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; display: inline-flex; align-items: center;" aria-label="Lihat Password">
                ${Icons.eye(16)}
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; font-size: 0.82rem; color: var(--text-muted);">
            <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="checkbox" id="lock-remember-me" checked /> Ingat di perangkat ini
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="padding: 0.65rem 1rem;">
            ${Icons.unlock(16)} Buka Aplikasi
          </button>
        </form>

        <div style="margin-top: 1.5rem; padding-top: 0.85rem; border-top: 1px solid var(--border-light); font-size: 0.74rem; color: var(--text-subtle); text-align: center; line-height: 1.4; font-family: monospace;">
          ENKRIPSI SHA-256 • GITHUB SECRET
        </div>
      </div>
    </div>
  `;
}

/**
 * HISTORY VIEW
 */
export function renderHistoryView(stories = []) {
  return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
      <div>
        <h2 class="page-title" style="font-size: 1.35rem;">Arsip Cerita</h2>
        <p class="page-subtitle">Daftar naskah cerpen yang telah dibuat di studio ini.</p>
      </div>
    </div>

    ${stories.length === 0 ? `
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="color: var(--text-subtle); margin-bottom: 0.5rem; display: inline-flex;">${Icons.archive(36)}</div>
        <p style="color: var(--text-muted); font-size: 0.92rem;">Belum ada riwayat cerita yang disimpan.</p>
        <button class="btn btn-primary btn-sm" data-route="home" style="margin-top: 1rem;">
          ${Icons.plus(14)} Buat Cerita Pertama
        </button>
      </div>
    ` : `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${stories.map(s => {
          const dateStr = new Date(s.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
          const wordCnt = countWords(s.story);
          return `
            <div class="card card-hover" style="margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.5rem;">
                <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--primary); font-weight: 700;">${s.title}</h3>
                <span style="font-size: 0.76rem; color: var(--text-muted); font-family: monospace;">${dateStr}</span>
              </div>
              <p style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 0.85rem;">
                Mode: ${s.mode || 'Otomatis'} • ±${wordCnt} kata
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-primary btn-sm btn-open-history" data-id="${s.id}">
                  ${Icons.fileText(14)} Buka Naskah
                </button>
                <button class="btn btn-outline btn-sm btn-copy-history" data-id="${s.id}">
                  ${Icons.copy(14)} Salin Teks
                </button>
                <button class="btn btn-danger btn-sm btn-delete-history" data-id="${s.id}">
                  ${Icons.trash(14)} Hapus
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
}
