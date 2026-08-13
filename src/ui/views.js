/**
 * Main Application View Templates
 */

import writingBrainData from '../data/writing-brain.json';
import { countWords } from '../utils/text.js';

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
        Realistic Metro-Pop Mystery Generator
      </p>
      <p style="font-size: 0.9rem; color: var(--text-muted); max-width: 580px; margin: 0.75rem auto 0 auto;">
        Buat cerpen misteri urban Indonesia yang logis, beremosi natural, dan nyaman dibaca di smartphone. Siap langsung copy-paste ke Facebook.
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
        <div class="mode-card-desc">Biarkan AI langsung membuatkan 5 pilihan alur cerita misteri realistis. Pilih 1 dan cerita langsung jadi!</div>
      </div>

      <div class="mode-card" data-action="start-mode-3">
        <div class="mode-icon">🧙‍♂️</div>
        <div class="mode-card-title">WIZARD STORY</div>
        <div class="mode-card-desc">Bangun alur cerita langkah demi langkah dari premis, tokoh, misteri, hingga ending secara interaktif.</div>
      </div>
    </div>

    <div style="margin-top: 2.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
      <button class="btn btn-outline" data-route="brain">
        🧠 Writing Brain
      </button>
      <button class="btn btn-outline" data-route="history">
        📜 Riwayat Cerita
      </button>
      <button class="btn btn-outline" data-route="settings">
        ⚙️ Pengaturan API & Supabase
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
        <textarea id="mode1-user-idea" class="form-textarea" placeholder="Contoh: Seorang sopir taksi online menemukan koper penumpang tua yang tertinggal. Tak lama kemudian beberapa orang mengejar mobilnya..."></textarea>
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
 * OUTLINE CHOICES VIEW (Mode 1A & Mode 2)
 */
export function renderOutlineChoicesView(options = []) {
  return `
    <div style="margin-bottom: 1.5rem;">
      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 0.35rem;">Pilih 1 dari 5 Alur Cerita</h2>
      <p style="font-size: 0.9rem; color: var(--text-muted);">
        AI telah menyusun 5 variasi alur misteri realistis. Pilih alur yang paling menarik bagi Anda.
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
 * IMPROVE OUTLINE MODAL/VIEW
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
      
      <!-- CARD 1: CERITA FACEBOOK -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--primary);">CERITA FACEBOOK</h3>
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

        <div style="display: flex; gap: 1rem; margin-top: 1.25rem; flex-wrap: wrap;">
          <button class="btn btn-primary" id="btn-copy-story" style="flex: 2;">
            📋 [ COPY CERITA ]
          </button>
          <button class="btn btn-outline" id="btn-export-story-md" style="flex: 1;">
            📥 Export Markdown
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
 * SETTINGS VIEW
 */
export function renderSettingsView(settings, scannedTextModels = [], scannedImageModels = []) {
  const textModelOptions = scannedTextModels.length > 0
    ? scannedTextModels
    : [settings.model, 'gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'claude-3-5-sonnet', 'gemini-1.5-pro', 'llama-3.3-70b'].filter(Boolean);

  const imageModelOptions = scannedImageModels.length > 0
    ? scannedImageModels
    : [settings.imageModel, 'dall-e-3', 'dall-e-2', 'recraft-v3', 'flux-1.1-pro'].filter(Boolean);

  const uniqueTextModels = Array.from(new Set(textModelOptions));
  const uniqueImageModels = Array.from(new Set(imageModelOptions));

  return `
    <div class="card">
      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary); margin-bottom: 0.5rem;">PENGATURAN API & SUPABASE</h2>
      <p style="font-size: 0.85rem; color: #991B1B; background: #FDF2F2; padding: 0.6rem 1rem; border-radius: 8px; border: 1px solid #F87171; margin-bottom: 1.5rem;">
        ⚠️ API Key disimpan lokal di browser (localStorage). Gunakan hanya untuk aplikasi pribadi.
      </p>

      <form id="settings-form">
        <h4 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 0.75rem;">1. AI Text Provider (OpenAI Standard Format)</h4>

        <div class="form-group">
          <label class="form-label">Text Endpoint URL</label>
          <input type="text" id="setting-endpoint" class="form-control" value="${settings.endpoint}" placeholder="https://api.openai.com/v1/chat/completions" />
        </div>

        <div class="form-group">
          <label class="form-label">Text API Key</label>
          <input type="password" id="setting-apiKey" class="form-control" value="${settings.apiKey}" placeholder="sk-..." />
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="form-label" style="margin-bottom: 0;">Pilih Model Text</label>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-scan-text-models">
              🔍 Pindai Model dari API
            </button>
          </div>
          <select id="setting-model" class="form-select">
            ${uniqueTextModels.map(m => `<option value="${m}" ${m === settings.model ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
        </div>

        <hr style="border:0; border-top: 1px solid var(--border); margin: 1.5rem 0;" />

        <h4 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 0.75rem;">2. AI Image Provider</h4>

        <div class="form-group">
          <label class="form-label">Image Endpoint URL</label>
          <input type="text" id="setting-imageEndpoint" class="form-control" value="${settings.imageEndpoint}" placeholder="https://api.openai.com/v1/images/generations" />
        </div>

        <div class="form-group">
          <label class="form-label">Image API Key (Kosongkan jika sama dengan Text API Key)</label>
          <input type="password" id="setting-imageApiKey" class="form-control" value="${settings.imageApiKey}" placeholder="sk-..." />
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label class="form-label" style="margin-bottom: 0;">Pilih Model Gambar</label>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-scan-image-models">
              🔍 Pindai Model Gambar dari API
            </button>
          </div>
          <select id="setting-imageModel" class="form-select">
            ${uniqueImageModels.map(m => `<option value="${m}" ${m === settings.imageModel ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
        </div>

        <hr style="border:0; border-top: 1px solid var(--border); margin: 1.5rem 0;" />

        <h4 style="font-family: var(--font-heading); color: var(--primary); margin-bottom: 0.75rem;">3. Supabase Cloud Database (Opsional)</h4>

        <div class="form-group">
          <label class="form-label">Supabase URL</label>
          <input type="text" id="setting-supabaseUrl" class="form-control" value="${settings.supabaseUrl || ''}" placeholder="https://xyzcompany.supabase.co" />
        </div>

        <div class="form-group">
          <label class="form-label">Supabase Anon Key</label>
          <input type="password" id="setting-supabaseAnonKey" class="form-control" value="${settings.supabaseAnonKey || ''}" placeholder="eyJhbG..." />
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
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-secondary btn-sm" id="btn-export-history-json">
          📤 Export JSON Backup
        </button>
        <label class="btn btn-outline btn-sm" style="cursor: pointer;">
          📥 Import JSON
          <input type="file" id="input-import-history-json" accept=".json" style="display: none;" />
        </label>
      </div>
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

/**
 * WRITING BRAIN VIEW
 */
export function renderWritingBrainView() {
  const categories = Object.keys(writingBrainData);

  return `
    <div class="card">
      <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary); margin-bottom: 0.5rem;">WRITING BRAIN</h2>
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
        Kumpulan aturan & prinsip gaya penulisan cerpen misteri metro-pop yang disuntikkan ke dalam AI Engine untuk menjamin kualitas tulisan.
      </p>

      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        ${categories.map(cat => `
          <div style="background: #FAFAFC; padding: 1rem 1.25rem; border-radius: 10px; border: 1px solid var(--border);">
            <h3 style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--primary); text-transform: uppercase; margin-bottom: 0.5rem;">
              ${cat.replace('_', ' ')}
            </h3>
            <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: var(--text-main);">
              ${(writingBrainData[cat] || []).map(item => `<li style="margin-bottom: 0.3rem;">${item}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
