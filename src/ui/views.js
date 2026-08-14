/**
 * Main Application View Templates — V3 Architecture
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
 * HOME VIEW
 */
export function renderHomeView() {
  return `
    <div style="text-align: center; margin-bottom: 2.5rem; margin-top: 1rem;">
      <h1 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">
        CERITA METRO
      </h1>
      <p style="font-size: 1.05rem; color: var(--primary); font-weight: 500;">
        Realistic Metro-Pop Mystery Generator & Evolving Writing Lab
      </p>
      <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 580px; margin: 0.75rem auto 0 auto;">
        Buat cerpen misteri urban Indonesia yang logis, beremosi natural, dan diperkuat oleh Writing Brain lokal yang terus berkembang dari riset & diskusi.
      </p>
    </div>

    <div class="mode-grid">
      <div class="mode-card" data-action="start-mode-1">
        <div class="mode-icon">✍️</div>
        <div class="mode-card-title">IDE SENDIRI</div>
        <div class="mode-card-desc">Tulis ide atau skenario di kepala Anda. Pilih antara 5 Alur Otomatis atau 8-Stage Story Wizard.</div>
      </div>

      <div class="mode-card" data-action="start-mode-2">
        <div class="mode-icon">⚡</div>
        <div class="mode-card-title">OTOMATIS</div>
        <div class="mode-card-desc">Biarkan AI langsung membuatkan 5 pilihan alur cerita misteri realistis berdasarkan Writing Brain.</div>
      </div>

      <div class="mode-card" data-action="start-mode-3">
        <div class="mode-icon">🧙‍♂️</div>
        <div class="mode-card-title">WIZARD STORY</div>
        <div class="mode-card-desc">Bangun alur cerita langkah demi langkah dari premis, tokoh, misteri, hingga ending secara interaktif.</div>
      </div>
    </div>

    <div style="margin-top: 2.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem;">
      <button class="btn btn-outline" data-route="brain">
        🧠 Writing Brain
      </button>
      <button class="btn btn-outline" data-route="research">
        🔍 AI Research
      </button>
      <button class="btn btn-outline" data-route="brainstorm">
        💬 Brainstorm
      </button>
      <button class="btn btn-outline" data-route="history">
        📜 Riwayat
      </button>
      <button class="btn btn-outline" data-route="backup">
        📦 Backup ZIP
      </button>
      <button class="btn btn-outline" data-route="settings">
        ⚙️ Settings
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
      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 1rem;">Mode 1: Ide Sendiri</h2>
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        Masukkan ide, kejadian, atau karakter yang ingin Anda angkat ke dalam cerita.
      </p>

      <div class="form-group">
        <label class="form-label">Gagasan / Ide Cerita</label>
        <textarea id="mode1-user-idea" class="form-textarea" placeholder="Contoh: Seorang eksekutor wasiat menemukan surat rahasia milik pengusaha..."></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Tema Utama (Opsional)</label>
        <select id="mode1-theme" class="form-select">
          ${THEME_OPTIONS.map(t => `<option value="${t}">${t}</option>`).join('')}
        </select>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem;">
        <button class="btn btn-primary" id="btn-mode1-5options" style="flex:1;">
          ⚡ 5 Pilihan Alur Otomatis
        </button>
        <button class="btn btn-secondary" id="btn-mode1-wizard" style="flex:1;">
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
    <div style="margin-bottom: 1.5rem;">
      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 0.35rem;">Pilih 1 dari 5 Alur Cerita</h2>
      <p style="font-size: 0.9rem; color: var(--text-muted);">
        AI telah menyusun 5 variasi alur misteri realistis berdasarkan Writing Brain Anda.
      </p>
    </div>

    <div style="display: flex; flex-direction: column; gap: 1.25rem;">
      ${options.map((opt, idx) => `
        <div class="card card-hover" style="margin-bottom:0;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary);">${idx + 1}. ${opt.title}</h3>
            <div>
              ${(opt.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
          </div>
          <p style="font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem; line-height:1.5;">${opt.synopsis}</p>
          <div style="background: var(--accent-light); padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            <strong>Petunjuk:</strong> ${opt.clues || '-'} | <strong>Ending:</strong> ${opt.ending || '-'}
          </div>
          <button class="btn btn-primary btn-sm btn-select-outline" data-index="${idx}">
            [ Gunakan Alur Ini & Generate Cerita ]
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
      <div>
        <span class="wizard-badge">Tahap ${stageIndex + 1} dari ${totalStages}</span>
        <strong style="margin-left: 0.75rem; font-family: var(--font-heading);">${stageInfo.title}</strong>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-muted);">${stageInfo.desc}</div>
    </div>

    <div class="wizard-choices">
      ${choices.map((c, idx) => {
        const isAiPick = idx === 4 || c.label.includes('AI Pilihkan');
        return `
          <div class="wizard-choice-item ${isAiPick ? 'wizard-choice-ai' : ''}" data-choice-index="${idx}">
            <div style="font-weight: 700; font-size: 0.95rem; color: ${isAiPick ? 'var(--primary)' : 'var(--text-main)'}; margin-bottom: 0.25rem;">
              ${c.label} ${isAiPick ? '⭐' : ''}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${c.detail}</div>
          </div>
        `;
      }).join('')}
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
      <button class="btn btn-outline" id="btn-wizard-prev" ${stageIndex === 0 ? 'disabled style="opacity:0.5;"' : ''}>
        ← Kembali
      </button>
      <span style="font-size:0.85rem; color:var(--text-muted); align-self:center;">Pilih salah satu opsi untuk lanjut</span>
    </div>
  `;
}

/**
 * WIZARD REVIEW VIEW
 */
export function renderWizardReviewView({ wizardData, whyItWorks }) {
  return `
    <div class="card">
      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary); margin-bottom: 1rem;">REVIEW ALUR CERITA</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem; margin-bottom: 1.25rem;">
        <div><strong>Judul:</strong> ${wizardData.title || wizardData.premise || 'Tanpa Judul'}</div>
        <div><strong>Premis:</strong> ${wizardData.premise || '-'}</div>
        <div><strong>Tokoh:</strong> ${wizardData.character || '-'}</div>
        <div><strong>Lokasi:</strong> ${wizardData.location || '-'}</div>
        <div><strong>Misteri:</strong> ${wizardData.mystery || '-'}</div>
        <div><strong>Konflik:</strong> ${wizardData.conflict || '-'}</div>
        <div><strong>Petunjuk:</strong> ${wizardData.clues || '-'}</div>
        <div><strong>Pengungkapan:</strong> ${wizardData.reveal || '-'}</div>
        <div><strong>Ending:</strong> ${wizardData.ending || '-'}</div>
      </div>

      <div style="background: var(--accent-light); border-left: 4px solid var(--primary); padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem;">
        <div style="font-weight: 700; font-size: 0.85rem; color: var(--primary); margin-bottom: 0.25rem;">KENAPA ALUR INI BEKERJA?</div>
        <div style="font-size: 0.9rem; color: var(--text-main);">${whyItWorks}</div>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button class="btn btn-primary" id="btn-generate-wizard-final" style="flex: 2;">
          [ GENERATE CERITA FINAL ]
        </button>
        <button class="btn btn-secondary" id="btn-improve-wizard-outline" style="flex: 1;">
          [ PERBAIKI ALUR ]
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
      <h2 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 0.75rem;">Perbandingan Alur Cerita</h2>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        <strong>Alasan Perbaikan:</strong> ${improvementReason}
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem;">
        <div style="background: #FAFAFC; padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
          <h4 style="font-family: var(--font-heading); color: var(--text-muted); margin-bottom: 0.5rem;">VERSI SAAT INI</h4>
          <div style="font-size: 0.85rem; line-height: 1.5;">
            <p><strong>Misteri:</strong> ${currentOutline.mystery || '-'}</p>
            <p><strong>Petunjuk:</strong> ${currentOutline.clues || '-'}</p>
            <p><strong>Ending:</strong> ${currentOutline.ending || '-'}</p>
          </div>
        </div>

        <div style="background: var(--accent-light); padding: 1rem; border-radius: 8px; border: 1px solid var(--primary);">
          <h4 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 0.5rem;">VERSI PERBAIKAN ⭐</h4>
          <div style="font-size: 0.85rem; line-height: 1.5;">
            <p><strong>Misteri:</strong> ${improvedOutline.mystery || '-'}</p>
            <p><strong>Petunjuk:</strong> ${improvedOutline.clues || '-'}</p>
            <p><strong>Ending:</strong> ${improvedOutline.ending || '-'}</p>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 1rem;">
        <button class="btn btn-primary" id="btn-use-improved-outline" style="flex: 1;">
          [ Gunakan Versi Perbaikan ]
        </button>
        <button class="btn btn-outline" id="btn-keep-current-outline" style="flex: 1;">
          [ Pertahankan Versi Saat Ini ]
        </button>
      </div>
    </div>
  `;
}

/**
 * STORY RESULT VIEW
 */
export function renderStoryResultView(storyItem) {
  const wordCnt = countWords(storyItem.story);

  return `
    <div class="story-output-container">
      
      <!-- CARD 1: CERITA FACEBOOK & STORY CRITIQUE FEEDBACK LOOP -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary);">CERITA FINAL</h3>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">±${wordCnt} kata</span>
        </div>

        <!-- Format Title Controls -->
        <div style="background: var(--accent-light); padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1.25rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <span style="font-size: 0.85rem; font-weight: 600; color: var(--primary);">Tampilan Judul:</span>
          
          <select id="title-font-select" class="form-select" style="width: auto; padding: 0.3rem 0.6rem; font-size: 0.85rem;">
            <option value="serif">Serif (Klasik Sastra)</option>
            <option value="sans">Sans-Serif (Modern)</option>
          </select>

          <select id="title-weight-select" class="form-select" style="width: auto; padding: 0.3rem 0.6rem; font-size: 0.85rem;">
            <option value="bold">Tebal (Bold)</option>
            <option value="normal">Normal</option>
          </select>

          <select id="title-style-select" class="form-select" style="width: auto; padding: 0.3rem 0.6rem; font-size: 0.85rem;">
            <option value="normal">Normal</option>
            <option value="italic">Miring (Italic)</option>
          </select>
        </div>

        <!-- Story Display Box -->
        <div class="story-box" id="story-display-box">
          <div class="story-title-display title-serif title-bold title-normal" id="story-title-render">${storyItem.title}</div>
          <div id="story-body-render">${storyItem.story}</div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem; flex-wrap: wrap;">
          <button class="btn btn-primary" id="btn-copy-story" style="flex: 2;">
            📋 [ COPY CERITA ]
          </button>
          <button class="btn btn-secondary" id="btn-critique-story" style="flex: 1.5;" title="Diskusikan kelemahan cerita ini dengan AI untuk memperbarui Writing Brain">
            💬 [ CRITIQUE THIS STORY ]
          </button>
          <button class="btn btn-outline" id="btn-export-story-md" style="flex: 1;">
            📥 Export MD
          </button>
        </div>
      </div>

      <!-- CARD 2: PROMPT GAMBAR -->
      <div class="card">
        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary); margin-bottom: 0.75rem;">PROMPT GAMBAR AI</h3>
        
        <div class="form-group">
          <textarea id="image-prompt-textarea" class="form-textarea" style="font-family: monospace; font-size: 0.88rem;">${storyItem.imagePrompt || ''}</textarea>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" id="btn-copy-image-prompt">
            📋 [ COPY PROMPT ]
          </button>
          <button class="btn btn-primary btn-sm" id="btn-generate-image-now">
            🖼️ [ EDIT & GENERATE GAMBAR ]
          </button>
        </div>
      </div>

      <!-- CARD 3: GAMBAR COVER -->
      <div class="card">
        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary); margin-bottom: 0.75rem;">GAMBAR COVER</h3>
        
        <div style="text-align: center; background: #FAFAFC; border: 1px dashed var(--border); border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem;">
          ${storyItem.imageData ? `
            <img src="${storyItem.imageData}" alt="Cover Cerita" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: var(--shadow-md);" />
          ` : `
            <div style="color: var(--text-muted); font-size: 0.9rem;">Belum ada gambar yang dihasilkan. Klik tombol di bawah untuk membuat gambar cover AI.</div>
          `}
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-primary" id="btn-regenerate-image">
            🔄 ${storyItem.imageData ? '[ GENERATE ULANG ]' : '[ GENERATE GAMBAR ]'}
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

  // Filter entries
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
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
        <div>
          <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--primary); margin-bottom: 0.25rem;">WRITING BRAIN DASHBOARD</h2>
          <p style="font-size: 0.88rem; color: var(--text-muted);">
            Lapisan pengetahuan kepenulisan lokal yang terus berkembang secara bertahap melalui approval workflow.
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-wb-add-entry">
            ➕ Add Knowledge
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
          <div class="stat-label">Active Knowledge</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${userRulesCount}</div>
          <div class="stat-label">User Rules</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${researchRulesCount}</div>
          <div class="stat-label">Research Rules</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${brainstormRulesCount}</div>
          <div class="stat-label">Brainstorm Rules</div>
        </div>
      </div>

      ${healthReport ? `
        <div class="card" style="background: var(--accent-light); border: 1px solid var(--primary); margin-bottom: 1.5rem;">
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
      <div style="display: flex; flex-direction: column; gap: 0.85rem;">
        ${filtered.length === 0 ? `
          <div style="text-align: center; color: var(--text-muted); padding: 2rem;">Tidak ada knowledge entry yang sesuai filter.</div>
        ` : filtered.map(e => `
          <div class="wb-entry-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
              <div>
                <span class="tag">${e.category}</span>
                <strong style="font-size: 0.95rem; color: var(--text-main);">${e.title}</strong>
              </div>
              <span style="font-size: 0.75rem; color: var(--text-muted); background: #E6DEE8; padding: 0.15rem 0.5rem; border-radius: 4px;">v${e.version || 1} • ${e.source}</span>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.5; margin-bottom: 0.5rem;">${e.content}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-size: 0.78rem; color: var(--text-muted);">
                ${(e.tags || []).map(t => `#${t}`).join(' ')}
              </div>
              <div style="display: flex; gap: 0.4rem;">
                <button class="btn btn-outline btn-sm btn-edit-wb" data-id="${e.id}" style="padding: 0.2rem 0.5rem; font-size: 0.78rem;">Edit</button>
                <button class="btn btn-secondary btn-sm btn-delete-wb" data-id="${e.id}" style="padding: 0.2rem 0.5rem; font-size: 0.78rem; color: #991B1B;">Hapus</button>
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
      <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--primary); margin-bottom: 0.25rem;">AI RESEARCH LAB</h2>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
        Minta AI melakukan riset teknik penulisan & sintetis pengetahuan. Hasil riset akan menghasilkan usulan aturan (proposals) yang membutuhkan approval Anda.
      </p>

      <form id="research-form">
        <div class="form-group">
          <label class="form-label">Topik / Pertanyaan Riset</label>
          <textarea id="research-question-input" class="form-textarea" placeholder="Contoh: Riset teknik membuat dialog bersubteks dalam cerpen misteri urban..."></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Pilih Mode Riset Penulisan</label>
          <div class="mode-segmented-control" id="research-mode-segmented">
            <button type="button" class="mode-segment-btn ${mode === 'quick' ? 'active' : ''}" data-mode="quick">
              <span class="mode-icon">⚡</span>
              <div class="mode-info">
                <span class="mode-title">Quick Research</span>
                <span class="mode-time">~10 detik</span>
              </div>
            </button>
            <button type="button" class="mode-segment-btn ${mode === 'deep' ? 'active' : ''}" data-mode="deep">
              <span class="mode-icon">🔬</span>
              <div class="mode-info">
                <span class="mode-title">Deep Research</span>
                <span class="mode-time">~30 detik</span>
              </div>
            </button>
          </div>
          <input type="hidden" id="research-mode-hidden-input" value="${mode}" />
          <div class="mode-description-box" id="research-mode-desc-text">
            ${mode === 'deep' 
              ? '🔬 <strong>Deep Research (~30s):</strong> Membandingkan sudut pandang, menyusun analisis mendalam, dan merumuskan usulan aturan komprehensif.'
              : '⚡ <strong>Quick Research (~10s):</strong> Ringkas & cepat. Menghasilkan temuan kunci dan usulan aturan praktis secara langsung.'}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Teks Sumber / Catatan Manual (Opsional)</label>
          <textarea id="research-manual-text" class="form-textarea" style="min-height: 80px; font-size: 0.88rem;" placeholder="Masukkan teks artikel, referensi, atau URL jika provider AI Anda tidak memiliki akses web langsung..."></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-block">
          🔍 Mulai Riset Penulisan
        </button>
      </form>
    </div>

    <!-- Active Research Report -->
    ${activeSession ? `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; margin-bottom: 1rem;">
          <div>
            <span class="wizard-badge">${activeSession.mode === 'deep' ? 'DEEP RESEARCH REPORT' : 'QUICK RESEARCH REPORT'}</span>
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
          <div style="background: var(--accent-light); padding: 0.85rem 1rem; border-radius: 8px; margin-bottom: 1.25rem; font-size: 0.88rem;">
            <strong>📌 Rekomendasi Penerapan:</strong>
            <ul style="padding-left: 1.25rem; margin-top: 0.35rem;">
              ${activeSession.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Proposed Knowledge Cards -->
        <h4 style="font-family: var(--font-heading); color: var(--primary); font-size: 1.05rem; margin-bottom: 0.75rem;">
          📝 USULAN RULE UNTUK WRITING BRAIN (${(activeSession.proposedKnowledge || []).length})
        </h4>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${(activeSession.proposedKnowledge || []).map(p => renderProposalCard(p)).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Past Sessions List -->
    ${sessions.length > 0 ? `
      <div class="card">
        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary); margin-bottom: 0.75rem;">RIWAYAT RISET</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${sessions.slice(0, 10).map(s => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: #FAFAFC; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid var(--border);">
              <span style="font-size: 0.88rem; font-weight: 500;">"${s.question.slice(0, 50)}..."</span>
              <button class="btn btn-outline btn-sm btn-open-research" data-id="${s.id}">Buka Report</button>
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
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; margin-bottom: 1rem;">
        <div>
          <h2 style="font-family: var(--font-heading); font-size: 1.3rem; color: var(--primary);">EDITOR PARTNER & BRAINSTORM LAB</h2>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Diskusi interaktif & kritik cerita untuk membentuk Writing Brain.</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-new-brainstorm">➕ Diskusi Baru</button>
      </div>

      <!-- Chat Messages Window -->
      <div class="chat-window" id="brainstorm-chat-window">
        ${messages.length === 0 ? `
          <div style="text-align: center; color: var(--text-muted); margin: auto; padding: 2rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">💬</div>
            <p style="font-size: 0.9rem;">Mulai diskusi dengan Editor AI mengenai alur, dialog, kelemahan cerita, atau aturan penulisan.</p>
          </div>
        ` : messages.map(msg => `
          <div class="chat-bubble ${msg.sender === 'user' ? 'chat-user' : 'chat-ai'}">
            <div style="font-size: 0.75rem; opacity: 0.8; margin-bottom: 0.25rem;">${msg.sender === 'user' ? 'ANDA' : 'EDITOR AI'}</div>
            <div style="font-size: 0.92rem; line-height: 1.5; white-space: pre-wrap;">${msg.text}</div>
            
            ${msg.critiqueBreakdown && msg.critiqueBreakdown.problems ? `
              <div style="margin-top: 0.75rem; background: rgba(0,0,0,0.04); padding: 0.65rem 0.85rem; border-radius: 6px; font-size: 0.85rem;">
                <strong>🔍 Kelemahan:</strong> ${msg.critiqueBreakdown.problems}<br/>
                <strong>💡 Saran:</strong> ${msg.critiqueBreakdown.suggestedImprovement}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Proposals generated in this session -->
      ${proposals.length > 0 ? `
        <div style="margin-top: 1rem; border-t: 1px solid var(--border); padding-top: 1rem;">
          <h4 style="font-family: var(--font-heading); color: var(--primary); font-size: 0.95rem; margin-bottom: 0.5rem;">📝 USULAN RULE DARI DISKUSI:</h4>
          ${proposals.map(p => renderProposalCard(p)).join('')}
        </div>
      ` : ''}

      <!-- Message Input Form -->
      <form id="brainstorm-form" style="margin-top: 1rem;">
        <div class="form-group" style="margin-bottom: 0.5rem;">
          <textarea id="brainstorm-input-text" class="form-textarea" style="min-height: 70px;" placeholder="Ketik ide, pertanyaan, atau keluhan tulisan Anda... (Tekan Enter untuk kirim, Shift+Enter untuk baris baru)"></textarea>
        </div>

        <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; gap: 0.5rem;">
            <button type="submit" class="btn btn-primary btn-sm" id="btn-send-discuss">
              💬 [ Discuss ]
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-send-critique">
              🔍 [ Critique ]
            </button>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Enter ↵ untuk Discuss • Shift+Enter baris baru</div>
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
      <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--primary); margin-bottom: 0.25rem;">BACKUP & RESTORE APLIKASI</h2>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.5rem;">
        Cadangkan seluruh kondisi aplikasi (Writing Brain, Research, Brainstorm, History, Settings, Images) ke dalam satu file ZIP terstruktur yang mudah dipindahkan antar-device.
      </p>

      <!-- SECTION 1: EXPORT -->
      <div style="background: #FAFAFC; padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary); margin-bottom: 0.75rem;">📦 EXPORT FULL BACKUP ZIP</h3>
        
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          Pilih komponen data yang ingin dimasukkan ke dalam backup ZIP:
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.65rem; font-size: 0.88rem; margin-bottom: 1.25rem;">
          <label><input type="checkbox" id="chk-bk-brain" checked /> Writing Brain</label>
          <label><input type="checkbox" id="chk-bk-research" checked /> Research Sessions</label>
          <label><input type="checkbox" id="chk-bk-brainstorm" checked /> Brainstorm Lab</label>
          <label><input type="checkbox" id="chk-bk-stories" checked /> Story History</label>
          <label><input type="checkbox" id="chk-bk-images" checked /> Generated Images</label>
          <label><input type="checkbox" id="chk-bk-ai" checked /> AI Settings</label>
          <label><input type="checkbox" id="chk-bk-keys" /> Include API Keys (Security Warning)</label>
        </div>

        <div style="background: #FDF2F2; color: #991B1B; padding: 0.65rem 0.85rem; border-radius: 8px; font-size: 0.82rem; margin-bottom: 1.25rem; border: 1px solid #F87171;">
          ⚠️ <strong>Catatan Keamanan:</strong> Secara default API Key tidak diikutkan agar file backup aman dibagikan. Jika Anda mencentang "Include API Keys", simpan file ZIP secara rahasia!
        </div>

        <button class="btn btn-primary btn-block" id="btn-export-full-zip">
          📦 [ GENERATE & DOWNLOAD FULL ZIP BACKUP ]
        </button>
      </div>

      <!-- SECTION 2: IMPORT / RESTORE -->
      <div style="background: #FAFAFC; padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border); margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary); margin-bottom: 0.75rem;">📥 IMPORT & RESTORE BACKUP ZIP</h3>
        
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem;">
          Pilih file backup ZIP (ceritametro-backup-YYYY-MM-DD_HH-mm-ss.zip) dari device lain untuk dipulihkan.
        </p>

        <label class="btn btn-secondary btn-block" style="cursor: pointer; text-align: center;">
          📁 Pilih File Backup ZIP
          <input type="file" id="input-import-backup-zip" accept=".zip" style="display: none;" />
        </label>
      </div>

      <!-- RESTORE PREVIEW MODAL -->
      ${restorePreview ? `
        <div class="card" style="background: var(--accent-light); border: 2px solid var(--primary); margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-heading); color: var(--primary); font-size: 1.2rem; margin-bottom: 0.5rem;">📋 PRANJAU ISI BACKUP ZIP</h3>
          
          <div style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1rem;">
            <p><strong>File:</strong> ${restorePreview.manifest.backupFileName || 'backup.zip'}</p>
            <p><strong>Dibuat Pada:</strong> ${restorePreview.manifest.createdAtLocal || '-'}</p>
            <p><strong>Jumlah Cerita:</strong> ${restorePreview.stories.length} cerita</p>
            <p><strong>Writing Brain Entries:</strong> ${restorePreview.writingBrainEntries.length} entri</p>
            <p><strong>Research Sessions:</strong> ${restorePreview.researchSessions.length} sesi</p>
            <p><strong>Brainstorm Conversations:</strong> ${restorePreview.brainstormConversations.length} diskusi</p>
            <p><strong>API Keys:</strong> ${restorePreview.manifest.includesApiKeys ? 'Tersedia di Backup' : 'Tidak Ada di Backup'}</p>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-primary" id="btn-restore-merge" style="flex: 1;">
              🔀 [ MERGE (Gabungkan Data) ]
            </button>
            <button class="btn btn-secondary" id="btn-restore-replace" style="flex: 1; color: #991B1B;" title="Menggantikan seluruh data lokal saat ini">
              ⚠️ [ REPLACE ALL (Timpa Semua) ]
            </button>
            <button class="btn btn-outline" id="btn-restore-cancel">Batal</button>
          </div>
        </div>
      ` : ''}

      <!-- BACKUP HISTORY METADATA -->
      ${historyMeta.length > 0 ? `
        <div>
          <h4 style="font-family: var(--font-heading); font-size: 1rem; color: var(--primary); margin-bottom: 0.5rem;">LOG PEMBUATAN BACKUP TERAKHIR</h4>
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            ${historyMeta.map(h => `
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; background: #FAFAFC; padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid var(--border);">
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
      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary); margin-bottom: 0.5rem;">PENGATURAN API</h2>
      <p style="font-size: 0.85rem; color: #991B1B; background: #FDF2F2; padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #F87171; margin-bottom: 1.5rem;">
        ⚠️ API Key disimpan lokal di browser (localStorage). Gunakan hanya untuk aplikasi pribadi.
      </p>

      <form id="settings-form">
        <h4 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 0.75rem;">1. AI Text Provider</h4>

        <div class="form-group">
          <label class="form-label">Text Endpoint URL</label>
          <input type="text" id="setting-endpoint" class="form-control" value="${settings.endpoint}" placeholder="https://api.openai.com/v1/chat/completions" />
        </div>

        <div class="form-group">
          <label class="form-label">Text API Key</label>
          <input type="password" id="setting-apiKey" class="form-control" value="${settings.apiKey}" placeholder="sk-..." />
        </div>

        <div class="form-group">
          <label class="form-label">Text Model</label>
          <div class="model-selector">
            <div class="model-input-row">
              <input type="text" id="setting-model" class="form-control" value="${settings.model}" 
                placeholder="Pilih atau ketik nama model" 
                autocomplete="off" />
              <button type="button" class="btn btn-secondary btn-sm" id="btn-scan-text-models" title="Pindai model yang tersedia dari API">
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

        <hr style="border:0; border-top: 1px solid var(--border); margin: 1.5rem 0;" />

        <h4 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 0.75rem;">2. AI Image Provider</h4>

        <div class="form-group">
          <label class="form-label">Image Endpoint URL</label>
          <input type="text" id="setting-imageEndpoint" class="form-control" value="${settings.imageEndpoint}" placeholder="https://api.openai.com/v1/images/generations" />
        </div>

        <div class="form-group">
          <label class="form-label">Image API Key <span style="font-weight:400; color: var(--text-muted);">(Kosongkan jika sama dengan Text)</span></label>
          <input type="password" id="setting-imageApiKey" class="form-control" value="${settings.imageApiKey}" placeholder="sk-..." />
        </div>

        <div class="form-group">
          <label class="form-label">Image Model</label>
          <div class="model-selector">
            <div class="model-input-row">
              <input type="text" id="setting-imageModel" class="form-control" value="${settings.imageModel}" 
                placeholder="Pilih atau ketik nama model gambar" 
                autocomplete="off" />
              <button type="button" class="btn btn-secondary btn-sm" id="btn-scan-image-models" title="Pindai model gambar yang tersedia dari API">
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

        <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1.5rem;">
          💾 Simpan Pengaturan
        </button>
      </form>
    </div>
  `;
}

/**
 * HISTORY VIEW
 */
export function renderHistoryView(stories = []) {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary);">RIWAYAT CERITA</h2>
      <button class="btn btn-secondary btn-sm" data-route="backup">📦 Kelola Backup ZIP</button>
    </div>

    ${stories.length === 0 ? `
      <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📜</div>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Belum ada riwayat cerita yang disimpan.</p>
        <button class="btn btn-primary" data-route="home" style="margin-top: 1rem;">Mulai Buat Cerita Baru</button>
      </div>
    ` : `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${stories.map(s => {
          const dateStr = new Date(s.createdAt || Date.now()).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
          const wordCnt = countWords(s.story);
          return `
            <div class="card card-hover" style="margin-bottom:0;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--primary);">${s.title}</h3>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${dateStr}</span>
              </div>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                Mode: ${s.mode || 'Otomatis'} | ±${wordCnt} kata
              </p>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary btn-sm btn-open-history" data-id="${s.id}">Buka Cerita</button>
                <button class="btn btn-outline btn-sm btn-copy-history" data-id="${s.id}">Copy Plain Text</button>
                <button class="btn btn-secondary btn-sm btn-delete-history" data-id="${s.id}" style="color:#991B1B;">Hapus</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;
}
