/**
 * UI Components & Template Renderers — V3 Architecture
 */

/**
 * Header Navbar Component
 */
export function renderHeader({ activeView = 'home' }) {
  const isNavActive = (view) => (activeView === view ? 'active-nav' : '');

  return `
    <header class="app-header">
      <div class="header-container">
        <a class="brand" data-route="home">
          <div class="brand-icon">CM</div>
          <div>
            <div class="brand-title">CERITA METRO</div>
            <div class="brand-tagline">Realistic Metro-Pop Mystery</div>
          </div>
        </a>
        
        <nav class="nav-links">
          <button class="nav-item ${isNavActive('home')}" data-route="home" title="Story Generator">
            📖 <span class="nav-text">Story</span>
          </button>
          <button class="nav-item ${isNavActive('brain')}" data-route="brain" title="Writing Brain">
            🧠 <span class="nav-text">Brain</span>
          </button>
          <button class="nav-item ${isNavActive('research')}" data-route="research" title="AI Research Lab">
            🔍 <span class="nav-text">Research</span>
          </button>
          <button class="nav-item ${isNavActive('brainstorm')}" data-route="brainstorm" title="Brainstorm & Editor Partner">
            💬 <span class="nav-text">Brainstorm</span>
          </button>
          <button class="nav-item ${isNavActive('history')}" data-route="history" title="Riwayat Cerita">
            📜 <span class="nav-text">History</span>
          </button>
          <button class="nav-item ${isNavActive('backup')}" data-route="backup" title="Backup & Restore">
            📦 <span class="nav-text">Backup</span>
          </button>
          <button class="nav-item ${isNavActive('settings')}" data-route="settings" title="Pengaturan">
            ⚙️ <span class="nav-text">Settings</span>
          </button>
        </nav>
      </div>
    </header>
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
          <h3 style="font-family: var(--font-heading); color: var(--primary); font-size: 1.1rem; margin: 0;">
            PROSES SEDANG BERLANGSUNG
          </h3>
          <div class="loading-status" id="loading-status-text" style="font-size: 0.9rem; color: var(--text-main); margin-top: 0.25rem;">
            ${statusMessage}
          </div>
        </div>
      </div>

      ${totalSteps > 0 ? `
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${percent}%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted); margin-top:0.35rem; margin-bottom:1.25rem; font-weight: 500;">
          <span>Langkah ${currentStep} dari ${totalSteps}</span>
          <span>${percent}% Selesai</span>
        </div>
      ` : ''}

      ${stepList.length > 0 ? `
        <div class="step-checklist">
          ${stepList.map((step, idx) => {
            const stepNum = idx + 1;
            let icon = '⚪';
            let cls = 'step-pending';
            if (stepNum < currentStep) {
              icon = '✅';
              cls = 'step-done';
            } else if (stepNum === currentStep) {
              icon = '⏳';
              cls = 'step-active';
            }
            return `
              <div class="step-item ${cls}">
                <span class="step-icon">${icon}</span>
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
  const bg = type === 'error' ? '#FDF2F2' : (type === 'success' ? '#F0FDF4' : '#F0EAF2');
  const color = type === 'error' ? '#991B1B' : (type === 'success' ? '#166534' : '#6E5A78');
  const border = type === 'error' ? '#F87171' : (type === 'success' ? '#4ADE80' : '#A995B0');

  return `
    <div style="background:${bg}; color:${color}; border:1px solid ${border}; padding:0.85rem 1.25rem; border-radius:10px; font-size:0.9rem; margin-bottom:1.25rem; display:flex; align-items:center; justify-space-between;">
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
      <div class="proposal-badge">💡 PROPOSED WRITING BRAIN UPDATE</div>
      
      <h4 style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--primary); margin-top: 0.5rem; margin-bottom: 0.35rem;">
        ${proposal.title} <span class="tag" style="margin-left:0.5rem;">${proposal.category}</span>
      </h4>

      <p style="font-size: 0.92rem; color: var(--text-main); line-height: 1.5; background: #FFFFFF; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 0.5rem;">
        "${proposal.content}"
      </p>

      ${proposal.why ? `
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          <strong>Alasan:</strong> ${proposal.why}
        </div>
      ` : ''}

      ${dup ? `
        <div class="warning-box warning-duplicate">
          ⚠️ <strong>Kemungkinan Duplikat:</strong> Mirip dengan rule "${dup.matchEntry.content.slice(0, 60)}..."
        </div>
      ` : ''}

      ${conflict ? `
        <div class="warning-box warning-contradiction">
          ⚠️ <strong>Potensi Kontradiksi:</strong> Berlawanan dengan rule "${conflict.matchEntry.content.slice(0, 60)}..."
        </div>
      ` : ''}

      <div class="proposal-actions">
        <button class="btn btn-primary btn-sm btn-approve-proposal" data-proposal-id="${proposal.id}">
          ✅ Approve & Save
        </button>
        <button class="btn btn-secondary btn-sm btn-edit-proposal" data-proposal-id="${proposal.id}">
          ✏️ Edit
        </button>
        <button class="btn btn-outline btn-sm btn-discuss-proposal" data-proposal-id="${proposal.id}">
          💬 Discuss
        </button>
        <button class="btn btn-outline btn-sm btn-reject-proposal" data-proposal-id="${proposal.id}" style="color: #991B1B;">
          ❌ Reject
        </button>
      </div>
    </div>
  `;
}
