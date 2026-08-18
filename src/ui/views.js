/**
 * Main Application View Templates — V4 Architecture (Unified Design System)
 */

import { renderProposalCard } from './components.js';
import { countWords } from '../utils/text.js';
import { BRAIN_CATEGORIES } from '../core/writing-brain.js';

export const THEME_OPTIONS = [
  'Bebas',
  'Keluarga',
  'Ekonomi',
  'Pekerjaan',
  'Cinta',
  'Kehidupan Kota',
  'Persahabatan',
  'Kehilangan',
  'Lainnya'
];

/**
 * HOME VIEW — Generator Hub (No Redundant Navigation Buttons)
 */
export function renderHomeView(brainEntriesCount = 0) {
  return `
    <div class="page-header" style="text-align: center; margin-bottom: 2rem; margin-top: 0.5rem;">
      <h1 class="page-title" style="font-size: 2.2rem;">
        CERITA METRO
      </h1>
      <p style="font-size: 1.05rem; color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">
        Realistic Metro-Pop Mystery Generator & Evolving Writing Lab
      </p>
      <p class="page-subtitle" style="max-width: 600px; margin: 0 auto;">
        Buat cerpen misteri urban Indonesia yang logis, beremosi natural, dan diperkuat oleh Writing Brain lokal yang terus berkembang.
      </p>
    </div>

    <!-- 3 Core Modes -->
    <div class="mode-grid">
      <div class="mode-card" data-action="start-mode-1">
        <div class="mode-icon">✍️</div>
        <div class="mode-card-title">Ide Sendiri</div>
        <div class="mode-card-desc">
          Tulis premis atau ide cerita Anda. Pilih antara 5 Pilihan Alur Otomatis atau 8-Stage Story Wizard.
        </div>
        <span class="mode-badge">Fleksibel & Terarah</span>
      </div>

      <div class="mode-card" data-action="start-mode-2">
        <div class="mode-icon">⚡</div>
        <div class="mode-card-title">Alur Otomatis</div>
        <div class="mode-card-desc">
          AI langsung menyusun 5 variasi plot misteri realistis dari database Writing Brain untuk Anda pilih.
        </div>
        <span class="mode-badge">Instan & Cepat</span>
      </div>

      <div class="mode-card" data-action="start-mode-3">
        <div class="mode-icon">🧙‍♂️</div>
        <div class="mode-card-title">Story Wizard</div>
        <div class="mode-card-desc">
          Bangun struktur cerpen langkah demi langkah: premis, tokoh, misteri, konflik, hingga ending twist.
        </div>
        <span class="mode-badge">Interaktif 8 Tahap</span>
      </div>
    </div>

    <!-- Quick Brain Status Widget -->
    <div class="hub-widget">
      <div class="hub-info">
        <div class="hub-icon">🧠</div>
        <div>
          <strong style="font-size: 0.95rem; color: var(--text-main); display: block;">Writing Brain Aktif</strong>
          <span style="font-size: 0.82rem; color: var(--text-muted);">
            AI cerita ditenagai oleh aturan kepenulisan lokal yang terus berevolusi.
          </span>
        </div>
      </div>
      <button class="btn btn-secondary btn-sm" data-route="brain">
        Buka Writing Brain →
      </button>
    </div>
  `;
}

/**
 * MODE 1 INPUT VIEW
 */
export function renderMode1InputView() {
  return `
    <div class="card">
      <div class="page-header" style="margin-bottom: 1.25rem;">
        <h2 class="page-title" style="font-size: 1.4rem;">Mode 1: Mulai dari Ide Sendiri</h2>
        <p class="page-subtitle">
          Masukkan gagasan cerita, karakter, atau potongan peristiwa yang ingin Anda kembangkan.
        </p>
      </div>

      <div class="form-group">
        <label class="form-label">Gagasan / Premis Cerita</label>
        <textarea id="mode1-user-idea" class="form-textarea" placeholder="Contoh: Seorang notaris menemukan amplop wasiat yang disegel kembali dengan lilin berbeda..."></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Tema Utama</label>
        <select id="mode1-theme" class="form-select">
          ${THEME_OPTIONS.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
      </div>

      <div style="display: flex; gap: 0.85rem; flex-wrap: wrap; margin-top: 1.75rem;">
        <button class="btn btn-primary" id="btn-mode1-5options" style="flex: 1; min-width: 200px;">
          ⚡ Buat 5 Pilihan Alur
        </button>
        <button class="btn btn-secondary" id="btn-mode1-wizard" style="flex: 1; min-width: 200px;">
          🧙‍♂️ Masuk ke Story Wizard
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
      <h2 class="page-title" style="font-size: 1.4rem;">Pilih 1 dari 5 Alur Cerita</h2>
      <p class="page-subtitle">
        Pilih alur misteri yang paling menarik untuk dikembangkan menjadi naskah cerpen utuh.
      </p>
    </div>

    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      ${options.map((opt, idx) => `
        <div class="card card-hover" style="margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.75rem; flex-wrap: wrap;">
            <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary); font-weight: 700;">
              ${idx + 1}. ${opt.title}
            </h3>
            <div>
              ${(opt.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
          </div>
          
          <p style="font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.85rem; line-height: 1.55;">
            ${opt.synopsis}
          </p>

          <div style="background: var(--surface-muted); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.15rem; border: 1px solid var(--border-light); line-height: 1.5;">
            <div><strong>Petunjuk Kunci:</strong> ${opt.clues || '-'}</div>
            <div style="margin-top: 0.25rem;"><strong>Arah Ending:</strong> ${opt.ending || '-'}</div>
          </div>

          <button class="btn btn-primary btn-sm btn-select-outline" data-index="${idx}">
            Gunakan Alur Ini & Mulai Menulis →
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * WIZARD STAGES VIEW
 */
export function renderWizardStageView({ stageIndex, totalStages, stageInfo, choices = [], selections = {} }) {
  return `
    <div class="wizard-progress">
      <div style="display: flex; align-items: center; gap: 0.65rem;">
        <span class="wizard-badge">Tahap ${stageIndex + 1} dari ${totalStages}</span>
        <strong style="font-family: var(--font-heading); font-size: 1.05rem;">${stageInfo.title}</strong>
      </div>
      <div style="font-size: 0.84rem; color: var(--text-muted);">${stageInfo.desc}</div>
    </div>

    <div class="wizard-choices">
      ${choices.map((c, idx) => {
        const isAiPick = idx === 4 || c.label.includes('AI Pilihkan');
        return `
          <div class="wizard-choice-item ${isAiPick ? 'wizard-choice-ai' : ''}" data-choice-index="${idx}">
            <div style="font-weight: 700; font-size: 0.95rem; color: ${isAiPick ? 'var(--primary)' : 'var(--text-main)'}; margin-bottom: 0.25rem;">
              ${c.label} ${isAiPick ? '⭐' : ''}
            </div>
            <div style="font-size: 0.86rem; color: var(--text-muted); line-height: 1.45;">${c.detail}</div>
          </div>
        `;
      }).join('')}
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
      <button class="btn btn-outline btn-sm" id="btn-wizard-prev" ${stageIndex === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
        ← Kembali
      </button>
      <span style="font-size: 0.82rem; color: var(--text-muted);">Klik salah satu opsi di atas untuk lanjut</span>
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
        <h2 class="page-title" style="font-size: 1.4rem;">Tinjau Alur Cerita Anda</h2>
        <p class="page-subtitle">Periksa ringkasan struktur cerita sebelum AI mulai menulis naskah final.</p>
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
          <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary); margin-bottom: 0.25rem;">ANALISIS DINAMIKA CERITA:</div>
          <div style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5;">${whyItWorks}</div>
        </div>
      ` : ''}

      <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
        <button class="btn btn-primary" id="btn-generate-wizard-final" style="flex: 2; min-width: 180px;">
          🚀 Buat Cerita Final Sekarang
        </button>
        <button class="btn btn-secondary" id="btn-improve-wizard-outline" style="flex: 1; min-width: 140px;">
          ✨ Perbaiki Alur dengan AI
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
        <h2 class="page-title" style="font-size: 1.3rem;">Perbandingan Alur Cerita</h2>
        <p class="page-subtitle">
          <strong>Alasan Saran Perbaikan:</strong> ${improvementReason}
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
        <div style="background: var(--surface-muted); padding: 1.15rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
          <h4 style="font-family: var(--font-heading); color: var(--text-muted); margin-bottom: 0.5rem; font-size: 0.95rem;">VERSI SAAT INI</h4>
          <div style="font-size: 0.86rem; line-height: 1.5;">
            <p style="margin-bottom: 0.35rem;"><strong>Misteri:</strong> ${currentOutline.mystery || '-'}</p>
            <p style="margin-bottom: 0.35rem;"><strong>Petunjuk:</strong> ${currentOutline.clues || '-'}</p>
            <p><strong>Ending:</strong> ${currentOutline.ending || '-'}</p>
          </div>
        </div>

        <div style="background: var(--primary-light); padding: 1.15rem; border-radius: var(--radius-sm); border: 1.5px solid var(--primary);">
          <h4 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 0.5rem; font-size: 0.95rem;">VERSI PERBAIKAN ⭐</h4>
          <div style="font-size: 0.86rem; line-height: 1.5;">
            <p style="margin-bottom: 0.35rem;"><strong>Misteri:</strong> ${improvedOutline.mystery || '-'}</p>
            <p style="margin-bottom: 0.35rem;"><strong>Petunjuk:</strong> ${improvedOutline.clues || '-'}</p>
            <p><strong>Ending:</strong> ${improvedOutline.ending || '-'}</p>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 0.85rem; flex-wrap: wrap;">
        <button class="btn btn-primary" id="btn-use-improved-outline" style="flex: 1; min-width: 180px;">
          Gunakan Versi Perbaikan
        </button>
        <button class="btn btn-outline" id="btn-keep-current-outline" style="flex: 1; min-width: 180px;">
          Pertahankan Versi Awal
        </button>
      </div>
    </div>
  `;
}

/**
 * STORY RESULT VIEW — Unified & Clean
 */
export function renderStoryResultView(storyItem) {
  const wordCnt = countWords(storyItem.story);

  return `
    <div class="story-output-container">
      
      <!-- CARD 1: CERITA FINAL & ACTIONS -->
      <div class="card">
        <div class="card-header">
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary); font-weight: 700;">Naskah Cerita</h3>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">±${wordCnt} kata</span>
        </div>

        <!-- Typography Toolbar -->
        <div class="story-toolbar">
          <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-muted);">Format:</span>
          
          <select id="title-font-select" class="form-select" style="width: auto; padding: 0.25rem 0.5rem; font-size: 0.82rem;">
            <option value="serif">Serif (Klasik)</option>
            <option value="sans">Sans-Serif (Modern)</option>
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

        <!-- Story Display Box -->
        <div class="story-box" id="story-display-box">
          <div class="story-title-display title-serif title-bold title-normal" id="story-title-render">${storyItem.title}</div>
          <div id="story-body-render">${storyItem.story}</div>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap;">
          <button class="btn btn-primary" id="btn-copy-story" style="flex: 2; min-width: 160px;">
            📋 Salin Naskah Cerita
          </button>
          <button class="btn btn-secondary" id="btn-critique-story" style="flex: 1.5; min-width: 160px;">
            💬 Kritik dengan Editor AI
          </button>
          <button class="btn btn-outline" id="btn-export-story-md" style="flex: 1; min-width: 120px;">
            📥 Export MD
          </button>
        </div>
      </div>

      <!-- CARD 2: COVER IMAGE GENERATOR (Integrated Prompt & Image) -->
      <div class="card">
        <div class="card-header">
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary); font-weight: 700;">Cover Gambar Cerita</h3>
        </div>
        
        <div style="text-align: center; background: var(--surface-muted); border: 1.5px dashed var(--border); border-radius: var(--radius-sm); padding: 1.5rem; margin-bottom: 1.25rem;">
          ${storyItem.imageData ? `
            <img src="${storyItem.imageData}" alt="Cover Cerita" style="max-width: 100%; height: auto; border-radius: var(--radius-sm); box-shadow: var(--shadow-md); margin: 0 auto;" />
          ` : `
            <div style="color: var(--text-muted); font-size: 0.88rem;">
              Belum ada cover visual. Buat gambar ilustrasi dengan prompt di bawah.
            </div>
          `}
        </div>

        <div class="form-group">
          <label class="form-label">Prompt Visual AI</label>
          <textarea id="image-prompt-textarea" class="form-textarea" style="font-family: monospace; font-size: 0.85rem; min-height: 80px;">${storyItem.imagePrompt || ''}</textarea>
        </div>

        <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-generate-image-now">
            🖼️ ${storyItem.imageData ? 'Generate Ulang Cover' : 'Generate Cover Gambar'}
          </button>
          <button class="btn btn-outline btn-sm" id="btn-copy-image-prompt">
            📋 Salin Prompt
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
          <h2 class="page-title" style="font-size: 1.4rem;">Writing Brain Dashboard</h2>
          <p class="page-subtitle">
            Lapisan pengetahuan kepenulisan lokal yang terus berevolusi melalui sistem persetujuan (approval).
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-wb-add-entry">
            ➕ Tambah Aturan
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-wb-health-check">
            🏥 Health Check
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        <div class="stat-card">
          <div class="stat-num">${activeEntries.length}</div>
          <div class="stat-label">Total Knowledge</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${userRulesCount}</div>
          <div class="stat-label">Aturan Pengguna</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${researchRulesCount}</div>
          <div class="stat-label">Hasil Riset</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${brainstormRulesCount}</div>
          <div class="stat-label">Hasil Diskusi</div>
        </div>
      </div>

      ${healthReport ? `
        <div class="card" style="background: var(--primary-light); border: 1.5px solid var(--primary); margin-bottom: 1.5rem;">
          <h4 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 0.5rem;">🏥 BRAIN HEALTH REPORT</h4>
          <p style="font-size: 0.88rem;"><strong>Score:</strong> ${healthReport.healthScore}/100 | <strong>Duplikat:</strong> ${healthReport.duplicatesCount} | <strong>Entri Kosong:</strong> ${healthReport.emptyEntriesCount}</p>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.25rem;">Health Check hanya berupa laporan dan tidak pernah mengubah data secara otomatis.</p>
        </div>
      ` : ''}

      <!-- Filters & Search -->
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
        <input type="text" id="wb-search-input" class="form-control" placeholder="🔍 Cari pengetahuan..." value="${searchQuery}" style="flex: 2; min-width: 180px;" />
        
        <select id="wb-category-filter" class="form-select" style="flex: 1; min-width: 160px;">
          <option value="all">Semua Kategori (${BRAIN_CATEGORIES.length})</option>
          ${BRAIN_CATEGORIES.map(cat => `<option value="${cat}" ${filterCategory === cat ? 'selected' : ''}>${cat}</option>`).join('')}
        </select>
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
              <span style="font-size: 0.72rem; color: var(--text-muted); background: var(--secondary-light); padding: 0.15rem 0.45rem; border-radius: 4px; flex-shrink: 0;">v${e.version || 1} • ${e.source}</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.5rem;">${e.content}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-size: 0.76rem; color: var(--text-muted);">
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
 * AI RESEARCH VIEW
 */
export function renderResearchView({ sessions = [], activeSession = null, mode = 'quick' }) {
  return `
    <div class="card">
      <div class="page-header" style="margin-bottom: 1.25rem;">
        <h2 class="page-title" style="font-size: 1.4rem;">AI Research Lab</h2>
        <p class="page-subtitle">
          Riset teknik penulisan, analisis dinamika misteri, dan sintesis aturan baru untuk Writing Brain Anda.
        </p>
      </div>

      <form id="research-form">
        <div class="form-group">
          <label class="form-label">Topik atau Pertanyaan Riset</label>
          <textarea id="research-question-input" class="form-textarea" placeholder="Contoh: Riset teknik menyusun petunjuk terselubung (clues) tanpa disadari pembaca di awal cerpen..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Pilih Mode Riset</label>
          <div class="mode-segmented-control" id="research-mode-segmented">
            <button type="button" class="mode-segment-btn ${mode === 'quick' ? 'active' : ''}" data-mode="quick">
              <span class="mode-icon" style="width: auto; height: auto; background: none; font-size: 1.1rem; margin: 0;">⚡</span>
              <div class="mode-info">
                <span class="mode-title">Quick Research</span>
                <span class="mode-time">~10 detik</span>
              </div>
            </button>
            <button type="button" class="mode-segment-btn ${mode === 'deep' ? 'active' : ''}" data-mode="deep">
              <span class="mode-icon" style="width: auto; height: auto; background: none; font-size: 1.1rem; margin: 0;">🔬</span>
              <div class="mode-info">
                <span class="mode-title">Deep Research</span>
                <span class="mode-time">~30 detik</span>
              </div>
            </button>
          </div>
          <input type="hidden" id="research-mode-hidden-input" value="${mode}" />
          <div class="mode-description-box" id="research-mode-desc-text">
            ${mode === 'deep' 
              ? '🔬 <strong>Deep Research (~30s):</strong> Analisis multi-perspektif mendalam dan perumusan usulan aturan terstruktur.'
              : '⚡ <strong>Quick Research (~10s):</strong> Sintesis cepat untuk menemukan teknik praktis dan usulan aturan ringkas.'}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Teks Sumber / Catatan Manual (Opsional)</label>
          <textarea id="research-manual-text" class="form-textarea" style="min-height: 80px; font-size: 0.85rem;" placeholder="Tempelkan kutipan artikel atau buku jika ingin AI menganalisis bahan referensi khusus..."></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-block">
          🔍 Mulai Riset Penulisan
        </button>
      </form>
    </div>

    <!-- Active Research Report -->
    ${activeSession ? `
      <div class="card">
        <div class="card-header">
          <div>
            <span class="wizard-badge">${activeSession.mode === 'deep' ? 'DEEP RESEARCH' : 'QUICK RESEARCH'}</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--primary); margin-top: 0.35rem;">"${activeSession.question}"</h3>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${new Date(activeSession.createdAt).toLocaleTimeString('id-ID')}</span>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-family: var(--font-heading); color: var(--primary); font-size: 1rem; margin-bottom: 0.5rem;">💡 TEMUAN UTAMA & TEKNIK</h4>
          <ul style="padding-left: 1.25rem; font-size: 0.9rem; line-height: 1.6;">
            ${(activeSession.keyFindings || []).map(f => `<li>${f}</li>`).join('')}
            ${(activeSession.importantTechniques || []).map(t => `<li><strong>Teknik:</strong> ${t}</li>`).join('')}
          </ul>
        </div>

        ${(activeSession.recommendations || []).length > 0 ? `
          <div style="background: var(--surface-muted); padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; font-size: 0.88rem; border: 1px solid var(--border-light);">
            <strong>📌 Rekomendasi Penerapan:</strong>
            <ul style="padding-left: 1.25rem; margin-top: 0.35rem;">
              ${activeSession.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Proposed Knowledge Cards -->
        <h4 style="font-family: var(--font-heading); color: var(--primary); font-size: 1.05rem; margin-bottom: 0.75rem;">
          📝 Usulan Aturan untuk Writing Brain (${(activeSession.proposedKnowledge || []).length})
        </h4>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${(activeSession.proposedKnowledge || []).map(p => renderProposalCard(p)).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Past Sessions List -->
    ${sessions.length > 0 ? `
      <div class="card">
        <h3 class="section-title">Riwayat Sesi Riset</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${sessions.slice(0, 8).map(s => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--surface-muted); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border); gap: 0.5rem;">
              <span style="font-size: 0.88rem; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">"${s.question}"</span>
              <button class="btn btn-outline btn-sm btn-open-research" data-id="${s.id}" style="flex-shrink: 0;">Buka Laporan</button>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
}

/**
 * BRAINSTORMING & EDITOR PARTNER VIEW
 */
export function renderBrainstormView({ conversation = null, mode = 'discuss' }) {
  const messages = conversation ? conversation.messages : [];
  const proposals = conversation ? conversation.proposals : [];

  return `
    <div class="card" style="display: flex; flex-direction: column; min-height: 520px;">
      <div class="card-header">
        <div>
          <h2 class="page-title" style="font-size: 1.3rem; margin-bottom: 0.2rem;">Editor Partner & Diskusi</h2>
          <p class="page-subtitle" style="font-size: 0.82rem;">Diskusikan alur, evaluasi karakter, atau diskusikan kelemahan cerita.</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-new-brainstorm">➕ Diskusi Baru</button>
      </div>

      <!-- Chat Messages Window -->
      <div class="chat-window" id="brainstorm-chat-window">
        ${messages.length === 0 ? `
          <div style="text-align: center; color: var(--text-muted); margin: auto; padding: 2rem;">
            <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">💬</div>
            <p style="font-size: 0.9rem;">Mulai berdiskusi dengan Editor AI mengenai karakter, plot twist, atau evaluasi naskah Anda.</p>
          </div>
        ` : messages.map(msg => `
          <div class="chat-bubble ${msg.sender === 'user' ? 'chat-user' : 'chat-ai'}">
            <div style="font-size: 0.72rem; opacity: 0.8; margin-bottom: 0.25rem; font-weight: 700;">${msg.sender === 'user' ? 'ANDA' : 'EDITOR AI'}</div>
            <div style="font-size: 0.92rem; line-height: 1.5; white-space: pre-wrap;">${msg.text}</div>
            
            ${msg.critiqueBreakdown && msg.critiqueBreakdown.problems ? `
              <div style="margin-top: 0.75rem; background: rgba(0,0,0,0.04); padding: 0.65rem 0.85rem; border-radius: 6px; font-size: 0.85rem;">
                <strong>🔍 Catatan:</strong> ${msg.critiqueBreakdown.problems}<br/>
                <strong>💡 Saran:</strong> ${msg.critiqueBreakdown.suggestedImprovement}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Proposals generated in this session -->
      ${proposals.length > 0 ? `
        <div style="margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 1rem;">
          <h4 style="font-family: var(--font-heading); color: var(--primary); font-size: 0.95rem; margin-bottom: 0.5rem;">📝 Usulan Aturan dari Diskusi:</h4>
          ${proposals.map(p => renderProposalCard(p)).join('')}
        </div>
      ` : ''}

      <!-- Message Input Form -->
      <form id="brainstorm-form" style="margin-top: 1rem;">
        <div class="form-group" style="margin-bottom: 0.5rem;">
          <textarea id="brainstorm-input-text" class="form-textarea" style="min-height: 70px;" placeholder="Ketik ide, pertanyaan, atau keluhan tulisan Anda... (Enter kirim, Shift+Enter baris baru)"></textarea>
        </div>

        <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; gap: 0.5rem;">
            <button type="submit" class="btn btn-primary btn-sm" id="btn-send-discuss">
              💬 Diskusi
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-send-critique">
              🔍 Minta Kritik
            </button>
          </div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">Enter ↵ kirim • Shift+Enter baris baru</div>
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
        <h2 class="page-title" style="font-size: 1.4rem;">Backup & Restore Aplikasi</h2>
        <p class="page-subtitle">
          Simpan seluruh kondisi aplikasi (Writing Brain, Riset, Diskusi, Cerita, Pengaturan) ke dalam satu file ZIP terstruktur.
        </p>
      </div>

      <!-- SECTION 1: EXPORT -->
      <div style="background: var(--surface-muted); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 1.5rem;">
        <h3 class="section-title" style="font-size: 1.05rem; margin-bottom: 0.5rem;">📦 Export Full Backup ZIP</h3>
        
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
          📦 Download File Backup ZIP
        </button>
      </div>

      <!-- SECTION 2: IMPORT / RESTORE -->
      <div style="background: var(--surface-muted); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 1.5rem;">
        <h3 class="section-title" style="font-size: 1.05rem; margin-bottom: 0.5rem;">📥 Import & Pulihkan Data</h3>
        
        <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 1rem;">
          Pilih file backup ZIP (ceritametro-backup-*.zip) dari perangkat lain untuk memulihkan kondisi aplikasi.
        </p>

        <label class="btn btn-secondary btn-block" style="cursor: pointer; text-align: center;">
          📁 Pilih File Backup ZIP
          <input type="file" id="input-import-backup-zip" accept=".zip" style="display: none;" />
        </label>
      </div>

      <!-- RESTORE PREVIEW MODAL -->
      ${restorePreview ? `
        <div class="card" style="background: var(--primary-light); border: 2px solid var(--primary); margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-heading); color: var(--primary); font-size: 1.15rem; margin-bottom: 0.5rem;">📋 Pratinjau Isi Backup</h3>
          
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
              🔀 Gabungkan Data (Merge)
            </button>
            <button class="btn btn-danger" id="btn-restore-replace" style="flex: 1; min-width: 150px;">
              ⚠️ Timpa Semua (Replace)
            </button>
            <button class="btn btn-outline" id="btn-restore-cancel">Batal</button>
          </div>
        </div>
      ` : ''}

      <!-- BACKUP HISTORY METADATA -->
      ${historyMeta.length > 0 ? `
        <div>
          <h4 class="section-title" style="font-size: 0.95rem; margin-bottom: 0.5rem;">Riwayat Pembuatan Backup</h4>
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            ${historyMeta.map(h => `
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; background: var(--surface-muted); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
                <span>📦 <strong>${h.fileName}</strong></span>
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
export function renderSettingsView(settings, scannedTextModels = [], scannedImageModels = []) {
  return `
    <div class="card">
      <div class="page-header" style="margin-bottom: 1.25rem;">
        <h2 class="page-title" style="font-size: 1.4rem;">Pengaturan API Provider</h2>
        <p class="page-subtitle">
          Konfigurasikan endpoint dan API Key provider AI yang Anda gunakan.
        </p>
      </div>

      <div style="font-size: 0.84rem; color: var(--danger); background: var(--danger-bg); padding: 0.65rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--danger-border); margin-bottom: 1.5rem;">
        🔒 API Key disimpan secara lokal di browser Anda (localStorage) dan tidak pernah dikirim ke server lain.
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
                🔍 Pindai
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

        <hr style="border: 0; border-top: 1px solid var(--border); margin: 1.5rem 0;" />

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
                🔍 Pindai
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

        <hr style="border: 0; border-top: 1px solid var(--border); margin: 1.5rem 0;" />

        <h3 class="section-title" style="font-size: 1.05rem; margin-bottom: 0.5rem;">3. Keamanan & Kunci Aplikasi</h3>
        <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 1rem;">
          Password master dikonfigurasi melalui GitHub Secret (<code>APP_PASSWORD</code>) atau password lokal. Anda dapat mengunci aplikasi kapan saja.
        </p>

        <div style="display: flex; gap: 0.65rem; flex-wrap: wrap; margin-bottom: 1rem;">
          <button type="button" class="btn btn-secondary btn-sm" id="btn-lock-app-now">
            🔒 Kunci Aplikasi Sekarang
          </button>
          <button type="button" class="btn btn-outline btn-sm" id="btn-set-local-password">
            🔑 Atur / Ubah Password Lokal
          </button>
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1.25rem;">
          💾 Simpan Pengaturan
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
        <div style="text-align: center; margin-bottom: 1.25rem;">
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
              <button type="button" id="btn-toggle-password-visibility" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; color: var(--text-muted); padding: 4px;" aria-label="Lihat Password">
                👁️
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; font-size: 0.82rem; color: var(--text-muted);">
            <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="checkbox" id="lock-remember-me" checked /> Ingat di perangkat ini
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="padding: 0.65rem 1rem;">
            🔓 Buka Aplikasi
          </button>
        </form>

        <div style="margin-top: 1.25rem; padding-top: 0.85rem; border-top: 1px solid var(--border-light); font-size: 0.74rem; color: var(--text-subtle); text-align: center; line-height: 1.4;">
          🔒 Dilindungi enkripsi SHA-256 & GitHub Secret (<code>APP_PASSWORD</code>)
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
        <h2 class="page-title" style="font-size: 1.4rem;">Riwayat Cerita</h2>
        <p class="page-subtitle">Daftar naskah cerpen yang telah Anda buat sebelumnya.</p>
      </div>
    </div>

    ${stories.length === 0 ? `
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📜</div>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Belum ada riwayat cerita yang disimpan.</p>
        <button class="btn btn-primary btn-sm" data-route="home" style="margin-top: 1rem;">Mulai Buat Cerita Baru</button>
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
                <span style="font-size: 0.78rem; color: var(--text-muted);">${dateStr}</span>
              </div>
              <p style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 0.85rem;">
                Mode: ${s.mode || 'Otomatis'} • ±${wordCnt} kata
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-primary btn-sm btn-open-history" data-id="${s.id}">Buka Naskah</button>
                <button class="btn btn-outline btn-sm btn-copy-history" data-id="${s.id}">Salin Teks</button>
                <button class="btn btn-danger btn-sm btn-delete-history" data-id="${s.id}">Hapus</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
}
