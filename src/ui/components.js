/**
 * UI Components & Template Renderers — Bespoke Editorial Design
 * Uses precision monochrome SVG icons and elegant typography.
 */

import { Icons } from './icons.js';

/**
 * Sidebar Component (Responsive Drawer in Mobile, Fixed Panel in Desktop)
 */
export function renderSidebar({ activeView = 'home' }) {
  const isNavActive = (view) => (activeView === view ? 'active-nav' : '');

  return `
    <aside class="app-sidebar" id="app-sidebar">
      <div class="sidebar-header">
        <a class="brand" data-route="home">
          <div class="brand-icon">CM</div>
          <div class="brand-text-container">
            <div class="brand-title">CERITA METRO</div>
            <div class="brand-tagline">Editorial Mystery Studio</div>
          </div>
        </a>
        <button id="mobile-menu-close" class="btn-icon mobile-close-btn" aria-label="Tutup Menu">
          ${Icons.x(18)}
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-section-title">WORKSPACE</div>
          <button class="nav-item ${isNavActive('home')}" data-route="home">
            <span class="nav-icon">${Icons.pen(17)}</span>
            <span class="nav-text">Generator Studio</span>
          </button>
          <button class="nav-item ${isNavActive('history')}" data-route="history">
            <span class="nav-icon">${Icons.archive(17)}</span>
            <span class="nav-text">Arsip Cerita</span>
          </button>
        </div>
        
        <div class="nav-section">
          <div class="nav-section-title">KNOWLEDGE LAB</div>
          <button class="nav-item ${isNavActive('brain')}" data-route="brain">
            <span class="nav-icon">${Icons.brain(17)}</span>
            <span class="nav-text">Writing Brain</span>
          </button>
          <button class="nav-item ${isNavActive('research')}" data-route="research">
            <span class="nav-icon">${Icons.microscope(17)}</span>
            <span class="nav-text">AI Research Lab</span>
          </button>
          <button class="nav-item ${isNavActive('brainstorm')}" data-route="brainstorm">
            <span class="nav-icon">${Icons.chat(17)}</span>
            <span class="nav-text">Editor Partner</span>
          </button>
        </div>

        <div class="nav-section">
          <div class="nav-section-title">SYSTEM</div>
          <button class="nav-item ${isNavActive('backup')}" data-route="backup">
            <span class="nav-icon">${Icons.download(17)}</span>
            <span class="nav-text">Backup & Restore</span>
          </button>
          <button class="nav-item ${isNavActive('settings')}" data-route="settings">
            <span class="nav-icon">${Icons.settings(17)}</span>
            <span class="nav-text">Pengaturan API</span>
          </button>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <span style="font-family: monospace; font-size: 0.72rem; letter-spacing: 0.04em;">v4.2 • STUDIO</span>
        <button id="btn-sidebar-lock" class="btn-icon" style="width: 28px; height: 28px;" title="Kunci Aplikasi">
          ${Icons.lock(14)}
        </button>
      </div>
    </aside>
  `;
}

/**
 * Enhanced Visual Progress Status & Checklist Component
 */
export function renderLoading(statusMessage = 'Sedang memproses...', currentStep = 0, totalSteps = 0, stepList = []) {
  const percent = totalSteps > 0 ? Math.min(100, Math.round((currentStep / totalSteps) * 100)) : 0;

  return `
    <div class="card loading-progress-card">
      <div class="loading-header">
        <div class="spinner"></div>
        <div>
          <h3 style="font-family: var(--font-heading); color: var(--primary); font-size: 1.02rem; margin: 0; letter-spacing: -0.01em;">
            PROSES SEDANG BERLANGSUNG
          </h3>
          <div class="loading-status" id="loading-status-text" style="font-size: 0.84rem; color: var(--text-main); margin-top: 0.2rem;">
            ${statusMessage}
          </div>
        </div>
      </div>

      ${totalSteps > 0 ? `
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${percent}%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-top:0.35rem; margin-bottom:1rem; font-family: monospace;">
          <span>Langkah ${currentStep}/${totalSteps}</span>
          <span>${percent}% Selesai</span>
        </div>
      ` : ''}

      ${stepList.length > 0 ? `
        <div class="step-checklist">
          ${stepList.map((step, idx) => {
            const stepNum = idx + 1;
            let iconSvg = `<span style="opacity: 0.35; display: inline-flex;">${Icons.check(14)}</span>`;
            let cls = 'step-pending';
            if (stepNum < currentStep) {
              iconSvg = `<span style="color: var(--success); display: inline-flex;">${Icons.check(14)}</span>`;
              cls = 'step-done';
            } else if (stepNum === currentStep) {
              iconSvg = `<span style="color: var(--primary); display: inline-flex;">${Icons.activity(14)}</span>`;
              cls = 'step-active';
            }
            return `
              <div class="step-item ${cls}">
                <span class="step-icon">${iconSvg}</span>
                <span class="step-text">${step}</span>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Toast / Alert Message Component
 */
export function renderAlert(message, type = 'info') {
  const bg = type === 'error' ? 'var(--danger-bg)' : (type === 'success' ? 'var(--success-bg)' : 'var(--primary-light)');
  const color = type === 'error' ? 'var(--danger)' : (type === 'success' ? 'var(--success)' : 'var(--primary)');
  const border = type === 'error' ? 'var(--danger-border)' : (type === 'success' ? 'var(--success-border)' : 'var(--border)');

  return `
    <div style="background:${bg}; color:${color}; border:1px solid ${border}; padding:0.65rem 1rem; border-radius:var(--radius-sm); font-size:0.84rem; margin-bottom:0.85rem; display:flex; align-items:center; justify-content:space-between; box-shadow: var(--shadow-xs);">
      <span>${message}</span>
    </div>
  `;
}

/**
 * Proposed Knowledge Card Component (Approval Workflow)
 */
export function renderProposalCard(proposal) {
  const dup = proposal.duplicateWarning;
  const conflict = proposal.contradictionWarning;

  return `
    <div class="proposal-card" data-proposal-id="${proposal.id}">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
        <span class="proposal-badge">USULAN PENGETAHUAN</span>
        <span class="tag" style="margin: 0;">${proposal.category}</span>
      </div>
      
      <h4 style="font-family: var(--font-heading); font-size: 0.96rem; color: var(--text-main); margin-bottom: 0.35rem; font-weight: 700;">
        ${proposal.title}
      </h4>

      <p style="font-size: 0.86rem; color: var(--text-main); line-height: 1.5; background: var(--surface-muted); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 0.45rem;">
        "${proposal.content}"
      </p>

      ${proposal.why ? `
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.65rem;">
          <strong>Rasional:</strong> ${proposal.why}
        </div>
      ` : ''}

      ${dup ? `
        <div class="warning-box warning-duplicate">
          <strong>Kemungkinan Duplikat:</strong> Mirip dengan "${dup.matchEntry.content.slice(0, 60)}..."
        </div>
      ` : ''}

      ${conflict ? `
        <div class="warning-box warning-contradiction">
          <strong>Potensi Kontradiksi:</strong> Berlawanan dengan "${conflict.matchEntry.content.slice(0, 60)}..."
        </div>
      ` : ''}

      <div class="proposal-actions">
        <button class="btn btn-primary btn-sm btn-approve-proposal" data-proposal-id="${proposal.id}">
          ${Icons.check(14)} Setujui & Simpan
        </button>
        <button class="btn btn-secondary btn-sm btn-edit-proposal" data-proposal-id="${proposal.id}">
          ${Icons.pen(14)} Edit
        </button>
        <button class="btn btn-outline btn-sm btn-discuss-proposal" data-proposal-id="${proposal.id}">
          ${Icons.chat(14)} Diskusikan
        </button>
        <button class="btn btn-danger btn-sm btn-reject-proposal" data-proposal-id="${proposal.id}">
          ${Icons.trash(14)} Tolak
        </button>
      </div>
    </div>
  `;
}
