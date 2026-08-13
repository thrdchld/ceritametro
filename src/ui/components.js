/**
 * UI Components & Templates Renderer
 */

/**
 * Header Navbar Component
 */
export function renderHeader({ activeView = 'home' }) {
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
        <div class="nav-actions">
          <button class="btn-icon" data-route="brain" title="Writing Brain">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          </button>
          <button class="btn-icon" data-route="history" title="Riwayat Cerita">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </button>
          <button class="btn-icon" data-route="settings" title="Pengaturan">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
        </div>
      </div>
    </header>
  `;
}

/**
 * Loading Status Indicator
 */
export function renderLoading(statusMessage = 'Sedang memproses...') {
  return `
    <div class="card loading-overlay">
      <div class="spinner"></div>
      <div class="loading-status" id="loading-status-text">${statusMessage}</div>
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
    <div style="background:${bg}; color:${color}; border:1px solid ${border}; padding:0.85rem 1.25rem; border-radius:10px; font-size:0.9rem; margin-bottom:1.25rem; display:flex; align-items:center; justify-content:space-between;">
      <span>${message}</span>
    </div>
  `;
}
